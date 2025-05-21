import { getServerUser } from "@/lib/server-auth"
import { getUserProfile } from "@/app/actions/profile"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SignOutButton } from "@/components/auth/sign-out-button"

export default async function DashboardPage() {
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
            <CardTitle>Welcome to your Dashboard</CardTitle>
            <CardDescription>You are now signed in to your CreaVibe account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {profile?.full_name && (
                <p>
                  <strong>Name:</strong> {profile.full_name}
                </p>
              )}
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild>
              <Link href="/profile">Edit Profile</Link>
            </Button>
            <SignOutButton />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
