"use client"

import type React from "react"

import { useEffect } from "react"
import posthog from "posthog-js"
import { PostHogProvider as OriginalPostHogProvider } from "posthog-js/react"

type PostHogProviderProps = {
  children: React.ReactNode
  apiKey: string
  apiHost: string
}

export function PostHogProvider({ children, apiKey, apiHost }: PostHogProviderProps) {
  useEffect(() => {
    // Initialize PostHog
    if (typeof window !== "undefined" && apiKey) {
      posthog.init(apiKey, {
        api_host: apiHost,
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
    }

    return () => {
      if (typeof window !== "undefined") {
        posthog.shutdown()
      }
    }
  }, [apiKey, apiHost])

  return <OriginalPostHogProvider client={posthog}>{children}</OriginalPostHogProvider>
}
