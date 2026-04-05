import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { setupMiddleware } from "./middleware";
import { setupAuth } from "./auth";
import { logger, httpLogger } from "./logger";
import { connectToDatabase, closeDatabase } from "./db";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

setupMiddleware(app);

app.use(httpLogger);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

(async () => {
  try {
    await connectToDatabase();
    logger.info("Database connected successfully");
  } catch (err) {
    logger.error({ err }, "Failed to connect to database");
    process.exit(1);
  }

  setupAuth(app);

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    logger.error({
      err,
      status,
      path: _req.path,
      method: _req.method,
    }, message);

    const response: any = { message };
    if (process.env.NODE_ENV !== "production") {
      response.stack = err.stack;
    }

    res.status(status).json(response);
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "3000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      logger.info(`serving on port ${port}`);
    },
  );

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully...`);

    httpServer.close(async () => {
      await closeDatabase();
      logger.info("Database connection closed");
      logger.info("HTTP server closed");
      process.exit(0);
    });

    setTimeout(() => {
      logger.fatal("Forcing shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
})();