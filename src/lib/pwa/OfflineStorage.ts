import type { PlanDetailDto } from "@/types";

/**
 * Klucze używane do przechowywania danych w localStorage
 */
const STORAGE_KEYS = {
  PLAN_PREFIX: "trip_planner_plan_", // Prefiks dla kluczy planów
  SYNC_STATUS: "trip_planner_sync_status", // Status synchronizacji
  LAST_SYNC: "trip_planner_last_sync", // Czas ostatniej synchronizacji
};

/**
 * Interfejs dla statusu synchronizacji
 */
interface SyncStatus {
  pendingSyncs: string[]; // ID planów oczekujących na synchronizację
}

/**
 * Klasa zarządzająca przechowywaniem planów offline
 */
export class OfflineStorage {
  /**
   * Sprawdza, czy przeglądarka wspiera funkcje PWA
   */
  static isPwaSupported(): boolean {
    return "serviceWorker" in navigator && "caches" in window && "localStorage" in window;
  }

  /**
   * Zapisuje plan do pamięci lokalnej
   * @param plan Plan do zapisania
   * @returns Promise<void>
   */
  static async cachePlan(plan: PlanDetailDto): Promise<void> {
    if (!this.isPwaSupported()) {
      throw new Error("PWA features not supported in this browser");
    }

    try {
      // Zapisz plan w localStorage
      localStorage.setItem(`${STORAGE_KEYS.PLAN_PREFIX}${plan.id}`, JSON.stringify(plan));

      // Zapisz zasoby (np. obrazy) do cache, jeśli używamy Service Worker
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        // Dodaj do cache wszystkie obrazy z planu
        const imageUrls = this.extractImageUrlsFromPlan(plan);
        if (imageUrls.length > 0) {
          const cache = await caches.open("plan-images");
          await Promise.all(
            imageUrls.map(async (url) => {
              try {
                // Sprawdź, czy obraz nie jest już w cache
                const cachedResponse = await cache.match(url);
                if (!cachedResponse) {
                  const response = await fetch(url, { mode: "no-cors" });
                  await cache.put(url, response);
                }
              } catch (error) {
                console.warn(`Failed to cache image ${url}:`, error);
              }
            })
          );
        }
      }

      console.log(`Plan ${plan.id} cached successfully`);
    } catch (error) {
      console.error("Error caching plan:", error);
      throw new Error(`Failed to cache plan: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Pobiera plan z pamięci lokalnej
   * @param planId ID planu
   * @returns Plan lub null, jeśli nie znaleziono
   */
  static getPlan(planId: string): PlanDetailDto | null {
    try {
      const planJson = localStorage.getItem(`${STORAGE_KEYS.PLAN_PREFIX}${planId}`);
      if (!planJson) return null;
      return JSON.parse(planJson) as PlanDetailDto;
    } catch (error) {
      console.error(`Error retrieving plan ${planId} from cache:`, error);
      return null;
    }
  }

  /**
   * Usuwa plan z pamięci lokalnej
   * @param planId ID planu
   * @returns boolean - czy operacja się powiodła
   */
  static removePlan(planId: string): boolean {
    try {
      localStorage.removeItem(`${STORAGE_KEYS.PLAN_PREFIX}${planId}`);
      return true;
    } catch (error) {
      console.error(`Error removing plan ${planId} from cache:`, error);
      return false;
    }
  }

  /**
   * Sprawdza, czy plan jest dostępny offline
   * @param planId ID planu
   * @returns boolean
   */
  static isPlanAvailableOffline(planId: string): boolean {
    return !!localStorage.getItem(`${STORAGE_KEYS.PLAN_PREFIX}${planId}`);
  }

  /**
   * Dodaje plan do kolejki synchronizacji
   * @param planId ID planu
   */
  static addToSyncQueue(planId: string): void {
    const status = this.getSyncStatus();
    if (!status.pendingSyncs.includes(planId)) {
      status.pendingSyncs.push(planId);
      this.saveSyncStatus(status);
    }
  }

  /**
   * Usuwa plan z kolejki synchronizacji
   * @param planId ID planu
   */
  static removeFromSyncQueue(planId: string): void {
    const status = this.getSyncStatus();
    status.pendingSyncs = status.pendingSyncs.filter((id) => id !== planId);
    this.saveSyncStatus(status);
  }

  /**
   * Pobiera status synchronizacji
   * @returns Status synchronizacji
   */
  private static getSyncStatus(): SyncStatus {
    try {
      const statusJson = localStorage.getItem(STORAGE_KEYS.SYNC_STATUS);
      if (!statusJson) return { pendingSyncs: [] };
      return JSON.parse(statusJson) as SyncStatus;
    } catch (error) {
      console.error("Error retrieving sync status:", error);
      return { pendingSyncs: [] };
    }
  }

  /**
   * Zapisuje status synchronizacji
   * @param status Status synchronizacji
   */
  private static saveSyncStatus(status: SyncStatus): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(status));
    } catch (error) {
      console.error("Error saving sync status:", error);
    }
  }

  /**
   * Aktualizuje czas ostatniej synchronizacji
   */
  static updateLastSyncTime(): void {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  /**
   * Pobiera czas ostatniej synchronizacji
   * @returns Date | null
   */
  static getLastSyncTime(): Date | null {
    const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    if (!lastSync) return null;
    return new Date(lastSync);
  }

  /**
   * Wyodrębnia adresy URL obrazów z planu
   * @param plan Plan podróży
   * @returns Tablica URL-i obrazów
   */
  private static extractImageUrlsFromPlan(plan: PlanDetailDto): string[] {
    const urls: string[] = [];
    try {
      // Parsuj zawartość JSON
      const content = plan.content as any;

      // Sprawdź, czy plan ma dni i atrakcje
      if (content?.days && Array.isArray(content.days)) {
        content.days.forEach((day: any) => {
          if (day.attractions && Array.isArray(day.attractions)) {
            day.attractions.forEach((attraction: any) => {
              // Dodaj obrazy atrakcji
              if (attraction.image_url) {
                urls.push(attraction.image_url);
              }
            });
          }
        });
      }
    } catch (error) {
      console.error("Error extracting image URLs from plan:", error);
    }
    return urls;
  }
}
