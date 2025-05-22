import { createMiddlewareClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import { securityMiddleware, logSecurityEvent } from "@/lib/middleware/security"

import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function middleware(req: NextRequest) {
  // Apply security middleware first
  const securityResponse = securityMiddleware(req)
  if (securityResponse.status !== 200) {
    return securityResponse
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is signed in and the current path is /login or /signup, redirect to /dashboard
  if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If user is not signed in and the current path is protected, redirect to /login
  if (!session && isProtectedRoute(req.nextUrl.pathname)) {
    logSecurityEvent({
      type: "unauthorized_access",
      ip: req.ip,
      path: req.nextUrl.pathname,
    })
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Additional security for sensitive API routes
  if (req.nextUrl.pathname.startsWith("/api/vercel") || req.nextUrl.pathname.startsWith("/api/custom")) {
    if (!session) {
      logSecurityEvent({
        type: "unauthorized_access",
        ip: req.ip,
        path: req.nextUrl.pathname,
        details: "Attempted access to sensitive API without authentication",
      })
      return new NextResponse(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  // CSRF protection: Check for CSRF token on state-changing requests
  if (isStateChangingMethod(req.method) && !req.nextUrl.pathname.startsWith("/api/auth")) {
    const csrfToken = req.headers.get("x-csrf-token")
    const storedToken = req.cookies.get("csrf-token")?.value

    if (!csrfToken || !storedToken || csrfToken !== storedToken) {
      logSecurityEvent({
        type: "csrf_violation",
        ip: req.ip,
        path: req.nextUrl.pathname,
      })
      return new NextResponse(JSON.stringify({ error: "Invalid CSRF token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }
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

  // Add security headers from the security middleware
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
  const protectedRoutes = ["/dashboard", "/settings", "/billing", "/api-keys", "/project", "/api/vercel", "/api/custom"]

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
