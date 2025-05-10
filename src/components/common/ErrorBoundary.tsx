import { useState, useEffect } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Global error caught:", error);
      setHasError(true);
      setError(error.error || new Error("Unknown error occurred"));
    };

    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded" role="alert">
          <p className="font-bold">Something went wrong</p>
          <p>{error?.message || "An unknown error occurred. Please try refreshing the page."}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (err) {
    console.error("Render error:", err);
    setHasError(true);
    setError(err instanceof Error ? err : new Error("Unknown render error"));
    return null;
  }
}
