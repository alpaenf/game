"use server";

import { createClient } from "@/lib/supabase/server";

export async function createQuickManualTransaction(psId: string, durationMinutes: number, asActive: boolean = false) {
  const supabase = await createClient();
  
  // Ambil ID kasir
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Belum login" };

  // Ambil data PS untuk menghitung tarif
  const { data: ps } = await supabase.from("ps_units").select("*").eq("id", psId).single();
  if (!ps) return { error: "PS tidak ditemukan" };

  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - durationMinutes * 60000);

  if (asActive) {
    // Buat transaksi dengan status 'active' dan start_time mundur ke belakang
    const { data: tx, error } = await supabase.from("transactions").insert({
      ps_id: psId,
      cashier_id: user.id,
      start_time: startTime.toISOString(),
      status: 'active',
      ps_total: 0,
      items_total: 0,
      total_price: 0
    }).select().single();

    if (error) return { error: error.message };

    // Update status PS menjadi in_use
    await supabase.from("ps_units").update({
      status: 'in_use',
      active_transaction_id: tx.id
    }).eq("id", psId);

    return { success: true, transactionId: tx.id };
  }

  // Hitung tarif dan waktu (Mode Langsung Selesai)
  const psCost = (durationMinutes / 60) * ps.hourly_rate;
  const roundedCost = Math.round(psCost);

  // Buat transaksi dengan status 'completed' (langsung selesai tanpa timer)
  const { data: tx, error } = await supabase.from("transactions").insert({
    ps_id: psId,
    cashier_id: user.id,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    status: 'completed',
    ps_total: roundedCost,
    items_total: 0,
    total_price: roundedCost
  }).select().single();

  if (error) return { error: error.message };

  return { success: true, transactionId: tx.id };
}
