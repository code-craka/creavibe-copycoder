import type { User, Session, AuthError } from "@supabase/supabase-js"

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signUp: (email: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

export type AuthAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_SESSION"; payload: Session | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: AuthError | null }
