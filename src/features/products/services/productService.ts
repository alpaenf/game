"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const addProduct = async (name: string, price: number, stock: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").insert([{ name, price, stock }]);
  if (error) throw error;
  revalidatePath("/produk");
  return data;
};

export const updateProduct = async (id: string, name: string, price: number, stock: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").update({ name, price, stock }).eq("id", id);
  if (error) throw error;
  revalidatePath("/produk");
  return data;
};

export const deleteProduct = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/produk");
};