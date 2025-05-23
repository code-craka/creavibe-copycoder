import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"
import { updateSession } from "@/utils/supabase/middleware"

export async function middleware(req: NextRequest) {
  // Get the response from the updateSession function which handles auth refresh
  let response = await updateSession(req)
  
  // Check if we have a session by creating a new Supabase client
  // We need to do this after updateSession to ensure we're using the refreshed token
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            return req.cookies.getAll()
          } catch (error) {
            console.error('Error getting cookies in main middleware:', error)
            return []
          }
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set({
                name,
                value,
                ...options,
              })
            })
            
            // Create a new response to avoid modifying the one from updateSession
            const newResponse = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            
            // Copy cookies from the original response
            response.cookies.getAll().forEach(cookie => {
              newResponse.cookies.set(cookie)
            })
            
            // Set the new cookies
            cookiesToSet.forEach(({ name, value, options }) => {
              newResponse.cookies.set({
                name,
                value,
                ...options,
              })
            })
            
            response = newResponse
          } catch (error) {
            console.error('Error setting cookies in main middleware:', error)
          }
        },
      },
    },
  )
  
  // Check if we have a session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is signed in and the current path is /login or /signup, redirect to /dashboard
  if (user && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If user is not signed in and the current path is protected, redirect to /login
  if (!user && isProtectedRoute(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url))
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
  const securityHeaders: Record<string, string> = {
    "Content-Security-Policy": ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  }

  // Only add HSTS in production
  if (process.env.NODE_ENV === "production") {
    securityHeaders["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
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
