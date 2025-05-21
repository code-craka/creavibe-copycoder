import { CookieConsent } from "../cookie-consent"

export function CookieConsentWrapper() {
  // Access environment variables directly in this server component
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || ""
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com"

  return <CookieConsent posthogKey={posthogKey} posthogHost={posthogHost} />
}
