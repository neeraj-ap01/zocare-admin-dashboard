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
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { FieldValuesSection } from "./FieldValuesSection";
import { CreateFieldType } from "./FieldTypeSelector";
import { FieldType } from "@/types";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [showPreview, setShowPreview] = React.useState(false);

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

  const PreviewSection = () => (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Agent view</Label>
          <p className="text-xs sm:text-sm text-muted-foreground">
            This is what agents will see when they interact with this field in
            Agent Workspace.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">{getPreviewLabel()}</Label>
          {fieldType === "TEXT" && (
            <Input
              placeholder="Enter text..."
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full"
            />
          )}
          {fieldType === "NUMBER" && (
            <Input
              type="number"
              placeholder="Enter number..."
              value={previewNumber}
              onChange={(e) => setPreviewNumber(e.target.value)}
              className="w-full"
            />
          )}
          {fieldType === "DROPDOWN" && (
            <select
              className="w-full p-2 border rounded-md bg-background text-foreground"
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
            <MultiSelectDropdown
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
                className="rounded border-input"
              />
              <span className="text-sm">
                {formData.label || "Checkbox field"}
              </span>
            </div>
          )}
          {fieldType === "RADIO" && (
            <div className="space-y-2">
              {(formData.values || []).map((value) => (
                <div key={value.id} className="flex items-center space-x-2">
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
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile Preview Toggle */}
      <div className="lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="w-full"
        >
          {showPreview ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Preview
            </>
          )}
        </Button>
      </div>

      {/* Mobile Preview */}
      {showPreview && (
        <div className="lg:hidden">
          <PreviewSection />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <h3 className="text-responsive-subtitle text-foreground">
                  {getFieldTypeLabel(fieldType)} field
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
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
                className={cn("w-full", errors.label && "border-destructive")}
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
                placeholder="Optional description for this field"
                className="resize-none w-full"
                rows={3}
              />
            </div>

            {/* Required to solve a ticket */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-3">
              <div className="space-y-1">
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
                className="shrink-0"
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
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Agents can edit</Label>
                  <RadioGroup
                    value={formData.agentPermission}
                    onValueChange={(value) =>
                      updateFormData("agentPermission", value)
                    }
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem
                        value="edit"
                        id="agents-edit"
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="agents-edit"
                        className="text-sm leading-relaxed"
                      >
                        Field can be edited by an agent
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem
                        value="view"
                        id="agents-view"
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="agents-view"
                        className="text-sm leading-relaxed"
                      >
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
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem
                        value="edit"
                        id="customers-edit"
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="customers-edit"
                        className="text-sm leading-relaxed"
                      >
                        Field can be edited by customers when submitting a
                        request
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem
                        value="view"
                        id="customers-view"
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="customers-view"
                        className="text-sm leading-relaxed"
                      >
                        Field can only be viewed by customers when submitting a
                        request
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="order-2 sm:order-1 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="order-1 sm:order-2 w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </form>
        </div>

        {/* Desktop Preview Section */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-6">
            <PreviewSection />
          </div>
        </div>
      </div>
    </div>
  );
}
