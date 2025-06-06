import { useState, useEffect } from "react";
import type { UpdateOfflineCacheStatusCommand } from "@/types";
import { getPlanById, getOfflineStatus, updateOfflineStatus } from "@/lib/services/PlanService";
import {
  isPlanAvailableOffline,
  cachePlan,
  removePlan,
  updateLastSyncTime,
  isPwaSupported,
} from "@/lib/pwa/OfflineStorage";

/**
 * Hook do zarządzania dostępnością planu offline
 */
export function usePlanOfflineSync(planId: string) {
  const [isAvailableOffline, setIsAvailableOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sprawdzanie statusu offline
  useEffect(() => {
    const checkOfflineStatus = async () => {
      if (!planId) return;

      setIsLoading(true);
      try {
        // Sprawdź lokalnie, czy plan jest dostępny offline
        const isLocallyAvailable = isPlanAvailableOffline(planId);

        // Sprawdź status na serwerze
        const data = await getOfflineStatus(planId);

        // Jeśli plan jest dostępny lokalnie, ale nie na serwerze, aktualizuj status na serwerze
        if (isLocallyAvailable && !data.is_cached) {
          await updateOfflineStatus(planId, { is_cached: true });
          setIsAvailableOffline(true);
        }
        // Jeśli plan jest dostępny na serwerze, ale nie lokalnie, pobierz go
        else if (!isLocallyAvailable && data.is_cached) {
          const planData = await getPlanById(planId);
          await cachePlan(planData);
          setIsAvailableOffline(true);
        }
        // W innym przypadku ustaw status zgodnie z serwerem
        else {
          setIsAvailableOffline(data.is_cached);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Error checking offline status:", err);

        // W przypadku błędu serwera, korzystaj z lokalnego statusu
        const isLocallyAvailable = isPlanAvailableOffline(planId);
        setIsAvailableOffline(isLocallyAvailable);
      } finally {
        setIsLoading(false);
      }
    };

    checkOfflineStatus();
  }, [planId]);

  // Przełączanie statusu offline
  const toggleOfflineAvailability = async () => {
    if (!planId) return;

    const newStatus = !isAvailableOffline;

    try {
      // Aktualizacja na serwerze
      const payload: UpdateOfflineCacheStatusCommand = {
        is_cached: newStatus,
      };

      await updateOfflineStatus(planId, payload);

      // Aktualizacja lokalna
      if (newStatus) {
        // Pobierz plan i zapisz lokalnie
        const planData = await getPlanById(planId);
        await cachePlan(planData);
        updateLastSyncTime();
      } else {
        // Usuń plan z pamięci lokalnej
        removePlan(planId);
      }

      setIsAvailableOffline(newStatus);

      // Pomocnicze powiadomienie
      if (newStatus) {
        if (isPwaSupported()) {
          console.log("Plan saved for offline use");
        } else {
          console.warn("Browser doesn't support all PWA features. Offline mode may not work correctly.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error updating offline status:", err);
    }
  };

  return {
    isAvailableOffline,
    isLoading,
    error,
    toggleOfflineAvailability,
  };
}
