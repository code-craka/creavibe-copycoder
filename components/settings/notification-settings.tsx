"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { createBrowserComponentClient } from "@/utils/supabase/browser-client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Bell, BellOff, Mail, MessageSquare, Rocket } from "lucide-react"

export function NotificationSettings() {
  const supabase = createBrowserComponentClient()
  const { toast } = useToast()
  
  // Define notification preferences with default values
  // In a real app, these would be fetched from the database
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    deployment_updates: true,
    project_comments: false,
    marketing_emails: false,
    security_alerts: true,
  })
  
  const [loading, setLoading] = useState(false)
  
  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    })
  }
  
  const handleSave = async () => {
    setLoading(true)
    
    try {
      // In a real implementation, this would save to the database
      // For example:
      // const { error } = await supabase
      //   .from("notification_preferences")
      //   .upsert({
      //     user_id: user.id,
      //     preferences: preferences,
      //     updated_at: new Date().toISOString(),
      //   })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated",
      })
    } catch (error: any) {
      toast({
        title: "Error saving preferences",
        description: error.message || "An error occurred while saving your preferences",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="email_notifications" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
              </div>
              <Switch
                id="email_notifications"
                checked={preferences.email_notifications}
                onCheckedChange={() => handleToggle("email_notifications")}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="deployment_updates" className="font-medium">Deployment Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your deployments succeed or fail
                  </p>
                </div>
              </div>
              <Switch
                id="deployment_updates"
                checked={preferences.deployment_updates}
                onCheckedChange={() => handleToggle("deployment_updates")}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="project_comments" className="font-medium">Project Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when someone comments on your projects
                  </p>
                </div>
              </div>
              <Switch
                id="project_comments"
                checked={preferences.project_comments}
                onCheckedChange={() => handleToggle("project_comments")}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="marketing_emails" className="font-medium">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and promotions
                  </p>
                </div>
              </div>
              <Switch
                id="marketing_emails"
                checked={preferences.marketing_emails}
                onCheckedChange={() => handleToggle("marketing_emails")}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <BellOff className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="security_alerts" className="font-medium">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Important security-related notifications (cannot be disabled)
                  </p>
                </div>
              </div>
              <Switch
                id="security_alerts"
                checked={preferences.security_alerts}
                disabled
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="ml-auto"
          >
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
