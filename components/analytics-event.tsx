"use client"

import { useEffect } from "react"
import posthog from "posthog-js"

export function AnalyticsEvents({ selector = "[data-analytics-event]" }: { selector?: string }) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const element = target.closest(selector) as HTMLElement | null

      if (element && posthog.__loaded) {
        const eventName = element.getAttribute("data-analytics-event")
        if (!eventName) return

        // Collect additional properties from data attributes
        const props: Record<string, string> = {}
        for (const attr of Array.from(element.attributes)) {
          if (attr.name.startsWith("data-analytics-prop-")) {
            const propName = attr.name.replace("data-analytics-prop-", "")
            props[propName] = attr.value
          }
        }

        // Track the event
        posthog.capture(eventName, props)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [selector])

  return null
}
