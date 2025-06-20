import { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";

/**
 * Async error handler wrapper for Express route handlers
 * Automatically catches async errors and passes them to Express error handler
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      logger.error("Async handler error:", {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });

      next(error);
    });
  };
}
