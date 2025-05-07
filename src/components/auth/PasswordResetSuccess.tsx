import React from "react";

export function PasswordResetSuccess() {
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
