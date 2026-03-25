import { createClient } from "@/lib/supabase/client";

export const getTransactionDetail = async (txId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      ps_units:ps_id (*),
      transaction_items (*)
    `)
    .eq("id", txId)
    .single();

  if (error) throw error;
  return data;
};

export const getAvailableProducts = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .gt("stock", 0)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
};

export const addTransactionItem = async (
  txId: string,
  productId: string,
  productName: string,
  price: number,
  qty: number
) => {
  const supabase = createClient();
  const subtotal = price * qty;

  const { data, error } = await supabase
    .from("transaction_items")
    .insert([
      {
        transaction_id: txId,
        product_id: productId,
        product_name: productName,
        price,
        qty,
        subtotal,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeItem = async (itemId: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("transaction_items").delete().eq("id", itemId);
    if(error) throw error;
}
