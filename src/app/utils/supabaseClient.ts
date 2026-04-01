import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for Vite projects
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing! Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // This MUST be true to stay logged in after closing the browser
    autoRefreshToken: true, // This keeps the session alive while the app is open
    detectSessionInUrl: true // Useful for social logins or email confirmations
  }
});
