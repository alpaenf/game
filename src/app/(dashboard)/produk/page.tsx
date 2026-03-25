import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProductListClient from "@/features/products/components/ProductListClient";

// Server Component Wrapper
export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user role for RBAC
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "kasir";

  // Kita biarkan kasir bisa melihat inventaris (meski mungkin tak perlu,
  // tapi siapa tahu mau cek stok sebelum jualan), tapi aksi CRUD kita batasi di UI
  
  return <ProductListClient userRole={role} />;
}
