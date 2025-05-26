"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

// Define consent types
export type ConsentType = "analytics" | "marketing" | "necessary" | "preferences" | "functional"

// Define consent status
export type ConsentStatus = "granted" | "denied" | "pending"

// Define consent record
export interface ConsentRecord {
  id?: string
  user_id: string
  consent_type: ConsentType
  status: ConsentStatus
  version: string
  created_at: string
  updated_at: string
  ip_address?: string
  user_agent?: string
}

// Get user consent
export async function getUserConsent(consentType: ConsentType): Promise<ConsentRecord | null> {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  // Get the consent record
  const { data, error } = await supabase
    .from("user_consents")
    .select("*")
    .eq("user_id", user.id)
    .eq("consent_type", consentType)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching user consent:", error)
    return null
  }

  return data as ConsentRecord
}

// Update user consent
export async function updateUserConsent(
  consentType: ConsentType,
  status: ConsentStatus,
  metadata: Record<string, any> = {},
): Promise<{ success: boolean; error?: string }> {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: "User not authenticated" }
  }

  // Get client information from headers if available
  const headers = new Headers()
  const ipAddress = headers.get("x-forwarded-for") || "unknown"
  const userAgent = headers.get("user-agent") || "unknown"

  // Insert the consent record
  const { error } = await supabase.from("user_consents").insert({
    user_id: user.id,
    consent_type: consentType,
    status,
    version: "1.0", // Update this when consent terms change
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ip_address: ipAddress,
    user_agent: userAgent,
    metadata,
  })

  if (error) {
    console.error("Error updating user consent:", error)
    return { success: false, error: error.message }
  }

  // Revalidate relevant paths
  revalidatePath("/settings/privacy")

  return { success: true }
}

// Check if user has granted consent
export async function hasUserConsent(consentType: ConsentType): Promise<boolean> {
  const consent = await getUserConsent(consentType)
  return consent?.status === "granted"
}

// Get all user consents
export async function getAllUserConsents(): Promise<ConsentRecord[]> {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return []
  }

  // Get all consent records
  const { data, error } = await supabase
    .from("user_consents")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching user consents:", error)
    return []
  }

  return data as ConsentRecord[]
}

// Delete user consent
export async function deleteUserConsent(consentId: string): Promise<{ success: boolean; error?: string }> {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: "User not authenticated" }
  }

  // Delete the consent record
  const { error } = await supabase.from("user_consents").delete().eq("id", consentId).eq("user_id", user.id) // Ensure the user owns this consent record

  if (error) {
    console.error("Error deleting user consent:", error)
    return { success: false, error: error.message }
  }

  // Revalidate relevant paths
  revalidatePath("/settings/privacy")

  return { success: true }
}
