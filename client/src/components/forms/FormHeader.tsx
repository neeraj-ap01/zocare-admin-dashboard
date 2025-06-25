import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Edit2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormHeaderProps {
  formName: string;
  onFormNameChange: (name: string) => void;
  onBack: () => void;
  onSave?: () => void;
  isActive?: boolean;
  isSaving?: boolean;
}

export function FormHeader({
  formName,
  onFormNameChange,
  onBack,
  onSave,
  isActive = true,
  isSaving = false,
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
    <div className="border-b bg-card">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 p-4 sm:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {isActive && (
            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">
              Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-semibold text-lg flex-1"
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
            <div className="flex items-center gap-2 flex-1">
              <h1 className="font-semibold text-lg flex-1 truncate">
                {formName}
              </h1>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onBack}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 flex-1"
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between p-4">
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
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">
                Active
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
