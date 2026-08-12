import React from 'react';
import { useApp } from '../../context/AppContext';

export const BudgetView: React.FC = () => {
  const { setIsAddTxOpen, budgetItems, transactions, goals } = useApp();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);

  // 50/30/20 Rule Targets based on Income
  const needsTarget = Math.round(totalIncome * 0.5);
  const wantsTarget = Math.round(totalIncome * 0.3);
  const savingsTarget = Math.round(totalIncome * 0.2);

  // Spent amounts
  const needsSpent = transactions
    .filter(t => t.type === 'expense' && ['Kebutuhan Pokok', 'Utilitas', 'Tempat Tinggal', 'Konsumsi'].includes(t.category))
    .reduce((acc, t) => acc + t.amount, 0);

  const wantsSpent = transactions
    .filter(t => t.type === 'expense' && !['Kebutuhan Pokok', 'Utilitas', 'Tempat Tinggal', 'Konsumsi'].includes(t.category))
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Welcome Header */}
      <section className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0e1d25] mb-2">
          Pernapasan Finansial Anda Hari Ini
        </h2>
        <p className="text-sm md:text-base text-[#424940] max-w-2xl leading-relaxed">
          Mari kita atur alokasi dana Anda dengan metode 50/30/20 untuk keseimbangan hidup yang berkelanjutan.
        </p>
      </section>

      {/* 50/30/20 Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* 50% Needs */}
        <div className="col-span-12 lg:col-span-7 glass-card p-6 md:p-8 rounded-[24px] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#8fbc8f]/20 p-3.5 rounded-2xl text-[#3e6842]">
                <span className="material-symbols-outlined text-[28px]">home_work</span>
              </div>
              <span className="text-xs font-bold bg-[#3e6842]/10 text-[#3e6842] px-3 py-1 rounded-full">
                50% Kebutuhan
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-[#0e1d25] mb-1">Kebutuhan Pokok</h3>
            <p className="text-xs md:text-sm text-[#424940] mb-6">Sewa, makan, listrik, dan transportasi.</p>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-bold text-2xl text-[#0e1d25]">
                  Rp {new Intl.NumberFormat('id-ID').format(needsSpent)}
                </span>
                <span className="text-xs md:text-sm text-[#424940]">
                  Target Limit (50%): Rp {new Intl.NumberFormat('id-ID').format(needsTarget)}
                </span>
              </div>

              <div className="w-full bg-[#d5e5ef] rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#8fbc8f] to-[#3e6842] transition-all duration-1000" 
                  style={{ width: `${needsTarget > 0 ? Math.min(100, Math.round((needsSpent / needsTarget) * 100)) : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Visualizer */}
        <div className="col-span-12 lg:col-span-5 glass-card p-6 md:p-8 rounded-[24px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full text-center">
            <p className="text-xs md:text-sm text-[#424940] mb-1">Total Pemasukan / Anggaran</p>
            <p className="text-3xl md:text-4xl font-bold text-[#3e6842] mb-8">
              Rp {new Intl.NumberFormat('id-ID').format(totalIncome)}
            </p>

            <div className="space-y-6">
              {/* Segmented Progress Bar */}
              <div className="w-full h-4 bg-[#d5e5ef] rounded-full overflow-hidden flex">
                <div className="bg-[#8fbc8f] h-full" style={{ width: '50%' }} title="Needs 50%" />
                <div className="bg-[#d2ad35] h-full" style={{ width: '30%' }} title="Wants 30%" />
                <div className="bg-[#3e6842] h-full" style={{ width: '20%' }} title="Savings 20%" />
              </div>

              {/* Minimalist Legend */}
              <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-[#424940] pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8fbc8f]" />
                  <span>50% Kebutuhan (Rp {new Intl.NumberFormat('id-ID').format(needsTarget)})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#d2ad35]" />
                  <span>30% Keinginan (Rp {new Intl.NumberFormat('id-ID').format(wantsTarget)})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3e6842]" />
                  <span>20% Tabungan (Rp {new Intl.NumberFormat('id-ID').format(savingsTarget)})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 30% Wants */}
        <div className="col-span-12 md:col-span-6 glass-card p-6 md:p-8 rounded-[24px] hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-[#d2ad35]/20 p-3.5 rounded-2xl text-[#735c00]">
              <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
            </div>
            <span className="text-xs font-bold bg-[#d2ad35]/10 text-[#735c00] px-3 py-1 rounded-full">
              30% Keinginan
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#0e1d25] mb-1">Gaya Hidup & Hobi</h3>
          <p className="text-xs md:text-sm text-[#424940] mb-6">Langganan streaming, kopi, dan rekreasi.</p>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="font-bold text-xl text-[#0e1d25]">
                Rp {new Intl.NumberFormat('id-ID').format(wantsSpent)}
              </span>
              <span className="text-xs text-[#424940]">
                Limit (30%): Rp {new Intl.NumberFormat('id-ID').format(wantsTarget)}
              </span>
            </div>

            <div className="w-full bg-[#d5e5ef] rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#d2ad35] h-full transition-all duration-1000" 
                style={{ width: `${wantsTarget > 0 ? Math.min(100, Math.round((wantsSpent / wantsTarget) * 100)) : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* 20% Savings */}
        <div className="col-span-12 md:col-span-6 glass-card p-6 md:p-8 rounded-[24px] hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-[#3e6842]/20 p-3.5 rounded-2xl text-[#3e6842]">
              <span className="material-symbols-outlined text-[28px]">account_balance</span>
            </div>
            <span className="text-xs font-bold bg-[#3e6842]/10 text-[#3e6842] px-3 py-1 rounded-full">
              20% Masa Depan
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#0e1d25] mb-1">Tabungan & Investasi</h3>
          <p className="text-xs md:text-sm text-[#424940] mb-6">Dana darurat dan target tabungan.</p>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="font-bold text-xl text-[#0e1d25]">
                Rp {new Intl.NumberFormat('id-ID').format(totalSaved)}
              </span>
              <span className="text-xs text-[#424940]">
                Target (20%): Rp {new Intl.NumberFormat('id-ID').format(savingsTarget)}
              </span>
            </div>

            <div className="w-full bg-[#d5e5ef] rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#3e6842] h-full transition-all duration-1000" 
                style={{ width: `${savingsTarget > 0 ? Math.min(100, Math.round((totalSaved / savingsTarget) * 100)) : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold text-[#0e1d25]">Rincian Pengeluaran</h3>
            <p className="text-xs md:text-sm text-[#424940]">Pantau setiap aliran keluar dengan tenang.</p>
          </div>
          <button
            onClick={() => setIsAddTxOpen(true)}
            className="bg-[#3e6842] text-white px-5 py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-[#3e6842]/90 active:scale-95 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Tambah Transaksi</span>
          </button>
        </div>

        <div className="glass-card rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#e7f6ff] border-b border-[#d5e5ef] text-xs font-bold text-[#0e1d25]">
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Alokasi</th>
                  <th className="px-6 py-4">Terpakai</th>
                  <th className="px-6 py-4">Sisa</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d5e5ef] text-xs md:text-sm">
                {budgetItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[#727970]">
                      <p className="font-bold text-sm text-[#0e1d25]">Belum Ada Rincian Pos Anggaran</p>
                      <p className="text-xs mt-1">
                        Catat transaksi pertama Anda untuk mulai memetakan pengeluaran ke dalam alokasi 50/30/20.
                      </p>
                    </td>
                  </tr>
                ) : (
                  budgetItems.map(item => (
                    <tr key={item.id} className="hover:bg-[#8fbc8f]/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#d5e5ef] flex items-center justify-center text-[#3e6842]">
                            <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                          </div>
                          <span className="font-semibold text-[#0e1d25]">{item.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#424940]">Rp {new Intl.NumberFormat('id-ID').format(item.allocated)}</td>
                      <td className="px-6 py-4 font-bold text-[#0e1d25]">Rp {new Intl.NumberFormat('id-ID').format(item.spent)}</td>
                      <td className="px-6 py-4 text-[#424940]">Rp {new Intl.NumberFormat('id-ID').format(item.allocated - item.spent)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          item.status === 'Mendekati Batas'
                            ? 'bg-[#ffe088]/40 text-[#534200]'
                            : 'bg-[#8fbc8f]/20 text-[#234c29]'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Mindful Reminder Card */}
      <div className="glass-card p-6 rounded-[24px] border-l-8 border-[#3e6842] flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-[#3e6842] text-white flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[24px]">spa</span>
        </div>
        <div>
          <h4 className="font-bold text-sm text-[#0e1d25] mb-0.5">Mindful Reminder</h4>
          <p className="text-xs md:text-sm text-[#424940] italic leading-relaxed">
            "Uang adalah alat, bukan tujuan. Mengaturnya dengan baik hari ini memberimu kebebasan di hari esok."
          </p>
        </div>
      </div>
    </div>
  );
};
