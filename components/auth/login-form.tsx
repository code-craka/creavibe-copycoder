"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialButtons } from "@/components/auth/social-buttons"
import Link from "next/link"
import { z } from "zod"
import { Loader2 } from "lucide-react"

// Define validation schemas
const emailSchema = z.string().email("Please enter a valid email address")
const passwordSchema = z.string().min(8, "Password must be at least 8 characters")

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

const magicLinkSchema = z.object({
  email: emailSchema,
})

export function LoginForm(): JSX.Element {
  const { signInWithEmail, signInWithMagicLink, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<string>("password")

  // Form states
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [magicLinkEmail, setMagicLinkEmail] = useState<string>("")

  // Validation errors
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [magicLinkEmailError, setMagicLinkEmailError] = useState<string>("")

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setEmailError("")
    setPasswordError("")

    // Validate form
    try {
      loginSchema.parse({ email, password })
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] === "email") setEmailError(err.message)
          if (err.path[0] === "password") setPasswordError(err.message)
        })
        return
      }
    }

    // Submit form
    await signInWithEmail(email, password)
  }

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setMagicLinkEmailError("")

    // Validate form
    try {
      magicLinkSchema.parse({ email: magicLinkEmail })
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] === "email") setMagicLinkEmailError(err.message)
        })
        return
      }
    }

    // Submit form
    await signInWithMagicLink(magicLinkEmail)
  }

  return (
    <div className="space-y-6">
      <SocialButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <form onSubmit={handlePasswordLogin} className="space-y-4">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
              {passwordError && (
                <p id="password-error" className="text-sm text-destructive">
                  {passwordError}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="magic-link">
          <form onSubmit={handleMagicLinkLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="magic-link-email">Email</Label>
              <Input
                id="magic-link-email"
                type="email"
                placeholder="name@example.com"
                value={magicLinkEmail}
                onChange={(e) => setMagicLinkEmail(e.target.value)}
                aria-invalid={!!magicLinkEmailError}
                aria-describedby={magicLinkEmailError ? "magic-link-email-error" : undefined}
              />
              {magicLinkEmailError && (
                <p id="magic-link-email-error" className="text-sm text-destructive">
                  {magicLinkEmailError}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send magic link"
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}
