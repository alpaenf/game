"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PSUnit, Transaction } from "@/types";

export type PSUnitWithActiveSession = PSUnit & {
  active_transaction: Transaction | null;
};

export function usePSUnits() {
  const [units, setUnits] = useState<PSUnitWithActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchUnits();

    // Subscribe to multiple channels for realtime reactive UI
    const psChannel = supabase
      .channel("realtime_ps_units")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ps_units" },
        () => fetchUnits()
      )
      .subscribe();
      
    const txChannel = supabase
      .channel("realtime_transactions")
      .on(
        "postgres_changes",
         { event: "*", schema: "public", table: "transactions" },
        () => fetchUnits()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(psChannel);
      supabase.removeChannel(txChannel);
    };
  }, []);

  const fetchUnits = async () => {
    // We want to fetch units AND any active transaction they are currently running
    const { data: psData, error: psError } = await supabase
      .from("ps_units")
      .select("*")
      .order("name", { ascending: true });

    if (psError) {
      console.error(psError);
      return;
    }

    // Now fetch active transactions
    const { data: txData, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("status", "active");

    if (txError) {
      console.error(txError);
    }

    const unitsWithSessions: PSUnitWithActiveSession[] = (psData as PSUnit[]).map((unit) => {
      const activeTx = txData?.find((tx) => tx.ps_id === unit.id) || null;
      return {
        ...unit,
        active_transaction: activeTx as Transaction | null,
      };
    });

    setUnits(unitsWithSessions);
    setLoading(false);
  };

  return { units, loading };
}