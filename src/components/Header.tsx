import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { 
    currentView, 
    setCurrentView, 
    setIsAddTxOpen, 
    showToast,
    transactions,
    setSelectedArticle,
    articles,
    profile,
    bills
  } = useApp();

  const unpaidBills = bills.filter(b => !b.isPaid);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const viewTitles: Record<string, string> = {
    dashboard: 'Ringkasan Hari Ini',
    cashflow: 'Arus Kas',
    budget: 'Rencana Anggaran',
    savings: 'Target Tabungan',
    calculator: 'Kalkulator Finansial',
    academy: 'Akademi Uang',
    bills: 'Pengingat Tagihan',
    auth: 'Buat Akun / Masuk',
  };

  // Search filter results
  const filteredTransactions = searchQuery.trim()
    ? transactions.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredArticles = searchQuery.trim()
    ? articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="fixed top-0 right-0 left-0 md:left-72 h-20 bg-[#f4faff]/80 backdrop-blur-md border-b border-[#d5e5ef] z-40 flex justify-between items-center px-4 md:px-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#3e6842] hover:bg-[#e7f6ff] transition-colors"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <div>
          <h2 className="font-bold text-xl md:text-2xl text-[#3e6842] tracking-tight">
            {viewTitles[currentView] || 'KelolaYuk'}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari transaksi, artikel, fitur..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="bg-[#e7f6ff] border-none rounded-full px-5 py-2 pr-10 text-sm w-56 md:w-64 focus:ring-2 focus:ring-[#3e6842]/20 transition-all outline-none text-[#0e1d25] placeholder:text-[#727970]"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#727970] text-[20px]">
              search
            </span>
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-[#d5e5ef] p-3 z-50 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-xs font-bold text-[#727970] uppercase tracking-wider">Hasil Pencarian</span>
                <button 
                  onClick={() => setShowSearchDropdown(false)}
                  className="text-xs text-[#727970] hover:text-[#0e1d25]"
                >
                  Tutup
                </button>
              </div>

              {filteredTransactions.length === 0 && filteredArticles.length === 0 ? (
                <p className="text-xs text-[#424940] p-3 text-center">Tidak ada hasil ditemukan.</p>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[#3e6842] px-2 mb-1">TRANSAKSI</p>
                      {filteredTransactions.map(tx => (
                        <div 
                          key={tx.id}
                          onClick={() => {
                            setCurrentView('cashflow');
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="p-2 hover:bg-[#e7f6ff] rounded-xl cursor-pointer transition-colors text-xs flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold text-[#0e1d25]">{tx.description}</p>
                            <p className="text-[10px] text-[#727970]">{tx.category} • {tx.date}</p>
                          </div>
                          <span className={`font-bold ${tx.type === 'income' ? 'text-[#3e6842]' : 'text-[#ba1a1a]'}`}>
                            {tx.type === 'income' ? '+' : '-'} Rp {new Intl.NumberFormat('id-ID').format(tx.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredArticles.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[#3e6842] px-2 mb-1">AKADEMI UANG</p>
                      {filteredArticles.map(art => (
                        <div 
                          key={art.id}
                          onClick={() => {
                            setSelectedArticle(art);
                            setCurrentView('academy');
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="p-2 hover:bg-[#e7f6ff] rounded-xl cursor-pointer transition-colors text-xs"
                        >
                          <p className="font-semibold text-[#0e1d25]">{art.title}</p>
                          <p className="text-[10px] text-[#727970]">{art.category} • {art.readTime}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Add Transaction Button */}
        <button
          onClick={() => setIsAddTxOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#3e6842] text-white rounded-full font-semibold text-xs shadow-md hover:bg-[#3e6842]/90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Catat</span>
        </button>

        {/* Notifications & Settings Buttons */}
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#8fbc8f]/20 transition-all text-[#424940] relative"
            title="Notifikasi"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unpaidBills.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-[#d5e5ef] p-4 z-50 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-sm text-[#0e1d25]">Pengingat & Notifikasi</h4>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#727970] hover:text-[#0e1d25]"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {unpaidBills.length === 0 ? (
                <div className="py-6 text-center text-[#727970] space-y-2">
                  <span className="material-symbols-outlined text-[28px] text-[#8fbc8f]">notifications_off</span>
                  <p className="font-semibold text-xs text-[#0e1d25]">Tidak Ada Notifikasi Baru</p>
                  <p className="text-[11px] text-[#727970]">Pengingat tagihan mendatang akan secara otomatis muncul di sini.</p>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs max-h-60 overflow-y-auto pr-1">
                  {unpaidBills.map(bill => (
                    <div key={bill.id} className="p-3 bg-[#e7f6ff] rounded-xl border border-[#d5e5ef] flex gap-3 items-start">
                      <span className="material-symbols-outlined text-[#3e6842] shrink-0 mt-0.5">event_upcoming</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0e1d25] truncate">{bill.name}</p>
                        <p className="text-[11px] text-[#424940]">
                          Jatuh tempo: {bill.dueDate} (Rp {new Intl.NumberFormat('id-ID').format(bill.amount)})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button 
            onClick={() => showToast('Fitur Pengaturan: Bahasa, Tema, dan Notifikasi disesuaikan.')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#8fbc8f]/20 transition-all text-[#424940]"
            title="Pengaturan"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>

          {/* Account Profile Avatar Button */}
          <button
            onClick={() => setCurrentView('auth')}
            className="flex items-center gap-2 p-1 pl-1 pr-2.5 rounded-full bg-white border border-[#d5e5ef] hover:border-[#3e6842] transition-all shadow-xs"
            title={profile.isLoggedIn ? `Akun: ${profile.name}` : 'Masuk / Daftar'}
          >
            <img 
              src={profile.avatarUrl} 
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-[#8fbc8f] object-cover shrink-0"
            />
            <span className="text-xs font-bold text-[#0e1d25] hidden lg:inline max-w-[100px] truncate">
              {profile.isLoggedIn ? profile.name : 'Masuk'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
