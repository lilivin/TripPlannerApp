/**
 * API client utility for making consistent API calls with proper error handling.
 * Use this for all client-side API calls to ensure consistent behavior.
 */

/**
 * Base error for API-related errors
 */
export class ApiClientError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

interface ApiClientOptions extends RequestInit {
  timeout?: number;
}

/**
 * Make an API call with consistent error handling
 *
 * @param url The URL to fetch
 * @param options Fetch options with additional timeout
 * @returns The JSON response data
 * @throws ApiClientError if the request fails
 */
export async function apiClient<T>(url: string, options: ApiClientOptions = {}): Promise<T> {
  const { timeout = 15000, ...fetchOptions } = options;

  // Set default headers for API calls
  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  if (!headers.has("Content-Type") && fetchOptions.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  // Add cache-busting query parameter
  const urlWithNonce = new URL(url, window.location.origin);
  urlWithNonce.searchParams.append("_nc", Date.now().toString());

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    console.log(`[API Client] Fetching ${urlWithNonce}`);

    const response = await fetch(urlWithNonce.toString(), {
      ...fetchOptions,
      headers,
      signal: controller.signal,
      cache: "no-cache",
    });

    clearTimeout(timeoutId);

    // Check if content-type is application/json
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`[API Client] Invalid content type: ${contentType}`);

      // Try to get the response text for better error reporting
      try {
        const text = await response.text();
        throw new ApiClientError(
          `Server didn't return JSON (got ${contentType || "unknown"}): ${text.substring(0, 100)}...`,
          response.status
        );
      } catch (_) {
        throw new ApiClientError(`Server didn't return JSON (got ${contentType || "unknown"})`, response.status);
      }
    }

    const data = await response.json();

    // Check for error responses
    if (!response.ok) {
      throw new ApiClientError(
        data.error || data.message || `Request failed with status ${response.status}`,
        response.status
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError("Request timed out", 408);
    }

    if (error instanceof ApiClientError) {
      throw error;
    }

    throw new ApiClientError(error instanceof Error ? error.message : "Unknown error occurred");
  }
}
