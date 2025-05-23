"use client"

import { useEffect } from "react"

export function MigrationsInitializer() {
  useEffect(() => {
    // Initialize all migrations when the app loads
    const initializeMigrations = async () => {
      try {
        // Create the trusted IPs table
        await fetch("/api/migrations/trusted-ips")
        
        // Create the audit logs table
        await fetch("/api/migrations/audit-logs")
        
        // Create the theme preferences table
        await fetch("/api/migrations/theme-preferences")
        
        // Create the notification preferences table
        await fetch("/api/migrations/notification-preferences")
        
        console.log("All migrations initialized successfully")
      } catch (error) {
        console.error("Error initializing migrations:", error)
      }
    }
    
    initializeMigrations()
  }, [])
  
  // This component doesn't render anything
  return null
}
