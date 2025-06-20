import express from "express";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import { serverConfig, isDevelopment } from "@/config/env";
import { logger, logRequest } from "@/utils/logger";
import { apiRoutes } from "@/routes";
import {
  errorHandler,
  notFoundHandler,
  gracefulShutdown,
} from "@/middleware/errorHandler";
import {
  helmetConfig,
  rateLimiter,
  corsOptions,
  sanitizeRequest,
  requestId,
  requestTimeout,
  bodySizeLimit,
} from "@/middleware/security";
import { sanitizeInput } from "@/middleware/validation";
import { CacheService } from "@/services/cache";

// Create Express application
const app = express();

// Trust proxy if behind reverse proxy
app.set("trust proxy", 1);

// Security middleware
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(rateLimiter);
app.use(requestId);
app.use(requestTimeout(30000)); // 30 second timeout

// Body parsing middleware
app.use(express.json({ limit: bodySizeLimit }));
app.use(express.urlencoded({ extended: true, limit: bodySizeLimit }));

// Compression middleware
app.use(compression());

// Request sanitization
app.use(sanitizeRequest);
app.use(sanitizeInput);

// Logging middleware
if (isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => {
          logger.info(message.trim());
        },
      },
    }),
  );
}

// Custom request logging
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logRequest(req, res, duration);
  });

  next();
});

// API routes
app.use(serverConfig.apiPrefix, apiRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "ZoCare Dashboard BFF",
    version: "1.0.0",
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    docs: `${req.protocol}://${req.get("host")}${serverConfig.apiPrefix}/docs`,
  });
});

// Health check endpoint (outside of API prefix)
app.get("/health", (req, res) => {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cache: CacheService.getStats(),
  };

  res.json(health);
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(serverConfig.port, serverConfig.host, () => {
  logger.info(`🚀 ZoCare Dashboard BFF Server started`, {
    host: serverConfig.host,
    port: serverConfig.port,
    environment: process.env.NODE_ENV,
    apiPrefix: serverConfig.apiPrefix,
    corsOrigin: serverConfig.cors.origin,
  });

  // Warm up cache with initial data
  warmUpCache();
});

// Graceful shutdown
process.on("SIGTERM", gracefulShutdown(server));
process.on("SIGINT", gracefulShutdown(server));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

/**
 * Warm up cache with frequently accessed data
 */
async function warmUpCache() {
  try {
    logger.info("Warming up cache...");

    // Cache some initial data
    const warmUpData = {
      "system:startup": new Date().toISOString(),
      "system:version": "1.0.0",
    };

    CacheService.warmUp(warmUpData);

    logger.info("Cache warm-up completed");
  } catch (error) {
    logger.error("Cache warm-up failed:", error);
  }
}

export default app;
