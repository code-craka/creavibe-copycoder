"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import posthog from "posthog-js"

type ConsentStatus = "pending" | "accepted" | "declined"

// These props are passed from the server component
interface CookieConsentProps {
  posthogKey?: string
  posthogHost?: string
}

export function CookieConsent({
  posthogKey,
  posthogHost = "https://app.posthog.com",
}: CookieConsentProps): JSX.Element | null {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending")
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    // Check if consent has been given previously
    const storedConsent = localStorage.getItem("cookie-consent")
    if (storedConsent) {
      setConsentStatus(storedConsent as ConsentStatus)

      // If consent was previously accepted, initialize PostHog
      if (storedConsent === "accepted" && posthogKey && !posthog.__loaded) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          loaded: (ph) => {
            if (process.env.NODE_ENV === "development") ph.debug()
          },
        })
      }
    } else {
      // Show the consent banner if no previous choice was made
      setIsVisible(true)
    }
  }, [posthogKey, posthogHost])

  const handleAccept = (): void => {
    localStorage.setItem("cookie-consent", "accepted")
    setConsentStatus("accepted")
    setIsVisible(false)

    // Initialize analytics only after consent
    if (posthogKey && !posthog.__loaded) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") ph.debug()
        },
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
