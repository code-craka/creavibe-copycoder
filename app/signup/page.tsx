import { AuthForm } from "@/components/auth/auth-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up - CreaVibe",
  description: "Create a new CreaVibe account",
}

<<<<<<< HEAD
export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedParams = await searchParams
  const error = resolvedParams.error
  
=======
export default function SignUpPage() {
>>>>>>> 228fc5154102911bbffcad065a15adb1392f9015
  return (
    <div className="auth-background container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <AuthForm view="sign_up" />
      </div>
    </div>
  )
}
