import React from "react";

export function InvalidTokenMessage() {
  return (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex">
        <div className="text-sm text-red-700">
          Invalid or missing reset token. Please request a new password reset link.
        </div>
      </div>
      <div className="mt-4">
        <a href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Request a new reset link
        </a>
      </div>
    </div>
  );
}
