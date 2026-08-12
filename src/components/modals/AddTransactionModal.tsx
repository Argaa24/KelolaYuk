import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const AddTransactionModal: React.FC = () => {
  const { isAddTxOpen, setIsAddTxOpen, addTransaction } = useApp();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState<string>('1.000.000');
  const [category, setCategory] = useState<string>('Kebutuhan Pokok');
  const [date, setDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [time, setTime] = useState<string>('14:30');
  const [notes, setNotes] = useState<string>('');

  // Update date & time to current real local time whenever modal opens
  useEffect(() => {
    if (isAddTxOpen) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    }
  }, [isAddTxOpen]);

  if (!isAddTxOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, '')) || 0;
    if (numAmount <= 0) return;

    addTransaction({
      date: `${date}`,
      time,
      description: notes.trim() || (type === 'expense' ? `Pengeluaran ${category}` : `Pemasukan ${category}`),
      category,
      type,
      amount: numAmount,
      notes,
    });

    setIsAddTxOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg bg-[#FAF8F5]/95 rounded-2xl p-6 md:p-8 overflow-hidden relative shadow-2xl border border-white/50">
        {/* Decorative ambient gradients */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#8fbc8f] rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#daebf5] rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="font-bold text-2xl text-[#0e1d25]">Tambah Transaksi</h2>
            <p className="text-xs text-[#424940] mt-0.5">Catat setiap aliran uangmu dengan tenang.</p>
          </div>
          <button 
            onClick={() => setIsAddTxOpen(false)}
            className="p-2 rounded-full hover:bg-black/5 text-[#424940] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Type Switcher */}
          <div className="flex p-1 bg-[#e1dfdc]/50 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'Gaji' || category === 'Bonus') setCategory('Kebutuhan Pokok');
              }}
              className={`flex-1 py-3 text-center rounded-lg font-semibold text-sm transition-all ${
                type === 'expense'
                  ? 'bg-[#ba1a1a] text-white shadow-sm'
                  : 'text-[#424940] hover:text-[#0e1d25]'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Pendapatan');
              }}
              className={`flex-1 py-3 text-center rounded-lg font-semibold text-sm transition-all ${
                type === 'income'
                  ? 'bg-[#3e6842] text-white shadow-sm'
                  : 'text-[#424940] hover:text-[#0e1d25]'
              }`}
            >
              Pemasukan
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-1 text-center py-2">
            <label className="text-xs font-semibold text-[#424940] uppercase tracking-wider block">
              Nominal
            </label>
            <div className="flex items-center justify-center text-[#3e6842]">
              <span className="font-bold text-2xl mr-2 text-[#3e6842]/70">Rp</span>
              <input
                type="text"
                value={amount}
                onChange={e => {
                  const rawDigits = e.target.value.replace(/[^0-9]/g, '');
                  if (!rawDigits) {
                    setAmount('');
                  } else {
                    setAmount(new Intl.NumberFormat('id-ID').format(parseInt(rawDigits, 10)));
                  }
                }}
                placeholder="0"
                className="bg-transparent border-none text-center font-bold text-3xl md:text-4xl focus:ring-0 w-full max-w-[280px] outline-none p-0 text-[#3e6842]"
              />
            </div>
          </div>

          <hr className="border-[#d5e5ef]" />

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#424940] uppercase tracking-wider block">
              Kategori
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full appearance-none bg-white border border-[#c2c9be] text-[#0e1d25] font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-[#3e6842] focus:ring-1 focus:ring-[#3e6842] transition-colors"
              >
                {type === 'expense' ? (
                  <>
                    <option value="Kebutuhan Pokok">Kebutuhan Pokok</option>
                    <option value="Gaya Hidup & Hobi">Gaya Hidup & Hobi</option>
                    <option value="Tabungan & Investasi">Tabungan & Investasi</option>
                    <option value="Cicilan & Tagihan">Cicilan & Tagihan</option>
                    <option value="Konsumsi">Konsumsi</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </>
                ) : (
                  <>
                    <option value="Pendapatan">Pendapatan / Gaji</option>
                    <option value="Bonus">Bonus & THR</option>
                    <option value="Dividen">Dividen & Investasi</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Lainnya">Lainnya</option>
                  </>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#727970]">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#424940] uppercase tracking-wider block">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-white border border-[#c2c9be] text-[#0e1d25] font-medium rounded-xl px-3.5 py-3 focus:outline-none focus:border-[#3e6842] text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#424940] uppercase tracking-wider block">Waktu</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-white border border-[#c2c9be] text-[#0e1d25] font-medium rounded-xl px-3.5 py-3 focus:outline-none focus:border-[#3e6842] text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#424940] uppercase tracking-wider block">Catatan Tambahan</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Tulis rincian atau catatan..."
              className="w-full bg-white border border-[#c2c9be] text-[#0e1d25] text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#3e6842] resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setIsAddTxOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl border border-[#727970] text-[#424940] font-semibold text-sm hover:bg-black/5 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] bg-[#3e6842] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-[#3e6842]/20 hover:bg-[#3e6842]/90 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Simpan Transaksi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
