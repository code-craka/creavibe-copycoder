"use client"

import { useState, type ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface AlertBannerProps {
  title: string
  description: string | ReactNode
  variant?: "default" | "destructive" | "success" | "warning"
  icon?: ReactNode
  dismissible?: boolean
  className?: string
}

export function AlertBanner({
  title,
  description,
  variant = "default",
  icon,
  dismissible = false,
  className = "",
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  // Determine the appropriate classes based on the variant
  let alertClassName = className

  if (variant === "success") {
    alertClassName += " border-green-500 bg-green-50 dark:bg-green-950/30"
  } else if (variant === "warning") {
    alertClassName += " border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30"
  } else if (variant === "destructive") {
    // The destructive variant is already styled by the Alert component
  }

  return (
    <Alert className={alertClassName} variant={variant === "destructive" ? "destructive" : "default"}>
      {icon}
      <div className="flex-1">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  )
}
