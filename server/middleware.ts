import { type Express } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";

export function setupMiddleware(app: Express) {
    // Security headers
    app.use(
        helmet({
            contentSecurityPolicy: process.env.NODE_ENV === "production" ? {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:", "https://*.clerk.accounts.dev", "https://clerk.com", "https://*.clerk.com"],
                    workerSrc: ["'self'", "blob:"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                    fontSrc: ["'self'", "https://fonts.gstatic.com"],
                    imgSrc: ["'self'", "data:", "https:", "blob:", "https://img.clerk.com", "https://*.clerk.com"],
                    frameSrc: ["'self'", "https://www.google.com", "https://*.clerk.accounts.dev"],
                    connectSrc: ["'self'", "ws:", "wss:", "*", "https://*.clerk.accounts.dev", "https://*.clerk.com"],
                },
            } : false,
            crossOriginEmbedderPolicy: false,
        })
    );

    // CORS configuration
    const corsOptions = {
        origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
        credentials: true,
        optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));

    // Compression
    app.use(compression());

    // Rate limiting for API routes
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: "Too many requests from this IP, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    });

    // Stricter rate limiting for sensitive endpoints
    const strictLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // Limit each IP to 10 requests per windowMs
        message: "Too many requests, please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    });

    // Apply rate limiting to API routes
    app.use("/api/", apiLimiter);
    app.use("/api/reservations", strictLimiter);
    app.use("/api/newsletter", strictLimiter);
}
