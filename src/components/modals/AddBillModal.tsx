import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AddBillModal: React.FC = () => {
  const { isAddBillOpen, setIsAddBillOpen, addBill } = useApp();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('350000');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [category, setCategory] = useState('Utilitas');
  const [reminderEnabled, setReminderEnabled] = useState(true);

  if (!isAddBillOpen) return null;

  const categories = ['Tempat Tinggal', 'Utilitas', 'Langganan', 'Lainnya'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, '')) || 0;
    if (!name.trim() || numAmount <= 0) return;

    addBill({
      name,
      amount: numAmount,
      dueDate,
      category,
      reminderEnabled,
      isPaid: false,
    });

    setIsAddBillOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg bg-[#FAF8F5]/95 rounded-xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl border border-white/40">
        {/* Header */}
        <div className="flex flex-col gap-1 text-center">
          <h2 className="font-bold text-2xl text-[#3e6842]">Tambah Tagihan Baru</h2>
          <p className="text-xs text-[#424940]">Satu langkah menuju keteraturan</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Nama Tagihan */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-[#424940]" htmlFor="billName">Nama Tagihan</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#727970] text-[20px]">
                receipt_long
              </span>
              <input
                id="billName"
                type="text"
                placeholder="Contoh: Listrik, Internet"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-white border border-[#c2c9be] rounded-lg py-3 pl-10 pr-4 text-[#0e1d25] font-medium focus:border-[#3e6842] focus:ring-1 focus:ring-[#3e6842] outline-none text-sm"
              />
            </div>
          </div>

          {/* Jumlah Tagihan */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-[#424940]" htmlFor="billAmount">Jumlah Tagihan</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-[#727970] text-sm">Rp</span>
              <input
                id="billAmount"
                type="text"
                placeholder="0"
                value={amount ? new Intl.NumberFormat('id-ID').format(parseFloat(amount.replace(/[^0-9]/g, '')) || 0) : ''}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setAmount(val);
                }}
                className="w-full bg-white border border-[#c2c9be] rounded-lg py-3 pl-12 pr-4 text-[#0e1d25] font-bold text-base focus:border-[#3e6842] focus:ring-1 focus:ring-[#3e6842] outline-none"
              />
            </div>
          </div>

          {/* Tanggal Jatuh Tempo */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-[#424940]" htmlFor="dueDate">Tanggal Jatuh Tempo</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#727970] text-[20px]">
                calendar_today
              </span>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-white border border-[#c2c9be] rounded-lg py-3 pl-10 pr-4 text-[#0e1d25] font-medium focus:border-[#3e6842] outline-none cursor-pointer text-sm"
              />
            </div>
          </div>

          {/* Kategori Chips */}
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-[#424940] mb-1">Kategori</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    category === cat
                      ? 'bg-[#8fbc8f]/30 border border-[#8fbc8f] text-[#3e6842]'
                      : 'bg-[#e0f0fb] border border-[#c2c9be] text-[#424940] hover:bg-[#daebf5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Pengingat Toggle */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#c2c9be] mt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8fbc8f]/20 flex items-center justify-center text-[#3e6842]">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  notifications_active
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[#0e1d25] text-xs">Aktifkan Pengingat</span>
                <span className="text-[11px] text-[#424940]">H-3 sebelum jatuh tempo</span>
              </div>
            </div>

            <label className="flex items-center cursor-pointer">
              <div className="relative" onClick={() => setReminderEnabled(!reminderEnabled)}>
                <div className={`w-12 h-7 rounded-full transition-colors duration-300 ${reminderEnabled ? 'bg-[#3e6842]' : 'bg-[#d5e5ef]'}`} />
                <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${reminderEnabled ? 'translate-x-5' : ''}`} />
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row-reverse gap-3 mt-4 pt-4 border-t border-[#c2c9be]/30">
            <button
              type="submit"
              className="flex-1 bg-[#3e6842] text-white py-3 px-6 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[#3e6842]/20"
            >
              Simpan Tagihan
            </button>
            <button
              type="button"
              onClick={() => setIsAddBillOpen(false)}
              className="flex-1 bg-transparent border border-[#727970] text-[#424940] py-3 px-6 rounded-lg font-bold hover:bg-[#e7f6ff] transition-all"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
