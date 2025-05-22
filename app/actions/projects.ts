"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import { validateUserAccess } from "@/lib/supabase/rls-helpers"

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
})

export async function getProjects() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "Not authenticated", data: null }
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", session.user.id)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

export async function createProject(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) {
    return { error: "Name is required" }
  }

  // Insert with RLS - this will only work if the user is authenticated
  // and the RLS policy allows the insert
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      description,
      user_id: user.id, // Explicitly set the user_id for RLS
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true, data }
}

export async function deleteProject(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const id = formData.get("id") as string

  if (!id) {
    return { error: "Project ID is required" }
  }

  // Validate that the user owns this project before deleting
  const hasAccess = await validateUserAccess(supabase, "projects", id, user.id)

  if (!hasAccess) {
    return { error: "You do not have permission to delete this project" }
  }

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function getUserProfile() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}
