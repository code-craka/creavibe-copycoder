import { createBrowserComponentClient } from "@/utils/supabase/browser-client"
import { Session } from "@supabase/supabase-js"

// Constants for session management
const SESSION_REFRESH_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes
const SESSION_CHECK_INTERVAL_MS = 60 * 1000 // 1 minute

/**
 * Session manager to handle automatic session refresh and expiration
 */
export class SessionManager {
  private static instance: SessionManager
  private refreshInterval: NodeJS.Timeout | null = null
  private supabase = createBrowserComponentClient()
  private currentSession: Session | null = null
  private sessionExpiryListeners: Array<(expired: boolean) => void> = []

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of SessionManager
   */
  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  /**
   * Initialize the session manager
   */
  public async initialize(): Promise<void> {
    // Get the current session
    const { data } = await this.supabase.auth.getSession()
    this.currentSession = data.session

    // Set up auth state change listener
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentSession = session
      
      if (event === 'SIGNED_OUT') {
        this.stopSessionRefresh()
        this.notifySessionExpiry(true)
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        this.startSessionRefresh()
      }
    })

    // Start session refresh if we have a session
    if (this.currentSession) {
      this.startSessionRefresh()
    }
  }

  /**
   * Start the session refresh interval
   */
  private startSessionRefresh(): void {
    // Clear any existing interval
    this.stopSessionRefresh()

    // Set up new interval
    this.refreshInterval = setInterval(() => {
      this.checkAndRefreshSession()
    }, SESSION_CHECK_INTERVAL_MS)
  }

  /**
   * Stop the session refresh interval
   */
  private stopSessionRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }
  }

  /**
   * Check if the session needs to be refreshed and refresh it if needed
   */
  private async checkAndRefreshSession(): Promise<void> {
    if (!this.currentSession) return

    const now = Date.now()
    const expiresAt = (this.currentSession.expires_at || 0) * 1000
    const timeUntilExpiry = expiresAt - now

    // If session is expired, notify listeners
    if (timeUntilExpiry <= 0) {
      this.notifySessionExpiry(true)
      return
    }

    // If session is close to expiry, refresh it
    if (timeUntilExpiry < SESSION_REFRESH_THRESHOLD_MS) {
      try {
        const { data, error } = await this.supabase.auth.refreshSession()
        
        if (error) {
          console.error("Error refreshing session:", error)
          this.notifySessionExpiry(true)
        } else {
          this.currentSession = data.session
        }
      } catch (error) {
        console.error("Unexpected error refreshing session:", error)
        this.notifySessionExpiry(true)
      }
    }
  }

  /**
   * Add a listener for session expiry events
   */
  public addSessionExpiryListener(listener: (expired: boolean) => void): void {
    this.sessionExpiryListeners.push(listener)
  }

  /**
   * Remove a session expiry listener
   */
  public removeSessionExpiryListener(listener: (expired: boolean) => void): void {
    this.sessionExpiryListeners = this.sessionExpiryListeners.filter(l => l !== listener)
  }

  /**
   * Notify all listeners of session expiry
   */
  private notifySessionExpiry(expired: boolean): void {
    this.sessionExpiryListeners.forEach(listener => listener(expired))
  }

  /**
   * Get the current session
   */
  public getCurrentSession(): Session | null {
    return this.currentSession
  }

  /**
   * Force a session refresh
   */
  public async refreshSession(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession()
      
      if (error) {
        console.error("Error refreshing session:", error)
        return false
      }
      
      this.currentSession = data.session
      return true
    } catch (error) {
      console.error("Unexpected error refreshing session:", error)
      return false
    }
  }
}
