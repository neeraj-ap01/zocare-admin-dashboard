import { Router } from "express";
import { DashboardController } from "@/controllers/dashboardController";
import { asyncHandler } from "@/middleware/asyncHandler";

const router = Router();

/**
 * @route GET /api/v1/dashboard/stats
 * @desc Get dashboard statistics
 * @access Public (TODO: Add authentication)
 */
router.get("/stats", asyncHandler(DashboardController.getStats));

/**
 * @route GET /api/v1/dashboard/activity
 * @desc Get recent activity
 * @access Public (TODO: Add authentication)
 */
router.get("/activity", asyncHandler(DashboardController.getRecentActivity));

/**
 * @route GET /api/v1/dashboard/analytics
 * @desc Get analytics data
 * @access Public (TODO: Add authentication)
 */
router.get("/analytics", asyncHandler(DashboardController.getAnalytics));

/**
 * @route GET /api/v1/dashboard/quick-actions
 * @desc Get quick actions
 * @access Public (TODO: Add authentication)
 */
router.get("/quick-actions", asyncHandler(DashboardController.getQuickActions));

/**
 * @route GET /api/v1/dashboard/notifications
 * @desc Get system notifications
 * @access Public (TODO: Add authentication)
 */
router.get(
  "/notifications",
  asyncHandler(DashboardController.getNotifications),
);

/**
 * @route GET /api/v1/dashboard/overview
 * @desc Get complete dashboard overview
 * @access Public (TODO: Add authentication)
 */
router.get("/overview", asyncHandler(DashboardController.getOverview));

/**
 * @route DELETE /api/v1/dashboard/cache
 * @desc Clear dashboard caches
 * @access Admin only (TODO: Add admin authentication)
 */
router.delete("/cache", asyncHandler(DashboardController.clearCache));

export { router as dashboardRoutes };
