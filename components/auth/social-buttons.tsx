"use client"

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { useState } from "react"
import { createBrowserComponentClient } from "@/utils/supabase/browser-client"
import { useToast } from "@/components/ui/use-toast"

interface SocialButtonsProps {
  view: "sign_in" | "sign_up"
}

export function SocialButtons({ view }: SocialButtonsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const supabase = createBrowserComponentClient()

  const handleGithubLogin = async () => {
    try {
      setIsGithubLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging in with GitHub.",
        variant: "destructive",
      })
    } finally {
      setIsGithubLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging in with Google.",
        variant: "destructive",
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      <Button
        variant="outline"
        type="button"
        disabled={isGithubLoading}
        onClick={handleGithubLogin}
        className="bg-background"
      >
        {isGithubLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Github className="mr-2 h-4 w-4" />
        )}
        {view === "sign_in" ? "Sign in with GitHub" : "Sign up with GitHub"}
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isGoogleLoading}
        onClick={handleGoogleLogin}
        className="bg-background"
      >
        {isGoogleLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            ></path>
          </svg>
        )}
        {view === "sign_in" ? "Sign in with Google" : "Sign up with Google"}
      </Button>
    </div>
  )
}
