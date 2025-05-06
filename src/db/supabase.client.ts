import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Try to get environment variables from both Vite's import.meta.env and process.env
const supabaseUrl =
  import.meta.env.SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.SUPABASE_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.VITE_SUPABASE_KEY;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
