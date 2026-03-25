"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNowStrict, differenceInSeconds } from "date-fns";
import { id } from "date-fns/locale";

export function formatTimeElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  const pad = (num: number) => num.toString().padStart(2, "0");
  
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function useActiveTransactionTimer(startTime: string | null) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startTime) {
      setElapsedSeconds(0);
      return;
    }

    const start = new Date(startTime);

    const updateTimer = () => {
      const diff = differenceInSeconds(new Date(), start);
      setElapsedSeconds(diff >= 0 ? diff : 0);
    };

    // Panggil langsung untuk menginisiasi
    updateTimer();

    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [startTime]);

  return {
    elapsedSeconds,
    formattedTimer: formatTimeElapsed(elapsedSeconds),
  };
}
