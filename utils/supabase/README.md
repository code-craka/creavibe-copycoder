# Supabase Auth Implementation

This directory contains utilities for working with Supabase in a Next.js App Router application, following the latest Supabase guidelines for authentication and session management.

## Files Overview

- `browser-client.ts` - For client-side Supabase access (Client Components)
- `clients.ts` - Main file with all server-side client creation functions (Server Components, Server Actions, Admin operations)
- `middleware.ts` - Utilities for the Next.js middleware to handle auth session refreshing

## Usage Guidelines

### Client Components

```typescript
import { createBrowserComponentClient } from "@/utils/supabase/browser-client";

// In a client component
const supabase = createClient();
```

### Server Components

```typescript
import { createClient } from "@/utils/supabase/server";

// In a server component or server action
const supabase = await createClient();
```

### Middleware

The middleware is already set up in the root `middleware.ts` file to handle auth session refreshing. It uses the `updateSession` function from `utils/supabase/middleware.ts`.

## Authentication Flow

1. When a user visits the site, the middleware checks if they have a valid session
2. If the session is expired, it refreshes the token automatically
3. Server components can safely use `supabase.auth.getUser()` to get the current user
4. Client components can use the `useSupabase` hook to access the current user and session

## Hooks

The following hooks are available in `hooks/use-supabase.ts`:

- `useSupabase()` - Provides access to the Supabase client, user, session, and loading state
- `useSupabaseQuery()` - For making read-only Supabase queries with automatic error handling and loading states
- `useSupabaseMutation()` - For making mutations with Supabase with automatic error handling

## Security Considerations

- Always use `supabase.auth.getUser()` to verify the user's identity on the server
- Never trust `supabase.auth.getSession()` in server code as it might not revalidate the auth token
- The middleware handles token refreshing and passes the refreshed token to both the server and browser

## Protected Routes

Protected routes are defined in the `isProtectedRoute` function in the middleware. Update this function to include any new routes that require authentication.
