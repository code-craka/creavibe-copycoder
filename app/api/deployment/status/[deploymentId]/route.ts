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

    // Verify user has permission to view this deployment
    const { data: deployment, error: deploymentError } = await supabase
      .from("deployments")
      .select("*")
      .eq("vercel_deployment_id", deploymentId)
      .eq("user_id", user.id)
      .single()

    if (deploymentError || !deployment) {
      return NextResponse.json({ error: "Deployment not found or access denied" }, { status: 404 })
    }

    // Get status from Vercel API using secure service
    const vercelService = createVercelService()
    const vercelDeployment = await vercelService.getDeploymentStatus(deploymentId)

    // Update local database with latest status
    await supabase
      .from("deployments")
      .update({
        status: vercelDeployment.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deployment.id)

    return NextResponse.json({
      success: true,
      deployment: {
        id: vercelDeployment.id,
        status: vercelDeployment.status,
        url: vercelDeployment.url,
        createdAt: vercelDeployment.createdAt,
        updatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Deployment status error:", error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json({ error: "Deployment not found" }, { status: 404 })
      }
      if (error.message.includes("unauthorized")) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
      }
    }

    return NextResponse.json({ error: "Failed to get deployment status" }, { status: 500 })
  }
}
