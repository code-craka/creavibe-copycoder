# Supabase Implementation Guide

This document outlines the implementation of Supabase in our application, including best practices, security considerations, and usage patterns.

## Client Initialization

We use different client initialization methods depending on the context and required privileges:

### Server-Side Clients

#### 1. Server Component Client

\`\`\`typescript
import { createServerComponentClient } from "@/lib/supabase/clients"

// In a server component or server action
const supabase = createServerComponentClient()
\`\`\`

- Uses the `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Respects Row Level Security (RLS) policies
- Suitable for most server-side operations
- Maintains user session via cookies

#### 2. Admin Client

\`\`\`typescript
import { createAdminClient } from "@/lib/supabase/clients"

// Only use for operations that require admin privileges
const supabase = createAdminClient()
\`\`\`

- Uses the `SUPABASE_SERVICE_ROLE_KEY`
- Bypasses RLS policies - use with caution!
- Only use for operations that require admin privileges
- Should never be used in client-side code

### Client-Side Hooks

#### 1. Basic Supabase Hook

\`\`\`typescript
import { useSupabase } from "@/hooks/use-supabase"

// In a client component
function MyComponent() {
  const { supabase, user, session, loading } = useSupabase()
  
  // Use supabase client, user, or session
}
\`\`\`

#### 2. Query Hook

\`\`\`typescript
import { useSupabaseQuery } from "@/hooks/use-supabase"

// In a client component
function MyComponent() {
  const { data, loading, error, refetch } = useSupabaseQuery(
    (supabase) => supabase.from("table").select("*"),
    [] // dependencies array
  )
  
  // Use data, loading, or error
}
\`\`\`

#### 3. Mutation Hook

\`\`\`typescript
import { useSupabaseMutation } from "@/hooks/use-supabase"

// In a client component
function MyComponent() {
  const { mutate, loading, error } = useSupabaseMutation(
    (supabase, variables) => supabase.from("table").insert(variables)
  )
  
  const handleSubmit = async (data) => {
    const { error } = await mutate(data)
    if (!error) {
      // Success
    }
  }
}
\`\`\`

## Safe Query Execution

We use the `safeQuery` helper to handle errors consistently:

\`\`\`typescript
import { safeQuery } from "@/lib/supabase/clients"

// In a server component or server action
const { data, error, status } = await safeQuery(() => 
  supabase.from("table").select("*")
)

if (error) {
  // Handle error
}
\`\`\`

## Security Considerations

### 1. Key Management

- **Service Role Key**: Used only for admin operations, never exposed to clients
- **Anon Key**: Used for regular authenticated operations, safe for client exposure
- **Key Validation**: Environment variables are validated at runtime

### 2. Row Level Security (RLS)

All tables should have appropriate RLS policies to ensure data security:

\`\`\`sql
-- Example: Users can only access their own data
CREATE POLICY "Users can view their own data"
ON "table_name"
FOR SELECT
USING (auth.uid() = user_id);
\`\`\`

### 3. Error Handling

Always handle errors properly to prevent information leakage:

\`\`\`typescript
try {
  const { data, error } = await supabase.from("table").select("*")
  if (error) {
    // Log error internally but return a generic message to the client
    console.error("Database error:", error)
    return { error: "Failed to fetch data" }
  }
} catch (err) {
  // Handle unexpected errors
  console.error("Unexpected error:", err)
  return { error: "An unexpected error occurred" }
}
\`\`\`

## Performance Optimization

### 1. Client Caching

We use singleton patterns and caching to improve performance:

\`\`\`typescript
// Server-side client caching
let serverClientCache = null

export function createServerComponentClient() {
  if (serverClientCache) return serverClientCache
  
  // Create client
  const client = createServerClient(...)
  
  // Cache for future use
  serverClientCache = client
  return client
}
\`\`\`

### 2. Query Optimization

- Use specific selects instead of `select("*")` when possible
- Use pagination for large datasets
- Use appropriate indexes on your database tables

## Best Practices

1. **Use the principle of least privilege**
   - Only use admin client when absolutely necessary
   - Prefer RLS over application-level filtering

2. **Validate user input**
   - Always validate and sanitize user input before using it in queries
   - Use TypeScript for type safety

3. **Handle errors gracefully**
   - Use the `safeQuery` helper for consistent error handling
   - Log errors but return user-friendly messages

4. **Optimize for performance**
   - Cache clients when appropriate
   - Use query optimization techniques

5. **Secure your environment variables**
   - Never expose service role key to clients
   - Validate environment variables at runtime
