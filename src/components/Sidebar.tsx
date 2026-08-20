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
    { id: 'dashboard', label: 'Dasbor', icon: 'grid_view' },
    { id: 'cashflow', label: 'Arus Kas', icon: 'credit_card' },
    { id: 'budget', label: 'Rencana Anggaran', icon: 'pie_chart' },
    { id: 'savings', label: 'Tabungan & Tantangan', icon: 'emoji_events' },
    { id: 'calculator', label: 'Kalkulator Finansial', icon: 'calculate' },
    { id: 'academy', label: 'Akademi Uang', icon: 'school' },
    { id: 'bills', label: 'Pengingat Tagihan', icon: 'notifications' },
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
        className={`h-screen w-72 fixed left-0 top-0 bg-[#f4f7f5] dark:bg-[#121c21] border-r border-[#e2ece5] dark:border-[#23333c] z-50 flex flex-col justify-between py-6 px-4 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Brand Header */}
          <div className="mb-6 px-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1e4e2b] dark:bg-[#8fbc8f] text-white dark:text-[#0c1418] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[24px]">spa</span>
              </div>
              <div>
                <h1 className="font-extrabold text-xl text-[#1e4e2b] dark:text-[#8fbc8f] tracking-tight leading-none">
                  KelolaYuk
                </h1>
                <p className="text-[11px] font-medium text-[#5f6c7b] dark:text-[#a0aec0] mt-0.5">
                  Kelola Uang, Kembangkan Usaha
                </p>
              </div>
            </div>
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-lg text-[#5f6c7b] hover:bg-[#e2ece5] dark:hover:bg-[#1a282f]"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 overflow-y-auto no-scrollbar py-1">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-150 text-left font-medium text-sm sm:text-[15px] cursor-pointer relative ${
                    isActive
                      ? 'bg-[#dcefe1] dark:bg-[#203c2a] text-[#163f25] dark:text-[#8fbc8f] font-bold shadow-xs'
                      : 'text-[#4a5568] dark:text-[#a0aec0] hover:text-[#163f25] dark:hover:text-[#f1f5f9] hover:bg-[#e8f2eb] dark:hover:bg-[#1a282f]'
                  }`}
                >
                  {/* Left accent indicator for active item */}
                  {isActive && (
                    <span className="w-1.5 h-5 bg-[#163f25] dark:bg-[#8fbc8f] rounded-full shrink-0 -ml-1 mr-0.5" />
                  )}

                  <span 
                    className={`material-symbols-outlined text-[22px] shrink-0 ${
                      isActive 
                        ? 'text-[#163f25] dark:text-[#8fbc8f]' 
                        : 'text-[#5f6c7b] dark:text-[#8a99a8]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card at Bottom */}
        <div className="pt-3 mt-auto">
          {profile.isLoggedIn ? (
            <div 
              onClick={() => handleNavClick('auth')}
              title="Ubah Profile & Akun"
              className="p-2.5 rounded-2xl bg-white dark:bg-[#17252c] border border-[#e2e8f0] dark:border-[#28373f] flex items-center gap-2.5 shadow-xs cursor-pointer hover:border-[#1e4e2b]/40 dark:hover:border-[#8fbc8f]/40 transition-all"
            >
              <img 
                src={profile.avatarUrl} 
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#c2d6c8]"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs sm:text-sm text-[#0e1d25] dark:text-[#f1f5f9] truncate">
                  {profile.name}
                </p>
                <p className="text-[11px] text-[#718096] dark:text-[#8a99a8] truncate">
                  Premium Member
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('auth')}
              className="w-full py-3 px-4 bg-[#1e4e2b] hover:bg-[#1e4e2b]/90 text-white font-bold text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
              <span>Ubah Profile</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
