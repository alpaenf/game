"use client";

import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { Clock, Plus, Trash2, CheckCircle2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActiveTransactionTimer } from "@/hooks/useActiveTransactionTimer";
import { calculateCurrentPSBill } from "@/lib/billing";
import { getTransactionDetail, getAvailableProducts, addTransactionItem, removeItem } from "../services/transactionDetailService";
import { finishTransaction } from "../services/finishTransactionAction";
import AddProductModal from "./AddProductModal";

export default function TransactionDetailClient({ txId }: { txId: string }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Realtime Timer for UI Cost
  const [currentPSBill, setCurrentPSBill] = useState(0);

  const fetchDetail = async () => {
    try {
      const tx = await getTransactionDetail(txId);
      setData(tx);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil detail transaksi");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [txId]);

  // Hook Timer Active Sesi
  const { formattedTimer, elapsedSeconds } = useActiveTransactionTimer(
    data?.status === "active" ? data.start_time : null
  );

  useEffect(() => {
    if (data?.status === "active" && data?.ps_units) {
      const psUnit = Array.isArray(data.ps_units) ? data.ps_units[0] : data.ps_units;
      const updateCost = async () => {
        const cost = await calculateCurrentPSBill(data.start_time, psUnit.hourly_rate);
        setCurrentPSBill(cost);
      };
      updateCost();
    }
  }, [data, elapsedSeconds]); // Every second roughly updates cost but we can throttle if needed.

  if (loading) return <div className="p-10 text-center animate-pulse text-text-main">Memuat...</div>;
  if (!data) return null;

  const psUnit = Array.isArray(data.ps_units) ? data.ps_units[0] : data.ps_units;
  const isCompleted = data.status === "completed";
  
  // Subtotal items sum
  const itemsTotal = data.transaction_items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
  const totalCost = isCompleted ? data.total_price : (currentPSBill + itemsTotal);
  const billingPSFinal = isCompleted ? data.ps_total : currentPSBill;

  const handleFinishSession = async () => {
    const confirm = window.confirm("Akhiri sesi dan lock tagihan ini?");
    if (!confirm) return;

    setIsFinishing(true);
    const res = await finishTransaction(txId);
    
    if (res.error) {
      alert("Error: " + res.error);
      setIsFinishing(false);
    } else {
      // Beralih ke halaman struk
      router.push(`/struk/${txId}`);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
      try {
          await removeItem(itemId);
          fetchDetail(); // Refresh data
      } catch (error) {
          alert("Gagal menghapus item");
      }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-text-main transition-colors"
      >
        <ChevronLeft className="w-5 h-5" /> Kembali
      </button>

      {/* HEADER CARD */}
      <div className="bg-surface border border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{psUnit.name}</h1>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded text-[10px] font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              {psUnit.type}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${isCompleted ? 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700' : 'bg-primary/10 text-primary border-primary/20'}`}>
              {isCompleted ? "SELESAI" : "BERJALAN"}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">Tarif: {formatRupiah(psUnit.hourly_rate)}/h</p>
        </div>

        <div className="text-left md:text-right w-full md:w-auto">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-widest">Total Tagihan Sementara</p>
          <div className="text-3xl font-mono text-gray-900 dark:text-gray-100 font-medium">{formatRupiah(totalCost)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TIMER SECTION */}
        <div className="bg-surface rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-gray-800 shadow-lg flex flex-col items-center justify-center min-h-[250px]">
           <Clock className={`w-12 h-12 mb-4 ${isCompleted ? 'text-green-500' : 'text-secondary animate-pulse'}`} />
           <div className="text-5xl font-mono tracking-wider font-bold text-text-main mb-4">
              {isCompleted ? "DONE" : formattedTimer}
           </div>
           <div className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              Biaya PS: <span className="text-green-400">{formatRupiah(billingPSFinal)}</span>
           </div>
        </div>

        {/* ITEMS SECTION */}
        <div className="bg-surface rounded-2xl p-6 border border-gray-200 dark:border-gray-200 dark:border-gray-800 shadow-lg flex flex-col max-h-[400px]">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-text-main">Tambahan Produk</h3>
            {!isCompleted && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-500 transition-colors"
               >
                <Plus className="w-4 h-4" /> Tambah
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {data.transaction_items.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-10 italic">Belum ada pesanan produk.</div>
            ) : (
              data.transaction_items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center bg-background p-3 rounded-lg border border-gray-200 dark:border-gray-200 dark:border-gray-800">
                  <div>
                    <div className="font-semibold text-text-main">{item.product_name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {item.qty} x {formatRupiah(item.price)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-secondary">{formatRupiah(item.subtotal)}</span>
                    {!isCompleted && (
                       <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-400 p-1 bg-red-500/10 rounded">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-200 dark:border-gray-800 flex justify-between font-bold">
            <span className="text-gray-600 dark:text-gray-400">Subtotal Produk</span>
            <span className="text-text-main">{formatRupiah(itemsTotal)}</span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      {!isCompleted && (
        <div className="flex justify-end pt-4">
          <button
            onClick={handleFinishSession}
            disabled={isFinishing}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50"
          >
            {isFinishing ? (
               <span className="animate-spin h-6 w-6 border-2 border-black border-t-transparent rounded-full" />
            ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  Selesaikan Sesi & Tagihan
                </>
            )}
          </button>
        </div>
      )}

      {isModalOpen && (
        <AddProductModal 
          txId={txId} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchDetail();
          }} 
        />
      )}
    </div>
  );
}
