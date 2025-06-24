import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { FilterCondition, FilterOperator } from "@/types";

// Available fields for conditions
const AVAILABLE_FIELDS = [
  { id: "assignee", label: "Assignee", type: "select" },
  { id: "status", label: "Status", type: "select" },
  { id: "priority", label: "Priority", type: "select" },
  { id: "requester", label: "Requester", type: "select" },
  { id: "group", label: "Group", type: "select" },
  { id: "created_at", label: "Created date", type: "date" },
  { id: "updated_at", label: "Updated date", type: "date" },
  { id: "subject", label: "Subject", type: "text" },
  { id: "description", label: "Description", type: "text" },
  { id: "tags", label: "Tags", type: "multiselect" },
];

// Available operators based on field type
const OPERATORS: Record<string, { value: FilterOperator; label: string }[]> = {
  select: [
    { value: "equals", label: "Is" },
    { value: "not_equals", label: "Is not" },
    { value: "in", label: "Is any of" },
    { value: "not_in", label: "Is none of" },
  ],
  multiselect: [
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does not contain" },
    { value: "in", label: "Is any of" },
    { value: "not_in", label: "Is none of" },
  ],
  text: [
    { value: "equals", label: "Is" },
    { value: "not_equals", label: "Is not" },
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does not contain" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
    { value: "is_empty", label: "Is empty" },
    { value: "is_not_empty", label: "Is not empty" },
  ],
  date: [
    { value: "equals", label: "Is" },
    { value: "not_equals", label: "Is not" },
    { value: "greater_than", label: "Is after" },
    { value: "less_than", label: "Is before" },
    { value: "greater_equal", label: "Is on or after" },
    { value: "less_equal", label: "Is on or before" },
  ],
};

// Sample values for different field types
const FIELD_VALUES: Record<string, string[]> = {
  assignee: [
    "John Doe",
    "Jane Smith",
    "Bob Johnson",
    "Alice Brown",
    "Mike Wilson",
  ],
  status: ["Open", "Pending", "In Progress", "Resolved", "Closed"],
  priority: ["Low", "Normal", "High", "Urgent"],
  requester: ["Customer A", "Customer B", "Customer C", "Internal User"],
  group: ["Support Team", "Technical Team", "Sales Team", "Management"],
  tags: ["Bug", "Feature Request", "Documentation", "Training", "Urgent"],
};

interface ConditionRowProps {
  condition: FilterCondition;
  onChange: (condition: FilterCondition) => void;
  onRemove: () => void;
}

export function ConditionRow({
  condition,
  onChange,
  onRemove,
}: ConditionRowProps) {
  const selectedField = AVAILABLE_FIELDS.find(
    (f) => f.id === condition.fieldId,
  );
  const availableOperators = selectedField ? OPERATORS[selectedField.type] : [];
  const availableValues = selectedField
    ? FIELD_VALUES[selectedField.id] || []
    : [];

  const handleFieldChange = (fieldId: string) => {
    const field = AVAILABLE_FIELDS.find((f) => f.id === fieldId);
    if (field) {
      const defaultOperator = OPERATORS[field.type]?.[0]?.value || "equals";
      onChange({
        ...condition,
        fieldId,
        operator: defaultOperator,
        value: "",
      });
    }
  };

  const handleOperatorChange = (operator: FilterOperator) => {
    onChange({
      ...condition,
      operator,
      value: operator === "is_empty" || operator === "is_not_empty" ? null : "",
    });
  };

  const handleValueChange = (value: string) => {
    onChange({
      ...condition,
      value,
    });
  };

  const renderValueInput = () => {
    if (
      !selectedField ||
      condition.operator === "is_empty" ||
      condition.operator === "is_not_empty"
    ) {
      return null;
    }

    if (
      selectedField.type === "select" ||
      selectedField.type === "multiselect"
    ) {
      return (
        <Select value={condition.value || ""} onValueChange={handleValueChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select value..." />
          </SelectTrigger>
          <SelectContent>
            {availableValues.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (selectedField.type === "date") {
      return (
        <Input
          type="date"
          value={condition.value || ""}
          onChange={(e) => handleValueChange(e.target.value)}
          className="w-[180px]"
        />
      );
    }

    return (
      <Input
        type="text"
        value={condition.value || ""}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder="Enter value..."
        className="w-[180px]"
      />
    );
  };

  return (
    <div className="flex items-center gap-2 py-1">
      <Select value={condition.fieldId || ""} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select field..." />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_FIELDS.map((field) => (
            <SelectItem key={field.id} value={field.id}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedField && (
        <Select
          value={condition.operator || ""}
          onValueChange={handleOperatorChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select operator..." />
          </SelectTrigger>
          <SelectContent>
            {availableOperators.map((operator) => (
              <SelectItem key={operator.value} value={operator.value}>
                {operator.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {renderValueInput()}

      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
