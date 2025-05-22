import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  // Handle 404 for non-existent routes
  const url = req.nextUrl.clone()
  if (
    !url.pathname.startsWith("/_next") &&
    !url.pathname.startsWith("/api") &&
    !url.pathname.startsWith("/static") &&
    !url.pathname.includes(".")
  ) {
    try {
      // Check if the page exists
      await fetch(new URL(url.pathname, url.origin))
    } catch (e) {
      // If fetch fails, the page doesn't exist
      if (url.pathname !== "/not-found" && url.pathname !== "/404") {
        url.pathname = "/not-found"
        return NextResponse.rewrite(url)
      }
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next|static|favicon.ico).*)",
  ],
}
