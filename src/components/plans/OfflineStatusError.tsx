import { Button } from "@/components/ui/button";
import type { OfflineStatusErrorProps } from "./types";

/**
 * Displays error message related to offline status with retry option
 */
export function OfflineStatusError({ error, onRetry, isRetrying }: OfflineStatusErrorProps) {
  return (
    <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
      <span className="block sm:inline">{error}</span>
      <Button
        onClick={onRetry}
        className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        disabled={isRetrying}
      >
        {isRetrying ? "Retrying..." : "Retry"}
      </Button>
    </div>
  );
}
