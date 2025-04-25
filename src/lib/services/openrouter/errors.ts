/**
 * Custom error classes for the OpenRouter service
 */

export class OpenRouterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenRouterError";
    Object.setPrototypeOf(this, OpenRouterError.prototype);
  }
}

export class OpenRouterApiError extends OpenRouterError {
  readonly statusCode?: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, options?: { statusCode?: number; code?: string; details?: unknown }) {
    super(message);
    this.name = "OpenRouterApiError";
    this.statusCode = options?.statusCode;
    this.code = options?.code;
    this.details = options?.details;
    Object.setPrototypeOf(this, OpenRouterApiError.prototype);
  }
}

export class OpenRouterConfigError extends OpenRouterError {
  constructor(message: string) {
    super(message);
    this.name = "OpenRouterConfigError";
    Object.setPrototypeOf(this, OpenRouterConfigError.prototype);
  }
}

export class OpenRouterSchemaValidationError extends OpenRouterError {
  readonly schema: unknown;
  readonly data: unknown;

  constructor(message: string, schema: unknown, data: unknown) {
    super(message);
    this.name = "OpenRouterSchemaValidationError";
    this.schema = schema;
    this.data = data;
    Object.setPrototypeOf(this, OpenRouterSchemaValidationError.prototype);
  }
}

export class OpenRouterTimeoutError extends OpenRouterError {
  readonly timeoutMs: number;

  constructor(message: string, timeoutMs: number) {
    super(message);
    this.name = "OpenRouterTimeoutError";
    this.timeoutMs = timeoutMs;
    Object.setPrototypeOf(this, OpenRouterTimeoutError.prototype);
  }
}

export class OpenRouterNetworkError extends OpenRouterError {
  readonly cause: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "OpenRouterNetworkError";
    this.cause = cause;
    Object.setPrototypeOf(this, OpenRouterNetworkError.prototype);
  }
}

export class OpenRouterRateLimitError extends OpenRouterApiError {
  readonly retryAfter?: number;

  constructor(message: string, options?: { statusCode?: number; retryAfter?: number; details?: unknown }) {
    super(message, options);
    this.name = "OpenRouterRateLimitError";
    this.retryAfter = options?.retryAfter;
    Object.setPrototypeOf(this, OpenRouterRateLimitError.prototype);
  }
}
