import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const BillsView: React.FC = () => {
  const { bills, toggleBillPaid, deleteBill, setIsAddBillOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'unpaid' | 'paid'>('all');

  const filteredBills = bills.filter(b => {
    if (activeTab === 'unpaid') return !b.isPaid;
    if (activeTab === 'paid') return b.isPaid;
    return true;
  });

  const unpaidTotal = bills.filter(b => !b.isPaid).reduce((acc, b) => acc + b.amount, 0);
  const nextBill = bills.find(b => !b.isPaid);

  // Dynamic month and year for current date
  const now = new Date();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long' });
  const currentMonthYear = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${now.getFullYear()}`;
  
  // Calendar dates generator for current month
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0e1d25]">Pengingat Tagihan</h2>
          <p className="text-xs md:text-sm text-[#424940] mt-0.5">
            Jangan biarkan tagihan mengejutkanmu. Jadwalkan dan lunasi dengan tenang.
          </p>
        </div>

        <button
          onClick={() => setIsAddBillOpen(true)}
          className="bg-[#3e6842] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:bg-[#3e6842]/90 transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Tagihan Baru</span>
        </button>
      </div>

      {/* Summary Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-[20px] p-6 border-l-4 border-[#ba1a1a]">
          <p className="text-xs font-semibold text-[#424940] mb-1">Belum Dibayar</p>
          <h3 className="text-2xl font-bold text-[#ba1a1a]">
            Rp {new Intl.NumberFormat('id-ID').format(unpaidTotal)}
          </h3>
          <p className="text-xs text-[#727970] mt-2">
            {bills.filter(b => !b.isPaid).length} tagihan menunggu
          </p>
        </div>

        <div className="glass-card rounded-[20px] p-6 border-l-4 border-[#3e6842]">
          <p className="text-xs font-semibold text-[#424940] mb-1">Sudah Dilunasi</p>
          <h3 className="text-2xl font-bold text-[#3e6842]">
            Rp {new Intl.NumberFormat('id-ID').format(bills.filter(b => b.isPaid).reduce((acc, b) => acc + b.amount, 0))}
          </h3>
          <p className="text-xs text-[#727970] mt-2">
            {bills.filter(b => b.isPaid).length} tagihan lunas
          </p>
        </div>

        <div className="glass-card rounded-[20px] p-6 border-l-4 border-[#d2ad35]">
          <p className="text-xs font-semibold text-[#424940] mb-1">Tagihan Terdekat</p>
          {nextBill ? (
            <>
              <h3 className="text-lg font-bold text-[#0e1d25] truncate">{nextBill.name}</h3>
              <p className="text-xs text-[#735c00] font-semibold mt-1">
                Jatuh tempo: {nextBill.dueDate} (Rp {new Intl.NumberFormat('id-ID').format(nextBill.amount)})
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-[#0e1d25]">Tidak Ada Tagihan</h3>
              <p className="text-xs text-[#727970] font-semibold mt-1">Semua tagihan sudah lunas atau belum dibuat</p>
            </>
          )}
        </div>
      </section>

      {/* Interactive Calendar View */}
      <section className="glass-panel rounded-[24px] p-6 md:p-8 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-[#0e1d25] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3e6842]">calendar_month</span>
            Jadwal Tagihan Bulan Ini
          </h3>
          <span className="text-xs font-bold text-[#3e6842]">{currentMonthYear}</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 md:gap-2 text-center text-xs font-bold text-[#727970] mb-2">
          <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 md:gap-2 text-xs">
          {daysInMonth.map((day) => {
            const billOnDay = bills.find(b => {
              const d = new Date(b.dueDate).getDate();
              return d === day;
            });

            return (
              <div 
                key={day}
                className={`h-12 md:h-16 rounded-xl border p-1.5 flex flex-col justify-between transition-all ${
                  billOnDay 
                    ? billOnDay.isPaid 
                      ? 'bg-[#8fbc8f]/20 border-[#8fbc8f] text-[#3e6842]' 
                      : 'bg-[#ffdad6]/40 border-[#ba1a1a] text-[#ba1a1a]' 
                    : 'bg-white/60 border-[#d5e5ef] text-[#0e1d25]'
                }`}
              >
                <span className="font-bold text-[10px] md:text-xs text-left">{day}</span>
                {billOnDay && (
                  <span className="text-[9px] md:text-[10px] font-bold truncate leading-tight">
                    {billOnDay.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Filter Tabs & Bills List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-[#0e1d25]">Daftar Tagihan</h3>
          
          <div className="flex p-1 bg-[#e7f6ff] rounded-xl border border-[#d5e5ef] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'all' ? 'bg-[#3e6842] text-white' : 'text-[#424940]'
              }`}
            >
              Semua ({bills.length})
            </button>
            <button
              onClick={() => setActiveTab('unpaid')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'unpaid' ? 'bg-[#3e6842] text-white' : 'text-[#424940]'
              }`}
            >
              Belum Lunas ({bills.filter(b => !b.isPaid).length})
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'paid' ? 'bg-[#3e6842] text-white' : 'text-[#424940]'
              }`}
            >
              Lunas ({bills.filter(b => b.isPaid).length})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredBills.length === 0 ? (
            <div className="glass-card rounded-[20px] p-8 text-center text-[#727970] space-y-3">
              <span className="material-symbols-outlined text-[#3e6842] text-[36px]">receipt_long</span>
              <p className="font-bold text-base text-[#0e1d25]">Belum Ada Tagihan</p>
              <p className="text-xs text-[#727970] max-w-sm mx-auto">
                Tambahkan pengingat tagihan rutin bulananmu untuk memantau waktu jatuh tempo.
              </p>
              <button
                onClick={() => setIsAddBillOpen(true)}
                className="bg-[#3e6842] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:bg-[#3e6842]/90 inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Tambah Tagihan</span>
              </button>
            </div>
          ) : (
            filteredBills.map((bill) => (
              <div 
                key={bill.id}
                className={`glass-card rounded-[20px] p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  bill.isPaid ? 'opacity-70 bg-white/40' : ''
                }`}
              >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleBillPaid(bill.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                    bill.isPaid 
                      ? 'bg-[#3e6842] border-[#3e6842] text-white' 
                      : 'border-[#727970] hover:border-[#3e6842] text-transparent'
                  }`}
                  title={bill.isPaid ? 'Tandai Belum Lunas' : 'Tandai Lunas'}
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold text-base text-[#0e1d25] ${bill.isPaid ? 'line-through text-[#727970]' : ''}`}>
                      {bill.name}
                    </h4>
                    <span className="text-[10px] font-bold bg-[#e7f6ff] text-[#3e6842] px-2 py-0.5 rounded-full">
                      {bill.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#424940] mt-0.5">
                    Jatuh Tempo: <span className="font-semibold text-[#0e1d25]">{bill.dueDate}</span>
                    {bill.isPaid && bill.paidDate && ` • Dilunasi: ${bill.paidDate}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#d5e5ef]">
                <div className="text-right">
                  <p className="font-extrabold text-base md:text-lg text-[#0e1d25]">
                    Rp {new Intl.NumberFormat('id-ID').format(bill.amount)}
                  </p>
                  <span className={`text-[11px] font-bold ${
                    bill.isPaid ? 'text-[#3e6842]' : 'text-[#ba1a1a]'
                  }`}>
                    {bill.isPaid ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}
                  </span>
                </div>

                <button
                  onClick={() => deleteBill(bill.id)}
                  className="p-2 text-[#727970] hover:text-[#ba1a1a] transition-colors rounded-lg hover:bg-black/5"
                  title="Hapus Tagihan"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
        </div>
      </section>
    </div>
  );
};
