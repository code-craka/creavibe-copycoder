"use client"

import { createBrowserComponentClient } from "@/utils/supabase/browser-client"
import { useEffect, useState, useCallback, useMemo } from "react"
import type { User, Session, SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type SupabaseClientType = SupabaseClient<Database>

// Create a singleton instance of the Supabase client
// This prevents creating multiple instances across the app
let supabaseInstance: SupabaseClientType | null = null

function getSupabaseClient(): SupabaseClientType {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserComponentClient()
  }
  return supabaseInstance
}

export function useSupabase() {
  const supabase = useMemo<SupabaseClientType>(() => getSupabaseClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!supabase) {
      setError(new Error("Supabase client is not initialized"))
      setLoading(false)
      return
    }

    let subscription: { unsubscribe: () => void } | undefined;
    
    try {
      // Set up auth state change listener
      const authStateChange = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      })
      
      subscription = authStateChange.data.subscription;

      // Get initial session
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          setSession(session)
          setUser(session?.user ?? null)
        })
        .catch((error: unknown) => {
          const errorObj = error instanceof Error ? error : new Error(String(error))
          console.error("Error getting session:", errorObj)
          setError(errorObj)
        })
        .finally(() => {
          setLoading(false)
        })
    } catch (error: unknown) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      console.error("Auth setup error:", errorObj)
      setError(errorObj)
      setLoading(false)
    }

    // Cleanup function
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [supabase])

  return { supabase, user, session, loading }
}

type QueryFunction<T> = (
  supabase: SupabaseClientType
) => Promise<{ data: T | null; error: Error | null }>

/**
 * Hook for making read-only Supabase queries
 * @param queryFn Function that takes a Supabase client and returns a promise with data and error
 * @param dependencies Array of dependencies that will trigger a refetch when changed
 */
export function useSupabaseQuery<T>(
  queryFn: QueryFunction<T>,
  dependencies: unknown[] = []
) {
  const { supabase } = useSupabase()
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!supabase) {
      setError(new Error("Supabase client is not initialized"))
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await queryFn(supabase)
      if (error) {
        console.error("Query error:", error)
        setError(error instanceof Error ? error : new Error(String(error)))
        setData(null)
      } else {
        setData(data)
      }
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e))
      console.error("Unexpected error in query:", error)
      setError(error)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [supabase, queryFn])

  useEffect(() => {
    fetchData()
  }, [fetchData, ...dependencies])

  return useMemo(() => ({
    data,
    error,
    loading,
    refetch: fetchData,
    isError: !!error,
    isSuccess: !loading && !error && data !== null,
  }), [data, error, loading, fetchData])
}

type MutationFunction<T, V> = (
  supabase: SupabaseClientType,
  variables: V
) => Promise<{ data: T | null; error: Error | null }>

/**
 * Hook for making mutations with Supabase
 * @param mutationFn Function that takes a Supabase client and variables and returns a promise with data and error
 * @returns Object with mutation state and a mutate function
 */
export function useSupabaseMutation<T, V>(
  mutationFn: MutationFunction<T, V>
) {
  const { supabase } = useSupabase()
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(true)

  const mutate = useCallback(
    async (variables: V) => {
      if (!isMounted) return { data: null, error: new Error('Component is unmounted') }
      
      setLoading(true)
      setError(null)

      try {
        const { data: result, error } = await mutationFn(supabase, variables)
        if (error) throw error
        setData(result)
        return { data: result, error: null }
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e))
        if (isMounted) {
          setError(error)
        }
        return { data: null, error }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    },
    [mutationFn, supabase, isMounted],
  )

  useEffect(() => {
    return () => {
      setIsMounted(false)
    }
  }, [])

  return useMemo(
    () => ({
      mutate,
      data,
      error,
      loading,
      isError: !!error,
      isSuccess: !loading && !error && data !== null,
    }),
    [mutate, data, error, loading]
  )
}
