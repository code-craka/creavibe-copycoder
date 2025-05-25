import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          // Use the correct API for NextRequest cookies
          request.cookies.set(name, value)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          // Use the correct API for NextRequest cookies
          request.cookies.delete(name)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is signed in and the current path is /login or /signup, redirect to /dashboard
  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If user is not signed in and the current path is protected, redirect to /login
  if (!user && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // CSRF protection: Check for CSRF token on state-changing requests
  if (isStateChangingMethod(request.method) && !request.nextUrl.pathname.startsWith("/api/auth")) {
    const csrfToken = request.headers.get("x-csrf-token")
    const storedToken = request.cookies.get("csrf-token")?.value

    if (!csrfToken || !storedToken || csrfToken !== storedToken) {
      return new NextResponse(JSON.stringify({ error: "Invalid CSRF token" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  // Check for session timeout
  if (user) {
    const lastActivity = request.cookies.get("last-activity")?.value
    const now = Date.now()

    // Set or update the last activity timestamp
    response.cookies.set("last-activity", now.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    // If last activity exists and is older than the timeout period (30 minutes), invalidate the session
    if (lastActivity && now - Number.parseInt(lastActivity) > 30 * 60 * 1000) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL("/login?timeout=true", request.url))
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
    response.headers.set(key, value)
  })

  return response
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
