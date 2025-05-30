export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          email: string | null
          plan: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          email_notifications: boolean
          product_updates: boolean
          security_alerts: boolean
          marketing_emails: boolean
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          email?: string | null
          plan?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          email_notifications?: boolean
          product_updates?: boolean
          security_alerts?: boolean
          marketing_emails?: boolean
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          email?: string | null
          plan?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          email_notifications?: boolean
          product_updates?: boolean
          security_alerts?: boolean
          marketing_emails?: boolean
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
      api_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          name: string
          last_used_at: string | null
          created_at: string
          revoked: boolean
          permissions: Json | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          name: string
          last_used_at?: string | null
          created_at?: string
          revoked?: boolean
          permissions?: Json | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          name?: string
          last_used_at?: string | null
          created_at?: string
          revoked?: boolean
          permissions?: Json | null
          expires_at?: string | null
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
          status: number
          created_at: string
        }
        Insert: {
          id?: string
          token_id: string
          endpoint: string
          status: number
          created_at?: string
        }
        Update: {
          id?: string
          token_id?: string
          endpoint?: string
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
      email_events: {
        Row: {
          id: string
          user_id: string
          email: string
          event_type: string
          email_id: string
          created_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          event_type: string
          email_id: string
          created_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          event_type?: string
          email_id?: string
          created_at?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "email_events_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          stripe_invoice_id: string
          amount: number
          status: string
          created_at: string
          pdf_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          stripe_invoice_id: string
          amount: number
          status: string
          created_at?: string
          pdf_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stripe_invoice_id?: string
          amount?: number
          status?: string
          created_at?: string
          pdf_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      linked_accounts: {
        Row: {
          id: string
          user_id: string
          provider: string
          provider_user_id: string
          created_at: string
          updated_at: string
          access_token: string
          refresh_token: string | null
          expires_at: string | null
          provider_username: string | null
          provider_avatar: string | null
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          provider_user_id: string
          created_at?: string
          updated_at?: string
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
          provider_username?: string | null
          provider_avatar?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          provider_user_id?: string
          created_at?: string
          updated_at?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
          provider_username?: string | null
          provider_avatar?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "linked_accounts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          stripe_payment_method_id: string
          card_brand: string
          card_last4: string
          card_exp_month: number
          card_exp_year: number
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_method_id: string
          card_brand: string
          card_last4: string
          card_exp_month: number
          card_exp_year: number
          is_default: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_method_id?: string
          card_brand?: string
          card_last4?: string
          card_exp_month?: number
          card_exp_year?: number
          is_default?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          created_at: string
          last_active_at: string
          ip_address: string | null
          user_agent: string | null
          device_type: string | null
          location: string | null
          is_current: boolean
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          last_active_at: string
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          location?: string | null
          is_current?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          last_active_at?: string
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          location?: string | null
          is_current?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
