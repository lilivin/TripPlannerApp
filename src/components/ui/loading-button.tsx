import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function LoadingButton({
  children,
  className,
  isLoading,
  loadingText,
  disabled,
  variant = "default",
  size = "default",
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={cn("relative", className)}
      disabled={isLoading || disabled}
      variant={variant}
      size={size}
      {...props}
    >
      <div
        className={cn("flex items-center justify-center", {
          "opacity-0": isLoading,
        })}
      >
        {children}
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </div>
      )}
    </Button>
  );
}
