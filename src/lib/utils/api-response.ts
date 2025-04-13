/**
 * Utilities for consistent API response formatting
 */

/**
 * Standard error response structure
 */
export interface ApiErrorResponse {
  error: string;
  details?: any;
  code?: string;
}

/**
 * Creates a formatted error response
 * @param status HTTP status code
 * @param message Error message
 * @param details Optional details about the error
 * @param code Optional error code
 */
export function createErrorResponse(
  status: number,
  message: string,
  details?: any,
  code?: string
): Response {
  const errorBody: ApiErrorResponse = {
    error: message
  };
  
  if (details) {
    errorBody.details = details;
  }
  
  if (code) {
    errorBody.code = code;
  }
  
  return new Response(JSON.stringify(errorBody), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Creates a successful response with data
 * @param data The response data
 * @param status HTTP status code (defaults to 200)
 */
export function createSuccessResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Error types for consistent error handling
 */
export const ApiErrorTypes = {
  VALIDATION_ERROR: 'validation_error',
  AUTHENTICATION_ERROR: 'authentication_error',
  AUTHORIZATION_ERROR: 'authorization_error',
  RESOURCE_NOT_FOUND: 'resource_not_found',
  CONFLICT_ERROR: 'conflict_error',
  INTERNAL_ERROR: 'internal_error'
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
  [ApiErrorTypes.INTERNAL_ERROR]: 500
};

/**
 * Helper class for consistent API errors
 */
export class ApiError extends Error {
  public readonly type: string;
  public readonly details?: any;
  
  constructor(type: string, message: string, details?: any) {
    super(message);
    this.type = type;
    this.details = details;
    this.name = 'ApiError';
  }
  
  /**
   * Creates a Response object from this error
   */
  toResponse(): Response {
    const status = ErrorStatusCodes[this.type] || 500;
    return createErrorResponse(status, this.message, this.details, this.type);
  }
  
  // Helper factory methods for common errors
  static validationError(message: string, details?: any): ApiError {
    return new ApiError(ApiErrorTypes.VALIDATION_ERROR, message, details);
  }
  
  static authenticationError(message: string = 'Wymagane uwierzytelnienie'): ApiError {
    return new ApiError(ApiErrorTypes.AUTHENTICATION_ERROR, message);
  }
  
  static authorizationError(message: string = 'Brak wymaganych uprawnień'): ApiError {
    return new ApiError(ApiErrorTypes.AUTHORIZATION_ERROR, message);
  }
  
  static notFoundError(resource: string = 'Zasób'): ApiError {
    return new ApiError(ApiErrorTypes.RESOURCE_NOT_FOUND, `${resource} nie został znaleziony`);
  }
  
  static internalError(message: string = 'Wystąpił błąd wewnętrzny serwera'): ApiError {
    return new ApiError(ApiErrorTypes.INTERNAL_ERROR, message);
  }
} 