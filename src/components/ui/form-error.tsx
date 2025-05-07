import React from "react";
import { cn } from "@/lib/utils";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className={cn("rounded-md bg-red-50 p-4", className)}>
      <div className="flex">
        <div className="text-sm text-red-700">{message}</div>
      </div>
    </div>
  );
}
