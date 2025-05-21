import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
  })
}
