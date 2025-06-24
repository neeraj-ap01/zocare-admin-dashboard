import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { ConditionRow } from "./ConditionRow";
import { ColumnManager } from "./ColumnManager";
import { FilterCondition } from "@/types";

interface CreateViewProps {
  onBack: () => void;
  onSave: (viewData: ViewFormData) => void;
  isLoading?: boolean;
}

interface ViewFormData {
  title: string;
  description: string;
  whoHasAccess: string;
  conditions: {
    allConditions: FilterCondition[];
    anyConditions: FilterCondition[];
  };
  columns: Array<{ id: string; label: string; type: string }>;
  groupBy: string;
  orderBy: string;
  sortDirection: "asc" | "desc";
}

// Available columns for the view
const AVAILABLE_COLUMNS = [
  { id: "satisfaction", label: "Satisfaction", type: "rating" },
  { id: "subject", label: "Subject", type: "text" },
  { id: "requester", label: "Requester", type: "user" },
  { id: "request_date", label: "Request date", type: "date" },
  { id: "assignee", label: "Assignee", type: "user" },
  { id: "status", label: "Status", type: "select" },
  { id: "priority", label: "Priority", type: "select" },
  { id: "group", label: "Group", type: "select" },
  { id: "tags", label: "Tags", type: "multiselect" },
  { id: "created_at", label: "Created", type: "date" },
  { id: "updated_at", label: "Updated", type: "date" },
];

const WHO_HAS_ACCESS_OPTIONS = [
  { value: "any_agent", label: "Any agent" },
  { value: "specific_agents", label: "Specific agents" },
  { value: "groups", label: "Groups" },
  { value: "only_me", label: "Only me" },
];

const GROUP_BY_OPTIONS = [
  { value: "", label: "(No group)" },
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "assignee", label: "Assignee" },
  { value: "group", label: "Group" },
  { value: "requester", label: "Requester" },
];

const ORDER_BY_OPTIONS = [
  { value: "id", label: "ID" },
  { value: "created_at", label: "Created" },
  { value: "updated_at", label: "Updated" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "assignee", label: "Assignee" },
];

export function CreateView({
  onBack,
  onSave,
  isLoading = false,
}: CreateViewProps) {
  const [formData, setFormData] = useState<ViewFormData>({
    title: "",
    description: "",
    whoHasAccess: "any_agent",
    conditions: {
      allConditions: [],
      anyConditions: [],
    },
    columns: [
      { id: "satisfaction", label: "Satisfaction", type: "rating" },
      { id: "subject", label: "Subject", type: "text" },
      { id: "requester", label: "Requester", type: "user" },
      { id: "request_date", label: "Request date", type: "date" },
      { id: "assignee", label: "Assignee", type: "user" },
    ],
    groupBy: "",
    orderBy: "id",
    sortDirection: "asc",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateId = () =>
    `condition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleAddCondition = (type: "allConditions" | "anyConditions") => {
    const newCondition: FilterCondition = {
      id: generateId(),
      fieldId: "",
      operator: "equals",
      value: "",
    };

    setFormData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [type]: [...prev.conditions[type], newCondition],
      },
    }));
  };

  const handleUpdateCondition = (
    type: "allConditions" | "anyConditions",
    index: number,
    condition: FilterCondition,
  ) => {
    setFormData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [type]: prev.conditions[type].map((c, i) =>
          i === index ? condition : c,
        ),
      },
    }));
  };

  const handleRemoveCondition = (
    type: "allConditions" | "anyConditions",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [type]: prev.conditions[type].filter((_, i) => i !== index),
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (formData.columns.length === 0) {
      newErrors.columns = "At least one column must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handlePreview = () => {
    // Implement preview functionality
    console.log("Preview view with data:", formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">New view</h1>
          {errors.title && (
            <div className="flex items-center gap-1 text-amber-600 text-sm mt-1">
              <AlertTriangle className="h-3 w-3" />
              <span>Title required</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter view title"
                  className={errors.title ? "border-destructive" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what this view shows"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="access">Who has access</Label>
                <Select
                  value={formData.whoHasAccess}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, whoHasAccess: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WHO_HAS_ACCESS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Conditions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Control what appears in your view by using <strong>All</strong>{" "}
                and <strong>Any</strong> conditions.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* All Conditions */}
              <div>
                <p className="text-sm font-medium mb-3">
                  Tickets must meet all of these conditions to appear in the
                  view
                </p>
                <div className="space-y-2">
                  {formData.conditions.allConditions.map((condition, index) => (
                    <ConditionRow
                      key={condition.id}
                      condition={condition}
                      onChange={(updatedCondition) =>
                        handleUpdateCondition(
                          "allConditions",
                          index,
                          updatedCondition,
                        )
                      }
                      onRemove={() =>
                        handleRemoveCondition("allConditions", index)
                      }
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCondition("allConditions")}
                    className="mt-2"
                  >
                    Add condition
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Any Conditions */}
              <div>
                <p className="text-sm font-medium mb-3">
                  Tickets can meet any of these conditions to appear in the view
                </p>
                <div className="space-y-2">
                  {formData.conditions.anyConditions.map((condition, index) => (
                    <ConditionRow
                      key={condition.id}
                      condition={condition}
                      onChange={(updatedCondition) =>
                        handleUpdateCondition(
                          "anyConditions",
                          index,
                          updatedCondition,
                        )
                      }
                      onRemove={() =>
                        handleRemoveCondition("anyConditions", index)
                      }
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCondition("anyConditions")}
                    className="mt-2"
                  >
                    Add condition
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formatting Options */}
          <Card>
            <CardHeader>
              <CardTitle>Formatting options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Columns */}
              <div>
                {errors.columns && (
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{errors.columns}</AlertDescription>
                  </Alert>
                )}
                <ColumnManager
                  columns={formData.columns}
                  onChange={(columns) =>
                    setFormData((prev) => ({ ...prev, columns }))
                  }
                  availableColumns={AVAILABLE_COLUMNS}
                />
              </div>

              <Separator />

              {/* Group By and Order By */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Group by</Label>
                    <Select
                      value={formData.groupBy}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, groupBy: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GROUP_BY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sort Direction</Label>
                    <RadioGroup
                      value={formData.sortDirection}
                      onValueChange={(value: "asc" | "desc") =>
                        setFormData((prev) => ({
                          ...prev,
                          sortDirection: value,
                        }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="asc" id="asc" />
                        <Label htmlFor="asc">Ascending</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Order by</Label>
                    <Select
                      value={formData.orderBy}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, orderBy: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_BY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <RadioGroup
                      value={formData.sortDirection}
                      onValueChange={(value: "asc" | "desc") =>
                        setFormData((prev) => ({
                          ...prev,
                          sortDirection: value,
                        }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="desc" id="desc" />
                        <Label htmlFor="desc">Descending</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                A sneak peek at how your conditions might work together to
                filter tickets.
              </p>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={handlePreview}
                className="w-full"
                disabled={isLoading}
              >
                Preview
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Creating..." : "Create view"}
        </Button>
      </div>
    </div>
  );
}
