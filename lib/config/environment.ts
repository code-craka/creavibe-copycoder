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
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  },

  // Vercel automation (CRITICAL - never expose)
  vercel: {
    automationBypassSecret: process.env.VERCEL_AUTOMATION_BYPASS_SECRET!,
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
} as const

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
export function getServerConfig() {
  if (typeof window !== "undefined") {
    throw new Error("Server configuration cannot be accessed on the client side")
  }
  return serverConfig
}

// Safe client configuration getter
export function getClientConfig() {
  return clientConfig
}
