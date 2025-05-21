// This is a server-side file that provides safe access to analytics configuration
export function getAnalyticsConfig() {
  // Only return what's needed for the client, not the raw keys
  return {
    enabled: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
  }
}
