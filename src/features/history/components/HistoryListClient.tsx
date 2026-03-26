"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Search, Calendar, FileText, TrendingUp, MonitorPlay, Coffee, Trash2 } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { useRouter } from "next/navigation";
import { deleteTransactionAction } from "../services/deleteHistoryAction";

export default function HistoryListClient({ userRole = "admin" }: { userRole?: string }) {
  const todayRaw = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const [dateFilter, setDateFilter] = useState<string>(todayRaw);
  const { data, loading, summary } = useHistory(dateFilter);
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (txId: string) => {
    if (!window.confirm("Yakin ingin menghapus riwayat transaksi ini seutuhnya dari sistem? Aksi ini tidak dapat dibatalkan!")) return;
    
    setDeletingId(txId);
    const res = await deleteTransactionAction(txId);
    setDeletingId(null);
    
    if (res.error) {
      alert("Gagal menghapus: " + res.error);
    } else {
      // Reload page to fetch new records
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">Riwayat & Laporan</h1>
          <p className="text-gray-600 dark:text-gray-400">Pantau transaksi dan rekap pendapatan harian outlet.</p>
        </div>

        {/* Filter Tanggal */}
        <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-gray-200 dark:border-gray-200 dark:border-gray-800">
           <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 ml-2" />
           <select 
             value={dateFilter} 
             onChange={(e) => setDateFilter(e.target.value)}
             className="bg-transparent text-text-main border-none focus:ring-0 outline-none pr-4 py-1"
           >
             <option value={todayRaw}>Hari Ini ({format(new Date(), "dd MMM")})</option>
             <option value="all">Semua Waktu (500 Terakhir)</option>
             {/* Jika Anda butuh custom date picker, ganti select dengan input type="date" */}
             {dateFilter !== "all" && dateFilter !== todayRaw && (
                <option value={dateFilter}>{dateFilter}</option>
             )}
           </select>
           {/* Fallback ke custom input jika mau fleksibel */}
           <input 
             type="date" 
             title="Pilih tanggal spesifik"
             value={dateFilter === "all" ? "" : dateFilter}
             onChange={(e) => setDateFilter(e.target.value)}
             className="bg-transparent text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded p-1 text-sm outline-none focus:border-primary w-8 h-8 cursor-pointer"
             // Sembunyikan text bawaannya memakai css trik atau biarkan sbg icon
           />
        </div>
      </div>

      {/* Rangkuman (Dashboard Mini Kas) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                <TrendingUp className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Omset</p>
                <h3 className="text-2xl font-bold text-text-main">{formatRupiah(summary.totalOmset, true)}</h3>
            </div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                <MonitorPlay className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Biaya Rental PS</p>
                <h3 className="text-xl font-bold text-text-main">{formatRupiah(summary.totalPSTotal, true)}</h3>
            </div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                <Coffee className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Snack & Makanan</p>
                <h3 className="text-xl font-bold text-text-main">{formatRupiah(summary.totalItemsTotal, true)}</h3>
            </div>
        </div>
        <div className="bg-surface p-5 rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-gray-800 flex items-center gap-4">
           <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <FileText className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Transaksi Lunas</p>
                <h3 className="text-2xl font-bold text-text-main">{summary.totalTransactions} / Sesi</h3>
            </div>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="bg-surface border border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-200 dark:border-gray-800 bg-gray-200/ dark:bg-gray-800/ text-gray-600 dark:text-gray-400 font-semibold">
              <tr>
                <th className="px-6 py-4">Waktu Mulai</th>
                <th className="px-6 py-4">Nama PS</th>
                <th className="px-6 py-4">Kasir</th>
                <th className="px-6 py-4">Rental</th>
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4">Total Akhir</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                   <td colSpan={8} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    Mencari riwayat...
                   </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                   <td colSpan={8} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 italic">
                    Belum ada riwayat transaksi pada tanggal ini.
                   </td>
                </tr>
              ) : (
                data.map((tx: any) => {
                  const psUnit = Array.isArray(tx.ps_units) ? tx.ps_units[0] : tx.ps_units;
                  const profile = Array.isArray(tx.profiles) ? tx.profiles[0] : tx.profiles;
                  
                  return (
                    <tr key={tx.id} className="hover:bg-gray-200/ dark:bg-gray-800/ transition-colors">
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {format(new Date(tx.start_time), "dd MMM, HH:mm", { locale: localeId })}
                      </td>
                      <td className="px-6 py-4 font-bold text-text-main">
                        {psUnit?.name || "TBD"} <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({psUnit?.type})</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {profile?.name || "Sistem"}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatRupiah(tx.ps_total || 0)}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatRupiah(tx.items_total || 0)}</td>
                      <td className="px-6 py-4 font-black text-secondary">{formatRupiah(tx.total_price || 0)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                           tx.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                           tx.status === 'active' ? 'bg-primary/10 text-primary border border-primary/20 animate-pulse' :
                           'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex gap-2 justify-center">
                           <button 
                              onClick={() => router.push(`/struk/${tx.id}`)}
                              className="text-xs px-3 py-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-200 dark:bg-gray-700 text-text-main rounded-md transition-colors"
                           >
                             Lihat Struk
                           </button>
                           {userRole === "admin" && (
                             <button
                               onClick={() => handleDelete(tx.id)}
                               disabled={deletingId === tx.id}
                               className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md transition-colors border border-red-500/20 disabled:opacity-50"
                               title="Hapus Transaksi"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           )}
                         </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
