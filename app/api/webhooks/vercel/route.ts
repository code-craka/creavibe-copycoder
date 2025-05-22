import { type NextRequest, NextResponse } from "next/server"
import { validateVercelWebhook } from "@/lib/services/vercel-service"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature validation
    const body = await request.text()
    const signature = request.headers.get("x-vercel-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    // Validate webhook signature
    if (!validateVercelWebhook(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse the webhook payload
    const payload = JSON.parse(body)

    // Handle different webhook events
    switch (payload.type) {
      case "deployment.created":
        await handleDeploymentCreated(payload)
        break
      case "deployment.ready":
        await handleDeploymentReady(payload)
        break
      case "deployment.error":
        await handleDeploymentError(payload)
        break
      case "deployment.canceled":
        await handleDeploymentCanceled(payload)
        break
      default:
        console.log(`Unhandled webhook type: ${payload.type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleDeploymentCreated(payload: any) {
  const supabase = createClient()

  await supabase
    .from("deployments")
    .update({
      status: "building",
      vercel_url: payload.deployment.url,
      updated_at: new Date().toISOString(),
    })
    .eq("vercel_deployment_id", payload.deployment.id)
}

async function handleDeploymentReady(payload: any) {
  const supabase = createClient()

  await supabase
    .from("deployments")
    .update({
      status: "ready",
      vercel_url: payload.deployment.url,
      updated_at: new Date().toISOString(),
    })
    .eq("vercel_deployment_id", payload.deployment.id)
}

async function handleDeploymentError(payload: any) {
  const supabase = createClient()

  await supabase
    .from("deployments")
    .update({
      status: "error",
      error_message: payload.deployment.errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq("vercel_deployment_id", payload.deployment.id)
}

async function handleDeploymentCanceled(payload: any) {
  const supabase = createClient()

  await supabase
    .from("deployments")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("vercel_deployment_id", payload.deployment.id)
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
