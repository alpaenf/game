"use client";

import { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/utils";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { deleteProduct } from "../services/productService";
import ProductFormModal from "./ProductFormModal";

interface Props {
  userRole: string;
}

export default function ProductListClient({ userRole }: Props) {
  const { products, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);

  const isAdmin = userRole === "admin";

  const handleEdit = (product: any) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini secara permanen?")) {
      try {
        await deleteProduct(id);
      } catch (error) {
        alert("Gagal menghapus produk");
      }
    }
  };

  const filteredProducts = products.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">Inventaris Produk</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola daftar makanan, minuman, atau rokok yang dijual.</p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-green-500 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
          >
            <Plus className="w-5 h-5" /> Tambah Produk
          </button>
        )}
      </div>

      <div className="bg-surface border border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg">
        {/* Toolbar / Search */}
        <div className="p-4 border-b border-gray-300 dark:border-gray-800 flex justify-between items-center bg-gray-200 dark:bg-gray-900">
           <div className="relative w-full max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
             <input 
               type="text"
               placeholder="Cari nama produk..."
               className="w-full pl-10 pr-4 py-2 bg-background border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-text-main focus:ring-1 focus:ring-primary focus:border-primary outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-200 dark:border-gray-800 bg-gray-200/ dark:bg-gray-800/ text-gray-600 dark:text-gray-400 font-semibold">
              <tr>
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Harga Terkini</th>
                <th className="px-6 py-4">Sisa Stok</th>
                {isAdmin && <th className="px-6 py-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 italic">
                    {searchTerm ? "Pencarian tidak ditemukan." : "Belum ada produk yang ditambahkan."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-200/ dark:bg-gray-800/ transition-colors">
                    <td className="px-6 py-4 font-medium text-text-main">{product.name}</td>
                    <td className="px-6 py-4 text-secondary font-bold">{formatRupiah(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        product.stock > 10 ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        product.stock > 0 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {product.stock} pcs
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-text-main hover:bg-gray-300 dark:hover:bg-gray-200 dark:bg-gray-700 rounded-lg transition-colors"
                            title="Edit Produk"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && isAdmin && (
        <ProductFormModal 
          product={productToEdit} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
