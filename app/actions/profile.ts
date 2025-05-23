"use server"

import { createServerComponentClient } from "@/utils/supabase/clients"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

/**
 * Update a user's profile information
 */
export async function updateProfile(formData: FormData) {
  try {
    // Create a new Supabase client for this server action
    const supabase = createServerComponentClient()

    // Use getUser instead of getSession for better security
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Extract form data
    const fullName = formData.get("full_name") as string
    const username = formData.get("username") as string
    const website = formData.get("website") as string
    const avatarUrl = formData.get("avatar_url") as string

    // Update profile in Supabase
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        username: username,
        website: website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error("Error updating profile:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the settings page to reflect the changes
    revalidatePath("/settings")

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error updating profile:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

/**
 * Delete a user's account and all associated data
 */
export async function deleteAccount() {
  try {
    // Create a new Supabase client for this server action
    const supabase = createServerComponentClient()

    // Use getUser instead of getSession for better security
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Delete related data first
    // This should be done in a transaction or with cascading deletes in the database
    
    // Delete profile
    await supabase.from("profiles").delete().eq("id", user.id)
    
    // Delete projects
    await supabase.from("projects").delete().eq("user_id", user.id)
    
    // Delete API tokens
    await supabase.from("api_tokens").delete().eq("user_id", user.id)
    
    // Delete deployments
    await supabase.from("deployments").delete().eq("user_id", user.id)
    
    // Delete user's avatar from storage
    // This would require fetching the avatar path first
    // const { data: profile } = await supabase.from("profiles").select("avatar_url").eq("id", user.id).single()
    // if (profile?.avatar_url) {
    //   const avatarPath = profile.avatar_url.split("/").pop()
    //   if (avatarPath) {
    //     await supabase.storage.from("avatars").remove([avatarPath])
    //   }
    // }

    // Finally, delete the user account
    // Note: This requires admin privileges and might not work with the regular client
    // In a real app, you might want to use a serverless function with admin privileges
    // or mark the user as "deleted" in your database instead
    
    // Sign out the user
    await supabase.auth.signOut()

    // Redirect to home page
    redirect("/")
  } catch (error: any) {
    console.error("Unexpected error deleting account:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

/**
 * Create a Supabase storage bucket for avatars if it doesn't exist
 */
export async function ensureAvatarBucketExists() {
  try {
    const supabase = createServerComponentClient()
    
    // Check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error("Error listing buckets:", error)
      return { success: false, error: error.message }
    }
    
    // Check if avatars bucket exists
    const avatarBucketExists = buckets.some(bucket => bucket.name === "avatars")
    
    if (!avatarBucketExists) {
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket("avatars", {
        public: true,
        fileSizeLimit: 2 * 1024 * 1024, // 2MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"]
      })
      
      if (createError) {
        console.error("Error creating avatars bucket:", createError)
        return { success: false, error: createError.message }
      }
    }
    
    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error ensuring avatar bucket exists:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
