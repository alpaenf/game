"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getKasirProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
  return data;
}

export async function addKasirUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;

  if (!email || !password || !name) {
    return { error: "Semua kolom wajib diisi" };
  }

  const supabase = await createClient();
  
  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Belum login" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Hanya admin yang bisa membuat user baru." };
  }

  const adminAuth = createAdminClient();

  // Create User directly using Admin API
  const { data: authData, error: authError } = await adminAuth.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) return { error: authError.message };

  // Profile is created by Auth Trigger (yg ada di Supabase dashboard awalnya mungkin).
  // TAPI, untuk jaga-jaga kita paksa timpa update role dan namanya menggunakan adminAuth
  if (authData.user) {
    await adminAuth.from("profiles").upsert({
      id: authData.user.id,
      name,
      role: role || "kasir",
    });
  }

  revalidatePath("/kasir");
  return { success: true };
}

export async function updateKasirRole(userId: string, newRole: string) {
  const supabase = await createClient();
  
  // Only an admin should be able to do this, ideally we verify who is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (myProfile?.role !== "admin") {
    return { error: "Unauthorized. Hanya admin yang bisa mengubah role." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/kasir");
  return { success: true };
}
