interface ExtendedNavigator extends Navigator {
  standalone?: boolean;
}

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync: {
    register(tag: string): Promise<void>;
  };
}

interface IDBTransactionWithPromise extends IDBTransaction {
  complete: Promise<void>;
}

/**
 * Registers the service worker for offline functionality
 */
export function registerServiceWorker(): void {
  if ("serviceWorker" in navigator && "caches" in window) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);

          // Check for updates every hour
          setInterval(
            () => {
              registration.update();
            },
            60 * 60 * 1000
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
}

/**
 * Checks if the app is running in PWA/standalone mode
 */
export function isRunningAsPWA(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as ExtendedNavigator).standalone === true
  );
}

/**
 * Triggers background sync for when user comes back online
 */
export async function triggerBackgroundSync(tag: string): Promise<void> {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const registration = (await navigator.serviceWorker.ready) as ServiceWorkerRegistrationWithSync;
      await registration.sync.register(tag);
      return Promise.resolve();
    } catch (error) {
      console.error("Background sync failed:", error);
      return Promise.reject(error);
    }
  }
  return Promise.reject(new Error("Background sync not supported"));
}

/**
 * Stores data in IndexedDB for offline use with background sync
 */
export async function queueOfflineAction(storeName: string, data: Record<string, unknown>): Promise<void> {
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(storeName, "readwrite") as IDBTransactionWithPromise;
    const store = tx.objectStore(storeName);
    await store.add(data);
    await tx.complete;

    // Try to trigger sync if online
    if (navigator.onLine) {
      await triggerBackgroundSync(`sync-${storeName}`);
    }
  } catch (error) {
    console.error("Failed to queue action:", error);
  }
}

/**
 * Opens the offline IndexedDB database
 */
export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("trip-planner-offline", 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains("pending-favorites")) {
        db.createObjectStore("pending-favorites", { keyPath: "id", autoIncrement: true });
      }

      if (!db.objectStoreNames.contains("offline-views")) {
        db.createObjectStore("offline-views", { keyPath: "url" });
      }
    };

    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
    request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
  });
}
