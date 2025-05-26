"use server"

import { createClient } from "@/utils/supabase/server"
import { ProjectRLS, applyRLSPolicy } from "@/utils/supabase/rls-policies"
import { revalidatePath } from "next/cache"
import type { Project } from "@/types/project"
import { createSuccessResponse, createErrorResponse, ErrorCode, ApiResponse } from "@/utils/api-response"
import { logger } from "@/utils/logger"
import { checkRateLimit } from "@/utils/rate-limit"
import { handleDatabaseError, handleCatchError } from "@/utils/error-handling"

// Secure get project function with RLS policy check
export async function getProjectSecure(projectId: string, userId: string): Promise<ApiResponse<Project>> {
  return logger.trackPerformance('getProjectSecure', async () => {
    try {
      // Apply rate limiting to prevent abuse
      const rateLimitKey = `get_project:${userId}`
      const isAllowed = await checkRateLimit(rateLimitKey, 20, 60) // 20 requests per minute
      
      if (!isAllowed) {
        return createErrorResponse(
          ErrorCode.RATE_LIMITED,
          "Too many requests. Please try again later."
        )
      }

      return await applyRLSPolicy(
        // The operation to perform if authorized
        async () => {
          const supabase = createClient()
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single()
          
          if (error) {
            return handleDatabaseError(error, "getProjectSecure", { userId, projectId })
          }
          
          return createSuccessResponse(data as Project)
        },
        // The policy check to determine if the operation is allowed
        async () => ProjectRLS.canView(projectId, userId),
        // Custom error message
        'You do not have permission to view this project'
      )
    } catch (error) {
      return handleCatchError(error, "getProjectSecure", { userId, projectId })
    }
  }, { component: 'secure-projects' })
}

// Secure update project function with RLS policy check
export async function updateProjectSecure(
  projectId: string, 
  userId: string,
  projectData: Partial<Project>
): Promise<ApiResponse<Project>> {
  return logger.trackPerformance('updateProjectSecure', async () => {
    try {
      // Apply rate limiting to prevent abuse
      const rateLimitKey = `update_project:${userId}`
      const isAllowed = await checkRateLimit(rateLimitKey, 10, 60) // 10 requests per minute
      
      if (!isAllowed) {
        return createErrorResponse(
          ErrorCode.RATE_LIMITED,
          "Too many requests. Please try again later."
        )
      }

      return await applyRLSPolicy(
        // The operation to perform if authorized
        async () => {
          const supabase = createClient()
          const { data, error } = await supabase
            .from('projects')
            .update(projectData)
            .eq('id', projectId)
            .select()
            .single()
          
          if (error) {
            return handleDatabaseError(error, "updateProjectSecure", { userId, projectId })
          }
          
          // Revalidate the projects page to reflect the changes
          revalidatePath('/dashboard')
          revalidatePath(`/project/${projectId}`)
          
          return createSuccessResponse(data as Project)
        },
        // The policy check to determine if the operation is allowed
        async () => ProjectRLS.canEdit(projectId, userId),
        // Custom error message
        'You do not have permission to edit this project'
      )
    } catch (error) {
      return handleCatchError(error, "updateProjectSecure", { userId, projectId, projectData })
    }
  }, { component: 'secure-projects' })
}

// Secure delete project function with RLS policy check
export async function deleteProjectSecure(projectId: string, userId: string): Promise<ApiResponse<{ success: boolean }>> {
  return logger.trackPerformance('deleteProjectSecure', async () => {
    try {
      // Apply rate limiting to prevent abuse
      const rateLimitKey = `delete_project:${userId}`
      const isAllowed = await checkRateLimit(rateLimitKey, 5, 60) // 5 requests per minute
      
      if (!isAllowed) {
        return createErrorResponse(
          ErrorCode.RATE_LIMITED,
          "Too many requests. Please try again later."
        )
      }

      return await applyRLSPolicy(
        // The operation to perform if authorized
        async () => {
          const supabase = createClient()
          const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId)
          
          if (error) {
            return handleDatabaseError(error, "deleteProjectSecure", { userId, projectId })
          }
          
          // Revalidate the projects page to reflect the changes
          revalidatePath('/dashboard')
          
          return createSuccessResponse({ success: true })
        },
        // The policy check to determine if the operation is allowed
        async () => ProjectRLS.canDelete(projectId, userId),
        // Custom error message
        'You do not have permission to delete this project'
      )
    } catch (error) {
      return handleCatchError(error, "deleteProjectSecure", { userId, projectId })
    }
  }, { component: 'secure-projects' })
}
