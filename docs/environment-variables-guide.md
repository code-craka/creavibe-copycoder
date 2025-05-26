# Environment Variables Guide

This guide explains how to set up and manage environment variables for the Creavibe application in a production environment.

## Table of Contents

1. [Introduction](#introduction)
2. [Creating the .env.production File](#creating-the-env-production-file)
3. [Environment Variables Reference](#environment-variables-reference)
4. [Securely Managing Environment Variables](#securely-managing-environment-variables)
5. [Accessing Environment Variables in the Application](#accessing-environment-variables-in-the-application)
6. [Deployment Considerations](#deployment-considerations)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Introduction

Environment variables are used to store configuration settings and sensitive information that should not be hardcoded in your application. This includes API keys, database credentials, and other configuration values that may change between environments.

Next.js has built-in support for environment variables, with special handling for variables prefixed with `NEXT_PUBLIC_`.

## Creating the .env.production File

1. Create a file named `.env.production` in the root of your project.
2. Copy the contents from the `.env.production.template` file.
3. Replace the placeholder values with your actual production values.

\`\`\`bash
# Application
NEXT_PUBLIC_APP_URL=https://creavibe.pro

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key

# Analytics Configuration
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
\`\`\`

4. **Important**: Add `.env.production` to your `.gitignore` file to prevent it from being committed to your repository.

## Environment Variables Reference

| Variable | Description | Access | Source |
|----------|-------------|--------|--------|
| `NEXT_PUBLIC_APP_URL` | Base URL of the production application | Client & Server | Your domain |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Client & Server | Supabase Dashboard > Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Client & Server | Supabase Dashboard > Project Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Server only | Supabase Dashboard > Project Settings > API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Client & Server | Stripe Dashboard > Developers > API keys |
| `STRIPE_SECRET_KEY` | Stripe secret key | Server only | Stripe Dashboard > Developers > API keys |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog API key | Client & Server | PostHog Dashboard > Project Settings > Project API Key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog instance URL | Client & Server | Usually `https://app.posthog.com` |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | Server only | Upstash Dashboard > Redis > Details |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token | Server only | Upstash Dashboard > Redis > Details |

## Securely Managing Environment Variables

### Local Development

- Use `.env.local` for local development (never commit this file).
- Use `.env.production` for production builds locally.

### Production Deployment

When deploying to production, use your hosting provider's environment variable management system:

#### Vercel

1. Go to your project in the Vercel dashboard.
2. Navigate to Settings > Environment Variables.
3. Add each environment variable and its value.
4. Specify which environments (Production, Preview, Development) should use each variable.

#### Other Hosting Providers

Most hosting providers offer similar functionality. Consult your provider's documentation for specific instructions.

### Secrets Management

For highly sensitive keys:

1. Consider using a secrets manager like:
   - AWS Secrets Manager
   - Google Secret Manager
   - HashiCorp Vault
   - Vercel's integration with these services

2. Rotate keys regularly:
   - Set up a schedule for rotating sensitive keys like `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY`.
   - Document the rotation process.

## Accessing Environment Variables in the Application

### Client-Side Access

Only variables prefixed with `NEXT_PUBLIC_` are available on the client side.

\`\`\`tsx
// Client component
'use client'

function MyComponent() {
  console.log(process.env.NEXT_PUBLIC_APP_URL)
  // ✅ This works

  console.log(process.env.STRIPE_SECRET_KEY)
  // ❌ This will be undefined
  
  return <div>My Component</div>
}
\`\`\`

### Server-Side Access

All environment variables are available on the server side.

\`\`\`tsx
// Server component or Server Action
async function getServerData() {
  console.log(process.env.NEXT_PUBLIC_APP_URL)
  // ✅ This works

  console.log(process.env.STRIPE_SECRET_KEY)
  // ✅ This also works
  
  return data
}
\`\`\`

### API Routes and Server Actions

\`\`\`tsx
// In a Server Action
'use server'

import { stripe } from '@/lib/stripe'

export async function createCheckoutSession() {
  // Access server-side environment variables
  const redirectUrl = process.env.NEXT_PUBLIC_APP_URL
  
  // Use the Stripe secret key (configured in lib/stripe.ts)
  const session = await stripe.checkout.sessions.create({
    // ...
    success_url: `${redirectUrl}/success`,
  })
  
  return session
}
\`\`\`

## Deployment Considerations

### Build-Time vs. Runtime

- Environment variables are embedded during build time.
- For values that need to change without rebuilding, use runtime configuration or server-side rendering.

### Environment-Specific Builds

- Use different `.env` files for different environments:
  - `.env.development` for development
  - `.env.production` for production
  - `.env.test` for testing

### Verifying Environment Variables

Before deploying:

1. Run the environment variable check utility:
   \`\`\`bash
   node scripts/check-env.js
   \`\`\`

2. This script will verify that all required environment variables are set.

## Best Practices

1. **Never commit sensitive information**:
   - Add `.env*` to your `.gitignore` file.
   - Use environment variable management in your CI/CD pipeline.

2. **Use descriptive names**:
   - Prefix with the service name (e.g., `STRIPE_`, `SUPABASE_`).
   - Use uppercase with underscores.

3. **Validate environment variables**:
   - Check for required variables at startup.
   - Provide meaningful error messages when variables are missing.

4. **Limit `NEXT_PUBLIC_` usage**:
   - Only expose what's absolutely necessary to the client.
   - Keep sensitive information server-side only.

5. **Document all environment variables**:
   - Maintain a list of all required variables.
   - Include descriptions and example values.

6. **Use type checking**:
   - Create a typed interface for your environment variables.
   - Validate types at runtime.

## Troubleshooting

### Common Issues

1. **Environment variables not available**:
   - Ensure you've restarted the server after adding new variables.
   - Check that you're using the correct prefix (`NEXT_PUBLIC_` for client-side).

2. **Values not updating**:
   - Environment variables are embedded at build time. Rebuild the application after changing them.

3. **Undefined variables in production**:
   - Verify that the variables are correctly set in your hosting provider's dashboard.
   - Check for typos in variable names.

### Getting Help

If you encounter issues with environment variables:

1. Check the Next.js documentation on [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables).
2. Review the logs from your hosting provider for any error messages.
3. Consult the documentation for the specific service (Supabase, Stripe, etc.).
\`\`\`

Let's also create a simple script to check for required environment variables:
