import React, { useState } from 'react';

export const CalculatorView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'emergency' | 'investment'>('emergency');

  // Emergency Fund State
  const [monthlyExpense, setMonthlyExpense] = useState<number>(5000000);
  const [dependents, setDependents] = useState<number>(1);
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married'>('single');

  // Calculation for Emergency Fund
  // Single 0 dep: 3-6x, Married 1 dep: 6-9x, etc.
  const multiplier = maritalStatus === 'single' ? (dependents === 0 ? 6 : 9) : (dependents === 0 ? 9 : 12);
  const totalEmergencyFund = monthlyExpense * multiplier;

  // Investment Projection State
  const [initialCapital, setInitialCapital] = useState<number>(10000000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1000000);
  const [years, setYears] = useState<number>(10);
  const [returnRate, setReturnRate] = useState<number>(8); // 8%

  // Compound Interest Calculation
  // FV = P*(1+r/n)^(n*t) + PMT * [ ((1+r/n)^(n*t) - 1) / (r/n) ]
  const calculateFutureValue = () => {
    const r = returnRate / 100 / 12;
    const n = years * 12;
    const fvInitial = initialCapital * Math.pow(1 + r, n);
    const fvMonthly = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    return Math.round(fvInitial + fvMonthly);
  };

  const futureValue = calculateFutureValue();
  const totalInvested = initialCapital + monthlyContribution * 12 * years;
  const totalInterest = Math.max(0, futureValue - totalInvested);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0e1d25]">Kalkulator Finansial Mindful</h2>
          <p className="text-xs md:text-sm text-[#424940] mt-0.5">
            Proyeksikan masa depan finansialmu dengan kalkulasi realistis dan jernih.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-[#e7f6ff] rounded-xl border border-[#d5e5ef] w-full md:w-auto">
          <button
            onClick={() => setActiveTab('emergency')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg font-bold text-xs md:text-sm transition-all ${
              activeTab === 'emergency'
                ? 'bg-[#3e6842] text-white shadow-xs'
                : 'text-[#424940] hover:text-[#0e1d25]'
            }`}
          >
            Dana Darurat
          </button>
          <button
            onClick={() => setActiveTab('investment')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg font-bold text-xs md:text-sm transition-all ${
              activeTab === 'investment'
                ? 'bg-[#3e6842] text-white shadow-xs'
                : 'text-[#424940] hover:text-[#0e1d25]'
            }`}
          >
            Proyeksi Investasi
          </button>
        </div>
      </div>

      {activeTab === 'emergency' ? (
        /* Emergency Fund Calculator */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Controls */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 md:p-8 space-y-6 border border-[#c2c9be]/50">
            <h3 className="font-bold text-lg text-[#0e1d25] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3e6842]">shield</span>
              Hitung Dana Darurat Ideal
            </h3>

            {/* Monthly Expense Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                <label className="text-[#0e1d25]">Pengeluaran Rutin Bulanan</label>
                <span className="text-[#3e6842] font-bold">
                  Rp {new Intl.NumberFormat('id-ID').format(monthlyExpense)}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={30000000}
                step={500000}
                value={monthlyExpense}
                onChange={e => setMonthlyExpense(Number(e.target.value))}
              />
              <div className="flex justify-between text-[10px] text-[#727970]">
                <span>Rp 1 Juta</span>
                <span>Rp 30 Juta</span>
              </div>
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-semibold text-[#0e1d25] block">
                Status Pernikahan
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMaritalStatus('single')}
                  className={`py-3 px-4 rounded-xl border text-xs md:text-sm font-bold transition-all ${
                    maritalStatus === 'single'
                      ? 'bg-[#3e6842] text-white border-[#3e6842]'
                      : 'bg-white border-[#c2c9be] text-[#424940] hover:bg-[#e7f6ff]'
                  }`}
                >
                  Lajang
                </button>
                <button
                  type="button"
                  onClick={() => setMaritalStatus('married')}
                  className={`py-3 px-4 rounded-xl border text-xs md:text-sm font-bold transition-all ${
                    maritalStatus === 'married'
                      ? 'bg-[#3e6842] text-white border-[#3e6842]'
                      : 'bg-white border-[#c2c9be] text-[#424940] hover:bg-[#e7f6ff]'
                  }`}
                >
                  Menikah
                </button>
              </div>
            </div>

            {/* Dependents Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                <label className="text-[#0e1d25]">Jumlah Tanggungan (Anak / Orang Tua)</label>
                <span className="text-[#3e6842] font-bold">{dependents} orang</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={dependents}
                onChange={e => setDependents(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-[#FAF8F5] to-[#e0f0fb] border border-[#8fbc8f]/40">
            <div>
              <span className="text-xs font-bold text-[#3e6842] uppercase tracking-wider block mb-2">
                Rekomendasi Mindful
              </span>
              <h4 className="text-xl md:text-2xl font-bold text-[#0e1d25] mb-4">
                Target Dana Darurat
              </h4>

              <div className="p-4 rounded-2xl bg-white/80 border border-[#8fbc8f]/30 mb-6">
                <p className="text-xs text-[#727970] mb-1">Total Target ideal ({multiplier}x pengeluaran)</p>
                <p className="text-2xl md:text-3xl font-extrabold text-[#3e6842]">
                  Rp {new Intl.NumberFormat('id-ID').format(totalEmergencyFund)}
                </p>
              </div>

              <div className="space-y-3 text-xs text-[#424940]">
                <div className="flex justify-between border-b border-[#d5e5ef] pb-2">
                  <span>Pengeluaran per Bulan</span>
                  <span className="font-bold text-[#0e1d25]">
                    Rp {new Intl.NumberFormat('id-ID').format(monthlyExpense)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#d5e5ef] pb-2">
                  <span>Faktor Pengali Kebutuhan</span>
                  <span className="font-bold text-[#0e1d25]">{multiplier} Bulan</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#8fbc8f]/15 border border-[#8fbc8f]/30 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#3e6842] text-[20px] shrink-0">spa</span>
              <p className="text-xs text-[#234c29] leading-relaxed">
                Dana darurat memberi rasa aman dan waktu untuk bernapas jika ada fluktuasi tak terduga dalam hidup.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Investment Projection Calculator */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 md:p-8 space-y-6 border border-[#c2c9be]/50">
            <h3 className="font-bold text-lg text-[#0e1d25] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3e6842]">trending_up</span>
              Simulasi Pertumbuhan Dana Majemuk
            </h3>

            {/* Initial Capital */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                <label className="text-[#0e1d25]">Modal Awal</label>
                <span className="text-[#3e6842] font-bold">
                  Rp {new Intl.NumberFormat('id-ID').format(initialCapital)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100000000}
                step={2500000}
                value={initialCapital}
                onChange={e => setInitialCapital(Number(e.target.value))}
              />
            </div>

            {/* Monthly Contribution */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                <label className="text-[#0e1d25]">Setoran Rutin Bulanan</label>
                <span className="text-[#3e6842] font-bold">
                  Rp {new Intl.NumberFormat('id-ID').format(monthlyContribution)}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={10000000}
                step={250000}
                value={monthlyContribution}
                onChange={e => setMonthlyContribution(Number(e.target.value))}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                <label className="text-[#0e1d25]">Jangka Waktu Investasi</label>
                <span className="text-[#3e6842] font-bold">{years} Tahun</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={years}
                onChange={e => setYears(Number(e.target.value))}
              />
            </div>

            {/* Return Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
                <label className="text-[#0e1d25]">Estimasi Imbal Hasil Pertahun (%)</label>
                <span className="text-[#3e6842] font-bold">{returnRate}%</span>
              </div>
              <input
                type="range"
                min={3}
                max={20}
                step={0.5}
                value={returnRate}
                onChange={e => setReturnRate(Number(e.target.value))}
              />
              <p className="text-[11px] text-[#727970]">
                Contoh: Obligasi Negara (~6%), Reksadana Campuran (~8-10%), Saham Index (~12%).
              </p>
            </div>
          </div>

          {/* Results Projection */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-[#FAF8F5] to-[#e0f0fb] border border-[#8fbc8f]/40">
            <div>
              <span className="text-xs font-bold text-[#3e6842] uppercase tracking-wider block mb-2">
                Hasil Proyeksi Ke depan
              </span>
              <h4 className="text-xl md:text-2xl font-bold text-[#0e1d25] mb-4">
                Total Estimasi Nilai
              </h4>

              <div className="p-4 rounded-2xl bg-white/90 border border-[#8fbc8f]/30 mb-6">
                <p className="text-xs text-[#727970] mb-1">Masa Depan ({years} tahun)</p>
                <p className="text-2xl md:text-3xl font-extrabold text-[#3e6842]">
                  Rp {new Intl.NumberFormat('id-ID').format(futureValue)}
                </p>
              </div>

              <div className="space-y-3 text-xs text-[#424940]">
                <div className="flex justify-between border-b border-[#d5e5ef] pb-2">
                  <span>Total Modal Yang Disetor</span>
                  <span className="font-bold text-[#0e1d25]">
                    Rp {new Intl.NumberFormat('id-ID').format(totalInvested)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#d5e5ef] pb-2">
                  <span>Estimasi Bunga / Return Majemuk</span>
                  <span className="font-bold text-[#3e6842]">
                    + Rp {new Intl.NumberFormat('id-ID').format(totalInterest)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#ffe088]/20 border border-[#d2ad35]/30 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#735c00] text-[20px] shrink-0">auto_awesome</span>
              <p className="text-xs text-[#534200] leading-relaxed">
                Keajaiban bunga majemuk berpihak pada waktu. Semakin awal kamu mulai, semakin ringan langkahmu.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
