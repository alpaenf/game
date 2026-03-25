"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePSUnit(id: string, name: string, type: string, hourlyRate: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Ensure Admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden");
  }

  const { error } = await supabase
    .from("ps_units")
    .update({
      name,
      type,
      hourly_rate: hourlyRate
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating PS Unit:", error);
    throw new Error("Gagal mengupdate unit PS");
  }

  revalidatePath("/pengaturan");
  return { success: true };
}

export async function createPSUnit(name: string, type: string, hourlyRate: number) {
   const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();

   if (!user) {
     throw new Error("Unauthorized");
   }

   const { data: profile } = await supabase
     .from("profiles")
     .select("role")
     .eq("id", user.id)
     .single();

   if (profile?.role !== "admin") {
     throw new Error("Forbidden");
   }

   const { error } = await supabase
     .from("ps_units")
     .insert([{ name, type, hourly_rate: hourlyRate }]);

   if (error) {
     throw new Error("Gagal menambah unit PS");
   }

   revalidatePath("/pengaturan");
   return { success: true };
}

export async function deletePSUnit(id: string) {
   const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();

   if (!user) {
     throw new Error("Unauthorized");
   }

   const { data: profile } = await supabase
     .from("profiles")
     .select("role")
     .eq("id", user.id)
     .single();

   if (profile?.role !== "admin") {
     throw new Error("Forbidden");
   }

   const { error } = await supabase
     .from("ps_units")
     .delete()
     .eq("id", id);

   if (error) {
     throw new Error("Gagal menghapus unit PS. Pastikan tidak ada transaksi aktif atau gunakan arsip.");
   }

   revalidatePath("/pengaturan");
   return { success: true };
}