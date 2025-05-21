"use client"

import posthog from "posthog-js"
import { useEffect, useState } from "react"

interface AnalyticsHook {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void
  identifyUser: (userId: string, properties?: Record<string, any>) => void
  resetUser: () => void
  hasConsent: boolean
}

export function useAnalytics(): AnalyticsHook {
  const [hasConsent, setHasConsent] = useState<boolean>(false)

  useEffect(() => {
    const consentStatus = localStorage.getItem("cookie-consent")
    setHasConsent(consentStatus === "accepted")
  }, [])

  const trackEvent = (eventName: string, properties?: Record<string, any>): void => {
    if (hasConsent) {
      posthog.capture(eventName, properties)
    }
  }

  const identifyUser = (userId: string, properties?: Record<string, any>): void => {
    if (hasConsent) {
      posthog.identify(userId, properties)
    }
  }

  const resetUser = (): void => {
    if (hasConsent) {
      posthog.reset()
    }
  }

  return {
    trackEvent,
    identifyUser,
    resetUser,
    hasConsent,
  }
}
