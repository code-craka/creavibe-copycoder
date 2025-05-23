import { createServerComponentClient } from "@/utils/supabase/clients"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { sendEmailVerification } from "@/utils/auth/email-verification"
import { createAuditLog } from "@/utils/auth/audit-log"

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
    
    // Get the email to verify from the request body or use the user's email
    const body = await request.json()
    const email = body.email || user.email
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }
    
    // Get the redirect URL from the request body
    const redirectTo = body.redirectTo || `${request.nextUrl.origin}/settings`
    
    // Send the verification email
    const success = await sendEmailVerification(user.id, email, redirectTo, request)
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully"
    })
  } catch (error) {
    console.error("Error sending verification email:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
