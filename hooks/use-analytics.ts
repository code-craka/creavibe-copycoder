"use client"

import { useAnalytics as useAnalyticsContext } from "@/components/providers/analytics-provider"

export function useAnalytics() {
  return useAnalyticsContext()
}
