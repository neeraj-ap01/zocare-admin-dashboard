import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FormHeader } from "./FormHeader";
import { DraggableField, FormField } from "./DraggableField";
import { FieldSuggestionPanel } from "./FieldSuggestionPanel";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface FormBuilderProps {
  onBack: () => void;
}

const defaultFields: FormField[] = [
  {
    id: "subject",
    type: "text",
    label: "Subject",
    placeholder: "System field",
    required: true,
    isDefault: true,
    editable: false,
  },
  {
    id: "description",
    type: "textarea",
    label: "Description",
    placeholder: "System field",
    required: true,
    isDefault: true,
    editable: false,
  },
];

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export function FormBuilder({ onBack }: FormBuilderProps) {
  const [formName, setFormName] = useState("New form");
  const [titleName, setTitleName] = useState("New form");
  const [isEditableForEndUsers, setIsEditableForEndUsers] = useState(false);
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle dragging from suggestion panel to form
    if (active.id.toString().startsWith("suggestion-")) {
      const fieldData = active.data.current?.field as Omit<FormField, "id">;
      if (fieldData) {
        // Check if dropping on the form area or any form field
        const isDropOnForm =
          over.id === "form-fields" ||
          fields.some((field) => field.id === over.id);

        if (isDropOnForm) {
          const newField: FormField = {
            ...fieldData,
            id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            isDefault: false,
            editable: true,
          };
          setFields((prev) => [...prev, newField]);
        }
      }
      return;
    }

    // Handle reordering within form fields
    if (
      active.id !== over.id &&
      fields.some((field) => field.id === active.id)
    ) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const handleAddField = (field: FormField) => {
    setFields((prev) => [...prev, field]);
  };

  const handleRemoveField = (fieldId: string) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId));
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field,
      ),
    );
  };

  const activeField = fields.find((field) => field.id === activeId);

  return (
    <div className="min-h-screen bg-gray-50">
      <FormHeader
        formName={formName}
        onFormNameChange={setFormName}
        onBack={onBack}
        isActive={true}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex">
          <div className="flex-1">
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Enable end users to select this form when submitting a ticket.
                </p>
                <div className="mt-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="editable-for-end-users"
                      checked={isEditableForEndUsers}
                      onCheckedChange={setIsEditableForEndUsers}
                    />
                    <label
                      htmlFor="editable-for-end-users"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Editable for end users
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Enable end users to select this form when submitting a
                    ticket.
                  </p>
                </div>
                <h2 className="text-lg font-semibold mt-2 mb-1">
                  Title shown to end users
                </h2>
                <Input
                  type="text"
                  value={titleName}
                  onChange={(e) => setTitleName(e.target.value)}
                  disabled={!isEditableForEndUsers}
                  className="w-full bg-gray-50 disabled:opacity-50"
                  placeholder="Default Ticket Form"
                />
              </div>

              <SortableContext
                items={fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  id="form-fields"
                  className="space-y-2 min-h-[200px] p-4 border-2 border-dashed border-gray-200 rounded-lg bg-white/50"
                >
                  {fields.map((field, index) => (
                    <DraggableField
                      key={field.id}
                      field={field}
                      index={index}
                      onRemove={handleRemoveField}
                      onUpdate={handleUpdateField}
                      isEditableForEndUsers={isEditableForEndUsers}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          </div>

          <FieldSuggestionPanel onAddField={handleAddField} />
        </div>

        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeField ? (
            <div className="bg-white border rounded-lg p-4 shadow-lg opacity-90 transform rotate-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-400 rounded" />
                <span className="text-sm font-medium">{activeField.label}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
