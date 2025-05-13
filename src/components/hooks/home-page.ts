import { useState, useEffect } from "react";
import type { HomeGuestResponse, HomeUserResponse } from "@/types";
import type { HomePageState, ToggleFavoriteState } from "@/types/home-page";
import { apiClient } from "@/lib/utils/api-client";
import { queueOfflineAction } from "@/lib/utils/service-worker";

const HOME_CACHE_KEY = "trip_planner_home_data";
const HOME_CACHE_TIMESTAMP_KEY = "trip_planner_home_timestamp";
const CACHE_MAX_AGE = 1000 * 60 * 60; // 1 hour

/**
 * Hook for fetching homepage data based on authentication status with offline support
 */
export function useHomePageData(isAuthenticated: boolean) {
  const [state, setState] = useState<HomePageState>({
    loadingState: "idle",
    data: null,
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      setState((prevState) => ({ ...prevState, loadingState: "loading" }));

      // Check if offline
      if (!navigator.onLine) {
        const cachedData = getCachedHomeData();
        if (cachedData) {
          setState({ loadingState: "success", data: cachedData });
          return;
        }
      }

      try {
        const data = await apiClient<HomeGuestResponse | HomeUserResponse>("/api/home");

        // Cache the response
        cacheHomeData(data);

        setState({ loadingState: "success", data });
      } catch (error) {
        console.error("Failed to fetch home data:", error);

        // Try to use cached data if available when fetch fails
        const cachedData = getCachedHomeData();
        if (cachedData) {
          setState({
            loadingState: "success",
            data: cachedData,
            error: "Using cached data due to connectivity issues",
          });
        } else {
          setState({
            loadingState: "error",
            error: error instanceof Error ? error.message : "Unknown error",
            data: null,
          });
        }
      }
    };

    fetchHomeData();
  }, [isAuthenticated]);

  return state;
}

/**
 * Get cached home data if available and not expired
 */
function getCachedHomeData(): HomeGuestResponse | HomeUserResponse | null {
  try {
    // Get cached data and timestamp
    const cachedDataJson = localStorage.getItem(HOME_CACHE_KEY);
    const cachedTimestampStr = localStorage.getItem(HOME_CACHE_TIMESTAMP_KEY);

    if (!cachedDataJson || !cachedTimestampStr) {
      return null;
    }

    // Check if cache is expired
    const cachedTimestamp = parseInt(cachedTimestampStr, 10);
    const now = Date.now();

    if (now - cachedTimestamp > CACHE_MAX_AGE) {
      // Cache is expired, clear it
      localStorage.removeItem(HOME_CACHE_KEY);
      localStorage.removeItem(HOME_CACHE_TIMESTAMP_KEY);
      return null;
    }

    return JSON.parse(cachedDataJson);
  } catch (error) {
    console.error("Error retrieving cached home data:", error);
    return null;
  }
}

/**
 * Cache home data for offline use
 */
function cacheHomeData(data: HomeGuestResponse | HomeUserResponse): void {
  try {
    localStorage.setItem(HOME_CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(HOME_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error("Error caching home data:", error);
  }
}

/**
 * Hook for toggling favorite status of plans
 */
export function useToggleFavoritePlan() {
  const [state, setState] = useState<Record<string, ToggleFavoriteState>>({});

  const toggleFavorite = async (planId: string, isFavorite: boolean) => {
    setState((prevState) => ({
      ...prevState,
      [planId]: { isProcessing: true },
    }));

    try {
      // Check if we're offline
      if (!navigator.onLine) {
        // Queue action for later sync
        await queueOfflineAction("pending-favorites", {
          planId,
          isFavorite,
          timestamp: Date.now(),
        });

        // Update optimistically in the UI
        setState((prevState) => ({
          ...prevState,
          [planId]: {
            isProcessing: false,
            pendingSync: true,
          },
        }));

        return true;
      }

      // If online, proceed with API call
      await apiClient(`/api/plans/${planId}`, {
        method: "PATCH",
        body: JSON.stringify({ is_favorite: isFavorite }),
      });

      setState((prevState) => ({
        ...prevState,
        [planId]: { isProcessing: false },
      }));

      return true;
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        [planId]: {
          isProcessing: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }));

      return false;
    }
  };

  return { state, toggleFavorite };
}
