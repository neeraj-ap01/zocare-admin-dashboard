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

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
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

// UI state types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  children?: NavigationItem[];
  badge?: number;
}
