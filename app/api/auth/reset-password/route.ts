import { createServerComponentClient } from "@/utils/supabase/clients"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { sendPasswordResetLink, updatePassword, completePasswordReset } from "@/utils/auth/password-reset"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, redirectTo } = body
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }
    
    // Get the redirect URL from the request body or use a default
    const resetRedirectTo = redirectTo || `${request.nextUrl.origin}/reset-password/confirm`
    
    // Send the password reset email
    const success = await sendPasswordResetLink(email, resetRedirectTo, request)
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to send password reset email" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully"
    })
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    
    const body = await request.json()
    const { password } = body
    
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      )
    }
    
    // Update the user's password
    const success = await updatePassword(user.id, password, request)
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      )
    }
    
    // Complete the password reset process
    await completePasswordReset(user.id, request)
    
    return NextResponse.json({
      success: true,
      message: "Password updated successfully"
    })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
