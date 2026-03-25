// src/features/ps-units/services/transactionService.ts
import { createClient } from "@/lib/supabase/client";

export const startPSSession = async (psId: string, cashierId: string, customStartTime?: string) => {
  const supabase = createClient();
  
  // 1. Buat transaksi baru dengan status 'active'
  const { data: transaction, error: txError } = await supabase
    .from("transactions")
    .insert([
      {
        ps_id: psId,
        cashier_id: cashierId,
        status: "active",
        start_time: customStartTime || new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (txError) throw txError;

  // 2. Ubah status PS menjadi 'in_use'
  const { error: psError } = await supabase
    .from("ps_units")
    .update({ status: "in_use" })
    .eq("id", psId);

  if (psError) throw psError;

  return transaction;
};
