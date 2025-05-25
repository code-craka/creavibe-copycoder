"use client";

import React, { createContext, useContext, ReactNode } from "react";

// Define the type for our analytics context
interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => void;
}

// Create a context for analytics
const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

// Analytics provider props
interface AnalyticsProviderProps {
  children: ReactNode;
}

/**
 * Analytics Provider Component
 * Provides analytics context to child components
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // This is a placeholder implementation
  // In a real implementation, this would initialize analytics services like PostHog
  
  const analyticsValue = {
    // Add analytics methods and state here
    trackEvent: (eventName: string, properties?: Record<string, unknown>) => {
      console.warn(`[Analytics] Tracking event: ${eventName}`, properties);
      // In production, this would call PostHog or another analytics service
    },
    // Add more analytics methods as needed
  };

  return (
    <AnalyticsContext.Provider value={analyticsValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Hook to use analytics
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === null) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}
