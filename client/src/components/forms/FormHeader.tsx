import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Edit2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormHeaderProps {
  formName: string;
  onFormNameChange: (name: string) => void;
  isEditableForEndUsers: boolean;
  onEditableForEndUsersChange: (editable: boolean) => void;
  onBack: () => void;
  isActive?: boolean;
}

export function FormHeader({
  formName,
  onFormNameChange,
  isEditableForEndUsers,
  onEditableForEndUsersChange,
  onBack,
  isActive = true,
}: FormHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(formName);

  const handleSave = () => {
    onFormNameChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(formName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center justify-between border-b bg-white p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-semibold text-lg"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg">{formName}</h1>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isActive && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              Active
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="editable-for-end-users"
            checked={isEditableForEndUsers}
            onCheckedChange={onEditableForEndUsersChange}
          />
          <label
            htmlFor="editable-for-end-users"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Editable for end users
          </label>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
        </div>
      </div>
    </div>
  );
}
