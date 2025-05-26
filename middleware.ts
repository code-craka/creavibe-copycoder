import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import { corsMiddleware } from "@/lib/middleware/cors"
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit"
import { csrfMiddleware, setCsrfTokenMiddleware } from "@/lib/middleware/csrf"
import { checkRequiredEnvVars } from "@/lib/env-check"

import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

// Check environment variables on startup
checkRequiredEnvVars()

export async function middleware(req: NextRequest) {
  // Apply CORS middleware for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const corsResponse = corsMiddleware(req)
    if (corsResponse.status !== 200) {
      return corsResponse
    }
  }

  // Initialize response
  let res = NextResponse.next()

  // Set CSRF token for HTML requests
  res = setCsrfTokenMiddleware(req)

  // Create Supabase middleware client
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Apply rate limiting (with different limits for authenticated users)
  const rateLimitResponse = await rateLimitMiddleware(req, !!session)
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse
  }

  // Apply CSRF protection for state-changing requests
  if (isStateChangingMethod(req.method) && !req.nextUrl.pathname.startsWith("/api/auth")) {
    const csrfResponse = csrfMiddleware(req)
    if (csrfResponse.status === 403) {
      return csrfResponse
    }
  }

  // If user is signed in and the current path is /login or /signup, redirect to /dashboard
  if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If user is not signed in and the current path is protected, redirect to /login
  if (!session && isProtectedRoute(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Check for session timeout
  if (session) {
    const lastActivity = req.cookies.get("last-activity")?.value
    const now = Date.now()

    // Set or update the last activity timestamp
    res.cookies.set("last-activity", now.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    // If last activity exists and is older than the timeout period (30 minutes), invalidate the session
    if (lastActivity && now - Number.parseInt(lastActivity) > 30 * 60 * 1000) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL("/login?timeout=true", req.url))
    }
  }

  // Add security headers
  const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.posthog.com https://*.vercel-insights.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com;
    font-src 'self';
    connect-src 'self' https://vitals.vercel-insights.com https://app.posthog.com https://*.supabase.co;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `

  // Add security headers
  const securityHeaders = {
    "Content-Security-Policy": ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  }

  // Add security headers to the response
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.headers.set(key, value)
  })

  return res
}

// Helper function to check if a route is protected
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ["/dashboard", "/settings", "/billing", "/api-keys", "/project"]

  return protectedRoutes.some((route) => pathname.startsWith(route))
}

// Helper function to check if a method changes state
function isStateChangingMethod(method: string): boolean {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
