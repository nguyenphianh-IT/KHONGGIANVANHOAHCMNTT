/**
 * Server-Side Supabase Client (Backend & Serverless Handlers ONLY)
 * Connects with SUPABASE_SERVICE_ROLE_KEY to bypass RLS for trusted internal operations.
 * 
 * CRITICAL SECURITY NOTICE:
 * This file and SUPABASE_SERVICE_ROLE_KEY must NEVER be imported in client-side code.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnv = (key: string): string | undefined => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {}
  return undefined;
};

let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Returns a privileged Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * Returns null if the service role key is not configured in the current environment.
 */
export const getSupabaseAdmin = (): SupabaseClient | null => {
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_SERVICE_KEY');

  if (!url || !serviceKey || serviceKey.trim() === '') {
    return null;
  }

  _supabaseAdmin = createClient(url, serviceKey.trim(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  return _supabaseAdmin;
};

/**
 * Check if service role key is available on server
 */
export const isServiceRoleConfigured = (): boolean => {
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_SERVICE_KEY');
  return Boolean(serviceKey && serviceKey.trim() !== '');
};

/**
 * Reset or override the singleton Supabase admin client (for testing & environment reload)
 */
export const resetSupabaseAdmin = (client?: SupabaseClient | null): void => {
  _supabaseAdmin = client !== undefined ? client : null;
};
