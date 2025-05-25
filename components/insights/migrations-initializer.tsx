"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * MigrationsInitializer Component
 * Handles any client-side migrations or data updates needed for the application
 */
export function MigrationsInitializer() {
  useEffect(() => {
    const runMigrations = async () => {
      try {
        const supabase = createClient();
        
        // Check if the user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // No need to run migrations if user is not authenticated
          return;
        }

        // This is a placeholder for client-side migrations
        // In a real implementation, this might update user data or preferences
        // based on application version changes
        console.warn("[Migrations] Checking for necessary client-side migrations");
        
        // Example: Check if user has a specific preference set
        // If not, set a default value
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name') // Use fields that actually exist in the profiles table
          .eq('id', user.id)
          .single();
          
        if (profile) {
          // Example migration: ensure the user has a display name set
          if (!profile.full_name) {
            await supabase
              .from('profiles')
              .update({ full_name: user.email?.split('@')[0] || 'User' })
              .eq('id', user.id);
              
            console.warn("[Migrations] Set default display name for user");
          }
        }
      } catch (error) {
        console.error("[Migrations] Error running migrations:", error);
      }
    };

    runMigrations();
  }, []);

  return null; // This component doesn't render anything
}
