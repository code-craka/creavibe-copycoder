import { createServerComponentClient } from "@/utils/supabase/clients"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerComponentClient()
    
    // Check if the table already exists
    const { data: tableExists } = await (supabase as any)
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "notification_preferences")
      .eq("table_schema", "public")
    
    if (tableExists && tableExists.length > 0) {
      return NextResponse.json({ success: true, message: "Notification preferences table already exists" })
    }
    
    // Create the notification_preferences table
    const { error: createError } = await (supabase as any).rpc("execute_sql", { sql: "SELECT create_notification_preferences_table()" })
    
    if (createError) {
      console.error("Error creating notification_preferences table:", createError)
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, message: "Notification preferences table created successfully" })
  } catch (error) {
    console.error("Error in notification preferences migration:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Create a SQL function to create the notification_preferences table
export async function POST() {
  try {
    const supabase = createServerComponentClient()
    
    // Create the SQL function to create the notification_preferences table
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION create_notification_preferences_table()
      RETURNS void
      LANGUAGE plpgsql
      AS $$
      BEGIN
        -- Create the notification_preferences table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.notification_preferences (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          email_notifications BOOLEAN DEFAULT true,
          push_notifications BOOLEAN DEFAULT true,
          marketing_emails BOOLEAN DEFAULT false,
          project_updates BOOLEAN DEFAULT true,
          comment_notifications BOOLEAN DEFAULT true,
          mention_notifications BOOLEAN DEFAULT true,
          security_alerts BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE(user_id)
        );
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON public.notification_preferences(user_id);
        
        -- Set up RLS policies
        ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
        
        -- Policy for users to see only their own notification preferences
        DROP POLICY IF EXISTS notification_preferences_select_policy ON public.notification_preferences;
        CREATE POLICY notification_preferences_select_policy ON public.notification_preferences
          FOR SELECT USING (auth.uid() = user_id);
        
        -- Policy for users to insert their own notification preferences
        DROP POLICY IF EXISTS notification_preferences_insert_policy ON public.notification_preferences;
        CREATE POLICY notification_preferences_insert_policy ON public.notification_preferences
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        -- Policy for users to update their own notification preferences
        DROP POLICY IF EXISTS notification_preferences_update_policy ON public.notification_preferences;
        CREATE POLICY notification_preferences_update_policy ON public.notification_preferences
          FOR UPDATE USING (auth.uid() = user_id);
        
        -- Policy for users to delete their own notification preferences
        DROP POLICY IF EXISTS notification_preferences_delete_policy ON public.notification_preferences;
        CREATE POLICY notification_preferences_delete_policy ON public.notification_preferences
          FOR DELETE USING (auth.uid() = user_id);
          
        -- Create a trigger to update the updated_at timestamp
        CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = now();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON public.notification_preferences;
        CREATE TRIGGER update_notification_preferences_updated_at
          BEFORE UPDATE ON public.notification_preferences
          FOR EACH ROW
          EXECUTE FUNCTION update_notification_preferences_updated_at();
          
        -- Create notification_templates table for email templates
        CREATE TABLE IF NOT EXISTS public.notification_templates (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          type TEXT NOT NULL UNIQUE,
          subject TEXT NOT NULL,
          body TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Insert default templates
        INSERT INTO public.notification_templates (type, subject, body)
        VALUES 
          ('project_update', 'Project Update: {{project_name}}', '<h1>Project Update</h1><p>There has been an update to your project {{project_name}}.</p><p>{{update_message}}</p>'),
          ('comment_notification', 'New Comment on {{project_name}}', '<h1>New Comment</h1><p>{{commenter_name}} commented on your project {{project_name}}:</p><blockquote>{{comment_text}}</blockquote>'),
          ('mention_notification', 'You were mentioned by {{mentioner_name}}', '<h1>You were mentioned</h1><p>{{mentioner_name}} mentioned you in {{context}}:</p><blockquote>{{mention_text}}</blockquote>'),
          ('security_alert', 'Security Alert: {{alert_type}}', '<h1>Security Alert</h1><p>We detected a {{alert_type}} on your account.</p><p>{{alert_details}}</p>')
        ON CONFLICT (type) DO NOTHING;
      END;
      $$;
    `
    
    // Execute the SQL to create the function
    const { error: functionError } = await (supabase as any).rpc("execute_sql", { sql: createFunctionSQL })
    
    if (functionError) {
      // If the exec_sql function doesn't exist, create it first
      if (functionError.message.includes("function exec_sql") || functionError.message.includes("does not exist")) {
        const createExecSqlFunctionSQL = `
          CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
          BEGIN
            EXECUTE sql;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
        
        // Execute the SQL to create the exec_sql function
        const { error: execSqlError } = await (supabase as any).rpc("execute_sql", { sql: createExecSqlFunctionSQL })
        
        if (execSqlError) {
          console.error("Error creating exec_sql function:", execSqlError)
          return NextResponse.json(
            { success: false, error: execSqlError.message },
            { status: 500 }
          )
        }
        
        // Try again to create the create_notification_preferences_table function
        const { error: retryError } = await (supabase as any).rpc("execute_sql", { sql: createFunctionSQL })
        
        if (retryError) {
          console.error("Error creating create_notification_preferences_table function:", retryError)
          return NextResponse.json(
            { success: false, error: retryError.message },
            { status: 500 }
          )
        }
      } else {
        console.error("Error creating create_notification_preferences_table function:", functionError)
        return NextResponse.json(
          { success: false, error: functionError.message },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ success: true, message: "Migration function created successfully" })
  } catch (error) {
    console.error("Error in notification preferences migration function creation:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
