import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Type,
  AlignLeft,
  CheckSquare,
  ChevronDown,
  List,
  Circle,
  Hash,
  Calendar,
  X,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormField {
  id: string;
  type:
    | "text"
    | "textarea"
    | "checkbox"
    | "dropdown"
    | "multiselect"
    | "radio"
    | "number"
    | "date";
  label: string;
  placeholder?: string;
  required?: boolean;
  isDefault?: boolean;
  editable?: boolean;
}

interface DraggableFieldProps {
  field: FormField;
  index: number;
  onRemove: (fieldId: string) => void;
  onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  isEditableForEndUsers: boolean;
}

const fieldIcons = {
  text: Type,
  textarea: AlignLeft,
  checkbox: CheckSquare,
  dropdown: ChevronDown,
  multiselect: List,
  radio: Circle,
  number: Hash,
  date: Calendar,
};

export function DraggableField({
  field,
  index,
  onRemove,
  onUpdate,
  isEditableForEndUsers,
}: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = fieldIcons[field.type];
  const canEdit =
    !field.isDefault || (field.isDefault && isEditableForEndUsers);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-white border rounded-lg p-4 group cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 z-50",
        !isDragging && "hover:shadow-sm hover:border-gray-300",
      )}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="h-4 w-4 text-gray-400" />

        <div className="flex items-center gap-3 flex-1">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">{field.label}</span>
          {field.required && <span className="text-red-500 text-sm">*</span>}
          {!canEdit && <Lock className="h-3 w-3 text-gray-400" />}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!field.isDefault && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(field.id);
              }}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
