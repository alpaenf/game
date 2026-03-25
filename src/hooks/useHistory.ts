"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useHistory(dateFilter: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalOmset: 0,
    totalPSTotal: 0,
    totalItemsTotal: 0,
    totalTransactions: 0
  });

  const supabase = createClient();

  useEffect(() => {
    fetchHistory();
  }, [dateFilter]); // Refetch if date filter changes

  const fetchHistory = async () => {
    setLoading(true);

    let query = supabase
      .from("transactions")
      .select(`
        *,
        ps_units:ps_id (name, type),
        profiles:cashier_id (name)
      `)
      .order("created_at", { ascending: false });

    // Terapkan filter tanggal jika tidak "all"
    if (dateFilter !== "all") {
        // Asumsi format dateFilter "YYYY-MM-DD"
        const startOfDay = `${dateFilter}T00:00:00.000Z`;
        const endOfDay = `${dateFilter}T23:59:59.999Z`;
        query = query.gte("created_at", startOfDay).lte("created_at", endOfDay);
    } else {
        // Optimalisasi: Jangan ambil semua di alam semesta. 
        // default limit misal 500 transaksi paling baru kl "all"
        query = query.limit(500);
    }

    const { data: tx, error } = await query;

    if (!error && tx) {
      setData(tx);
      
      // Calculate Summaries specifically only for "completed" transactions 
      // (ignoring cancelled / active but we show active in list usually? History mostly for completed ones)
      // Usually it's better to show only completed in history, but we fetch all to let admin see.
      
      const completedTx = tx.filter(t => t.status === 'completed');
      
      const omset = completedTx.reduce((acc, t) => acc + (t.total_price || 0), 0);
      const psTotal = completedTx.reduce((acc, t) => acc + (t.ps_total || 0), 0);
      const itemsTotal = completedTx.reduce((acc, t) => acc + (t.items_total || 0), 0);
      
      setSummary({
          totalOmset: omset,
          totalPSTotal: psTotal,
          totalItemsTotal: itemsTotal,
          totalTransactions: completedTx.length
      });
    } else {
        console.error(error);
    }
    
    setLoading(false);
  };

  return { data, loading, summary };
}