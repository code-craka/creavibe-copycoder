"use client"

import type React from "react"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { z } from "zod"

interface GdprFormProps {
  onSubmit: (data: Record<string, any>) => Promise<void>
  children: ReactNode
  submitText?: string
  className?: string
  gdprText?: string
  marketingText?: string
  showMarketing?: boolean
  validationSchema?: z.ZodObject<any>
}

export function GdprForm({
  onSubmit,
  children,
  submitText = "Submit",
  className = "",
  gdprText = "I agree to the Terms of Service and Privacy Policy",
  marketingText = "I agree to receive marketing communications",
  showMarketing = true,
  validationSchema,
}: GdprFormProps) {
  const [gdprConsent, setGdprConsent] = useState<boolean>(false)
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    if (!gdprConsent) {
      setErrors((prev) => ({ ...prev, gdpr: "You must agree to the terms and privacy policy" }))
      return
    }

    // Get form data
    const formData = new FormData(e.currentTarget)
    const data: Record<string, any> = {}

    formData.forEach((value, key) => {
      data[key] = value
    })

    // Add consent data
    data.gdprConsent = gdprConsent
    data.marketingConsent = marketingConsent

    // Validate with schema if provided
    if (validationSchema) {
      try {
        validationSchema.parse(data)
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {}
          error.errors.forEach((err) => {
            if (typeof err.path[0] === "string") {
              newErrors[err.path[0]] = err.message
            }
          })
          setErrors(newErrors)
          return
        }
      }
    }

    try {
      setLoading(true)
      await onSubmit(data)
    } catch (error) {
      console.error("Form submission error:", error)
      setErrors((prev) => ({ ...prev, form: "An error occurred. Please try again." }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {children}

      <div className="space-y-4 mt-6">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="gdpr-consent"
            checked={gdprConsent}
            onCheckedChange={(checked) => setGdprConsent(checked === true)}
            aria-invalid={!!errors.gdpr}
            aria-describedby={errors.gdpr ? "gdpr-error" : undefined}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="gdpr-consent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {gdprText.includes("Terms") ? (
                <>
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                    Privacy Policy
                  </Link>
                </>
              ) : (
                gdprText
              )}
            </Label>
            {errors.gdpr && (
              <p id="gdpr-error" className="text-sm text-destructive">
                {errors.gdpr}
              </p>
            )}
          </div>
        </div>

        {showMarketing && (
          <div className="flex items-start space-x-2">
            <Checkbox
              id="marketing-consent"
              checked={marketingConsent}
              onCheckedChange={(checked) => setMarketingConsent(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="marketing-consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {marketingText}
              </Label>
              <p className="text-sm text-muted-foreground">
                You can unsubscribe at any time by clicking the link in the footer of our emails.
              </p>
            </div>
          </div>
        )}

        {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : submitText}
        </Button>
      </div>
    </form>
  )
}
