import { createServerComponentClient } from "@/utils/supabase/clients"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerComponentClient()
    
    // Check if the table already exists
    const { data: tableExists } = await supabase
      .from("information_schema.tables" as any)
      .select("table_name")
      .eq("table_name", "audit_logs")
      .eq("table_schema", "public")
    
    if (tableExists && tableExists.length > 0) {
      return NextResponse.json({ success: true, message: "Audit logs table already exists" })
    }
    
    // Create the audit_logs table
    const { error: createError } = await supabase.rpc("create_audit_logs_table" as any)
    
    if (createError) {
      console.error("Error creating audit_logs table:", createError)
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, message: "Audit logs table created successfully" })
  } catch (error) {
    console.error("Error in audit logs migration:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Create a SQL function to create the audit_logs table
export async function POST() {
  try {
    const supabase = createServerComponentClient()
    
    // Create the SQL function to create the audit_logs table
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION create_audit_logs_table()
      RETURNS void
      LANGUAGE plpgsql
      AS $$
      BEGIN
        -- Create the audit_logs table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.audit_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
          action TEXT NOT NULL,
          entity_type TEXT,
          entity_id TEXT,
          ip_address TEXT,
          user_agent TEXT,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Create indexes for faster lookups
        CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
        CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
        CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
        
        -- Set up RLS policies
        ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
        
        -- Policy for users to see only their own audit logs
        DROP POLICY IF EXISTS audit_logs_select_policy ON public.audit_logs;
        CREATE POLICY audit_logs_select_policy ON public.audit_logs
          FOR SELECT USING (auth.uid() = user_id);
        
        -- Policy for inserting audit logs (allow service role only)
        DROP POLICY IF EXISTS audit_logs_insert_policy ON public.audit_logs;
        CREATE POLICY audit_logs_insert_policy ON public.audit_logs
          FOR INSERT WITH CHECK (true);
          
        -- No update or delete policies - audit logs should be immutable
      END;
      $$;
    `
    
    // Execute the SQL to create the function
    const { error: functionError } = await supabase.rpc("exec_sql" as any, { sql: createFunctionSQL })
    
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
        const { error: execSqlError } = await supabase.rpc("exec_sql" as any, { sql: createExecSqlFunctionSQL })
        
        if (execSqlError) {
          console.error("Error creating exec_sql function:", execSqlError)
          return NextResponse.json(
            { success: false, error: execSqlError.message },
            { status: 500 }
          )
        }
        
        // Try again to create the create_audit_logs_table function
        const { error: retryError } = await supabase.rpc("exec_sql" as any, { sql: createFunctionSQL })
        
        if (retryError) {
          console.error("Error creating create_audit_logs_table function:", retryError)
          return NextResponse.json(
            { success: false, error: retryError.message },
            { status: 500 }
          )
        }
      } else {
        console.error("Error creating create_audit_logs_table function:", functionError)
        return NextResponse.json(
          { success: false, error: functionError.message },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ success: true, message: "Migration function created successfully" })
  } catch (error) {
    console.error("Error in audit logs migration function creation:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
