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
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import {
  useGroups,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
} from "@/hooks/useApi";
import { Group } from "@/types";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Shield,
  Globe,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
const colorOptions = [
  { value: "#8b5cf6", label: "Purple" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#10b981", label: "Emerald" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ef4444", label: "Red" },
  { value: "#6366f1", label: "Indigo" },
  { value: "#ec4899", label: "Pink" },
  { value: "#84cc16", label: "Lime" },
];

export default function Groups() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const { data: groups, isLoading, error } = useGroups();
  const createGroupMutation = useCreateGroup();
  const updateGroupMutation = useUpdateGroup();
  const deleteGroupMutation = useDeleteGroup();

  const columns: ColumnDef<Group>[] = [
    {
      accessorKey: "name",
      header: "Group",
      cell: ({ row }) => {
        const group = row.original;
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: group.color }}
            />
            <div>
              <div className="font-medium">{group.name}</div>
              <div className="text-sm text-muted-foreground">
                {group.description}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "userIds",
      header: "Members",
      cell: ({ row }) => {
        const memberCount = row.original.userIds?.length || 0;
        return (
          <Badge variant="outline">
            {memberCount} member{memberCount !== 1 ? "s" : ""}
          </Badge>
        );
      },
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const permissionCount = row.original.permissions?.length || 0;
        return (
          <Badge variant="secondary">
            {permissionCount} permission{permissionCount !== 1 ? "s" : ""}
          </Badge>
        );
      },
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
        const group = row.original;

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
                  setEditingGroup(group);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                Manage Members
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Permissions
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (confirm("Are you sure you want to delete this group?")) {
                    deleteGroupMutation.mutate(group.id);
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

  const handleCreateGroup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      await createGroupMutation.mutateAsync({
        name: data.name as string,
        description: data.description as string,
        color: data.color as string,
        userIds: [],
        permissions: [],
        divisionId: "1", // Default division
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setIsCreateDialogOpen(false);
      setTimeout(() => {
        toast.success("Group created successfully");
      }, 100);
    } catch (error) {
      console.error("Failed to create group:", error);
      setTimeout(() => {
        toast.error("Failed to create group");
      }, 100);
    }
  };

  const handleUpdateGroup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingGroup) return;
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      await updateGroupMutation.mutateAsync({
        id: editingGroup.id,
        name: data.name as string,
        description: data.description as string,
        color: data.color as string,
        updatedAt: new Date(),
      });
      setIsEditDialogOpen(false);
      setEditingGroup(null);
      setTimeout(() => {
        toast.success("Group updated successfully");
      }, 100);
    } catch (error) {
      console.error("Failed to update group:", error);
      setTimeout(() => {
        toast.error("Failed to update group");
      }, 100);
    }
  };

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error loading groups</div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Groups"
        description="Organize users into groups for better access control and management"
        badge={{ text: `${groups?.length || 0} groups` }}
        actions={
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-zocare hover:bg-zocare-dark">
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>
                  Create a group to organize users and manage permissions.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Support Team"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the purpose of this group"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <label
                        key={color.value}
                        className="cursor-pointer flex flex-col items-center gap-1 p-2 rounded-lg border hover:bg-muted/50"
                      >
                        <input
                          type="radio"
                          name="color"
                          value={color.value}
                          className="sr-only"
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-xs">{color.label}</span>
                      </label>
                    ))}
                  </div>
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
                    disabled={createGroupMutation.isPending}
                    className="bg-zocare hover:bg-zocare-dark"
                  >
                    {createGroupMutation.isPending && (
                      <LoadingSpinner size="sm" className="mr-2" />
                    )}
                    Create Group
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading groups..." />
        </div>
      ) : !groups || groups.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No groups found"
          description="Get started by creating your first user group"
          action={{
            label: "Create Group",
            onClick: () => setIsCreateDialogOpen(true),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={groups}
          searchKey="name"
          searchPlaceholder="Search groups..."
        />
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>Update the group information.</DialogDescription>
          </DialogHeader>
          {editingGroup && (
            <form onSubmit={handleUpdateGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Group Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingGroup.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingGroup.description || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color</Label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <label
                      key={color.value}
                      className="cursor-pointer flex flex-col items-center gap-1 p-2 rounded-lg border hover:bg-muted/50"
                    >
                      <input
                        type="radio"
                        name="color"
                        value={color.value}
                        defaultChecked={editingGroup.color === color.value}
                        className="sr-only"
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-xs">{color.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingGroup(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateGroupMutation.isPending}
                  className="bg-zocare hover:bg-zocare-dark"
                >
                  {updateGroupMutation.isPending && (
                    <LoadingSpinner size="sm" className="mr-2" />
                  )}
                  Update Group
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
