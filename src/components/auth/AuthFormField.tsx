import React from "react";
import type { ReactNode } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface AuthFormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  "data-testid"?: string;
  autoComplete?: string;
  className?: string;
  children?: ReactNode;
}

export function AuthFormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  description,
  disabled = false,
  "data-testid": testId,
  autoComplete,
  className,
  children,
}: AuthFormFieldProps<TFieldValues, TName>) {
  const inputTestId = testId || `${String(name)}-input`;
  const errorTestId = `${String(name)}-error`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FormLabel htmlFor={field.name}>{label}</FormLabel>
          <FormControl>
            {children || (
              <Input
                id={field.name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                data-testid={inputTestId}
                aria-invalid={!!fieldState.error}
                aria-describedby={fieldState.error ? errorTestId : undefined}
                {...field}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage data-testid={errorTestId} id={errorTestId} />
        </FormItem>
      )}
    />
  );
}
