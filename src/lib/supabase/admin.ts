import { createClient } from "@supabase/supabase-js";

// NOTE: This uses the SERVICE_ROLE_KEY to bypass RLS and perform admin actions.
// Do NOT use this client on the browser side, only on secure Server Actions/APIs.
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tepdqzrtisexlfmpktmu.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcGRxenJ0aXNleGxmbXBrdG11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ1OTkzNiwiZXhwIjoyMDkwMDM1OTM2fQ.08guXSN1fl8vQnm7y_5i-NNgFoCsDgVzA--3KyXOweg";

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
