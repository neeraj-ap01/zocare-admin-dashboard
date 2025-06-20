import { config } from "dotenv";
import { z } from "zod";

// Load environment variables
config();

// Environment schema validation
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("3001"),
  HOST: z.string().default("localhost"),
  CORS_ORIGIN: z.string().default("http://localhost:8080"),
  API_PREFIX: z.string().default("/api/v1"),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default("100"),
  CACHE_TTL_SECONDS: z.string().transform(Number).default("300"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  LOG_FILE: z.string().default("logs/server.log"),
});

// Validate and export environment variables
export const env = envSchema.parse(process.env);

// Environment helpers
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

// Server configuration
export const serverConfig = {
  port: env.PORT,
  host: env.HOST,
  apiPrefix: env.API_PREFIX,
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
  },
  cache: {
    ttl: env.CACHE_TTL_SECONDS,
  },
  logging: {
    level: env.LOG_LEVEL,
    file: env.LOG_FILE,
  },
} as const;
