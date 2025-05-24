import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@/utils/supabase/clients"
import { removeTrustedIp } from "@/utils/auth/ip-security"
import { createAuditLog } from "@/utils/auth/audit-log"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params since they're now a Promise in Next.js 15+
    const { id } = await params

    // Get the current user
    const supabase = createServerComponentClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the trusted IP details before removing it
    const { data: trustedIp } = await (supabase as any)
      .from("trusted_ips")
      .select("ip_address")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (!trustedIp) {
      return NextResponse.json({ error: "Trusted IP not found" }, { status: 404 })
    }

    // Remove the IP from the trusted IPs list
    const success = await removeTrustedIp(user.id, trustedIp.ip_address)

    if (!success) {
      return NextResponse.json({ error: "Failed to remove trusted IP" }, { status: 500 })
    }

    // Create an audit log entry
    await createAuditLog(user.id, "trusted_ip_remove", request, {
      metadata: { ip_address: trustedIp.ip_address }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing trusted IP:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
