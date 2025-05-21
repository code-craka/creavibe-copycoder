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
  className?: string
  icon?: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  autoHideDuration?: number | null
  id?: string
}

export function AlertBanner({
  title,
  description,
  variant = "default",
  className,
  icon,
  dismissible = true,
  onDismiss,
  autoHideDuration = null,
  id,
}: AlertBannerProps): JSX.Element | null {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoHideDuration !== null) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onDismiss) onDismiss()
      }, autoHideDuration)

      return () => clearTimeout(timer)
    }
  }, [autoHideDuration, onDismiss])

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    if (onDismiss) onDismiss()
  }

  const variantClasses = {
    default: "",
    destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
    success: "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500",
    warning: "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-500",
    info: "border-blue-500/50 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500",
  }

  return (
    <Alert
      className={cn(variantClasses[variant], "relative", className)}
      id={id}
      role={variant === "destructive" ? "alert" : "status"}
    >
      {icon}
      <div className={dismissible ? "pr-8" : ""}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  )
}
