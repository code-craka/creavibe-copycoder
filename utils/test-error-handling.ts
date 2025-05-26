/**
 * Test utilities for error handling
 * 
 * This file contains utilities to help test error handling in the application.
 * It provides mock error generators and validation functions.
 */

import { ApiError, ApiResponse } from "./api-response";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Creates a mock PostgrestError for testing
 */
export function createMockPostgrestError(
  message: string = "Database error",
  code: string = "23505",
  details: string = "Key (column)=(value) already exists."
): PostgrestError {
  return {
    message,
    code,
    details,
    hint: "",
  };
}

/**
 * Creates a mock ApiError for testing
 */
export function createMockApiError(
  code: string = "database_error",
  message: string = "An error occurred while accessing the database",
  details?: Record<string, any>
): ApiError {
  return {
    code,
    message,
    details,
  };
}

/**
 * Creates a mock ApiResponse with an error
 */
export function createMockErrorResponse<T>(
  error: ApiError
): ApiResponse<T> {
  return {
    data: null,
    error,
  };
}

/**
 * Creates a mock ApiResponse with data
 */
export function createMockSuccessResponse<T>(
  data: T
): ApiResponse<T> {
  return {
    data,
    error: null,
  };
}

/**
 * Validates that an ApiResponse contains an error with the expected code
 */
export function expectApiError<T>(
  response: ApiResponse<T>,
  expectedCode: string
): boolean {
  return response.error !== null && response.error.code === expectedCode;
}

/**
 * Simulates a rate-limited response
 */
export function createRateLimitedResponse<T>(): ApiResponse<T> {
  return createMockErrorResponse<T>({
    code: "rate_limited",
    message: "Too many requests. Please try again later.",
  });
}

/**
 * Simulates a validation error response
 */
export function createValidationErrorResponse<T>(
  details: Record<string, string[]>
): ApiResponse<T> {
  return createMockErrorResponse<T>({
    code: "validation_error",
    message: "Validation failed",
    details,
  });
}

/**
 * Simulates an unauthorized error response
 */
export function createUnauthorizedResponse<T>(): ApiResponse<T> {
  return createMockErrorResponse<T>({
    code: "unauthorized",
    message: "You are not authorized to perform this action",
  });
}
