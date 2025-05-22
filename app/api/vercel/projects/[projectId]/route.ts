import { type NextRequest, NextResponse } from "next/server"
import { createVercelService } from "@/lib/services/vercel-service"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
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

    const { projectId } = params

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
    const project = await vercelService.getProject(projectId)

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error("Vercel project API error:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}
