"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type ConsentStatus = "pending" | "accepted" | "declined"

export function CookieConsent(): JSX.Element | null {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending")
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    // Check if consent has been given previously
    const storedConsent = localStorage.getItem("cookie-consent")
    if (storedConsent) {
      setConsentStatus(storedConsent as ConsentStatus)
    } else {
      // Show the consent banner if no previous choice was made
      setIsVisible(true)
    }
  }, [])

  const handleAccept = (): void => {
    localStorage.setItem("cookie-consent", "accepted")
    setConsentStatus("accepted")
    setIsVisible(false)

    // Initialize analytics only after consent
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      import("posthog-js").then((posthog) => {
        posthog.default.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
          loaded: (ph) => {
            if (process.env.NODE_ENV === "development") ph.debug()
          },
        })
      })
    }
  }

  const handleDecline = (): void => {
    localStorage.setItem("cookie-consent", "declined")
    setConsentStatus("declined")
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto max-w-md z-50 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Cookie Consent</CardTitle>
          <CardDescription>
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
            traffic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            By clicking "Accept All", you consent to our use of cookies. You can read more in our{" "}
            <Link href="/privacy" className="underline font-medium">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleDecline}>
            Decline
          </Button>
          <Button onClick={handleAccept}>Accept All</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
