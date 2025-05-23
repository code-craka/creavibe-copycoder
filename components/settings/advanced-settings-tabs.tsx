"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User } from "@supabase/supabase-js"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { EnhancedThemeSettings } from "@/components/settings/theme/enhanced-theme-settings"
import { EnhancedNotificationSettings } from "@/components/settings/notifications/enhanced-notification-settings"
import { SecurityLogs } from "@/components/settings/security/security-logs"
import { TrustedIps } from "@/components/settings/security/trusted-ips"
import { 
  User as UserIcon, 
  PaintBucket, 
  Bell, 
  Shield, 
  History,
  Globe
} from "lucide-react"

interface AdvancedSettingsTabsProps {
  user: User
  profile: any
}

export function AdvancedSettingsTabs({ user, profile }: AdvancedSettingsTabsProps) {
  const [activeTab, setActiveTab] = useState("profile")
  
  return (
    <Tabs 
      defaultValue="profile" 
      className="w-full" 
      onValueChange={setActiveTab}
    >
      <TabsList className="grid grid-cols-6 mb-8">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="theme" className="flex items-center gap-2">
          <PaintBucket className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">Activity</span>
        </TabsTrigger>
        <TabsTrigger value="devices" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">Devices</span>
        </TabsTrigger>
      </TabsList>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings user={user} profile={profile} />
          </TabsContent>
          
          <TabsContent value="theme" className="mt-0">
            <EnhancedThemeSettings user={user} profile={profile} />
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0">
            <EnhancedNotificationSettings user={user} profile={profile} />
          </TabsContent>
          
          <TabsContent value="security" className="mt-0 space-y-6">
            <SecuritySettings user={user} profile={profile} />
          </TabsContent>
          
          <TabsContent value="activity" className="mt-0">
            <SecurityLogs user={user} profile={profile} />
          </TabsContent>
          
          <TabsContent value="devices" className="mt-0">
            <TrustedIps user={user} profile={profile} />
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  )
}
