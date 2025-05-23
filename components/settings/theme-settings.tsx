"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing theme to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how CreaVibe looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Theme Preference</Label>
            <RadioGroup 
              defaultValue={theme} 
              onValueChange={setTheme}
              className="grid grid-cols-3 gap-4"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="light" id="light" className="sr-only" />
                  <Sun className="h-6 w-6 mb-3" />
                  <span className="text-sm font-medium">Light</span>
                </Label>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                  <Moon className="h-6 w-6 mb-3" />
                  <span className="text-sm font-medium">Dark</span>
                </Label>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value="system" id="system" className="sr-only" />
                  <Monitor className="h-6 w-6 mb-3" />
                  <span className="text-sm font-medium">System</span>
                </Label>
              </motion.div>
            </RadioGroup>
            
            <p className="text-sm text-muted-foreground mt-2">
              {theme === "light" && "Using light mode for a bright, clean interface."}
              {theme === "dark" && "Using dark mode to reduce eye strain and save battery."}
              {theme === "system" && "Following your device's theme settings."}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-medium">Theme Preview</p>
                    <p className="text-sm text-muted-foreground">See how your theme looks</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-destructive"></div>
                  <div className="h-4 w-4 rounded-full bg-warning"></div>
                  <div className="h-4 w-4 rounded-full bg-success"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
