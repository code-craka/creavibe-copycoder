"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"
import { handleSignOut } from "@/app/actions/auth"
import { useToast } from "@/components/ui/use-toast"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
  className?: string
}

export function LogoutButton({ 
  variant = "ghost", 
  size = "default", 
  showIcon = true,
  className = ""
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      // Call the server action to handle sign out
      await handleSignOut()
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : showIcon ? (
        <LogOut className="mr-2 h-4 w-4" />
      ) : null}
      Sign Out
    </Button>
  )
}
