import { AuthCard } from "@/components/auth/auth-card"
import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In | CreaVibe",
  description: "Sign in to your CreaVibe account",
}

export default function LoginPage(): JSX.Element {
  return (
    <AuthCard title="Sign in to CreaVibe" description="Enter your email below to sign in to your account">
      <LoginForm />
    </AuthCard>
  )
}
