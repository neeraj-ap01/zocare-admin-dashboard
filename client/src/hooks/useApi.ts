import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Mock API functions - replace with actual API calls
const mockApi = {
  // Fields API
  getFields: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockData.fields;
  },
  createField: async (field: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...field, id: Date.now().toString() };
  },
  updateField: async (id: string, field: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...field, id };
  },
  deleteField: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id };
  },

  // Forms API
  getForms: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockData.forms;
  },
  createForm: async (form: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...form, id: Date.now().toString() };
  },
  updateForm: async (id: string, form: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...form, id };
  },
  deleteForm: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id };
  },

  // Users API
  getUsers: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockData.users;
  },
  createUser: async (user: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...user, id: Date.now().toString() };
  },
  updateUser: async (id: string, user: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...user, id };
  },
  deleteUser: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id };
  },

  // Groups API
  getGroups: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockData.groups;
  },
  createGroup: async (group: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...group, id: Date.now().toString() };
  },
  updateGroup: async (id: string, group: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...group, id };
  },
  deleteGroup: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id };
  },

  // Tags API
  getTags: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockData.tags;
  },
  createTag: async (tag: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...tag, id: Date.now().toString() };
  },
  updateTag: async (id: string, tag: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...tag, id };
  },
  deleteTag: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id };
  },

  // Views API
  getViews: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockData.views;
  },
  createView: async (view: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...view, id: Date.now().toString() };
  },
  updateView: async (id: string, view: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...view, id };
  },
  deleteView: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id };
  },
};

// Mock data
const mockData = {
  fields: [
    {
      id: "1",
      name: "priority",
      label: "Priority",
      type: "select",
      required: true,
      options: [
        { id: "1", label: "Low", value: "low", color: "#10b981" },
        { id: "2", label: "Medium", value: "medium", color: "#f59e0b" },
        { id: "3", label: "High", value: "high", color: "#ef4444" },
      ],
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      name: "due_date",
      label: "Due Date",
      type: "date",
      required: false,
      isActive: true,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
  ],
  forms: [
    {
      id: "1",
      name: "Support Ticket Form",
      description: "Default form for support tickets",
      fields: [],
      isActive: true,
      divisionId: "1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ],
  users: [
    {
      id: "1",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      role: "admin",
      isActive: true,
      groupIds: ["1"],
      divisionId: "1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ],
  groups: [
    {
      id: "1",
      name: "Support Team",
      description: "Primary support team for handling tickets",
      color: "#8b5cf6",
      userIds: ["1"],
      permissions: [],
      divisionId: "1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ],
  tags: [
    {
      id: "1",
      name: "Bug",
      color: "#ef4444",
      description: "Software bug or error",
      isActive: true,
      usageCount: 45,
      divisionId: "1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ],
  views: [
    {
      id: "1",
      name: "Open Tickets",
      description: "All open support tickets",
      filters: [],
      sortBy: "createdAt",
      sortOrder: "desc" as const,
      columnsVisible: ["title", "priority", "assignee", "createdAt"],
      isPublic: true,
      isDefault: true,
      divisionId: "1",
      createdBy: "1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ],
};

// Generic hooks
export function useGenericQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGenericMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[][];
  },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      options?.invalidateQueries?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred");
      options?.onError?.(error);
    },
  });
}

// Specific hooks for each entity
export const useFields = () => useGenericQuery(["fields"], mockApi.getFields);

export const useCreateField = () =>
  useGenericMutation(mockApi.createField, {
    onSuccess: () => toast.success("Field created successfully"),
    invalidateQueries: [["fields"]],
  });

export const useUpdateField = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & any) => mockApi.updateField(id, data),
    {
      onSuccess: () => toast.success("Field updated successfully"),
      invalidateQueries: [["fields"]],
    },
  );

export const useDeleteField = () =>
  useGenericMutation(mockApi.deleteField, {
    onSuccess: () => toast.success("Field deleted successfully"),
    invalidateQueries: [["fields"]],
  });

export const useForms = () => useGenericQuery(["forms"], mockApi.getForms);

export const useCreateForm = () =>
  useGenericMutation(mockApi.createForm, {
    onSuccess: () => toast.success("Form created successfully"),
    invalidateQueries: [["forms"]],
  });

export const useUpdateForm = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & any) => mockApi.updateForm(id, data),
    {
      onSuccess: () => toast.success("Form updated successfully"),
      invalidateQueries: [["forms"]],
    },
  );

export const useDeleteForm = () =>
  useGenericMutation(mockApi.deleteForm, {
    onSuccess: () => toast.success("Form deleted successfully"),
    invalidateQueries: [["forms"]],
  });

export const useUsers = () => useGenericQuery(["users"], mockApi.getUsers);

export const useCreateUser = () =>
  useGenericMutation(mockApi.createUser, {
    onSuccess: () => toast.success("User created successfully"),
    invalidateQueries: [["users"]],
  });

export const useUpdateUser = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & any) => mockApi.updateUser(id, data),
    {
      onSuccess: () => toast.success("User updated successfully"),
      invalidateQueries: [["users"]],
    },
  );

export const useDeleteUser = () =>
  useGenericMutation(mockApi.deleteUser, {
    onSuccess: () => toast.success("User deleted successfully"),
    invalidateQueries: [["users"]],
  });

export const useGroups = () => useGenericQuery(["groups"], mockApi.getGroups);

export const useCreateGroup = () =>
  useGenericMutation(mockApi.createGroup, {
    onSuccess: () => toast.success("Group created successfully"),
    invalidateQueries: [["groups"]],
  });

export const useUpdateGroup = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & any) => mockApi.updateGroup(id, data),
    {
      onSuccess: () => toast.success("Group updated successfully"),
      invalidateQueries: [["groups"]],
    },
  );

export const useDeleteGroup = () =>
  useGenericMutation(mockApi.deleteGroup, {
    onSuccess: () => toast.success("Group deleted successfully"),
    invalidateQueries: [["groups"]],
  });

export const useTags = () => useGenericQuery(["tags"], mockApi.getTags);

export const useCreateTag = () =>
  useGenericMutation(mockApi.createTag, {
    onSuccess: () => toast.success("Tag created successfully"),
    invalidateQueries: [["tags"]],
  });

export const useUpdateTag = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & any) => mockApi.updateTag(id, data),
    {
      onSuccess: () => toast.success("Tag updated successfully"),
      invalidateQueries: [["tags"]],
    },
  );

export const useDeleteTag = () =>
  useGenericMutation(mockApi.deleteTag, {
    onSuccess: () => toast.success("Tag deleted successfully"),
    invalidateQueries: [["tags"]],
  });

export const useViews = () => useGenericQuery(["views"], mockApi.getViews);

export const useCreateView = () =>
  useGenericMutation(mockApi.createView, {
    onSuccess: () => toast.success("View created successfully"),
    invalidateQueries: [["views"]],
  });

export const useUpdateView = () =>
  useGenericMutation(
    ({ id, ...data }: { id: string } & any) => mockApi.updateView(id, data),
    {
      onSuccess: () => toast.success("View updated successfully"),
      invalidateQueries: [["views"]],
    },
  );

export const useDeleteView = () =>
  useGenericMutation(mockApi.deleteView, {
    onSuccess: () => toast.success("View deleted successfully"),
    invalidateQueries: [["views"]],
  });
