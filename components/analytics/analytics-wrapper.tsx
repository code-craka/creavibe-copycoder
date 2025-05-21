import { PostHogProvider } from "./posthog-provider"
import type { ReactNode } from "react"

interface AnalyticsWrapperProps {
  children: ReactNode
}

export function AnalyticsWrapper({ children }: AnalyticsWrapperProps) {
  // Access environment variables directly in this server component
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || ""
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com"

  return (
    <PostHogProvider apiKey={posthogKey} apiHost={posthogHost}>
      {children}
    </PostHogProvider>
  )
}
