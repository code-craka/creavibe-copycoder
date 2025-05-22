"use client"

import { createBrowserComponentClient } from "@/lib/supabase/clients"
import { useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

export function useSupabase() {
  const [supabase] = useState(() => createBrowserComponentClient())
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return { supabase, user, session, loading }
}

export function useSupabaseQuery<T = any>(
  query: (
    supabase: ReturnType<typeof createBrowserComponentClient<Database>>,
  ) => Promise<{ data: T | null; error: any }>,
  dependencies: any[] = [],
) {
  const { supabase } = useSupabase()
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data, error } = await query(supabase)
        if (error) {
          setError(error)
        } else {
          setData(data)
        }
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, ...dependencies])

  return { data, error, loading, refetch: () => {} }
}
