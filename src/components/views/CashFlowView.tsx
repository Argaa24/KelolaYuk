import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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

  const cashFlowData = useMemo(() => {
    if (transactions.length === 0) return [];

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
  }, [transactions, filterMonth]);

  const hasData = transactions.length > 0 && cashFlowData.some(d => d.Pemasukan > 0 || d.Pengeluaran > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0e1d25]">Arus Kas</h2>
          <p className="text-xs md:text-sm text-[#424940] mt-0.5">Pantau pergerakan uang Anda berdasarkan transaksi.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value as any)}
            className="bg-white rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#0e1d25] border border-[#c2c9be] outline-none cursor-pointer focus:border-[#3e6842]"
          >
            <option value="month">Tampilan Per Minggu (Bulan Ini)</option>
            <option value="week">Tampilan Per Hari (Minggu Ini)</option>
          </select>

          <button
            onClick={() => setIsAddTxOpen(true)}
            className="bg-[#3e6842] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:bg-[#3e6842]/90 active:scale-98 transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Tambah Transaksi</span>
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Total Balance Card */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8fbc8f]/10 rounded-full blur-2xl group-hover:bg-[#8fbc8f]/20 transition-colors duration-700"></div>
          <div>
            <h3 className="font-medium text-xs md:text-sm text-[#424940] mb-2">Total Saldo Saat Ini</h3>
            <div className="text-3xl md:text-4xl font-bold text-[#0e1d25] tracking-tight">
              Rp {new Intl.NumberFormat('id-ID').format(totalBalance)}
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-[#3e6842]">
            <span className="material-symbols-outlined bg-[#8fbc8f]/20 rounded-full p-1 text-[16px]">
              account_balance_wallet
            </span>
            <span className="font-bold text-xs">Akurat sesuai pencatatan</span>
          </div>
        </div>

        {/* Cash Flow Chart */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 md:p-8 shadow-xs flex flex-col relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
            <h3 className="font-bold text-lg text-[#0e1d25]">Tren Arus Kas</h3>
            <div className="flex gap-4 font-semibold text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#3e6842]"></div> Pemasukan
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ba1a1a]"></div> Pengeluaran
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-[220px] relative w-full pt-2">
            {!hasData ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-[#727970] p-6 text-center bg-[#f4f8f5]/50 rounded-2xl border border-dashed border-[#c2c9be]">
                <span className="material-symbols-outlined text-[36px] text-[#8fbc8f] mb-2">trending_up</span>
                <p className="text-xs font-bold text-[#0e1d25]">Belum Ada Data Arus Kas</p>
                <p className="text-[11px] text-[#727970] mt-1 max-w-xs">
                  Grafik tren pemasukan & pengeluaran akan otomatis terbentuk dari transaksi yang Anda tambahkan.
                </p>
                <button
                  onClick={() => setIsAddTxOpen(true)}
                  className="mt-3 text-xs font-bold text-[#3e6842] bg-[#8fbc8f]/20 hover:bg-[#8fbc8f]/30 px-3.5 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Tambah Transaksi Pertama
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3e6842" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3e6842" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expenseGradientCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#424940', fontWeight: 600 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#727970' }} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => val >= 1000000 ? `${(val/1000000).toFixed(1)}M` : val >= 1000 ? `${(val/1000).toFixed(0)}rb` : val}
                  />
                  <Tooltip content={<CashFlowTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="Pemasukan" 
                    stroke="#3e6842" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#incomeGradient)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Pengeluaran" 
                    stroke="#ba1a1a" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#expenseGradientCash)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <section className="glass-panel rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg md:text-xl text-[#0e1d25]">Transaksi Terakhir</h3>
          <span className="text-xs text-[#727970]">{transactions.length} total transaksi</span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-[#727970] space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#8fbc8f]/20 text-[#3e6842] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">payments</span>
            </div>
            <p className="font-bold text-base text-[#0e1d25]">Belum Ada Transaksi Recorded</p>
            <p className="text-xs text-[#727970] max-w-sm mx-auto">
              Catat pemasukan dan pengeluaran pertamamu untuk mulai menghitung arus kas dari 0.
            </p>
            <button
              onClick={() => setIsAddTxOpen(true)}
              className="mt-2 bg-[#3e6842] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-[#3e6842]/90 inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Catat Transaksi Pertama</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#c2c9be]/40 text-[#727970] font-semibold text-xs">
                  <th className="pb-3 pl-2">Tanggal</th>
                  <th className="pb-3">Deskripsi</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3 text-right pr-2">Jumlah</th>
                  <th className="pb-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-[#c2c9be]/20 hover:bg-[#d5e5ef]/30 transition-colors">
                    <td className="text-[#727970] pl-2 py-4 font-medium">{tx.date}</td>
                    <td className="text-[#0e1d25] font-semibold py-4">{tx.description}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        tx.type === 'income' 
                          ? 'bg-[#8fbc8f]/20 text-[#3e6842]' 
                          : 'bg-[#e1dfdc] text-[#5e5e5c]'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className={`text-right pr-2 py-4 font-bold ${
                      tx.type === 'income' ? 'text-[#3e6842]' : 'text-[#ba1a1a]'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'} Rp {new Intl.NumberFormat('id-ID').format(tx.amount)}
                    </td>
                    <td className="text-center py-4">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                        title="Hapus Transaksi"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
