import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/types/supabase'

export type Deployment = Database['public']['Tables']['deployments']['Row']

/**
 * Get all deployments for a specific project
 */
export async function getProjectDeployments(projectId: string) {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Get all deployments for the project
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error getting project deployments:', error)
    
    // Handle case where table doesn't exist yet
    if (error instanceof Error && error.message.includes('relation "deployments" does not exist')) {
      return { data: [], error: null }
    }
    
    return { data: null, error }
  }
}

/**
 * Create a new deployment record
 */
export async function createDeployment(projectId: string, deploymentId: string, url: string, status: string) {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Create the deployment record
    const { data, error } = await supabase
      .from('deployments')
      .insert([
        {
          user_id: user.id,
          project_id: projectId,
          deployment_id: deploymentId,
          url: url,
          status: status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {}
        },
      ])
      .select('*')
      .single()
    
    if (error) {
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error creating deployment:', error)
    return { data: null, error }
  }
}

/**
 * Update a deployment status
 */
export async function updateDeploymentStatus(deploymentId: string, status: string, metadata: any = {}) {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Update the deployment
    const { data, error } = await supabase
      .from('deployments')
      .update({ 
        status, 
        updated_at: new Date().toISOString(),
        metadata
      })
      .eq('deployment_id', deploymentId)
      .eq('user_id', user.id)
      .select('*')
      .single()
    
    if (error) {
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error updating deployment status:', error)
    return { data: null, error }
  }
}

/**
 * Delete a deployment record
 */
export async function deleteDeployment(deploymentId: string) {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Delete the deployment
    const { error } = await supabase
      .from('deployments')
      .delete()
      .eq('deployment_id', deploymentId)
      .eq('user_id', user.id)
    
    if (error) {
      throw error
    }
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting deployment:', error)
    return { success: false, error }
  }
}
