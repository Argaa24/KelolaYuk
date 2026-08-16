import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const PRESET_AVATARS = [
  { id: '1', label: 'Default', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeXlv6AkyxIMR7H8tTjglThq9MFgCYBDOXaFX1klKEM-PCLNXLltBULq2IXwDi1-_6Gc7frIpxU7xFqgVR6ixqCTvkn6Jj8Mp5o28AErnHDUWieJc-DShOeNOSFxh5AZHUA3ixOprh88bwM1DrQqx1F-NoHr2nOdk7uWBd5gQj0yXoE0IdI-IOPnBqynkDWTbWzFDJP1tnuDf85AlslRh3M1RYYqRUH2FMJbjmMbYCIVvkLsDF4X-E' },
  { id: '2', label: 'Cerdas', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=smart_kelola' },
  { id: '3', label: 'Zen Saver', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=zen_saver' },
  { id: '4', label: 'Eksekutif', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=executive_mind' },
  { id: '5', label: 'Kreatif', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=creative_flow' },
  { id: '6', label: 'Modern', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=modern_fin' },
];

export const EditProfileModal: React.FC = () => {
  const { profile, isEditProfileOpen, setIsEditProfileOpen, updateUserProfile } = useApp();
  
  const [name, setName] = useState(profile.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarUrl || PRESET_AVATARS[0].url);
  const [title, setTitle] = useState(profile.title || 'Mindful Saver');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state whenever modal opens or profile changes
  useEffect(() => {
    if (isEditProfileOpen) {
      setName(profile.name || '');
      setSelectedAvatar(profile.avatarUrl || PRESET_AVATARS[0].url);
      setTitle(profile.title || 'Mindful Saver');
      setErrorMsg(null);
    }
  }, [isEditProfileOpen, profile]);

  if (!isEditProfileOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg('Nama tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await updateUserProfile({
        name: cleanName,
        avatarUrl: selectedAvatar,
        title: title.trim() || 'Mindful Saver'
      });

      if (res.success) {
        setIsEditProfileOpen(false);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan perubahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#142026] rounded-[28px] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#d5e5ef] dark:border-[#28373f] relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setIsEditProfileOpen(false)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-[#1f2d34] text-[#727970] dark:text-[#a0aec0] hover:text-[#0e1d25] dark:hover:text-[#f1f5f9] flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/20 text-[#1e4e2b] dark:text-[#8fbc8f] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">manage_accounts</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0e1d25] dark:text-[#f1f5f9]">Edit Nama & Profil</h3>
            <p className="text-xs text-[#727970] dark:text-[#a0aec0]">
              Gunakan nama panggilan atau nama pilihan Anda sendiri
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-[#ffdad6]/60 dark:bg-[#ba1a1a]/20 border border-[#ba1a1a]/30 text-[#ba1a1a] dark:text-[#ff897d] text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Preview & Selection */}
          <div>
            <label className="block text-xs font-bold text-[#0e1d25] dark:text-[#f1f5f9] mb-2">
              Pilih Avatar Karakter
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
              {PRESET_AVATARS.map((av) => (
                <button
                  type="button"
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.url)}
                  className={`w-12 h-12 rounded-full p-0.5 border-2 transition-all shrink-0 cursor-pointer ${
                    selectedAvatar === av.url
                      ? 'border-[#1e4e2b] dark:border-[#8fbc8f] scale-110 shadow-md ring-2 ring-[#1e4e2b]/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={av.label}
                >
                  <img
                    src={av.url}
                    alt={av.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover bg-slate-100 dark:bg-slate-800"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Name Input */}
          <div>
            <label className="block text-xs font-bold text-[#0e1d25] dark:text-[#f1f5f9] mb-1.5">
              Nama Tampilan Pengguna <span className="text-[#ba1a1a]">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727970] dark:text-[#8a99a8] text-[20px]">
                badge
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Agus, Budi Pratama, Maya"
                className="w-full pl-11 pr-4 py-3 bg-[#f8fafc] dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] rounded-xl text-sm font-semibold text-[#0e1d25] dark:text-[#f1f5f9] focus:outline-none focus:border-[#1e4e2b] dark:focus:border-[#8fbc8f] transition-all"
                maxLength={40}
              />
            </div>
            <p className="text-[11px] text-[#727970] dark:text-[#8a99a8] mt-1">
              Nama ini akan langsung dipakai di salam dasbor, riwayat, dan laporan.
            </p>
          </div>

          {/* Title / Slogan */}
          <div>
            <label className="block text-xs font-bold text-[#0e1d25] dark:text-[#f1f5f9] mb-1.5">
              Sebutan Finansial / Slogan
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727970] dark:text-[#8a99a8] text-[20px]">
                stars
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Mindful Saver, Perencana Cerdas"
                className="w-full pl-11 pr-4 py-3 bg-[#f8fafc] dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] rounded-xl text-sm text-[#0e1d25] dark:text-[#f1f5f9] focus:outline-none focus:border-[#1e4e2b] dark:focus:border-[#8fbc8f] transition-all"
                maxLength={30}
              />
            </div>
          </div>

          {/* Email Info (Read-only) */}
          {profile.email && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a282f]/60 border border-[#e2e8f0] dark:border-[#28373f] text-xs">
              <p className="text-[11px] text-[#727970] dark:text-[#8a99a8]">Email Akun Terhubung:</p>
              <p className="font-semibold text-[#0e1d25] dark:text-[#f1f5f9] truncate">{profile.email}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl border border-[#d5e5ef] dark:border-[#28373f] text-xs font-bold text-[#424940] dark:text-[#a0aec0] hover:bg-slate-50 dark:hover:bg-[#1a282f] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-[#1e4e2b] dark:bg-[#8fbc8f] text-white dark:text-[#0c1418] font-bold text-xs shadow-md hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Menyimpan...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Simpan Nama</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
