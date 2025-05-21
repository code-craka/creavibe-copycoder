"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AlertBannerProps {
  title: string
  description: string
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  icon?: React.ReactNode
  className?: string
  dismissible?: boolean
  duration?: number | null // null means it won't auto-dismiss
  onDismiss?: () => void
}

export function AlertBanner({
  title,
  description,
  variant = "default",
  icon,
  className,
  dismissible = true,
  duration = null,
  onDismiss,
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  // Handle auto-dismiss
  useEffect(() => {
    if (duration && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, isVisible, onDismiss])

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  // Determine variant-specific styles
  const variantStyles = {
    default: "",
    destructive: "border-destructive text-destructive",
    success: "border-green-500 text-green-700 dark:text-green-400",
    warning: "border-yellow-500 text-yellow-700 dark:text-yellow-400",
    info: "border-blue-500 text-blue-700 dark:text-blue-400",
  }

  return (
    <Alert
      className={cn("animate-fade-in relative", variantStyles[variant], dismissible && "pr-12", className)}
      role="alert"
    >
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  )
}
