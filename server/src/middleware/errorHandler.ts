import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { createApiError } from "../shared/utils";
import { HTTP_STATUS, ERROR_CODES } from "../shared/constants";
import { logger } from "@/utils/logger";
import { isDevelopment } from "@/config/env";

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // If response was already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(error);
  }

  // Log the error
  logger.error("Global error handler:", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationErrors = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
      code: err.code,
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "error",
      message: "Validation failed",
      code: ERROR_CODES.VALIDATION_ERROR,
      details: validationErrors,
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  // Handle known application errors
  if (error.code) {
    const statusCode = getStatusCodeForError(error.code);

    return res.status(statusCode).json({
      status: "error",
      message: error.message || "An error occurred",
      code: error.code,
      ...(error.details && { details: error.details }),
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  // Handle specific Node.js errors
  if (error.name === "CastError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "error",
      message: "Invalid ID format",
      code: ERROR_CODES.VALIDATION_ERROR,
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  if (error.name === "MongoError" && error.code === 11000) {
    return res.status(HTTP_STATUS.CONFLICT).json({
      status: "error",
      message: "Duplicate entry",
      code: ERROR_CODES.DUPLICATE_ENTRY,
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  // Handle JWT errors (when authentication is implemented)
  if (error.name === "JsonWebTokenError") {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: "error",
      message: "Invalid token",
      code: ERROR_CODES.UNAUTHORIZED,
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: "error",
      message: "Token expired",
      code: ERROR_CODES.UNAUTHORIZED,
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  // Handle rate limiting errors
  if (error.name === "TooManyRequestsError") {
    return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      status: "error",
      message: "Too many requests",
      code: "RATE_LIMIT_EXCEEDED",
      ...(isDevelopment && { stack: error.stack }),
    });
  }

  // Default internal server error
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: isDevelopment ? error.message : "Internal server error",
    code: ERROR_CODES.INTERNAL_ERROR,
    ...(isDevelopment && { stack: error.stack }),
  });
}

/**
 * Map error codes to HTTP status codes
 */
function getStatusCodeForError(errorCode: string): number {
  const codeMap: Record<string, number> = {
    [ERROR_CODES.VALIDATION_ERROR]: HTTP_STATUS.BAD_REQUEST,
    [ERROR_CODES.NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
    [ERROR_CODES.DUPLICATE_ENTRY]: HTTP_STATUS.CONFLICT,
    [ERROR_CODES.UNAUTHORIZED]: HTTP_STATUS.UNAUTHORIZED,
    [ERROR_CODES.FORBIDDEN]: HTTP_STATUS.FORBIDDEN,
    [ERROR_CODES.SERVICE_UNAVAILABLE]: HTTP_STATUS.SERVICE_UNAVAILABLE,
  };

  return codeMap[errorCode] || HTTP_STATUS.INTERNAL_SERVER_ERROR;
}

/**
 * 404 handler for unmatched routes
 */
export function notFoundHandler(req: Request, res: Response) {
  logger.warn("Route not found:", {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.status(HTTP_STATUS.NOT_FOUND).json({
    status: "error",
    message: `Route ${req.method} ${req.url} not found`,
    code: ERROR_CODES.NOT_FOUND,
  });
}

/**
 * Graceful shutdown handler
 */
export function gracefulShutdown(server: any) {
  return (signal: string) => {
    logger.info(`Received ${signal}, starting graceful shutdown...`);

    server.close((error: any) => {
      if (error) {
        logger.error("Error during graceful shutdown:", error);
        process.exit(1);
      }

      logger.info("Server closed successfully");
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };
}
