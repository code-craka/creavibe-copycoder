# Database Setup for CreaVibe

This document provides instructions for setting up the required database functions and storage policies for the CreaVibe application.

## Required Database Functions

The application requires several database functions to handle migrations. These functions need to be created in your Supabase project.

### How to Apply the Migrations

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `uwlzkwdgmoowaenwqtfz`
3. Navigate to the SQL Editor
4. Create a new query
5. Copy and paste the contents of each SQL file and execute them:
   - First run: `supabase/migrations/20250524_create_migration_functions.sql`
   - Then run: `supabase/migrations/20250524_fix_storage_policies.sql`

## Verifying the Setup

After applying the migrations, you can verify that everything is set up correctly:

1. Check that all the required functions exist:
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_type = 'FUNCTION' 
   AND routine_schema = 'public'
   AND routine_name IN (
     'create_trusted_ips_table',
     'create_audit_logs_table',
     'create_theme_preferences_table',
     'create_notification_preferences_table',
     'execute_sql'
   );
   ```

2. Check that the storage bucket policies are set up:
   ```sql
   SELECT policy_name 
   FROM storage.policies 
   WHERE policy_name LIKE '%avatars%';
   ```

## Troubleshooting

If you encounter any issues:

1. Make sure you're logged in with an account that has admin privileges
2. Check for any error messages in the SQL Editor
3. Verify that the functions are created with the exact names expected by the application
4. Ensure the storage bucket 'avatars' exists and has the correct policies

## Next Steps

After applying these migrations, restart your application and the 500 errors related to missing database functions should be resolved.

If you continue to experience issues, check the application logs for specific error messages that might provide more details about what's failing.
