import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const AddSavingsModal: React.FC = () => {
  const { 
    isAddSavingsOpen, 
    setIsAddSavingsOpen, 
    selectedSavingsGoalId, 
    goals, 
    addSavingsToGoal 
  } = useApp();

  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [amount, setAmount] = useState<number>(1500000);

  useEffect(() => {
    if (selectedSavingsGoalId) {
      setSelectedGoalId(selectedSavingsGoalId);
    } else if (goals.length > 0) {
      setSelectedGoalId(goals[0].id);
    }
  }, [selectedSavingsGoalId, goals]);

  if (!isAddSavingsOpen) return null;

  const handleQuickAdd = (addVal: number) => {
    setAmount(prev => prev + addVal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || amount <= 0) return;
    addSavingsToGoal(selectedGoalId, amount);
    setIsAddSavingsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FAF8F5] rounded-[24px] shadow-[0px_20px_50px_rgba(0,0,0,0.1)] border border-[#e1dfdc] overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-3 flex justify-between items-center border-b border-[#e1dfdc]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8fbc8f]/20 flex items-center justify-center text-[#3e6842]">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                savings
              </span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#0e1d25]">Tambah Tabungan</h3>
              <p className="text-xs text-[#424940]">Langkah kecil menuju impian besar.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddSavingsOpen(false)}
            className="p-2 hover:bg-[#e1dfdc]/50 rounded-full transition-colors text-[#424940]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Goal Selector */}
          <div>
            <label className="block text-sm font-semibold text-[#0e1d25] mb-2">
              Pilih Tujuan Tabungan
            </label>
            <div className="relative">
              <select
                value={selectedGoalId}
                onChange={e => setSelectedGoalId(e.target.value)}
                className="w-full p-4 bg-[#f4faff] rounded-xl border-none ring-1 ring-[#c2c9be] focus:ring-2 focus:ring-[#3e6842] appearance-none text-[#0e1d25] font-medium cursor-pointer"
              >
                {goals.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.targetDescription})
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#424940]">
                expand_more
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-[#0e1d25] mb-2">
              Jumlah Tabungan
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#424940]">Rp</span>
              <input
                type="text"
                value={new Intl.NumberFormat('id-ID').format(amount)}
                onChange={e => {
                  const val = parseFloat(e.target.value.replace(/[^0-9]/g, '')) || 0;
                  setAmount(val);
                }}
                className="w-full pl-12 p-4 rounded-xl border-none ring-1 ring-[#c2c9be] focus:ring-2 focus:ring-[#3e6842] text-2xl font-bold text-[#0e1d25] bg-[#d5e5ef]"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => handleQuickAdd(100000)}
                className="px-3.5 py-1.5 rounded-lg bg-[#e1dfdc] text-[#636361] text-xs font-semibold hover:bg-[#8fbc8f]/20 transition-colors"
              >
                + 100rb
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(500000)}
                className="px-3.5 py-1.5 rounded-lg bg-[#e1dfdc] text-[#636361] text-xs font-semibold hover:bg-[#8fbc8f]/20 transition-colors"
              >
                + 500rb
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(1000000)}
                className="px-3.5 py-1.5 rounded-lg bg-[#e1dfdc] text-[#636361] text-xs font-semibold hover:bg-[#8fbc8f]/20 transition-colors"
              >
                + 1jt
              </button>
            </div>
          </div>

          {/* Source Account */}
          <div>
            <label className="block text-sm font-semibold text-[#0e1d25] mb-2">
              Sumber Dana
            </label>
            <div className="flex items-center gap-3 p-4 bg-[#d5e5ef]/60 rounded-xl ring-1 ring-[#c2c9be]">
              <div className="w-10 h-6 bg-[#3e6842] rounded shadow-xs shrink-0 flex items-center justify-center text-white text-[10px] font-bold">
                BCA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0e1d25]">Rekening Utama (BCA)</p>
                <p className="text-[11px] text-[#424940]">Saldo: Rp 12.400.000</p>
              </div>
              <span className="material-symbols-outlined text-[#3e6842]">check_circle</span>
            </div>
          </div>

          {/* Quote */}
          <div className="p-4 rounded-xl bg-[#8fbc8f]/10 border border-[#8fbc8f]/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-[#3e6842] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            <p className="text-xs text-[#234c29] italic leading-relaxed">
              "Setiap rupiah yang kamu simpan hari ini adalah benih ketenangan untuk masa depanmu."
            </p>
          </div>

          {/* Footer */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setIsAddSavingsOpen(false)}
              className="flex-1 py-3.5 px-4 rounded-xl border border-[#3e6842] text-[#3e6842] font-bold text-sm hover:bg-[#3e6842]/5 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] py-3.5 px-4 rounded-xl bg-[#3e6842] text-white font-bold text-sm shadow-lg shadow-[#3e6842]/20 hover:bg-[#3e6842]/90 active:scale-98 transition-all"
            >
              Konfirmasi Tabungan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
