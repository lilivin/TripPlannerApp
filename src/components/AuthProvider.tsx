import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { UserProfileDto } from "../types";
import { apiClient, ApiClientError } from "../lib/utils/api-client";

interface User {
  id: string;
  email: string | null;
  profile?: UserProfileDto;
}

interface AuthResponse {
  message?: string;
  user?: User;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, passwordConfirm: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (password: string, passwordConfirm: string) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);

        console.log("Loading user session...");
        const data = await apiClient<{ user: User | null }>("/api/auth/session");
        console.log("Session data loaded successfully");

        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to load user session:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Refresh the page to update auth state
      window.location.href = "/";
    } catch (err) {
      let message = "An error occurred during login";
      if (err instanceof ApiClientError) {
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, passwordConfirm: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      return await apiClient<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, passwordConfirm }),
      });
    } catch (err) {
      let message = "An error occurred during registration";
      if (err instanceof ApiClientError) {
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await apiClient("/api/auth/logout", {
        method: "POST",
      });

      // Refresh the page to update auth state
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      return await apiClient<AuthResponse>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    } catch (err) {
      let message = "An error occurred";
      if (err instanceof ApiClientError) {
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (password: string, passwordConfirm: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      return await apiClient<AuthResponse>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ password, passwordConfirm }),
      });
    } catch (err) {
      let message = "An error occurred";
      if (err instanceof ApiClientError) {
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
