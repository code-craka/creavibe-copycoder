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
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          name: string
          last_used_at?: string | null
          created_at?: string
          revoked?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          name?: string
          last_used_at?: string | null
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
