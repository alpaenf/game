import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil role dari tabel profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role || "kasir"; // Default fallback
  const userName = profile?.name || user.email?.split("@")[0] || "User";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role={userRole} userName={userName} />
      
      {/* Penyesuaian padding mobile bottom navbar (pb-24) dan top header (pt-20) */}
      <main className="flex-1 overflow-y-auto px-4 pt-20 pb-24 md:py-8 md:px-6 md:pl-[17rem] lg:pl-[18rem] h-full relative">
        <div className="mx-auto max-w-7xl relative">
          {children}
        </div>
      </main>
    </div>
  );
}