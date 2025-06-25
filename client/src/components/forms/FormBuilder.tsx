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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Info,
  PlusCircle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormBuilderProps {
  onBack: () => void;
  onSave?: () => void;
  isSaving?: boolean;
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
        opacity: "0.5",
      },
    },
  }),
};

export function FormBuilder({
  onBack,
  onSave,
  isSaving = false,
}: FormBuilderProps) {
  const [formName, setFormName] = useState("New form");
  const [titleName, setTitleName] = useState("New form");
  const [isEditableForEndUsers, setIsEditableForEndUsers] = useState(false);
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);

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

    // Add visual feedback when dragging suggestion field over form area
    if (
      active.id.toString().startsWith("suggestion-") &&
      over.id === "form-fields"
    ) {
      // Visual feedback will be handled by CSS hover states
    }
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
    // Check if field with same label already exists
    const fieldExists = fields.some(
      (existingField) => existingField.label === field.label,
    );
    if (!fieldExists) {
      setFields((prev) => [...prev, field]);
      setShowMobileSuggestions(false); // Close mobile panel after adding
    }
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
    <div className="min-h-screen bg-background">
      <FormHeader
        formName={formName}
        onFormNameChange={setFormName}
        onBack={onBack}
        onSave={onSave}
        isActive={true}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
          {/* Main Content Area */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="container-responsive card-responsive space-responsive">
              {/* Back Button - Mobile */}
              <Button
                variant="ghost"
                onClick={onBack}
                className="lg:hidden mb-4 p-0 h-auto text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Forms
              </Button>

              {/* Form Configuration */}
              <div className="space-y-4 sm:space-y-6">
                <Alert className="bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-responsive-body text-foreground">
                    Configure your form settings and drag fields from the panel
                    to customize the layout.
                  </AlertDescription>
                </Alert>

                {/* End User Settings */}
                <div className="space-y-4 p-4 sm:p-6 bg-muted/50 dark:bg-muted/20 rounded-lg border border-border">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="editable-for-end-users"
                        checked={isEditableForEndUsers}
                        onCheckedChange={setIsEditableForEndUsers}
                      />
                      <Label
                        htmlFor="editable-for-end-users"
                        className="text-responsive-body font-medium leading-none cursor-pointer"
                      >
                        Enable for end users
                      </Label>
                    </div>
                    <p className="text-responsive-caption text-muted-foreground">
                      Allow end users to select this form when submitting
                      tickets.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="title-name"
                      className="text-responsive-subtitle font-semibold"
                    >
                      Title shown to end users
                    </Label>
                    <Input
                      id="title-name"
                      type="text"
                      value={titleName}
                      onChange={(e) => setTitleName(e.target.value)}
                      disabled={!isEditableForEndUsers}
                      className="w-full bg-background disabled:opacity-50 text-responsive-body"
                      placeholder="Enter form title for end users"
                    />
                  </div>
                </div>

                {/* Add Field Button - Mobile */}
                <Button
                  onClick={() =>
                    setShowMobileSuggestions(!showMobileSuggestions)
                  }
                  variant="outline"
                  className="lg:hidden w-full btn-responsive"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {showMobileSuggestions ? "Hide" : "Add"} Fields
                </Button>

                {/* Form Fields Area */}
                <div className="space-y-3">
                  <h3 className="text-responsive-subtitle font-semibold text-foreground">
                    Form Fields ({fields.length})
                  </h3>

                  <div
                    id="form-fields"
                    className={cn(
                      "space-y-3 min-h-[300px] p-4 sm:p-6 border-2 border-dashed rounded-lg transition-all duration-200",
                      "border-border bg-card/50 dark:bg-card/20 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10",
                      fields.length === 0 && "flex items-center justify-center",
                    )}
                  >
                    <SortableContext
                      items={fields.map((field) => field.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {fields.length === 0 ? (
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 mx-auto bg-muted/70 dark:bg-muted/30 rounded-full flex items-center justify-center">
                            <PlusCircle className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-responsive-subtitle font-medium text-muted-foreground">
                              No custom fields added yet
                            </p>
                            <p className="text-responsive-caption text-muted-foreground">
                              Drag fields from the panel or use the "Add Fields"
                              button to get started
                            </p>
                          </div>
                        </div>
                      ) : (
                        fields.map((field, index) => (
                          <DraggableField
                            key={field.id}
                            field={field}
                            index={index}
                            onRemove={handleRemoveField}
                            onUpdate={handleUpdateField}
                            isEditableForEndUsers={isEditableForEndUsers}
                          />
                        ))
                      )}
                    </SortableContext>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Field Suggestions Panel */}
          <div
            className={cn(
              "order-1 lg:order-2 lg:block",
              showMobileSuggestions ? "block" : "hidden lg:block",
            )}
          >
            <FieldSuggestionPanel
              onAddField={handleAddField}
              addedFieldLabels={fields.map((field) => field.label)}
              isMobile={showMobileSuggestions}
              onClose={() => setShowMobileSuggestions(false)}
            />
          </div>
        </div>

        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeId ? (
            <div className="bg-card border-2 border-primary rounded-lg p-4 shadow-xl dark:shadow-2xl">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                {activeField ? (
                  <>
                    {(() => {
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
                      const Icon = fieldIcons[activeField.type];
                      return <Icon className="h-4 w-4 text-primary" />;
                    })()}
                    <span className="text-responsive-body font-medium text-card-foreground">
                      {activeField.label}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 bg-primary rounded" />
                    <span className="text-responsive-body font-medium text-card-foreground">
                      Field
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
