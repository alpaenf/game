"use client";

import { Clock } from "lucide-react";
import { useActiveTransactionTimer } from "@/hooks/useActiveTransactionTimer";
import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { calculateCurrentPSBill } from "@/lib/billing";

export default function PSTimer({ 
  startTime, 
  hourlyRate 
}: { 
  startTime: string,
  hourlyRate: number
}) {
  const { formattedTimer, elapsedSeconds } = useActiveTransactionTimer(startTime);
  const [currentBill, setCurrentBill] = useState(0);

  useEffect(() => {
    // Calculate bill locally for UI. Real validation must be in server/Supabase
    const bill = async () => {
      const b = await calculateCurrentPSBill(startTime, hourlyRate);
      setCurrentBill(b);
    };
    bill();
    
    // Update bill every minute (or roughly sync with interval)
    const interval = setInterval(bill, 60000); 
    return () => clearInterval(interval);
  }, [startTime, elapsedSeconds, hourlyRate]); // recalculate when seconds hit a minute threshold

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-5 h-5 text-secondary" />
        <span className="text-3xl font-mono text-secondary tracking-wider font-bold">
          {formattedTimer}
        </span>
      </div>
      <div className="text-sm font-semibold text-green-400">
        PS: {formatRupiah(currentBill)}
      </div>
    </>
  );
}