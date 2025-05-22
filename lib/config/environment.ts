// Server-side environment variables (never exposed to client)
export const serverConfig = {
  // Database secrets
  supabase: {
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    jwtSecret: process.env.SUPABASE_JWT_SECRET!,
    url: process.env.SUPABASE_URL!,
  },

  // Email service secrets
  email: {
    resendApiKey: process.env.RESEND_API_KEY!,
    serverHost: process.env.EMAIL_SERVER_HOST!,
    serverPort: process.env.EMAIL_SERVER_PORT!,
    serverUser: process.env.EMAIL_SERVER_USER!,
    serverPassword: process.env.EMAIL_SERVER_PASSWORD!,
  },

  // Payment secrets
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },

  // Redis secrets
  redis: {
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  },

  // Vercel automation (CRITICAL - never expose)
  vercel: {
    automationBypassSecret: process.env.VERCEL_AUTOMATION_BYPASS_SECRET!,
  },

  // Custom application secrets
  custom: {
    key: process.env.CUSTOM_KEY!,
    vercelSecret: process.env.NEXT_PUBLIC_VERCEL_SECRET!, // Note: This should NOT be NEXT_PUBLIC_ if it's sensitive
  },
} as const

// Client-side environment variables (safe to expose)
export const clientConfig = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },

  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  },

  posthog: {
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
  },

  app: {
    url: process.env.NEXT_PUBLIC_APP_URL!,
  },

  // Only non-sensitive Vercel configuration
  vercel: {
    // Only include non-sensitive Vercel data here
    projectId: process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
  },
} as const

// Type definitions for better TypeScript support
export type ServerConfig = typeof serverConfig
export type ClientConfig = typeof clientConfig

// Validation function to ensure all required environment variables are present
export function validateEnvironmentVariables() {
  const requiredServerVars = [
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_JWT_SECRET",
    "RESEND_API_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "VERCEL_AUTOMATION_BYPASS_SECRET",
    "CUSTOM_KEY",
  ]

  const requiredClientVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_POSTHOG_KEY",
    "NEXT_PUBLIC_POSTHOG_HOST",
    "NEXT_PUBLIC_APP_URL",
  ]

  const missingVars: string[] = []

  // Check server variables (only in server environment)
  if (typeof window === "undefined") {
    requiredServerVars.forEach((varName) => {
      if (!process.env[varName]) {
        missingVars.push(varName)
      }
    })
  }

  // Check client variables
  requiredClientVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  })

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
  }
}

// Runtime check to prevent server secrets from being accessed on client
export function getServerConfig(): ServerConfig {
  if (typeof window !== "undefined") {
    throw new Error(
      "🚨 SECURITY VIOLATION: Server configuration cannot be accessed on the client side. " +
        "This prevents sensitive environment variables from being exposed to users.",
    )
  }

  // Additional validation in production
  if (process.env.NODE_ENV === "production") {
    validateEnvironmentVariables()
  }

  return serverConfig
}

// Safe client configuration getter
export function getClientConfig(): ClientConfig {
  return clientConfig
}

// Utility function to check if we're on the server
export function isServer(): boolean {
  return typeof window === "undefined"
}

// Utility function to safely access environment variables
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key]
  if (!value && !fallback) {
    throw new Error(`Environment variable ${key} is required but not set`)
  }
  return value || fallback!
}

// Security audit function to check for potential exposures
export function auditEnvironmentSecurity() {
  if (typeof window !== "undefined") {
    console.warn("🔍 Environment security audit should only run on the server")
    return
  }

  const potentiallyExposedVars: string[] = []
  const secureVars = [
    "VERCEL_AUTOMATION_BYPASS_SECRET",
    "CUSTOM_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "RESEND_API_KEY",
  ]

  // Check if any secure variables are accidentally prefixed with NEXT_PUBLIC_
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("NEXT_PUBLIC_")) {
      const baseKey = key.replace("NEXT_PUBLIC_", "")
      if (secureVars.some((secureVar) => secureVar.includes(baseKey))) {
        potentiallyExposedVars.push(key)
      }
    }
  })

  if (potentiallyExposedVars.length > 0) {
    console.error("🚨 SECURITY ALERT: Potentially exposed sensitive variables:", potentiallyExposedVars)
  } else {
    console.log("✅ Environment security audit passed")
  }

  return {
    secure: potentiallyExposedVars.length === 0,
    exposedVars: potentiallyExposedVars,
  }
}
