"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

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
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "Not authenticated", data: null }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string

  const validatedFields = projectSchema.safeParse({
    title,
    description,
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors, data: null }
  }

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        title,
        description,
        user_id: session.user.id,
        status: "draft",
      },
    ])
    .select()

  if (error) {
    console.error("Error creating project:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/dashboard")
  return { data, error: null }
}

export async function deleteProject(projectId: string) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "Not authenticated", data: null }
  }

  // First check if the project belongs to the user
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", session.user.id)
    .single()

  if (fetchError || !project) {
    console.error("Error fetching project:", fetchError)
    return { error: "Project not found or you don't have permission to delete it", data: null }
  }

  const { error } = await supabase.from("projects").delete().eq("id", projectId)

  if (error) {
    console.error("Error deleting project:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/dashboard")
  return { data: { success: true }, error: null }
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
