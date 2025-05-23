"use client"

import { useState, useRef } from "react"
import { User } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import { createBrowserComponentClient } from "@/utils/supabase/browser-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload, UserCircle, X } from "lucide-react"

interface Profile {
  id?: string;
  user_id?: string;
  full_name?: string;
  username?: string;
  website?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

interface ProfileSettingsProps {
  user: User;
  profile: Profile;
}

export function ProfileSettings({ user, profile }: ProfileSettingsProps) {
  const supabase = createBrowserComponentClient()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    username: profile?.username || "",
    website: profile?.website || "",
  })
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 2MB",
          variant: "destructive",
        })
        return
      }
      
      setAvatarFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearAvatarPreview = () => {
    setPreviewUrl(null)
    setAvatarFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadAvatar = async () => {
    if (!avatarFile) return null
    
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(avatarFile.type)) {
        throw new Error('File type not supported. Please upload a JPEG, PNG, or GIF image.')
      }
      
      // Validate file size (5MB max)
      const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
      if (avatarFile.size > MAX_FILE_SIZE) {
        throw new Error('File size too large. Maximum size is 5MB.')
      }
      
      // Create a unique file path for the avatar
      // Format: userId/timestamp.extension
      // This format works with the storage policy that checks for user ID in the path
      const fileExt = avatarFile.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        })
      
      if (error) {
        console.error("Storage error:", error)
        throw new Error(`Upload failed: ${error.message}`)
      }
      
      // Get the public URL for the uploaded file
      const publicUrlResult = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)
      
      if (!publicUrlResult.data) {
        throw new Error('Failed to get public URL for uploaded file')
      }
      
      return publicUrlResult.data.publicUrl
    } catch (error) {
      console.error("Error uploading avatar:", error)
      return null
    }
  }

  // Validate form inputs
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Username validation - alphanumeric and underscore only, 3-30 chars
    if (formData.username) {
      if (!/^[a-zA-Z0-9_]{3,30}$/.test(formData.username)) {
        errors.username = "Username must be 3-30 characters and can only contain letters, numbers, and underscores";
      }
    }
    
    // Full name validation - max 100 chars
    if (formData.full_name && formData.full_name.length > 100) {
      errors.full_name = "Full name must be less than 100 characters";
    }
    
    // Website validation - must be a valid URL if provided
    if (formData.website && formData.website !== "") {
      try {
        new URL(formData.website.startsWith('http') ? formData.website : `https://${formData.website}`);
      } catch (e) {
        errors.website = "Please enter a valid website URL";
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validate form inputs
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        // Show the first validation error
        const firstError = Object.values(validationErrors)[0];
        throw new Error(firstError);
      }
      
      // Prepare website URL format
      let websiteUrl = formData.website;
      if (websiteUrl && !websiteUrl.startsWith('http')) {
        websiteUrl = `https://${websiteUrl}`;
      }
      
      // Upload avatar if a new one was selected
      let newAvatarUrl = avatarUrl
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar()
        if (uploadedUrl) {
          newAvatarUrl = uploadedUrl
        }
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          username: formData.username,
          website: websiteUrl,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        })
      
      if (error) throw error
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
      
      // Update local state
      setAvatarUrl(newAvatarUrl)
      setPreviewUrl(null)
      setAvatarFile(null)
      
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile",
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
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your profile information and avatar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar 
                  className="w-24 h-24 cursor-pointer border-2 border-primary/20 hover:border-primary/50 transition-colors"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={previewUrl || avatarUrl} />
                  <AvatarFallback>
                    <UserCircle className="w-12 h-12 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                {previewUrl && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={clearAvatarPreview}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleAvatarClick}
              >
                <Upload className="h-4 w-4" />
                <span>Upload Avatar</span>
              </Button>
              <p className="text-xs text-muted-foreground">
                Recommended: Square image, max 2MB
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Your username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Your email address cannot be changed
                </p>
              </div>
            </div>
          
            <CardFooter className="px-0 pt-4">
              <Button type="submit" disabled={loading} className="ml-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
