import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { MultiSelect } from "@/components/ui/multi-select";
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
  label: string;
  description: string;
  required: boolean;
  agentPermission: string;
  customerPermission: string;
  values: FieldValue[];
  defaultValue?: string;
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
  const [formData, setFormData] = React.useState<FieldConfigurationData>({
    label: "",
    description: "",
    required: false,
    agentPermission: "edit",
    customerPermission: "edit",
    values: [],
    defaultValue: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Preview state for interactive fields
  const [previewText, setPreviewText] = React.useState("");
  const [previewNumber, setPreviewNumber] = React.useState("");
  const [previewDropdown, setPreviewDropdown] = React.useState("");
  const [previewMultiSelect, setPreviewMultiSelect] = React.useState<string[]>(
    [],
  );
  const [previewCheckbox, setPreviewCheckbox] = React.useState(false);
  const [previewRadio, setPreviewRadio] = React.useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) {
      newErrors.label = "Display name is required";
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
    setFormData((prev) => ({
      ...prev,
      [field]: field === "values" ? value || [] : value,
    }));
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

  const getPreviewLabel = (): string => {
    if (formData.label.trim()) {
      return formData.label;
    }
    return `${getFieldTypeLabel(fieldType)} field`;
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Form */}
      <div className="col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Button type="button" variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h3 className="text-lg font-semibold">
                {getFieldTypeLabel(fieldType)} field
              </h3>
              <p className="text-sm text-muted-foreground">
                This field accepts{" "}
                {fieldType === "NUMBER"
                  ? "a number with no decimals"
                  : fieldType === "TEXT"
                    ? "a single line of text"
                    : fieldType === "DROPDOWN"
                      ? "one selection from a list"
                      : fieldType === "MULTISELECT"
                        ? "multiple selections from a list"
                        : fieldType === "CHECKBOX"
                          ? "a yes or no option"
                          : fieldType === "RADIO"
                            ? "one selection from radio buttons"
                            : "input"}
                .
              </p>
            </div>
          </div>

          <Separator />

          {/* Display name */}
          <div className="space-y-2">
            <Label htmlFor="label" className="text-sm font-medium">
              Display name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => updateFormData("label", e.target.value)}
              placeholder="Enter a display name"
              className={errors.label ? "border-destructive" : ""}
            />
            {errors.label && (
              <p className="text-xs text-destructive">{errors.label}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              placeholder=""
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Required to solve a ticket */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
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
              onCheckedChange={(checked) => updateFormData("required", checked)}
            />
          </div>

          {/* Field Values Section - Conditional */}
          <FieldValuesSection
            fieldType={fieldType}
            values={formData.values}
            onChange={(values) => updateFormData("values", values)}
            defaultValue={formData.defaultValue}
            onDefaultValueChange={(value) =>
              updateFormData("defaultValue", value)
            }
          />
          {errors.values && (
            <p className="text-sm text-destructive">{errors.values}</p>
          )}

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Agents can edit</Label>
                <RadioGroup
                  value={formData.agentPermission}
                  onValueChange={(value) =>
                    updateFormData("agentPermission", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="edit" id="agents-edit" />
                    <Label htmlFor="agents-edit" className="text-sm">
                      Field can be edited by an agent
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="view" id="agents-view" />
                    <Label htmlFor="agents-view" className="text-sm">
                      Field can only be viewed by an agent
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Customers can view
                </Label>
                <RadioGroup
                  value={formData.customerPermission}
                  onValueChange={(value) =>
                    updateFormData("customerPermission", value)
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="edit" id="customers-edit" />
                    <Label htmlFor="customers-edit" className="text-sm">
                      Field can be edited by customers when submitting a request
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="view" id="customers-view" />
                    <Label htmlFor="customers-view" className="text-sm">
                      Field can only be viewed by customers when submitting a
                      request
                    </Label>
                  </div>
                </RadioGroup>
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
              Save
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="col-span-1">
        <div className="sticky top-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Agent view</Label>
                <p className="text-sm text-muted-foreground">
                  This is what agents will see when they interact with this
                  field in Agent Workspace.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {getPreviewLabel()}
                </Label>
                {fieldType === "TEXT" && (
                  <Input
                    placeholder="Enter text..."
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                  />
                )}
                {fieldType === "NUMBER" && (
                  <Input
                    type="number"
                    placeholder="Enter number..."
                    value={previewNumber}
                    onChange={(e) => setPreviewNumber(e.target.value)}
                  />
                )}
                {fieldType === "DROPDOWN" && (
                  <select
                    className="w-full p-2 border rounded-md"
                    value={previewDropdown}
                    onChange={(e) => setPreviewDropdown(e.target.value)}
                  >
                    <option value="">
                      {formData.defaultValue || "Select an option..."}
                    </option>
                    {(formData.values || []).map((value) => (
                      <option key={value.id} value={value.value}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                )}
                {fieldType === "MULTISELECT" && (
                  <MultiSelect
                    options={(formData.values || []).map((value) => ({
                      value: value.value || "",
                      label: value.label || value.value || "",
                    }))}
                    selected={previewMultiSelect || []}
                    onChange={setPreviewMultiSelect}
                    placeholder={
                      formData.values?.length > 0
                        ? "Select multiple options..."
                        : "Add values first"
                    }
                  />
                )}
                {fieldType === "CHECKBOX" && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={previewCheckbox}
                      onChange={(e) => setPreviewCheckbox(e.target.checked)}
                    />
                    <span className="text-sm">
                      {formData.label || "Checkbox field"}
                    </span>
                  </div>
                )}
                {fieldType === "RADIO" && (
                  <div className="space-y-2">
                    {(formData.values || []).map((value) => (
                      <div
                        key={value.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          name="preview-radio"
                          value={value.value}
                          checked={previewRadio === value.value}
                          onChange={(e) => setPreviewRadio(e.target.value)}
                        />
                        <span className="text-sm">{value.label}</span>
                      </div>
                    ))}
                    {(formData.values || []).length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        No options available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
