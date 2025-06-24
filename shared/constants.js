// API Base URLs
export const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";
export const API_VERSION = "v1";
// API Endpoints
export const API_ENDPOINTS = {
    // Health
    HEALTH: "/health",
    // Dashboard
    DASHBOARD_STATS: "/dashboard/stats",
    RECENT_ACTIVITY: "/dashboard/activity",
    // Fields
    FIELDS: "/fields",
    FIELD_BY_ID: (id) => `/fields/${id}`,
    // Forms
    FORMS: "/forms",
    FORM_BY_ID: (id) => `/forms/${id}`,
    FORM_FIELDS: (id) => `/forms/${id}/fields`,
    // Users
    USERS: "/users",
    USER_BY_ID: (id) => `/users/${id}`,
    // Groups
    GROUPS: "/groups",
    GROUP_BY_ID: (id) => `/groups/${id}`,
    GROUP_MEMBERS: (id) => `/groups/${id}/members`,
    // Tags
    TAGS: "/tags",
    TAG_BY_ID: (id) => `/tags/${id}`,
    // Views
    VIEWS: "/views",
    VIEW_BY_ID: (id) => `/views/${id}`,
    // Divisions
    DIVISIONS: "/divisions",
    DIVISION_BY_ID: (id) => `/divisions/${id}`,
};
// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};
// Error Codes
export const ERROR_CODES = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    NOT_FOUND: "NOT_FOUND",
    DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    INTERNAL_ERROR: "INTERNAL_ERROR",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
};
// Pagination Defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
// Field Types Configuration
export const FIELD_TYPES = {
    TEXT: "text",
    TEXTAREA: "textarea",
    NUMBER: "number",
    EMAIL: "email",
    PHONE: "phone",
    DATE: "date",
    DATETIME: "datetime",
    SELECT: "select",
    MULTISELECT: "multiselect",
    CHECKBOX: "checkbox",
    RADIO: "radio",
    FILE: "file",
    URL: "url",
};
// User Roles
export const USER_ROLES = {
    ADMIN: "admin",
    MANAGER: "manager",
    AGENT: "agent",
    VIEWER: "viewer",
};
// Filter Operators
export const FILTER_OPERATORS = {
    EQUALS: "equals",
    NOT_EQUALS: "not_equals",
    CONTAINS: "contains",
    NOT_CONTAINS: "not_contains",
    STARTS_WITH: "starts_with",
    ENDS_WITH: "ends_with",
    GREATER_THAN: "greater_than",
    LESS_THAN: "less_than",
    GREATER_EQUAL: "greater_equal",
    LESS_EQUAL: "less_equal",
    IS_EMPTY: "is_empty",
    IS_NOT_EMPTY: "is_not_empty",
    IN: "in",
    NOT_IN: "not_in",
};
// Cache Keys
export const CACHE_KEYS = {
    FIELDS: "fields",
    FORMS: "forms",
    USERS: "users",
    GROUPS: "groups",
    TAGS: "tags",
    VIEWS: "views",
    DASHBOARD_STATS: "dashboard:stats",
    RECENT_ACTIVITY: "dashboard:activity",
};
// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
    SHORT: 60, // 1 minute
    MEDIUM: 300, // 5 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400, // 24 hours
};
