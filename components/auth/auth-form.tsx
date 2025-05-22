"use client"

import { SocialButtons } from "@/components/auth/social-buttons"
import { EmailForm } from "@/components/auth/email-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

interface AuthFormProps {
  view: "sign_in" | "sign_up"
}

export function AuthForm({ view }: AuthFormProps) {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="CreaVibe Logo" width={120} height={40} className="h-10 w-auto" />
        </div>
        <CardTitle className="text-2xl font-bold">
          {view === "sign_in" ? "Sign in to CreaVibe" : "Create a CreaVibe account"}
        </CardTitle>
        <CardDescription>
          {view === "sign_in"
            ? "Enter your email to sign in to your account"
            : "Enter your email to create your account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SocialButtons view={view} />
        <EmailForm view={view} />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
        <div>
          {view === "sign_in" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </>
          )}
        </div>
        <div className="text-xs">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </div>
        <div className="flex items-center justify-center text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          We protect your privacy
        </div>
      </CardFooter>
    </Card>
  )
}
