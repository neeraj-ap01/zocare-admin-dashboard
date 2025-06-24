import React, { useState, useMemo } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Type,
  AlignLeft,
  CheckSquare,
  Users,
  Hash,
  Plus,
  Search,
  Building,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { FormField } from "./DraggableField";
import { cn } from "@/lib/utils";

const availableFields: Omit<FormField, "id">[] = [
  {
    type: "select",
    label: "Action Set - TRD",
    placeholder: "Select action",
  },
  {
    type: "select",
    label: "Assignee",
    placeholder: "Select assignee",
  },
  {
    type: "text",
    label: "Business Area",
    placeholder: "Enter business area",
  },
  {
    type: "select",
    label: "Category Identifier",
    placeholder: "Select category",
  },
  {
    type: "text",
    label: "City",
    placeholder: "Enter city",
  },
  {
    type: "text",
    label: "Customer Confirmation",
    placeholder: "Enter confirmation details",
  },
  {
    type: "text",
    label: "FRT",
    placeholder: "Enter FRT",
  },
];

const fieldIcons = {
  text: Type,
  textarea: AlignLeft,
  checkbox: CheckSquare,
  select: Users,
  number: Hash,
};

interface FieldSuggestionPanelProps {
  onAddField: (field: FormField) => void;
}

export function FieldSuggestionPanel({
  onAddField,
}: FieldSuggestionPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredAndSortedFields = useMemo(() => {
    let filtered = availableFields.filter((field) =>
      field.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.label.localeCompare(b.label));
    } else if (sortBy === "date-modified") {
      // For demo purposes, we'll keep the original order for date modified
    } else if (sortBy === "date-created") {
      // For demo purposes, we'll reverse the order for date created
      filtered.reverse();
    }

    return filtered;
  }, [searchTerm, sortBy]);

  const generateFieldId = () => {
    return `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddField = (fieldTemplate: Omit<FormField, "id">) => {
    const newField: FormField = {
      ...fieldTemplate,
      id: generateFieldId(),
      isDefault: false,
      editable: true,
    };
    onAddField(newField);
  };

  return (
    <div className="w-80 bg-white border-l">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm mb-3">Available ticket fields</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add fields from here to the ticket form.
        </p>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search ticket fields"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by name</SelectItem>
              <SelectItem value="date-modified">
                Sort by date modified
              </SelectItem>
              <SelectItem value="date-created">Sort by date created</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4">
        {filteredAndSortedFields.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No available ticket fields</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAndSortedFields.map((field, index) => {
              const Icon = fieldIcons[field.type];
              return (
                <div
                  key={`${field.label}-${index}`}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{field.label}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddField(field)}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
