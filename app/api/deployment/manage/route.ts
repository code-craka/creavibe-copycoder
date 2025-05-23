import { type NextRequest, NextResponse } from "next/server"
import { createVercelService } from "@/lib/services/vercel-service"
import { createClient } from "@/utils/supabase/server"
import { rateLimit } from "@/lib/middleware/security"

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    if (!rateLimit(request, 50, 15 * 60 * 1000)) {
      // 50 requests per 15 minutes
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    // Verify user authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Verify user has permission to view this project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 })
    }

    // Use the secure Vercel service
    const vercelService = createVercelService()
    const deployments = await vercelService.listDeployments(projectId, limit)

    return NextResponse.json({
      success: true,
      deployments: deployments.deployments,
      pagination: deployments.pagination,
    })
  } catch (error) {
    console.error("Deployment list error:", error)
    return NextResponse.json({ error: "Failed to list deployments" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Apply rate limiting
    if (!rateLimit(request, 5, 15 * 60 * 1000)) {
      // 5 cancellations per 15 minutes
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    // Verify user authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const { deploymentId } = await request.json()

    if (!deploymentId) {
      return NextResponse.json({ error: "Deployment ID is required" }, { status: 400 })
    }

    // Verify user owns this deployment
    const { data: deployment, error: deploymentError } = await supabase
      .from("deployments")
      .select("*")
      .eq("deployment_id", deploymentId)
      .eq("user_id", user.id)
      .single()

    if (deploymentError || !deployment) {
      return NextResponse.json({ error: "Deployment not found or access denied" }, { status: 404 })
    }

    // Use the secure Vercel service to cancel deployment
    const vercelService = createVercelService()
    const result = await vercelService.cancelDeployment(deploymentId)

    // Update local database
    await supabase.from("deployments").update({ status: "canceled" }).eq("deployment_id", deploymentId)

    return NextResponse.json({
      success: true,
      deployment: result,
    })
  } catch (error) {
    console.error("Deployment cancellation error:", error)
    return NextResponse.json({ error: "Failed to cancel deployment" }, { status: 500 })
  }
}
