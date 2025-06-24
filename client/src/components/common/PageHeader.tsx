import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8",
        className,
      )}
    >
      <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <h1 className="text-responsive-title text-foreground">{title}</h1>
          {badge && (
            <Badge
              variant={badge.variant || "default"}
              className="self-start sm:self-auto"
            >
              {badge.text}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-responsive-body text-muted-foreground max-w-none sm:max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
