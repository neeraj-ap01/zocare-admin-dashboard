import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Type,
  AlignLeft,
  CheckSquare,
  Users,
  Hash,
  X,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormField {
  id: string;
  type: "text" | "textarea" | "checkbox" | "select" | "number";
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
  select: Users,
  number: Hash,
};

export function DraggableField({
  field,
  index,
  onRemove,
  onUpdate,
  isEditableForEndUsers,
}: DraggableFieldProps) {
  const Icon = fieldIcons[field.type];
  const canEdit =
    !field.isDefault || (field.isDefault && isEditableForEndUsers);

  return (
    <Draggable draggableId={field.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "bg-white border rounded-lg p-4 mb-3 group",
            snapshot.isDragging && "shadow-lg ring-2 ring-blue-500",
          )}
        >
          <div className="flex items-start gap-3">
            <div
              {...provided.dragHandleProps}
              className="mt-1 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-3 flex-1">
              <Icon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{field.label}</span>
              {field.required && (
                <span className="text-red-500 text-sm">*</span>
              )}
              {!canEdit && <Lock className="h-3 w-3 text-gray-400" />}
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {!field.isDefault && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(field.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
