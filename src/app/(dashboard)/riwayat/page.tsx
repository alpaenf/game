import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HistoryListClient from "@/features/history/components/HistoryListClient";

// Server Component Wrapper
export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // RBAC: Hanya akun admin yang bisa buka Laporan/Riwayat detail keseluruhan
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role || "kasir";

  return <HistoryListClient userRole={userRole} />;
}