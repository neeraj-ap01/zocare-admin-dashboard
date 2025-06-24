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
import { CsvUpload } from "./CsvUpload";
import { cn } from "@/lib/utils";

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
  onUpdate: (id: string, field: "value" | "label", value: string) => void;
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
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-2 bg-muted/50 rounded-md border"
    >
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 cursor-grab active:cursor-grabbing shrink-0"
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(id)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive shrink-0 sm:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="w-full">
          <Input
            placeholder="Value"
            value={value.value}
            onChange={(e) => onUpdate(id, "value", e.target.value)}
            className="h-8 text-sm w-full"
          />
        </div>
        <div className="w-full">
          <Input
            placeholder={isCheckboxType ? "Tag (optional)" : "Label"}
            value={value.label}
            onChange={(e) => onUpdate(id, "label", e.target.value)}
            className="h-8 text-sm w-full"
          />
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(id)}
        className="hidden sm:flex h-8 w-8 p-0 text-destructive hover:text-destructive shrink-0"
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
  const supportsCSVImport = ["DROPDOWN", "MULTISELECT", "RADIO"].includes(
    fieldType,
  );

  const handleCsvImport = (importedValues: FieldValue[]) => {
    // Merge with existing values or replace them
    onChange(importedValues);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">{getSectionTitle()}</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {getSectionDescription()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CSV Upload Section for supported field types */}
        {supportsCSVImport && (
          <>
            <CsvUpload
              onDataImported={handleCsvImport}
              fieldType={fieldType}
              currentValues={values}
            />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or add manually
                </span>
              </div>
            </div>
          </>
        )}

        {/* Existing Values */}
        {values.length > 0 && (
          <div className="space-y-3">
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
            <div className="flex flex-col sm:flex-row gap-2">
              {isCheckboxType ? (
                <Input
                  placeholder="Tag (optional)"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-sm flex-1 w-full"
                />
              ) : (
                <>
                  <Input
                    placeholder="Value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-sm flex-1 w-full"
                  />
                  <Input
                    placeholder="Label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-sm flex-1 w-full"
                  />
                </>
              )}
              <Button
                type="button"
                onClick={addValue}
                size="sm"
                disabled={!newValue.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto shrink-0"
              >
                <Plus className="h-4 w-4 mr-2 sm:mr-0" />
                <span className="sm:hidden">Add Value</span>
              </Button>
            </div>
          </div>
        )}

        {/* Default Value Selection */}
        {(fieldType === "DROPDOWN" || fieldType === "RADIO") &&
          values.length > 0 &&
          onDefaultValueChange && (
            <div className="space-y-2 pt-2 border-t">
              <Label className="text-sm font-medium">Default value</Label>
              <Select
                value={defaultValue || ""}
                onValueChange={onDefaultValueChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select default value (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No default value</SelectItem>
                  {values.map((value) => (
                    <SelectItem key={value.id} value={value.value}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
