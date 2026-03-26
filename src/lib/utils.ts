import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Rupiah formatter with compact option (e.g. 3B instead of 3.000.000.000, 1.5M instead of 1.500.000)
export const formatRupiah = (amount: number, compact: boolean = false) => {
  if (compact) {
    if (amount >= 1e9) {
      return `Rp ${(amount / 1e9).toFixed(1).replace(/\.0$/, '')} Milyar`;
    }
    if (amount >= 1e6) {
      return `Rp ${(amount / 1e6).toFixed(1).replace(/\.0$/, '')} Juta`;
    }
    if (amount >= 1e3) {
      return `Rp ${(amount / 1e3).toFixed(1).replace(/\.0$/, '')} Ribu`;
    }
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
