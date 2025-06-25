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
  Clock,
  Mail,
  Phone,
  Upload,
  Link,
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
    | "date"
    | "email"
    | "phone"
    | "select"
    | "datetime"
    | "file"
    | "url";
  label: string;
  placeholder?: string;
  required?: boolean;
  isDefault?: boolean;
  editable?: boolean;
  options?: Array<{ value: string; label: string }>;
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
  email: Mail,
  phone: Phone,
  select: ChevronDown,
  datetime: Clock,
  file: Upload,
  url: Link,
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
        "bg-card border border-border rounded-lg p-4 group cursor-grab active:cursor-grabbing",
        "hover:shadow-sm hover:border-primary/50 transition-all duration-200",
        isDragging && "opacity-50 z-50",
      )}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="h-4 w-4 text-muted-foreground" />

        <div className="flex items-center gap-3 flex-1">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-card-foreground">
            {field.label}
          </span>
          {field.required && (
            <span className="text-destructive text-sm">*</span>
          )}
          {!canEdit && <Lock className="h-3 w-3 text-muted-foreground" />}
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
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
