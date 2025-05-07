import type { PlanListResponse } from "@/types";
import type { PlansViewFilterState } from "@/components/plans/hooks/usePlans";

/**
 * Fetches user plans from the API
 * @param filters Filter parameters for fetching plans
 * @returns Promise with the plan list response
 */
export async function fetchUserPlans(filters: PlansViewFilterState): Promise<PlanListResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append("page", filters.page.toString());
  queryParams.append("limit", filters.limit.toString());

  // Hardcoded user ID for demo purposes - in a real app, this would come from auth context
  queryParams.append("user_id", "57e6776e-950c-4b0c-8e14-2a9bed080d3a");

  if (filters.isFavorite !== undefined) {
    queryParams.append("is_favorite", filters.isFavorite.toString());
  }

  if (filters.guideId) {
    queryParams.append("guide_id", filters.guideId);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`/api/plans?${queryParams.toString()}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "X-User-ID": "57e6776e-950c-4b0c-8e14-2a9bed080d3a",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("You must be logged in to view plans");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to access these plans");
      } else if (response.status === 404) {
        throw new Error("No plans found");
      } else {
        throw new Error(`Failed to fetch plans: ${response.statusText}`);
      }
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.data)) {
      throw new Error("Invalid response format from server");
    }

    return data;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  }
}

/**
 * Deletes a plan by ID
 * @param planId The ID of the plan to delete
 */
export async function deletePlan(planId: string): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`/api/plans/${planId}`, {
      method: "DELETE",
      signal: controller.signal,
      headers: {
        "X-User-ID": "57e6776e-950c-4b0c-8e14-2a9bed080d3a",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("You must be logged in to delete plans");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to delete this plan");
      } else if (response.status === 404) {
        throw new Error("The plan you're trying to delete no longer exists");
      } else {
        throw new Error(`Failed to delete plan: ${response.statusText}`);
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Delete request timed out. Please try again.");
    }
    throw err;
  }
}

/**
 * Updates the offline availability status of a plan
 * @param planId The ID of the plan to update
 * @param isOfflineAvailable Whether the plan should be available offline
 */
export async function togglePlanOfflineStatus(planId: string, isOfflineAvailable: boolean): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`/api/plans/${planId}/offline`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": "57e6776e-950c-4b0c-8e14-2a9bed080d3a",
      },
      body: JSON.stringify({ is_cached: isOfflineAvailable }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("You must be logged in to change offline availability");
      } else if (response.status === 403) {
        throw new Error("You don't have permission to change this plan's offline status");
      } else if (response.status === 404) {
        throw new Error("The plan you're trying to update no longer exists");
      } else if (response.status === 507) {
        throw new Error("Not enough storage space to save this plan offline");
      } else {
        throw new Error(`Failed to update offline status: ${response.statusText}`);
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Toggle offline request timed out. Please try again.");
    }
    throw err;
  }
}
