-- Drop custom policies first (to avoid dependency errors)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename IN (
            'trusted_ips', 'audit_logs', 'theme_preferences', 'notification_preferences',
            'api_tokens', 'api_usage', 'deployments', 'projects', 'profiles'
          )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS "%I" ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Drop tables (if they exist)
DROP TABLE IF EXISTS public.trusted_ips CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.theme_preferences CASCADE;
DROP TABLE IF EXISTS public.notification_preferences CASCADE;
DROP TABLE IF EXISTS public.api_tokens CASCADE;
DROP TABLE IF EXISTS public.api_usage CASCADE;
DROP TABLE IF EXISTS public.deployments CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;

-- Drop helper functions (if they exist)
DROP FUNCTION IF EXISTS public.check_record_ownership(text, uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Drop indexes (if they exist)
DROP INDEX IF EXISTS idx_trusted_ips_user_id;
DROP INDEX IF EXISTS idx_audit_logs_user_id;
DROP INDEX IF EXISTS idx_theme_preferences_user_id;
DROP INDEX IF EXISTS idx_notification_preferences_user_id;
DROP INDEX IF EXISTS idx_api_tokens_user_id;
DROP INDEX IF EXISTS idx_api_usage_token_id;
DROP INDEX IF EXISTS idx_deployments_user_id;
DROP INDEX IF EXISTS idx_deployments_project_id;
DROP INDEX IF EXISTS idx_projects_user_id;