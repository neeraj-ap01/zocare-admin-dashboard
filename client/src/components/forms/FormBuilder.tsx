import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { FormHeader } from "./FormHeader";
import { DraggableField, FormField } from "./DraggableField";
import { FieldSuggestionPanel } from "./FieldSuggestionPanel";

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

export function FormBuilder({ onBack }: FormBuilderProps) {
  const [formName, setFormName] = useState("New form");
  const [isEditableForEndUsers, setIsEditableForEndUsers] = useState(false);
  const [fields, setFields] = useState<FormField[]>(defaultFields);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFields(items);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <FormHeader
        formName={formName}
        onFormNameChange={setFormName}
        isEditableForEndUsers={isEditableForEndUsers}
        onEditableForEndUsersChange={setIsEditableForEndUsers}
        onBack={onBack}
        isActive={true}
      />

      <div className="flex">
        <div className="flex-1">
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Enable end users to select this form when submitting a ticket.
              </p>
              <h2 className="text-lg font-semibold mt-2 mb-1">
                Title shown to end users
              </h2>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                disabled={!isEditableForEndUsers}
                className="w-full p-2 border rounded-md bg-gray-50 text-gray-900 disabled:opacity-50"
              />
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="form-fields">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-0"
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
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        <FieldSuggestionPanel onAddField={handleAddField} />
      </div>
    </div>
  );
}
