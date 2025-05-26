"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import type { Project, NewProject } from "@/types/project"
import type { Profile } from "@/types/profile"
import { createSuccessResponse, createErrorResponse, ErrorCode, handleValidationError, requireAuthentication, ApiResponse } from "@/utils/api-response"
import { logger } from "@/utils/logger"
import { checkRateLimit } from "@/utils/rate-limit"
import { ProjectRLS } from "@/utils/supabase/rls-policies"
import { PostgrestError } from "@supabase/supabase-js"
import { formatPostgrestError, handleDatabaseError, handleCatchError } from "@/utils/error-handling"

// This function has been moved to utils/error-handling.ts

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
})

export async function getProjects(): Promise<ApiResponse<Project[]>> {
  return logger.trackPerformance('getProjects', async () => {
    try {
      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Check authentication
      const authError = requireAuthentication(session)
      if (authError) return authError

      // Session is now guaranteed to be non-null
      const userId = session!.user.id

      // Fetch projects from database
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }) as { data: Project[] | null, error: any }

      // Handle database errors
      if (error) {
        return handleDatabaseError(error, "getProjects", { userId: session!.user.id })
      }

      // Return successful response
      return createSuccessResponse(data || [])
    } catch (error) {
      return handleCatchError(error, "getProjects", {})
    }
  }, { component: 'projects' })
}

export async function createProject(formData: FormData): Promise<ApiResponse<Project[]>> {
  return logger.trackPerformance('createProject', async () => {
    try {
      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Check authentication
      const authError = requireAuthentication(session)
      if (authError) return authError

      // Session is now guaranteed to be non-null
      const userId = session!.user.id

      // Apply rate limiting to prevent abuse
      const rateLimitKey = `create_project:${userId}`
      const isAllowed = await checkRateLimit(rateLimitKey, 10, 60) // 10 requests per minute
      
      if (!isAllowed) {
        return createErrorResponse(
          ErrorCode.RATE_LIMITED,
          "Too many requests. Please try again later."
        )
      }

      // Extract and validate form data
      const title = formData.get("title") as string
      const description = formData.get("description") as string

      const validatedFields = projectSchema.safeParse({
        title,
        description,
      })

      if (!validatedFields.success) {
        return handleValidationError(validatedFields.error)
      }

      // Create the project in the database
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            title,
            description,
            user_id: userId,
            status: "draft",
          } as NewProject,
        ])
        .select() as { data: Project[] | null, error: any }

      // Handle database errors
      if (error) {
        return handleDatabaseError(error, "createProject", { userId: session!.user.id, projectTitle: title })
      }

      // Revalidate the dashboard path to reflect the changes
      revalidatePath("/dashboard")
      
      // Return successful response
      return createSuccessResponse(data || [])
    } catch (error) {
      return handleCatchError(error, "createProject", {})
    }
  }, { component: 'projects' })
}

export async function deleteProject(projectId: string): Promise<ApiResponse<{ success: boolean }>> {
  return logger.trackPerformance('deleteProject', async () => {
    try {
      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Check authentication
      const authError = requireAuthentication(session)
      if (authError) return authError

      // Session is now guaranteed to be non-null
      const userId = session!.user.id

      // Apply rate limiting to prevent abuse
      const rateLimitKey = `delete_project:${userId}`
      const isAllowed = await checkRateLimit(rateLimitKey, 5, 60) // 5 requests per minute
      
      if (!isAllowed) {
        return createErrorResponse(
          ErrorCode.RATE_LIMITED,
          "Too many requests. Please try again later."
        )
      }

      // Check if the user has permission to delete this project using RLS policies
      const canDelete = await ProjectRLS.canDelete(projectId, userId)
      if (!canDelete) {
        logger.warn("Unauthorized delete attempt", { 
          userId, 
          context: { projectId }
        })
        return createErrorResponse(
          ErrorCode.UNAUTHORIZED,
          "You don't have permission to delete this project or it has dependencies"
        )
      }

      // Delete the project
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)

      // Handle database errors
      if (error) {
        return handleDatabaseError(error, "deleteProject", { userId: session!.user.id, projectId: projectId })
      }

      // Revalidate the dashboard path to reflect the changes
      revalidatePath("/dashboard")
      
      // Return successful response
      return createSuccessResponse({ success: true })
    } catch (error) {
      return handleCatchError(error, "deleteProject", { projectId })
    }
  }, { component: 'projects' })
}

export async function getUserProfile(): Promise<ApiResponse<Profile | null>> {
  return logger.trackPerformance('getUserProfile', async () => {
    try {
      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Check authentication
      if (!session) {
        return createErrorResponse(
          ErrorCode.UNAUTHORIZED,
          "Not authenticated"
        )
      }

      // Session is now guaranteed to be non-null
      const userId = session.user.id

      // Apply rate limiting to prevent abuse
      const rateLimitKey = `get_profile:${userId}`
      const isAllowed = await checkRateLimit(rateLimitKey, 20, 60) // 20 requests per minute
      
      if (!isAllowed) {
        return createErrorResponse(
          ErrorCode.RATE_LIMITED,
          "Too many requests. Please try again later."
        )
      }

      // Fetch user profile from database
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single() as { data: Profile | null, error: any }

      // Handle database errors
      if (error) {
        return handleDatabaseError(error, "getUserProfile", { userId: session.user.id })
      }

      // Return successful response
      return createSuccessResponse(data)
    } catch (error) {
      return handleCatchError(error, "getUserProfile", {})
    }
  }, { component: 'profiles' })
}
