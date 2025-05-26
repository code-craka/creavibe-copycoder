/**
 * Shared error handling utilities for consistent error management across the application
 */

import { PostgrestError } from "@supabase/supabase-js"
import { logger } from "./logger"
import { ErrorCode, createErrorResponse, ApiResponse } from "./api-response"

/**
 * Formats a PostgrestError into a standard Error object
 * This ensures the error has all required properties of the Error interface
 */
export function formatPostgrestError(error: PostgrestError): Error {
  const formattedError = new Error(error.message || 'Database error');
  formattedError.name = 'PostgrestError';
  (formattedError as any).code = error.code;
  (formattedError as any).details = error.details;
  (formattedError as any).hint = error.hint;
  return formattedError;
}

/**
 * Standardized database error handler for Supabase operations
 */
export function handleDatabaseError<T>(
  error: any, 
  context: string, 
  contextData?: Record<string, any>
): ApiResponse<T> {
  // Format PostgrestError to ensure it has the required 'name' property
  const formattedError = error.code ? formatPostgrestError(error) : error;
  
  // Log the error with context
  logger.error(`Database error in ${context}`, { 
    error: formattedError,
    context: contextData
  });
  
  // Return standardized error response
  return createErrorResponse(
    ErrorCode.DATABASE_ERROR,
    error.message || "Database operation failed",
    formattedError
  );
}

/**
 * Standardized error handler for try/catch blocks
 */
export function handleCatchError<T>(
  error: unknown, 
  context: string,
  contextData?: Record<string, any>
): ApiResponse<T> {
  if (error instanceof Error) {
    // Handle standard Error objects
    logger.error(`Error in ${context}`, { 
      error,
      context: contextData
    });
    
    return createErrorResponse(
      ErrorCode.SERVER_ERROR,
      `An unexpected error occurred: ${error.message}`,
      error
    );
  } else {
    // Handle PostgrestError which doesn't extend Error
    const pgError = error as PostgrestError;
    const formattedError = formatPostgrestError(pgError);
    
    logger.error(`Database error in ${context}`, { 
      error: formattedError,
      context: contextData
    });
    
    return createErrorResponse(
      ErrorCode.DATABASE_ERROR,
      formattedError.message,
      formattedError
    );
  }
}
