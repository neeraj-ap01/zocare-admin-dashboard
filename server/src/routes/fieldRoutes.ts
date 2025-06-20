import { Router } from "express";
import { FieldController } from "@/controllers/fieldController";
import { asyncHandler } from "@/middleware/asyncHandler";
import {
  validateQuery,
  validateParams,
  validateBody,
} from "@/middleware/validation";
import {
  paginationSchema,
  idParamSchema,
  createFieldSchema,
  updateFieldSchema,
} from "@/validation/schemas";

const router = Router();

/**
 * @route GET /api/v1/fields
 * @desc Get all fields with pagination and search
 * @access Public (TODO: Add authentication)
 */
router.get(
  "/",
  validateQuery(paginationSchema),
  asyncHandler(FieldController.getAll),
);

/**
 * @route GET /api/v1/fields/stats
 * @desc Get field statistics
 * @access Public (TODO: Add authentication)
 */
router.get("/stats", asyncHandler(FieldController.getStats));

/**
 * @route GET /api/v1/fields/:id
 * @desc Get field by ID
 * @access Public (TODO: Add authentication)
 */
router.get(
  "/:id",
  validateParams(idParamSchema),
  asyncHandler(FieldController.getById),
);

/**
 * @route POST /api/v1/fields
 * @desc Create new field
 * @access Admin/Manager (TODO: Add role-based authentication)
 */
router.post(
  "/",
  validateBody(createFieldSchema),
  asyncHandler(FieldController.create),
);

/**
 * @route PUT /api/v1/fields/:id
 * @desc Update field
 * @access Admin/Manager (TODO: Add role-based authentication)
 */
router.put(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateFieldSchema),
  asyncHandler(FieldController.update),
);

/**
 * @route PATCH /api/v1/fields/:id/toggle-active
 * @desc Toggle field active status
 * @access Admin/Manager (TODO: Add role-based authentication)
 */
router.patch(
  "/:id/toggle-active",
  validateParams(idParamSchema),
  asyncHandler(FieldController.toggleActive),
);

/**
 * @route DELETE /api/v1/fields/:id
 * @desc Delete field
 * @access Admin only (TODO: Add admin authentication)
 */
router.delete(
  "/:id",
  validateParams(idParamSchema),
  asyncHandler(FieldController.delete),
);

export { router as fieldRoutes };
