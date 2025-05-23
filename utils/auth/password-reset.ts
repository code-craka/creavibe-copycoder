import { createServerComponentClient } from "@/utils/supabase/clients"
import { cookies } from "next/headers"
import { createAuditLog } from "./audit-log"

/**
 * Send a password reset link to the user's email
 * @param email The email address to send the reset link to
 * @param redirectTo The URL to redirect to after reset
 * @param request The request object for audit logging
 */
export async function sendPasswordResetLink(
  email: string,
  redirectTo?: string,
  request?: Request
): Promise<boolean> {
  const supabase = createServerComponentClient()
  
  try {
    // Send the password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    })
    
    if (error) {
      console.error("Error sending password reset email:", error)
      return false
    }
    
    // Try to find the user ID for audit logging
    const { data: userData } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single()
    
    // Create an audit log entry if we found the user
    if (userData?.id && request) {
      await createAuditLog(userData.id, "password_reset_request", request, {
        metadata: { email }
      })
    }
    
    return true
  } catch (error) {
    console.error("Unexpected error sending password reset email:", error)
    return false
  }
}

/**
 * Update a user's password
 * @param userId The user ID to update the password for
 * @param newPassword The new password
 * @param request The request object for audit logging
 */
export async function updatePassword(
  userId: string,
  newPassword: string,
  request?: Request
): Promise<boolean> {
  const supabase = createServerComponentClient()
  
  try {
    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) {
      console.error("Error updating password:", error)
      return false
    }
    
    // Create an audit log entry
    if (request) {
      await createAuditLog(userId, "password_change", request)
    }
    
    return true
  } catch (error) {
    console.error("Unexpected error updating password:", error)
    return false
  }
}

/**
 * Complete the password reset process
 * @param userId The user ID completing the password reset
 * @param request The request object for audit logging
 */
export async function completePasswordReset(
  userId: string,
  request?: Request
): Promise<boolean> {
  try {
    // Create an audit log entry
    if (request) {
      await createAuditLog(userId, "password_reset_complete", request)
    }
    
    return true
  } catch (error) {
    console.error("Unexpected error completing password reset:", error)
    return false
  }
}
