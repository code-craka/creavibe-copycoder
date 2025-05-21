"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import type { ReactNode } from "react"

interface PostHogProviderProps {
  apiKey: string
  apiHost: string
  children: ReactNode
}

export function PostHogProvider({ apiKey, apiHost, children }: PostHogProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hasConsent, setHasConsent] = useState<boolean>(false)

  useEffect(() => {
    // Check if user has given consent
    const consentStatus = localStorage.getItem("cookie-consent")
    const userHasConsented = consentStatus === "accepted"
    setHasConsent(userHasConsented)

    // Only initialize PostHog if consent is given
    if (userHasConsented && apiKey) {
      posthog.init(apiKey, {
        api_host: apiHost,
        capture_pageview: false,
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") ph.debug()
        },
      })
    }
  }, [apiKey, apiHost])

  useEffect(() => {
    // Only track page views if consent is given
    if (hasConsent && pathname && posthog.__loaded) {
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

  return <PHProvider client={posthog}>{children}</PHProvider>
}
