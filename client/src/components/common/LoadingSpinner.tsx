import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "primary" | "muted" | "foreground";
}

export function LoadingSpinner({
  size = "md",
  className,
  text,
  variant = "primary",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  };

  const variantClasses = {
    primary: "text-primary",
    muted: "text-muted-foreground",
    foreground: "text-foreground",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant],
        )}
      />
      {text && (
        <p
          className={cn(
            "mt-2 sm:mt-3 text-muted-foreground text-center",
            textSizeClasses[size],
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export function PageLoadingSpinner({
  text = "Loading...",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] flex items-center justify-center",
        className,
      )}
    >
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function InlineLoadingSpinner({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center py-4", className)}>
      <LoadingSpinner size="sm" text={text} />
    </div>
  );
}
