import { type NextRequest, NextResponse } from "next/server"
import { createVercelService } from "@/lib/services/vercel-service"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { deploymentId: string } }) {
  try {
    // Verify user authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { deploymentId } = params

    // Verify user has access to this deployment
    const { data: deployment } = await supabase
      .from("deployments")
      .select("*")
      .eq("vercel_deployment_id", deploymentId)
      .eq("user_id", user.id)
      .single()

    if (!deployment) {
      return NextResponse.json({ error: "Deployment not found or access denied" }, { status: 404 })
    }

    // Get status from Vercel API using secure service
    const vercelService = createVercelService()
    const vercelDeployment = await vercelService.getDeployment(deploymentId)

    // Update local database with latest status
    await supabase
      .from("deployments")
      .update({
        status: vercelDeployment.status,
        deployment_url: vercelDeployment.url,
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
        meta: vercelDeployment.meta,
      },
    })
  } catch (error) {
    console.error("Deployment status error:", error)
    return NextResponse.json({ error: "Failed to get deployment status" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { deploymentId: string } }) {
  try {
    // Verify user authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { deploymentId } = params

    // Verify user has access to this deployment and cancel permissions
    const { data: deployment } = await supabase
      .from("deployments")
      .select("*, user_projects!inner(permissions)")
      .eq("vercel_deployment_id", deploymentId)
      .eq("user_id", user.id)
      .single()

    if (!deployment || !deployment.user_projects?.permissions?.includes("cancel")) {
      return NextResponse.json({ error: "Deployment not found or insufficient permissions" }, { status: 404 })
    }

    // Cancel deployment using secure service
    const vercelService = createVercelService()
    await vercelService.cancelDeployment(deploymentId)

    // Update local database
    await supabase
      .from("deployments")
      .update({
        status: "CANCELED",
        updated_at: new Date().toISOString(),
      })
      .eq("id", deployment.id)

    return NextResponse.json({
      success: true,
      message: "Deployment canceled successfully",
    })
  } catch (error) {
    console.error("Deployment cancellation error:", error)
    return NextResponse.json({ error: "Failed to cancel deployment" }, { status: 500 })
  }
}
