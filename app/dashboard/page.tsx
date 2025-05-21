import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Welcome, {session.user.email}!</p>
      <p>You are now signed in to CreaVibe.</p>

      <form action="/auth/signout" method="post" className="mt-6">
        <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">
          Sign out
        </button>
      </form>
    </div>
  )
}
