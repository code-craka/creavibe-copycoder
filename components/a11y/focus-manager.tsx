"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface FocusManagerProps {
  children: React.ReactNode
  focusFirst?: boolean
  restoreFocus?: boolean
  className?: string
}

export function FocusManager({ children, focusFirst = true, restoreFocus = true, className }: FocusManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Store the currently focused element
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }

    // Focus the first focusable element if requested
    if (focusFirst && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement
        firstElement.focus()
      }
    }

    return () => {
      // Restore focus when unmounted
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [focusFirst, restoreFocus])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
