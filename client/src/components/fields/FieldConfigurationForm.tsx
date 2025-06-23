import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { FieldValuesSection } from "./FieldValuesSection";
import { CreateFieldType } from "./FieldTypeSelector";
import { FieldType } from "@/types";
import { ArrowLeft, Save } from "lucide-react";

interface FieldValue {
  id: string;
  value: string;
  label: string;
}

interface FieldConfigurationData {
  name: string;
  label: string;
  description: string;
  required: boolean;
  placeholder: string;
  values: FieldValue[];
}

interface FieldConfigurationFormProps {
  fieldType: CreateFieldType;
  onSubmit: (data: FieldConfigurationData) => Promise<void>;
  onBack: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Map our creation field types to the system field types
const fieldTypeMapping: Record<CreateFieldType, FieldType> = {
  TEXT: "text",
  DROPDOWN: "select",
  NUMBER: "number",
  CHECKBOX: "checkbox",
  MULTISELECT: "multiselect",
  RADIO: "radio",
};

export function FieldConfigurationForm({
  fieldType,
  onSubmit,
  onBack,
  onCancel,
  isSubmitting = false,
}: FieldConfigurationFormProps) {
  const [formData, setFormData] = useState<FieldConfigurationData>({
    name: "",
    label: "",
    description: "",
    required: false,
    placeholder: "",
    values: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Field name is required";
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(formData.name)) {
      newErrors.name =
        "Field name must start with a letter and contain only letters, numbers, and underscores";
    }

    if (!formData.label.trim()) {
      newErrors.label = "Display label is required";
    }

    // Validate field values for types that require them
    if (
      ["DROPDOWN", "MULTISELECT", "RADIO"].includes(fieldType) &&
      formData.values.length === 0
    ) {
      newErrors.values = "At least one value is required for this field type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const updateFormData = (field: keyof FieldConfigurationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getFieldTypeLabel = (type: CreateFieldType): string => {
    const labels = {
      TEXT: "Text",
      DROPDOWN: "Dropdown",
      NUMBER: "Number",
      CHECKBOX: "Checkbox",
      MULTISELECT: "Multi-select",
      RADIO: "Radio",
    };
    return labels[type];
  };

  const getPlaceholderText = (): string => {
    switch (fieldType) {
      case "TEXT":
        return "Enter text...";
      case "NUMBER":
        return "Enter number...";
      case "DROPDOWN":
        return "Select an option...";
      case "MULTISELECT":
        return "Select options...";
      case "CHECKBOX":
        return "Check this option";
      case "RADIO":
        return "Select one option";
      default:
        return "Enter value...";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button type="button" variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Configure Field</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Field Type:</span>
              <Badge variant="outline">{getFieldTypeLabel(fieldType)}</Badge>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
          <p className="text-sm text-muted-foreground">
            Define the basic properties of your field
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Field Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="e.g., priority, due_date"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Used internally, must be unique and contain no spaces
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label" className="text-sm font-medium">
                Display Label <span className="text-destructive">*</span>
              </Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => updateFormData("label", e.target.value)}
                placeholder="e.g., Priority, Due Date"
                className={errors.label ? "border-destructive" : ""}
              />
              {errors.label && (
                <p className="text-xs text-destructive">{errors.label}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Shown to users in forms and tables
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              placeholder="Optional description to help users understand this field"
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder" className="text-sm font-medium">
              Placeholder Text
            </Label>
            <Input
              id="placeholder"
              value={formData.placeholder}
              onChange={(e) => updateFormData("placeholder", e.target.value)}
              placeholder={getPlaceholderText()}
            />
            <p className="text-xs text-muted-foreground">
              Hint text shown when the field is empty
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Field Values Section - Conditional */}
      <FieldValuesSection
        fieldType={fieldType}
        values={formData.values}
        onChange={(values) => updateFormData("values", values)}
      />
      {errors.values && (
        <p className="text-sm text-destructive">{errors.values}</p>
      )}

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permissions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure who can access and edit this field
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Required to solve a ticket
                </Label>
                <p className="text-xs text-muted-foreground">
                  This field must be completed before a ticket can be solved
                </p>
              </div>
              <Switch
                checked={formData.required}
                onCheckedChange={(checked) =>
                  updateFormData("required", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-zocare hover:bg-zocare-dark"
        >
          {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
          <Save className="mr-2 h-4 w-4" />
          Create Field
        </Button>
      </div>
    </form>
  );
}
