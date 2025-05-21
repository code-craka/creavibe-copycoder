"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface GDPRFormProps {
  onSubmit: (data: any, consent: { gdpr: boolean; marketing: boolean }) => void
  children: ReactNode
  className?: string
  submitLabel?: string
  loading?: boolean
  marketingConsentLabel?: string
  marketingConsentDescription?: string
  showMarketingConsent?: boolean
}

export function GDPRForm({
  onSubmit,
  children,
  className,
  submitLabel = "Submit",
  loading = false,
  marketingConsentLabel = "I agree to receive marketing communications",
  marketingConsentDescription = "We'll send you updates about new features and promotions. You can unsubscribe at any time.",
  showMarketingConsent = true,
}: GDPRFormProps): JSX.Element {
  const [gdprConsent, setGdprConsent] = useState<boolean>(false)
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false)
  const [gdprError, setGdprError] = useState<string>("")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setGdprError("")

    if (!gdprConsent) {
      setGdprError("You must agree to the terms and privacy policy")
      return
    }

    // Get form data
    const formData = new FormData(e.currentTarget)
    const data: Record<string, any> = {}

    formData.forEach((value, key) => {
      data[key] = value
    })

    onSubmit(data, { gdpr: gdprConsent, marketing: marketingConsent })
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {children}

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="gdpr-consent"
            checked={gdprConsent}
            onCheckedChange={(checked) => setGdprConsent(checked === true)}
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

        {showMarketingConsent && (
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
                {marketingConsentLabel}
              </label>
              <p className="text-sm text-muted-foreground">{marketingConsentDescription}</p>
            </div>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {submitLabel}
      </Button>
    </form>
  )
}
