import winston from "winston";
import { serverConfig, isDevelopment } from "../config/env.js";

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Create logger instance
export const logger = winston.createLogger({
  level: serverConfig.logging.level,
  format: logFormat,
  transports: [
    // Write all logs to console in development
    ...(isDevelopment
      ? [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
            ),
          }),
        ]
      : []),

    // Write all logs to file
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: serverConfig.logging.file,
    }),
  ],
});

// Create request logger middleware
export const requestLogger = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${
      meta ? JSON.stringify(meta) : ""
    }`;
  }),
);

// Helper functions for structured logging
export const logWithContext = (
  level: string,
  message: string,
  context: Record<string, any> = {},
) => {
  logger.log(level, message, context);
};

export const logError = (error: Error, context: Record<string, any> = {}) => {
  logger.error(error.message, {
    ...context,
    stack: error.stack,
    name: error.name,
  });
};

export const logRequest = (req: any, res: any, responseTime: number) => {
  logger.info("HTTP Request", {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
  });
};
