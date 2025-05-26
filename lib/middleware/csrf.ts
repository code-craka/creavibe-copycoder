import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"

// Generate a CSRF token
export function generateCsrfToken(): string {
  return uuidv4()
}

// Validate CSRF token
export function validateCsrfToken(request: NextRequest): boolean {
  const requestToken = request.headers.get("x-csrf-token")
  const storedToken = request.cookies.get("csrf-token")?.value

  if (!requestToken || !storedToken) {
    return false
  }

  return requestToken === storedToken
}

// CSRF middleware
export function csrfMiddleware(request: NextRequest) {
  // Skip CSRF check for GET, HEAD, OPTIONS requests
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return NextResponse.next()
  }

  // Skip CSRF check for authentication endpoints
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Validate CSRF token for state-changing requests
  if (!validateCsrfToken(request)) {
    return new NextResponse(
      JSON.stringify({
        error: "Invalid CSRF token",
        message: "CSRF validation failed. Please refresh the page and try again.",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }

  return NextResponse.next()
}

// Set CSRF token middleware
export function setCsrfTokenMiddleware(request: NextRequest) {
  // Only set CSRF token for HTML requests
  const acceptHeader = request.headers.get("accept") || ""
  if (!acceptHeader.includes("text/html")) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  // Check if CSRF token already exists
  const existingToken = request.cookies.get("csrf-token")?.value

  if (!existingToken) {
    // Generate and set a new CSRF token
    const token = generateCsrfToken()
    response.cookies.set("csrf-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    })
  }

  return response
}
