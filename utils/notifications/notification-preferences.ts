import { createServerComponentClient } from "@/utils/supabase/clients"
import { Database } from "@/utils/supabase/types"
import { safeFrom, safeCast, safeInsert, safeSelect, safeUpdate } from "@/utils/supabase/type-utils"

export interface NotificationPreferences {
  id?: string
  user_id: string
  email_notifications: boolean
  push_notifications: boolean
  marketing_emails: boolean
  project_updates: boolean
  comment_notifications: boolean
  mention_notifications: boolean
  security_alerts: boolean
  created_at?: string
  updated_at?: string | null
}

// Use the NotificationTemplate type from the Database definition
type NotificationTemplate = Database['public']['Tables']['notification_templates']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Get notification preferences for a user
 * @param userId The user ID to get notification preferences for
 */
export async function getNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
  const supabase = createServerComponentClient()
  
  try {
    // Check if the user has notification preferences
    const { data, error } = await safeFrom(supabase, "notification_preferences")
      .select()
      .eq("user_id", userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No notification preferences found, create default preferences
        return createDefaultNotificationPreferences(userId)
      }
      
      console.error("Error getting notification preferences:", error)
      return null
    }
    
    return data as NotificationPreferences
  } catch (error) {
    console.error("Unexpected error getting notification preferences:", error)
    return null
  }
}

/**
 * Create default notification preferences for a user
 * @param userId The user ID to create notification preferences for
 */
export async function createDefaultNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
  const supabase = createServerComponentClient()
  
  const defaultPreferences: NotificationPreferences = {
    user_id: userId,
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    project_updates: true,
    comment_notifications: true,
    mention_notifications: true,
    security_alerts: true
  }
  
  try {
    // Create default notification preferences
    const { data, error } = await safeInsert(supabase, "notification_preferences", defaultPreferences)
      .select()
      .single()
    
    if (error) {
      console.error("Error creating default notification preferences:", error)
      return defaultPreferences
    }
    
    return data as NotificationPreferences
  } catch (error) {
    console.error("Unexpected error creating default notification preferences:", error)
    return defaultPreferences
  }
}

/**
 * Update notification preferences for a user
 * @param userId The user ID to update notification preferences for
 * @param preferences The notification preferences to update
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences | null> {
  const supabase = createServerComponentClient()
  
  try {
    // Check if the user has notification preferences
    const { data: existingPrefs } = await safeFrom(supabase, "notification_preferences")
      .select("id")
      .eq("user_id", userId)
      .single()
    
    if (!existingPrefs) {
      // No notification preferences found, create new preferences
      const newPrefs: NotificationPreferences = {
        user_id: userId,
        email_notifications: preferences.email_notifications ?? true,
        push_notifications: preferences.push_notifications ?? true,
        marketing_emails: preferences.marketing_emails ?? false,
        project_updates: preferences.project_updates ?? true,
        comment_notifications: preferences.comment_notifications ?? true,
        mention_notifications: preferences.mention_notifications ?? true,
        security_alerts: preferences.security_alerts ?? true
      }
      
      const { data, error } = await safeInsert(supabase, "notification_preferences", newPrefs)
        .select()
        .single()
      
      if (error) {
        console.error("Error creating notification preferences:", error)
        return null
      }
      
      return data as NotificationPreferences
    }
    
    // Update existing notification preferences
    const { data, error } = await safeUpdate(supabase, "notification_preferences", preferences)
      .eq("user_id", userId)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating notification preferences:", error)
      return null
    }
    
    return data as NotificationPreferences
  } catch (error) {
    console.error("Unexpected error updating notification preferences:", error)
    return null
  }
}

/**
 * Get notification templates
 */
export async function getNotificationTemplates(): Promise<any[]> {
  const supabase = createServerComponentClient()
  
  try {
    const { data, error } = await safeFrom(supabase, "notification_templates")
      .select()
      .order("type")
    
    if (error) {
      console.error("Error getting notification templates:", error)
      return []
    }
    
    return data
  } catch (error) {
    console.error("Unexpected error getting notification templates:", error)
    return []
  }
}

/**
 * Send a notification to a user
 * @param userId The user ID to send the notification to
 * @param type The type of notification to send
 * @param data The data to use in the notification template
 */
export async function sendNotification(
  userId: string,
  type: string,
  data: Record<string, any>
): Promise<boolean> {
  const supabase = createServerComponentClient()
  
  try {
    // Get the user's notification preferences
    const preferences = await getNotificationPreferences(userId)
    
    if (!preferences) {
      return false
    }
    
    // Check if the user has enabled this type of notification
    let isEnabled = false
    
    switch (type) {
      case 'project_update':
        isEnabled = preferences.project_updates
        break
      case 'comment_notification':
        isEnabled = preferences.comment_notifications
        break
      case 'mention_notification':
        isEnabled = preferences.mention_notifications
        break
      case 'security_alert':
        isEnabled = preferences.security_alerts
        break
      default:
        isEnabled = true
    }
    
    if (!isEnabled) {
      return false
    }
    
    // Get the notification template
    const { data: template, error: templateError } = await safeFrom(supabase, "notification_templates")
      .select()
      .eq("type", type)
      .single()
    
    if (templateError || !template) {
      console.error("Error getting notification template:", templateError)
      return false
    }
    
    // Cast to any first to avoid type errors, then access properties
    const templateAny = template as any;
    const typedTemplate = {
      id: templateAny.id,
      type: templateAny.type,
      subject: templateAny.subject,
      body: templateAny.body,
      created_at: templateAny.created_at,
      updated_at: templateAny.updated_at
    }
    
    // Replace template variables with actual data
    let subject = typedTemplate.subject
    let body = typedTemplate.body
    
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(regex, value)
      body = body.replace(regex, value)
    }
    
    // Get the user's email
    const { data: profile, error: profileError } = await safeFrom(supabase, "profiles")
      .select()
      .eq("id", userId)
      .single()
    
    if (profileError || !profile) {
      console.error("Error getting user profile:", profileError)
      return false
    }
    
    // Send the notification
    // In a real application, you would integrate with an email service like SendGrid, Mailgun, etc.
    // For now, we'll just log the notification
    // Cast to any first to avoid type errors, then access properties
    const profileAny = profile as any;
    const typedProfile = {
      id: profileAny.id,
      email: profileAny.email || 'unknown@example.com', // Provide fallback for email
      full_name: profileAny.full_name || '',
      avatar_url: profileAny.avatar_url || '',
      created_at: profileAny.created_at || new Date().toISOString(),
      updated_at: profileAny.updated_at || null
    }
    
    console.log(`Sending ${type} notification to ${typedProfile.email}:`, {
      subject,
      body
    })
    
    // Record the notification in the database
    const { error: insertError } = await safeInsert(supabase, "notifications", {
      user_id: userId,
      type,
      subject,
      body,
      data: data as any,
      read: false
    })
    
    if (insertError) {
      console.error("Error recording notification:", insertError)
    }
    
    return true
  } catch (error) {
    console.error("Unexpected error sending notification:", error)
    return false
  }
}
