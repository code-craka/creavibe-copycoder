import type React from "react"
import { PostHogProvider } from "./posthog-provider"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Access environment variables on the server
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || ""
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com"

  return (
    <PostHogProvider apiKey={apiKey} apiHost={apiHost}>
      {children}
    </PostHogProvider>
  )
}
