"use client"

import type React from "react"

interface AnalyticsProviderProps {
  children: React.ReactNode
}

// This component is now just a passthrough as we've moved the functionality
// to the new components/analytics/posthog-provider.tsx
export function AnalyticsProvider({ children }: AnalyticsProviderProps): JSX.Element {
  return <>{children}</>
}
