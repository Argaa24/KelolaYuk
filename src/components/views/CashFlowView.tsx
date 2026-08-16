import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EditBalanceModal } from '../modals/EditBalanceModal';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const CashFlowTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e1d25] text-white p-3 rounded-xl shadow-lg text-xs space-y-1.5 border border-white/10">
        <p className="font-bold border-b border-white/20 pb-1 text-slate-300">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 font-semibold">
            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
              {entry.name}:
            </span>
            <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const parseDateSafely = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const d1 = new Date(dateStr);
  if (!isNaN(d1.getTime())) return d1;
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
  }
  return null;
};

export const CashFlowView: React.FC = () => {
  const { totalBalance, transactions, setIsAddTxOpen, deleteTransaction } = useApp();
  const [filterMonth, setFilterMonth] = useState<'month' | 'week' | 'all'>('month');
  const [isEditBalanceOpen, setIsEditBalanceOpen] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const hasTransactions = transactions.length > 0;

  const cashFlowData = useMemo(() => {
    if (!hasTransactions) {
      return [];
    }

    if (filterMonth === 'week') {
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const orderedDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
      const map: Record<string, { income: number; expense: number }> = {
        Sen: { income: 0, expense: 0 },
        Sel: { income: 0, expense: 0 },
        Rab: { income: 0, expense: 0 },
        Kam: { income: 0, expense: 0 },
        Jum: { income: 0, expense: 0 },
        Sab: { income: 0, expense: 0 },
        Min: { income: 0, expense: 0 }
      };

      transactions.forEach(t => {
        const d = parseDateSafely(t.date);
        if (d) {
          const dayName = dayNames[d.getDay()];
          if (t.type === 'income') {
            map[dayName].income += t.amount;
          } else {
            map[dayName].expense += t.amount;
          }
        }
      });

      return orderedDays.map(day => ({
        name: day,
        Pemasukan: map[day].income,
        Pengeluaran: map[day].expense
      }));
    }

    // Default: 'month' (Weeks 1 to 4)
    const weeks = ['Mg 1', 'Mg 2', 'Mg 3', 'Mg 4'];
    const map: Record<string, { income: number; expense: number }> = {
      'Mg 1': { income: 0, expense: 0 },
      'Mg 2': { income: 0, expense: 0 },
      'Mg 3': { income: 0, expense: 0 },
      'Mg 4': { income: 0, expense: 0 },
    };

    transactions.forEach(t => {
      const d = parseDateSafely(t.date);
      let weekKey = 'Mg 1';
      if (d) {
        const dateNum = d.getDate();
        if (dateNum <= 7) weekKey = 'Mg 1';
        else if (dateNum <= 14) weekKey = 'Mg 2';
        else if (dateNum <= 21) weekKey = 'Mg 3';
        else weekKey = 'Mg 4';
      }

      if (t.type === 'income') {
        map[weekKey].income += t.amount;
      } else {
        map[weekKey].expense += t.amount;
      }
    });

    return weeks.map(w => ({
      name: w,
      Pemasukan: map[w].income,
      Pengeluaran: map[w].expense
    }));
  }, [transactions, filterMonth, hasTransactions]);

  const displayedTransactions = showAllTransactions 
    ? transactions 
    : transactions.slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0e1d25] dark:text-[#f1f5f9] tracking-tight">Arus Kas</h2>
          <p className="text-xs sm:text-sm text-[#424940] dark:text-[#a0aec0] mt-0.5">Pantau pergerakan uang Anda bulan ini.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value as any)}
            className="bg-white dark:bg-[#142026] rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#0e1d25] dark:text-[#f1f5f9] border border-[#c2c9be] dark:border-[#28373f] outline-none cursor-pointer focus:border-[#3e6842]"
          >
            <option value="month">Tampilan Per Minggu (Bulan Ini)</option>
            <option value="week">Tampilan Per Hari (Minggu Ini)</option>
          </select>

          <button
            onClick={() => setIsAddTxOpen(true)}
            className="bg-[#3e6842] hover:bg-[#3e6842]/90 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-[#3e6842]/20 active:scale-98 transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Tambah Transaksi</span>
          </button>
        </div>
      </div>

      {/* Top Bento Grid (Saldo Card + Tren Arus Kas Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Total Saldo Saat Ini Card */}
        <div className="lg:col-span-5 bg-[#18391e] dark:bg-[#132c18] rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden group min-h-[250px]">
          {/* Subtle Ambient Background Light */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#4ade80]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            {/* Top Row: Title and Ubah Saldo Button */}
            <div className="flex items-center justify-between gap-2 mb-8">
              <span className="text-[11px] sm:text-xs font-bold text-white/90 tracking-wider uppercase">
                TOTAL SALDO SAAT INI
              </span>

              <button
                onClick={() => setIsEditBalanceOpen(true)}
                className="bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs active:scale-95 shadow-xs"
                title="Sesuaikan Saldo Kas"
              >
                <span className="material-symbols-outlined text-[16px]">edit_square</span>
                <span>Ubah Saldo</span>
              </button>
            </div>

            {/* Middle: Rp Currency & Balance Amount */}
            <div className="flex items-baseline flex-wrap gap-2.5 my-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#4ade80]">
                Rp
              </span>
              <span className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-none">
                {new Intl.NumberFormat('id-ID').format(totalBalance)}
              </span>
            </div>
          </div>

          {/* Bottom Badge: +12.5% dari bulan lalu */}
          <div className="mt-8 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/95 text-xs font-medium shadow-xs backdrop-blur-xs">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>+12.5% dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Tren Arus Kas Chart Card */}
        <div className="lg:col-span-7 bg-white dark:bg-[#142026] rounded-[32px] p-6 sm:p-8 shadow-sm border border-[#d5e5ef] dark:border-[#28373f] flex flex-col justify-between relative overflow-hidden min-h-[250px]">
          {/* Header & Legend */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="font-extrabold text-lg sm:text-xl text-[#0e1d25] dark:text-[#f1f5f9] tracking-tight">
              Tren Arus Kas
            </h3>
            
            {hasTransactions && (
              <div className="flex items-center gap-4 font-semibold text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-[#2e7d32] dark:text-[#4ade80]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1e5627] dark:bg-[#4ade80] inline-block"></span>
                  <span>Pemasukan</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#d32f2f] dark:text-[#f87171]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d32f2f] dark:bg-[#f87171] inline-block"></span>
                  <span>Pengeluaran</span>
                </div>
              </div>
            )}
          </div>

          {/* Line Chart or Empty State */}
          {!hasTransactions ? (
            <div className="flex-1 w-full min-h-[190px] flex flex-col items-center justify-center text-center p-6 bg-[#f8faf9] dark:bg-[#101b20] rounded-2xl border border-dashed border-[#c2d6c8] dark:border-[#28373f]">
              <div className="w-12 h-12 rounded-2xl bg-[#8fbc8f]/20 text-[#3e6842] dark:text-[#8fbc8f] flex items-center justify-center mb-2.5">
                <span className="material-symbols-outlined text-[26px]">show_chart</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#0e1d25] dark:text-[#f1f5f9]">
                Belum Ada Data Tren Arus Kas
              </p>
              <p className="text-[11px] sm:text-xs text-[#727970] dark:text-[#8a99a8] mt-1 max-w-xs leading-relaxed">
                Grafik visualisasi pemasukan & pengeluaran akan langsung tampil otomatis setelah Anda menambahkan transaksi.
              </p>
              <button
                onClick={() => setIsAddTxOpen(true)}
                className="mt-3.5 bg-[#3e6842] hover:bg-[#3e6842]/90 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Tambah Transaksi Baru</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 w-full h-[190px] pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-[#23333c]" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                    axisLine={false}
                    tickLine={false}
                    dy={6}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => {
                      if (val >= 1000000) return `${(val / 1000000).toFixed(0)}M`;
                      if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                      return String(val);
                    }}
                  />
                  <Tooltip content={<CashFlowTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="Pemasukan" 
                    stroke="#1e5627" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#1e5627', stroke: '#ffffff', strokeWidth: 2 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Pengeluaran" 
                    stroke="#d32f2f" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#d32f2f', stroke: '#ffffff', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Transaksi Terakhir Card */}
      <section className="bg-white dark:bg-[#142026] rounded-[32px] p-6 sm:p-8 shadow-sm border border-[#d5e5ef] dark:border-[#28373f]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-xl text-[#0e1d25] dark:text-[#f1f5f9] tracking-tight">
            Transaksi Terakhir
          </h3>
          <span className="text-xs font-semibold text-[#727970] dark:text-[#8a99a8]">
            {transactions.length} total transaksi
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-10 text-center text-[#727970] dark:text-[#8a99a8] space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#8fbc8f]/20 text-[#3e6842] dark:text-[#8fbc8f] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">payments</span>
            </div>
            <p className="font-bold text-sm text-[#0e1d25] dark:text-[#f1f5f9]">Belum Ada Transaksi Tercatat</p>
            <p className="text-xs text-[#727970] dark:text-[#8a99a8] max-w-sm mx-auto">
              Catat pemasukan atau pengeluaran pertama Anda untuk memantau arus kas secara berkala.
            </p>
            <button
              onClick={() => setIsAddTxOpen(true)}
              className="mt-2 bg-[#3e6842] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:bg-[#3e6842]/90 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Catat Transaksi Pertama</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#e2e8f0] dark:border-[#28373f] text-[#727970] dark:text-[#8a99a8] font-bold text-[11px] tracking-wider uppercase">
                  <th className="pb-3 pl-2">TANGGAL</th>
                  <th className="pb-3">DESKRIPSI</th>
                  <th className="pb-3">KATEGORI</th>
                  <th className="pb-3 text-right pr-2">JUMLAH</th>
                  <th className="pb-3 text-center w-16">AKSI</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                {displayedTransactions.map(tx => (
                  <tr key={tx.id} className="border-b border-[#f1f5f9] dark:border-[#1e2d34] hover:bg-[#f8fafc] dark:hover:bg-[#18262d] transition-colors">
                    <td className="text-[#64748b] dark:text-[#8a99a8] pl-2 py-4 font-medium">{tx.date}</td>
                    <td className="text-[#0e1d25] dark:text-[#f1f5f9] font-bold py-4">{tx.description}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        tx.type === 'income' 
                          ? 'bg-[#8fbc8f]/20 text-[#2e7d32] dark:text-[#8fbc8f]' 
                          : 'bg-[#f1f5f9] dark:bg-[#1a282f] text-[#64748b] dark:text-[#94a3b8]'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className={`text-right pr-2 py-4 font-extrabold ${
                      tx.type === 'income' ? 'text-[#2e7d32] dark:text-[#4ade80]' : 'text-[#d32f2f] dark:text-[#f87171]'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'} Rp {new Intl.NumberFormat('id-ID').format(tx.amount)}
                    </td>
                    <td className="text-center py-4">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 rounded-lg text-[#d32f2f] hover:bg-[#ffebee] dark:hover:bg-[#3a1a1a] transition-colors cursor-pointer"
                        title="Hapus Transaksi"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bottom link: Lihat Semua Transaksi */}
            <div className="pt-5 border-t border-[#f1f5f9] dark:border-[#1e2d34] text-center">
              <button
                onClick={() => setShowAllTransactions(!showAllTransactions)}
                className="text-[#18391e] dark:text-[#8fbc8f] hover:text-[#2e7d32] font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer hover:underline"
              >
                <span>{showAllTransactions ? 'Sembunyikan Sebagian' : 'Lihat Semua Transaksi'}</span>
                <span className="material-symbols-outlined text-[18px]">
                  {showAllTransactions ? 'expand_less' : 'trending_flat'}
                </span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Edit Balance Modal */}
      <EditBalanceModal
        isOpen={isEditBalanceOpen}
        onClose={() => setIsEditBalanceOpen(false)}
      />
    </div>
  );
};
