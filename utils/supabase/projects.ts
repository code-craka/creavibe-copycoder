import { createClient } from '@/utils/supabase/server'
import { createServerComponentClient } from '@/utils/supabase/clients'
import type { Database } from '@/types/supabase'
import type { Project } from '@/types/project'

type ProjectRow = Database['public']['Tables']['projects']['Row']

/**
 * Convert a database project row to the Project type used in the application
 */
function mapProjectRowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.name,
    description: row.description || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id,
    status: (row.status as "draft" | "published" | "archived") || 'draft',
    imageUrl: row.image_url || null,
  }
}

/**
 * Get all projects for the current user
 */
export async function getUserProjects(): Promise<{ data: Project[] | null; error: any }> {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Get all projects for the user
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    
    if (error) {
      throw error
    }
    
    // Map the database rows to the Project type
    const projects = data.map(mapProjectRowToProject)
    
    return { data: projects, error: null }
  } catch (error) {
    console.error('Error getting user projects:', error)
    
    // Handle case where table doesn't exist yet
    if (error instanceof Error && error.message.includes('relation "projects" does not exist')) {
      return { data: [], error: null }
    }
    
    return { data: null, error }
  }
}

/**
 * Get a project by ID
 * Only returns the project if it belongs to the current user
 */
export async function getProjectById(id: string): Promise<{ data: Project | null; error: any }> {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Get the project
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (error) {
      throw error
    }
    
    return { data: mapProjectRowToProject(data), error: null }
  } catch (error) {
    console.error('Error getting project by ID:', error)
    return { data: null, error }
  }
}

/**
 * Create a new project
 */
export async function createProject(project: { title: string; description?: string; status?: "draft" | "published" | "archived"; imageUrl?: string | null }): Promise<{ data: Project | null; error: any }> {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Create the project
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          name: project.title,
          description: project.description,
          user_id: user.id,
          status: project.status || 'draft',
          image_url: project.imageUrl || null,
        },
      ])
      .select('*')
      .single()
    
    if (error) {
      throw error
    }
    
    return { data: mapProjectRowToProject(data), error: null }
  } catch (error) {
    console.error('Error creating project:', error)
    return { data: null, error }
  }
}

/**
 * Update a project
 * Only updates the project if it belongs to the current user
 */
export async function updateProject(id: string, updates: { title?: string; description?: string; status?: "draft" | "published" | "archived"; imageUrl?: string | null }): Promise<{ data: Project | null; error: any }> {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Prepare update data
    const updateData: Partial<ProjectRow> = {}
    
    if (updates.title !== undefined) updateData.name = updates.title
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl
    
    // Update the project
    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single()
    
    if (error) {
      throw error
    }
    
    return { data: mapProjectRowToProject(data), error: null }
  } catch (error) {
    console.error('Error updating project:', error)
    return { data: null, error }
  }
}

/**
 * Delete a project
 * Only deletes the project if it belongs to the current user
 */
export async function deleteProject(id: string): Promise<{ success: boolean; error: any }> {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Delete the project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    
    if (error) {
      throw error
    }
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting project:', error)
    return { success: false, error }
  }
}
