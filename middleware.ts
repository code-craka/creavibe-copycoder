import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create a Supabase client for auth in middleware
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
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // CSRF protection: Check for CSRF token on state-changing requests
  if (isStateChangingMethod(req.method) && !req.nextUrl.pathname.startsWith("/api/auth")) {
    const csrfToken = req.headers.get("x-csrf-token")
    const storedToken = req.cookies.get("csrf-token")?.value

    if (!csrfToken || !storedToken || csrfToken !== storedToken) {
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
