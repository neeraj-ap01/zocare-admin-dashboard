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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import {
  useFields,
  useCreateField,
  useUpdateField,
  useDeleteField,
} from "@/hooks/useApi";
import { Field, FieldType } from "@/types";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  FormInput,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

const fieldTypeOptions: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Textarea" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "Date & Time" },
  { value: "select", label: "Dropdown" },
  { value: "multiselect", label: "Multi-select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio" },
  { value: "file", label: "File Upload" },
  { value: "url", label: "URL" },
];

export default function Fields() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  const { data: fields, isLoading, error } = useFields();
  const createFieldMutation = useCreateField();
  const updateFieldMutation = useUpdateField();
  const deleteFieldMutation = useDeleteField();

  const columns: ColumnDef<Field>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "label",
      header: "Label",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as FieldType;
        const typeConfig = fieldTypeOptions.find((opt) => opt.value === type);
        return <Badge variant="outline">{typeConfig?.label || type}</Badge>;
      },
    },
    {
      accessorKey: "required",
      header: "Required",
      cell: ({ row }) => (
        <Badge variant={row.getValue("required") ? "default" : "secondary"}>
          {row.getValue("required") ? "Yes" : "No"}
        </Badge>
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
      id: "actions",
      cell: ({ row }) => {
        const field = row.original;

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
                  setEditingField(field);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (confirm("Are you sure you want to delete this field?")) {
                    deleteFieldMutation.mutate(field.id);
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

  const handleCreateField = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    try {
      await createFieldMutation.mutateAsync({
        name: data.name as string,
        label: data.label as string,
        type: data.type as FieldType,
        description: data.description as string,
        required: data.required === "on",
        placeholder: data.placeholder as string,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create field:", error);
    }
  };

  const handleUpdateField = async (formData: FormData) => {
    if (!editingField) return;

    const data = Object.fromEntries(formData.entries());
    try {
      await updateFieldMutation.mutateAsync({
        id: editingField.id,
        name: data.name as string,
        label: data.label as string,
        type: data.type as FieldType,
        description: data.description as string,
        required: data.required === "on",
        placeholder: data.placeholder as string,
        isActive: data.isActive === "on",
        updatedAt: new Date(),
      });
      setIsEditDialogOpen(false);
      setEditingField(null);
    } catch (error) {
      console.error("Failed to update field:", error);
    }
  };

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error loading fields</div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Field Management"
        description="Create and manage reusable fields for your forms"
        badge={{ text: `${fields?.length || 0} fields` }}
        actions={
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-zocare hover:bg-zocare-dark">
                <Plus className="mr-2 h-4 w-4" />
                Create Field
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Field</DialogTitle>
                <DialogDescription>
                  Add a new reusable field that can be used in forms.
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreateField} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Field Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., priority, due_date"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label">Display Label</Label>
                  <Input
                    id="label"
                    name="label"
                    placeholder="e.g., Priority, Due Date"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Field Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Optional description for this field"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placeholder">Placeholder Text</Label>
                  <Input
                    id="placeholder"
                    name="placeholder"
                    placeholder="Optional placeholder text"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="required" name="required" />
                  <Label htmlFor="required">Required field</Label>
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
                    disabled={createFieldMutation.isPending}
                    className="bg-zocare hover:bg-zocare-dark"
                  >
                    {createFieldMutation.isPending && (
                      <LoadingSpinner size="sm" className="mr-2" />
                    )}
                    Create Field
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading fields..." />
        </div>
      ) : !fields || fields.length === 0 ? (
        <EmptyState
          icon={FormInput}
          title="No fields found"
          description="Get started by creating your first reusable field"
          action={{
            label: "Create Field",
            onClick: () => setIsCreateDialogOpen(true),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={fields}
          searchKey="name"
          searchPlaceholder="Search fields..."
        />
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Update the field configuration.
            </DialogDescription>
          </DialogHeader>
          {editingField && (
            <form action={handleUpdateField} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Field Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingField.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-label">Display Label</Label>
                <Input
                  id="edit-label"
                  name="label"
                  defaultValue={editingField.label}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Field Type</Label>
                <Select name="type" defaultValue={editingField.type} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingField.description || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-placeholder">Placeholder Text</Label>
                <Input
                  id="edit-placeholder"
                  name="placeholder"
                  defaultValue={editingField.placeholder || ""}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-required"
                  name="required"
                  defaultChecked={editingField.required}
                />
                <Label htmlFor="edit-required">Required field</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  name="isActive"
                  defaultChecked={editingField.isActive}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingField(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateFieldMutation.isPending}
                  className="bg-zocare hover:bg-zocare-dark"
                >
                  {updateFieldMutation.isPending && (
                    <LoadingSpinner size="sm" className="mr-2" />
                  )}
                  Update Field
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
