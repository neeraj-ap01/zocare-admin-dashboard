import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Type,
  ChevronDown,
  Hash,
  CheckSquare,
  List,
  CircleDot,
} from "lucide-react";

export type CreateFieldType =
  | "TEXT"
  | "DROPDOWN"
  | "NUMBER"
  | "CHECKBOX"
  | "MULTISELECT"
  | "RADIO";

interface FieldTypeOption {
  type: CreateFieldType;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

const fieldTypeOptions: FieldTypeOption[] = [
  {
    type: "TEXT",
    label: "Text",
    description: "Single line text input for short responses",
    icon: Type,
  },
  {
    type: "DROPDOWN",
    label: "Dropdown",
    description: "Single selection from a list of predefined options",
    icon: ChevronDown,
  },
  {
    type: "NUMBER",
    label: "Number",
    description: "Numeric input field with validation",
    icon: Hash,
  },
  {
    type: "CHECKBOX",
    label: "Checkbox",
    description: "Single checkbox for yes/no or true/false values",
    icon: CheckSquare,
  },
  {
    type: "MULTISELECT",
    label: "Multi-select",
    description: "Multiple selections from a list of options",
    icon: List,
  },
  {
    type: "RADIO",
    label: "Radio",
    description: "Single selection from a group of radio buttons",
    icon: CircleDot,
  },
];

interface FieldTypeSelectorProps {
  onSelect: (type: CreateFieldType) => void;
  onCancel: () => void;
}

export function FieldTypeSelector({
  onSelect,
  onCancel,
}: FieldTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Select Field Type</h3>
        <p className="text-sm text-muted-foreground">
          Choose the type of field you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fieldTypeOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Card
              key={option.type}
              className="cursor-pointer transition-all hover:shadow-md hover:border-zocare/50"
              onClick={() => onSelect(option.type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zocare/10">
                    <IconComponent className="h-4 w-4 text-zocare" />
                  </div>
                  <CardTitle className="text-sm">{option.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs">
                  {option.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
