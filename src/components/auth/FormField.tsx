import React from "react";
import type { ReactNode } from "react";
import {
  FormControl,
  FormDescription,
  FormField as HookFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldPath, FieldValues, ControllerRenderProps, FormState } from "react-hook-form";

interface FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  description?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  disabled?: boolean;
  className?: string;
  render?: (params: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: { invalid: boolean; error?: { message?: string } };
    formState: FormState<TFieldValues>;
  }) => ReactNode;
}

export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  disabled = false,
  className,
  render,
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <HookFormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          {render ? (
            render({ field, fieldState, formState })
          ) : (
            <FormControl>
              <Input type={type} placeholder={placeholder} disabled={disabled} {...field} />
            </FormControl>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
