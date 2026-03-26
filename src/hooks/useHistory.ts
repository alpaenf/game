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

    // Terapkan filter tanggal spesifik atau rentang bulanan
    if (dateFilter !== "all") {
        if (dateFilter.length === 7) { 
            // Format YYYY-MM (Filter Bulanan)
            const year = parseInt(dateFilter.split('-')[0]);
            const month = parseInt(dateFilter.split('-')[1]) - 1; // bulan di JS (0-11)
            const startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
            // Tambahkan 1 bulan untuk dapat tgl awal bulan berikutnya
            const endDate = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));

            query = query
                .gte("created_at", startDate.toISOString())
                .lt("created_at", endDate.toISOString());
        } else if (dateFilter.length === 4) {
            // Format YYYY (Filter Tahunan)
            const year = parseInt(dateFilter);
            const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
            const endDate = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0));

            query = query
                .gte("created_at", startDate.toISOString())
                .lt("created_at", endDate.toISOString());
        } else {
            // Asumsi format "YYYY-MM-DD" (Harian standar)
            const startOfDay = `${dateFilter}T00:00:00.000Z`;
            const endOfDay = `${dateFilter}T23:59:59.999Z`;
            query = query.gte("created_at", startOfDay).lte("created_at", endOfDay);
        }
      
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