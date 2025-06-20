import { Request, Response } from "express";
import { DashboardRepository } from "@/repositories/dashboardRepository";
import { CacheService } from "@/services/cache";
import { createApiResponse } from "../../shared/utils";
import { HTTP_STATUS, ERROR_CODES, CACHE_KEYS } from "../../shared/constants";
import { logger, logWithContext } from "@/utils/logger";

export class DashboardController {
  /**
   * Get dashboard statistics
   */
  static async getStats(req: Request, res: Response) {
    try {
      const cacheKey = CACHE_KEYS.DASHBOARD_STATS;
      const cached = CacheService.get(cacheKey);

      if (cached) {
        logWithContext("info", "Dashboard stats retrieved from cache");
        return res.json(createApiResponse(cached));
      }

      const stats = await DashboardRepository.getStats();

      // Cache stats for a short time since they update frequently
      CacheService.setWithTTL(cacheKey, stats, "SHORT");

      logWithContext("info", "Dashboard stats retrieved successfully", stats);

      res.json(createApiResponse(stats));
    } catch (error) {
      logger.error("Error fetching dashboard statistics:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch dashboard statistics",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get recent activity
   */
  static async getRecentActivity(req: Request, res: Response) {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

      const cacheKey = `${CACHE_KEYS.RECENT_ACTIVITY}:${limit}`;
      const cached = CacheService.get(cacheKey);

      if (cached) {
        logWithContext("info", "Recent activity retrieved from cache", {
          limit,
        });
        return res.json(createApiResponse(cached));
      }

      const activities = await DashboardRepository.getRecentActivity(limit);

      // Cache for a short time since activities are frequently updated
      CacheService.setWithTTL(cacheKey, activities, "SHORT");

      logWithContext("info", "Recent activity retrieved successfully", {
        count: activities.length,
        limit,
      });

      res.json(createApiResponse(activities));
    } catch (error) {
      logger.error("Error fetching recent activity:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch recent activity",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get analytics data
   */
  static async getAnalytics(req: Request, res: Response) {
    try {
      const cacheKey = "dashboard:analytics";
      const cached = CacheService.get(cacheKey);

      if (cached) {
        logWithContext("info", "Analytics data retrieved from cache");
        return res.json(createApiResponse(cached));
      }

      const analytics = await DashboardRepository.getAnalytics();

      // Cache analytics for medium time since they don't change frequently
      CacheService.setWithTTL(cacheKey, analytics, "MEDIUM");

      logWithContext("info", "Analytics data retrieved successfully");

      res.json(createApiResponse(analytics));
    } catch (error) {
      logger.error("Error fetching analytics data:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch analytics data",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get quick actions
   */
  static async getQuickActions(req: Request, res: Response) {
    try {
      const cacheKey = "dashboard:quick-actions";
      const cached = CacheService.get(cacheKey);

      if (cached) {
        return res.json(createApiResponse(cached));
      }

      const actions = await DashboardRepository.getQuickActions();

      // Cache quick actions for longer time as they rarely change
      CacheService.setWithTTL(cacheKey, actions, "LONG");

      logWithContext("info", "Quick actions retrieved successfully", {
        count: actions.length,
      });

      res.json(createApiResponse(actions));
    } catch (error) {
      logger.error("Error fetching quick actions:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch quick actions",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get system notifications
   */
  static async getNotifications(req: Request, res: Response) {
    try {
      const cacheKey = "dashboard:notifications";
      const cached = CacheService.get(cacheKey);

      if (cached) {
        return res.json(createApiResponse(cached));
      }

      const notifications = await DashboardRepository.getNotifications();

      // Cache notifications for short time as they update frequently
      CacheService.setWithTTL(cacheKey, notifications, "SHORT");

      logWithContext("info", "Notifications retrieved successfully", {
        count: notifications.length,
        unread: notifications.filter((n) => !n.isRead).length,
      });

      res.json(createApiResponse(notifications));
    } catch (error) {
      logger.error("Error fetching notifications:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch notifications",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Health check endpoint
   */
  static async getHealth(req: Request, res: Response) {
    try {
      const includeDetails = req.query.details === "true";

      const health = await DashboardRepository.getHealth();

      if (includeDetails) {
        // Add cache stats if details requested
        const cacheStats = CacheService.getStats();
        health.details = {
          cache: cacheStats,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          nodeVersion: process.version,
        };
      }

      // Don't cache health check as it should be real-time
      logWithContext("info", "Health check performed", {
        status: health.status,
        includeDetails,
      });

      res.json(createApiResponse(health));
    } catch (error) {
      logger.error("Error during health check:", error);

      res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        status: "error",
        message: "Service unhealthy",
        code: ERROR_CODES.SERVICE_UNAVAILABLE,
      });
    }
  }

  /**
   * Clear dashboard caches
   */
  static async clearCache(req: Request, res: Response) {
    try {
      // Clear dashboard-related caches
      CacheService.invalidatePattern("dashboard");
      CacheService.delete(CACHE_KEYS.DASHBOARD_STATS);
      CacheService.invalidatePattern(CACHE_KEYS.RECENT_ACTIVITY);

      logWithContext("info", "Dashboard caches cleared");

      res.json(
        createApiResponse(
          { message: "Dashboard caches cleared successfully" },
          "Caches cleared",
        ),
      );
    } catch (error) {
      logger.error("Error clearing dashboard caches:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to clear caches",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get system overview
   */
  static async getOverview(req: Request, res: Response) {
    try {
      const cacheKey = "dashboard:overview";
      const cached = CacheService.get(cacheKey);

      if (cached) {
        return res.json(createApiResponse(cached));
      }

      // Combine stats, recent activity, and health
      const [stats, recentActivity, health, quickActions] = await Promise.all([
        DashboardRepository.getStats(),
        DashboardRepository.getRecentActivity(5),
        DashboardRepository.getHealth(),
        DashboardRepository.getQuickActions(),
      ]);

      const overview = {
        stats,
        recentActivity,
        health,
        quickActions,
        timestamp: new Date().toISOString(),
      };

      // Cache overview for short time
      CacheService.setWithTTL(cacheKey, overview, "SHORT");

      logWithContext("info", "Dashboard overview retrieved successfully");

      res.json(createApiResponse(overview));
    } catch (error) {
      logger.error("Error fetching dashboard overview:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch dashboard overview",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }
}
