"use client"

import type React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps): JSX.Element {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hasConsent, setHasConsent] = useState<boolean>(false)

  useEffect(() => {
    // Check if user has given consent
    const consentStatus = localStorage.getItem("cookie-consent")
    const userHasConsented = consentStatus === "accepted"
    setHasConsent(userHasConsented)

    // Only initialize PostHog if consent is given
    if (userHasConsented && typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        capture_pageview: false,
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") ph.debug()
        },
      })
    }
  }, [])

  useEffect(() => {
    // Only track page views if consent is given
    if (hasConsent && pathname) {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`
      }

      // Track pageview
      posthog.capture("$pageview", {
        $current_url: url,
      })
    }
  }, [pathname, searchParams, hasConsent])

  // If no consent, just render children without PostHog provider
  if (!hasConsent) {
    return <>{children}</>
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
