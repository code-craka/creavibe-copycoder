/**
 * Utility to check if required environment variables are set
 */

export function checkRequiredEnvVars() {
  const requiredVars = [
    // Supabase
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",

    // PostHog
    "NEXT_PUBLIC_POSTHOG_KEY",
    "NEXT_PUBLIC_POSTHOG_HOST",

    // Upstash Redis (for rate limiting)
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",

    // Application
    "NEXT_PUBLIC_APP_URL",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(", ")}`)
    return false
  }

  return true
}

export function getEnvVar(name: string, defaultValue = ""): string {
  const value = process.env[name]
  if (!value) {
    console.warn(`⚠️ Environment variable ${name} is not set, using default value`)
    return defaultValue
  }
  return value
}
