import { useState, useEffect, useCallback } from "react";
import { handlePlanOfflineSync } from "../../../lib/utils/api-response";

interface OfflineStatus {
  isAvailableOffline: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook do zarządzania synchronizacją planów podróży w trybie offline
 * @param planId ID planu podróży
 * @returns Status dostępności planu w trybie offline
 */
export function usePlanOfflineSync(planId: string | undefined): OfflineStatus & {
  sync: () => Promise<void>;
  toggleOfflineAvailability?: () => Promise<void>;
} {
  const [status, setStatus] = useState<OfflineStatus>({
    isAvailableOffline: false,
    isLoading: true,
    error: null,
  });

  const checkOfflineAvailability = useCallback(async () => {
    if (!planId) {
      setStatus({
        isAvailableOffline: false,
        isLoading: false,
        error: "No plan ID provided",
      });
      return;
    }

    try {
      setStatus((prev) => ({ ...prev, isLoading: true }));
      const isAvailable = await handlePlanOfflineSync(planId);
      setStatus({
        isAvailableOffline: isAvailable,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setStatus({
        isAvailableOffline: false,
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      });
    }
  }, [planId]);

  useEffect(() => {
    checkOfflineAvailability();

    // Dodaj nasłuchiwanie zmiany stanu połączenia
    const handleOnlineStatusChange = () => {
      checkOfflineAvailability();
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, [checkOfflineAvailability]);

  const sync = async () => {
    await checkOfflineAvailability();
  };

  return { ...status, sync };
}
