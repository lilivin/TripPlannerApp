import React, { useState, useEffect } from "react";
import { z } from "zod";

// Reset password form validation schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirm: z.string().min(6, "Password confirmation must be at least 6 characters"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

// Individual field schemas for field-level validation
const fieldSchemas = {
  password: z.string().min(6, "Password must be at least 6 characters"),
  passwordConfirm: z.string().min(6, "Password confirmation must be at least 6 characters"),
};

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Extended form errors type to include root error
type FormErrors = Partial<Record<keyof ResetPasswordFormData | "root" | "token", string>>;

interface ResetPasswordFormProps {
  token?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check token on component mount
  useEffect(() => {
    if (!token) {
      setErrors({ token: "Invalid or missing reset token. Please request a new password reset link." });
    }
  }, [token]);

  const validateField = (name: keyof ResetPasswordFormData, value: string) => {
    try {
      if (name === "passwordConfirm") {
        // Special case for password confirmation
        fieldSchemas.passwordConfirm.parse(value);
        if (formData.password !== value) {
          throw new z.ZodError([
            {
              code: "custom",
              message: "Passwords don't match",
              path: ["passwordConfirm"],
            },
          ]);
        }
      } else {
        fieldSchemas[name].parse(value);
      }
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

    // Special handling for password confirmation to validate on every change
    if (name === "password" && formData.passwordConfirm) {
      validateField("passwordConfirm", formData.passwordConfirm);
    } else if (name === "passwordConfirm" && formData.password) {
      validateField("passwordConfirm", value);
    } else {
      validateField(name as keyof ResetPasswordFormData, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrors({ token: "Invalid or missing reset token. Please request a new password reset link." });
      return;
    }

    // Validate all fields, including the refine validation
    try {
      resetPasswordSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const path = err.path[0] as keyof ResetPasswordFormData;
            newErrors[path] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsLoading(true);

    try {
      // In a real implementation, this would call an API endpoint with the token
      console.log("Reset password form submitted", { token, ...formData });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setIsSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
      setErrors({ root: "Failed to reset password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Password Reset Successful</h3>
        <p className="mt-2 text-sm text-gray-500">
          Your password has been reset successfully. You can now log in with your new password.
        </p>
        <div className="mt-6">
          <a href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.token ? (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="text-sm text-red-700">{errors.token}</div>
          </div>
          <div className="mt-4">
            <a href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Request a new reset link
            </a>
          </div>
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.password ? "border-red-300" : ""
                }`}
                disabled={isLoading}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="mt-1">
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                required
                value={formData.passwordConfirm}
                onChange={handleChange}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.passwordConfirm ? "border-red-300" : ""
                }`}
                disabled={isLoading}
              />
              {errors.passwordConfirm && <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm}</p>}
            </div>
          </div>

          {errors.root && (
            <div className="rounded-md bg-red-50 p-4">
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
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Resetting password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-500">
              Remember your password?{" "}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </span>
          </div>
        </>
      )}
    </form>
  );
};

export default ResetPasswordForm;
