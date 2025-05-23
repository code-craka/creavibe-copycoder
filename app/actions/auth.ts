"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { errorToast, successToast } from "@/lib/toast"

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
    
    return { success: true, error: null }
  } catch (error) {
    console.error("Error signing out:", error)
    return { success: false, error: "Failed to sign out" }
  }
}

/**
 * Server action to handle sign out and redirect
 */
export async function handleSignOut() {
  const { success, error } = await signOut()
  
  if (!success) {
    // We can't use client-side toast here, but we can redirect with an error
    redirect("/login?error=Failed to sign out")
  }
  
  redirect("/login")
}
