import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { serverConfig } from "@/config/env";
import { logger } from "@/utils/logger";

/**
 * Configure helmet for security headers
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Rate limiting configuration
 */
export const rateLimiter = rateLimit({
  windowMs: serverConfig.rateLimit.windowMs,
  max: serverConfig.rateLimit.max,
  message: {
    status: "error",
    message: "Too many requests, please try again later",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Rate limit exceeded:", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
    });

    res.status(429).json({
      status: "error",
      message: "Too many requests, please try again later",
      code: "RATE_LIMIT_EXCEEDED",
    });
  },
});

/**
 * Stricter rate limiting for sensitive endpoints
 */
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    status: "error",
    message: "Too many attempts, please try again later",
    code: "RATE_LIMIT_EXCEEDED",
  },
});

/**
 * CORS options with dynamic origin validation
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is allowed
    const allowedOrigins = [
      serverConfig.cors.origin,
      "http://localhost:3000",
      "http://localhost:8080",
      "http://127.0.0.1:8080",
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn("CORS blocked request from origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: serverConfig.cors.credentials,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-API-Key",
  ],
  exposedHeaders: ["X-Total-Count", "X-Page-Count"],
};

/**
 * Request sanitization middleware
 */
export const sanitizeRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Remove any potentially dangerous characters from query strings
  for (const key in req.query) {
    if (typeof req.query[key] === "string") {
      req.query[key] = (req.query[key] as string).replace(/[<>]/g, "").trim();
    }
  }

  // Log suspicious requests
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
  ];

  const requestString = JSON.stringify({
    url: req.url,
    body: req.body,
    query: req.query,
  });

  if (suspiciousPatterns.some((pattern) => pattern.test(requestString))) {
    logger.warn("Suspicious request detected:", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
      body: req.body,
      query: req.query,
    });
  }

  next();
};

/**
 * Request ID middleware
 */
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.headers["x-request-id"] || generateRequestId();
  req.id = id as string;
  res.setHeader("X-Request-ID", id);
  next();
};

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Request timeout middleware
 */
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        logger.warn("Request timeout:", {
          url: req.url,
          method: req.method,
          ip: req.ip,
          timeout: timeoutMs,
        });

        res.status(408).json({
          status: "error",
          message: "Request timeout",
          code: "REQUEST_TIMEOUT",
        });
      }
    }, timeoutMs);

    res.on("finish", () => {
      clearTimeout(timeout);
    });

    res.on("close", () => {
      clearTimeout(timeout);
    });

    next();
  };
};

/**
 * API key validation middleware (placeholder for future use)
 */
export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    logger.warn("Missing API key:", {
      ip: req.ip,
      url: req.url,
    });

    return res.status(401).json({
      status: "error",
      message: "API key required",
      code: "UNAUTHORIZED",
    });
  }

  // TODO: Implement actual API key validation
  // For now, accept any API key
  next();
};

/**
 * Body size limit middleware
 */
export const bodySizeLimit = "10mb";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}
