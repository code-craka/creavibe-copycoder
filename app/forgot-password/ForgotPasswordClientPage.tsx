"use client"

import type React from "react"

import { useState } from "react"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Define validation schema
const emailSchema = z.string().email("Please enter a valid email address")

export default function ForgotPasswordClientPage(): JSX.Element {
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string>("")
  const [submitted, setSubmitted] = useState<boolean>(false)
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setEmailError("")

    // Validate email
    try {
      emailSchema.parse(email)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message)
        return
      }
    }

    try {
      setLoading(true)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setSubmitted(true)
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      {submitted ? (
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-muted-foreground">Check your email and follow the link to reset your password.</p>
          <Button asChild className="mt-4">
            <Link href="/login">Back to login</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError && (
              <p id="email-error" className="text-sm text-destructive">
                {emailError}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Back to login
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  )
}
