#!/usr/bin/env node

/**
 * This script checks if all required environment variables are set.
 * Run it before deployment to ensure all necessary variables are configured.
 */

// Import dotenv to load environment variables from .env file during development
import { config } from "dotenv"

// Only load .env file in development
if (process.env.NODE_ENV !== "production") {
  config()
}

// Define required environment variables
const requiredEnvVars = [
  // Supabase
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",

  // App configuration
  "NEXT_PUBLIC_APP_URL",

  // Stripe (if using payment functionality)
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",

  // Analytics
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_POSTHOG_HOST",

  // Redis (for rate limiting and caching)
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
]

// Check if all required environment variables are set
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

// If there are missing environment variables, print them and exit with error
if (missingEnvVars.length > 0) {
  console.error("\x1b[31m%s\x1b[0m", "❌ Missing required environment variables:")
  missingEnvVars.forEach((envVar) => {
    console.error(`   - ${envVar}`)
  })
  console.error("\nPlease set these environment variables in your .env file or deployment platform.")
  process.exit(1)
} else {
  console.log("\x1b[32m%s\x1b[0m", "✅ All required environment variables are set!")
}
