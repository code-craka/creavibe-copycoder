-- Fix for function_search_path_mutable warning
-- Update handle_updated_at function
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


-- Update check_record_ownership function
CREATE OR REPLACE FUNCTION public.check_record_ownership(table_name text, record_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public, pg_temp
AS $$
DECLARE
  result boolean;
BEGIN
  EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE id = $1 AND auth.uid() = user_id)', table_name)
  INTO result
  USING record_id;
  
  RETURN result;
END;
$$;
