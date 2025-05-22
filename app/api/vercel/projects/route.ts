import { type NextRequest, NextResponse } from "next/server"
import { createVercelService } from "@/lib/services/vercel-service"
import { createClient } from "@/lib/supabase/server"
import { auditEnvironmentSecurity } from "@/lib/config/environment"

export async function GET(request: NextRequest) {
  try {
    // Run security audit
    const auditResult = auditEnvironmentSecurity()
    if (!auditResult.secure) {
      console.error("Security audit failed:", auditResult.exposedVars)
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

    // Check if user has admin privileges (implement your own logic)
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Use the secure Vercel service
    const vercelService = createVercelService()
    const projects = await vercelService.getProjects()

    // Filter projects to only return those the user has access to
    const userProjects = projects.filter((project) => {
      // Implement your project access logic here
      return true // For now, return all projects for admin users
    })

    return NextResponse.json({
      success: true,
      projects: userProjects,
      count: userProjects.length,
    })
  } catch (error) {
    console.error("Vercel projects API error:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
