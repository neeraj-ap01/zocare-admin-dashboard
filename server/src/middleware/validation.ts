import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { createApiError } from "@shared/utils";
import { HTTP_STATUS, ERROR_CODES } from "@shared/constants";
import { logger } from "@/utils/logger";

/**
 * Generic validation middleware factory
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  source: "body" | "params" | "query" = "body",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      const result = schema.parse(data);

      // Attach validated data to request
      (req as any).validated = {
        ...(req as any).validated,
        [source]: result,
      };

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
          value: err.input,
        }));

        logger.warn("Validation error:", {
          source,
          errors: validationErrors,
          originalData: req[source],
        });

        const apiError = createApiError(
          "Validation failed",
          ERROR_CODES.VALIDATION_ERROR,
          validationErrors,
        );

        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: "error",
          message: apiError.message,
          code: apiError.code,
          details: apiError.details,
        });
      }

      logger.error("Unexpected validation error:", error);

      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error during validation",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  };
}

/**
 * Validate request body
 */
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return validate(schema, "body");
}

/**
 * Validate request params
 */
export function validateParams<T>(schema: z.ZodSchema<T>) {
  return validate(schema, "params");
}

/**
 * Validate request query
 */
export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return validate(schema, "query");
}

/**
 * Sanitize string inputs to prevent XSS
 */
export function sanitizeString(str: string): string {
  return str.replace(/[<>]/g, "").trim();
}

/**
 * Sanitize object with string values
 */
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeString(item) : item,
      );
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitization middleware
 */
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body && typeof req.body === "object") {
      req.body = sanitizeObject(req.body);
    }

    if (req.query && typeof req.query === "object") {
      req.query = sanitizeObject(req.query as Record<string, any>);
    }

    next();
  } catch (error) {
    logger.error("Sanitization error:", error);

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "error",
      message: "Invalid input data",
      code: ERROR_CODES.VALIDATION_ERROR,
    });
  }
}

/**
 * Custom validation functions
 */
export const customValidations = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate URL format
   */
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate hex color
   */
  isValidHexColor: (color: string): boolean => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    return hexColorRegex.test(color);
  },

  /**
   * Validate phone number (basic)
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  },

  /**
   * Validate strong password
   */
  isStrongPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  },

  /**
   * Validate file extension
   */
  isValidFileExtension: (
    filename: string,
    allowedExtensions: string[],
  ): boolean => {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension ? allowedExtensions.includes(extension) : false;
  },

  /**
   * Validate JSON string
   */
  isValidJson: (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Create conditional validation middleware
 */
export function conditionalValidation<T>(
  schema: z.ZodSchema<T>,
  condition: (req: Request) => boolean,
  source: "body" | "params" | "query" = "body",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (condition(req)) {
      return validate(schema, source)(req, res, next);
    }
    next();
  };
}

/**
 * Create async validation middleware for database checks
 */
export function asyncValidation<T>(
  schema: z.ZodSchema<T>,
  asyncChecks: Array<(data: T, req: Request) => Promise<string | null>>,
  source: "body" | "params" | "query" = "body",
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[source];
      const result = schema.parse(data);

      // Run async validation checks
      const errors: string[] = [];
      for (const check of asyncChecks) {
        const error = await check(result, req);
        if (error) {
          errors.push(error);
        }
      }

      if (errors.length > 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: "error",
          message: "Validation failed",
          code: ERROR_CODES.VALIDATION_ERROR,
          details: errors,
        });
      }

      // Attach validated data to request
      (req as any).validated = {
        ...(req as any).validated,
        [source]: result,
      };

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
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
        });
      }

      logger.error("Async validation error:", error);

      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Internal server error during validation",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  };
}
