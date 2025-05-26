/**
 * Standardized API response utilities
 * This file provides consistent error handling and response formatting for server actions
 */

// Define error codes for better error handling
export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  SESSION_EXPIRED = 'session_expired',
  
  // Input validation errors
  VALIDATION_ERROR = 'validation_error',
  INVALID_INPUT = 'invalid_input',
  
  // Database errors
  DATABASE_ERROR = 'database_error',
  RECORD_NOT_FOUND = 'record_not_found',
  DUPLICATE_RECORD = 'duplicate_record',
  
  // Server errors
  SERVER_ERROR = 'server_error',
  NOT_IMPLEMENTED = 'not_implemented',
  
  // Rate limiting
  RATE_LIMITED = 'rate_limited',
  
  // Custom application errors
  ALREADY_EXISTS = 'already_exists',
  DEPENDENCY_EXISTS = 'dependency_exists',
  RESOURCE_LOCKED = 'resource_locked',
}

// Define the API error structure
export type ApiError = {
  code: ErrorCode | string;
  message: string;
  details?: any;
}

// Define the API response structure
export type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
}

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    error: null
  }
}

/**
 * Create an error API response
 */
export function createErrorResponse(
  code: ErrorCode | string, 
  message: string, 
  details?: any
): ApiResponse<any> {
  return {
    data: null,
    error: { code, message, details }
  }
}

/**
 * Handle database errors and convert them to standardized API responses
 */
export function handleDatabaseError(error: any): ApiResponse<any> {
  console.error('Database error:', error)
  
  // Handle specific Supabase error codes
  if (error?.code === '23505') {
    return createErrorResponse(
      ErrorCode.DUPLICATE_RECORD,
      'A record with this information already exists',
      error
    )
  }
  
  if (error?.code === '23503') {
    return createErrorResponse(
      ErrorCode.DEPENDENCY_EXISTS,
      'This operation would violate referential integrity',
      error
    )
  }
  
  // Default database error
  return createErrorResponse(
    ErrorCode.DATABASE_ERROR,
    error?.message || 'An unexpected database error occurred',
    error
  )
}

/**
 * Handle validation errors from Zod
 */
export function handleValidationError(error: any): ApiResponse<any> {
  return createErrorResponse(
    ErrorCode.VALIDATION_ERROR,
    'Validation error',
    error.flatten ? error.flatten() : error
  )
}

/**
 * Check if a user is authenticated and return appropriate error if not
 */
export function requireAuthentication(session: any | null): ApiResponse<any> | null {
  if (!session) {
    return createErrorResponse(
      ErrorCode.UNAUTHORIZED,
      'Authentication required to perform this action'
    )
  }
  
  return null
}

/**
 * Wrap a server action with standard error handling
 */
export async function withErrorHandling<T>(
  action: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const result = await action()
    return createSuccessResponse(result)
  } catch (error: any) {
    // Check if this is already an ApiResponse error
    if (error?.error?.code) {
      return error
    }
    
    // Check for Zod validation errors
    if (error?.name === 'ZodError') {
      return handleValidationError(error)
    }
    
    // Check for database errors
    if (error?.code && typeof error.code === 'string') {
      return handleDatabaseError(error)
    }
    
    // Default server error
    console.error('Server error:', error)
    return createErrorResponse(
      ErrorCode.SERVER_ERROR,
      error?.message || 'An unexpected error occurred',
      process.env.NODE_ENV === 'development' ? error : undefined
    )
  }
}
