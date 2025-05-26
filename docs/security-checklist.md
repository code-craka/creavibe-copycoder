# Next.js Production Security Checklist

## 1. Supabase Row Level Security (RLS)

- [ ] Enable RLS on all tables
- [ ] Create policies that filter by `user_id`
- [ ] Test policies with different user contexts
- [ ] Implement policies for all operations (SELECT, INSERT, UPDATE, DELETE)
- [ ] Document all RLS policies

### Implementation Example

\`\`\`sql
-- Enable RLS on the table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own projects" 
ON projects FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" 
ON projects FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON projects FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON projects FOR DELETE 
USING (auth.uid() = user_id);
\`\`\`

## 2. CORS Configuration

- [ ] Configure CORS for all API endpoints
- [ ] Specify allowed origins explicitly
- [ ] Limit allowed methods to only what's necessary
- [ ] Set appropriate headers
- [ ] Test CORS with cross-origin requests

### Implementation Example

See the CORS middleware implementation in `lib/middleware/cors.ts`.

## 3. HTTP Headers

- [ ] Implement Content Security Policy (CSP)
- [ ] Set X-Content-Type-Options to 'nosniff'
- [ ] Configure X-Frame-Options to prevent clickjacking
- [ ] Set X-XSS-Protection header
- [ ] Configure Referrer-Policy
- [ ] Set Permissions-Policy to control feature usage
- [ ] Implement Strict-Transport-Security (HSTS)
- [ ] Test headers using security scanning tools

### Implementation Example

See the security headers implementation in `middleware.ts`.

## 4. Rate Limiting

- [ ] Implement rate limiting for all API routes
- [ ] Set appropriate limits based on endpoint sensitivity
- [ ] Configure different limits for authenticated vs. unauthenticated users
- [ ] Implement exponential backoff for repeated failures
- [ ] Monitor and log rate limit violations
- [ ] Provide clear error messages when limits are exceeded

### Implementation Example

See the rate limiting implementation in `lib/middleware/rate-limit.ts`.

## 5. Resource Ownership Validation

- [ ] Validate resource ownership before all data operations
- [ ] Implement helper functions for consistent validation
- [ ] Double-check ownership even when RLS is in place (defense in depth)
- [ ] Log unauthorized access attempts
- [ ] Return generic error messages to avoid information disclosure

### Implementation Example

See the resource ownership validation in `lib/supabase/rls-helpers.ts` and its usage in server actions.

## 6. User Consent Management

- [ ] Create a consent management database table
- [ ] Implement UI for gathering user consent
- [ ] Store consent with timestamps and version information
- [ ] Implement consent verification before processing data
- [ ] Provide mechanisms for users to update or revoke consent
- [ ] Implement data export and deletion capabilities for GDPR compliance

### Implementation Example

See the user consent management implementation in `app/actions/user-consent.ts`.

## 7. Cookie Consent Component

- [ ] Implement a cookie consent banner
- [ ] Allow granular control over different cookie types
- [ ] Store consent preferences
- [ ] Respect user preferences when loading analytics
- [ ] Make the banner accessible and responsive
- [ ] Ensure compliance with regional regulations (GDPR, CCPA, etc.)

### Implementation Example

See the cookie consent component implementation in `components/cookie-consent/cookie-banner.tsx`.

## Additional Security Measures

- [ ] Implement CSRF protection
- [ ] Set up security monitoring and logging
- [ ] Configure error handling to avoid information disclosure
- [ ] Implement secure authentication flows
- [ ] Set up regular security audits
- [ ] Keep dependencies updated
- [ ] Implement proper secret management
- [ ] Configure secure session handling
\`\`\`

Now, let's create a rate limiting middleware:
