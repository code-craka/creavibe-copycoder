"use client"

import { useAnalytics } from "@/hooks/use-analytics"
import { useEffect, useRef } from "react"

export function AnalyticsEvents({ selector = "[data-analytics-event]" }: { selector?: string }) {
  const { trackEvent } = useAnalytics()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const element = target.closest(selector)

      if (element) {
        const eventName = element.getAttribute("data-analytics-event")
        if (eventName) {
          // Get any additional properties
          const dataAttributes = Array.from(element.attributes)
            .filter((attr) => attr.name.startsWith("data-analytics-prop-"))
            .reduce(
              (acc, attr) => {
                const propName = attr.name.replace("data-analytics-prop-", "")
                acc[propName] = attr.value
                return acc
              },
              {} as Record<string, string>,
            )

          trackEvent(eventName, dataAttributes)
        }
      }
    }

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [trackEvent, selector])

  return null
}
