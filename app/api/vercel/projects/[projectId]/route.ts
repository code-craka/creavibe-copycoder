import { type NextRequest, NextResponse } from "next/server"
import { createVercelService } from "@/lib/services/vercel-service"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    // Await the params since they're now a Promise in Next.js 15+
    const { projectId } = await params

    // Verify user authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate projectId parameter
    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Get project details from Vercel API
    const vercelService = createVercelService()
    const project = await vercelService.getProject(projectId)

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        framework: project.framework,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    })
  } catch (error) {
    console.error("Project fetch error:", error)

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }
      if (error.message.includes("unauthorized")) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
      }
    }

    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params
    const body = await request.json()

    // Verify user authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate inputs
    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Update project via Vercel API
    const vercelService = createVercelService()
    const updatedProject = await vercelService.updateProject(projectId, body)

    return NextResponse.json({
      success: true,
      project: updatedProject,
    })
  } catch (error) {
    console.error("Project update error:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params

    // Verify user authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate projectId parameter
    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Delete project via Vercel API
    const vercelService = createVercelService()
    await vercelService.deleteProject(projectId)

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    })
  } catch (error) {
    console.error("Project deletion error:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
