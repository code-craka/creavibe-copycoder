/**
 * Error Code Registry
 * 
 * This file contains all the error codes used in the application.
 * Having a centralized registry helps maintain consistency and makes
 * it easier to document and test error handling.
 */

/**
 * Error categories to organize error codes
 */
export enum ErrorCategory {
  AUTHENTICATION = "auth",
  AUTHORIZATION = "authz",
  VALIDATION = "validation",
  DATABASE = "db",
  RATE_LIMIT = "rate",
  NETWORK = "net",
  INTERNAL = "internal",
  EXTERNAL = "external",
  INPUT = "input",
}

/**
 * Error code registry with descriptions
 */
export const ERROR_CODES = {
  // Authentication errors
  [ErrorCategory.AUTHENTICATION]: {
    INVALID_CREDENTIALS: "auth_invalid_credentials",
    SESSION_EXPIRED: "auth_session_expired",
    MISSING_TOKEN: "auth_missing_token",
    INVALID_TOKEN: "auth_invalid_token",
  },

  // Authorization errors
  [ErrorCategory.AUTHORIZATION]: {
    UNAUTHORIZED: "authz_unauthorized",
    INSUFFICIENT_PERMISSIONS: "authz_insufficient_permissions",
    RESOURCE_ACCESS_DENIED: "authz_resource_access_denied",
  },

  // Validation errors
  [ErrorCategory.VALIDATION]: {
    VALIDATION_FAILED: "validation_error",
    INVALID_INPUT: "validation_invalid_input",
    MISSING_REQUIRED_FIELD: "validation_missing_required_field",
  },

  // Database errors
  [ErrorCategory.DATABASE]: {
    QUERY_FAILED: "db_query_failed",
    CONNECTION_ERROR: "db_connection_error",
    RECORD_NOT_FOUND: "db_record_not_found",
    DUPLICATE_ENTRY: "db_duplicate_entry",
    FOREIGN_KEY_VIOLATION: "db_foreign_key_violation",
  },

  // Rate limiting errors
  [ErrorCategory.RATE_LIMIT]: {
    RATE_LIMITED: "rate_limited",
    TOO_MANY_REQUESTS: "rate_too_many_requests",
  },

  // Network errors
  [ErrorCategory.NETWORK]: {
    REQUEST_TIMEOUT: "net_request_timeout",
    CONNECTION_FAILED: "net_connection_failed",
    API_UNAVAILABLE: "net_api_unavailable",
  },

  // Internal errors
  [ErrorCategory.INTERNAL]: {
    SERVER_ERROR: "internal_server_error",
    UNHANDLED_EXCEPTION: "internal_unhandled_exception",
    CONFIGURATION_ERROR: "internal_configuration_error",
  },

  // External service errors
  [ErrorCategory.EXTERNAL]: {
    SERVICE_UNAVAILABLE: "external_service_unavailable",
    INTEGRATION_ERROR: "external_integration_error",
    DEPENDENCY_FAILED: "external_dependency_failed",
  },

  // Input errors
  [ErrorCategory.INPUT]: {
    INVALID_FORMAT: "input_invalid_format",
    UNSUPPORTED_MEDIA_TYPE: "input_unsupported_media_type",
    FILE_TOO_LARGE: "input_file_too_large",
  },
};

/**
 * Get a standardized error message for a given error code
 */
export function getDefaultErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    // Authentication errors
    [ERROR_CODES[ErrorCategory.AUTHENTICATION].INVALID_CREDENTIALS]: 
      "The provided credentials are invalid",
    [ERROR_CODES[ErrorCategory.AUTHENTICATION].SESSION_EXPIRED]: 
      "Your session has expired, please log in again",
    [ERROR_CODES[ErrorCategory.AUTHENTICATION].MISSING_TOKEN]: 
      "Authentication token is missing",
    [ERROR_CODES[ErrorCategory.AUTHENTICATION].INVALID_TOKEN]: 
      "Authentication token is invalid",

    // Authorization errors
    [ERROR_CODES[ErrorCategory.AUTHORIZATION].UNAUTHORIZED]: 
      "You are not authorized to perform this action",
    [ERROR_CODES[ErrorCategory.AUTHORIZATION].INSUFFICIENT_PERMISSIONS]: 
      "You do not have sufficient permissions",
    [ERROR_CODES[ErrorCategory.AUTHORIZATION].RESOURCE_ACCESS_DENIED]: 
      "Access to the requested resource is denied",

    // Validation errors
    [ERROR_CODES[ErrorCategory.VALIDATION].VALIDATION_FAILED]: 
      "Validation failed",
    [ERROR_CODES[ErrorCategory.VALIDATION].INVALID_INPUT]: 
      "The provided input is invalid",
    [ERROR_CODES[ErrorCategory.VALIDATION].MISSING_REQUIRED_FIELD]: 
      "A required field is missing",

    // Database errors
    [ERROR_CODES[ErrorCategory.DATABASE].QUERY_FAILED]: 
      "Database query failed",
    [ERROR_CODES[ErrorCategory.DATABASE].CONNECTION_ERROR]: 
      "Failed to connect to the database",
    [ERROR_CODES[ErrorCategory.DATABASE].RECORD_NOT_FOUND]: 
      "The requested record was not found",
    [ERROR_CODES[ErrorCategory.DATABASE].DUPLICATE_ENTRY]: 
      "A record with this information already exists",
    [ERROR_CODES[ErrorCategory.DATABASE].FOREIGN_KEY_VIOLATION]: 
      "This operation violates referential integrity",

    // Rate limiting errors
    [ERROR_CODES[ErrorCategory.RATE_LIMIT].RATE_LIMITED]: 
      "Too many requests. Please try again later",
    [ERROR_CODES[ErrorCategory.RATE_LIMIT].TOO_MANY_REQUESTS]: 
      "You have exceeded the request limit",

    // Network errors
    [ERROR_CODES[ErrorCategory.NETWORK].REQUEST_TIMEOUT]: 
      "The request timed out",
    [ERROR_CODES[ErrorCategory.NETWORK].CONNECTION_FAILED]: 
      "Failed to establish a connection",
    [ERROR_CODES[ErrorCategory.NETWORK].API_UNAVAILABLE]: 
      "The API is currently unavailable",

    // Internal errors
    [ERROR_CODES[ErrorCategory.INTERNAL].SERVER_ERROR]: 
      "An internal server error occurred",
    [ERROR_CODES[ErrorCategory.INTERNAL].UNHANDLED_EXCEPTION]: 
      "An unexpected error occurred",
    [ERROR_CODES[ErrorCategory.INTERNAL].CONFIGURATION_ERROR]: 
      "There is a configuration error",

    // External service errors
    [ERROR_CODES[ErrorCategory.EXTERNAL].SERVICE_UNAVAILABLE]: 
      "An external service is unavailable",
    [ERROR_CODES[ErrorCategory.EXTERNAL].INTEGRATION_ERROR]: 
      "There was an error with an external integration",
    [ERROR_CODES[ErrorCategory.EXTERNAL].DEPENDENCY_FAILED]: 
      "A dependency failed to respond",

    // Input errors
    [ERROR_CODES[ErrorCategory.INPUT].INVALID_FORMAT]: 
      "The input format is invalid",
    [ERROR_CODES[ErrorCategory.INPUT].UNSUPPORTED_MEDIA_TYPE]: 
      "The media type is not supported",
    [ERROR_CODES[ErrorCategory.INPUT].FILE_TOO_LARGE]: 
      "The file size exceeds the maximum limit",
  };

  return errorMessages[errorCode] || "An unknown error occurred";
}
