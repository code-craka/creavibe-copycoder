/**
 * Type-safe environment variable access
 */

// Define the shape of our environment variables
interface Env {
  // Application
  NEXT_PUBLIC_APP_URL: string

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string
  STRIPE_SECRET_KEY: string

  // Analytics
  NEXT_PUBLIC_POSTHOG_KEY: string
  NEXT_PUBLIC_POSTHOG_HOST: string

  // Rate Limiting
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string
}

/**
 * Get an environment variable with type safety
 * @param key The environment variable key
 * @param defaultValue Optional default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export function getEnv<K extends keyof Env>(key: K, defaultValue?: string): string {
  const value = process.env[key] as string | undefined

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }

    // In development, provide a more helpful error message
    if (process.env.NODE_ENV === "development") {
      console.warn(`⚠️ Environment variable ${key} is not set`)
    }

    return ""
  }

  return value
}

/**
 * Check if all required environment variables are set
 * @returns true if all required environment variables are set, false otherwise
 */
export function checkRequiredEnvVars(): boolean {
  const requiredVars = [
    // Application
    "NEXT_PUBLIC_APP_URL",

    // Supabase
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",

    // Stripe
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",

    // Analytics
    "NEXT_PUBLIC_POSTHOG_KEY",
    "NEXT_PUBLIC_POSTHOG_HOST",

    // Rate Limiting
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(", ")}`)
    return false
  }

  return true
}

/**
 * Get the base URL of the application
 * Handles cases where NEXT_PUBLIC_APP_URL is not set
 */
export function getBaseUrl(): string {
  // Get the NEXT_PUBLIC_APP_URL environment variable
  const appUrl = getEnv("NEXT_PUBLIC_APP_URL")

  // If it's set, use it
  if (appUrl) {
    return appUrl
  }

  // Otherwise, try to construct it from the request
  if (typeof window !== "undefined") {
    // In the browser, use the current URL
    return window.location.origin
  }

  // In a server context without NEXT_PUBLIC_APP_URL, use a placeholder
  // This should be avoided in production
  return "http://localhost:3000"
}
