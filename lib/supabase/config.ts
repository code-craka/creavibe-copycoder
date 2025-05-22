/**
 * Supabase configuration constants and types
 * Centralizes all Supabase-related configuration
 */

// Environment variable validation
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
if (!SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
}

export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!SUPABASE_ANON_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
}

export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
// We don't throw here because this is only needed for admin operations

// Cookie options for server-side auth
export const COOKIE_OPTIONS = {
  name: "sb-auth",
  lifetime: 60 * 60 * 8, // 8 hours
  domain: process.env.COOKIE_DOMAIN || undefined,
  path: "/",
  sameSite: "lax" as const,
}

// Operation types that require admin privileges
export const ADMIN_OPERATIONS = [
  "user:create",
  "user:delete",
  "user:impersonate",
  "system:config",
  "logs:access",
  "billing:manage",
  "api:reset",
  "database:schema",
]

// Types for client creation options
export type CookieOptions = {
  name: string
  lifetime: number
  domain?: string
  path: string
  sameSite: "lax" | "strict" | "none"
}
