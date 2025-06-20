import NodeCache from "node-cache";
import { serverConfig } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { CACHE_KEYS, CACHE_TTL } from "../../shared/constants";

// Initialize cache instance
const cache = new NodeCache({
  stdTTL: serverConfig.cache.ttl,
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false,
});

export class CacheService {
  /**
   * Get value from cache
   */
  static get<T>(key: string): T | undefined {
    try {
      const value = cache.get<T>(key);
      if (value !== undefined) {
        logger.debug(`Cache hit for key: ${key}`);
      } else {
        logger.debug(`Cache miss for key: ${key}`);
      }
      return value;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return undefined;
    }
  }

  /**
   * Set value in cache
   */
  static set<T>(key: string, value: T, ttl?: number): boolean {
    try {
      const success = cache.set(key, value, ttl || serverConfig.cache.ttl);
      if (success) {
        logger.debug(
          `Cache set for key: ${key}, TTL: ${ttl || serverConfig.cache.ttl}s`,
        );
      }
      return success;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  static delete(key: string): number {
    try {
      const deletedCount = cache.del(key);
      logger.debug(`Cache delete for key: ${key}, deleted: ${deletedCount}`);
      return deletedCount;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Check if key exists in cache
   */
  static has(key: string): boolean {
    try {
      return cache.has(key);
    } catch (error) {
      logger.error(`Cache has error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    try {
      cache.flushAll();
      logger.info("Cache cleared");
    } catch (error) {
      logger.error("Cache clear error:", error);
    }
  }

  /**
   * Get cache statistics
   */
  static getStats() {
    return cache.getStats();
  }

  /**
   * Get or set pattern - retrieve from cache or execute function and cache result
   */
  static async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    try {
      const value = await factory();
      this.set(key, value, ttl);
      return value;
    } catch (error) {
      logger.error(`Cache getOrSet error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Invalidate cache by pattern
   */
  static invalidatePattern(pattern: string): number {
    try {
      const keys = cache.keys().filter((key) => key.includes(pattern));
      const deletedCount = cache.del(keys);
      logger.debug(
        `Cache pattern invalidation for ${pattern}, deleted: ${deletedCount}`,
      );
      return deletedCount;
    } catch (error) {
      logger.error(`Cache pattern invalidation error for ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Set cache with specific TTL configurations
   */
  static setWithTTL<T>(
    key: string,
    value: T,
    ttlType: keyof typeof CACHE_TTL,
  ): boolean {
    return this.set(key, value, CACHE_TTL[ttlType]);
  }

  /**
   * Warm up cache with initial data
   */
  static warmUp(data: Record<string, any>): void {
    try {
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value);
      });
      logger.info(`Cache warmed up with ${Object.keys(data).length} entries`);
    } catch (error) {
      logger.error("Cache warm up error:", error);
    }
  }
}

// Event listeners for cache events
cache.on("set", (key, value) => {
  logger.debug(`Cache event: SET ${key}`);
});

cache.on("del", (key, value) => {
  logger.debug(`Cache event: DEL ${key}`);
});

cache.on("expired", (key, value) => {
  logger.debug(`Cache event: EXPIRED ${key}`);
});

cache.on("flush", () => {
  logger.debug("Cache event: FLUSH");
});

export default CacheService;
