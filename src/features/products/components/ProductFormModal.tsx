"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { addProduct, updateProduct } from "../services/productService";

interface ModalProps {
  product?: any;
  onClose: () => void;
}

export default function ProductFormModal({ product, onClose }: ModalProps) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product) {
        await updateProduct(product.id, name, Number(price), Number(stock));
      } else {
        await addProduct(name, Number(price), Number(stock));
      }
      onClose(); // Karena berlangganan supabase realtime, tabel akan update otomatis
    } catch (error) {
       console.error(error);
       alert("Gagal menyimpan data produk.");
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

        <h2 className="text-2xl font-bold text-text-main mb-6">
          {product ? "Edit Produk" : "Tambah Produk Baru"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nama Produk</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-gray-300 dark:border-gray-700 text-text-main rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="Misal: Teh Pucuk Harum"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Harga (Rp)</label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-background border border-gray-300 dark:border-gray-700 text-text-main rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="5000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Jumlah Stok / Pcs</label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full bg-background border border-gray-300 dark:border-gray-700 text-text-main rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              placeholder="100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Data Produk"}
          </button>
        </form>
      </div>
    </div>
  );
}
