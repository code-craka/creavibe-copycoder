import { type NextRequest, NextResponse } from "next/server"
import { createVercelService } from "@/lib/services/vercel-service"
import { createClient } from "@/lib/supabase/server"
import { getServerConfig } from "@/lib/config/environment"

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
    const { operation, data } = await request.json()

    if (!operation) {
      return NextResponse.json({ error: "Operation is required" }, { status: 400 })
    }

    // Verify user has permission for custom operations
    const { data: profile } = await supabase.from("profiles").select("role, permissions").eq("id", user.id).single()

    if (!profile?.permissions?.includes("custom_operations")) {
      return NextResponse.json({ error: "Custom operations permission denied" }, { status: 403 })
    }

    // Use the secure Vercel service for custom operations
    const vercelService = createVercelService()
    const result = await vercelService.performCustomOperation(operation, data)

    // Log the operation
    await supabase.from("custom_operations").insert({
      user_id: user.id,
      operation,
      data,
      result,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      result,
      operation,
    })
  } catch (error) {
    console.error("Custom operation error:", error)
    return NextResponse.json({ error: "Failed to perform custom operation" }, { status: 500 })
  }
}

// Example of using CUSTOM_KEY for specific operations
export async function GET(request: NextRequest) {
  try {
    // This demonstrates secure access to CUSTOM_KEY
    const config = getServerConfig()
    const customKey = config.custom.key

    // Verify user authentication
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Example: Use custom key to fetch data from external service
    const externalResponse = await fetch("https://api.example.com/data", {
      headers: {
        Authorization: `Bearer ${customKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!externalResponse.ok) {
      throw new Error("External API request failed")
    }

    const externalData = await externalResponse.json()

    return NextResponse.json({
      success: true,
      data: externalData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Custom GET operation error:", error)
    return NextResponse.json({ error: "Failed to fetch custom data" }, { status: 500 })
  }
}
