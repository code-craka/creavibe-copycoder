import { AuthForm } from "@/components/auth/auth-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up - CreaVibe",
  description: "Create a new CreaVibe account",
}

export default function SignUpPage({ searchParams }: { searchParams: { error?: string } }) {
  const error = searchParams.error
  
  return (
    <div className="auth-background container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
            {decodeURIComponent(error)}
          </div>
        )}
        <AuthForm view="sign_up" />
      </div>
    </div>
  )
}
