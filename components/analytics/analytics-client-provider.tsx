"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { PostHogProvider } from "posthog-js/react"
import { getPostHogConfig } from "@/app/actions/analytics-config"

export function AnalyticsClientProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<{ apiKey: string; apiHost: string } | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      const posthogConfig = await getPostHogConfig()
      setConfig(posthogConfig)
    }

    fetchConfig()
  }, [])

  // Don't render PostHogProvider until we have the config
  if (!config) {
    return <>{children}</>
  }

  return (
    <PostHogProvider apiKey={config.apiKey} apiHost={config.apiHost}>
      {children}
    </PostHogProvider>
  )
}
