"use client"

import { useState, useEffect, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModalProps {
  title: string
  description?: string
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  contentClassName?: string
  footer?: ReactNode
  closeButton?: boolean
  closeLabel?: string
}

export function Modal({
  title,
  description,
  children,
  open,
  onOpenChange,
  className,
  contentClassName,
  footer,
  closeButton = true,
  closeLabel = "Close",
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-lg", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className={cn("py-4", contentClassName)}>{children}</div>
        {(footer || closeButton) && (
          <DialogFooter>
            {footer}
            {closeButton && (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {closeLabel}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
