"use client"

import { createBrowserComponentClient } from "@/lib/supabase/clients"
import { useEffect, useState, useCallback, useMemo } from "react"
import type { User, Session } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a singleton instance of the Supabase client
// This prevents creating multiple instances across the app
let supabaseInstance: ReturnType<typeof createBrowserComponentClient> | null = null

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserComponentClient()
  }
  return supabaseInstance
}

export function useSupabase() {
  const supabase = useMemo(() => getSupabaseClient(), [])
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
  queryFn: (
    supabase: ReturnType<typeof createBrowserComponentClient<Database>>,
  ) => Promise<{ data: T | null; error: any }>,
  dependencies: any[] = [],
) {
  const { supabase } = useSupabase()
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await queryFn(supabase)
      if (error) {
        setError(error)
        setData(null)
      } else {
        setData(data)
        setError(null)
      }
    } catch (e) {
      setError(e)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [supabase, queryFn])

  useEffect(() => {
    fetchData()
  }, [fetchData, ...dependencies])

  return {
    data,
    error,
    loading,
    refetch: fetchData,
    isError: !!error,
    isSuccess: !loading && !error && data !== null,
  }
}

export function useSupabaseMutation<T = any, V = any>(
  mutationFn: (
    supabase: ReturnType<typeof createBrowserComponentClient<Database>>,
    variables: V,
  ) => Promise<{ data: T | null; error: any }>,
) {
  const { supabase } = useSupabase()
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const mutate = useCallback(
    async (variables: V) => {
      setLoading(true)
      try {
        const { data, error } = await mutationFn(supabase, variables)
        if (error) {
          setError(error)
          setData(null)
          return { data: null, error }
        } else {
          setData(data)
          setError(null)
          return { data, error: null }
        }
      } catch (e) {
        setError(e)
        setData(null)
        return { data: null, error: e }
      } finally {
        setLoading(false)
      }
    },
    [supabase, mutationFn],
  )

  return {
    mutate,
    data,
    error,
    loading,
    isError: !!error,
    isSuccess: !loading && !error && data !== null,
  }
}
