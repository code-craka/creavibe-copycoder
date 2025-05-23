"use client"

import { useState, useEffect } from "react"
import { User } from "@supabase/supabase-js"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemePreferences } from "@/utils/theme/theme-preferences"
import { useToast } from "@/components/ui/use-toast"
import { Moon, Sun, Monitor, Palette, Type, Eye } from "lucide-react"

interface EnhancedThemeSettingsProps {
  user: User
  profile?: any
}

// Define accent colors
const accentColors = [
  { name: "Blue", value: "blue", class: "bg-blue-500" },
  { name: "Green", value: "green", class: "bg-green-500" },
  { name: "Purple", value: "purple", class: "bg-purple-500" },
  { name: "Red", value: "red", class: "bg-red-500" },
  { name: "Orange", value: "orange", class: "bg-orange-500" },
  { name: "Pink", value: "pink", class: "bg-pink-500" },
  { name: "Teal", value: "teal", class: "bg-teal-500" },
  { name: "Indigo", value: "indigo", class: "bg-indigo-500" },
]

// Define font sizes
const fontSizes = [
  { name: "Small", value: "small" },
  { name: "Medium", value: "medium" },
  { name: "Large", value: "large" },
  { name: "X-Large", value: "x-large" },
]

export function EnhancedThemeSettings({ user }: EnhancedThemeSettingsProps) {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [preferences, setPreferences] = useState<ThemePreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Fetch theme preferences on component mount
  useEffect(() => {
    const fetchThemePreferences = async () => {
      try {
        const response = await fetch("/api/user/theme-preferences")
        if (response.ok) {
          const data = await response.json()
          setPreferences(data.preferences)
          
          // Set the theme based on preferences
          if (data.preferences.theme) {
            setTheme(data.preferences.theme)
          }
        } else {
          console.error("Failed to fetch theme preferences")
        }
      } catch (error) {
        console.error("Error fetching theme preferences:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchThemePreferences()
  }, [user.id, setTheme])
  
  // Update theme preferences
  const updatePreferences = async (updatedPrefs: Partial<ThemePreferences>) => {
    if (!preferences) return
    
    try {
      setSaving(true)
      
      // Update local state immediately for better UX
      setPreferences({ ...preferences, ...updatedPrefs })
      
      // If updating theme, also update the theme context
      if (updatedPrefs.theme) {
        setTheme(updatedPrefs.theme)
      }
      
      // Apply accent color
      if (updatedPrefs.accent_color) {
        document.documentElement.style.setProperty(
          "--accent-color", 
          `var(--${updatedPrefs.accent_color}-500)`
        )
        document.documentElement.style.setProperty(
          "--accent-color-foreground", 
          `var(--${updatedPrefs.accent_color}-foreground)`
        )
      }
      
      // Apply font size
      if (updatedPrefs.font_size) {
        const fontSizeMap = {
          'small': '0.875rem',
          'medium': '1rem',
          'large': '1.125rem',
          'x-large': '1.25rem'
        }
        document.documentElement.style.setProperty(
          "--font-size-base", 
          fontSizeMap[updatedPrefs.font_size as keyof typeof fontSizeMap]
        )
      }
      
      // Apply high contrast
      if (updatedPrefs.high_contrast !== undefined) {
        if (updatedPrefs.high_contrast) {
          document.documentElement.classList.add("high-contrast")
        } else {
          document.documentElement.classList.remove("high-contrast")
        }
      }
      
      // Save to server
      const response = await fetch("/api/user/theme-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedPrefs)
      })
      
      if (!response.ok) {
        throw new Error("Failed to update theme preferences")
      }
      
      toast({
        title: "Theme preferences updated",
        description: "Your theme preferences have been saved.",
        variant: "default"
      })
    } catch (error) {
      console.error("Error updating theme preferences:", error)
      toast({
        title: "Error",
        description: "Failed to update theme preferences.",
        variant: "destructive"
      })
      
      // Revert local state on error
      const response = await fetch("/api/user/theme-preferences")
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
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-[150px]" />
            <div className="grid grid-cols-4 gap-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
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
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Failed to load theme preferences. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>
          Customize the appearance of the application to your preference
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text
            </TabsTrigger>
          </TabsList>
          
          {/* Theme Mode Tab */}
          <TabsContent value="theme" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Theme Mode</h3>
              <RadioGroup
                value={preferences.theme}
                onValueChange={(value) => 
                  updatePreferences({ theme: value as 'light' | 'dark' | 'system' })
                }
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="light"
                    id="theme-light"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="theme-light"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                      preferences.theme === 'light' ? 'border-primary' : ''
                    }`}
                  >
                    <Sun className="h-6 w-6 mb-2" />
                    Light
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="dark"
                    id="theme-dark"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="theme-dark"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                      preferences.theme === 'dark' ? 'border-primary' : ''
                    }`}
                  >
                    <Moon className="h-6 w-6 mb-2" />
                    Dark
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="system"
                    id="theme-system"
                    className="sr-only"
                  />
                  <Label
                    htmlFor="theme-system"
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                      preferences.theme === 'system' ? 'border-primary' : ''
                    }`}
                  >
                    <Monitor className="h-6 w-6 mb-2" />
                    System
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="high-contrast"
                checked={preferences.high_contrast}
                onCheckedChange={(checked) => 
                  updatePreferences({ high_contrast: checked })
                }
              />
              <Label htmlFor="high-contrast" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                High Contrast Mode
              </Label>
            </div>
          </TabsContent>
          
          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Accent Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    className={`h-10 rounded-md transition-all ${
                      preferences.accent_color === color.value
                        ? 'ring-2 ring-primary ring-offset-2'
                        : ''
                    }`}
                    style={{ backgroundColor: `var(--${color.value}-500)` }}
                    onClick={() => updatePreferences({ accent_color: color.value })}
                    aria-label={`Set accent color to ${color.name}`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Text Tab */}
          <TabsContent value="text" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Font Size</h3>
              <RadioGroup
                value={preferences.font_size}
                onValueChange={(value) => 
                  updatePreferences({ 
                    font_size: value as 'small' | 'medium' | 'large' | 'x-large' 
                  })
                }
                className="space-y-2"
              >
                {fontSizes.map((size) => (
                  <div key={size.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={size.value} id={`font-${size.value}`} />
                    <Label 
                      htmlFor={`font-${size.value}`}
                      style={{ 
                        fontSize: size.value === 'small' 
                          ? '0.875rem' 
                          : size.value === 'medium' 
                            ? '1rem' 
                            : size.value === 'large' 
                              ? '1.125rem' 
                              : '1.25rem' 
                      }}
                    >
                      {size.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
