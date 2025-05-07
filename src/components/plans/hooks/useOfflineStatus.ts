import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { PlanSummaryDto } from "../../../types";

interface PlanSummaryWithId extends Pick<PlanSummaryDto, "id"> {
  id: string;
}

/**
 * Hook for managing offline status for plans
 *
 * Handles fetching, caching, and updating offline availability status
 * for a collection of plans from the API
 */
export function useOfflineStatus(plans: PlanSummaryWithId[]) {
  const [offlineStatuses, setOfflineStatuses] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const prevPlanIdsRef = useRef<string[]>([]);
  const initialLoadDoneRef = useRef(false);
  const lastFetchTimestampRef = useRef(0);

  // Memoize the current plan IDs to use in effect dependency
  const currentPlanIds = useMemo(() => plans.map((plan) => plan.id).filter(Boolean), [plans]);

  // Function to fetch offline status for multiple plans
  const fetchOfflineStatuses = useCallback(async () => {
    if (plans.length === 0) {
      setOfflineStatuses({});
      setIsLoading(false);
      initialLoadDoneRef.current = true;
      return;
    }

    // Skip if already loading to prevent duplicate requests
    if (isLoading) return;

    // Check if the plan IDs have changed
    const hasPlansChanged =
      prevPlanIdsRef.current.length !== currentPlanIds.length ||
      prevPlanIdsRef.current.some((id, index) => id !== currentPlanIds[index]);

    // Skip if plan IDs haven't changed and this is not a manual retry
    // Only skip if we've done the initial load
    if (initialLoadDoneRef.current && !hasPlansChanged && retryCount === 0) {
      return;
    }

    // Update the previous plan IDs ref
    prevPlanIdsRef.current = [...currentPlanIds];

    setIsLoading(true);
    setError(null);
    const statuses: Record<string, boolean> = {};

    try {
      // Use Promise.allSettled to handle individual request failures
      const results = await Promise.allSettled(
        plans.map(async (plan) => {
          if (!plan.id) {
            return null;
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          try {
            const response = await fetch(`/api/plans/${plan.id}/offline`, {
              signal: controller.signal,
              headers: {
                // This should ideally come from an auth context
                "X-User-ID": "57e6776e-950c-4b0c-8e14-2a9bed080d3a",
              },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new Error(`Failed to fetch status: ${response.statusText}`);
            }

            const data = await response.json();
            return { id: plan.id, status: data.is_cached || false };
          } catch {
            clearTimeout(timeoutId);
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

      // Only update state if there are differences
      const shouldUpdate =
        Object.keys(statuses).length > 0 &&
        (Object.keys(offlineStatuses).length !== Object.keys(statuses).length ||
          Object.entries(statuses).some(([id, status]) => offlineStatuses[id] !== status));

      if (shouldUpdate) {
        setOfflineStatuses(statuses);
      }
    } catch {
      setError("Failed to load offline availability status");
    } finally {
      setIsLoading(false);
      initialLoadDoneRef.current = true;
    }
  }, [retryCount, currentPlanIds, isLoading, plans, offlineStatuses]);

  // Function to retry fetching
  const retryFetch = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  // Function to toggle offline status for a specific plan
  const toggleOfflineStatus = useCallback(async (planId: string, isOfflineAvailable: boolean) => {
    const response = await fetch(`/api/plans/${planId}/offline`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": "57e6776e-950c-4b0c-8e14-2a9bed080d3a",
      },
      body: JSON.stringify({ is_cached: isOfflineAvailable }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update offline status: ${response.statusText}`);
    }

    // Update local state
    setOfflineStatuses((prev) => ({
      ...prev,
      [planId]: isOfflineAvailable,
    }));

    return true;
  }, []);

  // Only run this effect once on mount to clear state
  useEffect(() => {
    return () => {
      // Reset everything when component unmounts
      initialLoadDoneRef.current = false;
      prevPlanIdsRef.current = [];
    };
  }, []);

  // Fetch statuses when plans change or when retry is triggered
  useEffect(() => {
    // Prevent multiple fetches within a short timeframe
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimestampRef.current;

    if (timeSinceLastFetch < 1000 && initialLoadDoneRef.current) {
      return;
    }

    // Debounce multiple API calls
    const debounceTimer = setTimeout(() => {
      lastFetchTimestampRef.current = Date.now();
      fetchOfflineStatuses();
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [fetchOfflineStatuses]);

  return {
    offlineStatuses,
    isLoading,
    error,
    retryFetch,
    toggleOfflineStatus,
  };
}
