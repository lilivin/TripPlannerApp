import React from "react";

interface AuthErrorProps {
  error: string | null;
  "data-testid"?: string;
}

export function AuthError({ error, "data-testid": testId = "auth-error-message" }: AuthErrorProps) {
  if (!error) return null;

  return (
    <div className="rounded-md bg-red-50 p-4 mt-4" data-testid={testId}>
      <div className="flex">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    </div>
  );
}
