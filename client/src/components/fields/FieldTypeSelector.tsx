import * as React from "react";
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
import { cn } from "@/lib/utils";

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
  color: string;
}

const fieldTypeOptions: FieldTypeOption[] = [
  {
    type: "TEXT",
    label: "Text",
    description: "Single line text input for short responses",
    icon: Type,
    color: "primary",
  },
  {
    type: "DROPDOWN",
    label: "Dropdown",
    description: "Single selection from a list of predefined options",
    icon: ChevronDown,
    color: "success",
  },
  {
    type: "NUMBER",
    label: "Number",
    description: "Numeric input field with validation",
    icon: Hash,
    color: "warning",
  },
  {
    type: "CHECKBOX",
    label: "Checkbox",
    description: "Single checkbox for yes/no or true/false values",
    icon: CheckSquare,
    color: "info",
  },
  {
    type: "MULTISELECT",
    label: "Multi-select",
    description: "Multiple selections from a list of options",
    icon: List,
    color: "purple",
  },
  {
    type: "RADIO",
    label: "Radio",
    description: "Single selection from a group of radio buttons",
    icon: CircleDot,
    color: "secondary",
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
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-responsive-subtitle text-foreground">
          Select Field Type
        </h3>
        <p className="text-responsive-body text-muted-foreground">
          Choose the type of field you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {fieldTypeOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Card
              key={option.type}
              className={cn(
                "cursor-pointer transition-all duration-200 border border-border bg-card",
                "hover:shadow-lg hover:border-primary/50 hover:bg-accent/5",
                "active:scale-[0.98] touch-manipulation",
              )}
              onClick={() => onSelect(option.type)}
            >
              <CardHeader className="pb-2 sm:pb-3 p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg shrink-0",
                      option.color === "primary" &&
                        "bg-primary/10 text-primary",
                      option.color === "success" &&
                        "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
                      option.color === "warning" &&
                        "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
                      option.color === "info" &&
                        "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                      option.color === "purple" &&
                        "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
                      option.color === "secondary" &&
                        "bg-muted text-muted-foreground",
                    )}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
                    {option.label}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 p-4">
                <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onCancel}
          className="order-2 sm:order-1 w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
