import { useReducer } from "react";
import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Auth state reducer
interface AuthState {
  isLoading: boolean;
  error: string | null;
}

type AuthAction = { type: "AUTH_START" } | { type: "AUTH_SUCCESS" } | { type: "AUTH_ERROR"; payload: string };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null };
    case "AUTH_SUCCESS":
      return { ...state, isLoading: false, error: null };
    case "AUTH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isLoading: false,
  error: null,
};

export function useAuth() {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (data: LoginFormData) => {
    dispatch({ type: "AUTH_START" });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Invalid email or password");
      }

      dispatch({ type: "AUTH_SUCCESS" });

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error instanceof Error ? error.message : "Failed to login. Please try again.",
      });
    }
  };

  const register = async (data: RegisterFormData) => {
    dispatch({ type: "AUTH_START" });

    try {
      const { confirmPassword, ...registerData } = data;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Registration failed");
      }

      dispatch({ type: "AUTH_SUCCESS" });

      // Redirect to home page or login
      window.location.href = "/";
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error instanceof Error ? error.message : "Failed to register. Please try again.",
      });
    }
  };

  const resetPassword = async (email: string) => {
    dispatch({ type: "AUTH_START" });

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to send password reset email");
      }

      dispatch({ type: "AUTH_SUCCESS" });
      return { success: true };
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error instanceof Error ? error.message : "Failed to reset password. Please try again.",
      });
      return { success: false };
    }
  };

  return {
    login,
    register,
    resetPassword,
    isLoading: state.isLoading,
    error: state.error,
  };
}
