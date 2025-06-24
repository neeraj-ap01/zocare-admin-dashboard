import * as React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldTypeSelector, CreateFieldType } from "./FieldTypeSelector";
import { FieldConfigurationForm } from "./FieldConfigurationForm";
import { FieldType, FieldOption } from "@/types";

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

interface CreateFieldWorkflowProps {
  onSubmit: (fieldData: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

type WorkflowStep = "select-type" | "configure-field";

// Map our creation field types to the system field types
const fieldTypeMapping: Record<CreateFieldType, FieldType> = {
  TEXT: "text",
  DROPDOWN: "select",
  NUMBER: "number",
  CHECKBOX: "checkbox",
  MULTISELECT: "multiselect",
  RADIO: "radio",
};

export function CreateFieldWorkflow({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CreateFieldWorkflowProps) {
  const [currentStep, setCurrentStep] =
    React.useState<WorkflowStep>("select-type");
  const [selectedFieldType, setSelectedFieldType] =
    React.useState<CreateFieldType | null>(null);

  const handleFieldTypeSelect = (type: CreateFieldType) => {
    setSelectedFieldType(type);
    setCurrentStep("configure-field");
  };

  const handleBack = () => {
    setCurrentStep("select-type");
    setSelectedFieldType(null);
  };

  const handleFormSubmit = async (data: FieldConfigurationData) => {
    if (!selectedFieldType) return;

    // Generate field name from label
    const generateFieldName = (label: string): string => {
      return label
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
    };

    // Convert our field values to the expected FieldOption format
    const options: FieldOption[] = data.values.map((value) => ({
      id: value.id,
      label: value.label || value.value,
      value: value.value,
    }));

    // Prepare field data in the format expected by the API
    const fieldData = {
      name: generateFieldName(data.label),
      label: data.label,
      type: fieldTypeMapping[selectedFieldType],
      description: data.description,
      required: data.required,
      options: options.length > 0 ? options : undefined,
      defaultValue: data.defaultValue,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await onSubmit(fieldData);
  };

  return (
    <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {currentStep === "select-type"
            ? "Create New Field"
            : "Configure Field"}
        </DialogTitle>
      </DialogHeader>

      {currentStep === "select-type" && (
        <FieldTypeSelector
          onSelect={handleFieldTypeSelect}
          onCancel={onCancel}
        />
      )}

      {currentStep === "configure-field" && selectedFieldType && (
        <FieldConfigurationForm
          fieldType={selectedFieldType}
          onSubmit={handleFormSubmit}
          onBack={handleBack}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      )}
    </DialogContent>
  );
}
