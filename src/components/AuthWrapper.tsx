import { type ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
