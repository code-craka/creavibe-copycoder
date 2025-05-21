import { AuthCard } from "@/components/auth/auth-card"
import { SignupForm } from "@/components/auth/signup-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Account | CreaVibe",
  description: "Create a new CreaVibe account",
}

export default function SignupPage(): JSX.Element {
  return (
    <AuthCard title="Create an account" description="Enter your email below to create your account">
      <SignupForm />
    </AuthCard>
  )
}
