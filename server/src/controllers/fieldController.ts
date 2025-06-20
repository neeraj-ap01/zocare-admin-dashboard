import { Request, Response } from "express";
import { FieldRepository } from "@/repositories/fieldRepository";
import { DashboardRepository } from "@/repositories/dashboardRepository";
import { CacheService } from "@/services/cache";
import { createApiResponse, createApiError } from "../shared/utils";
import {
  HTTP_STATUS,
  ERROR_CODES,
  CACHE_KEYS,
  CACHE_TTL,
} from "../shared/constants";
import { logger, logWithContext } from "@/utils/logger";
import {
  CreateFieldRequest,
  UpdateFieldRequest,
  PaginationRequest,
  IdParamRequest,
} from "@/validation/schemas";

export class FieldController {
  /**
   * Get all fields with pagination and search
   */
  static async getAll(req: Request, res: Response) {
    try {
      const query = (req as any).validated.query as PaginationRequest;

      // Try to get from cache first
      const cacheKey = `${CACHE_KEYS.FIELDS}:${JSON.stringify(query)}`;
      const cached = CacheService.get(cacheKey);

      if (cached) {
        logWithContext("info", "Fields retrieved from cache", { query });
        return res.json(createApiResponse(cached));
      }

      const result = await FieldRepository.findAll(query);

      // Cache the result
      CacheService.setWithTTL(cacheKey, result, "MEDIUM");

      logWithContext("info", "Fields retrieved successfully", {
        count: result.data.length,
        total: result.pagination.total,
      });

      res.json(createApiResponse(result));
    } catch (error) {
      logger.error("Error fetching fields:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch fields",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get field by ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const { id } = (req as any).validated.params as IdParamRequest;

      // Try cache first
      const cacheKey = `${CACHE_KEYS.FIELDS}:${id}`;
      const cached = CacheService.get(cacheKey);

      if (cached) {
        return res.json(createApiResponse(cached));
      }

      const field = await FieldRepository.findById(id);

      if (!field) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: "error",
          message: "Field not found",
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      // Cache the field
      CacheService.setWithTTL(cacheKey, field, "LONG");

      logWithContext("info", "Field retrieved by ID", { fieldId: id });

      res.json(createApiResponse(field));
    } catch (error) {
      logger.error("Error fetching field by ID:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch field",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create new field
   */
  static async create(req: Request, res: Response) {
    try {
      const data = (req as any).validated.body as CreateFieldRequest;

      // Check if field name already exists
      const existingField = await FieldRepository.findByName(data.name);
      if (existingField) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          status: "error",
          message: `Field with name '${data.name}' already exists`,
          code: ERROR_CODES.DUPLICATE_ENTRY,
        });
      }

      const newField = await FieldRepository.create(data);

      // Invalidate related caches
      CacheService.invalidatePattern(CACHE_KEYS.FIELDS);

      // Add activity log
      await DashboardRepository.addActivity({
        action: "Field created",
        description: `Field '${newField.label}' was created`,
        time: new Date().toISOString(),
        type: "field",
        userId: "1", // TODO: Get from auth context
      });

      logWithContext("info", "Field created successfully", {
        fieldId: newField.id,
        name: newField.name,
      });

      res.status(HTTP_STATUS.CREATED).json(createApiResponse(newField));
    } catch (error) {
      logger.error("Error creating field:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to create field",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update field
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = (req as any).validated.params as IdParamRequest;
      const data = (req as any).validated.body as UpdateFieldRequest;

      // Check if field exists
      const existingField = await FieldRepository.findById(id);
      if (!existingField) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: "error",
          message: "Field not found",
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      // Check name uniqueness if name is being updated
      if (data.name && data.name !== existingField.name) {
        const fieldWithName = await FieldRepository.findByName(data.name);
        if (fieldWithName) {
          return res.status(HTTP_STATUS.CONFLICT).json({
            status: "error",
            message: `Field with name '${data.name}' already exists`,
            code: ERROR_CODES.DUPLICATE_ENTRY,
          });
        }
      }

      const updatedField = await FieldRepository.update(id, data);

      // Invalidate related caches
      CacheService.invalidatePattern(CACHE_KEYS.FIELDS);
      CacheService.delete(`${CACHE_KEYS.FIELDS}:${id}`);

      // Add activity log
      await DashboardRepository.addActivity({
        action: "Field updated",
        description: `Field '${updatedField?.label}' was modified`,
        time: new Date().toISOString(),
        type: "field",
        userId: "1", // TODO: Get from auth context
      });

      logWithContext("info", "Field updated successfully", {
        fieldId: id,
        changes: Object.keys(data),
      });

      res.json(createApiResponse(updatedField));
    } catch (error) {
      logger.error("Error updating field:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to update field",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete field
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = (req as any).validated.params as IdParamRequest;

      // Check if field exists
      const existingField = await FieldRepository.findById(id);
      if (!existingField) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: "error",
          message: "Field not found",
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      const deleted = await FieldRepository.delete(id);

      if (!deleted) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Failed to delete field",
          code: ERROR_CODES.INTERNAL_ERROR,
        });
      }

      // Invalidate related caches
      CacheService.invalidatePattern(CACHE_KEYS.FIELDS);
      CacheService.delete(`${CACHE_KEYS.FIELDS}:${id}`);

      // Add activity log
      await DashboardRepository.addActivity({
        action: "Field deleted",
        description: `Field '${existingField.label}' was deleted`,
        time: new Date().toISOString(),
        type: "field",
        userId: "1", // TODO: Get from auth context
      });

      logWithContext("info", "Field deleted successfully", { fieldId: id });

      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      logger.error("Error deleting field:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to delete field",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get field statistics
   */
  static async getStats(req: Request, res: Response) {
    try {
      const cacheKey = `${CACHE_KEYS.FIELDS}:stats`;
      const cached = CacheService.get(cacheKey);

      if (cached) {
        return res.json(createApiResponse(cached));
      }

      const stats = await FieldRepository.getStats();

      // Cache stats for shorter time as they change frequently
      CacheService.setWithTTL(cacheKey, stats, "SHORT");

      logWithContext("info", "Field statistics retrieved");

      res.json(createApiResponse(stats));
    } catch (error) {
      logger.error("Error fetching field statistics:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch field statistics",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Toggle field active status
   */
  static async toggleActive(req: Request, res: Response) {
    try {
      const { id } = (req as any).validated.params as IdParamRequest;

      const field = await FieldRepository.toggleActive(id);

      if (!field) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: "error",
          message: "Field not found",
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      // Invalidate related caches
      CacheService.invalidatePattern(CACHE_KEYS.FIELDS);
      CacheService.delete(`${CACHE_KEYS.FIELDS}:${id}`);

      // Add activity log
      await DashboardRepository.addActivity({
        action: `Field ${field.isActive ? "activated" : "deactivated"}`,
        description: `Field '${field.label}' was ${field.isActive ? "activated" : "deactivated"}`,
        time: new Date().toISOString(),
        type: "field",
        userId: "1", // TODO: Get from auth context
      });

      logWithContext("info", "Field status toggled", {
        fieldId: id,
        isActive: field.isActive,
      });

      res.json(createApiResponse(field));
    } catch (error) {
      logger.error("Error toggling field status:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to toggle field status",
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  }
}
