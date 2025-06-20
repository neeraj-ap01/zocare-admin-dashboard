import { Router } from "express";
import { asyncHandler } from "@/middleware/asyncHandler";

const router = Router();

// Placeholder for user routes - will be implemented when UserController is created
router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({
      status: "success",
      message: "User routes not yet implemented",
      data: [],
    });
  }),
);

export { router as userRoutes };
