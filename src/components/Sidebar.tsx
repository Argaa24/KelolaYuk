import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewType } from '../types';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile = false, onCloseMobile }) => {
  const { currentView, setCurrentView, profile } = useApp();

  const navItems: { id: ViewType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dasbor', icon: 'dashboard' },
    { id: 'cashflow', label: 'Arus Kas', icon: 'account_balance_wallet' },
    { id: 'budget', label: 'Rencana Anggaran', icon: 'savings' },
    { id: 'savings', label: 'Tabungan & Tantangan', icon: 'emoji_events' },
    { id: 'calculator', label: 'Kalkulator Finansial', icon: 'calculate' },
    { id: 'academy', label: 'Akademi Uang', icon: 'school' },
    { id: 'bills', label: 'Pengingat Tagihan', icon: 'event_upcoming' },
  ];

  const handleNavClick = (view: ViewType) => {
    setCurrentView(view);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden" 
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`h-screen w-72 fixed left-0 top-0 bg-[#f4faff]/90 dark:bg-[#ccdce7]/90 backdrop-blur-xl border-r border-[#d5e5ef] shadow-[0px_10px_30px_rgba(47,62,70,0.05)] z-50 flex flex-col py-6 px-4 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="mb-8 px-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl text-[#3e6842] tracking-tight">KelolaYuk</h1>
            <p className="text-xs text-[#424940] opacity-80 mt-0.5">Kelola Usaha, Untung Nyata</p>
          </div>
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-[#424940] hover:bg-[#e7f6ff]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium text-sm ${
                  isActive
                    ? 'text-[#3e6842] font-bold border-r-4 border-[#3e6842] bg-[#8fbc8f]/20 shadow-xs'
                    : 'text-[#424940] hover:text-[#3e6842] hover:bg-[#e7f6ff]'
                }`}
              >
                <span 
                  className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#3e6842]' : 'text-[#727970]'}`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div className="mt-auto pt-4 border-t border-[#d5e5ef]">
          {profile.isLoggedIn ? (
            <div className="p-3 rounded-2xl bg-[#e7f6ff]/80 border border-[#d5e5ef] flex items-center justify-between gap-2">
              <div 
                onClick={() => handleNavClick('auth')}
                className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 hover:opacity-80 transition-opacity"
              >
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full border-2 border-[#8fbc8f] object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-[#0e1d25] truncate">{profile.name}</p>
                  <p className="text-[10px] text-[#3e6842] font-semibold truncate">Terhubung • {profile.level}</p>
                </div>
              </div>

              <button 
                onClick={() => handleNavClick('auth')}
                title="Kelola Akun"
                className="p-1.5 rounded-lg hover:bg-[#8fbc8f]/20 text-[#3e6842] transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('auth')}
              className="w-full py-2.5 px-4 bg-[#3e6842] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#3e6842]/90 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Masuk / Daftar</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
