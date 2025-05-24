import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"
import { cookies } from "next/headers"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is signed in and the current path is /login or /signup, redirect to /dashboard
  if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If user is not signed in and the current path is /dashboard, redirect to /login
  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*"],
}
