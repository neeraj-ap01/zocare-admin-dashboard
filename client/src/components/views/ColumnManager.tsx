import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { GripVertical, X } from "lucide-react";

interface Column {
  id: string;
  label: string;
  type: string;
}

interface ColumnManagerProps {
  columns: Column[];
  onChange: (columns: Column[]) => void;
  availableColumns: Column[];
}

interface SortableColumnItemProps {
  column: Column;
  onRemove: (id: string) => void;
}

function SortableColumnItem({ column, onRemove }: SortableColumnItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between rounded-lg border bg-background p-3 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <span className="font-medium">{column.label}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(column.id)}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ColumnManager({
  columns,
  onChange,
  availableColumns,
}: ColumnManagerProps) {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = columns.findIndex((column) => column.id === active.id);
      const newIndex = columns.findIndex((column) => column.id === over.id);

      onChange(arrayMove(columns, oldIndex, newIndex));
    }
  };

  const handleRemoveColumn = (columnId: string) => {
    onChange(columns.filter((column) => column.id !== columnId));
  };

  const handleAddColumn = (columnToAdd: Column) => {
    if (!columns.find((column) => column.id === columnToAdd.id)) {
      onChange([...columns, columnToAdd]);
    }
  };

  const unusedColumns = availableColumns.filter(
    (column) => !columns.find((c) => c.id === column.id),
  );

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">
          Columns ({columns.length} of {availableColumns.length})
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Choose which columns appear in your view. Drag and drop to reorder
          them.
        </p>
      </div>

      <div className="space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns}
            strategy={verticalListSortingStrategy}
          >
            {columns.map((column) => (
              <SortableColumnItem
                key={column.id}
                column={column}
                onRemove={handleRemoveColumn}
              />
            ))}
          </SortableContext>
        </DndContext>

        {columns.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No columns selected</p>
            <p className="text-sm">
              Add columns from the available options below
            </p>
          </div>
        )}
      </div>

      {unusedColumns.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-foreground mb-2">
            Add Column
          </h5>
          <div className="flex flex-wrap gap-2">
            {unusedColumns.map((column) => (
              <Button
                key={column.id}
                variant="outline"
                size="sm"
                onClick={() => handleAddColumn(column)}
                className="text-xs"
              >
                {column.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
