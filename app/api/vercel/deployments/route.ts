import { type NextRequest, NextResponse } from "next/server"
import { createVercelService } from "@/lib/services/vercel-service"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
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

    // Parse request body
    const { projectId, gitRef = "main", target = "production", env = {} } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Verify user has deployment permissions for this project
    const { data: userProject } = await supabase
      .from("user_projects")
      .select("*, permissions")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .single()

    if (!userProject || !userProject.permissions?.includes("deploy")) {
      return NextResponse.json({ error: "Deployment permission denied" }, { status: 403 })
    }

    // Rate limiting check
    const { data: recentDeployments } = await supabase
      .from("deployments")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour

    if (recentDeployments && recentDeployments.length >= 10) {
      return NextResponse.json({ error: "Rate limit exceeded. Maximum 10 deployments per hour." }, { status: 429 })
    }

    // Use the secure Vercel service
    const vercelService = createVercelService()
    const deployment = await vercelService.triggerDeployment(projectId, {
      gitRef,
      target,
      env,
    })

    // Log the deployment in your database
    await supabase.from("deployments").insert({
      project_id: projectId,
      user_id: user.id,
      vercel_deployment_id: deployment.id,
      status: deployment.status,
      git_ref: gitRef,
      target,
      deployment_url: deployment.url,
    })

    return NextResponse.json({
      success: true,
      deployment: {
        id: deployment.id,
        status: deployment.status,
        url: deployment.url,
        createdAt: deployment.createdAt,
      },
    })
  } catch (error) {
    console.error("Deployment trigger error:", error)
    return NextResponse.json({ error: "Failed to trigger deployment" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Verify user has access to this project
    const { data: userProject } = await supabase
      .from("user_projects")
      .select("*")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .single()

    if (!userProject) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 })
    }

    // Use the secure Vercel service
    const vercelService = createVercelService()
    const deployments = await vercelService.getDeployments(projectId, limit)

    return NextResponse.json({
      success: true,
      deployments,
      count: deployments.length,
    })
  } catch (error) {
    console.error("Deployments fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch deployments" }, { status: 500 })
  }
}
