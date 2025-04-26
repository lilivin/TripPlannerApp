import { useState, useEffect } from "react";
import type { UpdateOfflineCacheStatusCommand } from "@/types";
import { PlanService } from "@/lib/services/PlanService";
import { OfflineStorage } from "@/lib/pwa/OfflineStorage";

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
        const isLocallyAvailable = OfflineStorage.isPlanAvailableOffline(planId);

        // Sprawdź status na serwerze
        const data = await PlanService.getOfflineStatus(planId);

        // Jeśli plan jest dostępny lokalnie, ale nie na serwerze, aktualizuj status na serwerze
        if (isLocallyAvailable && !data.is_cached) {
          await PlanService.updateOfflineStatus(planId, { is_cached: true });
          setIsAvailableOffline(true);
        }
        // Jeśli plan jest dostępny na serwerze, ale nie lokalnie, pobierz go
        else if (!isLocallyAvailable && data.is_cached) {
          const planData = await PlanService.getPlanById(planId);
          await OfflineStorage.cachePlan(planData);
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
        const isLocallyAvailable = OfflineStorage.isPlanAvailableOffline(planId);
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

      await PlanService.updateOfflineStatus(planId, payload);

      // Aktualizacja lokalna
      if (newStatus) {
        // Pobierz plan i zapisz lokalnie
        const planData = await PlanService.getPlanById(planId);
        await OfflineStorage.cachePlan(planData);
        OfflineStorage.updateLastSyncTime();
      } else {
        // Usuń plan z pamięci lokalnej
        OfflineStorage.removePlan(planId);
      }

      setIsAvailableOffline(newStatus);

      // Pomocnicze powiadomienie
      if (newStatus) {
        if (OfflineStorage.isPwaSupported()) {
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
