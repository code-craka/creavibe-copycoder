import { createClient } from "@/utils/supabase/server";
import type { NextRequest } from "next/server";

/**
 * Interface for trusted IP addresses
 */
interface TrustedIP {
  id: string;
  user_id: string;
  ip_address: string;
  description: string | null;
  created_at: string;
  last_used?: string;
}

/**
 * Check if an IP address is in the trusted list for a user
 * @param userId - The user ID to check against
 * @param ipAddress - The IP address to check
 * @returns Boolean indicating if the IP is trusted
 */
export async function isIPTrusted(userId: string, ipAddress: string): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("trusted_ips")
      .select("*")
      .eq("user_id", userId)
      .eq("ip_address", ipAddress);
      
    if (error) {
      console.error("Error checking trusted IP:", error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error("Error in isIPTrusted:", error);
    return false;
  }
}

/**
 * Add an IP address to the trusted list for a user
 * @param userId - The user ID to add the IP for
 * @param ipAddress - The IP address to add
 * @param description - Optional description for this IP
 * @returns The created trusted IP record or null on error
 */
export async function addTrustedIP(
  userId: string, 
  ipAddress: string, 
  description: string = "Added manually"
): Promise<TrustedIP | null> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("trusted_ips")
      .insert({
        user_id: userId,
        ip_address: ipAddress,
        description
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error adding trusted IP:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in addTrustedIP:", error);
    return null;
  }
}

/**
 * Remove an IP address from the trusted list
 * @param ipId - The ID of the trusted IP record to remove
 * @returns Boolean indicating success
 */
export async function removeTrustedIP(ipId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from("trusted_ips")
      .delete()
      .eq("id", ipId);
      
    if (error) {
      console.error("Error removing trusted IP:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in removeTrustedIP:", error);
    return false;
  }
}

/**
 * Get all trusted IPs for a user
 * @param userId - The user ID to get trusted IPs for
 * @returns Array of trusted IP records
 */
export async function getTrustedIPs(userId: string): Promise<TrustedIP[]> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("trusted_ips")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error getting trusted IPs:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getTrustedIPs:", error);
    return [];
  }
}

/**
 * Get the client IP address from a Next.js request
 * @param req - The Next.js request object
 * @returns The client IP address
 */
export function getClientIP(req: NextRequest): string {
  // Try to get the IP from various headers
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");
  
  // Parse the forwarded header if it exists
  const forwardedIPs = forwarded ? forwarded.split(",").map(ip => ip.trim()) : [];
  
  // Return the first forwarded IP, real IP, or fallback to an empty string
  return forwardedIPs[0] || realIP || "";
}
