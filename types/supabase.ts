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
      api_tokens: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          token: string
          last_used_at: string | null
          expires_at: string | null
          status: string
          permissions: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          token: string
          last_used_at?: string | null
          expires_at?: string | null
          status?: string
          permissions?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          token?: string
          last_used_at?: string | null
          expires_at?: string | null
          status?: string
          permissions?: string[]
        }
      }
      api_usage: {
        Row: {
          id: string
          created_at: string
          token_id: string
          endpoint: string
          status_code: number
          response_time: number
          request_size: number
          response_size: number
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          token_id: string
          endpoint: string
          status_code: number
          response_time: number
          request_size: number
          response_size: number
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          token_id?: string
          endpoint?: string
          status_code?: number
          response_time?: number
          request_size?: number
          response_size?: number
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      permission_sets: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          permissions: Json
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          permissions: Json
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          permissions?: Json
          user_id?: string
        }
      }
      token_permission_sets: {
        Row: {
          id: string
          created_at: string
          token_id: string
          permission_set_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          token_id: string
          permission_set_id: string
        }
        Update: {
          id?: string
          created_at?: string
          token_id?: string
          permission_set_id?: string
        }
      }
      usage_limits: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          token_id: string
          limit_type: string
          limit_value: number
          time_period: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          token_id: string
          limit_type: string
          limit_value: number
          time_period: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          token_id?: string
          limit_type?: string
          limit_value?: number
          time_period?: string
          is_active?: boolean
        }
      }
      webhook_configs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          url: string
          secret: string
          events: string[]
          is_active: boolean
          last_triggered_at: string | null
          failure_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          url: string
          secret: string
          events: string[]
          is_active?: boolean
          last_triggered_at?: string | null
          failure_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          url?: string
          secret?: string
          events?: string[]
          is_active?: boolean
          last_triggered_at?: string | null
          failure_count?: number
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
