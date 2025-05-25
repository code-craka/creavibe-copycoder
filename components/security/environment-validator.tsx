"use client";

import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

/**
 * EnvironmentValidator Component
 * Validates that required environment variables are properly set
 */
export function EnvironmentValidator() {
  const [validationResults, setValidationResults] = useState<{
    valid: boolean;
    missing: string[];
  }>({ valid: true, missing: [] });

  useEffect(() => {
    // List of required environment variables
    const requiredEnvVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ];

    // Check if each required environment variable is defined
    const missingVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    setValidationResults({
      valid: missingVars.length === 0,
      missing: missingVars,
    });
  }, []);

  if (validationResults.valid) {
    return (
      <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle>Environment Validated</AlertTitle>
        <AlertDescription>
          All required environment variables are properly set.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-red-500 bg-red-50 dark:bg-red-950">
      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertTitle>Environment Configuration Error</AlertTitle>
      <AlertDescription>
        <p>The following required environment variables are missing:</p>
        <ul className="list-disc ml-6 mt-2">
          {validationResults.missing.map((envVar) => (
            <li key={envVar}>{envVar}</li>
          ))}
        </ul>
        <p className="mt-2">
          Please check your .env.local file and ensure all required variables are
          set.
        </p>
      </AlertDescription>
    </Alert>
  );
}
