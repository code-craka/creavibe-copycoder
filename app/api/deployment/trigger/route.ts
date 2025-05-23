import { type NextRequest, NextResponse } from "next/server"
import { createVercelService } from "@/lib/services/vercel-service"
import { createClient } from "@/utils/supabase/server"
import { rateLimit } from "@/lib/middleware/security"

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    if (!rateLimit(request, 10, 15 * 60 * 1000)) {
      // 10 requests per 15 minutes
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
    const { projectId, branch = "main" } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Verify user has permission to deploy this project
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
    const deployment = await vercelService.triggerDeployment(projectId, branch)

    // Log the deployment in your database
    await supabase.from("deployments").insert({
      project_id: projectId,
      user_id: user.id,
      deployment_id: deployment.id,
      status: "pending",
      url: deployment.url || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: { branch }
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

// Ensure only POST requests are allowed
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
