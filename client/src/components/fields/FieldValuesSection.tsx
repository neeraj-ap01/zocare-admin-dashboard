import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, GripVertical } from "lucide-react";
import { CreateFieldType } from "./FieldTypeSelector";

interface FieldValue {
  id: string;
  value: string;
  label: string;
}

interface FieldValuesSectionProps {
  fieldType: CreateFieldType;
  values: FieldValue[];
  onChange: (values: FieldValue[]) => void;
}

export function FieldValuesSection({
  fieldType,
  values,
  onChange,
}: FieldValuesSectionProps) {
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");

  // Don't render for field types that don't need values
  if (fieldType === "TEXT" || fieldType === "NUMBER") {
    return null;
  }

  const addValue = () => {
    if (!newValue.trim()) return;

    const newFieldValue: FieldValue = {
      id: Date.now().toString(),
      value: newValue.trim(),
      label: newLabel.trim() || newValue.trim(),
    };

    onChange([...values, newFieldValue]);
    setNewValue("");
    setNewLabel("");
  };

  const removeValue = (id: string) => {
    onChange(values.filter((v) => v.id !== id));
  };

  const updateValue = (
    id: string,
    field: "value" | "label",
    newVal: string,
  ) => {
    onChange(values.map((v) => (v.id === id ? { ...v, [field]: newVal } : v)));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addValue();
    }
  };

  const getSectionTitle = () => {
    switch (fieldType) {
      case "DROPDOWN":
      case "MULTISELECT":
        return "Field Values";
      case "CHECKBOX":
        return "Field Option";
      case "RADIO":
        return "Field Values";
      default:
        return "Field Values";
    }
  };

  const getSectionDescription = () => {
    switch (fieldType) {
      case "DROPDOWN":
        return "Add the options that users can select from the dropdown";
      case "MULTISELECT":
        return "Add the options that users can select (multiple selections allowed)";
      case "CHECKBOX":
        return "Set the option label for this checkbox";
      case "RADIO":
        return "Add the radio button options that users can choose from";
      default:
        return "Add the available options for this field";
    }
  };

  const isCheckboxType = fieldType === "CHECKBOX";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{getSectionTitle()}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {getSectionDescription()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Values */}
        {values.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isCheckboxType ? "Option" : "Values"} ({values.length})
            </Label>
            <div className="space-y-2">
              {values.map((value, index) => (
                <div
                  key={value.id}
                  className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        placeholder="Value"
                        value={value.value}
                        onChange={(e) =>
                          updateValue(value.id, "value", e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Label (optional)"
                        value={value.label}
                        onChange={(e) =>
                          updateValue(value.id, "label", e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeValue(value.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Value Form */}
        {(!isCheckboxType || values.length === 0) && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Add {isCheckboxType ? "Option" : "New Value"}
            </Label>
            <div className="flex space-x-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  placeholder="Value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-sm"
                />
                <Input
                  placeholder="Label (optional)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-sm"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addValue}
                disabled={!newValue.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter or click + to add the value
            </p>
          </div>
        )}

        {/* Validation for required values */}
        {!isCheckboxType && values.length === 0 && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            💡 This field type requires at least one value to be functional
          </div>
        )}

        {isCheckboxType && values.length > 1 && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
            ⚠️ Checkbox fields typically have only one option. Consider using
            Radio or Multi-select for multiple options.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
