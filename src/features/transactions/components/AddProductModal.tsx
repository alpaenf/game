"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { getAvailableProducts, addTransactionItem } from "../services/transactionDetailService";

interface ModalProps {
  txId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductModal({ txId, onClose, onSuccess }: ModalProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAvailableProducts();
        setProducts(data);
        if (data.length > 0) {
          setSelectedProduct(data[0].id);
        }
      } catch (error) {
        console.error("Gagal load produk", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || qty < 1) return;

    setLoading(true);
    try {
      const product = products.find((p) => p.id === selectedProduct);
      if (!product) throw new Error("Produk tidak ditemukan");

      if (qty > product.stock) {
          alert(`Stok tidak cukup! Sisa stok: ${product.stock}`);
          setLoading(false);
          return;
      }

      await addTransactionItem(
        txId,
        product.id,
        product.name, // snapshot name
        product.price, // snapshot price
        qty
      );
      
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menambahkan produk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-text-main transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-text-main mb-6">Tambah Tambahan Produk</h2>

        {products.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
             Tidak ada produk tersedia / stok habis.<br/>
             <span className="text-sm">Minta admin mengecek master produk.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Pilih Produk
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-background border border-gray-300 dark:border-gray-700 text-text-main rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {formatRupiah(p.price)} (Sisa: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Kuantitas (Qty)
              </label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full bg-background border border-gray-300 dark:border-gray-700 text-text-main rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-500 transition-colors disabled:opacity-50"
            >
              {loading ? "Menambahkan..." : "Tambahkan ke Tagihan"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
