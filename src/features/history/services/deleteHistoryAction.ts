"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteTransactionAction(txId: string) {
  const supabase = await createClient();

  // Pastikan yang menghapus adalah admin (opsional untuk keamanan)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Belum login" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Akses ditolak: Hanya admin yang dapat menghapus riwayat transaksi." };
  }

  // Hapus transaksi (Cuma perlu menghapus tabel transactions,
  // jika ada foreign key on delete cascade maka item akan otomatis ikut terhapus)
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", txId);

  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}
