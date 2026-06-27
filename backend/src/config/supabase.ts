import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/config/env.js';

let supabaseClientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseClientInstance;
};
export const supabase = getSupabaseClient();
