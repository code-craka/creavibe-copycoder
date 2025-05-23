"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User } from "@supabase/supabase-js"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Import from the same directory
import { ProfileSettings } from "@/components/settings/profile-settings"
import { ThemeSettings } from "@/components/settings/theme-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SecuritySettings } from "@/components/settings/security-settings"

interface SettingsTabsProps {
  user: User
  profile: any
}

export function SettingsTabs({ user, profile }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <Tabs
      defaultValue="profile"
      className="w-full"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
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
          <TabsContent value="theme" className="space-y-6">
            <ThemeSettings />
          </TabsContent>
          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>
          <TabsContent value="security" className="space-y-6">
            <SecuritySettings user={user} />
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  )
}
