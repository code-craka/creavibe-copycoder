"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SkipLinkProps {
  className?: string
  label?: string
  targetId?: string
}

export function SkipLink({ className, label = "Skip to content", targetId = "main-content" }: SkipLinkProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
        className,
      )}
    >
      {label}
    </a>
  )
}
