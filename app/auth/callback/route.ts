import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const error = requestUrl.searchParams.get("error")
    const errorDescription = requestUrl.searchParams.get("error_description")
    
    // Handle authentication errors
    if (error) {
      console.error(`Authentication error: ${error}`, errorDescription)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(errorDescription || error)}`)
    }

    if (code) {
      const supabase = createClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
      }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    // Use request.url to get the origin in case requestUrl is not available in this scope
    const url = new URL(request.url)
    return NextResponse.redirect(`${url.origin}/login?error=An unexpected error occurred`)
  }
}
