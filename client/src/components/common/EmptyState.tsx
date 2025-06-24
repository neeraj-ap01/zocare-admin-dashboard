import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6",
        className,
      )}
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-muted flex items-center justify-center mb-4 sm:mb-6">
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-muted-foreground" />
      </div>
      <h3 className="text-responsive-subtitle text-foreground mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-responsive-body text-muted-foreground mb-6 sm:mb-8 max-w-sm sm:max-w-md lg:max-w-lg">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || "default"}
          className={cn(
            "btn-responsive",
            action.variant === "default" &&
              "bg-primary hover:bg-primary/90 text-primary-foreground",
          )}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
