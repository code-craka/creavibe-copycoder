export type Project = {
  id: string
  title: string
  description?: string
  created_at: string
  updated_at: string
  user_id: string
  status?: "draft" | "published" | "archived"
  thumbnail_url?: string
  tags?: string[]
  collaborators?: string[]
}

export type NewProject = {
  title: string
  description?: string
  user_id: string
}
