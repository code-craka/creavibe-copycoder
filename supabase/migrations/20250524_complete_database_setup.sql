-- Complete DB Setup: Use ONLY in SQL editor or CLI as service_role!

-- Utility: Secure function for ownership checks (fixed search_path)
CREATE OR REPLACE FUNCTION public.check_record_ownership(
  p_table_name text, p_record_id uuid, p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
DECLARE
  v_result BOOLEAN;
BEGIN
  IF p_table_name = 'profiles' THEN
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = p_record_id AND id = p_user_id)
      INTO v_result;
  ELSIF p_table_name = 'projects' THEN
    SELECT EXISTS(SELECT 1 FROM public.projects WHERE id = p_record_id AND user_id = p_user_id)
      INTO v_result;
  ELSIF p_table_name = 'api_tokens' THEN
    SELECT EXISTS(SELECT 1 FROM public.api_tokens WHERE id = p_record_id AND user_id = p_user_id)
      INTO v_result;
  ELSE
    v_result := FALSE;
  END IF;
  RETURN v_result;
END;
$$;

-- Utility function to automatically update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Function to create trusted_ips table
CREATE OR REPLACE FUNCTION public.create_trusted_ips_table()
RETURNS void
LANGUAGE plpgsql
SET search_path TO public, pg_temp
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.trusted_ips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address TEXT NOT NULL,
    description TEXT,
    last_used TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ALTER TABLE public.trusted_ips ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist to avoid conflicts
  DROP POLICY IF EXISTS "Users can view their own trusted IPs" ON public.trusted_ips;
  DROP POLICY IF EXISTS "Users can insert their own trusted IPs" ON public.trusted_ips;
  DROP POLICY IF EXISTS "Users can update their own trusted IPs" ON public.trusted_ips;
  DROP POLICY IF EXISTS "Users can delete their own trusted IPs" ON public.trusted_ips;
  
  -- Create policies with optimized performance using (select auth.uid())
  CREATE POLICY "Users can view their own trusted IPs"
    ON public.trusted_ips FOR SELECT USING ((select auth.uid()) = user_id);
  CREATE POLICY "Users can insert their own trusted IPs"
    ON public.trusted_ips FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
  CREATE POLICY "Users can update their own trusted IPs"
    ON public.trusted_ips FOR UPDATE USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
  CREATE POLICY "Users can delete their own trusted IPs"
    ON public.trusted_ips FOR DELETE USING ((select auth.uid()) = user_id);
END;
$$;

-- Function to create audit_logs table
CREATE OR REPLACE FUNCTION public.create_audit_logs_table()
RETURNS void
LANGUAGE plpgsql
SET search_path TO public, pg_temp
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    metadata JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist to avoid conflicts
  DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
  DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.audit_logs;
  
  -- Create policies with optimized performance using (select auth.uid())
  CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs FOR SELECT USING ((select auth.uid()) = user_id);
  CREATE POLICY "Service role can insert audit logs"
    ON public.audit_logs FOR INSERT WITH CHECK (true);
END;
$$;

-- Function to create theme_preferences table
CREATE OR REPLACE FUNCTION public.create_theme_preferences_table()
RETURNS void
LANGUAGE plpgsql
SET search_path TO public, pg_temp
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.theme_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT NOT NULL DEFAULT 'system',
    color_scheme TEXT DEFAULT 'default',
    font_size TEXT DEFAULT 'medium',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id)
  );
  ALTER TABLE public.theme_preferences ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist to avoid conflicts
  DROP POLICY IF EXISTS "Users can view their own theme preferences" ON public.theme_preferences;
  DROP POLICY IF EXISTS "Users can insert their own theme preferences" ON public.theme_preferences;
  DROP POLICY IF EXISTS "Users can update their own theme preferences" ON public.theme_preferences;
  
  -- Create policies with optimized performance using (select auth.uid())
  CREATE POLICY "Users can view their own theme preferences"
    ON public.theme_preferences FOR SELECT USING ((select auth.uid()) = user_id);
  CREATE POLICY "Users can insert their own theme preferences"
    ON public.theme_preferences FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
  CREATE POLICY "Users can update their own theme preferences"
    ON public.theme_preferences FOR UPDATE USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
END;
$$;

-- Function to create notification_preferences table
CREATE OR REPLACE FUNCTION public.create_notification_preferences_table()
RETURNS void
LANGUAGE plpgsql
SET search_path TO public, pg_temp
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email_marketing BOOLEAN NOT NULL DEFAULT true,
    email_product_updates BOOLEAN NOT NULL DEFAULT true,
    email_security BOOLEAN NOT NULL DEFAULT true,
    push_notifications BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id)
  );
  ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policies if they exist to avoid conflicts
  DROP POLICY IF EXISTS "Users can view their own notification preferences" ON public.notification_preferences;
  DROP POLICY IF EXISTS "Users can insert their own notification preferences" ON public.notification_preferences;
  DROP POLICY IF EXISTS "Users can update their own notification preferences" ON public.notification_preferences;
  
  -- Create policies with optimized performance using (select auth.uid())
  CREATE POLICY "Users can view their own notification preferences"
    ON public.notification_preferences FOR SELECT USING ((select auth.uid()) = user_id);
  CREATE POLICY "Users can insert their own notification preferences"
    ON public.notification_preferences FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
  CREATE POLICY "Users can update their own notification preferences"
    ON public.notification_preferences FOR UPDATE USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
END;
$$;

-- Secure SQL execution function (use with caution)
CREATE OR REPLACE FUNCTION public.execute_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Storage bucket setup for avatars
-- Note: This part should be run through the Supabase Dashboard UI for storage bucket policies
-- Create avatars bucket if it doesn't exist
-- Example: Optimize RLS policy for profiles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    CREATE POLICY "Users can update their own profile"
      ON public.profiles
      FOR UPDATE
      USING ((select auth.uid()) = id)
      WITH CHECK ((select auth.uid()) = id);
    RAISE NOTICE 'Optimized profile policy';
  END IF;
END;
$$;

-- Storage bucket for avatars
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', false, false, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Note: The following policies should be created through the Supabase Dashboard UI:
-- 1. "Authenticated users can access avatars" policy for SELECT operations
-- 2. "Authenticated users can access avatars" policy for INSERT operations
-- 3. "Authenticated users can access avatars" policy for UPDATE operations
-- 4. "Authenticated users can access avatars" policy for DELETE operations

-- Call the functions to create the tables
SELECT create_trusted_ips_table();
SELECT create_audit_logs_table();
SELECT create_theme_preferences_table();
SELECT create_notification_preferences_table();

-- Repeat for all tables: use (select auth.uid()) in policies!
