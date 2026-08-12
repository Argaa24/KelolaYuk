import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e1d25] text-white p-3 rounded-xl shadow-lg text-xs space-y-1 border border-white/10">
        <p className="font-bold border-b border-white/20 pb-1 text-slate-300">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
            <span>{entry.name || 'Pengeluaran'}:</span>
            <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(entry.value)}</span>
          </p>
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

export const DashboardView: React.FC = () => {
  const { 
    profile, 
    netWorth, 
    monthlyCashflow, 
    setIsAddTxOpen, 
    setCurrentView,
    setIsQuizOpen,
    bills,
    transactions
  } = useApp();

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'category'>('week');

  const unpaidBills = bills.filter(b => !b.isPaid);
  const nextBill = unpaidBills.length > 0 ? unpaidBills[0] : null;

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseChartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return [];

    if (timeRange === 'category') {
      const catMap: Record<string, number> = {};
      expenses.forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });
      return Object.entries(catMap).map(([cat, amt]) => ({
        name: cat,
        Pengeluaran: amt
      }));
    }

    if (timeRange === 'week') {
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const orderedDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
      const map: Record<string, number> = { Sen: 0, Sel: 0, Rab: 0, Kam: 0, Jum: 0, Sab: 0, Min: 0 };

      expenses.forEach(t => {
        const d = parseDateSafely(t.date);
        if (d) {
          const dayName = dayNames[d.getDay()];
          map[dayName] = (map[dayName] || 0) + t.amount;
        }
      });

      return orderedDays.map(day => ({
        name: day,
        Pengeluaran: map[day] || 0
      }));
    }

    // timeRange === 'month'
    const map: Record<string, number> = { 'Mg 1': 0, 'Mg 2': 0, 'Mg 3': 0, 'Mg 4': 0 };
    expenses.forEach(t => {
      const d = parseDateSafely(t.date);
      if (d) {
        const dateNum = d.getDate();
        if (dateNum <= 7) map['Mg 1'] += t.amount;
        else if (dateNum <= 14) map['Mg 2'] += t.amount;
        else if (dateNum <= 21) map['Mg 3'] += t.amount;
        else map['Mg 4'] += t.amount;
      }
    });

    return Object.entries(map).map(([week, amt]) => ({
      name: week,
      Pengeluaran: amt
    }));
  }, [transactions, timeRange]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[32px] p-8 md:p-12 glass-card">
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-2 text-[#0e1d25]">
            Selamat datang, {profile.name.split(' ')[0]}.
          </h3>
          <p className="text-[#424940] text-sm md:text-base max-w-2xl leading-relaxed">
            Semua fitur siap digunakan dari awal. Catat pemasukan, pengeluaran & target tabungan Anda untuk mulai mengelola keuangan.
          </p>
        </div>
      </section>

      {/* Bento Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Worth */}
        <div className="glass-card p-6 md:p-8 rounded-[24px] shadow-xs hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-[#3e6842] bg-[#8fbc8f]/20 p-3 rounded-full text-[24px]">
              account_balance
            </span>
            <span className="text-xs font-bold text-[#3e6842] bg-[#8fbc8f]/10 px-3 py-1 rounded-full">
              {netWorth === 0 ? 'Mulai dari 0' : 'Total Tabungan + Saldo'}
            </span>
          </div>
          <p className="text-xs md:text-sm font-medium text-[#424940] mb-1">Kekayaan Bersih</p>
          <h4 className="text-2xl md:text-3xl font-bold text-[#0e1d25]">
            Rp {new Intl.NumberFormat('id-ID').format(netWorth)}
          </h4>
        </div>

        {/* Arus Kas */}
        <div className="glass-card p-6 md:p-8 rounded-[24px] shadow-xs hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-[#3e6842] bg-[#8fbc8f]/20 p-3 rounded-full text-[24px]">
              payments
            </span>
            <div className="flex items-center gap-1 text-[#3e6842]">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span className="text-xs font-bold">Status: Ready</span>
            </div>
          </div>
          <p className="text-xs md:text-sm font-medium text-[#424940] mb-1">Arus Kas Bulanan</p>
          <h4 className="text-2xl md:text-3xl font-bold text-[#0e1d25]">
            Rp {new Intl.NumberFormat('id-ID').format(monthlyCashflow)}
          </h4>
        </div>

        {/* Tagihan Berikutnya */}
        <div className="glass-card p-6 md:p-8 rounded-[24px] shadow-xs hover:-translate-y-1 transition-transform duration-300 border-l-4 border-[#d2ad35]">
          <div className="flex items-center justify-between mb-6">
            <span className="material-symbols-outlined text-[#735c00] bg-[#ffe088]/30 p-3 rounded-full text-[24px]">
              event_repeat
            </span>
            <span className="text-xs font-bold text-[#735c00]">
              {nextBill ? 'Menunggu' : 'Tenang'}
            </span>
          </div>
          <p className="text-xs md:text-sm font-medium text-[#424940] mb-1">Tagihan Terdekat</p>
          {nextBill ? (
            <>
              <h4 className="text-xl md:text-2xl font-bold text-[#0e1d25] truncate">{nextBill.name}</h4>
              <p className="text-xs md:text-sm text-[#424940] mt-1 font-medium">Rp {new Intl.NumberFormat('id-ID').format(nextBill.amount)}</p>
            </>
          ) : (
            <>
              <h4 className="text-lg md:text-xl font-bold text-[#0e1d25]">Tidak Ada Tagihan</h4>
              <p className="text-xs md:text-sm text-[#727970] mt-1 font-medium">Belum ada tagihan mendatang</p>
            </>
          )}
        </div>
      </section>

      {/* Chart & Health Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Chart */}
        <div className="lg:col-span-2 glass-card p-6 md:p-8 rounded-[24px] overflow-hidden flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h5 className="text-lg md:text-xl font-bold text-[#0e1d25]">Tinjauan Pengeluaran</h5>
              <p className="text-xs md:text-sm text-[#424940]">Visualisasi alur pengeluaran dari transaksi yang dicatat</p>
            </div>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="bg-[#e7f6ff] border border-[#d5e5ef] rounded-xl text-xs font-semibold py-1.5 px-3 focus:ring-1 focus:ring-[#3e6842] text-[#0e1d25] outline-none cursor-pointer self-start sm:self-auto"
            >
              <option value="week">Minggu Ini (Per Hari)</option>
              <option value="month">Bulan Ini (Per Minggu)</option>
              <option value="category">Per Kategori</option>
            </select>
          </div>

          <div className="h-60 relative w-full pt-2">
            {expenseChartData.length === 0 || totalExpense === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#727970] p-6 text-center bg-[#f4f8f5]/50 rounded-2xl border border-dashed border-[#c2c9be]">
                <span className="material-symbols-outlined text-[36px] text-[#8fbc8f] mb-2">show_chart</span>
                <p className="text-xs font-bold text-[#0e1d25]">Belum Ada Catatan Pengeluaran</p>
                <p className="text-[11px] text-[#727970] mt-1 max-w-xs">
                  Grafik ini akan terisi secara otomatis setelah Anda mencatat transaksi pengeluaran.
                </p>
                <button
                  onClick={() => setIsAddTxOpen(true)}
                  className="mt-3 text-xs font-bold text-[#3e6842] bg-[#8fbc8f]/20 hover:bg-[#8fbc8f]/30 px-3.5 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Catat Pengeluaran
                </button>
              </div>
            ) : timeRange === 'category' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Pengeluaran" fill="#3e6842" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={expenseChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3e6842" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3e6842" stopOpacity={0}/>
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
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="Pengeluaran" 
                    stroke="#3e6842" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#expenseGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Financial Health Prompts */}
        <div className="glass-card p-6 md:p-8 rounded-[24px] flex flex-col justify-between gap-6">
          <h5 className="text-xs font-bold text-[#3e6842] uppercase tracking-widest">Kesehatan Finansial</h5>

          <div className="space-y-4">
            <div 
              onClick={() => setIsQuizOpen(true)}
              className="flex gap-3.5 p-3.5 rounded-2xl bg-[#8fbc8f]/10 hover:bg-[#8fbc8f]/20 transition-all cursor-pointer border border-[#8fbc8f]/20"
            >
              <span className="material-symbols-outlined text-[#3e6842] text-[24px] shrink-0">
                psychology
              </span>
              <div>
                <p className="font-bold text-xs md:text-sm text-[#0e1d25]">Tips Hari Ini</p>
                <p className="text-xs text-[#424940] leading-snug mt-0.5">
                  Berikan jeda 24 jam sebelum melakukan pembelian impulsif.
                </p>
              </div>
            </div>

            <div 
              onClick={() => setCurrentView('academy')}
              className="flex gap-3.5 p-3.5 rounded-2xl bg-[#ffe088]/20 hover:bg-[#ffe088]/30 transition-all cursor-pointer border border-[#d2ad35]/20"
            >
              <span className="material-symbols-outlined text-[#735c00] text-[24px] shrink-0">
                spa
              </span>
              <div>
                <p className="font-bold text-xs md:text-sm text-[#0e1d25]">Misi Literasi</p>
                <p className="text-xs text-[#424940] leading-snug mt-0.5">
                  Pahami efek bunga majemuk dalam 5 menit.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="w-full bg-[#d5e5ef] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#3e6842] h-full rounded-full transition-all duration-1000" 
                style={{ width: totalIncome > 0 ? `${Math.min(100, Math.round((totalExpense / totalIncome) * 100))}%` : '0%' }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-xs font-bold">
              <span className="text-[#424940]">Rasio Pengeluaran / Pemasukan</span>
              <span className="text-[#3e6842]">
                {totalIncome > 0 ? `${Math.round((totalExpense / totalIncome) * 100)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAB Floating Catat Transaksi Button */}
      <button 
        onClick={() => setIsAddTxOpen(true)}
        className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 bg-[#3e6842] text-white rounded-full fab-glow z-40 hover:scale-105 active:scale-95 transition-all shadow-xl font-bold text-sm"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        <span>Catat Transaksi</span>
      </button>
    </div>
  );
};
