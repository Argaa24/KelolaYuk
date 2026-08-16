import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export const getCategoryBucket = (categoryStr: string): 'needs' | 'wants' | 'savings' => {
  const cat = (categoryStr || '').toLowerCase().trim();
  if (
    cat.includes('kebutuhan') ||
    cat.includes('utilitas') ||
    cat.includes('tempat tinggal') ||
    cat.includes('konsumsi') ||
    cat.includes('cicilan') ||
    cat.includes('tagihan') ||
    cat.includes('sewa') ||
    cat.includes('transport')
  ) {
    return 'needs';
  }
  if (
    cat.includes('tabungan') ||
    cat.includes('investasi') ||
    cat.includes('dana darurat') ||
    cat.includes('masa depan')
  ) {
    return 'savings';
  }
  return 'wants';
};

interface PosAnggaranDef {
  category: string;
  icon: string;
  bucket: 'needs' | 'wants' | 'savings';
  sharePercentage: number; // percentage of total income
}

const DEFAULT_POS_DEFS: PosAnggaranDef[] = [
  { category: 'Kebutuhan Pokok', icon: 'home_work', bucket: 'needs', sharePercentage: 30 },
  { category: 'Cicilan & Tagihan', icon: 'receipt_long', bucket: 'needs', sharePercentage: 10 },
  { category: 'Konsumsi', icon: 'restaurant', bucket: 'needs', sharePercentage: 10 },
  { category: 'Gaya Hidup & Hobi', icon: 'auto_awesome', bucket: 'wants', sharePercentage: 25 },
  { category: 'Lain-lain', icon: 'more_horiz', bucket: 'wants', sharePercentage: 5 },
  { category: 'Tabungan & Investasi', icon: 'account_balance', bucket: 'savings', sharePercentage: 20 },
];

