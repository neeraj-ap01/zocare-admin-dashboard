import { Router } from "express";
import { dashboardRoutes } from "./dashboardRoutes";
import { fieldRoutes } from "./fieldRoutes";
import { userRoutes } from "./userRoutes";
// Import other route modules as they're created

const router = Router();

// Health check endpoint (outside of versioned API)
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API v1 routes
router.use("/dashboard", dashboardRoutes);
router.use("/fields", fieldRoutes);
router.use("/users", userRoutes);

// TODO: Add other routes
// router.use("/forms", formRoutes);
// router.use("/groups", groupRoutes);
// router.use("/tags", tagRoutes);
// router.use("/views", viewRoutes);

export { router as apiRoutes };
