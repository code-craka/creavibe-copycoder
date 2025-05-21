"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { Provider } from "@supabase/supabase-js"
import { useToast } from "@/components/ui/use-toast"

export type AuthError = {
  message: string
}

export function useAuth() {
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Check for user on mount
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    // Initial session check
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        setUser(data.session.user)
      }
    }

    checkUser()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      toast({
        title: "Success!",
        description: "You have been signed in.",
      })

      router.push("/dashboard")
      return { error: null }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: "Error signing in",
        description: authError.message,
        variant: "destructive",
      })
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string, marketingConsent: boolean) => {
    try {
      setLoading(true)
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            marketing_consent: marketingConsent,
          },
        },
      })

      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: email,
          marketing_consent: marketingConsent,
        })

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }
      }

      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      })

      return { error: null }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: "Error signing up",
        description: authError.message,
        variant: "destructive",
      })
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  // Sign in with magic link
  const signInWithMagicLink = async (email: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast({
          title: "Error sending magic link",
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      toast({
        title: "Magic link sent!",
        description: "Please check your email for the login link.",
      })

      return { error: null }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: "Error sending magic link",
        description: authError.message,
        variant: "destructive",
      })
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  // Sign in with social provider
  const signInWithSocial = async (provider: Provider) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast({
          title: `Error signing in with ${provider}`,
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      return { error: null }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: `Error signing in with ${provider}`,
        description: authError.message,
        variant: "destructive",
      })
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        })
        return { error }
      }

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })

      router.push("/")
      return { error: null }
    } catch (error) {
      const authError = error as AuthError
      toast({
        title: "Error signing out",
        description: authError.message,
        variant: "destructive",
      })
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
    signInWithSocial,
    signOut,
  }
}
