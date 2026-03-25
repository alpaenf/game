import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PrintReceiptClient from "./PrintReceiptClient";

export default async function StrukPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Validasi sesi (walaupun kasir, tetep harus login untuk ngeprint biar aman)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Tarik data detail transaksi utuh untuk resi cetak
  const { data: transaction, error } = await supabase
    .from("transactions")
    .select(`
      *,
      ps_units:ps_id (*),
      transaction_items (*)
    `)
    .eq("id", id)
    .single();

  if (error || !transaction) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-black">
        <h1 className="text-2xl font-bold">Data transaksi tidak ditemukan.</h1>
      </div>
    );
  }

  return <PrintReceiptClient transaction={transaction} />;
}
