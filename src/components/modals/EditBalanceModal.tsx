import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface EditBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditBalanceModal: React.FC<EditBalanceModalProps> = ({ isOpen, onClose }) => {
  const { totalBalance, addTransaction, showToast } = useApp();
  const [newBalanceInput, setNewBalanceInput] = useState<string>(
    totalBalance > 0 ? String(totalBalance) : ''
  );
  const [reason, setReason] = useState<string>('Penyesuaian Saldo Kas');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = parseFloat(newBalanceInput.replace(/[^0-9.-]+/g, ''));
    if (isNaN(cleanNum)) {
      showToast('Masukkan nominal saldo yang valid');
      return;
    }

    const difference = cleanNum - totalBalance;
    const today = new Date().toISOString().split('T')[0];

    if (difference > 0) {
      addTransaction({
        description: reason.trim() || 'Penyesuaian Saldo Kas (Pemasukan)',
        amount: difference,
        type: 'income',
        category: 'Lainnya',
        date: today
      });
      showToast(`Saldo berhasil diperbarui menjadi Rp ${new Intl.NumberFormat('id-ID').format(cleanNum)}`);
    } else if (difference < 0) {
      addTransaction({
        description: reason.trim() || 'Penyesuaian Saldo Kas (Pengeluaran)',
        amount: Math.abs(difference),
        type: 'expense',
        category: 'Lainnya',
        date: today
      });
      showToast(`Saldo berhasil disesuaikan menjadi Rp ${new Intl.NumberFormat('id-ID').format(cleanNum)}`);
    } else {
      showToast('Nominal saldo sama dengan saldo saat ini.');
    }

    onClose();
  };

  const handleQuickPreset = (val: number) => {
    setNewBalanceInput(String(val));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#142026] rounded-[28px] p-6 sm:p-8 shadow-2xl border border-[#d5e5ef] dark:border-[#28373f] relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3e6842]/10 dark:bg-[#8fbc8f]/20 text-[#3e6842] dark:text-[#8fbc8f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#0e1d25] dark:text-[#f1f5f9]">Ubah Saldo</h3>
              <p className="text-xs text-[#727970] dark:text-[#a0aec0]">Sesuaikan saldo kas riil Anda saat ini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#727970] hover:bg-slate-100 dark:hover:bg-[#1a282f] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Current Balance Display */}
        <div className="mb-5 p-3.5 bg-[#f4faff] dark:bg-[#162228] rounded-2xl border border-[#d5e5ef] dark:border-[#28373f]">
          <span className="text-[11px] text-[#727970] dark:text-[#a0aec0] font-semibold block mb-0.5">Saldo Tercatat Saat Ini:</span>
          <span className="text-base font-bold text-[#0e1d25] dark:text-[#f1f5f9]">
            Rp {new Intl.NumberFormat('id-ID').format(totalBalance)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0e1d25] dark:text-[#f1f5f9] mb-1.5">
              Saldo Baru Yang Diinginkan (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm text-[#3e6842] dark:text-[#8fbc8f]">
                Rp
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                required
                placeholder="Contoh: 24500000"
                value={newBalanceInput}
                onChange={(e) => setNewBalanceInput(e.target.value)}
                className="w-full bg-[#f8fafc] dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-[#0e1d25] dark:text-[#f1f5f9] focus:border-[#3e6842] focus:ring-1 focus:ring-[#3e6842] outline-none transition-all"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-semibold text-[#727970] dark:text-[#a0aec0] block mb-1.5">
              Pilihan Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[5000000, 10000000, 24500000, 50000000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleQuickPreset(val)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1a282f] hover:bg-[#3e6842]/10 hover:text-[#3e6842] dark:hover:text-[#8fbc8f] text-[11px] font-semibold text-[#424940] dark:text-[#a0aec0] transition-colors cursor-pointer"
                >
                  {val >= 1000000 ? `${val / 1000000} Juta` : `${val / 1000} rb`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0e1d25] dark:text-[#f1f5f9] mb-1.5">
              Keterangan Penyesuaian
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Penyesuaian Saldo Awal Kas"
              className="w-full bg-[#f8fafc] dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] rounded-xl px-4 py-2.5 text-xs text-[#0e1d25] dark:text-[#f1f5f9] focus:border-[#3e6842] focus:ring-1 focus:ring-[#3e6842] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 dark:bg-[#1a282f] text-[#424940] dark:text-[#a0aec0] font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-[#22353e] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#3e6842] hover:bg-[#3e6842]/90 text-white font-bold text-xs rounded-xl shadow-md shadow-[#3e6842]/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Simpan Saldo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
