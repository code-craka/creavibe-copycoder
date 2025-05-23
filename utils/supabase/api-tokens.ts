import { createClient } from '@/utils/supabase/server'
import { createServerComponentClient } from '@/utils/supabase/clients'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from '@/types/supabase'

export type ApiToken = Database['public']['Tables']['api_tokens']['Row']
export type ApiUsage = Database['public']['Tables']['api_usage']['Row']

/**
 * Get all API tokens for the current user
 */
export async function getUserApiTokens() {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Get all tokens for the user
    const { data, error } = await supabase
      .from('api_tokens')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error getting user API tokens:', error)
    
    // Handle case where table doesn't exist yet
    if (error instanceof Error && error.message.includes('relation "api_tokens" does not exist')) {
      return { data: [], error: null }
    }
    
    return { data: null, error }
  }
}

/**
 * Create a new API token for the current user
 */
export async function createApiToken(name: string) {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Generate a secure token
    const token = `crv_${uuidv4().replace(/-/g, '')}`
    
    // Create the token
    const { data, error } = await supabase
      .from('api_tokens')
      .insert([
        {
          user_id: user.id,
          name,
          token,
          revoked: false,
          // Add created_at field with current timestamp
          created_at: new Date().toISOString(),
        },
      ] as any)
      .select('*')
      .single()
    
    if (error) {
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error creating API token:', error)
    return { data: null, error }
  }
}

/**
 * Revoke an API token
 * Only revokes the token if it belongs to the current user
 */
export async function revokeApiToken(tokenId: string) {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Revoke the token
    const { data, error } = await supabase
      .from('api_tokens')
      .update({ revoked: true })
      .eq('id', tokenId)
      .eq('user_id', user.id)
      .select('*')
      .single()
    
    if (error) {
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error revoking API token:', error)
    return { data: null, error }
  }
}

/**
 * Delete an API token
 * Only deletes the token if it belongs to the current user
 */
export async function deleteApiToken(tokenId: string) {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // Delete the token
    const { error } = await supabase
      .from('api_tokens')
      .delete()
      .eq('id', tokenId)
      .eq('user_id', user.id)
    
    if (error) {
      throw error
    }
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting API token:', error)
    return { success: false, error }
  }
}

/**
 * Get API usage for a specific token
 * Only returns usage if the token belongs to the current user
 */
export async function getApiTokenUsage(tokenId: string) {
  try {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }
    
    // First verify that the token belongs to the user
    const { data: token, error: tokenError } = await supabase
      .from('api_tokens')
      .select('*')
      .eq('id', tokenId)
      .eq('user_id', user.id)
      .single()
    
    if (tokenError || !token) {
      throw new Error('Token not found or does not belong to user')
    }
    
    // Get usage for the token
    const { data, error } = await supabase
      .from('api_usage')
      .select('*')
      .eq('token_id', tokenId)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw error
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Error getting API token usage:', error)
    return { data: null, error }
  }
}

/**
 * Validate an API token
 * Used in API routes to authenticate requests
 */
export async function validateApiToken(token: string) {
  try {
    const supabase = createServerComponentClient()
    
    // Get the token
    const { data, error } = await supabase
      .from('api_tokens')
      .select('*')
      // Using explicit type casting to handle the filter operations
      .eq('token', token as any)
      .eq('revoked', false as any)
      .single()
    
    if (error || !data) {
      return { valid: false, token: null }
    }
    
    return { valid: true, token: data }
  } catch (error) {
    console.error('Error validating API token:', error)
    return { valid: false, token: null }
  }
}

/**
 * Record API usage
 */
export async function recordApiUsage(tokenId: string, endpoint: string, method: string, status: number) {
  try {
    const supabase = createServerComponentClient()
    
    const { error } = await supabase
      .from('api_usage')
      .insert([
        {
          token_id: tokenId,
          endpoint,
          method,
          status,
          created_at: new Date().toISOString(),
        },
      ] as any)
    
    if (error) {
      console.error('Error recording API usage:', error)
    }
    
    return { success: !error, error }
  } catch (error) {
    console.error('Error recording API usage:', error)
    return { success: false, error }
  }
}
