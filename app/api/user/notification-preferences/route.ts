import { createServerComponentClient } from "@/utils/supabase/clients"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getNotificationPreferences, updateNotificationPreferences } from "@/utils/notifications/notification-preferences"

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
    
    // Get notification preferences for the user
    const preferences = await getNotificationPreferences(user.id)
    
    if (!preferences) {
      return NextResponse.json(
        { error: "Failed to get notification preferences" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Error getting notification preferences:", error)
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
    
    // Get the notification preferences from the request body
    const body = await request.json()
    
    // Validate notification preferences
    for (const key in body) {
      if (typeof body[key] !== 'boolean' && key !== 'user_id') {
        return NextResponse.json(
          { error: `Invalid value for ${key}. Must be a boolean.` },
          { status: 400 }
        )
      }
    }
    
    // Update notification preferences for the user
    const preferences = await updateNotificationPreferences(user.id, body)
    
    if (!preferences) {
      return NextResponse.json(
        { error: "Failed to update notification preferences" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Error updating notification preferences:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
