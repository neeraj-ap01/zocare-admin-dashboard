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
  useForms,
  useCreateForm,
  useUpdateForm,
  useDeleteForm,
  useFields,
} from "@/hooks/useApi";
import { Form } from "@/types";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Building2,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

export default function Forms() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<Form | null>(null);

  const { data: forms, isLoading, error } = useForms();
  const { data: fields } = useFields();
  const createFormMutation = useCreateForm();
  const updateFormMutation = useUpdateForm();
  const deleteFormMutation = useDeleteForm();

  const columns: ColumnDef<Form>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "fields",
      header: "Fields",
      cell: ({ row }) => {
        const fieldCount = row.original.fields?.length || 0;
        return (
          <Badge variant="outline">
            {fieldCount} field{fieldCount !== 1 ? "s" : ""}
          </Badge>
        );
      },
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
        const form = row.original;

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
                  setEditingForm(form);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configure Fields
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (confirm("Are you sure you want to delete this form?")) {
                    deleteFormMutation.mutate(form.id);
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

  const handleCreateForm = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    try {
      await createFormMutation.mutateAsync({
        name: data.name as string,
        description: data.description as string,
        fields: [],
        isActive: true,
        divisionId: "1", // Default division
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create form:", error);
    }
  };

  const handleUpdateForm = async (formData: FormData) => {
    if (!editingForm) return;

    const data = Object.fromEntries(formData.entries());
    try {
      await updateFormMutation.mutateAsync({
        id: editingForm.id,
        name: data.name as string,
        description: data.description as string,
        isActive: data.isActive === "on",
        updatedAt: new Date(),
      });
      setIsEditDialogOpen(false);
      setEditingForm(null);
    } catch (error) {
      console.error("Failed to update form:", error);
    }
  };

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error loading forms</div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Form Management"
        description="Create and configure forms using your defined fields"
        badge={{ text: `${forms?.length || 0} forms` }}
        actions={
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-zocare hover:bg-zocare-dark">
                <Plus className="mr-2 h-4 w-4" />
                Create Form
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
                <DialogDescription>
                  Create a new form that can be used to collect ticket
                  information.
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreateForm} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Form Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Support Ticket Form"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what this form is used for"
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
                    disabled={createFormMutation.isPending}
                    className="bg-zocare hover:bg-zocare-dark"
                  >
                    {createFormMutation.isPending && (
                      <LoadingSpinner size="sm" className="mr-2" />
                    )}
                    Create Form
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading forms..." />
        </div>
      ) : !forms || forms.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No forms found"
          description="Get started by creating your first form using your defined fields"
          action={{
            label: "Create Form",
            onClick: () => setIsCreateDialogOpen(true),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={forms}
          searchKey="name"
          searchPlaceholder="Search forms..."
        />
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Form</DialogTitle>
            <DialogDescription>
              Update the form configuration.
            </DialogDescription>
          </DialogHeader>
          {editingForm && (
            <form action={handleUpdateForm} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Form Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingForm.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingForm.description || ""}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  name="isActive"
                  defaultChecked={editingForm.isActive}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingForm(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateFormMutation.isPending}
                  className="bg-zocare hover:bg-zocare-dark"
                >
                  {updateFormMutation.isPending && (
                    <LoadingSpinner size="sm" className="mr-2" />
                  )}
                  Update Form
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
