import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormField } from "./DraggableField";
import {
  Type,
  AlignLeft,
  Hash,
  Mail,
  Phone,
  Calendar,
  Clock,
  ChevronDown,
  List,
  CheckSquare,
  Circle,
  Upload,
  Link,
  GripVertical,
  X,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldSuggestionPanelProps {
  onAddField: (field: FormField) => void;
  addedFieldLabels: string[];
  isMobile?: boolean;
  onClose?: () => void;
}

const suggestedFields: Omit<FormField, "id">[] = [
  {
    type: "text",
    label: "Customer Name",
    placeholder: "Enter full name",
    required: false,
    isDefault: false,
    editable: true,
  },
  {
    type: "email",
    label: "Email Address",
    placeholder: "customer@example.com",
    required: true,
    isDefault: false,
    editable: true,
  },
  {
    type: "phone",
    label: "Phone Number",
    placeholder: "+1 (555) 000-0000",
    required: false,
    isDefault: false,
    editable: true,
  },
  {
    type: "dropdown",
    label: "Priority",
    placeholder: "Select priority level",
    required: true,
    isDefault: false,
    editable: true,
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "urgent", label: "Urgent" },
    ],
  },
  {
    type: "dropdown",
    label: "Department",
    placeholder: "Select department",
    required: false,
    isDefault: false,
    editable: true,
    options: [
      { value: "support", label: "Technical Support" },
      { value: "billing", label: "Billing" },
      { value: "sales", label: "Sales" },
      { value: "general", label: "General Inquiry" },
    ],
  },
  {
    type: "multiselect",
    label: "Affected Services",
    placeholder: "Select affected services",
    required: false,
    isDefault: false,
    editable: true,
    options: [
      { value: "web", label: "Website" },
      { value: "mobile", label: "Mobile App" },
      { value: "api", label: "API" },
      { value: "dashboard", label: "Dashboard" },
    ],
  },
  {
    type: "radio",
    label: "Issue Type",
    placeholder: "",
    required: true,
    isDefault: false,
    editable: true,
    options: [
      { value: "bug", label: "Bug Report" },
      { value: "feature", label: "Feature Request" },
      { value: "question", label: "Question" },
      { value: "other", label: "Other" },
    ],
  },
  {
    type: "textarea",
    label: "Additional Comments",
    placeholder: "Please provide any additional details...",
    required: false,
    isDefault: false,
    editable: true,
  },
  {
    type: "number",
    label: "Order Number",
    placeholder: "Enter order number",
    required: false,
    isDefault: false,
    editable: true,
  },
  {
    type: "date",
    label: "Incident Date",
    placeholder: "When did this occur?",
    required: false,
    isDefault: false,
    editable: true,
  },
  {
    type: "date",
    label: "Preferred Contact Date",
    placeholder: "When can we reach you?",
    required: false,
    isDefault: false,
    editable: true,
  },
  {
    type: "checkbox",
    label: "Subscribe to Updates",
    placeholder: "",
    required: false,
    isDefault: false,
    editable: true,
  },
  {
    type: "text",
    label: "Attachments",
    placeholder: "Upload relevant files",
    required: false,
    isDefault: false,
    editable: true,
  },
  {
    type: "text",
    label: "Related URL",
    placeholder: "https://example.com",
    required: false,
    isDefault: false,
    editable: true,
  },
];

const fieldIcons = {
  text: Type,
  textarea: AlignLeft,
  number: Hash,
  email: Mail,
  phone: Phone,
  date: Calendar,
  datetime: Clock,
  dropdown: ChevronDown,
  multiselect: List,
  checkbox: CheckSquare,
  radio: Circle,
  file: Upload,
  url: Link,
};

interface DraggableFieldItemProps {
  field: Omit<FormField, "id">;
  isAdded: boolean;
  onAdd: () => void;
  isMobile?: boolean;
}

function DraggableFieldItem({
  field,
  isAdded,
  onAdd,
  isMobile,
}: DraggableFieldItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `suggestion-${field.label}`,
    data: { field },
    disabled: isAdded || isMobile,
  });

  const Icon = fieldIcons[field.type];

  const handleClick = () => {
    if (!isAdded) {
      onAdd();
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group p-3 sm:p-4 bg-card border border-border rounded-lg transition-all duration-200",
        !isAdded &&
          !isMobile &&
          "cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-sm",
        !isAdded &&
          isMobile &&
          "cursor-pointer hover:border-primary/50 hover:shadow-sm",
        isAdded && "opacity-50 cursor-not-allowed bg-muted/50",
        isDragging && "opacity-50 scale-95",
      )}
      {...attributes}
      {...(!isMobile ? listeners : {})}
      onClick={isMobile ? handleClick : undefined}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm sm:text-base font-medium text-card-foreground truncate">
              {field.label}
            </h4>
            {!isMobile && !isAdded && (
              <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
            {field.placeholder || `${field.type} field`}
          </p>

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {field.type}
            </Badge>

            {isMobile && !isAdded && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
                className="h-7 w-7 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            )}

            {isAdded && (
              <Badge className="bg-primary/20 text-primary text-xs">
                Added
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FieldSuggestionPanel({
  onAddField,
  addedFieldLabels,
  isMobile = false,
  onClose,
}: FieldSuggestionPanelProps) {
  const handleAddField = (field: Omit<FormField, "id">) => {
    const newField: FormField = {
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    onAddField(newField);
  };

  return (
    <div
      className={cn(
        "bg-background border-l border-border dark:bg-background",
        isMobile
          ? "fixed inset-0 z-50 bg-background dark:bg-background"
          : "w-80 xl:w-96 2xl:w-[400px] flex-shrink-0",
      )}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-responsive-subtitle font-semibold text-foreground">
                Available Fields
              </h3>
              <p className="text-responsive-caption text-muted-foreground mt-1">
                {isMobile
                  ? "Tap to add fields"
                  : "Drag to add fields to your form"}
              </p>
            </div>
            {isMobile && onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Fields List */}
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {suggestedFields.map((field) => (
              <DraggableFieldItem
                key={field.label}
                field={field}
                isAdded={addedFieldLabels.includes(field.label)}
                onAdd={() => handleAddField(field)}
                isMobile={isMobile}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        {isMobile && (
          <div className="p-4 border-t border-border">
            <Button variant="outline" onClick={onClose} className="w-full">
              Done Adding Fields
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
