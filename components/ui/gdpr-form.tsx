"use client"

import type React from "react"

import { useState, type ReactNode } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface GDPRFormProps {
  onSubmit: (data: any, marketingConsent: boolean) => void
  children: ReactNode
  className?: string
  submitButton: ReactNode
  marketingLabel?: string
  marketingDescription?: string
}

export function GDPRForm({
  onSubmit,
  children,
  className,
  submitButton,
  marketingLabel = "I agree to receive marketing communications",
  marketingDescription = "We'll send you updates about new features and promotions. You can unsubscribe at any time.",
}: GDPRFormProps) {
  const [gdprConsent, setGdprConsent] = useState<boolean>(false)
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false)
  const [gdprError, setGdprError] = useState<string>("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check GDPR consent
    if (!gdprConsent) {
      setGdprError("You must agree to the terms and privacy policy")
      return
    }

    // Clear any previous errors
    setGdprError("")

    // Get form data
    const formData = new FormData(e.currentTarget)
    const data: Record<string, any> = {}

    // Convert FormData to object
    formData.forEach((value, key) => {
      data[key] = value
    })

    // Call the onSubmit handler with form data and marketing consent
    onSubmit(data, marketingConsent)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {children}

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="gdpr-consent"
            checked={gdprConsent}
            onCheckedChange={(checked) => {
              setGdprConsent(checked === true)
              if (checked === true) setGdprError("")
            }}
            aria-invalid={!!gdprError}
            aria-describedby={gdprError ? "gdpr-error" : undefined}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="gdpr-consent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
            </label>
            {gdprError && (
              <p id="gdpr-error" className="text-sm text-destructive">
                {gdprError}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="marketing-consent"
            checked={marketingConsent}
            onCheckedChange={(checked) => setMarketingConsent(checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="marketing-consent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {marketingLabel}
            </label>
            <p className="text-sm text-muted-foreground">{marketingDescription}</p>
          </div>
        </div>
      </div>

      {submitButton}
    </form>
  )
}
