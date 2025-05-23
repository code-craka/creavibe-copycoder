import { createServerComponentClient } from "@/utils/supabase/clients"
import { NextRequest, NextResponse } from "next/server"
import { addTrustedIp, getTrustedIps, getClientIp } from "@/utils/auth/ip-security"
import { createAuditLog } from "@/utils/auth/audit-log"

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
    
    // Get trusted IPs for the user
    const trustedIps = await getTrustedIps(user.id)
    
    return NextResponse.json({ trustedIps })
  } catch (error) {
    console.error("Error fetching trusted IPs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    
    // Get the IP to add from the request body or use the current IP
    const body = await request.json()
    const ipToAdd = body.ip || getClientIp(request)
    
    // Add the IP to the trusted IPs list
    const success = await addTrustedIp(user.id, ipToAdd)
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to add trusted IP" },
        { status: 500 }
      )
    }
    
    // Create an audit log entry
    await createAuditLog(user.id, "trusted_ip_add", request, {
      metadata: { ip_address: ipToAdd }
    })
    
    // Get the newly added trusted IP
    const trustedIps = await getTrustedIps(user.id)
    const trustedIp = trustedIps.find(ip => ip.ip_address === ipToAdd)
    
    return NextResponse.json({ success: true, trustedIp })
  } catch (error) {
    console.error("Error adding trusted IP:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
