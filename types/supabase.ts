export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      api_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          name: string
          created_at: string
          revoked: boolean
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          name: string
          created_at: string
          revoked: boolean
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          name?: string
          created_at?: string
          revoked?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "api_tokens_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage: {
        Row: {
          id: string
          token_id: string
          endpoint: string
          method: string
          status: number
          created_at: string
        }
        Insert: {
          id?: string
          token_id: string
          endpoint: string
          method: string
          status: number
          created_at: string
        }
        Update: {
          id?: string
          token_id?: string
          endpoint?: string
          method?: string
          status?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_token_id_fkey"
            columns: ["token_id"]
            referencedRelation: "api_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          user_id: string
          status: string
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          user_id: string
          status?: string
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          user_id?: string
          status?: string
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      deployments: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          deployment_id: string
          url: string
          status: string
          created_at: string
          updated_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          deployment_id: string
          url: string
          status: string
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          deployment_id?: string
          url?: string
          status?: string
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "deployments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deployments_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      theme_preferences: {
        Row: {
          id: string
          user_id: string
          theme: string
          accent_color: string
          font_size: string
          high_contrast: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          theme: string
          accent_color: string
          font_size: string
          high_contrast: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          accent_color?: string
          font_size?: string
          high_contrast?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_sql: {
        Args: {
          sql: string
        }
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
