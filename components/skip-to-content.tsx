"use client"

import { useEffect, useState } from "react"

export function SkipToContent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:top-2 focus:left-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Skip to content
    </a>
  )
}
