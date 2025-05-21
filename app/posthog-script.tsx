import { getAnalyticsStatus } from "./actions/analytics"

export async function PosthogScript() {
  const { isEnabled } = await getAnalyticsStatus()

  if (!isEnabled) return null

  // This script will run on the client and make the key available without exposing it in client code
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.POSTHOG_KEY = "${process.env.NEXT_PUBLIC_POSTHOG_KEY}";`,
      }}
    />
  )
}
