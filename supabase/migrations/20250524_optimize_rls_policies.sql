-- Migration: Optimize RLS: Use (select auth.uid()) everywhere for all policies!

-- Example for api_usage:
DROP POLICY IF EXISTS "Users can view usage for their own tokens" ON public.api_usage;
CREATE POLICY "Users can view usage for their own tokens"
  ON public.api_usage
  FOR SELECT
  USING (
    (select auth.uid()) IN (
      SELECT user_id FROM public.api_tokens WHERE api_tokens.id = api_usage.token_id
    )
  );

-- Trusted IPs policies
DROP POLICY IF EXISTS "Users can view their own trusted IPs" ON public.trusted_ips;
CREATE POLICY "Users can view their own trusted IPs"
  ON public.trusted_ips FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own trusted IPs" ON public.trusted_ips;
CREATE POLICY "Users can insert their own trusted IPs"
  ON public.trusted_ips FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own trusted IPs" ON public.trusted_ips;
CREATE POLICY "Users can update their own trusted IPs"
  ON public.trusted_ips FOR UPDATE 
  USING ((select auth.uid()) = user_id) 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own trusted IPs" ON public.trusted_ips;
CREATE POLICY "Users can delete their own trusted IPs"
  ON public.trusted_ips FOR DELETE USING ((select auth.uid()) = user_id);

-- Audit logs policies
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs FOR SELECT USING ((select auth.uid()) = user_id);

-- Theme preferences policies
DROP POLICY IF EXISTS "Users can view their own theme preferences" ON public.theme_preferences;
CREATE POLICY "Users can view their own theme preferences"
  ON public.theme_preferences FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own theme preferences" ON public.theme_preferences;
CREATE POLICY "Users can insert their own theme preferences"
  ON public.theme_preferences FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own theme preferences" ON public.theme_preferences;
CREATE POLICY "Users can update their own theme preferences"
  ON public.theme_preferences FOR UPDATE 
  USING ((select auth.uid()) = user_id) 
  WITH CHECK ((select auth.uid()) = user_id);

-- Notification preferences policies
DROP POLICY IF EXISTS "Users can view their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can view their own notification preferences"
  ON public.notification_preferences FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can insert their own notification preferences"
  ON public.notification_preferences FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can update their own notification preferences"
  ON public.notification_preferences FOR UPDATE 
  USING ((select auth.uid()) = user_id) 
  WITH CHECK ((select auth.uid()) = user_id);

-- Projects policies (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
    
    -- Create optimized policies
    CREATE POLICY "Users can view their own projects"
      ON public.projects FOR SELECT USING (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can create their own projects"
      ON public.projects FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can update their own projects"
      ON public.projects FOR UPDATE 
      USING (user_id = (SELECT auth.uid())) 
      WITH CHECK (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can delete their own projects"
      ON public.projects FOR DELETE USING (user_id = (SELECT auth.uid()));
      
    RAISE NOTICE 'Optimized policies for projects table';
  END IF;
END;
$$;

-- API tokens policies (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'api_tokens') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view their own tokens" ON public.api_tokens;
    DROP POLICY IF EXISTS "Users can create their own tokens" ON public.api_tokens;
    DROP POLICY IF EXISTS "Users can update their own tokens" ON public.api_tokens;
    DROP POLICY IF EXISTS "Users can delete their own tokens" ON public.api_tokens;
    
    -- Create optimized policies
    CREATE POLICY "Users can view their own tokens"
      ON public.api_tokens FOR SELECT USING (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can create their own tokens"
      ON public.api_tokens FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can update their own tokens"
      ON public.api_tokens FOR UPDATE 
      USING (user_id = (SELECT auth.uid())) 
      WITH CHECK (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can delete their own tokens"
      ON public.api_tokens FOR DELETE USING (user_id = (SELECT auth.uid()));
  END IF;
END;
$$;

-- Deployments policies (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'deployments') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view their own deployments" ON public.deployments;
    DROP POLICY IF EXISTS "Users can create their own deployments" ON public.deployments;
    DROP POLICY IF EXISTS "Users can update their own deployments" ON public.deployments;
    DROP POLICY IF EXISTS "Users can delete their own deployments" ON public.deployments;
    
    -- Create optimized policies
    CREATE POLICY "Users can view their own deployments"
      ON public.deployments FOR SELECT USING (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can create their own deployments"
      ON public.deployments FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can update their own deployments"
      ON public.deployments FOR UPDATE 
      USING (user_id = (SELECT auth.uid())) 
      WITH CHECK (user_id = (SELECT auth.uid()));
    CREATE POLICY "Users can delete their own deployments"
      ON public.deployments FOR DELETE USING (user_id = (SELECT auth.uid()));
  END IF;
END;
$$;

-- Profiles policies (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    -- Check column names
    DECLARE
      id_column text := 'id';
      public_column text := NULL;
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' AND table_name = 'profiles' 
                AND column_name = 'is_public') THEN
        public_column := 'is_public';
      ELSIF EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'profiles' 
                  AND column_name = 'public') THEN
        public_column := 'public';
      END IF;
      
      -- Drop existing policies
      DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
      DROP POLICY IF EXISTS "Profiles visibility policy" ON public.profiles;
      DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
      
      -- Create optimized policies
      IF public_column IS NOT NULL THEN
        EXECUTE format('CREATE POLICY "Profiles visibility policy" ON public.profiles FOR SELECT USING (%I = true OR %I = (SELECT auth.uid()))', 
                      public_column, id_column);
      ELSE
        EXECUTE format('CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (%I = (SELECT auth.uid()))', 
                      id_column);
      END IF;
      
      -- Update policy
      EXECUTE format('CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (%I = (SELECT auth.uid())) WITH CHECK (%I = (SELECT auth.uid()))', 
                    id_column, id_column);
    END;
  END IF;
END;
$$;
