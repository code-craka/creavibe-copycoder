export type Profile = {
  id: string
  full_name?: string | null
  avatar_url?: string | null
  email?: string | null
  updated_at?: string
  created_at?: string
}

export type UserProfile = Profile | null
