import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
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

export function FormBuilder({ onBack }: FormBuilderProps) {
  const [formName, setFormName] = useState("New form");
  const [titleName, setTitleName] = useState("New form");
  const [isEditableForEndUsers, setIsEditableForEndUsers] = useState(false);
  const [fields, setFields] = useState<FormField[]>(defaultFields);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Handle drag from suggestion panel to form
    if (
      result.source.droppableId === "field-suggestions" &&
      result.destination.droppableId === "form-fields"
    ) {
      const suggestionIndex = result.source.index;
      // You'd need to get the field from FieldSuggestionPanel context here
      // For now, this will be handled by the existing add field mechanism
      return;
    }

    // Handle reordering within form fields
    if (
      result.source.droppableId === "form-fields" &&
      result.destination.droppableId === "form-fields"
    ) {
      const items = Array.from(fields);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setFields(items);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <FormHeader
        formName={formName}
        onFormNameChange={setFormName}
        onBack={onBack}
        isActive={true}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
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
            </div>
          </div>

          <FieldSuggestionPanel onAddField={handleAddField} />
        </div>
      </DragDropContext>
    </div>
  );
}
