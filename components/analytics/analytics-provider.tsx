import type React from "react"
import { AnalyticsClientProvider } from "./analytics-client-provider"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return <AnalyticsClientProvider>{children}</AnalyticsClientProvider>
}
