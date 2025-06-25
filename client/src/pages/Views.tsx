import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { CreateView } from "@/components/views";
import {
  useViews,
  useCreateView,
  useUpdateView,
  useDeleteView,
} from "@/hooks/useApi";
import { View, FilterCondition } from "@/types";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  Globe,
  Lock,
  Filter,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

interface ViewFormData {
  title: string;
  description: string;
  whoHasAccess: string;
  conditions: {
    allConditions: FilterCondition[];
    anyConditions: FilterCondition[];
  };
  columns: Array<{ id: string; label: string; type: string }>;
  groupBy: string;
  orderBy: string;
  sortDirection: "asc" | "desc";
}

export default function Views() {
  const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingView, setEditingView] = useState<View | null>(null);

  const { data: views, isLoading, error } = useViews();
  const createViewMutation = useCreateView();
  const updateViewMutation = useUpdateView();
  const deleteViewMutation = useDeleteView();

  const columns: ColumnDef<View>[] = [
    {
      accessorKey: "name",
      header: "View",
      cell: ({ row }) => {
        const view = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {view.isDefault && (
                <Star className="h-4 w-4 text-zocare fill-current" />
              )}
              {view.isPublic ? (
                <Globe className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="font-medium">{view.name}</div>
              <div className="text-sm text-muted-foreground">
                {view.description}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "filters",
      header: "Filters",
      cell: ({ row }) => {
        const filterCount = row.original.filters?.length || 0;
        return (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline">
              {filterCount} filter{filterCount !== 1 ? "s" : ""}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "isPublic",
      header: "Visibility",
      cell: ({ row }) => (
        <Badge variant={row.getValue("isPublic") ? "default" : "secondary"}>
          {row.getValue("isPublic") ? "Public" : "Private"}
        </Badge>
      ),
    },
    {
      accessorKey: "isDefault",
      header: "Default",
      cell: ({ row }) =>
        row.getValue("isDefault") ? (
          <Badge className="bg-zocare/20 text-zocare">Default</Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Modified",
      cell: ({ row }) => {
        const date = row.getValue("updatedAt") as Date;
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const view = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setEditingView(view);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Filter className="mr-2 h-4 w-4" />
                Configure Filters
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Manage Columns
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (confirm("Are you sure you want to delete this view?")) {
                    deleteViewMutation.mutate(view.id);
                  }
                }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleCreateView = async (viewData: ViewFormData) => {
    try {
      // Convert form data to API format
      const allFilters = [
        ...viewData.conditions.allConditions,
        ...viewData.conditions.anyConditions,
      ];

      await createViewMutation.mutateAsync({
        name: viewData.title,
        description: viewData.description,
        filters: allFilters,
        sortBy: viewData.orderBy,
        sortOrder: viewData.sortDirection,
        columnsVisible: viewData.columns.map((col) => col.id),
        isPublic: viewData.whoHasAccess !== "only_me",
        isDefault: false, // Default can be set later
        groupBy: viewData.groupBy === "none" ? undefined : viewData.groupBy,
        divisionId: "1", // Default division
        createdBy: "1", // Current user
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setViewMode("list");
      toast.success("View created successfully");
    } catch (error) {
      console.error("Failed to create view:", error);
      toast.error("Failed to create view");
    }
  };

  const handleUpdateView = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingView) return;
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      await updateViewMutation.mutateAsync({
        id: editingView.id,
        name: data.name as string,
        description: data.description as string,
        isPublic: data.isPublic === "on",
        isDefault: data.isDefault === "on",
        updatedAt: new Date(),
      });
      setIsEditDialogOpen(false);
      setEditingView(null);
    } catch (error) {
      console.error("Failed to update view:", error);
    }
  };

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error loading views</div>
      </ErrorBoundary>
    );
  }

  // Show create view mode
  if (viewMode === "create") {
    return (
      <CreateView
        onBack={() => setViewMode("list")}
        onSave={handleCreateView}
        isLoading={createViewMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Views"
        description="Create custom ticket list views with filters and sorting"
        badge={{ text: `${views?.length || 0} views` }}
        actions={
          <Button
            onClick={() => setViewMode("create")}
            className="bg-zocare hover:bg-zocare-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create View
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading views..." />
        </div>
      ) : !views || views.length === 0 ? (
        <EmptyState
          icon={Eye}
          title="No views found"
          description="Get started by creating your first custom ticket view"
          action={{
            label: "Create View",
            onClick: () => setViewMode("create"),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={views}
          searchKey="name"
          searchPlaceholder="Search views..."
        />
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit View</DialogTitle>
            <DialogDescription>
              Update the view configuration.
            </DialogDescription>
          </DialogHeader>
          {editingView && (
            <form onSubmit={handleUpdateView} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">View Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingView.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingView.description || ""}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isPublic"
                    name="isPublic"
                    defaultChecked={editingView.isPublic}
                  />
                  <Label htmlFor="edit-isPublic">Public view</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isDefault"
                    name="isDefault"
                    defaultChecked={editingView.isDefault}
                  />
                  <Label htmlFor="edit-isDefault">Set as default</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingView(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateViewMutation.isPending}
                  className="bg-zocare hover:bg-zocare-dark"
                >
                  {updateViewMutation.isPending && (
                    <LoadingSpinner size="sm" className="mr-2" />
                  )}
                  Update View
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
