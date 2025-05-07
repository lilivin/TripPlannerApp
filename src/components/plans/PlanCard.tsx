import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PlanSummaryViewModel } from "./types";

interface PlanCardProps {
  plan: PlanSummaryViewModel;
  onView: () => void;
  onDelete: () => void;
  onToggleOffline: (isOfflineAvailable: boolean) => void;
  isOfflineAvailable: boolean;
}

/**
 * PlanCard component that displays a single trip plan with actions
 */
export function PlanCard({ plan, onView, onDelete, onToggleOffline, isOfflineAvailable }: PlanCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleOffline = async () => {
    setIsToggling(true);
    setError(null);
    try {
      await onToggleOffline(!isOfflineAvailable);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update offline status");
      // Error will be automatically cleared after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsToggling(false);
    }
  };

  // Safely display guide information with fallbacks
  const guideInfo = () => {
    try {
      if (!plan.guide) return "No guide information";
      const guideName = plan.guide.title || "Unnamed guide";
      const location = plan.guide.location_name || "No location";
      return `Guide: ${guideName} • ${location}`;
    } catch (err) {
      console.error("Error formatting guide info:", err);
      return "Guide information unavailable";
    }
  };

  // Safely format the date with fallback
  const displayDate = () => {
    try {
      return `Created: ${plan.formattedDate || new Date(plan.created_at).toLocaleDateString()}`;
    } catch (err) {
      console.error("Error displaying date:", err);
      return "Date unavailable";
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{plan.name || "Unnamed Plan"}</CardTitle>
          <div className="flex space-x-1">
            {plan.is_favorite && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Favorite
              </span>
            )}
            {isOfflineAvailable && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Offline
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 mb-2">{guideInfo()}</div>
        <div className="text-sm text-gray-500 mb-4">{displayDate()}</div>

        {error && (
          <Alert variant="destructive" className="mb-4 py-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between mt-4">
          <Button variant="outline" size="sm" onClick={onView}>
            View Plan
          </Button>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleToggleOffline} disabled={isToggling}>
              {isToggling ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-1 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : isOfflineAvailable ? (
                "Remove Offline"
              ) : (
                "Save Offline"
              )}
            </Button>
            <Button variant="outline" size="sm" className="text-red-500" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
