# Environment Variable Security Guide

## Overview

This document outlines best practices for managing environment variables securely in our Vercel deployment, with special attention to preventing the exposure of sensitive secrets like `VERCEL_AUTOMATION_BYPASS_SECRET`.

## Critical Security Principles

### 1. Client vs Server Environment Variables

**Server-Side Only (Never expose to client):**
- `VERCEL_AUTOMATION_BYPASS_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY`
- Database passwords
- API secrets

**Client-Side Safe (Prefixed with NEXT_PUBLIC_):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_POSTHOG_KEY`

### 2. Environment Variable Naming Convention

\`\`\`bash
# Server-side secrets (never prefixed with NEXT_PUBLIC_)
VERCEL_AUTOMATION_BYPASS_SECRET=secret_value
SUPABASE_SERVICE_ROLE_KEY=secret_key
STRIPE_SECRET_KEY=sk_live_...

# Client-side variables (always prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
\`\`\`

## Security Vulnerabilities of Exposed Secrets

### VERCEL_AUTOMATION_BYPASS_SECRET Exposure Risks

1. **Unauthorized Deployments**: Attackers could trigger deployments
2. **Infrastructure Access**: Potential access to Vercel project settings
3. **CI/CD Pipeline Compromise**: Manipulation of deployment processes
4. **Data Exfiltration**: Access to deployment logs and environment

### General Secret Exposure Risks

1. **Database Compromise**: Direct access to production data
2. **Financial Loss**: Unauthorized payment processing
3. **Service Disruption**: Malicious API calls
4. **Compliance Violations**: GDPR, PCI-DSS breaches

## Implementation Best Practices

### 1. Environment Variable Configuration

\`\`\`typescript
// ✅ Correct: Server-side configuration
export const serverConfig = {
  vercel: {
    automationBypassSecret: process.env.VERCEL_AUTOMATION_BYPASS_SECRET!,
  },
}

// ✅ Correct: Client-side configuration
export const clientConfig = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL!,
  },
}

// ❌ Wrong: Exposing server secrets to client
export const badConfig = {
  vercel: {
    secret: process.env.NEXT_PUBLIC_VERCEL_SECRET!, // Never do this!
  },
}
\`\`\`

### 2. API Route Security

\`\`\`typescript
// ✅ Correct: Secure API route
export async function POST(request: NextRequest) {
  // Server-side secret access
  const config = getServerConfig()
  const secret = config.vercel.automationBypassSecret
  
  // Use secret for API calls
  const response = await fetch('https://api.vercel.com/...', {
    headers: {
      'Authorization': `Bearer ${secret}`,
    },
  })
}

// ❌ Wrong: Client-side secret usage
function ClientComponent() {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET // This won't work and is insecure
}
\`\`\`

### 3. Client-Side Data Fetching

\`\`\`typescript
// ✅ Correct: Client calls secure API route
async function triggerDeployment() {
  const response = await fetch('/api/deployment/trigger', {
    method: 'POST',
    body: JSON.stringify({ projectId: 'my-project' }),
  })
}

// ❌ Wrong: Client directly calls external API with secret
async function badTriggerDeployment() {
  const response = await fetch('https://api.vercel.com/deployments', {
    headers: {
      'Authorization': `Bearer ${secret}`, // Secret not available on client
    },
  })
}
\`\`\`

## Vercel Deployment Configuration

### Environment Variables Setup

1. **Production Environment Variables** (Vercel Dashboard):
   \`\`\`
   VERCEL_AUTOMATION_BYPASS_SECRET=your_secret_here
   SUPABASE_SERVICE_ROLE_KEY=your_key_here
   STRIPE_SECRET_KEY=sk_live_...
   \`\`\`

2. **Preview Environment Variables**:
   \`\`\`
   VERCEL_AUTOMATION_BYPASS_SECRET=preview_secret_here
   SUPABASE_SERVICE_ROLE_KEY=preview_key_here
   STRIPE_SECRET_KEY=sk_test_...
   \`\`\`

3. **Development Environment Variables** (.env.local):
   \`\`\`
   VERCEL_AUTOMATION_BYPASS_SECRET=dev_secret_here
   SUPABASE_SERVICE_ROLE_KEY=dev_key_here
   STRIPE_SECRET_KEY=sk_test_...
   \`\`\`

### Build-Time Security

\`\`\`javascript
// next.config.js
module.exports = {
  env: {
    // Only expose non-sensitive variables
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    // Never expose secrets here
  },
  
  // Use serverRuntimeConfig for server-only variables
  serverRuntimeConfig: {
    vercelSecret: process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
  },
  
  // Use publicRuntimeConfig for client-safe variables
  publicRuntimeConfig: {
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
  },
}
\`\`\`

## Monitoring and Auditing

### 1. Secret Rotation

- Rotate `VERCEL_AUTOMATION_BYPASS_SECRET` monthly
- Update all dependent services simultaneously
- Monitor for failed authentication attempts

### 2. Access Logging

\`\`\`typescript
// Log all secret usage
function logSecretAccess(secretName: string, operation: string) {
  console.log({
    timestamp: new Date().toISOString(),
    secretName,
    operation,
    userId: getCurrentUserId(),
    ip: getClientIP(),
  })
}
\`\`\`

### 3. Security Scanning

- Use tools like `npm audit` for dependency vulnerabilities
- Implement static code analysis to detect secret exposure
- Regular penetration testing

## Incident Response

### If Secrets Are Exposed

1. **Immediate Actions**:
   - Rotate all exposed secrets immediately
   - Revoke compromised API keys
   - Monitor for unauthorized usage

2. **Investigation**:
   - Review access logs
   - Identify scope of exposure
   - Document timeline of events

3. **Recovery**:
   - Update all services with new secrets
   - Notify affected users if necessary
   - Implement additional security measures

## Compliance Considerations

### GDPR/Privacy
- Ensure secrets don't contain personal data
- Implement proper access controls
- Maintain audit trails

### PCI-DSS (for payment processing)
- Encrypt secrets at rest and in transit
- Implement strong access controls
- Regular security assessments

## Tools and Resources

### Recommended Tools
- **Vercel CLI**: For secure environment variable management
- **1Password/Bitwarden**: For team secret sharing
- **HashiCorp Vault**: For enterprise secret management
- **GitHub Secrets**: For CI/CD pipeline secrets

### Security Checklist

- [ ] All server secrets are not prefixed with `NEXT_PUBLIC_`
- [ ] Client-side code never directly accesses server secrets
- [ ] API routes properly validate authentication
- [ ] Secrets are rotated regularly
- [ ] Access is logged and monitored
- [ ] Environment-specific secrets are properly isolated
- [ ] Build process doesn't expose secrets in client bundles
\`\`\`

Let's create a security middleware to prevent secret exposure:
