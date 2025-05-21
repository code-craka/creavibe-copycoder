"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type ConsentStatus = "pending" | "accepted" | "declined" | "customized"
type ConsentSettings = {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const defaultConsentSettings: ConsentSettings = {
  necessary: true, // Always required
  functional: false,
  analytics: false,
  marketing: false,
}

export function CookieConsent(): JSX.Element | null {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending")
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [settings, setSettings] = useState<ConsentSettings>(defaultConsentSettings)

  useEffect(() => {
    // Check if consent has been given previously
    const storedConsent = localStorage.getItem("cookie-consent-status")
    const storedSettings = localStorage.getItem("cookie-consent-settings")

    if (storedConsent) {
      setConsentStatus(storedConsent as ConsentStatus)
      if (storedSettings) {
        try {
          setSettings(JSON.parse(storedSettings))
        } catch (e) {
          console.error("Error parsing stored consent settings:", e)
        }
      }
    } else {
      // Show the consent banner if no previous choice was made
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveConsent = (status: ConsentStatus, settings: ConsentSettings) => {
    localStorage.setItem("cookie-consent-status", status)
    localStorage.setItem("cookie-consent-settings", JSON.stringify(settings))
    setConsentStatus(status)
    setIsVisible(false)

    // Initialize analytics based on consent
    if (status === "accepted" || (status === "customized" && settings.analytics)) {
      initializeAnalytics()
    }
  }

  const handleAcceptAll = (): void => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    saveConsent("accepted", allAccepted)
  }

  const handleDeclineAll = (): void => {
    saveConsent("declined", { ...defaultConsentSettings })
  }

  const handleSavePreferences = (): void => {
    saveConsent("customized", settings)
  }

  const handleSettingChange = (key: keyof ConsentSettings, value: boolean): void => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const initializeAnalytics = () => {
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

  const openConsentManager = () => {
    setIsVisible(true)
  }

  // Add a global function to reopen the consent manager
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.openCookieConsent = openConsentManager
    }
    return () => {
      if (typeof window !== "undefined") {
        delete window.openCookieConsent
      }
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-in ${
        isExpanded ? "top-0 flex items-center justify-center bg-black/50" : ""
      }`}
    >
      <Card
        className={`mx-auto max-w-lg shadow-lg ${
          isExpanded ? "w-full max-h-[90vh] overflow-y-auto" : "animate-slide-in-up"
        }`}
      >
        <CardHeader className="relative">
          <CardTitle>Cookie Preferences</CardTitle>
          <CardDescription>
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
          </CardDescription>
          {isExpanded && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsExpanded(false)}
              aria-label="Minimize cookie preferences"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isExpanded ? (
            <Tabs defaultValue="essential" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="essential">Essential</TabsTrigger>
                <TabsTrigger value="functional">Functional</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>
              <TabsContent value="essential" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Essential Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      These cookies are necessary for the website to function and cannot be switched off.
                    </p>
                  </div>
                  <Switch checked disabled aria-label="Essential cookies cannot be disabled" />
                </div>
              </TabsContent>
              <TabsContent value="functional" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Functional Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      These cookies enable personalized features and functionality.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="functional"
                      checked={settings.functional}
                      onCheckedChange={(checked) => handleSettingChange("functional", checked)}
                      aria-label="Toggle functional cookies"
                    />
                    <Label htmlFor="functional" className="sr-only">
                      Functional Cookies
                    </Label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Analytics Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      These cookies help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="analytics"
                      checked={settings.analytics}
                      onCheckedChange={(checked) => handleSettingChange("analytics", checked)}
                      aria-label="Toggle analytics cookies"
                    />
                    <Label htmlFor="analytics" className="sr-only">
                      Analytics Cookies
                    </Label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="marketing" className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Marketing Cookies</h3>
                    <p className="text-sm text-muted-foreground">
                      These cookies are used to track visitors across websites to display relevant advertisements.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="marketing"
                      checked={settings.marketing}
                      onCheckedChange={(checked) => handleSettingChange("marketing", checked)}
                      aria-label="Toggle marketing cookies"
                    />
                    <Label htmlFor="marketing" className="sr-only">
                      Marketing Cookies
                    </Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-sm text-muted-foreground">
              By clicking "Accept All", you consent to our use of cookies. You can read more in our{" "}
              <Link href="/privacy" className="underline font-medium">
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </CardContent>
        <CardFooter className={`flex ${isExpanded ? "justify-end" : "justify-between"} flex-wrap gap-2`}>
          {!isExpanded && (
            <Button variant="outline" onClick={() => setIsExpanded(true)} className="flex-1 sm:flex-none">
              Customize
            </Button>
          )}
          <Button variant="outline" onClick={handleDeclineAll} className="flex-1 sm:flex-none">
            Decline All
          </Button>
          {isExpanded ? (
            <Button onClick={handleSavePreferences} className="flex-1 sm:flex-none">
              Save Preferences
            </Button>
          ) : (
            <Button onClick={handleAcceptAll} className="flex-1 sm:flex-none">
              Accept All
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

// Add type definition for the global window object
declare global {
  interface Window {
    openCookieConsent?: () => void
  }
}
