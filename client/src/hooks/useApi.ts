import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiService } from "@/services/api";
// Temporary inline types - should use shared types when imports are fixed
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

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

type CreateFieldDto = Partial<Field>;
type UpdateFieldDto = Partial<Field>;
type CreateFormDto = any;
type UpdateFormDto = any;
type CreateUserDto = any;
type UpdateUserDto = any;
type CreateGroupDto = any;
type UpdateGroupDto = any;
type CreateTagDto = any;
type UpdateTagDto = any;
type CreateViewDto = any;
type UpdateViewDto = any;

// Generic hooks
export function useGenericQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: {
    staleTime?: number;
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled,
  });
}

export function useGenericMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[][];
    successMessage?: string;
    errorMessage?: string;
  },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      options?.onSuccess?.(data);
      options?.invalidateQueries?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    onError: (error: Error) => {
      const errorMessage =
        options?.errorMessage || error.message || "An error occurred";
      toast.error(errorMessage);
      options?.onError?.(error);
    },
  });
}

// Dashboard hooks
export const useDashboardStats = () =>
  useGenericQuery(["dashboard", "stats"], ApiService.dashboard.getStats);

export const useRecentActivity = (limit?: number) =>
  useGenericQuery(["dashboard", "activity", limit], () =>
    ApiService.dashboard.getRecentActivity(limit),
  );

export const useDashboardOverview = () =>
  useGenericQuery(["dashboard", "overview"], ApiService.dashboard.getOverview);

// Field hooks
export const useFields = (params?: PaginationParams) =>
  useGenericQuery(["fields", params], () => ApiService.fields.getAll(params));

export const useField = (id: string) =>
  useGenericQuery(["fields", id], () => ApiService.fields.getById(id), {
    enabled: !!id,
  });

export const useCreateField = () =>
  useGenericMutation((data: CreateFieldDto) => ApiService.fields.create(data), {
    successMessage: "Field created successfully",
    invalidateQueries: [["fields"]],
  });

export const useUpdateField = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & UpdateFieldDto) =>
      ApiService.fields.update(id, data),
    {
      successMessage: "Field updated successfully",
      invalidateQueries: [["fields"]],
    },
  );

export const useDeleteField = () =>
  useGenericMutation((id: string) => ApiService.fields.delete(id), {
    successMessage: "Field deleted successfully",
    invalidateQueries: [["fields"]],
  });

export const useToggleFieldActive = () =>
  useGenericMutation((id: string) => ApiService.fields.toggleActive(id), {
    successMessage: "Field status updated",
    invalidateQueries: [["fields"]],
  });

// Form hooks
export const useForms = (params?: PaginationParams) =>
  useGenericQuery(["forms", params], () => ApiService.forms.getAll(params));

export const useForm = (id: string) =>
  useGenericQuery(["forms", id], () => ApiService.forms.getById(id), {
    enabled: !!id,
  });

export const useCreateForm = () =>
  useGenericMutation((data: CreateFormDto) => ApiService.forms.create(data), {
    successMessage: "Form created successfully",
    invalidateQueries: [["forms"]],
  });

export const useUpdateForm = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & UpdateFormDto) =>
      ApiService.forms.update(id, data),
    {
      successMessage: "Form updated successfully",
      invalidateQueries: [["forms"]],
    },
  );

export const useDeleteForm = () =>
  useGenericMutation((id: string) => ApiService.forms.delete(id), {
    successMessage: "Form deleted successfully",
    invalidateQueries: [["forms"]],
  });

// User hooks
export const useUsers = (params?: PaginationParams) =>
  useGenericQuery(["users", params], () => ApiService.users.getAll(params));

export const useUser = (id: string) =>
  useGenericQuery(["users", id], () => ApiService.users.getById(id), {
    enabled: !!id,
  });

export const useCreateUser = () =>
  useGenericMutation((data: CreateUserDto) => ApiService.users.create(data), {
    successMessage: "User created successfully",
    invalidateQueries: [["users"]],
  });

export const useUpdateUser = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & UpdateUserDto) =>
      ApiService.users.update(id, data),
    {
      successMessage: "User updated successfully",
      invalidateQueries: [["users"]],
    },
  );

export const useDeleteUser = () =>
  useGenericMutation((id: string) => ApiService.users.delete(id), {
    successMessage: "User deleted successfully",
    invalidateQueries: [["users"]],
  });

// Group hooks
export const useGroups = (params?: PaginationParams) =>
  useGenericQuery(["groups", params], () => ApiService.groups.getAll(params));

export const useGroup = (id: string) =>
  useGenericQuery(["groups", id], () => ApiService.groups.getById(id), {
    enabled: !!id,
  });

export const useCreateGroup = () =>
  useGenericMutation((data: CreateGroupDto) => ApiService.groups.create(data), {
    successMessage: "Group created successfully",
    invalidateQueries: [["groups"]],
  });

export const useUpdateGroup = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & UpdateGroupDto) =>
      ApiService.groups.update(id, data),
    {
      successMessage: "Group updated successfully",
      invalidateQueries: [["groups"]],
    },
  );

export const useDeleteGroup = () =>
  useGenericMutation((id: string) => ApiService.groups.delete(id), {
    successMessage: "Group deleted successfully",
    invalidateQueries: [["groups"]],
  });

// Tag hooks
export const useTags = (params?: PaginationParams) =>
  useGenericQuery(["tags", params], () => ApiService.tags.getAll(params));

export const useTag = (id: string) =>
  useGenericQuery(["tags", id], () => ApiService.tags.getById(id), {
    enabled: !!id,
  });

export const useCreateTag = () =>
  useGenericMutation((data: CreateTagDto) => ApiService.tags.create(data), {
    successMessage: "Tag created successfully",
    invalidateQueries: [["tags"]],
  });

export const useUpdateTag = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & UpdateTagDto) =>
      ApiService.tags.update(id, data),
    {
      successMessage: "Tag updated successfully",
      invalidateQueries: [["tags"]],
    },
  );

export const useDeleteTag = () =>
  useGenericMutation((id: string) => ApiService.tags.delete(id), {
    successMessage: "Tag deleted successfully",
    invalidateQueries: [["tags"]],
  });

// View hooks
export const useViews = (params?: PaginationParams) =>
  useGenericQuery(["views", params], () => ApiService.views.getAll(params));

export const useView = (id: string) =>
  useGenericQuery(["views", id], () => ApiService.views.getById(id), {
    enabled: !!id,
  });

export const useCreateView = () =>
  useGenericMutation((data: CreateViewDto) => ApiService.views.create(data), {
    successMessage: "View created successfully",
    invalidateQueries: [["views"]],
  });

export const useUpdateView = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & UpdateViewDto) =>
      ApiService.views.update(id, data),
    {
      successMessage: "View updated successfully",
      invalidateQueries: [["views"]],
    },
  );

export const useDeleteView = () =>
  useGenericMutation((id: string) => ApiService.views.delete(id), {
    successMessage: "View deleted successfully",
    invalidateQueries: [["views"]],
  });

// Health check hook
export const useHealth = () =>
  useGenericQuery(["health"], ApiService.health, { staleTime: 0 });
