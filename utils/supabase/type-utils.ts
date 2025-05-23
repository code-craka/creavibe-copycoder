/**
 * Utility functions for handling TypeScript type assertions with Supabase
 * This helps avoid type errors when working with tables not fully defined in the Database type
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

// Type for any Supabase client
type AnySupabaseClient = SupabaseClient<any>;

/**
 * Type-safe wrapper for Supabase's from() method
 * This allows using any table name without TypeScript errors
 */
export function safeFrom<T = any>(
  client: AnySupabaseClient,
  table: string
) {
  return client.from(table) as any;
}

/**
 * Type-safe wrapper for Supabase's insert() method
 * This allows inserting data into any table without TypeScript errors
 */
export function safeInsert<T = any>(
  client: AnySupabaseClient,
  table: string,
  data?: T | T[]
) {
  const from = safeFrom(client, table);
  return from.insert(data as any);
}

/**
 * Type-safe wrapper for Supabase's select() method
 * This allows selecting any columns without TypeScript errors
 */
export function safeSelect<T = any>(
  client: AnySupabaseClient,
  table: string,
  columns?: string | string[] | Record<string, any>
) {
  const from = safeFrom(client, table);
  // Handle both string and object parameters
  if (columns === undefined || columns === null) {
    return from.select('*');
  }
  return from.select(columns);
}

/**
 * Type-safe wrapper for Supabase's update() method
 * This allows updating data in any table without TypeScript errors
 */
export function safeUpdate<T = any>(
  client: AnySupabaseClient,
  table: string,
  data?: Partial<T>
) {
  const from = safeFrom(client, table);
  return from.update(data as any);
}

/**
 * Type-safe cast for any data
 * This allows casting data to any type without TypeScript errors
 */
export function safeCast<T>(data: any): T {
  return data as unknown as T;
}

/**
 * Enhanced Supabase client with type-safe methods
 * This wraps the standard Supabase client with our safe utility functions
 * while maintaining compatibility with the standard client methods
 */
export function createSafeClient(client: AnySupabaseClient) {
  // Create a proxy to intercept method calls
  return new Proxy(client, {
    get(target, prop, receiver) {
      // First handle our safe methods
      if (prop === 'safeFrom') {
        return <T = any>(table: string) => safeFrom<T>(client, table);
      }
      if (prop === 'safeSelect') {
        return <T = any>(table: string, columns?: string | string[] | Record<string, any>) => 
          safeSelect<T>(client, table, columns);
      }
      if (prop === 'safeInsert') {
        return <T = any>(table: string, data?: T | T[]) => 
          safeInsert<T>(client, table, data);
      }
      if (prop === 'safeUpdate') {
        return <T = any>(table: string, data?: Partial<T>) => 
          safeUpdate<T>(client, table, data);
      }
      if (prop === 'safeCast') {
        return <T>(data: any): T => safeCast<T>(data);
      }
      
      // Then fall back to the original client methods
      return Reflect.get(target, prop, receiver);
    }
  }) as AnySupabaseClient & {
    safeFrom: <T = any>(table: string) => any;
    safeSelect: <T = any>(table: string, columns?: string | string[] | Record<string, any>) => any;
    safeInsert: <T = any>(table: string, data?: T | T[]) => any;
    safeUpdate: <T = any>(table: string, data?: Partial<T>) => any;
    safeCast: <T>(data: any) => T;
  };
}
