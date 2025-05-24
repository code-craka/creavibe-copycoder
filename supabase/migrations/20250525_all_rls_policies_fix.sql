-- Migration: All RLS Policy Optimizations & Duplicate Policy Cleanup
-- Date: 2025-05-25

-- ======================
-- PROFILES TABLE POLICIES
-- ======================

DROP POLICY IF EXISTS "Profiles visibility policy" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Profiles visibility policy"
  ON public.profiles
  FOR SELECT
  USING (
    public = true
    OR id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- ==============
-- PROJECTS TABLE
-- ==============

DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
CREATE POLICY "Users can view their own projects"
  ON public.projects
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
CREATE POLICY "Users can create their own projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
CREATE POLICY "Users can update their own projects"
  ON public.projects
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
CREATE POLICY "Users can delete their own projects"
  ON public.projects
  FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- ================
-- API_TOKENS TABLE
-- ================

DROP POLICY IF EXISTS "Users can view their own tokens" ON public.api_tokens;
CREATE POLICY "Users can view their own tokens"
  ON public.api_tokens
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own tokens" ON public.api_tokens;
CREATE POLICY "Users can create their own tokens"
  ON public.api_tokens
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own tokens" ON public.api_tokens;
CREATE POLICY "Users can update their own tokens"
  ON public.api_tokens
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own tokens" ON public.api_tokens;
CREATE POLICY "Users can delete their own tokens"
  ON public.api_tokens
  FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- ===============
-- API_USAGE TABLE
-- ===============

DROP POLICY IF EXISTS "Users can view usage for their own tokens" ON public.api_usage;
CREATE POLICY "Users can view usage for their own tokens"
  ON public.api_usage
  FOR SELECT
  USING (
    (SELECT auth.uid()) IN (
      SELECT user_id FROM public.api_tokens WHERE id = token_id
    )
  );

-- ======================
-- DEPLOYMENTS TABLE
-- ======================

DROP POLICY IF EXISTS "Users can view their own deployments" ON public.deployments;
CREATE POLICY "Users can view their own deployments"
  ON public.deployments
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create their own deployments" ON public.deployments;
CREATE POLICY "Users can create their own deployments"
  ON public.deployments
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own deployments" ON public.deployments;
CREATE POLICY "Users can update their own deployments"
  ON public.deployments
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own deployments" ON public.deployments;
CREATE POLICY "Users can delete their own deployments"
  ON public.deployments
  FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- ===============================
-- NOTIFICATION_PREFERENCES TABLE
-- ===============================

DROP POLICY IF EXISTS "Users can view their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can view their own notification preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can insert their own notification preferences"
  ON public.notification_preferences
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can update their own notification preferences"
  ON public.notification_preferences
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ========================
-- THEME_PREFERENCES TABLE
-- ========================

DROP POLICY IF EXISTS "Users can view their own theme preferences" ON public.theme_preferences;
CREATE POLICY "Users can view their own theme preferences"
  ON public.theme_preferences
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own theme preferences" ON public.theme_preferences;
CREATE POLICY "Users can insert their own theme preferences"
  ON public.theme_preferences
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own theme preferences" ON public.theme_preferences;
CREATE POLICY "Users can update their own theme preferences"
  ON public.theme_preferences
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ===================
-- TRUSTED_IPS TABLE
-- ===================

DROP POLICY IF EXISTS "Users can view their own trusted IPs" ON public.trusted_ips;
CREATE POLICY "Users can view their own trusted IPs"
  ON public.trusted_ips
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own trusted IPs" ON public.trusted_ips;
CREATE POLICY "Users can insert their own trusted IPs"
  ON public.trusted_ips
  FOR INSERT
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own trusted IPs" ON public.trusted_ips;
CREATE POLICY "Users can update their own trusted IPs"
  ON public.trusted_ips
  FOR UPDATE
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own trusted IPs" ON public.trusted_ips;
CREATE POLICY "Users can delete their own trusted IPs"
  ON public.trusted_ips
  FOR DELETE
  USING (user_id = (SELECT auth.uid()));

-- ===================
-- AUDIT_LOGS TABLE
-- ===================

DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.audit_logs;
CREATE POLICY "Service role can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

-- ===================
-- Add any additional table RLS policies below
-- ===================

-- END OF MIGRATION