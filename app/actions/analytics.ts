"use server"

// This server action safely initializes analytics without exposing keys
export async function initializeAnalytics() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
  }

  // We return a boolean indicating if analytics is configured
  return {
    isConfigured: !!config.apiKey,
    apiHost: config.apiHost,
  }
}

// This server action safely checks if analytics is enabled
export async function getAnalyticsStatus() {
  return {
    isEnabled: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
  }
}
