import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tepdqzrtisexlfmpktmu.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_CBCanDVA5gCvdcvolBHUkQ_0adU5YD4";

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
};
