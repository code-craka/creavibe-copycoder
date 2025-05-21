export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          marketing_consent: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          marketing_consent?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          marketing_consent?: boolean
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          user_id: string
          status: string
          thumbnail_url: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          user_id: string
          status?: string
          thumbnail_url?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          user_id?: string
          status?: string
          thumbnail_url?: string | null
          tags?: string[] | null
        }
      }
      generations: {
        Row: {
          id: string
          created_at: string
          project_id: string
          user_id: string
          prompt: string
          result: string
          model: string
          format: string
          status: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          user_id: string
          prompt: string
          result: string
          model: string
          format?: string
          status?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          user_id?: string
          prompt?: string
          result?: string
          model?: string
          format?: string
          status?: string
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Insertables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type Updateables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
