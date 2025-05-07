import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { FormField } from "@/components/auth/FormField";
import { PasswordResetSuccess } from "@/components/auth/PasswordResetSuccess";
import { InvalidTokenMessage } from "@/components/auth/InvalidTokenMessage";
import { LoadingButton } from "@/components/ui/loading-button";
import { FormError } from "@/components/ui/form-error";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validations/auth";

interface ResetPasswordFormProps {
  token?: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) return;

    setIsLoading(true);
    setServerError(null);

    try {
      // In a real implementation, this would call an API endpoint with the token
      console.log("Reset password form submitted", { token, ...data });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setIsSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
      setServerError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Show success message if the password was reset successfully
  if (isSuccess) {
    return <PasswordResetSuccess />;
  }

  // Show error message if the token is invalid or missing
  if (!token) {
    return <InvalidTokenMessage />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          disabled={isLoading}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          label="Confirm New Password"
          type="password"
          placeholder="Confirm your new password"
          disabled={isLoading}
        />

        <FormError message={serverError || undefined} />

        <div>
          <LoadingButton type="submit" className="w-full" isLoading={isLoading} loadingText="Resetting password...">
            Reset Password
          </LoadingButton>
        </div>

        <div className="text-center">
          <span className="text-sm text-gray-500">
            Remember your password?{" "}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </span>
        </div>
      </form>
    </Form>
  );
}
