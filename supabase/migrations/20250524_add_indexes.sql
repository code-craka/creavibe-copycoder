-- Migration: Add Indexes to Foreign Keys (2025-05-24)
-- This migration adds indexes to foreign key columns to improve query performance

-- Add indexes to trusted_ips table
CREATE INDEX IF NOT EXISTS idx_trusted_ips_user_id ON public.trusted_ips (user_id);

-- Add indexes to audit_logs table
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs (user_id);

-- Add indexes to api_tokens table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'api_tokens') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_api_tokens_user_id ON public.api_tokens (user_id)';
  END IF;
END
$$;

-- Add indexes to api_usage table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'api_usage') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_api_usage_token_id ON public.api_usage (token_id)';
  END IF;
END
$$;

-- Add indexes to deployments table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'deployments') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_deployments_user_id ON public.deployments (user_id)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON public.deployments (project_id)';
  END IF;
END
$$;

-- Add indexes to projects table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects (user_id)';
  END IF;
END
$$;

-- Add indexes to theme_preferences and notification_preferences tables
CREATE INDEX IF NOT EXISTS idx_theme_preferences_user_id ON public.theme_preferences (user_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON public.notification_preferences (user_id);

-- Function to create indexes on foreign keys
CREATE OR REPLACE FUNCTION public.create_indexes_for_foreign_keys()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- This function can be extended to automatically create indexes for all foreign keys
  -- For now, we've manually created the indexes for the known tables
  RAISE NOTICE 'Indexes created for foreign keys';
END;
$$;

-- Call the function to create indexes
SELECT create_indexes_for_foreign_keys();
