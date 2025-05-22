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
    await supabase.from("deployments").update({ status: vercelDeployment.status }).eq("id", deployment.id)

    return NextResponse.json({
      success: true,
      deployment: {
        id: vercelDeployment.id,
        status: vercelDeployment.status,
        url: vercelDeployment.url,
        createdAt: vercelDeployment.createdAt,
      },
    })
  } catch (error) {
    console.error("Deployment status error:", error)
    return NextResponse.json({ error: "Failed to get deployment status" }, { status: 500 })
  }
}
