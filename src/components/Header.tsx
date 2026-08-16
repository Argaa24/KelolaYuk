import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

interface AppFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  keywords: string[];
  action: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { 
    currentView, 
    setCurrentView, 
    setIsAddTxOpen, 
    setIsQuizOpen,
    showToast,
    transactions,
    goals,
    setSelectedArticle,
    articles,
    bills,
    theme,
    toggleTheme
  } = useApp();

  const unpaidBills = bills.filter(b => !b.isPaid);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const viewTitles: Record<string, string> = {
    dashboard: 'Ringkasan Hari Ini',
    cashflow: 'Arus Kas',
    budget: 'Rencana Anggaran',
    savings: 'Target Tabungan',
    calculator: 'Kalkulator Finansial',
    academy: 'Akademi Uang',
    bills: 'Pengingat Tagihan',
    auth: 'Ubah Profile',
  };

  // List of all app features for search
  const allFeatures: AppFeature[] = [
    {
      id: 'dashboard',
      title: 'Dasbor Keuangan',
      description: 'Ringkasan finansial, saldo utama, dan grafik arus kas',
      icon: 'dashboard',
      badge: 'Fitur',
      keywords: ['dasbor', 'dashboard', 'ringkasan', 'overview', 'saldo', 'total', 'statistik', 'grafik', 'beranda', 'home'],
      action: () => { setCurrentView('dashboard'); showToast('Buka Dasbor Keuangan'); }
    },
    {
      id: 'cashflow',
      title: 'Arus Kas & Riwayat Transaksi',
      description: 'Mutasi lengkap pencatatan pemasukan dan pengeluaran',
      icon: 'swap_horiz',
      badge: 'Riwayat',
      keywords: ['arus kas', 'cashflow', 'transaksi', 'pencatatan', 'mutasi', 'pemasukan', 'pengeluaran', 'riwayat', 'daftar transaksi', 'keuangan'],
      action: () => { setCurrentView('cashflow'); showToast('Buka Arus Kas & Riwayat Transaksi'); }
    },
    {
      id: 'add-tx',
      title: 'Catat Transaksi Baru',
      description: 'Buka formulir cepat untuk menambah pemasukan/pengeluaran',
      icon: 'add_circle',
      badge: 'Aksi Cepat',
      keywords: ['catat', 'tambah', 'input', 'transaksi baru', 'pemasukan baru', 'pengeluaran baru', 'buat transaksi'],
      action: () => { setIsAddTxOpen(true); }
    },
    {
      id: 'budget',
      title: 'Rencana Anggaran (Budgeting)',
      description: 'Alokasi dana belanja dan kebutuhan metode 50/30/20',
      icon: 'pie_chart',
      badge: 'Fitur',
      keywords: ['anggaran', 'budget', 'rencana', '50/30/20', 'kebutuhan', 'keinginan', 'alokasi', 'batas belanja'],
      action: () => { setCurrentView('budget'); showToast('Buka Rencana Anggaran'); }
    },
    {
      id: 'savings',
      title: 'Target Tabungan & Celengan',
      description: 'Kelola impian finansial, target belanja, dan progres tabungan',
      icon: 'savings',
      badge: 'Fitur',
      keywords: ['tabungan', 'savings', 'target', 'celengan', 'impian', 'goal', 'menabung', 'keinginan'],
      action: () => { setCurrentView('savings'); showToast('Buka Target Tabungan'); }
    },
    {
      id: 'calculator',
      title: 'Kalkulator Finansial',
      description: 'Simulasi investasi, bunga majemuk, dan dana darurat',
      icon: 'calculate',
      badge: 'Alat Hitung',
      keywords: ['kalkulator', 'calculator', 'simulasi', 'investasi', 'bunga', 'dana darurat', 'inflasi', 'hitung'],
      action: () => { setCurrentView('calculator'); showToast('Buka Kalkulator Finansial'); }
    },
    {
      id: 'academy',
      title: 'Akademi Uang & Artikel',
      description: 'Modul belajar, artikel, dan tips cerdas kelola uang',
      icon: 'school',
      badge: 'Edukasi',
      keywords: ['akademi', 'academy', 'edukasi', 'artikel', 'pelajaran', 'tips', 'belajar', 'modul'],
      action: () => { setCurrentView('academy'); showToast('Buka Akademi Uang'); }
    },
    {
      id: 'bills',
      title: 'Pengingat Tagihan',
      description: 'Daftar jadwal pembayaran tagihan rutin bulanan',
      icon: 'receipt_long',
      badge: 'Fitur',
      keywords: ['tagihan', 'bills', 'pengingat', 'bayar', 'listrik', 'air', 'internet', 'rutin', 'reminder'],
      action: () => { setCurrentView('bills'); showToast('Buka Pengingat Tagihan'); }
    },
    {
      id: 'auth',
      title: 'Ubah Profile & Akun',
      description: 'Kelola identitas nama, level akun, dan sesi',
      icon: 'manage_accounts',
      badge: 'Akun',
      keywords: ['ubah profile', 'ubah profil', 'ganti nama', 'profil', 'profile', 'akun', 'auth', 'login', 'masuk', 'daftar', 'level'],
      action: () => { setCurrentView('auth'); showToast('Buka Ubah Profile'); }
    },
    {
      id: 'quiz',
      title: 'Kuis Finansial',
      description: 'Uji pemahaman dan tingkatkan wawasan keuangan Anda',
      icon: 'quiz',
      badge: 'Kuis',
      keywords: ['quiz', 'kuis', 'uji', 'pemahaman', 'soal', 'tantangan'],
      action: () => { setIsQuizOpen(true); }
    }
  ];

  const q = searchQuery.trim().toLowerCase();

  // Search filter results
  const filteredFeatures = q
    ? allFeatures.filter(f => 
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.keywords.some(k => k.includes(q))
      )
    : [];

  const filteredTransactions = q
    ? transactions.filter(t => {
        const desc = (t.description || '').toLowerCase();
        const cat = (t.category || '').toLowerCase();
        const notes = (t.notes || '').toLowerCase();
        const amtStr = t.amount ? t.amount.toString() : '';
        const formattedAmt = t.amount ? new Intl.NumberFormat('id-ID').format(t.amount) : '';
        const date = (t.date || '').toLowerCase();

        const matchesText = desc.includes(q) || cat.includes(q) || notes.includes(q) || amtStr.includes(q) || formattedAmt.includes(q) || date.includes(q);

        if (q === 'pemasukan' || q === 'masuk' || q === 'income') return t.type === 'income' || matchesText;
        if (q === 'pengeluaran' || q === 'keluar' || q === 'expense') return t.type === 'expense' || matchesText;

        return matchesText;
      })
    : [];

  const filteredGoals = q
    ? goals.filter(g => 
        (g.title || '').toLowerCase().includes(q) || 
        (g.targetDescription || '').toLowerCase().includes(q)
      )
    : [];

  const filteredBills = q
    ? bills.filter(b => 
        (b.name || '').toLowerCase().includes(q) || 
        (b.category || '').toLowerCase().includes(q)
      )
    : [];

  const filteredArticles = q
    ? articles.filter(a =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q) ||
        (a.summary || '').toLowerCase().includes(q)
      )
    : [];

  const totalResults = filteredFeatures.length + filteredTransactions.length + filteredGoals.length + filteredBills.length + filteredArticles.length;

  const handleSelectResult = (action: () => void) => {
    action();
    setShowSearchDropdown(false);
    setShowMobileSearch(false);
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-72 h-20 bg-[#f4faff]/85 dark:bg-[#141f24]/90 backdrop-blur-md border-b border-[#d5e5ef] dark:border-[#28373f] z-40 flex justify-between items-center px-4 sm:px-6 md:px-10 transition-colors">
      <div className="flex items-center gap-3.5">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#3e6842] dark:text-[#8fbc8f] hover:bg-[#e7f6ff] dark:hover:bg-[#1a282f] transition-colors"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[26px]">menu</span>
        </button>
        <div>
          <h2 className="font-extrabold text-2xl sm:text-[26px] md:text-3xl text-[#3e6842] dark:text-[#8fbc8f] tracking-tight">
            {viewTitles[currentView] || 'KelolaYuk'}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5">
        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => {
            setShowMobileSearch(!showMobileSearch);
            setShowSearchDropdown(true);
          }}
          className="sm:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#8fbc8f]/20 transition-all text-[#424940] dark:text-[#a0aec0] cursor-pointer"
          title="Cari Fitur atau Transaksi"
        >
          <span className="material-symbols-outlined text-[22px]">search</span>
        </button>

        {/* Search Bar Container */}
        <div className={`relative ${showMobileSearch ? 'absolute left-4 right-4 top-3.5 z-50 bg-white dark:bg-[#162228] p-2 rounded-2xl shadow-xl border border-[#d5e5ef] dark:border-[#28373f] flex items-center gap-2' : 'hidden sm:block'}`}>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari fitur, transaksi, artikel..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="bg-[#e7f6ff] dark:bg-[#1a282f] border-none rounded-full px-5 py-2.5 pr-11 text-sm sm:text-[15px] font-medium w-60 md:w-80 focus:ring-2 focus:ring-[#3e6842]/30 transition-all outline-none text-[#0e1d25] dark:text-[#f1f5f9] placeholder:text-[#727970] dark:placeholder:text-[#8a99a8]"
            />
            <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[#727970] dark:text-[#8a99a8] text-[22px]">
              search
            </span>
          </div>

          {showMobileSearch && (
            <button
              onClick={() => {
                setShowMobileSearch(false);
                setSearchQuery('');
              }}
              className="p-2 text-[#727970] dark:text-[#a0aec0] hover:text-[#0e1d25]"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          )}

          {/* Search Dropdown */}
          {showSearchDropdown && q.length > 0 && (
            <div className="absolute right-0 top-12 w-80 md:w-96 bg-white dark:bg-[#162228] rounded-2xl shadow-2xl border border-[#d5e5ef] dark:border-[#28373f] p-3 z-50 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-2 px-2 pb-2 border-b border-[#e2e8f0] dark:border-[#28373f]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#3e6842] dark:text-[#8fbc8f]">search</span>
                  <span className="text-xs font-bold text-[#0e1d25] dark:text-[#f1f5f9]">Hasil Pencarian</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3e6842]/10 text-[#3e6842] dark:text-[#8fbc8f]">
                    {totalResults}
                  </span>
                </div>
                <button 
                  onClick={() => setShowSearchDropdown(false)}
                  className="text-xs text-[#727970] dark:text-[#a0aec0] hover:text-[#0e1d25] cursor-pointer"
                >
                  Tutup
                </button>
              </div>

              {totalResults === 0 ? (
                <div className="py-8 text-center text-[#727970] dark:text-[#a0aec0]">
                  <span className="material-symbols-outlined text-[32px] text-[#727970] mb-1">search_off</span>
                  <p className="text-xs font-semibold text-[#0e1d25] dark:text-[#f1f5f9]">Tidak ada hasil untuk "{searchQuery}"</p>
                  <p className="text-[11px] mt-1 text-[#727970] dark:text-[#a0aec0]">Coba kata kunci lain seperti nama fitur, deskripsi transaksi, atau artikel.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Features / Fitur App */}
                  {filteredFeatures.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[#3e6842] dark:text-[#8fbc8f] px-2 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">widgets</span>
                        FITUR & MENU ({filteredFeatures.length})
                      </p>
                      <div className="space-y-1">
                        {filteredFeatures.map(f => (
                          <div 
                            key={f.id}
                            onClick={() => handleSelectResult(f.action)}
                            className="p-2.5 hover:bg-[#e7f6ff] dark:hover:bg-[#1a282f] rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-[#3e6842]/10 text-[#3e6842] dark:text-[#8fbc8f] flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[18px]">{f.icon}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-xs text-[#0e1d25] dark:text-[#f1f5f9] group-hover:text-[#3e6842] dark:group-hover:text-[#8fbc8f] truncate">
                                  {f.title}
                                </p>
                                <p className="text-[10px] text-[#727970] dark:text-[#a0aec0] truncate">
                                  {f.description}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#3e6842]/10 text-[#3e6842] dark:text-[#8fbc8f] shrink-0">
                              {f.badge}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transactions / Riwayat Transaksi */}
                  {filteredTransactions.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[#3e6842] dark:text-[#8fbc8f] px-2 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">receipt</span>
                        RIWAYAT TRANSAKSI ({filteredTransactions.length})
                      </p>
                      <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                        {filteredTransactions.map(tx => (
                          <div 
                            key={tx.id}
                            onClick={() => handleSelectResult(() => {
                              setCurrentView('cashflow');
                              showToast(`Menampilkan transaksi: ${tx.description}`);
                            })}
                            className="p-2.5 hover:bg-[#e7f6ff] dark:hover:bg-[#1a282f] rounded-xl cursor-pointer transition-colors text-xs flex justify-between items-center gap-3 group"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-[#0e1d25] dark:text-[#f1f5f9] group-hover:text-[#3e6842] dark:group-hover:text-[#8fbc8f] truncate">
                                {tx.description}
                              </p>
                              <p className="text-[10px] text-[#727970] dark:text-[#a0aec0]">
                                {tx.category} • {tx.date}
                              </p>
                            </div>
                            <span className={`font-bold shrink-0 text-xs ${tx.type === 'income' ? 'text-[#3e6842] dark:text-[#8fbc8f]' : 'text-[#ba1a1a] dark:text-[#ff897d]'}`}>
                              {tx.type === 'income' ? '+' : '-'} Rp {new Intl.NumberFormat('id-ID').format(tx.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Target Tabungan */}
                  {filteredGoals.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[#3e6842] dark:text-[#8fbc8f] px-2 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">savings</span>
                        TARGET TABUNGAN ({filteredGoals.length})
                      </p>
                      <div className="space-y-1">
                        {filteredGoals.map(g => (
                          <div 
                            key={g.id}
                            onClick={() => handleSelectResult(() => {
                              setCurrentView('savings');
                              showToast(`Target: ${g.title}`);
                            })}
                            className="p-2.5 hover:bg-[#e7f6ff] dark:hover:bg-[#1a282f] rounded-xl cursor-pointer transition-colors text-xs flex justify-between items-center gap-2 group"
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-[#0e1d25] dark:text-[#f1f5f9] group-hover:text-[#3e6842] dark:group-hover:text-[#8fbc8f] truncate">
                                {g.title}
                              </p>
                              <p className="text-[10px] text-[#727970] dark:text-[#a0aec0]">
                                Target: Rp {new Intl.NumberFormat('id-ID').format(g.targetAmount)}
                              </p>
                            </div>
                            <span className="material-symbols-outlined text-[18px] text-[#3e6842] dark:text-[#8fbc8f]">
                              chevron_right
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pengingat Tagihan */}
                  {filteredBills.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[#3e6842] dark:text-[#8fbc8f] px-2 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">event_upcoming</span>
                        PENGINGAT TAGIHAN ({filteredBills.length})
                      </p>
                      <div className="space-y-1">
                        {filteredBills.map(b => (
                          <div 
                            key={b.id}
                            onClick={() => handleSelectResult(() => {
                              setCurrentView('bills');
                              showToast(`Tagihan: ${b.name}`);
                            })}
                            className="p-2.5 hover:bg-[#e7f6ff] dark:hover:bg-[#1a282f] rounded-xl cursor-pointer transition-colors text-xs flex justify-between items-center gap-2 group"
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-[#0e1d25] dark:text-[#f1f5f9] group-hover:text-[#3e6842] dark:group-hover:text-[#8fbc8f] truncate">
                                {b.name}
                              </p>
                              <p className="text-[10px] text-[#727970] dark:text-[#a0aec0]">
                                {b.category} • Rp {new Intl.NumberFormat('id-ID').format(b.amount)}
                              </p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.isPaid ? 'bg-[#3e6842]/10 text-[#3e6842]' : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'}`}>
                              {b.isPaid ? 'Lunas' : 'Belum Bayar'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Articles / Akademi */}
                  {filteredArticles.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[#3e6842] dark:text-[#8fbc8f] px-2 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">menu_book</span>
                        AKADEMI & ARTIKEL ({filteredArticles.length})
                      </p>
                      <div className="space-y-1">
                        {filteredArticles.map(art => (
                          <div 
                            key={art.id}
                            onClick={() => handleSelectResult(() => {
                              setSelectedArticle(art);
                              setCurrentView('academy');
                              showToast(`Membaca: ${art.title}`);
                            })}
                            className="p-2.5 hover:bg-[#e7f6ff] dark:hover:bg-[#1a282f] rounded-xl cursor-pointer transition-colors text-xs group"
                          >
                            <p className="font-bold text-[#0e1d25] dark:text-[#f1f5f9] group-hover:text-[#3e6842] dark:group-hover:text-[#8fbc8f] truncate">
                              {art.title}
                            </p>
                            <p className="text-[10px] text-[#727970] dark:text-[#a0aec0]">
                              {art.category} • {art.readTime}
                            </p>
                          </div>
                        ))}
                      </div>
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
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#3e6842] text-white rounded-full font-bold text-sm sm:text-[15px] shadow-md hover:bg-[#3e6842]/90 active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Catat</span>
        </button>

        {/* Notifications & Settings Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
            }}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#8fbc8f]/20 transition-all text-[#424940] dark:text-[#a0aec0] relative cursor-pointer"
            title="Notifikasi"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unpaidBills.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white dark:bg-[#162228] rounded-2xl shadow-xl border border-[#d5e5ef] dark:border-[#28373f] p-4 z-50 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-base text-[#0e1d25] dark:text-[#f1f5f9]">Pengingat & Notifikasi</h4>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-[#727970] dark:text-[#a0aec0] hover:text-[#0e1d25]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {unpaidBills.length === 0 ? (
                <div className="py-6 text-center text-[#727970] dark:text-[#a0aec0] space-y-2">
                  <span className="material-symbols-outlined text-[28px] text-[#8fbc8f]">notifications_off</span>
                  <p className="font-semibold text-xs text-[#0e1d25] dark:text-[#f1f5f9]">Tidak Ada Notifikasi Baru</p>
                  <p className="text-[11px]">Pengingat tagihan mendatang akan secara otomatis muncul di sini.</p>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs max-h-60 overflow-y-auto pr-1">
                  {unpaidBills.map(bill => (
                    <div key={bill.id} className="p-3 bg-[#e7f6ff] dark:bg-[#1a282f] rounded-xl border border-[#d5e5ef] dark:border-[#28373f] flex gap-3 items-start">
                      <span className="material-symbols-outlined text-[#3e6842] dark:text-[#8fbc8f] shrink-0 mt-0.5">event_upcoming</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0e1d25] dark:text-[#f1f5f9] truncate">{bill.name}</p>
                        <p className="text-[11px] text-[#424940] dark:text-[#a0aec0]">
                          Jatuh tempo: {bill.dueDate} (Rp {new Intl.NumberFormat('id-ID').format(bill.amount)})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button 
              onClick={() => {
                setShowSettings(!showSettings);
                setShowNotifications(false);
              }}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#8fbc8f]/20 transition-all text-[#424940] dark:text-[#a0aec0] cursor-pointer"
              title="Pengaturan Aplikasi"
            >
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white dark:bg-[#162228] rounded-2xl shadow-xl border border-[#d5e5ef] dark:border-[#28373f] p-4 z-50 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#e2e8f0] dark:border-[#28373f]">
                  <h4 className="font-bold text-base text-[#0e1d25] dark:text-[#f1f5f9] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[20px] text-[#3e6842] dark:text-[#8fbc8f]">settings</span>
                    Pengaturan Sistem
                  </h4>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="text-xs text-[#727970] dark:text-[#a0aec0] hover:text-[#0e1d25] dark:hover:text-[#f1f5f9] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Theme Selector Section */}
                  <div>
                    <p className="text-xs font-bold text-[#0e1d25] dark:text-[#f1f5f9] mb-1">Tema Tampilan</p>
                    <p className="text-[11px] text-[#727970] dark:text-[#a0aec0] mb-2.5">
                      Sesuaikan tampilan warna aplikasi demi kenyamanan mata Anda.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          if (theme !== 'light') toggleTheme();
                        }}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          theme === 'light'
                            ? 'bg-[#e7f6ff] border-[#3e6842] text-[#3e6842] shadow-xs'
                            : 'bg-[#f8fafc] dark:bg-[#1a282f] border-[#d5e5ef] dark:border-[#28373f] text-[#424940] dark:text-[#a0aec0] hover:border-[#3e6842]/50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">light_mode</span>
                        <span>Mode Terang</span>
                      </button>

                      <button
                        onClick={() => {
                          if (theme !== 'dark') toggleTheme();
                        }}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          theme === 'dark'
                            ? 'bg-[#1a282f] border-[#8fbc8f] text-[#8fbc8f] shadow-xs'
                            : 'bg-[#f8fafc] dark:bg-[#1a282f] border-[#d5e5ef] dark:border-[#28373f] text-[#424940] dark:text-[#a0aec0] hover:border-[#8fbc8f]/50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                        <span>Mode Gelap</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
