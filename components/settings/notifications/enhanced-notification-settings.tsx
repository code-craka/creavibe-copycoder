"use client"

import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { NotificationPreferences } from "@/utils/notifications/notification-preferences"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Mail, MessageSquare, AtSign, AlertTriangle, Megaphone } from "lucide-react"

interface EnhancedNotificationSettingsProps {
  user: User
  profile?: any
}

export function EnhancedNotificationSettings({ user }: EnhancedNotificationSettingsProps) {
  const { toast } = useToast()
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Fetch notification preferences on component mount
  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      try {
        const response = await fetch("/api/user/notification-preferences")
        if (response.ok) {
          const data = await response.json()
          setPreferences(data.preferences)
        } else {
          console.error("Failed to fetch notification preferences")
        }
      } catch (error) {
        console.error("Error fetching notification preferences:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchNotificationPreferences()
  }, [user.id])
  
  // Update notification preferences
  const updatePreferences = async (updatedPrefs: Partial<NotificationPreferences>) => {
    if (!preferences) return
    
    try {
      setSaving(true)
      
      // Update local state immediately for better UX
      setPreferences({ ...preferences, ...updatedPrefs })
      
      // Save to server
      const response = await fetch("/api/user/notification-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedPrefs)
      })
      
      if (!response.ok) {
        throw new Error("Failed to update notification preferences")
      }
      
      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been saved.",
        variant: "default"
      })
    } catch (error) {
      console.error("Error updating notification preferences:", error)
      toast({
        title: "Error",
        description: "Failed to update notification preferences.",
        variant: "destructive"
      })
      
      // Revert local state on error
      const response = await fetch("/api/user/notification-preferences")
      if (response.ok) {
        const data = await response.json()
        setPreferences(data.preferences)
      }
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-[100px]" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (!preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Failed to load notification preferences. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage how and when you receive notifications from the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="channels" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="channels" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notification Channels
            </TabsTrigger>
            <TabsTrigger value="types" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notification Types
            </TabsTrigger>
          </TabsList>
          
          {/* Notification Channels Tab */}
          <TabsContent value="channels" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="email-notifications" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => 
                    updatePreferences({ email_notifications: checked })
                  }
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="push-notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in your browser
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={preferences.push_notifications}
                  onCheckedChange={(checked) => 
                    updatePreferences({ push_notifications: checked })
                  }
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="marketing-emails" className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4" />
                    Marketing Emails
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive marketing emails and newsletters
                  </p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={preferences.marketing_emails}
                  onCheckedChange={(checked) => 
                    updatePreferences({ marketing_emails: checked })
                  }
                  disabled={saving}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Notification Types Tab */}
          <TabsContent value="types" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="project-updates" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Project Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about updates to your projects
                  </p>
                </div>
                <Switch
                  id="project-updates"
                  checked={preferences.project_updates}
                  onCheckedChange={(checked) => 
                    updatePreferences({ project_updates: checked })
                  }
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="comment-notifications" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when someone comments on your projects
                  </p>
                </div>
                <Switch
                  id="comment-notifications"
                  checked={preferences.comment_notifications}
                  onCheckedChange={(checked) => 
                    updatePreferences({ comment_notifications: checked })
                  }
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="mention-notifications" className="flex items-center gap-2">
                    <AtSign className="h-4 w-4" />
                    Mentions
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when someone mentions you
                  </p>
                </div>
                <Switch
                  id="mention-notifications"
                  checked={preferences.mention_notifications}
                  onCheckedChange={(checked) => 
                    updatePreferences({ mention_notifications: checked })
                  }
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="security-alerts" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Security Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Important security-related notifications
                  </p>
                </div>
                <Switch
                  id="security-alerts"
                  checked={preferences.security_alerts}
                  onCheckedChange={(checked) => 
                    updatePreferences({ security_alerts: checked })
                  }
                  disabled={saving}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
