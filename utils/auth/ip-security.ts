import { createServerComponentClient } from "@/utils/supabase/clients"
import { cookies } from "next/headers"

// Interface for trusted IP data
interface TrustedIpData {
  id: string
  user_id: string
  ip_address: string
  last_used: string
  created_at: string
}

/**
 * Check if the current IP is in the user's trusted IPs list
 * @param userId The user ID to check trusted IPs for
 * @param currentIp The current IP address
 */
export async function isIpTrusted(userId: string, currentIp: string): Promise<boolean> {
  const supabase = createServerComponentClient()
  
  // Query the trusted_ips table for this user and IP
  const { data, error } = await (supabase as any)
    .from("trusted_ips")
    .select("*")
    .eq("user_id", userId)
    .eq("ip_address", currentIp)
    .single()
  
  if (error || !data) {
    return false
  }
  
  // Update the last_used timestamp
  await (supabase as any)
    .from("trusted_ips")
    .update({ last_used: new Date().toISOString() })
    .eq("id", data.id)
  
  return true
}

/**
 * Add the current IP to the user's trusted IPs list
 * @param userId The user ID to add the trusted IP for
 * @param ipAddress The IP address to add
 */
export async function addTrustedIp(userId: string, ipAddress: string): Promise<boolean> {
  const supabase = createServerComponentClient()
  
  // Check if this IP is already trusted
  const { data: existingIp } = await (supabase as any)
    .from("trusted_ips")
    .select("id")
    .eq("user_id", userId)
    .eq("ip_address", ipAddress)
    .single()
  
  // If it's already trusted, update the last_used timestamp
  if (existingIp) {
    await (supabase as any)
      .from("trusted_ips")
      .update({ last_used: new Date().toISOString() })
      .eq("id", existingIp.id)
    
    return true
  }
  
  // Otherwise, add it to the trusted IPs list
  const { error } = await (supabase as any)
    .from("trusted_ips")
    .insert({
      user_id: userId,
      ip_address: ipAddress,
      last_used: new Date().toISOString()
    })
  
  return !error
}

/**
 * Remove an IP from the user's trusted IPs list
 * @param userId The user ID to remove the trusted IP for
 * @param ipAddress The IP address to remove
 */
export async function removeTrustedIp(userId: string, ipAddress: string): Promise<boolean> {
  const supabase = createServerComponentClient()
  
  const { error } = await (supabase as any)
    .from("trusted_ips")
    .delete()
    .eq("user_id", userId)
    .eq("ip_address", ipAddress)
  
  return !error
}

/**
 * Get all trusted IPs for a user
 * @param userId The user ID to get trusted IPs for
 */
export async function getTrustedIps(userId: string): Promise<TrustedIpData[]> {
  const supabase = createServerComponentClient()
  
  const { data, error } = await (supabase as any)
    .from("trusted_ips")
    .select("*")
    .eq("user_id", userId)
    .order("last_used", { ascending: false })
  
  if (error || !data) {
    return []
  }
  
  return data as TrustedIpData[]
}

/**
 * Get the client IP address from the request
 * @param request The incoming request
 */
export function getClientIp(request: Request): string {
  // Try to get the IP from common headers
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim()
  }
  
  const realIp = request.headers.get("x-real-ip")
  if (realIp) {
    return realIp
  }
  
  // Fallback to a default IP if we can't determine the real one
  return "0.0.0.0"
}
