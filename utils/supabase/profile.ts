import { createClient } from '@/utils/supabase/server'
import { createServerComponentClient } from '@/utils/supabase/clients'
import type { Database } from '@/types/supabase'

export type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Get the current user's profile
 * Creates a profile if one doesn't exist
 */
export async function getProfile() {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return null
    }
    
    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 is the error code for "no rows returned" - we handle this by creating a profile
      console.error('Error getting profile:', profileError)
      return null
    }
    
    // If profile doesn't exist, create one
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            username: user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`,
            full_name: user.user_metadata.full_name || '',
            avatar_url: user.user_metadata.avatar_url || '',
          },
        ])
        .select('*')
        .single()
      
      if (createError) {
        console.error('Error creating profile:', createError)
        return null
      }
      
      return newProfile
    }
    
    return profile
  } catch (error) {
    console.error('Unexpected error in getProfile:', error)
    return null
  }
}

/**
 * Update a user's profile
 */
export async function updateProfile(profileData: Partial<Profile>) {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)
      .select('*')
      .single()
    
    if (error) {
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { data: null, error }
  }
}

/**
 * Get a user's public profile by username
 * Only returns profiles that have public=true
 */
export async function getPublicProfile(username: string) {
  try {
    const supabase = createServerComponentClient()
    
    // Use type casting to handle the TypeScript errors
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username' as any, username)
      .eq('public' as any, true)
      .single()
    
    if (error) {
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error getting public profile:', error)
    return { data: null, error }
  }
}
