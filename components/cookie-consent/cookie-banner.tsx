"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { updateUserConsent } from "@/app/actions/user-consent"
import { useToast } from "@/components/ui/use-toast"

type CookieCategory = {
  id: string
  name: string
  description: string
  required: boolean
}

const cookieCategories: CookieCategory[] = [
  {
    id: "necessary",
    name: "Necessary",
    description: "These cookies are essential for the website to function properly.",
    required: true,
  },
  {
    id: "functional",
    name: "Functional",
    description: "These cookies enable personalized features and functionality.",
    required: false,
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "These cookies help us understand how visitors interact with our website.",
    required: false,
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "These cookies are used to deliver relevant advertisements.",
    required: false,
  },
]

export function CookieBanner() {
  const [open, setOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    // Check if user has already set cookie preferences
    const cookieConsent = localStorage.getItem("cookie-consent")

    if (!cookieConsent) {
      // Show banner if no preferences are saved
      setShowBanner(true)
    } else {
      try {
        // Load saved preferences
        const savedPreferences = JSON.parse(cookieConsent)
        setPreferences(savedPreferences)
      } catch (error) {
        console.error("Error parsing cookie consent:", error)
        setShowBanner(true)
      }
    }
  }, [])

  const handleAcceptAll = async () => {
    const newPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }

    setPreferences(newPreferences)
    saveConsent(newPreferences)
    setShowBanner(false)
    setOpen(false)
  }

  const handleAcceptSelected = async () => {
    saveConsent(preferences)
    setShowBanner(false)
    setOpen(false)
  }

  const handleRejectAll = async () => {
    const newPreferences = {
      necessary: true, // Necessary cookies are always required
      functional: false,
      analytics: false,
      marketing: false,
    }

    setPreferences(newPreferences)
    saveConsent(newPreferences)
    setShowBanner(false)
    setOpen(false)
  }

  const saveConsent = async (consentPreferences: Record<string, boolean>) => {
    // Save to localStorage
    localStorage.setItem("cookie-consent", JSON.stringify(consentPreferences))

    // Save to database if user is authenticated
    try {
      // Update each consent type in the database
      for (const [type, granted] of Object.entries(consentPreferences)) {
        if (type === "necessary") continue // Skip necessary cookies as they're always accepted

        await updateUserConsent(type as any, granted ? "granted" : "denied", { timestamp: new Date().toISOString() })
      }

      // Apply the preferences (e.g., enable/disable analytics)
      applyConsentPreferences(consentPreferences)

      toast({
        title: "Preferences saved",
        description: "Your cookie preferences have been saved.",
      })
    } catch (error) {
      console.error("Error saving consent:", error)
      toast({
        title: "Error saving preferences",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive",
      })
    }
  }

  const applyConsentPreferences = (consentPreferences: Record<string, boolean>) => {
    // Enable/disable analytics based on preferences
    if (typeof window !== "undefined") {
      if (consentPreferences.analytics) {
        // Enable analytics
        window.posthog?.opt_in_capturing()
      } else {
        // Disable analytics
        window.posthog?.opt_out_capturing()
      }
    }
  }

  const handleToggleChange = (categoryId: string, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [categoryId]: checked,
    }))
  }

  if (!showBanner) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">Cookie Consent</h2>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
                traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                Customize
              </Button>
              <Button variant="outline" size="sm" onClick={handleRejectAll}>
                Reject All
              </Button>
              <Button size="sm" onClick={handleAcceptAll}>
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Customize your cookie preferences. Necessary cookies are always enabled as they are essential for the
              website to function properly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {cookieCategories.map((category) => (
              <div key={category.id} className="flex items-start justify-between space-x-4">
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <Switch
                  checked={preferences[category.id]}
                  onCheckedChange={(checked) => handleToggleChange(category.id, checked)}
                  disabled={category.required}
                  aria-label={`${category.name} cookies`}
                />
              </div>
            ))}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={handleRejectAll}>
              Reject All
            </Button>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAcceptSelected}>Save Preferences</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
