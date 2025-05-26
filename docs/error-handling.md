# Error Handling Guidelines

## Overview

This document outlines the standardized error handling patterns implemented across the Creavibe application.

## Core Principles

1. **Consistency**: All server actions return a standardized `ApiResponse` type
2. **Type Safety**: Error types are well-defined with TypeScript
3. **Informative**: Errors contain enough information to be actionable
4. **Security**: Sensitive information is never exposed in error messages
5. **Logging**: All errors are properly logged for debugging

## ApiResponse Pattern

All server actions return an `ApiResponse` object with the following structure:

```typescript
interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}
```

Where `ApiError` is defined as:

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

## Error Handling Utilities

### `formatPostgrestError`

Converts a Supabase PostgrestError to a standardized Error object.

```typescript
const formattedError = formatPostgrestError(postgrestError);
```

### `handleDatabaseError`

Standardizes database error handling with proper logging.

```typescript
return handleDatabaseError(error, "Failed to fetch data", {
  context: { userId, additionalInfo },
});
```

### `handleCatchError`

Standardizes try/catch error handling.

```typescript
try {
  // Your code
} catch (error) {
  return handleCatchError(error, "Operation failed", {
    context: { userId, additionalInfo },
  });
}
```

## Client-Side Error Handling

Components should handle errors from server actions like this:

```typescript
const { data, error } = await serverAction();

if (error) {
  if (error.code === "validation_error" && error.details) {
    // Handle validation errors
    setErrors(error.details);
  } else {
    // Handle other errors
    toast({
      title: "Error",
      description: error.message || "An error occurred",
      variant: "destructive",
    });
  }
}
```

## Rate Limiting

Sensitive operations are protected by rate limiting:

```typescript
const rateLimitResult = await rateLimit.check(5, "api_token_create:" + userId);

if (!rateLimitResult.success) {
  return {
    data: null,
    error: {
      code: "rate_limited",
      message: "Too many requests. Please try again later.",
    },
  };
}
```

## Best Practices

1. Always use the shared error handling utilities
2. Include contextual information in error logs
3. Return user-friendly error messages
4. Implement rate limiting for sensitive operations
5. Use proper error codes for different types of errors
