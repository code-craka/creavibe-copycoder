"use client"

import type React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { getAnalyticsStatus } from "@/app/actions/analytics"

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps): JSX.Element {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hasConsent, setHasConsent] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    // Check if user has given consent
    const consentStatus = localStorage.getItem("cookie-consent")
    const userHasConsented = consentStatus === "accepted"
    setHasConsent(userHasConsented)

    // Only initialize PostHog if consent is given
    if (userHasConsented && typeof window !== "undefined") {
      const initPostHog = async () => {
        const { isEnabled, host } = await getAnalyticsStatus()

        if (isEnabled && window.POSTHOG_KEY) {
          posthog.init(window.POSTHOG_KEY, {
            api_host: host,
            capture_pageview: false,
            loaded: (ph) => {
              if (process.env.NODE_ENV === "development") ph.debug()
            },
          })
          setIsInitialized(true)
        }
      }

      initPostHog()
    }
  }, [])

  useEffect(() => {
    // Only track page views if consent is given and PostHog is initialized
    if (hasConsent && isInitialized && pathname) {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`
      }

      // Track pageview
      posthog.capture("$pageview", {
        $current_url: url,
      })
    }
  }, [pathname, searchParams, hasConsent, isInitialized])

  // If no consent or not initialized, just render children without PostHog provider
  if (!hasConsent || !isInitialized) {
    return <>{children}</>
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
