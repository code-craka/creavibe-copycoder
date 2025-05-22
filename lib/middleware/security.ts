import { type NextRequest, NextResponse } from "next/server"
import { auditEnvironmentSecurity } from "@/lib/config/environment"

// Security headers to prevent various attacks
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const clientIP = request.ip || "unknown"
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute
    const maxRequests = 100 // 100 requests per minute

    const key = `${clientIP}:${Math.floor(now / windowMs)}`
    const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs }

    if (current.count >= maxRequests) {
      return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.ceil((current.resetTime - now) / 1000).toString(),
        },
      })
    }

    current.count++
    rateLimitStore.set(key, current)

    // Clean up old entries
    if (now > current.resetTime) {
      rateLimitStore.delete(key)
    }
  }

  // CSRF protection for state-changing requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    const csrfToken = request.headers.get("x-csrf-token")
    const origin = request.headers.get("origin")
    const host = request.headers.get("host")

    // Check origin for CSRF protection
    if (origin && host && !origin.includes(host)) {
      return new NextResponse(JSON.stringify({ error: "CSRF protection: Invalid origin" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  // Environment security audit for sensitive routes
  if (request.nextUrl.pathname.startsWith("/api/vercel") || request.nextUrl.pathname.startsWith("/api/custom")) {
    try {
      const auditResult = auditEnvironmentSecurity()
      if (!auditResult.secure) {
        console.error("🚨 Security audit failed for sensitive route:", {
          path: request.nextUrl.pathname,
          exposedVars: auditResult.exposedVars,
        })
      }
    } catch (error) {
      console.error("Security audit error:", error)
    }
  }

  return response
}

// Utility function to validate API key format
export function validateApiKeyFormat(key: string): boolean {
  // Basic validation - adjust based on your key format requirements
  return key.length >= 32 && /^[a-zA-Z0-9_-]+$/.test(key)
}

// Utility function to check if request is from authorized source
export function isAuthorizedRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get("user-agent") || ""
  const origin = request.headers.get("origin") || ""

  // Add your authorization logic here
  // For example, check for specific user agents or origins

  return true // Placeholder - implement your logic
}

// Security logging function
export function logSecurityEvent(event: {
  type: "unauthorized_access" | "rate_limit" | "csrf_violation" | "environment_exposure"
  ip?: string
  path?: string
  details?: any
}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...event,
  }

  console.warn("🔒 Security Event:", logEntry)

  // In production, send to your security monitoring service
  // await sendToSecurityMonitoring(logEntry)
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
