/**
 * OpenRouter service for communicating with OpenRouter API
 */

import type {
  OpenRouterConfig,
  ChatMessage,
  RequestOptions,
  ModelParams,
  ChatCompletionResponse,
  CompletionResponse,
  RequestParams,
  JSONSchema,
  HttpClient,
  OpenRouterModel,
  Logger,
} from "./types";
import {
  OpenRouterError,
  OpenRouterApiError,
  OpenRouterConfigError,
  OpenRouterSchemaValidationError,
  OpenRouterTimeoutError,
  OpenRouterNetworkError,
} from "./errors";
import { FetchHttpClient } from "./http-client";

/**
 * Default logger implementation
 */
const defaultLogger: Logger = {
  // These methods are intentionally no-ops in production but satisfy the Logger interface
  debug: (_message: string, ..._args: unknown[]) => {
    /* no-op */
  },
  info: (_message: string, ..._args: unknown[]) => {
    /* no-op */
  },
  warn: (message: string, ...args: unknown[]) => console.warn(message, ...args),
  error: (message: string, ...args: unknown[]) => console.error(message, ...args),
};

/**
 * OpenRouter service for interacting with OpenRouter API
 */
export class OpenRouterService {
  private apiKey: string;
  private apiUrl: string;
  private defaultModel: string;
  private defaultParams: ModelParams;
  private httpClient: HttpClient;
  private logger: Logger;

  /**
   * Create a new OpenRouter service instance
   */
  constructor(config: OpenRouterConfig) {
    this.apiKey = config.apiKey || import.meta.env.OPENROUTER_API_KEY;
    this.apiUrl = config.apiUrl || "https://openrouter.ai/api/v1";
    this.defaultModel = config.defaultModel || "openai/gpt-3.5-turbo";
    this.defaultParams = config.defaultParams || {
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      timeout_ms: 60000,
    };
    this.httpClient =
      config.httpClient ||
      new FetchHttpClient({
        defaultHeaders: this.getDefaultHeaders(),
        defaultTimeout: this.defaultParams.timeout_ms,
      });
    this.logger = config.logger || defaultLogger;

    if (!this.apiKey) {
      throw new OpenRouterConfigError(
        "API key is required. Provide it in the constructor or set OPENROUTER_API_KEY environment variable."
      );
    }
  }

  /**
   * Update the configuration
   */
  public setConfig(config: Partial<OpenRouterConfig>): void {
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.apiUrl) this.apiUrl = config.apiUrl;
    if (config.defaultModel) this.defaultModel = config.defaultModel;
    if (config.defaultParams) this.defaultParams = { ...this.defaultParams, ...config.defaultParams };
    if (config.httpClient) this.httpClient = config.httpClient;
    if (config.logger) this.logger = config.logger;

