import { useState, useEffect } from "react";
import type { PlanSummaryDto } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Extended type for frontend display
interface PlanSummaryViewModel extends PlanSummaryDto {
  formattedDate: string;
}

interface PlanCardProps {
  plan: PlanSummaryViewModel;
  onView: () => void;
  onDelete: () => void;
  onToggleOffline: (isOfflineAvailable: boolean) => void;
  isOfflineAvailable: boolean;
}

// Individual Plan Card component
function PlanCard({ plan, onView, onDelete, onToggleOffline, isOfflineAvailable }: PlanCardProps) {
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

// Loading skeleton for plan cards
function PlanCardSkeleton() {
  return (
    <div className="mb-4 border rounded-lg p-4">
      <div className="flex justify-between mb-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-4 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/3 mb-4" />
      <div className="flex justify-between mt-4">
        <Skeleton className="h-9 w-24" />
        <div className="space-x-2">
          <Skeleton className="h-9 w-24 inline-block" />
          <Skeleton className="h-9 w-24 inline-block" />
        </div>
      </div>
    </div>
  );
}

interface PlansListProps {
  plans: PlanSummaryViewModel[];
  isLoading: boolean;
  onViewPlan: (id: string) => void;
  onDeletePlan: (id: string, name: string) => void;
  onToggleOffline: (id: string, isOfflineAvailable: boolean) => void;
}

// Custom hook for managing offline status for multiple plans
function usePlansOfflineStatus(plans: PlanSummaryViewModel[]) {
  const [offlineStatuses, setOfflineStatuses] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Function to fetch offline status for multiple plans
  const fetchOfflineStatuses = async () => {
    if (plans.length === 0) {
      setOfflineStatuses({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const statuses: Record<string, boolean> = {};

    try {
      // Use Promise.allSettled to handle individual request failures
      const results = await Promise.allSettled(
        plans.map(async (plan) => {
          try {
            if (!plan || !plan.id) {
              console.error("Invalid plan for offline status check", plan);
              return null;
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
              // Dla testów wypisz URL zapytania do konsoli
              console.log(`Fetching offline status for plan ID: ${plan.id}`);

              const response = await fetch(`/api/plans/${plan.id}/offline`, {
                signal: controller.signal,
                headers: {
                  // Dodaj header z ID użytkownika dla autoryzacji
                  "X-User-ID": "57e6776e-950c-4b0c-8e14-2a9bed080d3a",
                },
              });

              clearTimeout(timeoutId);

              if (!response.ok) {
                throw new Error(`Failed to fetch status: ${response.statusText}`);
              }

              const data = await response.json();
              return { id: plan.id, status: data.is_cached || false };
            } catch (err) {
              clearTimeout(timeoutId);
              throw err;
            }
          } catch (error) {
            console.error(`Failed to fetch offline status for plan ${plan.id}`, error);
            return null;
          }
        })
      );

      // Process the results
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          const item = result.value;
          if (item && item.id) {
            statuses[item.id] = item.status;
          }
        }
      });

      setOfflineStatuses(statuses);

      // Check if we have missing statuses for any plans
      const missingStatuses = plans.some((plan) => plan.id && statuses[plan.id] === undefined);

      if (missingStatuses) {
        console.warn("Some plan offline statuses could not be fetched");
      }
    } catch (error) {
      console.error("Failed to fetch offline statuses", error);
      setError("Failed to load offline availability status");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to retry fetching
  const retryFetch = () => {
    setRetryCount((prev) => prev + 1);
  };

  // Fetch statuses when plans change or when retry is triggered
  useEffect(() => {
    fetchOfflineStatuses();
  }, [plans, retryCount]);

  return {
    offlineStatuses,
    isLoading,
    error,
    retryFetch,
  };
}

export default function PlansList({ plans, isLoading, onViewPlan, onDeletePlan, onToggleOffline }: PlansListProps) {
  const {
    offlineStatuses,
    isLoading: isLoadingOfflineStatus,
    error: offlineStatusError,
    retryFetch,
  } = usePlansOfflineStatus(plans);

  // Show loading skeletons when initially loading plans
  if (isLoading) {
    return (
      <div className="mb-6">
        {[1, 2, 3].map((i) => (
          <PlanCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Validate plans data to prevent rendering issues
  const validPlans = plans.filter((plan) => plan && plan.id && plan.name);

  // Show warning if some plans were filtered out
  const invalidPlansCount = plans.length - validPlans.length;

  return (
    <div className="mb-6">
      {/* Show error message for offline status failures */}
      {offlineStatusError && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{offlineStatusError}</span>
          <button
            onClick={retryFetch}
            className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            disabled={isLoadingOfflineStatus}
          >
            {isLoadingOfflineStatus ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      {/* Show warning for invalid plans */}
      {invalidPlansCount > 0 && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative">
          <span className="block sm:inline">
            {invalidPlansCount} {invalidPlansCount === 1 ? "plan was" : "plans were"} skipped due to invalid data.
          </span>
        </div>
      )}

      {/* Render the valid plans */}
      {validPlans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onView={() => onViewPlan(plan.id)}
          onDelete={() => onDeletePlan(plan.id, plan.name)}
          onToggleOffline={(isOfflineAvailable) => onToggleOffline(plan.id, isOfflineAvailable)}
          isOfflineAvailable={offlineStatuses[plan.id] || false}
        />
      ))}

      {/* Show message if no valid plans */}
      {validPlans.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No valid plans to display.</p>
        </div>
      )}
    </div>
  );
}
