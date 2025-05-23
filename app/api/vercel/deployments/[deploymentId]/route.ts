import { type NextRequest, NextResponse } from "next/server"
import { createVercelService } from "@/lib/services/vercel-service"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ deploymentId: string }> }) {
  try {
    // Await the params since they're now a Promise in Next.js 15+
    const { deploymentId } = await params

    // Verify user authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate deploymentId parameter
    if (!deploymentId || typeof deploymentId !== "string") {
      return NextResponse.json({ error: "Invalid deployment ID" }, { status: 400 })
    }

    // Get deployment details from Vercel API
    const vercelService = createVercelService()
    const deployment = await vercelService.getDeployment(deploymentId)

    return NextResponse.json({
      success: true,
      deployment: {
        id: deployment.id,
        url: deployment.url,
        state: deployment.state,
        createdAt: deployment.createdAt,
        meta: deployment.meta,
      },
    })
  } catch (error) {
    console.error("Deployment fetch error:", error)

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json({ error: "Deployment not found" }, { status: 404 })
      }
      if (error.message.includes("unauthorized")) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
      }
    }

    return NextResponse.json({ error: "Failed to fetch deployment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ deploymentId: string }> }) {
  try {
    const { deploymentId } = await params

    // Verify user authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate deploymentId parameter
    if (!deploymentId || typeof deploymentId !== "string") {
      return NextResponse.json({ error: "Invalid deployment ID" }, { status: 400 })
    }

    // Cancel/delete deployment via Vercel API
    const vercelService = createVercelService()
    await vercelService.cancelDeployment(deploymentId)

    return NextResponse.json({
      success: true,
      message: "Deployment cancelled successfully",
    })
  } catch (error) {
    console.error("Deployment cancellation error:", error)
    return NextResponse.json({ error: "Failed to cancel deployment" }, { status: 500 })
  }
}
