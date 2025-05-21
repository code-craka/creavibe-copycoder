"use client"

import { useEffect } from "react"
import { useAnalytics } from "@/hooks/use-analytics"

export function EventTracker() {
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    // Check for tracking cookies on page load
    const checkTrackingCookies = () => {
      const cookies = document.cookie.split(";")
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=")
        if (name === "track-event") {
          try {
            const eventData = JSON.parse(decodeURIComponent(value))
            if (eventData.name) {
              trackEvent(eventData.name, eventData.properties)
            }
            // Remove the cookie after processing
            document.cookie = "track-event=; max-age=0; path=/;"
          } catch (error) {
            console.error("Error parsing tracking cookie:", error)
          }
        }
      }
    }

    checkTrackingCookies()

    // Set up an interval to check for new cookies
    const interval = setInterval(checkTrackingCookies, 2000)

    return () => clearInterval(interval)
  }, [trackEvent])

  return null
}
