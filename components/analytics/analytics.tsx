"use client"

import { useEffect } from "react"
import posthog from "posthog-js"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize PostHog
    if (typeof window !== "undefined") {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        capture_pageview: false, // We'll handle this manually
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
    }

    return () => {
      // Cleanup if needed
      posthog.shutdown()
    }
  }, [])

  // Track page views
  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }

      posthog.capture("$pageview", {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])

  return null
}
