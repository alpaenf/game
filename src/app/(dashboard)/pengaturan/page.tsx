import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Building2, Gamepad2, Users, Save } from "lucide-react";
import PSUnitSettings from "@/features/pengaturan/components/PSUnitSettings";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Proteksi Route Server Side untuk Admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">Pengaturan Sistem</h1>
          <p className="text-gray-600 dark:text-gray-400">Konfigurasi bisnis, tarif dasar, dan manajemen akses akun.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-green-500 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">
           <Save className="w-4 h-4" />
           Simpan Perubahan
        </button>
      </div>

      {/* Identitas Outlet */}
      <div className="bg-surface border border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg">
         <div className="bg-gray-200/ dark:bg-gray-800/ p-4 border-b border-gray-200 dark:border-gray-200 dark:border-gray-800 flex items-center gap-3">
             <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <Building2 className="w-5 h-5" />
             </div>
             <h2 className="text-lg font-bold text-text-main">Identitas Usaha / Outlet</h2>
         </div>
         <div className="p-6 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nama Usaha</label>
                    <input
                      type="text"
                      disabled
                      defaultValue="Alfaen Game"
                      className="w-full bg-background/50 border border-gray-300 dark:border-gray-700 text-text-main rounded-lg px-4 py-2.5 opacity-70 cursor-not-allowed"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Kontak / WhatsApp Outlet</label>
                    <input
                      type="text"
                      disabled
                      defaultValue="0812-XXXX-XXXX"
                      className="w-full bg-background/50 border border-gray-300 dark:border-gray-700 text-text-main rounded-lg px-4 py-2.5 opacity-70 cursor-not-allowed"
                    />
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Alamat Cetak Struk</label>
                    <textarea
                      disabled
                      rows={2}
                      defaultValue="Jl. Contoh Alamat No. 123, Kota Simulator"
                      className="w-full bg-background/50 border border-gray-300 dark:border-gray-700 text-text-main rounded-lg px-4 py-2.5 opacity-70 cursor-not-allowed resize-none"
                    />
                 </div>
             </div>
             <p className="text-xs text-yellow-500 mt-2">* Fitur integrasi database tabel setting sedang dalam tahap pengembangan (Coming Soon).</p>
         </div>
      </div>

      {/* Konfigurasi Mesin / Tarif Global */}
      <div className="bg-surface border border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg">
         <div className="bg-gray-200/ dark:bg-gray-800/ p-4 border-b border-gray-200 dark:border-gray-200 dark:border-gray-800 flex items-center gap-3">
             <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <Gamepad2 className="w-5 h-5" />
             </div>
             <h2 className="text-lg font-bold text-text-main">Unit PlayStation & Tarif Dasar</h2>
         </div>
         <PSUnitSettings />
      </div>

       {/* Manajemen Akun */}
       <div className="bg-surface border border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg">
         <div className="bg-gray-200/ dark:bg-gray-800/ p-4 border-b border-gray-200 dark:border-gray-200 dark:border-gray-800 flex items-center gap-3">
             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Users className="w-5 h-5" />
             </div>
             <h2 className="text-lg font-bold text-text-main">Akses Pegawai Dasar</h2>
         </div>
         <div className="p-6 text-center py-10">
            <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-2">Supabase Auth Dashboard</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
               Untuk menjaga keamanan kriptografi, penambahan Kasir atau Admin baru 
               harus di-invite murni langsung menggunakan konsol Supabase Authentication Anda.
            </p>
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-secondary/10 text-secondary border border-secondary/20 font-semibold rounded-lg hover:bg-secondary hover:text-text-main transition-all"
            >
               Menuju Supabase Konsol &rarr;
            </a>
         </div>
      </div>

    </div>
  );
}
