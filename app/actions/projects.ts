"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Project, ProjectsResponse } from "@/types/project"
import type { Database } from "@/types/supabase"

export async function getProjects(): Promise<ProjectsResponse> {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Get user to ensure they're authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Fetch projects for the current user
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) {
      throw error
    }

    return { data: data as Project[], error: null }
  } catch (error) {
    console.error("Error fetching projects:", error)
    return { data: null, error: error as Error }
  }
}

export async function getProjectById(id: string): Promise<{ data: Project | null; error: Error | null }> {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Get user to ensure they're authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Fetch the specific project
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).eq("user_id", user.id).single()

    if (error) {
      throw error
    }

    return { data: data as Project, error: null }
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error)
    return { data: null, error: error as Error }
  }
}
