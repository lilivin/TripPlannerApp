/**
 * Types for OpenRouter service
 */

export interface OpenRouterConfig {
  apiKey?: string;
  defaultModel?: string;
  apiUrl?: string;
  defaultParams?: ModelParams;
  httpClient?: HttpClient;
  logger?: Logger;
}

export interface ModelParams {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  timeout_ms?: number;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}

export interface RequestOptions {
  model?: string;
  params?: Partial<ModelParams>;
  responseFormat?: ResponseFormat;
  metadata?: Record<string, unknown>;
  abortSignal?: AbortSignal;
}

export interface ResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: Record<string, unknown>;
  };
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface CompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    text: string;
    index: number;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: number;
    completion: number;
  };
}

export interface JSONSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  title?: string;
  additionalProperties?: boolean;
  [key: string]: unknown;
}

export interface RequestParams {
  model: string;
  messages?: ChatMessage[];
  prompt?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  response_format?: ResponseFormat;
  user?: string;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface HttpClient {
  post<T = unknown>(url: string, data: unknown, config?: HttpClientConfig): Promise<HttpResponse<T>>;
  get<T = unknown>(url: string, config?: HttpClientConfig): Promise<HttpResponse<T>>;
}

export interface HttpClientConfig {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}
