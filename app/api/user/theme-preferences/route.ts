import { createServerComponentClient } from "@/utils/supabase/clients"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getThemePreferences, updateThemePreferences } from "@/utils/theme/theme-preferences"

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const supabase = createServerComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get theme preferences for the user
    const preferences = await getThemePreferences(user.id)
    
    if (!preferences) {
      return NextResponse.json(
        { error: "Failed to get theme preferences" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Error getting theme preferences:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get the current user
    const supabase = createServerComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get the theme preferences from the request body
    const body = await request.json()
    
    // Validate theme preferences
    if (body.theme && !['light', 'dark', 'system'].includes(body.theme)) {
      return NextResponse.json(
        { error: "Invalid theme value" },
        { status: 400 }
      )
    }
    
    if (body.font_size && !['small', 'medium', 'large', 'x-large'].includes(body.font_size)) {
      return NextResponse.json(
        { error: "Invalid font size value" },
        { status: 400 }
      )
    }
    
    // Update theme preferences for the user
    const preferences = await updateThemePreferences(user.id, body)
    
    if (!preferences) {
      return NextResponse.json(
        { error: "Failed to update theme preferences" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Error updating theme preferences:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
