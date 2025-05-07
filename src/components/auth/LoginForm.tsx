import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, type LoginFormData, loginSchema } from "@/components/hooks/useAuth";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { AuthError } from "@/components/auth/AuthError";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { Form } from "@/components/ui/form";

const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="login-form" noValidate>
        <AuthFormField
          control={form.control}
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          disabled={isLoading}
          data-testid="email-input"
        />

        <AuthFormField
          control={form.control}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          disabled={isLoading}
          data-testid="password-input"
        />

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a
              href="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              data-testid="forgot-password-link"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <AuthError error={error} data-testid="login-error-message" />

        <div>
          <LoadingButton
            type="submit"
            className="w-full justify-center"
            isLoading={isLoading}
            loadingText="Signing in..."
            data-testid="login-submit-button"
          >
            Sign in
          </LoadingButton>
        </div>

        <div className="text-center">
          <span className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              data-testid="register-link"
            >
              Register
            </a>
          </span>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
