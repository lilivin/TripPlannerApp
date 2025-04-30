import React from "react";
import UserMenuDropdown from "./UserMenuDropdown";
import { useAuth, AuthProvider } from "../providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { UserCircle, Loader2 } from "@/components/ui/icons";

const AuthButtonContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className="opacity-70">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        <span>Loading...</span>
      </Button>
    );
  }

  if (user) {
    return <UserMenuDropdown />;
  }

  return (
    <Button asChild variant="default" size="sm">
      <a href="/login" className="flex items-center">
        <UserCircle className="h-4 w-4 mr-2" />
        <span>Sign In</span>
      </a>
    </Button>
  );
};

const AuthButton: React.FC = () => {
  return (
    <AuthProvider>
      <AuthButtonContent />
    </AuthProvider>
  );
};

export default AuthButton;
