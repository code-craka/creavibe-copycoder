"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";

// Define the type for our analytics context
interface AnalyticsContextType {
  userData: Record<string, unknown> | null;
  setUserData: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>;
  addUserProperties: (properties: Record<string, unknown>) => void;
}

// Create a context for analytics context data
const AnalyticsContextData = createContext<AnalyticsContextType | null>(null);

// Analytics context provider props
interface AnalyticsContextProviderProps {
  children: ReactNode;
}

/**
 * Analytics Context Provider Component
 * Provides additional context data for analytics
 */
export function AnalyticsContextProvider({ children }: AnalyticsContextProviderProps) {
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  
  // This is a placeholder implementation
  // In a real implementation, this would provide user context for analytics
  
  const contextValue = {
    userData,
    setUserData,
    addUserProperties: (properties: Record<string, unknown>) => {
      setUserData(prev => ({
        ...prev,
        ...properties
      }));
    },
    // Add more context methods as needed
  };

  return (
    <AnalyticsContextData.Provider value={contextValue}>
      {children}
    </AnalyticsContextData.Provider>
  );
}

// Hook to use analytics context
export function useAnalyticsContext() {
  const context = useContext(AnalyticsContextData);
  if (context === null) {
    throw new Error("useAnalyticsContext must be used within an AnalyticsContextProvider");
  }
  return context;
}
