import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const CalculatorView: React.FC = () => {
  const { addGoal, showToast } = useApp();

  // Dana Darurat State
  const [monthlyExpense, setMonthlyExpense] = useState<number>(5000000);
  const [dependentStatus, setDependentStatus] = useState<number>(0); // 0: Single, 1: Menikah, 2: Menikah + Anak

  // Emergency Fund Calculation
  // 0 -> 3 months, 1 -> 6 months, 2 -> 12 months
  const emergencyMultipliers = [3, 6, 12];
  const emergencyMonths = emergencyMultipliers[dependentStatus];
  const totalEmergencyFund = monthlyExpense * emergencyMonths;

  const statusLabels = [
    { name: 'Single (3–6 bln)', quote: 'Cukup untuk memberimu napas selama 3 bulan penuh.' },
    { name: 'Menikah (6–9 bln)', quote: 'Cukup untuk melindungi kebutuhan keluarga selama 6 bulan.' },
    { name: 'Menikah + Anak (9–12 bln)', quote: 'Perlindungan maksimal 12 bulan untuk keamanan keluarga utuh.' }
  ];

  // Proyeksi Investasi State
  const [initialCapitalStr, setInitialCapitalStr] = useState<string>('10.000.000');
  const [monthlyContributionStr, setMonthlyContributionStr] = useState<string>('1.000.000');
  const [returnRate, setReturnRate] = useState<number>(10); // 10%
  const [durationYears, setDurationYears] = useState<number>(5);

  const initialCapital = parseFloat(initialCapitalStr.replace(/[^0-9]/g, '')) || 0;
  const monthlyContribution = parseFloat(monthlyContributionStr.replace(/[^0-9]/g, '')) || 0;

  // Risk profile badge determination
  const getRiskBadge = (rate: number) => {
    if (rate <= 6) return { label: 'KONSERVATIF', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (rate <= 12) return { label: 'MODERATE', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    return { label: 'AGRESIF', color: 'bg-amber-100 text-amber-800 border-amber-200' };
  };

  const riskBadge = getRiskBadge(returnRate);

  // Compound Interest Calculation
  const calculateYearlyProjection = () => {
    const r = returnRate / 100 / 12;
    const yearlyData = [];
    
    for (let yr = 1; yr <= Math.max(1, durationYears); yr++) {
      const n = yr * 12;
      const fvInitial = initialCapital * Math.pow(1 + r, n);
      const fvMonthly = r > 0 ? monthlyContribution * ((Math.pow(1 + r, n) - 1) / r) : monthlyContribution * n;
      const totalFV = Math.round(fvInitial + fvMonthly);
      const invested = initialCapital + (monthlyContribution * n);
      const interest = Math.max(0, totalFV - invested);

      yearlyData.push({
        year: yr,
        totalFV,
        invested,
        interest
      });
    }

    return yearlyData;
  };

  const yearlyProjections = calculateYearlyProjection();
  const lastProjection = yearlyProjections[yearlyProjections.length - 1] || { totalFV: 0, invested: 0, interest: 0 };
  const totalFutureValue = lastProjection.totalFV;
  const totalInterest = lastProjection.interest;

  // Max value for bar heights scaling
  const maxBarValue = Math.max(...yearlyProjections.map(p => p.totalFV), 1);

  // Handle Save Emergency Fund to Savings Goal
  const handleSaveEmergencyGoal = () => {
    addGoal({
      title: 'Dana Darurat',
      targetDescription: `Jaring pengaman ${emergencyMonths} bulan pengalan rutin`,
      targetAmount: totalEmergencyFund,
      currentAmount: 0,
      categoryIcon: 'shield',
      estimatedDate: `${durationYears || 1} Tahun`
    });
    showToast(`Dana Darurat (Rp ${new Intl.NumberFormat('id-ID').format(totalEmergencyFund)}) berhasil ditambahkan ke Target Tabungan!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* View Title */}
      <div>
        <h2 className="text-2xl font-bold text-[#0e1d25]">Kalkulator Finansial</h2>
        <p className="text-xs md:text-sm text-[#424940] mt-0.5">
          Hitung dana darurat ideal dan proyeksikan pertumbuhan investasi Anda.
        </p>
      </div>

      {/* Side by Side Calculators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* ===================== DANA DARURAT CARD ===================== */}
        <div className="bg-white rounded-[24px] p-6 md:p-7 border border-[#e2e8f0] shadow-sm flex flex-col justify-between space-y-6">
          {/* Card Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e8f5eb] flex items-center justify-center text-[#3e6842] shrink-0">
              <span className="material-symbols-outlined text-[24px]">shield</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0e1d25]">Dana Darurat</h3>
              <p className="text-xs text-[#727970]">Berapa jaring pengaman yang kamu butuhkan?</p>
            </div>
          </div>

          {/* Slider 1: Pengeluaran Bulanan */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#727970]">
                PENGELUARAN BULANAN
              </label>
              <span className="text-sm font-extrabold text-[#1c4d25]">
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
              className="w-full accent-[#3e6842] cursor-pointer"
            />
          </div>

          {/* Slider 2: Status Tanggungan */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#727970]">
                STATUS TANGGUNGAN
              </label>
              <span className="text-sm font-extrabold text-[#1c4d25]">
                {statusLabels[dependentStatus].name}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={1}
              value={dependentStatus}
              onChange={e => setDependentStatus(Number(e.target.value))}
              className="w-full accent-[#3e6842] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-[#727970] pt-1">
              <span>SINGLE</span>
              <span>MENIKAH</span>
              <span>MENIKAH + ANAK</span>
            </div>
          </div>

          {/* Result Box */}
          <div className="bg-[#eaf5ed] rounded-2xl p-5 border border-[#d2e8d7] space-y-1">
            <span className="text-[11px] font-bold text-[#2d5e35] uppercase tracking-wider block">
              TARGET IDEAL
            </span>
            <div className="text-2xl md:text-3xl font-extrabold text-[#1c4d25]">
              Rp {new Intl.NumberFormat('id-ID').format(totalEmergencyFund)}
            </div>
            <p className="text-xs italic text-[#424940] pt-1">
              "{statusLabels[dependentStatus].quote}"
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSaveEmergencyGoal}
            className="w-full bg-[#2a5933] hover:bg-[#204527] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>Simpan ke Target Tabungan</span>
            <span>→</span>
          </button>
        </div>


        {/* ===================== PROYEKSI INVESTASI CARD ===================== */}
        <div className="bg-white rounded-[24px] p-6 md:p-7 border border-[#e2e8f0] shadow-sm flex flex-col justify-between space-y-6">
          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#fff4db] text-[#b8860b] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">trending_up</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0e1d25]">Proyeksi Investasi</h3>
                <p className="text-xs text-[#727970]">Lihat bagaimana uangmu tumbuh seiring waktu.</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border tracking-wider uppercase ${riskBadge.color}`}>
              {riskBadge.label}
            </span>
          </div>

          {/* Inputs Row 1: Modal Awal & Setoran Bulanan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#727970] mb-1">
                MODAL AWAL (RP)
              </label>
              <input
                type="text"
                value={initialCapitalStr}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setInitialCapitalStr(val ? new Intl.NumberFormat('id-ID').format(parseInt(val, 10)) : '');
                }}
                className="w-full p-2.5 bg-[#f4f8f5] rounded-xl border border-[#c2c9be]/60 text-sm font-bold text-[#0e1d25] outline-none focus:border-[#3e6842]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#727970] mb-1">
                SETORAN BULANAN (RP)
              </label>
              <input
                type="text"
                value={monthlyContributionStr}
                onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setMonthlyContributionStr(val ? new Intl.NumberFormat('id-ID').format(parseInt(val, 10)) : '');
                }}
                className="w-full p-2.5 bg-[#f4f8f5] rounded-xl border border-[#c2c9be]/60 text-sm font-bold text-[#0e1d25] outline-none focus:border-[#3e6842]"
              />
            </div>
          </div>

          {/* Inputs Row 2: Estimasi Bunga & Durasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Estimasi Bunga */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#727970]">
                  ESTIMASI BUNGA (%)
                </label>
                <span className="font-extrabold text-[#1c4d25]">{returnRate}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                step={0.5}
                value={returnRate}
                onChange={e => setReturnRate(Number(e.target.value))}
                className="w-full accent-[#3e6842] cursor-pointer"
              />
            </div>

            {/* Durasi */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#727970]">
                  DURASI (TAHUN)
                </label>
                <span className="font-extrabold text-[#1c4d25]">{durationYears}</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={durationYears}
                onChange={e => setDurationYears(Number(e.target.value))}
                className="w-full accent-[#3e6842] cursor-pointer"
              />
            </div>
          </div>

          {/* Growth Bar Chart Container */}
          <div className="bg-[#eaf5ed]/60 rounded-2xl p-4 border border-[#d2e8d7]/80 h-44 flex items-end justify-between gap-2 overflow-x-auto">
            {yearlyProjections.map((p) => {
              const heightPercent = Math.max(12, Math.round((p.totalFV / maxBarValue) * 100));
              return (
                <div
                  key={p.year}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                    <div className="bg-[#0e1d25] text-white text-[10px] font-bold py-1 px-2 rounded-md whitespace-nowrap shadow-md">
                      Thn {p.year}: Rp {new Intl.NumberFormat('id-ID').format(p.totalFV)}
                    </div>
                    <div className="w-1.5 h-1.5 bg-[#0e1d25] rotate-45 -mt-1"></div>
                  </div>

                  {/* Gradient Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-[#2a5933] via-[#3e6842] to-[#6bb377] rounded-t-md transition-all duration-300 hover:opacity-90 shadow-xs"
                  />
                </div>
              );
            })}
          </div>

          {/* Results Footer */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pt-1 border-t border-[#f0f4f1]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#727970] block">
                TOTAL HASIL PROYEKSI
              </span>
              <div className="text-xl md:text-2xl font-extrabold text-[#1c4d25]">
                Rp {new Intl.NumberFormat('id-ID').format(totalFutureValue)}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[11px] text-[#727970]">Keuntungan dari bunga:</span>
              <div className="text-xs md:text-sm font-extrabold text-[#2a5933]">
                +Rp {new Intl.NumberFormat('id-ID').format(totalInterest)}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
