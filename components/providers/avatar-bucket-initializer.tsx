"use client"

import { useEffect } from "react"

export function AvatarBucketInitializer() {
  useEffect(() => {
    // Initialize the avatar bucket when the app loads
    const initializeAvatarBucket = async () => {
      try {
        await fetch("/api/avatar-bucket")
      } catch (error) {
        console.error("Error initializing avatar bucket:", error)
      }
    }
    
    initializeAvatarBucket()
  }, [])
  
  // This component doesn't render anything
  return null
}
