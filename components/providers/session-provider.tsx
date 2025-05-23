"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { SessionManager } from "@/utils/auth/session-manager"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// Create context for session state
type SessionContextType = {
  isInitialized: boolean
  isAuthenticated: boolean
  refreshSession: () => Promise<boolean>
}

const SessionContext = createContext<SessionContextType>({
  isInitialized: false,
  isAuthenticated: false,
  refreshSession: async () => false,
})

// Hook to use session context
export const useSession = () => useContext(SessionContext)

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  
  useEffect(() => {
    const sessionManager = SessionManager.getInstance()
    
    // Initialize session manager
    const initialize = async () => {
      await sessionManager.initialize()
      
      // Check initial authentication state
      setIsAuthenticated(!!sessionManager.getCurrentSession())
      setIsInitialized(true)
    }
    
    // Add session expiry listener
    const handleSessionExpiry = (expired: boolean) => {
      if (expired) {
        setIsAuthenticated(false)
        
        // Show session expired toast
        toast({
          title: "Session expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        })
        
        // Redirect to login page
        router.push("/login")
      }
    }
    
    sessionManager.addSessionExpiryListener(handleSessionExpiry)
    initialize()
    
    // Cleanup
    return () => {
      sessionManager.removeSessionExpiryListener(handleSessionExpiry)
    }
  }, [router, toast])
  
  // Function to refresh session
  const refreshSession = async () => {
    const sessionManager = SessionManager.getInstance()
    return await sessionManager.refreshSession()
  }
  
  return (
    <SessionContext.Provider
      value={{
        isInitialized,
        isAuthenticated,
        refreshSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
