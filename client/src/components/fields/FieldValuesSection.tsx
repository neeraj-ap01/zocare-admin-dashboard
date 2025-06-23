import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  defaultValue?: string;
  onDefaultValueChange?: (value: string) => void;
}

interface SortableItemProps {
  id: string;
  value: FieldValue;
  onUpdate: (id: string, field: "value" | "label", newVal: string) => void;
  onRemove: (id: string) => void;
  isCheckboxType: boolean;
}

function SortableItem({
  id,
  value,
  onUpdate,
  onRemove,
  isCheckboxType,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50"
    >
      <div {...attributes} {...listeners} className="cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2">
        <div>
          <Input
            placeholder="Value"
            value={value.value}
            onChange={(e) => onUpdate(id, "value", e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Input
            placeholder="Label (optional)"
            value={value.label}
            onChange={(e) => onUpdate(id, "label", e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(id)}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function FieldValuesSection({
  fieldType,
  values,
  onChange,
  defaultValue,
  onDefaultValueChange,
}: FieldValuesSectionProps) {
  const [newValue, setNewValue] = React.useState("");
  const [newLabel, setNewLabel] = React.useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = values.findIndex((item) => item.id === active.id);
      const newIndex = values.findIndex((item) => item.id === over?.id);

      onChange(arrayMove(values, oldIndex, newIndex));
    }
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
        return "Field values";
      case "CHECKBOX":
        return "Field option";
      case "RADIO":
        return "Field values";
      default:
        return "Field values";
    }
  };

  const getSectionDescription = () => {
    switch (fieldType) {
      case "DROPDOWN":
        return "Add the options that users can select from the dropdown";
      case "MULTISELECT":
        return "Add the options that users can select (multiple selections allowed)";
      case "CHECKBOX":
        return "Add a tag to the check to filter your views, triggers, and automations";
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={values.map((v) => v.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {values.map((value) => (
                    <SortableItem
                      key={value.id}
                      id={value.id}
                      value={value}
                      onUpdate={updateValue}
                      onRemove={removeValue}
                      isCheckboxType={isCheckboxType}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Add New Value Form */}
        {(!isCheckboxType || values.length === 0) && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {isCheckboxType ? "Tag (optional)" : "Add new value"}
            </Label>
            <div className="flex space-x-2">
              {isCheckboxType ? (
                <Input
                  placeholder="Tag (optional)"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-sm flex-1"
                />
              ) : (
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
              )}
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

        {/* Default Value for Dropdown */}
        {fieldType === "DROPDOWN" && values.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Default value</Label>
            <Select value={defaultValue} onValueChange={onDefaultValueChange}>
              <SelectTrigger>
                <SelectValue placeholder="(Select a value)" />
              </SelectTrigger>
              <SelectContent>
                {values.map((value) => (
                  <SelectItem key={value.id} value={value.value}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Specifies which value the field has by default
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
