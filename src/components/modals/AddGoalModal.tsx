import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AddGoalModal: React.FC = () => {
  const { isAddGoalOpen, setIsAddGoalOpen, addGoal } = useApp();

  const [title, setTitle] = useState('');
  const [targetDescription, setTargetDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('10000000');
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => String(currentYear + i));

  const [selectedDay, setSelectedDay] = useState('31');
  const [selectedMonth, setSelectedMonth] = useState('Des');
  const [selectedYear, setSelectedYear] = useState(String(currentYear + 1));
  const [categoryIcon, setCategoryIcon] = useState('savings');

  if (!isAddGoalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = parseFloat(targetAmount.replace(/[^0-9]/g, '')) || 0;
    if (!title.trim() || numTarget <= 0) return;

    const formattedEstimatedDate = `${selectedDay} ${selectedMonth} ${selectedYear}`;

    addGoal({
      title,
      targetDescription: targetDescription || 'Target Impian',
      targetAmount: numTarget,
      currentAmount: 0,
      categoryIcon,
      estimatedDate: formattedEstimatedDate,
    });

    setIsAddGoalOpen(false);
  };

  const icons = [
    { name: 'savings', label: 'Tabungan' },
    { name: 'beach_access', label: 'Liburan' },
    { name: 'laptop_mac', label: 'Gadget' },
    { name: 'directions_car', label: 'Kendaraan' },
    { name: 'home', label: 'Properti' },
    { name: 'school', label: 'Pendidikan' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FAF8F5] rounded-[24px] shadow-2xl border border-[#e1dfdc] overflow-hidden p-6 space-y-5">
        <div className="flex justify-between items-center border-b border-[#e1dfdc] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8fbc8f]/20 flex items-center justify-center text-[#3e6842]">
              <span className="material-symbols-outlined text-[24px]">add_circle</span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#0e1d25]">Tambah Target Impian</h3>
              <p className="text-xs text-[#424940]">Tetapkan sasaran finansial terarah.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddGoalOpen(false)}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#424940]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#0e1d25] mb-1">Nama Target</label>
            <input
              type="text"
              placeholder="Contoh: Rumah Pertama, S2 Abroad..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full p-3 bg-white rounded-xl border border-[#c2c9be] text-sm focus:border-[#3e6842] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0e1d25] mb-1">Keterangan / Detail Target</label>
            <input
              type="text"
              placeholder="Contoh: Target: DP Rumah 2026"
              value={targetDescription}
              onChange={e => setTargetDescription(e.target.value)}
              className="w-full p-3 bg-white rounded-xl border border-[#c2c9be] text-sm focus:border-[#3e6842] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0e1d25] mb-1">Target Nominal (Rp)</label>
            <input
              type="text"
              value={targetAmount ? new Intl.NumberFormat('id-ID').format(parseFloat(targetAmount.replace(/[^0-9]/g, '')) || 0) : ''}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setTargetAmount(val);
              }}
              className="w-full p-3 bg-white rounded-xl border border-[#c2c9be] text-sm font-bold text-[#3e6842] focus:border-[#3e6842] outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0e1d25] mb-1">Ikon Kategori</label>
            <div className="flex gap-2">
              {icons.map(ic => (
                <button
                  key={ic.name}
                  type="button"
                  onClick={() => setCategoryIcon(ic.name)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center flex-1 transition-all ${
                    categoryIcon === ic.name
                      ? 'bg-[#3e6842] text-white border-[#3e6842]'
                      : 'bg-white border-[#c2c9be] text-[#424940] hover:bg-[#e7f6ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{ic.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#0e1d25] mb-1">Estimasi Waktu Target (Tanggal, Bulan, Tahun)</label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={selectedDay}
                onChange={e => setSelectedDay(e.target.value)}
                className="p-3 bg-white rounded-xl border border-[#c2c9be] text-sm focus:border-[#3e6842] outline-none cursor-pointer"
              >
                {days.map(d => (
                  <option key={d} value={d}>Tgl {d}</option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="p-3 bg-white rounded-xl border border-[#c2c9be] text-sm focus:border-[#3e6842] outline-none cursor-pointer"
              >
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="p-3 bg-white rounded-xl border border-[#c2c9be] text-sm focus:border-[#3e6842] outline-none cursor-pointer"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={() => setIsAddGoalOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl border border-[#727970] text-[#424940] font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 px-4 rounded-xl bg-[#3e6842] text-white font-bold shadow-md hover:bg-[#3e6842]/90"
            >
              Simpan Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
