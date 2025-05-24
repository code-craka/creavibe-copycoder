import { AuthForm } from "@/components/auth/auth-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In - CreaVibe",
  description: "Sign in to your CreaVibe account",
}

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const error = searchParams.error
  
  return (
    <div className="auth-background container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <AuthForm view="sign_in" />
      </div>
    </div>
  )
}
