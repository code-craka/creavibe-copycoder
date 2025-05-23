import { createServerComponentClient } from "@/utils/supabase/clients"
import { cookies } from "next/headers"
import { createAuditLog } from "./audit-log"

/**
 * Send an email verification link to the user's email
 * @param userId The user ID to send the verification email to
 * @param email The email address to verify
 * @param redirectTo The URL to redirect to after verification
 * @param request The request object for audit logging
 */
export async function sendEmailVerification(
  userId: string,
  email: string,
  redirectTo?: string,
  request?: Request
): Promise<boolean> {
  const supabase = createServerComponentClient()
  
  try {
    // Send the verification email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectTo
      }
    })
    
    if (error) {
      console.error("Error sending verification email:", error)
      return false
    }
    
    // Create an audit log entry
    if (userId && request) {
      await createAuditLog(userId, "email_verification_request", request, {
        metadata: { email }
      })
    }
    
    return true
  } catch (error) {
    console.error("Unexpected error sending verification email:", error)
    return false
  }
}

/**
 * Check if a user's email is verified
 * @param userId The user ID to check verification for
 */
export async function isEmailVerified(userId: string): Promise<boolean> {
  const supabase = createServerComponentClient()
  
  try {
    // Get the user's email verification status
    const { data, error } = await supabase.auth.admin.getUserById(userId)
    
    if (error || !data.user) {
      console.error("Error checking email verification status:", error)
      return false
    }
    
    return data.user.email_confirmed_at !== null
  } catch (error) {
    console.error("Unexpected error checking email verification:", error)
    return false
  }
}

/**
 * Update a user's email address with verification
 * @param userId The user ID to update the email for
 * @param newEmail The new email address
 * @param request The request object for audit logging
 */
export async function updateEmailWithVerification(
  userId: string,
  newEmail: string,
  request?: Request
): Promise<boolean> {
  const supabase = createServerComponentClient()
  
  try {
    // Update the user's email
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    })
    
    if (error) {
      console.error("Error updating email:", error)
      return false
    }
    
    // Create an audit log entry
    if (request) {
      await createAuditLog(userId, "email_change", request, {
        metadata: { new_email: newEmail }
      })
    }
    
    return true
  } catch (error) {
    console.error("Unexpected error updating email:", error)
    return false
  }
}
