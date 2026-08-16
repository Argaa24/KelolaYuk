import React from 'react';
import { useApp } from '../../context/AppContext';

export const ConfirmDeleteModal: React.FC = () => {
  const { pendingDelete, cancelDelete, confirmDelete } = useApp();

  if (!pendingDelete) return null;

  let typeLabel = 'Transaksi';
  if (pendingDelete.type === 'goal') typeLabel = 'Target Tabungan';
  if (pendingDelete.type === 'bill') typeLabel = 'Tagihan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#c2c9be]/50 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">delete_forever</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0e1d25]">
              Konfirmasi Hapus {typeLabel}
            </h3>
            <p className="text-xs text-[#727970]">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <div className="bg-[#f4f8f5] p-4 rounded-2xl border border-[#c2c9be]/40 mb-6">
          <p className="text-xs text-[#424940] leading-relaxed">
            Apakah Anda yakin ingin menghapus {typeLabel.toLowerCase()}{' '}
            <span className="font-bold text-[#0e1d25]">"{pendingDelete.title}"</span>
            {pendingDelete.amount !== undefined && pendingDelete.amount > 0 && (
              <span>
                {' '}dengan nominal{' '}
                <span className="font-bold text-[#ba1a1a]">
                  Rp {new Intl.NumberFormat('id-ID').format(pendingDelete.amount)}
                </span>
              </span>
            )}
            ?
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={cancelDelete}
            className="px-5 py-2.5 rounded-full border border-[#c2c9be] text-xs font-bold text-[#424940] hover:bg-[#f4f8f5] transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={confirmDelete}
            className="px-5 py-2.5 rounded-full bg-[#ba1a1a] hover:bg-[#a11515] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            <span>Ya, Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
};
