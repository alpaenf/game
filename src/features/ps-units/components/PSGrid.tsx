"use client";

import { usePSUnits } from "@/hooks/usePSUnits";
import { formatRupiah } from "@/lib/utils";
import { Play, Plus, Clock, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

import { startPSSession } from "@/features/ps-units/services/transactionService";
import { createQuickManualTransaction } from "@/features/ps-units/services/quickTransactionAction";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import PSTimer from "./PSTimer";
import { useRouter } from "next/navigation";

export default function PSGrid() {
  const { units, loading } = usePSUnits();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Custom Start Time State
  const [showTimeModal, setShowTimeModal] = useState<string | null>(null);
  const [customStartTime, setCustomStartTime] = useState<string>("");

  // Quick Manual Mode State
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [quickPsId, setQuickPsId] = useState<string>("");
  const [quickDuration, setQuickDuration] = useState<number>(60); // default 60 menit
  const [quickLoading, setQuickLoading] = useState(false);

  const router = useRouter();

  const handleStartSession = async (psId: string, customTime?: string) => {
    try {
      setActionLoading(psId);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      let finalTime = new Date().toISOString();
      if (customTime) {
        finalTime = new Date(customTime).toISOString();
      }

      await startPSSession(psId, user.id, finalTime);
      setShowTimeModal(null);
      setCustomStartTime(""); // reset
    } catch (error) {
      console.error("Gagal memulai sesi", error);
      alert("Terjadi kesalahan sistem saat memulai sesi PS.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickManualSubmit = async (asActive: boolean = false) => {
    if (!quickPsId || quickDuration <= 0) return alert("Pilih PS dan masukkan durasi yang valid!");
    
    setQuickLoading(true);
    const res = await createQuickManualTransaction(quickPsId, quickDuration, asActive);
    setQuickLoading(false);

    if (res.error) {
      alert("Gagal membuat struk manual: " + res.error);
    } else if (res.transactionId) {
      setShowQuickModal(false);
      if (asActive) {
        router.push(`/transaksi/${res.transactionId}`);
      } else {
        router.push(`/struk/${res.transactionId}`);
      }
    }
  };

  const handleViewTransaction = (txId: string) => {
    router.push(`/transaksi/${txId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-surface rounded-2xl border border-gray-800 border-dashed">
        <p className="text-gray-400">Belum ada unit PlayStation yang ditambahkan.</p>
        <p className="text-sm text-gray-500">Minta Admin untuk menambahkan di menu Pengaturan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Aksi Cepat (Khusus Lupa Start) */}
      <div className="flex justify-end">
        <button 
           onClick={() => setShowQuickModal(true)}
           className="flex items-center gap-2 bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-200 text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
        >
          <Zap className="w-4 h-4 text-yellow-500" />
          Buat Struk Cepat (Offline/Manual)
        </button>
      </div>

      {/* Quick Manual Modal */}
      {showQuickModal && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-gray-800 p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" /> Struk Instan
              </h3>
              <button onClick={() => setShowQuickModal(false)} className="text-gray-500 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mb-6">Gunakan fitur ini jika pelanggan sudah selesai main tetapi Anda <strong>lupa</strong> menekan tombol Start.</p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Pilih TV/PS (Khusus yang kosong)</label>
                <select 
                  value={quickPsId}
                  onChange={(e) => setQuickPsId(e.target.value)}
                  className="w-full bg-background border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="" disabled>-- Pilih Stasiun PS --</option>
                  {units.filter(u => u.status !== 'in_use').map(u => (
                    <option key={u.id} value={u.id}>{u.name} (Rp {u.hourly_rate.toLocaleString('id-ID')}/jam)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Durasi Permainan (Menit)</label>
                <div className="flex items-center gap-3">
                   <input 
                     type="number"
                     min="1"
                     value={quickDuration}
                     onChange={(e) => setQuickDuration(Number(e.target.value))}
                     className="w-full bg-background border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none focus:ring-1 focus:ring-primary"
                   />
                   <span className="text-sm text-gray-500">Menit</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 italic">*contoh: 2 jam = 120 menit</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleQuickManualSubmit(false)}
                disabled={quickLoading || !quickPsId}
                className="w-full py-3 text-sm text-black bg-white hover:bg-gray-200 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {quickLoading ? "Memproses..." : "Buat Struk & Selesai"}
              </button>
              <button 
                onClick={() => handleQuickManualSubmit(true)}
                disabled={quickLoading || !quickPsId}
                className="w-full py-3 text-sm text-primary border border-primary hover:bg-primary/10 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Lanjut Tambah Produk (F&B)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Modal */}
      {showTimeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-gray-800 p-6 rounded-xl w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Set Waktu Mulai</h3>
              <button onClick={() => setShowTimeModal(null)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">Kosongkan jika ingin menggunakan waktu saat ini secara otomatis.</p>
            <input 
              type="datetime-local"
              className="w-full bg-background border border-gray-700 rounded-md p-2 text-sm text-white focus:border-primary outline-none focus:ring-1 focus:ring-primary mb-6"
              value={customStartTime}
              onChange={(e) => setCustomStartTime(e.target.value)}
            />
            <div className="flex gap-3">
               <button 
                  onClick={() => setShowTimeModal(null)}
                  className="flex-1 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md border border-gray-700 transition-colors"
               >
                 Batal
               </button>
               <button 
                  onClick={() => handleStartSession(showTimeModal, customStartTime || undefined)}
                  className="flex-1 py-2 text-sm text-black bg-primary hover:bg-primary/90 font-medium rounded-md transition-colors"
               >
                 Mulai Sekarang
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {units.map((unit) => {
          const isActive = unit.status === "in_use";

          return (
            <div
              key={unit.id}
              className={cn(
                "bg-surface rounded-xl p-5 relative transition-all duration-200 border",
                isActive ? "border-primary/50" : "border-gray-800"
              )}
            >
            {/* Minimalist Top Indicator */}
            {isActive && (
              <div className="absolute top-0 left-0 w-full h-0.5 bg-primary rounded-t-xl opacity-80"></div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-100">{unit.name}</h3>
                  <span className="px-1.5 py-0.5 text-[10px] font-medium rounded border border-gray-700 text-gray-400">
                    {unit.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-mono">{formatRupiah(unit.hourly_rate)}/h</p>
              </div>

              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-wider font-semibold",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-gray-500 bg-gray-800/50"
                )}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                {isActive ? "In Use" : "Ready"}
              </div>
            </div>

            {/* Timer Area */}
            <div className="h-14 flex flex-col justify-center mb-6">
              {isActive && unit.active_transaction ? (
                <PSTimer 
                  startTime={unit.active_transaction.start_time} 
                  hourlyRate={unit.hourly_rate} 
                />
              ) : (
                <span className="text-sm text-gray-600">No active session</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex gap-2">
              {!isActive ? (
                <button
                  onClick={() => setShowTimeModal(unit.id)}
                  disabled={actionLoading === unit.id}
                  className="flex-1 py-2 text-sm font-medium rounded-md transition-all border disabled:opacity-50 disabled:cursor-not-allowed border-gray-700 text-gray-300 hover:bg-gray-100/5 hover:border-gray-500 flex justify-center items-center gap-2"
                >
                  {actionLoading === unit.id ? (
                      <span className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Start Session
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => unit.active_transaction && handleViewTransaction(unit.active_transaction.id)}
                    className="flex-1 py-2 text-sm font-medium rounded-md transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black flex justify-center items-center gap-2"
                  >
                    Manage
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}