import { z } from "zod";
import { FIELD_TYPES, USER_ROLES, FILTER_OPERATORS } from "@shared/constants";

// Common schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

// Field schemas
export const fieldOptionSchema = z.object({
  id: z.string(),
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(100),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
});

export const fieldValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  message: z.string().optional(),
});

export const createFieldSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z][a-z0-9_]*$/, "Name must be lowercase with underscores"),
  label: z.string().min(1).max(100),
  type: z.enum([
    FIELD_TYPES.TEXT,
    FIELD_TYPES.TEXTAREA,
    FIELD_TYPES.NUMBER,
    FIELD_TYPES.EMAIL,
    FIELD_TYPES.PHONE,
    FIELD_TYPES.DATE,
    FIELD_TYPES.DATETIME,
    FIELD_TYPES.SELECT,
    FIELD_TYPES.MULTISELECT,
    FIELD_TYPES.CHECKBOX,
    FIELD_TYPES.RADIO,
    FIELD_TYPES.FILE,
    FIELD_TYPES.URL,
  ] as const),
  description: z.string().max(500).optional(),
  required: z.boolean().default(false),
  options: z.array(fieldOptionSchema).optional(),
  validation: fieldValidationSchema.optional(),
  placeholder: z.string().max(200).optional(),
  defaultValue: z.any().optional(),
});

export const updateFieldSchema = createFieldSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Form schemas
export const createFormSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  divisionId: z.string().min(1),
});

export const updateFormSchema = createFormSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: z.enum([
    USER_ROLES.ADMIN,
    USER_ROLES.MANAGER,
    USER_ROLES.AGENT,
    USER_ROLES.VIEWER,
  ] as const),
  divisionId: z.string().min(1),
  groupIds: z.array(z.string()).optional(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// Group schemas
export const createGroupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
  divisionId: z.string().min(1),
  userIds: z.array(z.string()).optional(),
});

export const updateGroupSchema = createGroupSchema.partial();

// Tag schemas
export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  description: z.string().max(200).optional(),
  divisionId: z.string().min(1),
});

export const updateTagSchema = createTagSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// View schemas
export const filterConditionSchema = z.object({
  id: z.string(),
  fieldId: z.string(),
  operator: z.enum([
    FILTER_OPERATORS.EQUALS,
    FILTER_OPERATORS.NOT_EQUALS,
    FILTER_OPERATORS.CONTAINS,
    FILTER_OPERATORS.NOT_CONTAINS,
    FILTER_OPERATORS.STARTS_WITH,
    FILTER_OPERATORS.ENDS_WITH,
    FILTER_OPERATORS.GREATER_THAN,
    FILTER_OPERATORS.LESS_THAN,
    FILTER_OPERATORS.GREATER_EQUAL,
    FILTER_OPERATORS.LESS_EQUAL,
    FILTER_OPERATORS.IS_EMPTY,
    FILTER_OPERATORS.IS_NOT_EMPTY,
    FILTER_OPERATORS.IN,
    FILTER_OPERATORS.NOT_IN,
  ] as const),
  value: z.any(),
});

export const createViewSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  filters: z.array(filterConditionSchema).default([]),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  columnsVisible: z.array(z.string()).min(1),
  isPublic: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  divisionId: z.string().min(1),
});

export const updateViewSchema = createViewSchema.partial();

// Bulk operation schemas
export const bulkUpdateSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string(),
      data: z.record(z.any()),
    }),
  ),
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1),
});

// Health check schema
export const healthCheckSchema = z.object({
  includeDetails: z.boolean().default(false),
});

// Query parameter validation helpers
export const validatePagination = (query: any) => {
  return paginationSchema.parse(query);
};

export const validateIdParam = (params: any) => {
  return idParamSchema.parse(params);
};

// Custom validation functions
export const validateUniqueName = async (
  name: string,
  excludeId?: string,
  checkFunction?: (name: string, excludeId?: string) => Promise<boolean>,
): Promise<boolean> => {
  if (checkFunction) {
    return await checkFunction(name, excludeId);
  }
  return true;
};

export const validateUniqueEmail = async (
  email: string,
  excludeId?: string,
  checkFunction?: (email: string, excludeId?: string) => Promise<boolean>,
): Promise<boolean> => {
  if (checkFunction) {
    return await checkFunction(email, excludeId);
  }
  return true;
};

// Request validation middleware types
export type CreateFieldRequest = z.infer<typeof createFieldSchema>;
export type UpdateFieldRequest = z.infer<typeof updateFieldSchema>;
export type CreateFormRequest = z.infer<typeof createFormSchema>;
export type UpdateFormRequest = z.infer<typeof updateFormSchema>;
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type CreateGroupRequest = z.infer<typeof createGroupSchema>;
export type UpdateGroupRequest = z.infer<typeof updateGroupSchema>;
export type CreateTagRequest = z.infer<typeof createTagSchema>;
export type UpdateTagRequest = z.infer<typeof updateTagSchema>;
export type CreateViewRequest = z.infer<typeof createViewSchema>;
export type UpdateViewRequest = z.infer<typeof updateViewSchema>;
export type PaginationRequest = z.infer<typeof paginationSchema>;
export type IdParamRequest = z.infer<typeof idParamSchema>;
