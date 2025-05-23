import { createServerComponentClient } from "@/utils/supabase/clients"
import { cookies } from "next/headers"

export interface ThemePreferences {
  id?: string
  user_id: string
  theme: 'light' | 'dark' | 'system'
  accent_color: string
  font_size: 'small' | 'medium' | 'large' | 'x-large'
  high_contrast: boolean
  created_at?: string
  updated_at?: string
}

/**
 * Get theme preferences for a user
 * @param userId The user ID to get theme preferences for
 */
export async function getThemePreferences(userId: string): Promise<ThemePreferences | null> {
  const supabase = createServerComponentClient()
  
  try {
    // Check if the user has theme preferences
    const { data, error } = await supabase
      .from("theme_preferences")
      .select("*")
      .eq("user_id", userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No theme preferences found, create default preferences
        return createDefaultThemePreferences(userId)
      }
      
      console.error("Error getting theme preferences:", error)
      return null
    }
    
    return data as ThemePreferences
  } catch (error) {
    console.error("Unexpected error getting theme preferences:", error)
    return null
  }
}

/**
 * Create default theme preferences for a user
 * @param userId The user ID to create theme preferences for
 */
export async function createDefaultThemePreferences(userId: string): Promise<ThemePreferences | null> {
  const supabase = createServerComponentClient()
  
  const defaultPreferences: ThemePreferences = {
    user_id: userId,
    theme: 'system',
    accent_color: 'blue',
    font_size: 'medium',
    high_contrast: false
  }
  
  try {
    // Create default theme preferences
    const { data, error } = await supabase
      .from("theme_preferences")
      .insert(defaultPreferences)
      .select()
      .single()
    
    if (error) {
      console.error("Error creating default theme preferences:", error)
      return defaultPreferences
    }
    
    return data as ThemePreferences
  } catch (error) {
    console.error("Unexpected error creating default theme preferences:", error)
    return defaultPreferences
  }
}

/**
 * Update theme preferences for a user
 * @param userId The user ID to update theme preferences for
 * @param preferences The theme preferences to update
 */
export async function updateThemePreferences(
  userId: string,
  preferences: Partial<ThemePreferences>
): Promise<ThemePreferences | null> {
  const supabase = createServerComponentClient()
  
  try {
    // Check if the user has theme preferences
    const { data: existingPrefs } = await supabase
      .from("theme_preferences")
      .select("id")
      .eq("user_id", userId)
      .single()
    
    if (!existingPrefs) {
      // No theme preferences found, create new preferences
      const newPrefs: ThemePreferences = {
        user_id: userId,
        theme: preferences.theme || 'system',
        accent_color: preferences.accent_color || 'blue',
        font_size: preferences.font_size || 'medium',
        high_contrast: preferences.high_contrast || false
      }
      
      const { data, error } = await supabase
        .from("theme_preferences")
        .insert(newPrefs)
        .select()
        .single()
      
      if (error) {
        console.error("Error creating theme preferences:", error)
        return null
      }
      
      return data as ThemePreferences
    }
    
    // Update existing theme preferences
    const { data, error } = await supabase
      .from("theme_preferences")
      .update(preferences)
      .eq("user_id", userId)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating theme preferences:", error)
      return null
    }
    
    return data as ThemePreferences
  } catch (error) {
    console.error("Unexpected error updating theme preferences:", error)
    return null
  }
}
