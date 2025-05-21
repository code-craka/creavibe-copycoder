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

interface ModalProps {
  title: string
  description?: string
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  footer?: ReactNode
  showCloseButton?: boolean
  closeButtonText?: string
  onClose?: () => void
  className?: string
}

export function Modal({
  title,
  description,
  children,
  open,
  onOpenChange,
  footer,
  showCloseButton = true,
  closeButtonText = "Close",
  onClose,
  className = "",
}: ModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleClose = () => {
    onOpenChange(false)
    if (onClose) {
      onClose()
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter>
          {footer ||
            (showCloseButton && (
              <Button variant="outline" onClick={handleClose}>
                {closeButtonText}
              </Button>
            ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
