"use client";

import { useEffect } from "react";
import { formatRupiah } from "@/lib/utils";
import { format, differenceInSeconds } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface PrintReceiptClientProps {
  transaction: any;
}

export default function PrintReceiptClient({ transaction }: PrintReceiptClientProps) {
  useEffect(() => {
    // Memberikan jeda sebentar agar DOM benar-benar siap dirender sebelum memanggil print
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const {
    start_time,
    end_time,
    ps_units,
    transaction_items,
    ps_total,
    items_total,
    total_price,
    status
  } = transaction;

  const unit = Array.isArray(ps_units) ? ps_units[0] : ps_units;
  
  // Format Tanggal
  const dateFormatted = format(new Date(start_time), "dd MMM yyyy HH:mm", { locale: localeId });
  const endTimeFormatted = end_time ? format(new Date(end_time), "HH:mm", { locale: localeId }) : "-";
  
  // Hitung durasi (dalam detik, untuk dicetak sebagai HH:mm:ss)
  let durationFormatted = "-";
  if (start_time && end_time) {
    const diff = differenceInSeconds(new Date(end_time), new Date(start_time));
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    const pad = (num: number) => num.toString().padStart(2, "0");
    durationFormatted = `${pad(h)}:${pad(m)}}:${pad(s)}`;
  }

  return (
    <div className="bg-white min-h-screen text-black font-mono w-full flex justify-center p-4">
      {/* Container ini meniru lebar kertas thermal (sekitar 80mm / 58mm) */}
      <div className="w-[300px] bg-white text-black print:w-full print:m-0 print:p-0">
        
        {/* Header Usaha */}
        <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
          <h1 className="text-2xl font-black uppercase tracking-wider mb-1">ALFAEN GAME</h1>
          <p className="text-xs">Rental PlayStation Modern</p>
          <p className="text-[10px] mt-1">Jl. Contoh Alamat No. 123</p>
        </div>

        {/* Informasi Transaksi */}
        <div className="text-xs mb-4 space-y-1">
          <div className="flex justify-between">
            <span>Tgl:</span>
            <span>{dateFormatted}</span>
          </div>
          <div className="flex justify-between">
            <span>Kasir:</span>
            {/* Pada prakteknya ambil dari cashier_id relasi. Disini kita dummy kan */}
            <span>Admin</span> 
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="uppercase font-bold">{status}</span>
          </div>
        </div>

        {/* Detail PS */}
        <div className="border-b border-black pb-3 mb-3 text-xs">
          <div className="font-bold mb-1">Rental PS ({unit.name} - {unit.type})</div>
          <div className="flex justify-between mb-1">
            <span>Mulai - Selesai:</span>
            <span>{format(new Date(start_time), "HH:mm")} - {endTimeFormatted}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Durasi:</span>
            <span>{durationFormatted}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Tarif:</span>
            <span>{formatRupiah(unit.hourly_rate)} / jam</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Total PS:</span>
            <span>{formatRupiah(ps_total)}</span>
          </div>
        </div>

        {/* Makanan / Minuman jika ada */}
        {transaction_items && transaction_items.length > 0 && (
          <div className="border-b border-black pb-3 mb-3 text-xs">
            <div className="font-bold mb-1">Produk & Snack:</div>
            {transaction_items.map((item: any) => (
              <div key={item.id} className="mb-1">
                <div className="truncate">{item.product_name}</div>
                <div className="flex justify-between">
                  <span>{item.qty} x {formatRupiah(item.price)}</span>
                  <span>{formatRupiah(item.subtotal)}</span>
                </div>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2">
              <span>Total Produk:</span>
              <span>{formatRupiah(items_total)}</span>
            </div>
          </div>
        )}

        {/* Grand Total */}
        <div className="text-sm mt-4 text-right mb-6">
          <div className="flex justify-between font-black text-lg border-y-2 border-black py-1">
            <span>TOTAL:</span>
            <span>{formatRupiah(total_price)}</span>
          </div>
        </div>

        <div className="text-center text-[10px]">
          <p>Terima kasih telah bermain di AlfaenGame!</p>
          <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
        </div>
      </div>
      
      {/* Tombol menu melayang yang akan disembunyikan saat dicetak (CSS print) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          body, html { background-color: white !important; -webkit-print-color-adjust: exact; }
          /* Menghilangkan header/footer default browser pada cetakan */
          @page { margin: 0; }
        }
      `}} />

      <div className="fixed top-4 left-4 no-print">
         <button 
           onClick={() => window.location.href = '/dashboard'}
           className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition"
         >
           Kembali ke Dashboard
         </button>
      </div>

       <div className="fixed top-4 right-4 no-print flex flex-col gap-2">
         <button 
           onClick={() => {
              const itemsText = transaction_items?.length > 0 
                ? `\n*Produk Tambahan:*\n` + transaction_items.map((i: any) => `- ${i.product_name} (${i.qty} x ${formatRupiah(i.price)}): ${formatRupiah(i.subtotal)}`).join('\n')
                : '';
                
              const waText = 
`*ALFAEN GAME*
Rental PlayStation Modern

Tgl: ${dateFormatted}
Unit: ${unit.name} (${unit.type})
Durasi: ${durationFormatted}
Mulai: ${format(new Date(start_time), "HH:mm")}
Selesai: ${endTimeFormatted}

Biaya PS: ${formatRupiah(ps_total)}${itemsText}

*TOTAL TAGIHAN: ${formatRupiah(total_price)}*

Terima kasih telah bermain di tempat kami!`;
              
              const encodedText = encodeURIComponent(waText);
              window.open(`https://wa.me/?text=${encodedText}`, '_blank');
           }}
           className="px-4 py-2 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold rounded-lg shadow-lg hover:bg-[#20b858] transition"
         >
           Kirim ke WA
         </button>

         <button 
           onClick={() => window.print()}
           className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-500 transition"
         >
           Cetak Ulang
         </button>
      </div>
    </div>
  );
}