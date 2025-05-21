import { type NextRequest, NextResponse } from "next/server"

const allowedOrigins = ["https://creavibe.com", "https://www.creavibe.com", "http://localhost:3000"]

export function corsMiddleware(req: NextRequest) {
  // Check the origin
  const origin = req.headers.get("origin") || ""
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 })

    response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : allowedOrigins[0])
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token")
    response.headers.set("Access-Control-Max-Age", "86400")

    return response
  }

  // Handle the actual request
  const response = NextResponse.next()

  // Set CORS headers for the actual request
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin)
  }

  return response
}
