/**
 * Utilities for consistent API response formatting
 */

/**
 * Standard error response structure
 */
export interface ApiErrorResponse<T = unknown> {
  error: string;
  details?: T;
  code?: string;
}

/**
 * Creates a formatted error response
 * @param status HTTP status code
 * @param message Error message
 * @param details Optional details about the error
 * @param code Optional error code
 */
export function createErrorResponse<T = unknown>(
  status: number,
  message: string,
  details?: T,
  code?: string
): Response {
  const errorBody: ApiErrorResponse<T> = {
    error: message,
  };

  if (details) {
    errorBody.details = details;
  }

  if (code) {
    errorBody.code = code;
  }

  return new Response(JSON.stringify(errorBody), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Creates a successful response with data
 * @param data The response data
 * @param status HTTP status code (defaults to 200)
 */
export function createSuccessResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Error types for consistent error handling
 */
export const ApiErrorTypes = {
  VALIDATION_ERROR: "validation_error",
  AUTHENTICATION_ERROR: "authentication_error",
  AUTHORIZATION_ERROR: "authorization_error",
  RESOURCE_NOT_FOUND: "resource_not_found",
  CONFLICT_ERROR: "conflict_error",
  INTERNAL_ERROR: "internal_error",
};

/**
 * Maps error types to HTTP status codes
 */
export const ErrorStatusCodes = {
  [ApiErrorTypes.VALIDATION_ERROR]: 400,
  [ApiErrorTypes.AUTHENTICATION_ERROR]: 401,
  [ApiErrorTypes.AUTHORIZATION_ERROR]: 403,
  [ApiErrorTypes.RESOURCE_NOT_FOUND]: 404,
  [ApiErrorTypes.CONFLICT_ERROR]: 409,
  [ApiErrorTypes.INTERNAL_ERROR]: 500,
};

/**
 * Helper class for consistent API errors
 */
export class ApiError<T = unknown> extends Error {
  public readonly type: string;
  public readonly details?: T;

  constructor(type: string, message: string, details?: T) {
    super(message);
    this.type = type;
    this.details = details;
    this.name = "ApiError";
  }

  /**
   * Creates a Response object from this error
   */
  toResponse(): Response {
    const status = ErrorStatusCodes[this.type] || 500;
    return createErrorResponse(status, this.message, this.details, this.type);
  }

  // Helper factory methods for common errors
  static validationError<T = unknown>(message: string, details?: T): ApiError<T> {
    return new ApiError<T>(ApiErrorTypes.VALIDATION_ERROR, message, details);
  }

  static authenticationError(message = "Wymagane uwierzytelnienie"): ApiError {
    return new ApiError(ApiErrorTypes.AUTHENTICATION_ERROR, message);
  }

  static authorizationError(message = "Brak wymaganych uprawnień"): ApiError {
    return new ApiError(ApiErrorTypes.AUTHORIZATION_ERROR, message);
  }

  static notFoundError(resource = "Zasób"): ApiError {
    return new ApiError(ApiErrorTypes.RESOURCE_NOT_FOUND, `${resource} nie został znaleziony`);
  }

  static internalError(message = "Wystąpił błąd wewnętrzny serwera"): ApiError {
    return new ApiError(ApiErrorTypes.INTERNAL_ERROR, message);
  }
}

/**
 * Obsługuje synchronizację planów podróży w trybie offline
 * @param planId ID planu do synchronizacji
 * @returns Informacja, czy plan jest dostępny offline
 */
export async function handlePlanOfflineSync(planId: string): Promise<boolean> {
  // Sprawdź, czy przeglądarka wspiera PWA i Service Worker
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    // Sprawdź, czy plan jest w cache
    const cacheStorage = await caches.open("api-plans-cache");
    const cachedResponse = await cacheStorage.match(`/api/plans/${planId}`);

    if (cachedResponse) {
      // Jeśli jesteśmy online, odśwież cache w tle
      if (navigator.onLine) {
        refreshPlanCache(planId, cacheStorage).catch(console.error);
      }
      return true;
    } else if (navigator.onLine) {
      // Jeśli jesteśmy online i plan nie jest w cache, dodaj go
      await refreshPlanCache(planId, cacheStorage);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error handling plan offline sync:", error);
    return false;
  }
}

/**
 * Odświeża cache dla planu podróży
 * @param planId ID planu do odświeżenia
 * @param cache Instancja cache do użycia
 */
async function refreshPlanCache(planId: string, cache: Cache): Promise<void> {
  try {
    const response = await fetch(`/api/plans/${planId}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (response.ok) {
      await cache.put(`/api/plans/${planId}`, response.clone());
    }
  } catch (error) {
    console.error("Error refreshing plan cache:", error);
  }
}
