-- All helper migration functions must set search_path
CREATE OR REPLACE FUNCTION public.create_trusted_ips_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

  -- Add RLS policies
  ALTER TABLE public.trusted_ips ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to see only their own trusted IPs
  CREATE POLICY "Users can view their own trusted IPs"
    ON public.trusted_ips
    FOR SELECT
    USING (auth.uid() = user_id);
  
  -- Policy for users to insert their own trusted IPs
  CREATE POLICY "Users can insert their own trusted IPs"
    ON public.trusted_ips
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  
  -- Policy for users to update their own trusted IPs
  CREATE POLICY "Users can update their own trusted IPs"
    ON public.trusted_ips
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  
  -- Policy for users to delete their own trusted IPs
  CREATE POLICY "Users can delete their own trusted IPs"
    ON public.trusted_ips
    FOR DELETE
    USING (auth.uid() = user_id);
END;
$$;

-- Function to create audit_logs table
CREATE OR REPLACE FUNCTION public.create_audit_logs_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

  -- Add RLS policies
  ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to see only their own audit logs
  CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs
    FOR SELECT
    USING (auth.uid() = user_id);
  
  -- Policy for service role to insert audit logs for any user
  CREATE POLICY "Service role can insert audit logs"
    ON public.audit_logs
    FOR INSERT
    WITH CHECK (true);
END;
$$;

-- Function to create theme_preferences table
CREATE OR REPLACE FUNCTION public.create_theme_preferences_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

  -- Add RLS policies
  ALTER TABLE public.theme_preferences ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to see only their own theme preferences
  CREATE POLICY "Users can view their own theme preferences"
    ON public.theme_preferences
    FOR SELECT
    USING (auth.uid() = user_id);
  
  -- Policy for users to insert their own theme preferences
  CREATE POLICY "Users can insert their own theme preferences"
    ON public.theme_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  
  -- Policy for users to update their own theme preferences
  CREATE POLICY "Users can update their own theme preferences"
    ON public.theme_preferences
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END;
$$;

-- Function to create notification_preferences table
CREATE OR REPLACE FUNCTION public.create_notification_preferences_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

  -- Add RLS policies
  ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
  
  -- Policy for users to see only their own notification preferences
  CREATE POLICY "Users can view their own notification preferences"
    ON public.notification_preferences
    FOR SELECT
    USING (auth.uid() = user_id);
  
  -- Policy for users to insert their own notification preferences
  CREATE POLICY "Users can insert their own notification preferences"
    ON public.notification_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  
  -- Policy for users to update their own notification preferences
  CREATE POLICY "Users can update their own notification preferences"
    ON public.notification_preferences
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END;
$$;

-- General execute_sql function (use with caution!)
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

-- Restrict execute_sql to service role only (important security measure)
REVOKE ALL ON FUNCTION public.execute_sql(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO service_role;
