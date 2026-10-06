import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
  throw new Error('Missing Supabase configuration. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
}

// Supabase Admin Client using Service Role Key
export const supabaseAdmin = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
