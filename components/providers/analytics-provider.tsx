"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import posthog from "posthog-js"
import { EventTracker } from "@/components/analytics/event-tracker"

type AnalyticsContextType = {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void
  identifyUser: (userId: string, traits?: Record<string, any>) => void
  optOut: () => void
  optIn: () => void
  isOptedOut: boolean
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [isOptedOut, setIsOptedOut] = useState<boolean>(false)

  useEffect(() => {
    // Check if user has opted out previously
    if (typeof window !== "undefined") {
      const hasOptedOut = localStorage.getItem("analytics-opt-out") === "true"
      setIsOptedOut(hasOptedOut)

      if (hasOptedOut) {
        posthog.opt_out_capturing()
      }
    }
  }, [])

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (!isOptedOut) {
      posthog.capture(eventName, properties)
    }
  }

  const identifyUser = (userId: string, traits?: Record<string, any>) => {
    if (!isOptedOut) {
      posthog.identify(userId, traits)
    }
  }

  const optOut = () => {
    posthog.opt_out_capturing()
    localStorage.setItem("analytics-opt-out", "true")
    setIsOptedOut(true)
  }

  const optIn = () => {
    posthog.opt_in_capturing()
    localStorage.setItem("analytics-opt-out", "false")
    setIsOptedOut(false)
  }

  return (
    <AnalyticsContext.Provider value={{ trackEvent, identifyUser, optOut, optIn, isOptedOut }}>
      {children}
      <EventTracker />
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
