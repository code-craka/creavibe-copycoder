import { getUserProfile } from "@/app/actions/profile"
import { getServerUser } from "@/lib/server-auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/auth/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
  const user = await getServerUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await getUserProfile()

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} profile={profile} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
