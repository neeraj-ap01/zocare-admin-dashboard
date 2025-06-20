// Core entity types
export interface Client {
  id: string;
  name: string;
  divisions: Division[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Division {
  id: string;
  name: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Field management types
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "phone"
  | "date"
  | "datetime"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "file"
  | "url";

export interface FieldOption {
  id: string;
  label: string;
  value: string;
  color?: string;
}

export interface Field {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  options?: FieldOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  placeholder?: string;
  defaultValue?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Form management types
export interface FormField {
  id: string;
  fieldId: string;
  formId: string;
  position: number;
  isRequired: boolean;
  customLabel?: string;
  customPlaceholder?: string;
  customValidation?: any;
  field?: Field;
}

export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  isActive: boolean;
  divisionId: string;
  createdAt: Date;
  updatedAt: Date;
}

// User and team management types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  groupIds: string[];
  divisionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "admin" | "manager" | "agent" | "viewer";

export interface Group {
  id: string;
  name: string;
  description?: string;
  color?: string;
  userIds: string[];
  permissions: Permission[];
  divisionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  actions: string[];
}

// Tag management types
export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  isActive: boolean;
  usageCount: number;
  divisionId: string;
  createdAt: Date;
  updatedAt: Date;
}

// View management types
export interface FilterCondition {
  id: string;
  fieldId: string;
  operator: FilterOperator;
  value: any;
  field?: Field;
}

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "greater_than"
  | "less_than"
  | "greater_equal"
  | "less_equal"
  | "is_empty"
  | "is_not_empty"
  | "in"
  | "not_in";

export interface View {
  id: string;
  name: string;
  description?: string;
  filters: FilterCondition[];
  sortBy?: string;
  sortOrder: "asc" | "desc";
  columnsVisible: string[];
  isPublic: boolean;
  isDefault: boolean;
  divisionId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// DTO types for API requests
export interface CreateFieldDto {
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  required: boolean;
  options?: FieldOption[];
  validation?: Field["validation"];
  placeholder?: string;
  defaultValue?: any;
}

export interface UpdateFieldDto extends Partial<CreateFieldDto> {
  isActive?: boolean;
}

export interface CreateFormDto {
  name: string;
  description?: string;
  divisionId: string;
}

export interface UpdateFormDto extends Partial<CreateFormDto> {
  isActive?: boolean;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  divisionId: string;
  groupIds?: string[];
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  isActive?: boolean;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
  color?: string;
  divisionId: string;
  userIds?: string[];
  permissions?: Permission[];
}

export interface UpdateGroupDto extends Partial<CreateGroupDto> {}

export interface CreateTagDto {
  name: string;
  color: string;
  description?: string;
  divisionId: string;
}

export interface UpdateTagDto extends Partial<CreateTagDto> {
  isActive?: boolean;
}

export interface CreateViewDto {
  name: string;
  description?: string;
  filters: FilterCondition[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  columnsVisible: string[];
  isPublic: boolean;
  isDefault: boolean;
  divisionId: string;
}

export interface UpdateViewDto extends Partial<CreateViewDto> {}

// Health check and system status
export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  version: string;
  services: {
    database: "connected" | "disconnected";
    cache: "connected" | "disconnected";
  };
}

// Statistics and dashboard data
export interface DashboardStats {
  totalFields: number;
  activeForms: number;
  teamMembers: number;
  activeGroups: number;
  totalTags: number;
  customViews: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  time: string;
  type: "field" | "form" | "user" | "group" | "tag" | "view";
  userId?: string;
}
