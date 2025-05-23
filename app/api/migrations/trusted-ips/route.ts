import { createServerComponentClient } from "@/utils/supabase/clients"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerComponentClient()
    
    // Check if the table already exists
    const { data: tableExists } = await supabase
      .from("information_schema.tables" as any)
      .select("table_name")
      .eq("table_name", "trusted_ips")
      .eq("table_schema", "public")
    
    if (tableExists && tableExists.length > 0) {
      return NextResponse.json({ success: true, message: "Trusted IPs table already exists" })
    }
    
    // Create the trusted_ips table
    const { error: createError } = await supabase.rpc("create_trusted_ips_table" as any)
    
    if (createError) {
      console.error("Error creating trusted_ips table:", createError)
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, message: "Trusted IPs table created successfully" })
  } catch (error) {
    console.error("Error in trusted IPs migration:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Create a SQL function to create the trusted_ips table
export async function POST() {
  try {
    const supabase = createServerComponentClient()
    
    // Create the SQL function to create the trusted_ips table
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION create_trusted_ips_table()
      RETURNS void
      LANGUAGE plpgsql
      AS $$
      BEGIN
        -- Create the trusted_ips table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.trusted_ips (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          ip_address TEXT NOT NULL,
          last_used TIMESTAMP WITH TIME ZONE DEFAULT now(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE(user_id, ip_address)
        );
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_trusted_ips_user_id ON public.trusted_ips(user_id);
        
        -- Set up RLS policies
        ALTER TABLE public.trusted_ips ENABLE ROW LEVEL SECURITY;
        
        -- Policy for users to see only their own trusted IPs
        DROP POLICY IF EXISTS trusted_ips_select_policy ON public.trusted_ips;
        CREATE POLICY trusted_ips_select_policy ON public.trusted_ips
          FOR SELECT USING (auth.uid() = user_id);
        
        -- Policy for users to insert their own trusted IPs
        DROP POLICY IF EXISTS trusted_ips_insert_policy ON public.trusted_ips;
        CREATE POLICY trusted_ips_insert_policy ON public.trusted_ips
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        -- Policy for users to update their own trusted IPs
        DROP POLICY IF EXISTS trusted_ips_update_policy ON public.trusted_ips;
        CREATE POLICY trusted_ips_update_policy ON public.trusted_ips
          FOR UPDATE USING (auth.uid() = user_id);
        
        -- Policy for users to delete their own trusted IPs
        DROP POLICY IF EXISTS trusted_ips_delete_policy ON public.trusted_ips;
        CREATE POLICY trusted_ips_delete_policy ON public.trusted_ips
          FOR DELETE USING (auth.uid() = user_id);
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
        
        // Try again to create the create_trusted_ips_table function
        const { error: retryError } = await supabase.rpc("exec_sql" as any, { sql: createFunctionSQL })
        
        if (retryError) {
          console.error("Error creating create_trusted_ips_table function:", retryError)
          return NextResponse.json(
            { success: false, error: retryError.message },
            { status: 500 }
          )
        }
      } else {
        console.error("Error creating create_trusted_ips_table function:", functionError)
        return NextResponse.json(
          { success: false, error: functionError.message },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ success: true, message: "Migration function created successfully" })
  } catch (error) {
    console.error("Error in trusted IPs migration function creation:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
