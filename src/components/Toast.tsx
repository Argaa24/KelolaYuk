import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="glass-card bg-[#FAF8F5]/95 border border-[#8fbc8f]/40 p-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-md">
        <div className="w-10 h-10 rounded-full bg-[#8fbc8f]/20 flex items-center justify-center text-[#3e6842] shrink-0">
          <span className="material-symbols-outlined text-[22px]">verified</span>
        </div>
        <div>
          <p className="font-bold text-sm text-[#0e1d25]">KelolaYuk</p>
          <p className="text-xs text-[#424940] leading-snug">{toastMessage}</p>
        </div>
      </div>
    </div>
  );
};
