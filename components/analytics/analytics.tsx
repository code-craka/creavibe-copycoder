"use client"

import { useEffect, useState } from "react"
import posthog from "posthog-js"
import { usePathname, useSearchParams } from "next/navigation"

type PostHogConfig = {
  apiKey: string
  apiHost: string
}

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize PostHog
  useEffect(() => {
    const initPostHog = async () => {
      if (typeof window === "undefined" || isInitialized) return

      try {
        // Fetch configuration from server
        const response = await fetch("/api/analytics/config")
        const config: PostHogConfig = await response.json()

        if (config.apiKey) {
          posthog.init(config.apiKey, {
            api_host: config.apiHost,
            capture_pageview: false,
            persistence: "localStorage",
            autocapture: true,
            session_recording: {
              maskAllInputs: true,
              maskInputOptions: {
                password: true,
                email: true,
                number: true,
                search: true,
              },
            },
            loaded: (posthog) => {
              if (process.env.NODE_ENV === "development") {
                // Make available during development
                window.posthog = posthog
              }
            },
          })
          setIsInitialized(true)
        }
      } catch (error) {
        console.error("Failed to initialize PostHog:", error)
      }
    }

    initPostHog()

    return () => {
      if (isInitialized) {
        posthog.shutdown()
      }
    }
  }, [isInitialized])

  // Track page views
  useEffect(() => {
    if (!isInitialized || !pathname) return

    let url = window.origin + pathname
    if (searchParams && searchParams.toString()) {
      url = url + `?${searchParams.toString()}`
    }

    posthog.capture("$pageview", {
      $current_url: url,
    })
  }, [pathname, searchParams, isInitialized])

  return null
}
