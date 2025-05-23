import { createServerComponentClient } from "@/utils/supabase/clients"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerComponentClient()
    
    // Check if the table already exists
    const { data: tableExists } = await supabase
      .from("information_schema.tables" as any)
      .select("table_name")
      .eq("table_name", "theme_preferences")
      .eq("table_schema", "public")
    
    if (tableExists && tableExists.length > 0) {
      return NextResponse.json({ success: true, message: "Theme preferences table already exists" })
    }
    
    // Create the theme_preferences table
    const { error: createError } = await supabase.rpc("create_theme_preferences_table" as any)
    
    if (createError) {
      console.error("Error creating theme_preferences table:", createError)
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, message: "Theme preferences table created successfully" })
  } catch (error) {
    console.error("Error in theme preferences migration:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Create a SQL function to create the theme_preferences table
export async function POST() {
  try {
    const supabase = createServerComponentClient()
    
    // Create the SQL function to create the theme_preferences table
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION create_theme_preferences_table()
      RETURNS void
      LANGUAGE plpgsql
      AS $$
      BEGIN
        -- Create the theme_preferences table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.theme_preferences (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          theme TEXT NOT NULL DEFAULT 'system',
          accent_color TEXT DEFAULT 'blue',
          font_size TEXT DEFAULT 'medium',
          high_contrast BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE(user_id)
        );
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_theme_preferences_user_id ON public.theme_preferences(user_id);
        
        -- Set up RLS policies
        ALTER TABLE public.theme_preferences ENABLE ROW LEVEL SECURITY;
        
        -- Policy for users to see only their own theme preferences
        DROP POLICY IF EXISTS theme_preferences_select_policy ON public.theme_preferences;
        CREATE POLICY theme_preferences_select_policy ON public.theme_preferences
          FOR SELECT USING (auth.uid() = user_id);
        
        -- Policy for users to insert their own theme preferences
        DROP POLICY IF EXISTS theme_preferences_insert_policy ON public.theme_preferences;
        CREATE POLICY theme_preferences_insert_policy ON public.theme_preferences
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        -- Policy for users to update their own theme preferences
        DROP POLICY IF EXISTS theme_preferences_update_policy ON public.theme_preferences;
        CREATE POLICY theme_preferences_update_policy ON public.theme_preferences
          FOR UPDATE USING (auth.uid() = user_id);
        
        -- Policy for users to delete their own theme preferences
        DROP POLICY IF EXISTS theme_preferences_delete_policy ON public.theme_preferences;
        CREATE POLICY theme_preferences_delete_policy ON public.theme_preferences
          FOR DELETE USING (auth.uid() = user_id);
          
        -- Create a trigger to update the updated_at timestamp
        CREATE OR REPLACE FUNCTION update_theme_preferences_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = now();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        DROP TRIGGER IF EXISTS update_theme_preferences_updated_at ON public.theme_preferences;
        CREATE TRIGGER update_theme_preferences_updated_at
          BEFORE UPDATE ON public.theme_preferences
          FOR EACH ROW
          EXECUTE FUNCTION update_theme_preferences_updated_at();
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
        
        // Try again to create the create_theme_preferences_table function
        const { error: retryError } = await supabase.rpc("exec_sql" as any, { sql: createFunctionSQL })
        
        if (retryError) {
          console.error("Error creating create_theme_preferences_table function:", retryError)
          return NextResponse.json(
            { success: false, error: retryError.message },
            { status: 500 }
          )
        }
      } else {
        console.error("Error creating create_theme_preferences_table function:", functionError)
        return NextResponse.json(
          { success: false, error: functionError.message },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json({ success: true, message: "Migration function created successfully" })
  } catch (error) {
    console.error("Error in theme preferences migration function creation:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
