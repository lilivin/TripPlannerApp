/* eslint-disable no-console */
/* global self, caches, fetch, Response, indexedDB, console */
/* Service Worker for Trip Planner App */

const CACHE_NAME = "trip-planner-cache-v1";
const OFFLINE_PAGE = "/offline.html";
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/styles.css",
  "/app.js",
  "/favicon.ico",
  "/images/logo.png",
  "/manifest.json",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - handle requests
self.addEventListener("fetch", (event) => {
  // Don't cache POST requests and auth requests
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("/api/auth/") ||
    event.request.url.includes("chrome-extension://")
  ) {
    return;
  }

  // API requests - network first, then cache
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response
          const responseToCache = response.clone();

          // Check if response is ok
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // Try to get from cache if network fails
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // If it's the home API endpoint, return a default response
            if (event.request.url.includes("/api/home")) {
              return new Response(JSON.stringify({ message: "Offline data not available" }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
              });
            }

            // Return offline page for navigation requests
            return caches.match(OFFLINE_PAGE);
          });
        })
    );
  }
  // Other requests - cache first, then network
  else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Cache valid responses
            if (response.ok && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests if HTML is requested
            if (event.request.headers.get("accept").includes("text/html")) {
              return caches.match(OFFLINE_PAGE);
            }
          });
      })
    );
  }
});

// Handle offline sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-favorites") {
    event.waitUntil(syncFavorites());
  }
});

// Function to sync favorited items when back online
async function syncFavorites() {
  try {
    // Get pending favorites from IndexedDB
    const db = await openDB();
    const pendingFavorites = await db.getAll("pending-favorites");

    // Process each pending item
    for (const item of pendingFavorites) {
      try {
        // Try to sync with the server
        const response = await fetch(`/api/plans/${item.planId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_favorite: item.isFavorite }),
        });

        if (response.ok) {
          // Remove from pending queue if successful
          await db.delete("pending-favorites", item.id);
        }
      } catch (error) {
        console.error("Failed to sync item:", error);
      }
    }
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// Helper function to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("trip-planner-offline", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("pending-favorites")) {
        db.createObjectStore("pending-favorites", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}
