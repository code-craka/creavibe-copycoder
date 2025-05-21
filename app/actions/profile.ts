"use server"

import { createServerSupabaseClient } from "@/lib/server-auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateUserProfile(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const fullName = formData.get("fullName") as string
  const avatarUrl = formData.get("avatarUrl") as string

  // Update the user's profile in the profiles table
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    throw new Error(`Error updating profile: ${error.message}`)
  }

  revalidatePath("/profile")
  revalidatePath("/dashboard")
}

export async function getUserProfile() {
  const supabase = await createServerSupabaseClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get the user's profile from the profiles table
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}
