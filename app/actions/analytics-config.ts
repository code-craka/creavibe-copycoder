"use server"

// Server action to safely fetch PostHog configuration
export async function getPostHogConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
  }
}
