"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@supabase/supabase-js"

interface UserAvatarProps {
  user: User
  profileData?: {
    full_name?: string
    avatar_url?: string
  } | null
}

export function UserAvatar({ user, profileData }: UserAvatarProps) {
  const initials = getInitials(profileData?.full_name || user.email || "")

  return (
    <Avatar className="h-10 w-10 border border-border">
      <AvatarImage src={profileData?.avatar_url || ""} alt={profileData?.full_name || user.email || "User avatar"} />
      <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
    </Avatar>
  )
}

function getInitials(name: string): string {
  // If it's an email, use the first character
  if (name.includes("@")) {
    return name.charAt(0).toUpperCase()
  }

  // Otherwise get initials from name
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}
