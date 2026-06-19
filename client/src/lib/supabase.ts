/**
 * Supabase Client (Browser-side)
 *
 * Uses the ANON (public) key — safe to expose in the browser.
 * All data access is gated by Row Level Security (RLS) policies
 * configured in your Supabase dashboard.
 *
 * Usage:
 *   import { supabase } from "@/lib/supabase";
 *   const { data, error } = await supabase.from("employees").select("*");
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. " +
    "Check your client/.env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
