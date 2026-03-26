"use client";

import { useState } from "react";
import { Users, Shield, User, RefreshCw, Plus, X } from "lucide-react";
import { updateKasirRole, addKasirUser } from "../services/kasirService";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  name: string;
  role: string;
  created_at?: string;
}

export default function KasirClient({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "kasir" : "admin";
    const confirmText = `Ubah role dari ${currentRole} menjadi ${newRole}?`;
    
    if (!window.confirm(confirmText)) return;

    setLoadingId(userId);
    const res = await updateKasirRole(userId, newRole);
    setLoadingId(null);

    if (res?.error) {
      alert("Gagal: " + res.error);
    } else {
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await addKasirUser(formData);
    
    setIsSubmitting(false);

    if (res.error) {
       alert("Gagal menambah tim: " + res.error);
    } else {
       alert("Tim berhasil ditambahkan!");
       setShowAddModal(false);
       window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-200 dark:border-gray-800 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            Manajemen Pengguna (Kasir & Admin)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ubah atau atur level akses karyawan dari sini.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm font-medium rounded hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Akun
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-surface border border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">Tambah Akun Tim</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-text-main">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                 <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nama Panggilan</label>
                 <input name="name" required className="w-full bg-background border border-gray-300 dark:border-gray-700 p-2.5 rounded text-sm text-text-main focus:border-primary outline-none" placeholder="Misal: Budi" />
              </div>
              <div>
                 <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                 <input type="email" name="email" required className="w-full bg-background border border-gray-300 dark:border-gray-700 p-2.5 rounded text-sm text-text-main focus:border-primary outline-none" placeholder="budi@rental.com" />
              </div>
              <div>
                 <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Password</label>
                 <input type="password" name="password" required minLength={6} className="w-full bg-background border border-gray-300 dark:border-gray-700 p-2.5 rounded text-sm text-text-main focus:border-primary outline-none" placeholder="******" />
              </div>
              <div>
                 <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Pilih Role</label>
                 <select name="role" className="w-full bg-background border border-gray-300 dark:border-gray-700 p-2.5 rounded text-sm text-text-main focus:border-primary outline-none">
                    <option value="kasir">Staff Kasir</option>
                    <option value="admin">Administrator</option>
                 </select>
              </div>

              <div className="pt-2">
                 <button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                 >
                   {isSubmitting ? "Menyimpan ke Database..." : "Simpan & Buat Akun"}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-surface border border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Nama/Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Tanggal Daftar</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-200/ dark:bg-gray-800/ transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 flex flex-shrink-0 items-center justify-center text-gray-600 dark:text-gray-400 font-medium">
                        {profile.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {profile.name || "Tanpa Nama"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-medium uppercase tracking-wider border",
                      profile.role === "admin" 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700"
                    )}>
                      {profile.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }) : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRoleChange(profile.id, profile.role)}
                      disabled={loadingId === profile.id}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded border transition-colors",
                        profile.role === "admin"
                          ? "text-gray-600 dark:text-gray-400 hover:text-text-main border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:bg-gray-800"
                          : "text-primary hover:text-white border-primary/30 hover:bg-primary"
                      )}
                    >
                      {loadingId === profile.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Ubah Role"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada data profile.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
