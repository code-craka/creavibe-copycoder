import { createServerComponentClient } from "@/utils/supabase/clients"
import { NextRequest, NextResponse } from "next/server"
import { getUserAuditLogs, getRecentSecurityEvents } from "@/utils/auth/audit-log"

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const supabase = createServerComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const securityOnly = searchParams.get("securityOnly") === "true"
    
    // Get audit logs
    const logs = securityOnly
      ? await getRecentSecurityEvents(user.id, limit)
      : await getUserAuditLogs(user.id, limit, offset)
    
    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
