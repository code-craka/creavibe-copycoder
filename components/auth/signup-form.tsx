"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SocialButtons } from "@/components/auth/social-buttons"
import Link from "next/link"
import { z } from "zod"
import { Loader2 } from "lucide-react"

// Define validation schema
const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    gdprConsent: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and privacy policy",
    }),
    marketingConsent: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function SignupForm(): JSX.Element {
  const { signUpWithEmail, loading } = useAuth()

  // Form states
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [gdprConsent, setGdprConsent] = useState<boolean>(false)
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false)

  // Validation errors
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("")
  const [gdprError, setGdprError] = useState<string>("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setEmailError("")
    setPasswordError("")
    setConfirmPasswordError("")
    setGdprError("")

    // Validate form
    try {
      signupSchema.parse({
        email,
        password,
        confirmPassword,
        gdprConsent,
        marketingConsent,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] === "email") setEmailError(err.message)
          if (err.path[0] === "password") setPasswordError(err.message)
          if (err.path[0] === "confirmPassword") setConfirmPasswordError(err.message)
          if (err.path[0] === "gdprConsent") setGdprError(err.message)
        })
        return
      }
    }

    // Submit form
    await signUpWithEmail(email, password, marketingConsent)
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

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "signup-email-error" : undefined}
          />
          {emailError && (
            <p id="signup-email-error" className="text-sm text-destructive">
              {emailError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "signup-password-error" : undefined}
          />
          {passwordError && (
            <p id="signup-password-error" className="text-sm text-destructive">
              {passwordError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={!!confirmPasswordError}
            aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
          />
          {confirmPasswordError && (
            <p id="confirm-password-error" className="text-sm text-destructive">
              {confirmPasswordError}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="gdpr-consent"
              checked={gdprConsent}
              onCheckedChange={(checked) => setGdprConsent(checked === true)}
              aria-invalid={!!gdprError}
              aria-describedby={gdprError ? "gdpr-error" : undefined}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="gdpr-consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                  Privacy Policy
                </Link>
              </label>
              {gdprError && (
                <p id="gdpr-error" className="text-sm text-destructive">
                  {gdprError}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="marketing-consent"
              checked={marketingConsent}
              onCheckedChange={(checked) => setMarketingConsent(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="marketing-consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to receive marketing communications from CreaVibe
              </label>
              <p className="text-sm text-muted-foreground">
                We'll send you updates about new features and promotions. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
