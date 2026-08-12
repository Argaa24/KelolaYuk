import React from 'react';
import { useApp } from '../../context/AppContext';

export const SavingsView: React.FC = () => {
  const { 
    profile, 
    goals, 
    setIsAddSavingsOpen, 
    setSelectedSavingsGoalId, 
    setIsAddGoalOpen,
    deleteGoal 
  } = useApp();

  const handleDepositClick = (goalId: string) => {
    setSelectedSavingsGoalId(goalId);
    setIsAddSavingsOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Welcome Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-[#0e1d25]">
            Halo, {profile.name.split(' ')[0]}.
          </h3>
          <p className="text-xs md:text-sm text-[#424940] mt-1">
            Kamu selangkah lebih dekat dengan impianmu hari ini.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-[#ffe088] text-[#241a00] px-5 py-2.5 rounded-full shadow-xs font-semibold text-xs md:text-sm shrink-0">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            emoji_events
          </span>
          <span>Pahlawan Konsistensi</span>
        </div>
      </section>

      {/* Goals Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full glass-card rounded-[24px] p-8 md:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#8fbc8f]/20 text-[#3e6842] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">savings</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#0e1d25]">Belum Ada Target Tabungan</h4>
              <p className="text-xs md:text-sm text-[#727970] max-w-md mx-auto mt-1">
                Buat target pertamamu (misal: Dana Darurat, Liburan, atau Laptop Baru) untuk mulai menabung dari Rp 0.
              </p>
            </div>
            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="bg-[#3e6842] text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl shadow-md hover:bg-[#3e6842]/90 inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Buat Target Tabungan Baru</span>
            </button>
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const circumference = 251.2; // 2 * pi * 40
            const strokeDashoffset = circumference - (percentage / 100) * circumference;

            return (
              <div 
                key={goal.id} 
                className="glass-card rounded-[20px] p-6 md:p-8 flex flex-col hover:-translate-y-1 transition-all duration-300 group"
              >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#8fbc8f]/20 flex items-center justify-center text-[#3e6842] shrink-0">
                    <span className="material-symbols-outlined text-[28px] md:text-[32px]">
                      {goal.categoryIcon || 'savings'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg md:text-xl text-[#0e1d25]">{goal.title}</h4>
                    <p className="text-xs text-[#424940]">{goal.targetDescription}</p>
                  </div>
                </div>

                <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="text-[#727970] hover:text-[#ba1a1a] transition-colors p-1"
                  title="Hapus Target"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>

              {/* Progress Ring & Numbers */}
              <div className="flex items-center gap-6 py-2">
                {/* SVG Ring */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-[#e0f0fb] stroke-current" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      strokeWidth="8" 
                    />
                    <circle 
                      className="text-[#3e6842] stroke-current progress-ring-circle" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      strokeWidth="8" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={strokeDashoffset} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl md:text-2xl font-bold text-[#3e6842]">{percentage}%</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[#424940]">Terkumpul</span>
                    <span className="font-bold text-[#0e1d25]">
                      Rp {new Intl.NumberFormat('id-ID').format(goal.currentAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#424940]">Kekurangan</span>
                    <span className="font-bold text-[#5e5e5c]">
                      Rp {new Intl.NumberFormat('id-ID').format(Math.max(0, goal.targetAmount - goal.currentAmount))}
                    </span>
                  </div>
                  <div className="pt-2">
                    <p className="text-[11px] text-[#534200] bg-[#d2ad35]/15 px-3 py-1 rounded-full inline-flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      Estimasi: {goal.estimatedDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-[#d5e5ef] flex gap-3">
                <button 
                  onClick={() => handleDepositClick(goal.id)}
                  className="flex-1 bg-[#3e6842] text-white py-3 rounded-xl font-bold text-xs md:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Tabung Sekarang</span>
                </button>
              </div>
            </div>
          );
        }))}
      </section>

      {/* Insights & Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Milestone Achievement Card */}
        <div className="lg:col-span-2 glass-card rounded-[20px] p-6 md:p-8 overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 text-[#735c00]">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              <span className="text-xs font-bold uppercase tracking-wider">Pencapaian Terbaru</span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-[#0e1d25] mb-2">Pahlawan Konsistensi</h4>
            <p className="text-xs md:text-sm text-[#424940] max-w-md mb-6 leading-relaxed">
              Kamu telah menabung secara rutin selama 12 minggu tanpa terputus. Kebiasaan kecil ini akan membawa dampak besar!
            </p>

            <div className="flex gap-3">
              <div className="bg-[#3e6842]/10 p-3.5 rounded-2xl flex flex-col items-center justify-center w-20">
                <span className="material-symbols-outlined text-[#3e6842] text-[28px]">verified</span>
                <span className="text-[10px] mt-1 font-bold uppercase text-[#3e6842]">Badge</span>
              </div>
              <div className="bg-[#3e6842]/10 p-3.5 rounded-2xl flex flex-col items-center justify-center w-20 opacity-40">
                <span className="material-symbols-outlined text-[#424940] text-[28px]">lock</span>
                <span className="text-[10px] mt-1 font-bold uppercase text-[#424940]">Level Up</span>
              </div>
              <div className="bg-[#3e6842]/10 p-3.5 rounded-2xl flex flex-col items-center justify-center w-20 opacity-40">
                <span className="material-symbols-outlined text-[#424940] text-[28px]">lock</span>
                <span className="text-[10px] mt-1 font-bold uppercase text-[#424940]">Master</span>
              </div>
            </div>
          </div>

          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[180px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              emoji_events
            </span>
          </div>
        </div>

        {/* Add New Goal Card */}
        <button 
          onClick={() => setIsAddGoalOpen(true)}
          className="glass-card rounded-[20px] p-6 md:p-8 border-dashed border-2 border-[#8fbc8f]/50 flex flex-col items-center justify-center group hover:bg-[#8fbc8f]/5 transition-all text-center min-h-[220px]"
        >
          <div className="w-14 h-14 rounded-full bg-[#8fbc8f]/10 flex items-center justify-center text-[#3e6842] mb-3 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[32px]">add_circle</span>
          </div>
          <h4 className="font-bold text-lg text-[#0e1d25]">Tambah Target</h4>
          <p className="text-xs text-[#424940] mt-1">Mulai petualangan finansial barumu di sini.</p>
        </button>
      </section>

      {/* Mindfulness Banner */}
      <section className="bg-[#8fbc8f]/20 border border-[#8fbc8f]/30 rounded-2xl p-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#3e6842] text-[24px]">spa</span>
          <p className="text-[#234c29] text-xs md:text-sm italic font-medium">
            "Menabung bukan tentang seberapa besar jumlahnya, tapi tentang konsistensi niatmu."
          </p>
        </div>
      </section>
    </div>
  );
};
