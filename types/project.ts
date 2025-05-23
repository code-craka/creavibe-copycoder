export type Project = {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  userId: string
  status?: "draft" | "published" | "archived"
  imageUrl?: string | null
  tags?: string[]
  collaborators?: string[]
}

export type NewProject = {
  title: string
  description?: string
  user_id: string
}
