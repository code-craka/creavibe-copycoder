import { createClient } from "@/utils/supabase/server";

/**
 * Interface for audit log entries
 */
export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

/**
 * Audit log action types
 */
export enum AuditAction {
  LOGIN = "login",
  LOGOUT = "logout",
  PASSWORD_CHANGE = "password_change",
  EMAIL_CHANGE = "email_change",
  PROFILE_UPDATE = "profile_update",
  API_KEY_CREATE = "api_key_create",
  API_KEY_REVOKE = "api_key_revoke",
  PROJECT_CREATE = "project_create",
  PROJECT_UPDATE = "project_update",
  PROJECT_DELETE = "project_delete",
  TRUSTED_IP_ADD = "trusted_ip_add",
  TRUSTED_IP_REMOVE = "trusted_ip_remove",
  SETTINGS_CHANGE = "settings_change",
}

/**
 * Audit log resource types
 */
export enum AuditResourceType {
  USER = "user",
  PROJECT = "project",
  API_KEY = "api_key",
  TRUSTED_IP = "trusted_ip",
  SETTINGS = "settings",
}

/**
 * Create an audit log entry
 * @param userId - The user ID associated with the action
 * @param action - The action performed
 * @param resourceType - The type of resource affected
 * @param resourceId - Optional ID of the specific resource
 * @param metadata - Optional additional data about the action
 * @param ipAddress - Optional IP address of the user
 * @param userAgent - Optional user agent string
 * @returns The created audit log entry or null on error
 */
export async function createAuditLog(
  userId: string,
  action: AuditAction | string,
  resourceType: AuditResourceType | string,
  resourceId?: string | null,
  metadata?: Record<string, any> | null,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<AuditLogEntry | null> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("audit_logs")
      .insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId || null,
        metadata: metadata || null,
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating audit log:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createAuditLog:", error);
    return null;
  }
}

/**
 * Get audit logs for a specific user
 * @param userId - The user ID to get logs for
 * @param limit - Maximum number of logs to return
 * @param offset - Offset for pagination
 * @returns Array of audit log entries
 */
export async function getUserAuditLogs(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<AuditLogEntry[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) {
      console.error("Error getting user audit logs:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getUserAuditLogs:", error);
    return [];
  }
}

/**
 * Get audit logs for a specific resource
 * @param resourceType - The type of resource
 * @param resourceId - The ID of the resource
 * @param limit - Maximum number of logs to return
 * @param offset - Offset for pagination
 * @returns Array of audit log entries
 */
export async function getResourceAuditLogs(
  resourceType: AuditResourceType | string,
  resourceId: string,
  limit: number = 50,
  offset: number = 0
): Promise<AuditLogEntry[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("resource_type", resourceType)
      .eq("resource_id", resourceId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) {
      console.error("Error getting resource audit logs:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getResourceAuditLogs:", error);
    return [];
  }
}
