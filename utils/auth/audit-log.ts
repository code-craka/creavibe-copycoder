import { createServerComponentClient } from "@/utils/supabase/clients"
import { cookies } from "next/headers"
import { getClientIp } from "./ip-security"
import { Database } from "@/types/supabase"

export type AuditAction = 
  | "login" 
  | "logout" 
  | "password_change" 
  | "email_change" 
  | "profile_update" 
  | "account_delete" 
  | "trusted_ip_add" 
  | "trusted_ip_remove"
  | "mfa_enable"
  | "mfa_disable"
  | "api_key_create"
  | "api_key_delete"
  | "failed_login_attempt"
  | "password_reset_request"
  | "password_reset_complete"
  | "email_verification_request"
  | "email_verification_complete"

export interface AuditLogEntry {
  id: string
  user_id: string
  action: AuditAction
  entity_type?: string
  entity_id?: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, any>
  created_at: string
}

/**
 * Create an audit log entry
 * @param userId User ID associated with the action
 * @param action The action being performed
 * @param request The request object to extract IP and user agent
 * @param options Additional options for the audit log
 */
export async function createAuditLog(
  userId: string,
  action: AuditAction,
  request?: Request,
  options?: {
    entityType?: string
    entityId?: string
    metadata?: Record<string, any>
  }
): Promise<boolean> {
  const supabase = createServerComponentClient()
  
  try {
    // Extract IP and user agent from request if available
    let ipAddress: string | undefined
    let userAgent: string | undefined
    
    if (request) {
      ipAddress = getClientIp(request)
      userAgent = request.headers.get("user-agent") || undefined
    }
    
    // Create the audit log entry
    const { error } = await supabase
      .from("audit_logs" as any)
      .insert({
        user_id: userId,
        action: action as string,
        entity_type: options?.entityType,
        entity_id: options?.entityId,
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata: options?.metadata
      } as any)
    
    if (error) {
      console.error("Error creating audit log:", error)
      return false
    }
    
    return true
  } catch (error) {
    console.error("Unexpected error creating audit log:", error)
    return false
  }
}

/**
 * Get audit logs for a user
 * @param userId User ID to get audit logs for
 * @param limit Maximum number of logs to return
 * @param offset Offset for pagination
 * @param actions Optional filter for specific actions
 */
export async function getUserAuditLogs(
  userId: string,
  limit: number = 50,
  offset: number = 0,
  actions?: AuditAction[]
): Promise<AuditLogEntry[]> {
  const supabase = createServerComponentClient()
  
  try {
    let query = supabase
      .from("audit_logs" as any)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Add action filter if provided
    if (actions && actions.length > 0) {
      query = query.in("action", actions)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error("Error fetching audit logs:", error)
      return []
    }
    
    // Type assertion to convert the response to our AuditLogEntry type
    return (data as unknown) as AuditLogEntry[]
  } catch (error) {
    console.error("Unexpected error fetching audit logs:", error)
    return []
  }
}

/**
 * Get recent security events for a user
 * @param userId User ID to get security events for
 * @param limit Maximum number of events to return
 */
export async function getRecentSecurityEvents(
  userId: string,
  limit: number = 10
): Promise<AuditLogEntry[]> {
  // Security-related actions
  const securityActions: AuditAction[] = [
    "login",
    "logout",
    "password_change",
    "email_change",
    "account_delete",
    "trusted_ip_add",
    "trusted_ip_remove",
    "mfa_enable",
    "mfa_disable",
    "failed_login_attempt",
    "password_reset_request",
    "password_reset_complete"
  ]
  
  return getUserAuditLogs(userId, limit, 0, securityActions)
}