    // Update HTTP client headers if using default client
    if (config.apiKey && this.httpClient instanceof FetchHttpClient) {
      this.httpClient = new FetchHttpClient({
        defaultHeaders: this.getDefaultHeaders(),
        defaultTimeout: this.defaultParams.timeout_ms,
      });
    }
  }

  /**
   * Set the default model to use
   */
  public setDefaultModel(model: string): void {
    this.defaultModel = model;
  }

  /**
   * Get available models from OpenRouter
   */
  public async getAvailableModels(): Promise<OpenRouterModel[]> {
    try {
      const response = await this.httpClient.get<{ data: OpenRouterModel[] }>(`${this.apiUrl}/models`, {
        headers: this.getDefaultHeaders(),
      });

      return response.data.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Generate a chat completion
   */
  public async generateChatCompletion(
    messages: ChatMessage[],
    options?: RequestOptions
  ): Promise<ChatCompletionResponse> {
    if (!messages || messages.length === 0) {
      throw new OpenRouterError("Messages array is required and must not be empty");
    }

    try {
      const params = this.prepareRequestParams({
        ...options,
        messages,
      });

      const response = await this.httpClient.post<ChatCompletionResponse>(`${this.apiUrl}/chat/completions`, params);

      return this.processApiResponse(response.data);
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Generate a completion for a prompt
   */
  public async generateCompletion(prompt: string, options?: RequestOptions): Promise<CompletionResponse> {
    if (!prompt) {
      throw new OpenRouterError("Prompt is required");
    }

    try {
      const params = this.prepareRequestParams({
        ...options,
        prompt,
      });

      const response = await this.httpClient.post<CompletionResponse>(`${this.apiUrl}/completions`, params);

      return response.data;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Generate a structured JSON response
   */
  public async generateStructuredResponse<T>(
    messages: ChatMessage[],
    jsonSchema: JSONSchema,
    options?: RequestOptions
  ): Promise<T> {
    const responseFormat = {
      type: "json_schema" as const,
      json_schema: {
        name: jsonSchema.title || "ResponseSchema",
        strict: true,
        schema: jsonSchema,
      },
    };

    const response = await this.generateChatCompletion(messages, { ...options, responseFormat });

    try {
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new OpenRouterError("Empty response from API");
      }

      return this.parseAndValidateJson<T>(content, jsonSchema);
    } catch (error) {
      if (error instanceof OpenRouterError) {
        throw error;
      }
      throw new OpenRouterError(`Failed to parse JSON response: ${String(error)}`);
    }
  }

  /**
   * Get default headers for API requests
   */
  private getDefaultHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://api.example.com",
      "X-Title": "TripPlannerApp",
    };
  }

  /**
   * Prepare parameters for the API request
   */
  private prepareRequestParams(
    options?: RequestOptions & { messages?: ChatMessage[]; prompt?: string }
  ): RequestParams {
    const model = options?.model || this.defaultModel;
    const params = { ...this.defaultParams, ...options?.params };

    const requestParams: RequestParams = {
      model,
      temperature: params.temperature,
      max_tokens: params.max_tokens,
      top_p: params.top_p,
      frequency_penalty: params.frequency_penalty,
      presence_penalty: params.presence_penalty,
    };

    if (options?.messages) {
      requestParams.messages = options.messages;
    }

    if (options?.prompt) {
      requestParams.prompt = options.prompt;
    }

    if (options?.responseFormat) {
      requestParams.response_format = options.responseFormat;
    }

    return requestParams;
  }

  /**
   * Process API response
   */
  private processApiResponse(response: ChatCompletionResponse): ChatCompletionResponse {
    if (!response.choices || response.choices.length === 0) {
      throw new OpenRouterApiError("Invalid response from OpenRouter API: no choices returned");
    }

    return response;
  }

  /**
   * Parse and validate JSON from response
   */
  private parseAndValidateJson<T>(text: string, schema: JSONSchema): T {
    let data: T;

    try {
      // Try to extract JSON if wrapped in markdown code blocks
      const jsonText = this.extractJsonFromResponse(text);
      data = JSON.parse(jsonText) as T;
    } catch (error) {
      throw new OpenRouterSchemaValidationError(`Failed to parse JSON response: ${String(error)}`, schema, text);
    }

    // Basic validation against schema (could use a proper JSON Schema validator)
    if (schema.type === "object" && typeof data !== "object") {
      throw new OpenRouterSchemaValidationError(`Response is not an object as required by schema`, schema, data);
    }

    if (schema.required && Array.isArray(schema.required)) {
      for (const prop of schema.required) {
        if (!(prop in (data as Record<string, unknown>))) {
          throw new OpenRouterSchemaValidationError(`Required property '${prop}' missing in response`, schema, data);
        }
      }
    }

    return data;
  }

  /**
   * Extract JSON from potentially markdown-wrapped response
   */
  private extractJsonFromResponse(text: string): string {
    // Try to extract JSON if wrapped in markdown code blocks
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);

    if (match && match[1]) {
      return match[1].trim();
    }

    return text.trim();
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: unknown): never {
    if (error instanceof OpenRouterError) {
      throw error;
    }

    if (error instanceof Error) {
      this.logger.error("OpenRouter API error:", error);

      // Network errors
      if (error.name === "AbortError") {
        throw new OpenRouterTimeoutError("Request timed out", this.defaultParams.timeout_ms || 60000);
      }

      if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
        throw new OpenRouterNetworkError("Network error", error);
      }

      // Extract status code from error message for fetch errors
      const statusMatch = error.message.match(/status (\d+)/);
      if (statusMatch) {
        const status = parseInt(statusMatch[1], 10);

        if (status === 429) {
          throw new OpenRouterApiError("Rate limit exceeded", { statusCode: status });
        }

        if (status >= 500) {
          throw new OpenRouterApiError("OpenRouter server error", { statusCode: status });
        }

        if (status === 401 || status === 403) {
          throw new OpenRouterApiError("Authentication error", { statusCode: status });
        }

        throw new OpenRouterApiError(`API error: ${error.message}`, { statusCode: status });
      }
    }

    // Default error
    throw new OpenRouterError(`Unknown error: ${String(error)}`);
  }
}
