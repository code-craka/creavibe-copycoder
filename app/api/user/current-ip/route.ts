import { NextRequest, NextResponse } from "next/server"
import { getClientIp } from "@/utils/auth/ip-security"

export async function GET(request: NextRequest) {
  try {
    // Get the client IP address
    const ip = getClientIp(request)
    
    return NextResponse.json({ ip })
  } catch (error) {
    console.error("Error getting client IP:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
