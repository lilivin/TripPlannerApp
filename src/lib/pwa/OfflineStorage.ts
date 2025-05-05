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

interface PlanAttraction {
  image_url?: string;
  // Add other attraction properties if needed
}

interface PlanDay {
  attractions: PlanAttraction[];
  // Add other day properties if needed
}

interface PlanContent {
  days: PlanDay[];
  // Add other content properties if needed
}

/**
 * Sprawdza, czy przeglądarka wspiera funkcje PWA
 */
export function isPwaSupported(): boolean {
  return "serviceWorker" in navigator && "caches" in window && "localStorage" in window;
}

/**
 * Zapisuje plan do pamięci lokalnej
 * @param plan Plan do zapisania
 * @returns Promise<void>
 */
export async function cachePlan(plan: PlanDetailDto): Promise<void> {
  if (!isPwaSupported()) {
    throw new Error("PWA features not supported in this browser");
  }

  try {
    // Zapisz plan w localStorage
    localStorage.setItem(`${STORAGE_KEYS.PLAN_PREFIX}${plan.id}`, JSON.stringify(plan));

    // Zapisz zasoby (np. obrazy) do cache, jeśli używamy Service Worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      // Dodaj do cache wszystkie obrazy z planu
      const imageUrls = extractImageUrlsFromPlan(plan);
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
export function getPlan(planId: string): PlanDetailDto | null {
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
export function removePlan(planId: string): boolean {
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
export function isPlanAvailableOffline(planId: string): boolean {
  return !!localStorage.getItem(`${STORAGE_KEYS.PLAN_PREFIX}${planId}`);
}

/**
 * Dodaje plan do kolejki synchronizacji
 * @param planId ID planu
 */
export function addToSyncQueue(planId: string): void {
  const status = getSyncStatus();
  if (!status.pendingSyncs.includes(planId)) {
    status.pendingSyncs.push(planId);
    saveSyncStatus(status);
  }
}

/**
 * Usuwa plan z kolejki synchronizacji
 * @param planId ID planu
 */
export function removeFromSyncQueue(planId: string): void {
  const status = getSyncStatus();
  status.pendingSyncs = status.pendingSyncs.filter((id) => id !== planId);
  saveSyncStatus(status);
}

/**
 * Pobiera status synchronizacji
 * @returns Status synchronizacji
 */
function getSyncStatus(): SyncStatus {
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
function saveSyncStatus(status: SyncStatus): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(status));
  } catch (error) {
    console.error("Error saving sync status:", error);
  }
}

/**
 * Aktualizuje czas ostatniej synchronizacji
 */
export function updateLastSyncTime(): void {
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
}

/**
 * Pobiera czas ostatniej synchronizacji
 * @returns Date | null
 */
export function getLastSyncTime(): Date | null {
  const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  if (!lastSync) return null;
  return new Date(lastSync);
}

/**
 * Wyodrębnia adresy URL obrazów z planu
 * @param plan Plan podróży
 * @returns Tablica URL-i obrazów
 */
function extractImageUrlsFromPlan(plan: PlanDetailDto): string[] {
  const urls: string[] = [];
  try {
    // Parsuj zawartość JSON i sprawdź typ
    const content = plan.content as unknown;
    if (!isPlanContent(content)) {
      return [];
    }

    // Sprawdź, czy plan ma dni i atrakcje
    if (content.days && Array.isArray(content.days)) {
      content.days.forEach((day) => {
        if (day.attractions && Array.isArray(day.attractions)) {
          day.attractions.forEach((attraction) => {
            // Dodaj obrazy atrakcji
            if (attraction.image_url) {
              urls.push(attraction.image_url);
            }
          });
        }
      });
    }

    return urls;
  } catch (error) {
    console.error("Error extracting image URLs from plan:", error);
    return [];
  }
}

/**
 * Type guard dla sprawdzenia struktury PlanContent
 */
function isPlanContent(value: unknown): value is PlanContent {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  if (!Array.isArray(candidate.days)) {
    return false;
  }

  return candidate.days.every((day) => {
    if (typeof day !== "object" || day === null) {
      return false;
    }
    const dayCandidate = day as Record<string, unknown>;
    return (
      Array.isArray(dayCandidate.attractions) &&
      dayCandidate.attractions.every((attraction) => {
        if (typeof attraction !== "object" || attraction === null) {
          return false;
        }
        const attractionCandidate = attraction as Record<string, unknown>;
        return (
          typeof attractionCandidate.image_url === "undefined" || typeof attractionCandidate.image_url === "string"
        );
      })
    );
  });
}
