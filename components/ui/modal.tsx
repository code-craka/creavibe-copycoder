"use client"

import type React from "react"

import { useState, useEffect, useCallback, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ModalProps {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  showCloseButton?: boolean
  closeOnEsc?: boolean
  closeOnOutsideClick?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

export function Modal({
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  showCloseButton = true,
  closeOnEsc = true,
  closeOnOutsideClick = true,
  size = "md",
}: ModalProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(open)

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setIsOpen(newOpen)
      onOpenChange(newOpen)
    },
    [onOpenChange],
  )

  const handleClose = useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        handleClose()
      }
    },
    [closeOnEsc, handleClose],
  )

  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    full: "sm:max-w-screen-lg",
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeOnOutsideClick ? handleOpenChange : undefined}>
      <DialogContent
        className={`${sizeClasses[size]} p-0`}
        onKeyDown={handleKeyDown}
        onInteractOutside={closeOnOutsideClick ? undefined : (e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            {showCloseButton && (
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8" aria-label="Close dialog">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {description && <DialogDescription className="mt-2">{description}</DialogDescription>}
        </DialogHeader>
        <div className="p-6">{children}</div>
        {footer && <DialogFooter className="p-6 pt-0">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
