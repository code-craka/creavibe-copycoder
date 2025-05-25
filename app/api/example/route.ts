import { type NextRequest, NextResponse } from "next/server"
import { corsMiddleware } from "@/lib/middleware/cors"

export async function GET(req: NextRequest) {
  // Apply CORS middleware
  const corsResponse = corsMiddleware(req)
  if (corsResponse.status !== 200) {
    return corsResponse
  }

  // Your API logic here
  return NextResponse.json({ message: "API is working" })
}

export async function POST(req: NextRequest) {
  // Apply CORS middleware
  const corsResponse = corsMiddleware(req)
  if (corsResponse.status !== 200) {
    return corsResponse
  }

  try {
    const body = await req.json()

    // Your API logic here

    return NextResponse.json({ success: true, data: body })
  } catch (_error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
