import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "@/components/ui/icons";
import type { ErrorType } from "@/components/hooks/useGuidesData";

interface GuidesErrorProps {
  type: ErrorType;
  message: string;
  onRetry: () => void;
}

export function GuidesError({ type, message, onRetry }: GuidesErrorProps) {
  const errorClasses = {
    network: "bg-yellow-100 border-yellow-400 text-yellow-800",
    server: "bg-red-100 border-red-400 text-red-800",
    notFound: "bg-blue-100 border-blue-400 text-blue-800",
    unknown: "bg-gray-100 border-gray-400 text-gray-800",
    auth: "bg-orange-100 border-orange-400 text-orange-800",
  };

  return (
    <div
      className={`${errorClasses[type]} border px-4 py-3 rounded mb-6 flex items-start justify-between`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p>{message}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onRetry} aria-label="Try again" className="ml-2 flex items-center">
        <RefreshCw className="h-4 w-4 mr-1" />
        Try Again
      </Button>
    </div>
  );
}