export const BudgetView: React.FC = () => {
  const { setIsAddTxOpen, transactions, goals, deleteTransaction } = useApp();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Filter transactions
  const incomeTx = useMemo(() => transactions.filter(t => t.type === 'income'), [transactions]);
  const expenseTx = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);

  const totalIncome = useMemo(() => {
    return incomeTx.reduce((acc, t) => acc + t.amount, 0);
  }, [incomeTx]);

  const totalSavedInGoals = useMemo(() => {
    return goals.reduce((acc, g) => acc + g.currentAmount, 0);
  }, [goals]);

  const [customIncomeTarget, setCustomIncomeTarget] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mm_custom_income_target');
      return saved ? Number(saved) : 0;
    }
    return 0;
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState<string>('');

  // 50/30/20 Rule Targets based on Income
  const baseIncome = totalIncome > 0 ? totalIncome : customIncomeTarget;
  const needsTarget = Math.round(baseIncome * 0.5);
  const wantsTarget = Math.round(baseIncome * 0.3);
  const savingsTarget = Math.round(baseIncome * 0.2);

  // Spent amounts categorized by bucket
  const needsSpent = useMemo(() => {
    return expenseTx
      .filter(t => getCategoryBucket(t.category) === 'needs')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [expenseTx]);

  const wantsSpent = useMemo(() => {
    return expenseTx
      .filter(t => getCategoryBucket(t.category) === 'wants')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [expenseTx]);

  const savingsSpentFromTx = useMemo(() => {
    return expenseTx
      .filter(t => getCategoryBucket(t.category) === 'savings')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [expenseTx]);

  const totalSavingsSpent = totalSavedInGoals + savingsSpentFromTx;

  // Build Pos Anggaran detailed list
  const posAnggaranList = useMemo(() => {
    const listMap = new Map<string, {
      category: string;
      icon: string;
      bucket: 'needs' | 'wants' | 'savings';
      allocated: number;
      spent: number;
      txList: typeof transactions;
    }>();

    // Initialize defaults
    DEFAULT_POS_DEFS.forEach(def => {
      const allocated = Math.round((baseIncome * def.sharePercentage) / 100);
      listMap.set(def.category.toLowerCase(), {
        category: def.category,
        icon: def.icon,
        bucket: def.bucket,
        allocated,
        spent: 0,
        txList: [],
      });
    });

    // Populate with actual expense transactions
    expenseTx.forEach(tx => {
      const key = tx.category.trim().toLowerCase();
      if (listMap.has(key)) {
        const item = listMap.get(key)!;
        item.spent += tx.amount;
        item.txList.push(tx);
      } else {
        // Custom category
        const bucket = getCategoryBucket(tx.category);
        listMap.set(key, {
          category: tx.category,
          icon: bucket === 'needs' ? 'home_work' : bucket === 'savings' ? 'account_balance' : 'auto_awesome',
          bucket,
          allocated: Math.round(baseIncome * 0.05), // default 5%
          spent: tx.amount,
          txList: [tx],
        });
      }
    });

    // If Tabungan & Investasi, also include totalSavedInGoals if spent is 0
    const savingsKey = 'tabungan & investasi';
    if (listMap.has(savingsKey)) {
      const item = listMap.get(savingsKey)!;
      if (item.spent === 0 && totalSavedInGoals > 0) {
        item.spent = totalSavedInGoals;
      }
    }

    return Array.from(listMap.values());
  }, [expenseTx, baseIncome, totalSavedInGoals]);

  const toggleExpand = (catName: string) => {
    setExpandedCategory(expandedCategory === catName ? null : catName);
  };

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
        <div className="col-span-12 lg:col-span-7 glass-card p-6 md:p-8 rounded-[24px] flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 border border-[#8fbc8f]/30">
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
            <p className="text-xs md:text-sm text-[#424940] mb-6">Sewa, makan, listrik, cicilan & transportasi.</p>

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
                  className={`h-full transition-all duration-1000 ${
                    needsSpent > needsTarget 
                      ? 'bg-[#ba1a1a]' 
                      : 'bg-gradient-to-r from-[#8fbc8f] to-[#3e6842]'
                  }`} 
                  style={{ width: `${needsTarget > 0 ? Math.min(100, Math.round((needsSpent / needsTarget) * 100)) : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Visualizer */}
        <div className="col-span-12 lg:col-span-5 glass-card p-6 md:p-8 rounded-[24px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full text-center">
            <p className="text-xs md:text-sm text-[#424940] mb-1 font-semibold">
              Total Pemasukan / Anggaran
            </p>
            
            {isEditingTarget ? (
              <div className="flex items-center justify-center gap-2 mb-4">
                <input
                  type="number"
                  placeholder="Nominal budget"
                  value={tempTarget}
                  onChange={(e) => setTempTarget(e.target.value)}
                  className="w-44 px-3 py-1.5 text-sm bg-white border border-[#3e6842] rounded-xl outline-none font-bold text-[#0e1d25]"
                  autoFocus
                />
                <button
                  onClick={() => {
                    const num = Number(tempTarget);
                    if (!isNaN(num) && num >= 0) {
                      setCustomIncomeTarget(num);
                      localStorage.setItem('mm_custom_income_target', num.toString());
                    }
                    setIsEditingTarget(false);
                  }}
                  className="px-3 py-1.5 bg-[#3e6842] text-white rounded-xl text-xs font-bold hover:bg-[#3e6842]/90 cursor-pointer"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setIsEditingTarget(false)}
                  className="px-2 py-1.5 text-xs text-[#727970] hover:text-[#0e1d25] cursor-pointer"
                >
                  Batal
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 mb-4">
                <p className="text-3xl md:text-4xl font-bold text-[#3e6842]">
                  Rp {new Intl.NumberFormat('id-ID').format(baseIncome)}
                </p>
                {totalIncome === 0 && (
                  <button
                    onClick={() => {
                      setTempTarget(customIncomeTarget ? customIncomeTarget.toString() : '');
                      setIsEditingTarget(true);
                    }}
                    className="p-1.5 text-[#3e6842] hover:bg-[#8fbc8f]/20 rounded-lg transition-colors cursor-pointer"
                    title="Atur Target Anggaran"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                )}
              </div>
            )}

            {baseIncome === 0 && (
              <p className="text-xs text-[#727970] mb-4 bg-[#f4f8f5] p-2.5 rounded-xl border border-dashed border-[#c2c9be]">
                Belum ada transaksi pemasukan. Catat transaksi pemasukan atau klik icon pensil untuk menentukan target anggaran bulanan.
              </p>
            )}

            <div className="space-y-6">
              {/* Segmented Progress Bar */}
              <div className="w-full h-4 bg-[#d5e5ef] rounded-full overflow-hidden flex shadow-inner">
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
        <div className="col-span-12 md:col-span-6 glass-card p-6 md:p-8 rounded-[24px] hover:-translate-y-1 transition-all duration-300 border border-[#d2ad35]/30">
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
                className={`h-full transition-all duration-1000 ${
                  wantsSpent > wantsTarget ? 'bg-[#ba1a1a]' : 'bg-[#d2ad35]'
                }`} 
                style={{ width: `${wantsTarget > 0 ? Math.min(100, Math.round((wantsSpent / wantsTarget) * 100)) : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* 20% Savings */}
        <div className="col-span-12 md:col-span-6 glass-card p-6 md:p-8 rounded-[24px] hover:-translate-y-1 transition-all duration-300 border border-[#3e6842]/30">
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
                Rp {new Intl.NumberFormat('id-ID').format(totalSavingsSpent)}
              </span>
              <span className="text-xs text-[#424940]">
                Target (20%): Rp {new Intl.NumberFormat('id-ID').format(savingsTarget)}
              </span>
            </div>

            <div className="w-full bg-[#d5e5ef] rounded-full h-3 overflow-hidden">
              <div 
                className="bg-[#3e6842] h-full transition-all duration-1000" 
                style={{ width: `${savingsTarget > 0 ? Math.min(100, Math.round((totalSavingsSpent / savingsTarget) * 100)) : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold text-[#0e1d25]">Rincian Pengeluaran & Anggaran</h3>
            <p className="text-xs md:text-sm text-[#424940]">Pemetaan detail alokasi vs realisasi pengeluaran tiap pos.</p>
          </div>
          <button
            onClick={() => setIsAddTxOpen(true)}
            className="bg-[#3e6842] text-white px-5 py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-[#3e6842]/90 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Tambah Transaksi</span>
          </button>
        </div>

        <div className="glass-card rounded-[24px] overflow-hidden border border-[#c2c9be]/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-[#e7f6ff] border-b border-[#d5e5ef] text-xs font-bold text-[#0e1d25]">
                  <th className="px-6 py-4">Kategori & Pos</th>
                  <th className="px-6 py-4">Alokasi Anggaran</th>
                  <th className="px-6 py-4">Terpakai</th>
                  <th className="px-6 py-4">Sisa Anggaran</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-4 py-4 text-center">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d5e5ef] text-xs md:text-sm">
                {posAnggaranList.map((item) => {
                  const remaining = item.allocated - item.spent;
                  const isOver = item.spent > item.allocated;
                  const isNear = !isOver && item.allocated > 0 && item.spent >= item.allocated * 0.8;
                  const isExpanded = expandedCategory === item.category;

                  let posBadgeLabel = '50% Kebutuhan';
                  let posBadgeBg = 'bg-[#8fbc8f]/20 text-[#3e6842]';
                  if (item.bucket === 'wants') {
                    posBadgeLabel = '30% Keinginan';
                    posBadgeBg = 'bg-[#d2ad35]/20 text-[#735c00]';
                  } else if (item.bucket === 'savings') {
                    posBadgeLabel = '20% Tabungan';
                    posBadgeBg = 'bg-[#3e6842]/20 text-[#3e6842]';
                  }

                  return (
                    <React.Fragment key={item.category}>
                      <tr className="hover:bg-[#8fbc8f]/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#d5e5ef] flex items-center justify-center text-[#3e6842] shrink-0">
                              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            </div>
                            <div>
                              <p className="font-bold text-[#0e1d25] text-sm">{item.category}</p>
                              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold mt-0.5 ${posBadgeBg}`}>
                                {posBadgeLabel}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#424940] font-semibold">
                          Rp {new Intl.NumberFormat('id-ID').format(item.allocated)}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#0e1d25]">
                          Rp {new Intl.NumberFormat('id-ID').format(item.spent)}
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          <span className={remaining < 0 ? 'text-[#ba1a1a] font-bold' : 'text-[#3e6842]'}>
                            Rp {new Intl.NumberFormat('id-ID').format(remaining)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block ${
                            isOver
                              ? 'bg-[#ffdad6] text-[#ba1a1a]'
                              : isNear
                              ? 'bg-[#ffe088]/40 text-[#534200]'
                              : 'bg-[#8fbc8f]/20 text-[#234c29]'
                          }`}>
                            {isOver ? 'Melebihi Batas' : isNear ? 'Mendekati Batas' : 'Aman'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => toggleExpand(item.category)}
                            className="p-1.5 rounded-lg hover:bg-black/5 text-[#424940] transition-colors cursor-pointer"
                            title="Lihat Rincian Transaksi"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Transaction Row Detail */}
                      {isExpanded && (
                        <tr className="bg-[#f7faf8]">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="bg-white/90 p-4 rounded-xl border border-[#c2c9be]/40 space-y-3">
                              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                                <h6 className="text-xs font-bold text-[#0e1d25] flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-[16px] text-[#3e6842]">receipt</span>
                                  Rincian Transaksi Pos {item.category} ({item.txList.length})
                                </h6>
                              </div>

                              {item.txList.length === 0 ? (
                                <p className="text-xs text-[#727970] italic">
                                  Belum ada catatan transaksi pengeluaran spesifik di pos ini.
                                </p>
                              ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {item.txList.map(tx => (
                                    <div key={tx.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#f4f8f5] hover:bg-[#eaf2eb] transition-colors">
                                      <div>
                                        <p className="font-bold text-[#0e1d25]">{tx.description}</p>
                                        <p className="text-[11px] text-[#727970]">{tx.date} • {tx.time || '12:00'}</p>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="font-bold text-[#ba1a1a]">
                                          - Rp {new Intl.NumberFormat('id-ID').format(tx.amount)}
                                        </span>
                                        <button
                                          onClick={() => deleteTransaction(tx.id)}
                                          className="text-[#ba1a1a]/70 hover:text-[#ba1a1a] p-1 rounded cursor-pointer"
                                          title="Hapus Transaksi"
                                        >
                                          <span className="material-symbols-outlined text-[14px]">delete</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
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
