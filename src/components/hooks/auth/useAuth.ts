import { useState } from "react";
import { z } from "zod";

// Define base schema without refinements for field validation
const baseSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
});

// Registration form validation schema with refinement
export const registerSchema = baseSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormData = Omit<z.infer<typeof registerSchema>, "confirmPassword"> & {
  confirmPassword: string;
};

export type FormErrors = Partial<Record<keyof RegisterFormData | "root", string>>;

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: Omit<RegisterFormData, "confirmPassword">) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to register");
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to register. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
}
