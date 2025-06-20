// Temporary inline types - should be moved back to shared when imports are fixed
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Field {
  id: string;
  name: string;
  label: string;
  type: string;
  description?: string;
  required: boolean;
  options?: any[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Form {
  id: string;
  name: string;
  description?: string;
  fields: any[];
  isActive: boolean;
  divisionId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  groupIds: string[];
  divisionId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  color?: string;
  userIds: string[];
  divisionId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Tag {
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

interface View {
  id: string;
  name: string;
  description?: string;
  filters: any[];
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

interface DashboardStats {
  totalFields: number;
  activeForms: number;
  teamMembers: number;
  activeGroups: number;
  totalTags: number;
  customViews: number;
}

interface RecentActivity {
  id: string;
  action: string;
  description: string;
  time: string;
  type: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

type CreateFieldDto = Partial<Field>;
type UpdateFieldDto = Partial<Field>;
type CreateFormDto = Partial<Form>;
type UpdateFormDto = Partial<Form>;
type CreateUserDto = Partial<User>;
type UpdateUserDto = Partial<User>;
type CreateGroupDto = Partial<Group>;
type UpdateGroupDto = Partial<Group>;
type CreateTagDto = Partial<Tag>;
type UpdateTagDto = Partial<Tag>;
type CreateViewDto = Partial<View>;
type UpdateViewDto = Partial<View>;
// import { API_BASE_URL, API_ENDPOINTS } from "@shared/constants";

// Temporary direct configuration
const API_BASE_URL = "http://localhost:3001";
const API_ENDPOINTS = {
  HEALTH: "/health",
  DASHBOARD_STATS: "/dashboard/stats",
  RECENT_ACTIVITY: "/dashboard/activity",
  FIELDS: "/fields",
  FIELD_BY_ID: (id: string) => `/fields/${id}`,
  FORMS: "/forms",
  FORM_BY_ID: (id: string) => `/forms/${id}`,
  USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,
  GROUPS: "/groups",
  GROUP_BY_ID: (id: string) => `/groups/${id}`,
  TAGS: "/tags",
  TAG_BY_ID: (id: string) => `/tags/${id}`,
  VIEWS: "/views",
  VIEW_BY_ID: (id: string) => `/views/${id}`,
};

// API configuration
const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Custom fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_CONFIG.baseURL}/api/v1${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data; // Handle both wrapped and unwrapped responses
  } catch (error) {
    console.error(`API Request failed: ${endpoint}`, error);
    throw error;
  }
}

// Generic CRUD operations
export class ApiService {
  /**
   * Dashboard API
   */
  static dashboard = {
    getStats: (): Promise<DashboardStats> =>
      apiRequest(API_ENDPOINTS.DASHBOARD_STATS),

    getRecentActivity: (limit?: number): Promise<RecentActivity[]> =>
      apiRequest(
        `${API_ENDPOINTS.RECENT_ACTIVITY}${limit ? `?limit=${limit}` : ""}`,
      ),

    getOverview: (): Promise<{
      stats: DashboardStats;
      recentActivity: RecentActivity[];
      health: any;
      quickActions: any[];
    }> => apiRequest("/dashboard/overview"),

    getAnalytics: (): Promise<any> => apiRequest("/dashboard/analytics"),

    getQuickActions: (): Promise<any[]> =>
      apiRequest("/dashboard/quick-actions"),

    getNotifications: (): Promise<any[]> =>
      apiRequest("/dashboard/notifications"),
  };

  /**
   * Fields API
   */
  static fields = {
    getAll: (params?: PaginationParams): Promise<PaginatedResponse<Field>> => {
      const queryString = params
        ? `?${new URLSearchParams(params as any)}`
        : "";
      return apiRequest(`${API_ENDPOINTS.FIELDS}${queryString}`);
    },

    getById: (id: string): Promise<Field> =>
      apiRequest(API_ENDPOINTS.FIELD_BY_ID(id)),

    create: (data: CreateFieldDto): Promise<Field> =>
      apiRequest(API_ENDPOINTS.FIELDS, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateFieldDto): Promise<Field> =>
      apiRequest(API_ENDPOINTS.FIELD_BY_ID(id), {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<void> =>
      apiRequest(API_ENDPOINTS.FIELD_BY_ID(id), {
        method: "DELETE",
      }),

    getStats: (): Promise<any> => apiRequest(`${API_ENDPOINTS.FIELDS}/stats`),

    toggleActive: (id: string): Promise<Field> =>
      apiRequest(`${API_ENDPOINTS.FIELD_BY_ID(id)}/toggle-active`, {
        method: "PATCH",
      }),
  };

  /**
   * Forms API (placeholder)
   */
  static forms = {
    getAll: (params?: PaginationParams): Promise<PaginatedResponse<Form>> => {
      const queryString = params
        ? `?${new URLSearchParams(params as any)}`
        : "";
      return apiRequest(`${API_ENDPOINTS.FORMS}${queryString}`);
    },

    getById: (id: string): Promise<Form> =>
      apiRequest(API_ENDPOINTS.FORM_BY_ID(id)),

    create: (data: CreateFormDto): Promise<Form> =>
      apiRequest(API_ENDPOINTS.FORMS, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateFormDto): Promise<Form> =>
      apiRequest(API_ENDPOINTS.FORM_BY_ID(id), {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<void> =>
      apiRequest(API_ENDPOINTS.FORM_BY_ID(id), {
        method: "DELETE",
      }),
  };

  /**
   * Users API (placeholder)
   */
  static users = {
    getAll: (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
      const queryString = params
        ? `?${new URLSearchParams(params as any)}`
        : "";
      return apiRequest(`${API_ENDPOINTS.USERS}${queryString}`);
    },

    getById: (id: string): Promise<User> =>
      apiRequest(API_ENDPOINTS.USER_BY_ID(id)),

    create: (data: CreateUserDto): Promise<User> =>
      apiRequest(API_ENDPOINTS.USERS, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateUserDto): Promise<User> =>
      apiRequest(API_ENDPOINTS.USER_BY_ID(id), {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<void> =>
      apiRequest(API_ENDPOINTS.USER_BY_ID(id), {
        method: "DELETE",
      }),
  };

  /**
   * Groups API (placeholder)
   */
  static groups = {
    getAll: (params?: PaginationParams): Promise<PaginatedResponse<Group>> => {
      const queryString = params
        ? `?${new URLSearchParams(params as any)}`
        : "";
      return apiRequest(`${API_ENDPOINTS.GROUPS}${queryString}`);
    },

    getById: (id: string): Promise<Group> =>
      apiRequest(API_ENDPOINTS.GROUP_BY_ID(id)),

    create: (data: CreateGroupDto): Promise<Group> =>
      apiRequest(API_ENDPOINTS.GROUPS, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateGroupDto): Promise<Group> =>
      apiRequest(API_ENDPOINTS.GROUP_BY_ID(id), {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<void> =>
      apiRequest(API_ENDPOINTS.GROUP_BY_ID(id), {
        method: "DELETE",
      }),
  };

  /**
   * Tags API (placeholder)
   */
  static tags = {
    getAll: (params?: PaginationParams): Promise<PaginatedResponse<Tag>> => {
      const queryString = params
        ? `?${new URLSearchParams(params as any)}`
        : "";
      return apiRequest(`${API_ENDPOINTS.TAGS}${queryString}`);
    },

    getById: (id: string): Promise<Tag> =>
      apiRequest(API_ENDPOINTS.TAG_BY_ID(id)),

    create: (data: CreateTagDto): Promise<Tag> =>
      apiRequest(API_ENDPOINTS.TAGS, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateTagDto): Promise<Tag> =>
      apiRequest(API_ENDPOINTS.TAG_BY_ID(id), {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<void> =>
      apiRequest(API_ENDPOINTS.TAG_BY_ID(id), {
        method: "DELETE",
      }),
  };

  /**
   * Views API (placeholder)
   */
  static views = {
    getAll: (params?: PaginationParams): Promise<PaginatedResponse<View>> => {
      const queryString = params
        ? `?${new URLSearchParams(params as any)}`
        : "";
      return apiRequest(`${API_ENDPOINTS.VIEWS}${queryString}`);
    },

    getById: (id: string): Promise<View> =>
      apiRequest(API_ENDPOINTS.VIEW_BY_ID(id)),

    create: (data: CreateViewDto): Promise<View> =>
      apiRequest(API_ENDPOINTS.VIEWS, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateViewDto): Promise<View> =>
      apiRequest(API_ENDPOINTS.VIEW_BY_ID(id), {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string): Promise<void> =>
      apiRequest(API_ENDPOINTS.VIEW_BY_ID(id), {
        method: "DELETE",
      }),
  };

  /**
   * Health check
   */
  static health = (): Promise<any> => apiRequest(API_ENDPOINTS.HEALTH);
}

// Error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Request interceptor for adding auth headers (when implemented)
export function setAuthToken(token: string) {
  API_CONFIG.headers = {
    ...API_CONFIG.headers,
    Authorization: `Bearer ${token}`,
  };
}

// Remove auth token
export function clearAuthToken() {
  const { Authorization, ...headers } = API_CONFIG.headers as any;
  API_CONFIG.headers = headers;
}

export default ApiService;
