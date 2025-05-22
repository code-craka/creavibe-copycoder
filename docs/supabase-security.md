# Supabase Security Best Practices

This document outlines the security best practices implemented in our application for Supabase integration.

## Client Initialization

We use different client initialization methods depending on the context and required privileges:

### 1. Server Component Client

\`\`\`typescript
import { createServerComponentClient } from "@/lib/supabase/clients"

// In a server component or server action
const supabase = createServerComponentClient()
\`\`\`

- Uses the `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Respects Row Level Security (RLS) policies
- Suitable for most server-side operations
- Maintains user session via cookies

### 2. Admin Client

\`\`\`typescript
import { createAdminClient } from "@/lib/supabase/clients"

// Only use for operations that require admin privileges
const supabase = createAdminClient()
\`\`\`

- Uses the `SUPABASE_SERVICE_ROLE_KEY`
- Bypasses RLS policies - use with caution!
- Only use for operations that require admin privileges
- Should never be used in client-side code

### 3. Browser Client

\`\`\`typescript
import { createBrowserComponentClient } from "@/lib/supabase/clients"

// In a client component
const supabase = createBrowserComponentClient()
\`\`\`

- Uses the `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Respects RLS policies
- Suitable for client-side operations
- Maintains user session via localStorage

## Row Level Security (RLS) Policies

We implement RLS policies to enforce data access control at the database level:

### Profiles Table

\`\`\`sql
-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON "profiles"
FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON "profiles"
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow public profiles to be viewed by anyone
CREATE POLICY "Public profiles are viewable by everyone"
ON "profiles"
FOR SELECT
USING (public = true);
\`\`\`

### API Tokens Table

\`\`\`sql
-- Allow users to view their own tokens
CREATE POLICY "Users can view their own tokens"
ON "api_tokens"
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to create their own tokens
CREATE POLICY "Users can create their own tokens"
ON "api_tokens"
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own tokens
CREATE POLICY "Users can update their own tokens"
ON "api_tokens"
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own tokens
CREATE POLICY "Users can delete their own tokens"
ON "api_tokens"
FOR DELETE
USING (auth.uid() = user_id);
\`\`\`

### API Usage Table

\`\`\`sql
-- Allow users to view usage for their own tokens
CREATE POLICY "Users can view usage for their own tokens"
ON "api_usage"
FOR SELECT
USING (auth.uid() IN (SELECT user_id FROM api_tokens WHERE id = token_id));

-- Allow the system to insert usage records
CREATE POLICY "System can insert usage records"
ON "api_usage"
FOR INSERT
WITH CHECK (true); -- This would typically be restricted by application logic
\`\`\`

## Security Considerations

### 1. Service Role Key Protection

- The `SUPABASE_SERVICE_ROLE_KEY` is never exposed to the client
- Admin operations are always performed on the server
- We use the principle of least privilege - only use admin client when necessary

### 2. Data Access Control

- All data access is controlled by RLS policies
- We validate user authentication before performing operations
- We check ownership of resources before allowing operations

### 3. Input Validation

- All user input is validated before being used in database operations
- We use TypeScript to ensure type safety
- We handle errors gracefully and provide meaningful error messages

### 4. Session Management

- We use secure cookies for session management on the server
- We implement proper authentication flows
- We validate sessions before allowing operations

## Vulnerability Mitigation

| Vulnerability | Mitigation |
|---------------|------------|
| SQL Injection | Use of parameterized queries via Supabase client |
| Unauthorized Access | RLS policies and authentication checks |
| Data Leakage | Strict RLS policies and data validation |
| Session Hijacking | Secure cookie handling and HTTPS |
| Privilege Escalation | Separation of admin and user operations |
\`\`\`

Let's create a setup script for initializing RLS policies:
