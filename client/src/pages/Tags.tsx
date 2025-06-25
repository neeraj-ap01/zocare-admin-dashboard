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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "@/hooks/useApi";
import { Tag } from "@/types";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag as TagIcon,
  Eye,
  EyeOff,
  TrendingUp,
} from "lucide-react";

const colorPresets = [
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#6366f1", // Indigo
  "#84cc16", // Lime
];

export default function Tags() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const { data: tags, isLoading, error } = useTags();
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  const columns: ColumnDef<Tag>[] = [
    {
      accessorKey: "name",
      header: "Tag",
      cell: ({ row }) => {
        const tag = row.original;
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <div>
              <div className="font-medium">{tag.name}</div>
              <div className="text-sm text-muted-foreground">
                {tag.description}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "usageCount",
      header: "Usage",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("usageCount")}</span>
          <span className="text-sm text-muted-foreground">times</span>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.getValue("isActive") ? (
            <Eye className="h-4 w-4 text-zocare-success" />
          ) : (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          )}
          <Badge variant={row.getValue("isActive") ? "default" : "secondary"}>
            {row.getValue("isActive") ? "Active" : "Inactive"}
          </Badge>
        </div>
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
        const tag = row.original;

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
                  setEditingTag(tag);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (confirm("Are you sure you want to delete this tag?")) {
                    deleteTagMutation.mutate(tag.id);
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

  const handleCreateTag = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    try {
      await createTagMutation.mutateAsync({
        name: data.name as string,
        color: data.color as string,
        description: data.description as string,
        isActive: true,
        usageCount: 0,
        divisionId: "1", // Default division
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  const handleUpdateTag = async (formData: FormData) => {
    if (!editingTag) return;

    const data = Object.fromEntries(formData.entries());
    try {
      await updateTagMutation.mutateAsync({
        id: editingTag.id,
        name: data.name as string,
        color: data.color as string,
        description: data.description as string,
        isActive: data.isActive === "on",
        updatedAt: new Date(),
      });
      setIsEditDialogOpen(false);
      setEditingTag(null);
    } catch (error) {
      console.error("Failed to update tag:", error);
    }
  };

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error loading tags</div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tags"
        description="Manage tags for categorizing and organizing tickets"
        badge={{ text: `${tags?.length || 0} tags` }}
        actions={
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-zocare hover:bg-zocare-dark">
                <Plus className="mr-2 h-4 w-4" />
                Create Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Tag</DialogTitle>
                <DialogDescription>
                  Add a new tag for categorizing tickets.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTag} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tag Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Bug, Feature Request"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe when to use this tag"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2 mb-2">
                    {colorPresets.map((color) => (
                      <label
                        key={color}
                        className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full border-2 border-transparent hover:border-border"
                        style={{ backgroundColor: color }}
                      >
                        <input
                          type="radio"
                          name="color"
                          value={color}
                          className="sr-only"
                        />
                      </label>
                    ))}
                  </div>
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    placeholder="#000000"
                    className="w-full h-10"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createTagMutation.isPending}
                    className="bg-zocare hover:bg-zocare-dark"
                  >
                    {createTagMutation.isPending && (
                      <LoadingSpinner size="sm" className="mr-2" />
                    )}
                    Create Tag
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading tags..." />
        </div>
      ) : !tags || tags.length === 0 ? (
        <EmptyState
          icon={TagIcon}
          title="No tags found"
          description="Get started by creating your first tag for ticket categorization"
          action={{
            label: "Create Tag",
            onClick: () => setIsCreateDialogOpen(true),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={tags}
          searchKey="name"
          searchPlaceholder="Search tags..."
        />
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>Update the tag information.</DialogDescription>
          </DialogHeader>
          {editingTag && (
            <form onSubmit={handleUpdateTag} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tag Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingTag.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingTag.description || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color</Label>
                <div className="flex gap-2 mb-2">
                  {colorPresets.map((color) => (
                    <label
                      key={color}
                      className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full border-2 border-transparent hover:border-border"
                      style={{ backgroundColor: color }}
                    >
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        defaultChecked={editingTag.color === color}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
                <Input
                  id="edit-color"
                  name="color"
                  type="color"
                  defaultValue={editingTag.color}
                  className="w-full h-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  name="isActive"
                  defaultChecked={editingTag.isActive}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingTag(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateTagMutation.isPending}
                  className="bg-zocare hover:bg-zocare-dark"
                >
                  {updateTagMutation.isPending && (
                    <LoadingSpinner size="sm" className="mr-2" />
                  )}
                  Update Tag
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
