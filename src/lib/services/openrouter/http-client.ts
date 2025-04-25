/**
 * HTTP client for the OpenRouter service
 */

import type { HttpClient, HttpClientConfig, HttpResponse } from "./types";
import { OpenRouterNetworkError, OpenRouterTimeoutError } from "./errors";

/**
 * Default implementation of the HttpClient interface
 * using the fetch API
 */
export class FetchHttpClient implements HttpClient {
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultTimeout: number;

  constructor(options?: { defaultHeaders?: Record<string, string>; defaultTimeout?: number }) {
    this.defaultHeaders = options?.defaultHeaders || {};
    this.defaultTimeout = options?.defaultTimeout || 30000; // 30 seconds default
  }

  /**
   * Send a POST request
   */
  async post<T = unknown>(url: string, data: unknown, config?: HttpClientConfig): Promise<HttpResponse<T>> {
    return this.request<T>("POST", url, data, config);
  }

  /**
   * Send a GET request
   */
  async get<T = unknown>(url: string, config?: HttpClientConfig): Promise<HttpResponse<T>> {
    return this.request<T>("GET", url, undefined, config);
  }

  /**
   * Base request method
   */
  private async request<T = unknown>(
    method: string,
    url: string,
    data?: unknown,
    config?: HttpClientConfig
  ): Promise<HttpResponse<T>> {
    const headers = {
      "Content-Type": "application/json",
      ...this.defaultHeaders,
      ...config?.headers,
    };

    const controller = new AbortController();
    const timeout = config?.timeout || this.defaultTimeout;
    const signal = config?.signal || controller.signal;

    // Setup timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers,
        signal,
        body: data ? JSON.stringify(data) : undefined,
      };

      const response = await fetch(url, fetchOptions);
      const responseHeaders: Record<string, string> = {};

      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Parse response body
      let responseData: T;
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        responseData = (await response.json()) as T;
      } else {
        const text = await response.text();
        try {
          responseData = JSON.parse(text) as T;
        } catch {
          responseData = text as unknown as T;
        }
      }

      return {
        data: responseData,
        status: response.status,
        headers: responseHeaders,
      };
    } catch (error) {
      const err = error as Error;

      if (err.name === "AbortError") {
        throw new OpenRouterTimeoutError(`Request timed out after ${timeout}ms`, timeout);
      }

      throw new OpenRouterNetworkError("Network error occurred", err);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
