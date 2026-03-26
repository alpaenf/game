"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { usePSUnits } from "@/hooks/usePSUnits";
import { updatePSUnit, createPSUnit, deletePSUnit } from "@/features/ps-units/services/psUnitAction";
import { Edit2, Plus, Trash2, X, Save } from "lucide-react";

export default function PSUnitSettings() {
  const { units, loading } = usePSUnits();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("PS3"); // default
  const [hourlyRate, setHourlyRate] = useState<number>(0);

  const openForm = (unit?: any) => {
    if (unit) {
      setEditData(unit);
      setName(unit.name);
      setType(unit.type);
      setHourlyRate(unit.hourly_rate);
    } else {
      setEditData(null);
      setName("");
      setType("PS3");
      setHourlyRate(5000);
    }
    setIsEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editData) {
        await updatePSUnit(editData.id, name, type, Number(hourlyRate));
      } else {
        await createPSUnit(name, type, Number(hourlyRate));
      }
      setIsEditModalOpen(false);
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus unit/mesin ini?")) {
      try {
        await deletePSUnit(id);
      } catch (error: any) {
        alert(error.message || "Gagal menghapus mesin.");
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-sm text-gray-600 dark:text-gray-400">Loading data mesin...</div>;
  }

  return (
    <>
      <div className="p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Kelola daftar TV / Konsol dan sesuaikan tarif per jam spesifik untuk tiap mesin.
        </p>

        <div className="space-y-3 mb-6">
          {units.map((unit) => (
            <div key={unit.id} className="flex justify-between items-center bg-background p-4 rounded-xl border border-gray-200 dark:border-gray-200 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                   <h3 className="font-bold text-text-main">{unit.name}</h3>
                   <span className="px-1.5 py-0.5 text-[10px] font-medium rounded border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                      {unit.type}
                   </span>
                </div>
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">{unit.status === 'in_use' ? 'Sedang Dipakai' : 'Idle'}</p> */}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-gray-700 dark:text-gray-300 font-mono text-sm">{formatRupiah(unit.hourly_rate)} / Jam</div>
                <div className="flex gap-2">
                   <button onClick={() => openForm(unit)} className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-text-main bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-200 dark:bg-gray-700 rounded transition-colors">
                      <Edit2 className="w-4 h-4" />
                   </button>
                   <button onClick={() => handleDelete(unit.id)} className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}
          {units.length === 0 && (
             <div className="text-center py-6 border border-dashed border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 dark:text-gray-400 text-sm">
                Belum ada mesin PlayStation yang ditambahkan.
             </div>
          )}
        </div>
        
        <button 
          onClick={() => openForm()}
          className="w-full py-2.5 bg-gray-200 dark:bg-gray-800 text-text-main font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-200 dark:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-700 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Unit / Mesin Baru
        </button>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface border border-gray-200 dark:border-gray-200 dark:border-gray-800 p-6 rounded-2xl w-full max-w-sm shadow-xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text-main">
                   {editData ? "Edit Mesin" : "Tambah Mesin Baru"}
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-600 dark:text-gray-400 hover:text-text-main">
                   <X className="w-5 h-5" />
                </button>
             </div>
             
             <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Nama Mesin / TV</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: TV 1"
                    className="w-full bg-background border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm text-text-main focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Tipe Konsol</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-background border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm text-text-main focus:border-primary outline-none"
                  >
                     <option value="PS3">PS3</option>
                     <option value="PS4">PS4</option>
                     <option value="PS5">PS5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Tarif per Jam (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full bg-background border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-sm text-text-main focus:border-primary outline-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full mt-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-green-500 transition-colors flex justify-center items-center gap-2"
                >
                  {formLoading ? "Menyimpan..." : (
                    <>
                      <Save className="w-4 h-4" /> Simpan Mesin
                    </>
                  )}
                </button>
             </form>
          </div>
        </div>
      )}
    </>
  );
}
