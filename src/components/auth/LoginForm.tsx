import React, { useState } from "react";
import { z } from "zod";

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Extended form errors type to include root error
type FormErrors = Partial<Record<keyof LoginFormData | "root", string>>;

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name: keyof LoginFormData, value: string) => {
    try {
      loginSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0]?.message;
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
        return false;
      }
      return true;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof LoginFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    const newErrors: FormErrors = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    } else {
      try {
        loginSchema.shape.email.parse(formData.email);
      } catch (error) {
        if (error instanceof z.ZodError) {
          newErrors.email = error.errors[0]?.message;
          isValid = false;
        }
      }
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    } else {
      try {
        loginSchema.shape.password.parse(formData.password);
      } catch (error) {
        if (error instanceof z.ZodError) {
          newErrors.password = error.errors[0]?.message;
          isValid = false;
        }
      }
    }

    // Update error state
    setErrors(newErrors);

    if (!isValid) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setErrors({
          root: "Invalid email or password",
        });
        return;
      }

      // Success - redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        root: error instanceof Error ? error.message : "Failed to login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.email ? "border-red-300" : ""
            }`}
            disabled={isLoading}
            data-testid="email-input"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600" data-testid="email-error" id="email-error">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.password ? "border-red-300" : ""
            }`}
            disabled={isLoading}
            data-testid="password-input"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600" data-testid="password-error" id="password-error">
              {errors.password}
            </p>
          )}
        </div>
      </div>

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

      {errors.root && (
        <div className="rounded-md bg-red-50 p-4" data-testid="login-error-message">
          <div className="flex">
            <div className="text-sm text-red-700">{errors.root}</div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isLoading}
          data-testid="login-submit-button"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                data-testid="loading-spinner"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500" data-testid="register-link">
            Register
          </a>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
