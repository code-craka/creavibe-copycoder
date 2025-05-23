"use server"

import { createServerComponentClient } from "@/utils/supabase/clients"
import { revalidatePath } from "next/cache"
import { z } from "zod"
// Using direct access check instead of the old helper
// Previously: import { validateUserAccess } from "@/lib/supabase/rls-helpers"
import type { Project } from "@/types/project"

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
})

/**
 * Get all projects for the current user
 */
export async function getProjects() {
  try {
    // Create a new Supabase client for this server action
    const supabase = createServerComponentClient()

    // Use getUser instead of getSession for better security
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated", data: null }
    }

    // Try to fetch projects, handling the case where the table might not exist yet
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) {
        // If the error is about the table not existing, return an empty array
        if (error.code === "42P01") { // PostgreSQL code for undefined_table
          console.warn("Projects table does not exist yet. This is normal if you haven't created it.")
          return { data: [], error: null }
        }
        
        console.error("Error fetching projects:", error)
        return { error: error.message, data: null }
      }
      
      // If we get here, the table exists and we have data
      // Map database fields to match the Project type expected by components
      const mappedProjects = data.map((project: any) => ({
        id: project.id,
        title: project.name, // Map 'name' from DB to 'title' expected by components
        description: project.description || undefined, // Convert null to undefined
        createdAt: project.created_at,
        updatedAt: project.updated_at,
        userId: project.user_id,
        status: (project.status || "draft") as "draft" | "published" | "archived",
        imageUrl: project.image_url || null // Convert undefined to null
      }))
      
      return { data: mappedProjects, error: null }
    } catch (dbError) {
      console.error("Database error fetching projects:", dbError)
      return { data: [], error: null } // Return empty array to avoid breaking the UI
    }
  } catch (error) {
    console.error("Unexpected error fetching projects:", error)
    return { error: "An unexpected error occurred while fetching projects", data: null }
  }
}

/**
 * Create a new project for the current user
 */
export async function createProject(formData: FormData) {
  try {
    // Create a new Supabase client for this server action
    const supabase = createServerComponentClient()

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    // Get form data - note that the form might use 'title' but the DB uses 'name'
    const title = formData.get("title") as string || formData.get("name") as string
    const description = formData.get("description") as string

    if (!title) {
      return { error: "Title is required" }
    }

    // Insert with RLS - this will only work if the user is authenticated
    // and the RLS policy allows the insert
    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: title, // Map 'title' to 'name' for the database
        description,
        user_id: user.id, // Explicitly set the user_id for RLS
        status: "draft", // Default status
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error)
      return { error: error.message }
    }

    // Map the returned data to match the Project type expected by components
    const mappedProject: Project = {
      id: data.id,
      title: data.name,
      description: data.description || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
      status: (data.status || "draft") as "draft" | "published" | "archived",
      imageUrl: data.image_url || null
    }

    revalidatePath("/dashboard")
    return { success: true, data: mappedProject }
  } catch (error) {
    console.error("Unexpected error creating project:", error)
    return { error: "An unexpected error occurred while creating the project" }
  }
}

/**
 * Delete a project for the current user
 */
export async function deleteProject(formData: FormData) {
  try {
    // Create a new Supabase client for this server action
    const supabase = createServerComponentClient()

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    const id = formData.get("id") as string

    if (!id) {
      return { error: "Project ID is required" }
    }

    // Validate that the user owns this project before deleting
    // Check if the user has access to this project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', id)
      .single()
    
    const hasAccess = !projectError && projectData && projectData.user_id === user.id

    if (!hasAccess) {
      return { error: "You do not have permission to delete this project" }
    }

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      return { error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting project:", error)
    return { error: "An unexpected error occurred while deleting the project" }
  }
}

/**
 * Get the user profile for the current user
 */
export async function getUserProfile() {
  try {
    // Create a new Supabase client for this server action
    const supabase = createServerComponentClient()

    // Use getUser instead of getSession for better security
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    // Try to fetch the user profile, handling the case where the table might not exist yet
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) {
        // If the error is about the table not existing, return a minimal profile
        if (error.code === "42P01") { // PostgreSQL code for undefined_table
          console.warn("Profiles table does not exist yet. This is normal if you haven't created it.")
          // Return a minimal profile based on the user object
          return {
            id: user.id,
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url
          }
        }
        
        console.error("Error fetching user profile:", error)
        return null
      }
      
      // If we get here, the profiles table exists and we have data
      return {
        full_name: data.full_name || undefined,
        avatar_url: data.avatar_url || undefined,
        username: data.username || undefined,
        website: data.website || undefined,
        id: data.id
      }
    } catch (dbError) {
      console.error("Database error fetching user profile:", dbError)
      // Return a minimal profile based on the user object as fallback
      return {
        id: user.id,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url
      }
    }
  } catch (error) {
    console.error("Unexpected error fetching user profile:", error)
    return null
  }
}
