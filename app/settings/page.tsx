import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/utils/supabase/clients"
import { AdvancedSettingsTabs } from "@/components/settings/advanced-settings-tabs"
import { PageLayout } from "@/components/layout/page-layout"

// Explicitly mark this route as dynamic since it uses authentication
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Settings - CreaVibe",
  description: "Manage your profile and preferences",
}

export default async function SettingsPage() {
  // Create a new Supabase client for this server component
  const supabase = createServerComponentClient()

  // Use getUser instead of getSession for better security
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile and preferences
          </p>
        </div>

        <AdvancedSettingsTabs user={user} profile={profile} />
      </div>
    </PageLayout>
  )
}
