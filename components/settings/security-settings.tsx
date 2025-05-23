"use client"

import { useState } from "react"
import { User } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import { createBrowserComponentClient } from "@/utils/supabase/browser-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { AlertTriangle, KeyRound, ShieldAlert, Trash2 } from "lucide-react"

interface SecuritySettingsProps {
  user: User
  profile?: any
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const supabase = createBrowserComponentClient()
  const { toast } = useToast()
  const router = useRouter()
  
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Invalid confirmation",
        description: "Please type DELETE to confirm account deletion",
        variant: "destructive",
      })
      return
    }
    
    setIsDeleting(true)
    
    try {
      // In a real implementation, this would delete the user's account
      // This would typically involve:
      // 1. Deleting user data from various tables
      // 2. Deleting the user from auth.users
      
      // Example implementation:
      // First delete related data
      // await supabase.from("profiles").delete().eq("id", user.id)
      // await supabase.from("projects").delete().eq("user_id", user.id)
      // await supabase.from("api_tokens").delete().eq("user_id", user.id)
      
      // Then delete the user account itself
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      
      if (error) throw error
      
      // Sign out the user
      await supabase.auth.signOut()
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted",
      })
      
      // Redirect to home page
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Error deleting account",
        description: error.message || "An error occurred while deleting your account",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteConfirmation("")
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Password & Authentication</CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-primary/10">
                <KeyRound className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
          
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-primary/10">
                <ShieldAlert className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Delete Account
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="delete-confirmation" className="text-destructive">
                      Type DELETE to confirm
                    </Label>
                    <Input
                      id="delete-confirmation"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE"
                      className="border-destructive/50 focus-visible:ring-destructive"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault()
                      handleDeleteAccount()
                    }}
                    disabled={deleteConfirmation !== "DELETE" || isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
