"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateCurrentPSBill } from "@/lib/billing";

// Note: Kita jadikan file ini sebagai server action
export async function finishTransaction(txId: string) {
  const supabase = await createClient();

  // 1. Dapatkan data saat ini
  const { data: tx, error: fetchTxError } = await supabase
    .from("transactions")
    .select(`*, ps_units:ps_id (*), transaction_items (*)`)
    .eq("id", txId)
    .single();

  if (fetchTxError || !tx) {
    return { error: "Transaksi tidak ditemukan" };
  }
  
  if (tx.status !== "active") {
    return { error: "Transaksi sudah selesai atau dibatalkan." };
  }

  // 2. Kalkulasi akhir biaya PS
  const psUnit = Array.isArray(tx.ps_units) ? tx.ps_units[0] : tx.ps_units; // handle if one-to-many relationship shape from supabase
  if (!psUnit) return { error: "Unit PS tidak valid" };

  const end_time = new Date().toISOString();
  const ps_total = await calculateCurrentPSBill(tx.start_time, psUnit.hourly_rate, new Date(end_time));

  // 3. Kalkulasi items
  const items_total = tx.transaction_items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
  const total_price = ps_total + items_total;

  // 4. Update transaksi menjadi selesai
  const { error: updateTxError } = await supabase
    .from("transactions")
    .update({
      end_time,
      status: "completed",
      ps_total,
      items_total,
      total_price,
    })
    .eq("id", txId);

  if (updateTxError) return { error: updateTxError.message };

  // 5. Update status unit PS kembali ke available
  const { error: updatePsError } = await supabase
    .from("ps_units")
    .update({ status: "available" })
    .eq("id", psUnit.id);

  if (updatePsError) return { error: updatePsError.message };

  // 6. Kurangi Stok Produk (Berdasarkan transaction_items)
  if (tx.transaction_items && tx.transaction_items.length > 0) {
    for (const item of tx.transaction_items) {
      if (item.product_id) {
         // panggil rpc function (stok tidak boleh minus secara ideal, tp update direct jg bisa)
         // cara paling aman adalah panggil rpc, tp mari kita update manual krn single branch
         const { data: prod } = await supabase.from('products').select('stock').eq('id', item.product_id).single();
         if (prod) {
             const newStock = prod.stock - item.qty;
             await supabase.from('products').update({ stock: Math.max(0, newStock) }).eq('id', item.product_id);
         }
      }
    }
  }

  return { success: true, txId };
}
