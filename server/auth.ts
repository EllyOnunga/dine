import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) return false;
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
}

interface UserWithoutPassword {
    _id: string;
    username: string;
    isAdmin: boolean;
    loyaltyPoints: number;
    createdAt?: Date;
}

function stripPassword(user: any): UserWithoutPassword {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "savor_secret_key",
        resave: false,
        saveUninitialized: false,
        store: storage.sessionStore,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        },
    };

    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
    }

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const user = await storage.getUserByUsername(username);
                if (!user) {
                    return done(null, false);
                }
                const isValid = await comparePasswords(password, user.password);
                if (!isValid) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }),
    );

    passport.serializeUser((user: any, done) => done(null, user._id.toString()));
    
    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    app.post("/api/login", (req, res, next) => {
        passport.authenticate("local", (err: any, user: any, info: any) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ message: info?.message || "Invalid credentials" });
            }
            req.logIn(user, (err) => {
                if (err) return next(err);
                res.json(stripPassword(user));
            });
        })(req, res, next);
    });

    app.post("/api/register", async (req, res, next) => {
        try {
            const data = insertUserSchema.parse(req.body);
            const existingUser = await storage.getUserByUsername(data.username);

            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }

            const hashedPassword = await hashPassword(data.password);
            const user = await storage.createUser({
                ...data,
                password: hashedPassword,
            });

            req.login(user, (err) => {
                if (err) return next(err);
                res.status(201).json(stripPassword(user));
            });
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({ message: err.issues });
            }
            next(err);
        }
    });

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(stripPassword(req.user));
    });
}