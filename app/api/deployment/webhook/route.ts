import { type NextRequest, NextResponse } from "next/server"
import { getServerConfig } from "@/lib/config/environment"
import { headers } from "next/headers"

// This API route handles Vercel deployment webhooks securely
export async function POST(request: NextRequest) {
  try {
    // Get server configuration (only available server-side)
    const config = getServerConfig()

    // Verify the request is from Vercel using the automation bypass secret
    const headersList = headers()
    const vercelBypassSecret = headersList.get("x-vercel-bypass-secret")

    if (!vercelBypassSecret || vercelBypassSecret !== config.vercel.automationBypassSecret) {
      return NextResponse.json({ error: "Unauthorized: Invalid bypass secret" }, { status: 401 })
    }

    // Parse the webhook payload
    const payload = await request.json()

    // Process the deployment webhook
    const result = await processDeploymentWebhook(payload)

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Deployment webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function processDeploymentWebhook(payload: any) {
  // Implement your deployment webhook logic here
  // This function has access to server-side secrets safely

  return {
    processed: true,
    timestamp: new Date().toISOString(),
    deploymentId: payload.deploymentId,
  }
}

// Ensure this route only accepts POST requests
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
