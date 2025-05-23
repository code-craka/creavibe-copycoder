import type { NextRequest, NextResponse } from "next/server"

// Security headers to prevent various attacks
export const securityHeaders = {
  // Prevent clickjacking
  "X-Frame-Options": "DENY",

  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Enable XSS protection
  "X-XSS-Protection": "1; mode=block",

  // Control referrer information
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions policy
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",

  // HSTS for HTTPS enforcement
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",

  // Content Security Policy
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.posthog.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://images.unsplash.com",
    "connect-src 'self' https://*.supabase.co https://app.posthog.com",
    "frame-src 'none'",
    "object-src 'none'",
  ].join("; "),
}

// Middleware to add security headers
export function addSecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

// Validate that sensitive environment variables are not exposed
export function validateEnvironmentSecurity() {
  if (typeof window !== "undefined") {
    // Client-side check
    const dangerousVars = [
      "VERCEL_AUTOMATION_BYPASS_SECRET",
      "SUPABASE_SERVICE_ROLE_KEY",
      "STRIPE_SECRET_KEY",
      "RESEND_API_KEY",
    ]

    dangerousVars.forEach((varName) => {
      if ((window as any)[varName] || (process.env as any)[varName]) {
        console.error(`🚨 SECURITY ALERT: ${varName} is exposed on the client side!`)
        // In production, you might want to send this to your error tracking service
      }
    })
  }
}

// Rate limiting for API routes
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

export function rateLimit(
  request: NextRequest,
  limit = 100,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(',')[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
  const now = Date.now()
  const windowStart = now - windowMs

  const record = rateLimitMap.get(ip)

  if (!record || record.lastReset < windowStart) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

// CSRF protection
export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get("x-csrf-token")
  const cookie = request.cookies.get("csrf-token")?.value

  return token === cookie && token !== null
}
