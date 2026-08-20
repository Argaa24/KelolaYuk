import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AuthView: React.FC = () => {
  const { 
    profile, 
    setCurrentView, 
    showToast, 
    registerUser, 
    loginUser, 
    loginWithGoogle,
    sendPasswordReset,
    logoutUser,
    setIsEditProfileOpen,
    accounts 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Harap isi nama lengkap Anda.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Harap masukkan alamat email yang valid.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal harus 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Harap setujui Syarat & Ketentuan untuk melanjutkan.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerUser({
        name: fullName,
        email: email,
        password: password,
      });

      if (res.success) {
        setCurrentView('dashboard');
      } else {
        setErrorMessage(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Harap masukkan email Anda.');
      return;
    }

    if (!password) {
      setErrorMessage('Harap masukkan kata sandi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginUser(email, password);
      if (res.success) {
        setCurrentView('dashboard');
      } else {
        setErrorMessage(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsGoogleSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        setCurrentView('dashboard');
      } else {
        setErrorMessage(res.message);
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      showToast('Masukkan alamat email yang valid.');
      return;
    }
    const res = await sendPasswordReset(resetEmail);
    if (res.success) {
      setIsForgotPasswordOpen(false);
      setResetEmail('');
    } else {
      showToast(res.message);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setActiveTab('login');
    setErrorMessage(null);
  };

  // If user is already logged in, show Profile and Logout view inside standard layout
  if (profile.isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-6 px-2 animate-in fade-in duration-300">
        <div className="w-full max-w-lg bg-white dark:bg-[#142026] rounded-[32px] p-6 sm:p-10 shadow-xl border border-[#d5e5ef] dark:border-[#28373f] relative z-10 text-center">
          <div className="relative w-28 h-28 mx-auto mb-5">
            <img 
              src={profile.avatarUrl} 
              alt={profile.name}
              referrerPolicy="no-referrer"
              className="w-28 h-28 rounded-full border-4 border-[#3e6842] dark:border-[#8fbc8f] object-cover shadow-xl"
            />
            <span className="absolute bottom-1 right-1 w-7 h-7 bg-[#3e6842] dark:bg-[#8fbc8f] border-2 border-white dark:border-[#142026] rounded-full flex items-center justify-center text-white dark:text-[#0c1418] text-xs font-bold" title="Terhubung ke Firebase">
              ✓
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#3e6842]/10 dark:bg-[#8fbc8f]/20 text-[#3e6842] dark:text-[#8fbc8f] text-xs font-bold rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-[#3e6842] dark:bg-[#8fbc8f] animate-pulse"></span>
            <span>Cloud Firestore Aktif • {profile.level}</span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0e1d25] dark:text-[#f1f5f9] tracking-tight">{profile.name}</h2>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              title="Ganti nama panggilan Anda"
              className="p-1.5 rounded-lg text-[#1e4e2b] dark:text-[#8fbc8f] hover:bg-[#1e4e2b]/10 dark:hover:bg-[#8fbc8f]/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
          </div>
          <p className="text-sm text-[#727970] dark:text-[#a0aec0] mb-6">{profile.email || 'Email terdaftar'}</p>

          <div className="grid grid-cols-2 gap-3 mb-6 text-left">
            <div className="p-4 bg-[#f8fafc] dark:bg-[#1a282f] rounded-2xl border border-[#d5e5ef] dark:border-[#28373f]">
              <p className="text-xs text-[#727970] dark:text-[#a0aec0]">Status Database</p>
              <p className="font-bold text-[#3e6842] dark:text-[#8fbc8f] text-sm mt-0.5">Tersinkronisasi Cloud</p>
            </div>
            <div className="p-4 bg-[#f8fafc] dark:bg-[#1a282f] rounded-2xl border border-[#d5e5ef] dark:border-[#28373f]">
              <p className="text-xs text-[#727970] dark:text-[#a0aec0]">Sesi Autentikasi</p>
              <p className="font-bold text-[#0e1d25] dark:text-[#f1f5f9] text-sm mt-0.5">Firebase Auth</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="w-full py-3.5 bg-white dark:bg-[#1a282f] border border-[#1e4e2b]/30 dark:border-[#8fbc8f]/40 text-[#1e4e2b] dark:text-[#8fbc8f] font-bold rounded-2xl hover:bg-[#1e4e2b]/5 dark:hover:bg-[#8fbc8f]/10 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
              <span>Edit Nama & Avatar Profil</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full py-3.5 bg-[#1e4e2b] hover:bg-[#1e4e2b]/90 text-white font-bold rounded-2xl shadow-lg shadow-[#1e4e2b]/20 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span>Lanjut ke Dasbor Utama</span>
            </button>

            <button
              onClick={() => {
                logoutUser();
                setActiveTab('login');
              }}
              className="w-full py-3 bg-white dark:bg-[#1a282f] border border-[#ba1a1a]/30 text-[#ba1a1a] dark:text-[#ff897d] font-bold rounded-2xl hover:bg-[#ba1a1a]/10 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Keluar dari Akun Ini</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f7f5] dark:bg-[#0c1418] text-[#0e1d25] dark:text-[#f1f5f9] flex flex-col lg:flex-row relative overflow-x-hidden animate-in fade-in duration-300">
      {/* Background Glow Spheres */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8fbc8f]/15 dark:bg-[#8fbc8f]/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#1e4e2b]/10 dark:bg-[#1e4e2b]/20 rounded-full filter blur-3xl pointer-events-none" />

      {/* LEFT SIDE: Brand Showcase & Value Propositions (Full height on LG) */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-[#d5e5ef] dark:border-[#28373f] bg-white/40 dark:bg-[#101b20]/40 backdrop-blur-md">
        <div>
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3 mb-8 sm:mb-12">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1e4e2b] text-white flex items-center justify-center shadow-lg shadow-[#1e4e2b]/20">
              <span className="material-symbols-outlined text-[28px] sm:text-[32px]">spa</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1e4e2b] dark:text-[#8fbc8f]">
                KelolaYuk
              </h1>
              <p className="text-xs text-[#727970] dark:text-[#a0aec0]">
                Kelola Uang, Kembangkan Usaha
              </p>
            </div>
          </div>

          {/* Hero Headline */}
          <div className="space-y-3 mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/15 text-[#1e4e2b] dark:text-[#8fbc8f] text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">cloud_done</span>
              <span>Terintegrasi Firebase Cloud Firestore & Auth</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0e1d25] dark:text-[#f1f5f9] tracking-tight leading-snug">
              Kelola Uang, Kembangkan Usaha.
            </h2>
            <p className="text-xs sm:text-sm text-[#424940] dark:text-[#a0aec0] leading-relaxed max-w-xl">
              Pencatatan arus kas terstruktur, target tabungan otomatis, dan pengingat tagihan tersinkronisasi langsung ke Cloud Database Firebase secara real-time.
            </p>
          </div>

          {/* Feature Value List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#162228]/80 border border-[#d5e5ef] dark:border-[#28373f] shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/20 text-[#1e4e2b] dark:text-[#8fbc8f] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-[#0e1d25] dark:text-[#f1f5f9]">Database Cloud Real-Time</h3>
              <p className="text-[11px] text-[#727970] dark:text-[#a0aec0] mt-0.5">Semua mutasi tersimpan di Firestore dan update otomatis tanpa refresh.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#162228]/80 border border-[#d5e5ef] dark:border-[#28373f] shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/20 text-[#1e4e2b] dark:text-[#8fbc8f] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-[#0e1d25] dark:text-[#f1f5f9]">Keamanan Firebase Auth</h3>
              <p className="text-[11px] text-[#727970] dark:text-[#a0aec0] mt-0.5">Akses privat dengan enkripsi dan aturan keamanan data per pengguna.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#162228]/80 border border-[#d5e5ef] dark:border-[#28373f] shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/20 text-[#1e4e2b] dark:text-[#8fbc8f] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[20px]">savings</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-[#0e1d25] dark:text-[#f1f5f9]">Celengan & Target</h3>
              <p className="text-[11px] text-[#727970] dark:text-[#a0aec0] mt-0.5">Atur target belanja dan pantau progres dana simpanan impianmu.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#162228]/80 border border-[#d5e5ef] dark:border-[#28373f] shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/20 text-[#1e4e2b] dark:text-[#8fbc8f] flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-[20px]">pie_chart</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-[#0e1d25] dark:text-[#f1f5f9]">Metode Budget 50/30/20</h3>
              <p className="text-[11px] text-[#727970] dark:text-[#a0aec0] mt-0.5">Bagi dana untuk Kebutuhan, Keinginan, dan Tabungan secara seimbang.</p>
            </div>
          </div>
        </div>

        {/* Guest / Demo Option Footer */}
        <div className="pt-6 border-t border-[#d5e5ef] dark:border-[#28373f] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#727970] dark:text-[#a0aec0]">
            <span className="material-symbols-outlined text-[18px] text-[#1e4e2b] dark:text-[#8fbc8f]">shield</span>
            <span>Data tersimpan aman di Firebase Cloud Firestore.</span>
          </div>

          <button
            onClick={() => {
              setCurrentView('dashboard');
              showToast('Masuk dalam mode Penjelajah / Tamu');
            }}
            className="text-xs font-bold text-[#1e4e2b] dark:text-[#8fbc8f] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Jelajahi Mode Demo / Tamu</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form Center Area */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md bg-white dark:bg-[#142026] rounded-[32px] p-6 sm:p-8 shadow-2xl border border-[#d5e5ef] dark:border-[#28373f] relative overflow-hidden">
          {/* Subtle Accent Glow inside card */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#8fbc8f]/20 rounded-full blur-xl pointer-events-none" />

          {/* Form Header */}
          <div className="mb-6 relative z-10 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-[#0e1d25] dark:text-[#f1f5f9]">
              {activeTab === 'register' ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
            </h3>
            <p className="text-xs text-[#727970] dark:text-[#a0aec0] mt-1">
              {activeTab === 'register'
                ? 'Daftar sekarang untuk sinkronisasi data keuangan ke Firebase.'
                : 'Masuk dengan email terdaftar atau akun Google Anda.'}
            </p>
          </div>

          {/* Google Sign-in Button */}
          <div className="mb-4 relative z-10">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleSubmitting}
              className="w-full py-3 px-4 bg-white dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] hover:bg-slate-50 dark:hover:bg-[#20313a] text-[#0e1d25] dark:text-[#f1f5f9] font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isGoogleSubmitting ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}</span>
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#d5e5ef] dark:border-[#28373f]"></div>
              </div>
              <span className="relative px-3 bg-white dark:bg-[#142026] text-[11px] text-[#727970] dark:text-[#a0aec0]">
                atau gunakan email
              </span>
            </div>
          </div>

          {/* Auth Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#e7f6ff] dark:bg-[#1a282f] rounded-2xl mb-5 relative z-10 border border-[#d5e5ef] dark:border-[#28373f]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#1e4e2b] text-white shadow-md'
                  : 'text-[#424940] dark:text-[#a0aec0] hover:text-[#0e1d25] dark:hover:text-[#f1f5f9]'
              }`}
            >
              Daftar Baru
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#1e4e2b] text-white shadow-md'
                  : 'text-[#424940] dark:text-[#a0aec0] hover:text-[#0e1d25] dark:hover:text-[#f1f5f9]'
              }`}
            >
              Masuk Email
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-[#ba1a1a]/10 border border-[#ba1a1a]/30 rounded-xl text-xs text-[#ba1a1a] dark:text-[#ff897d] flex items-center gap-2 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 relative z-10 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-[#0e1d25] dark:text-[#f1f5f9] mb-1 text-xs">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Andi Pratama"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full bg-[#f8fafc] dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] rounded-xl px-3.5 py-2.5 text-[#0e1d25] dark:text-[#f1f5f9] focus:border-[#1e4e2b] dark:focus:border-[#8fbc8f] focus:ring-1 focus:ring-[#1e4e2b] outline-none transition-all text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0e1d25] dark:text-[#f1f5f9] mb-1 text-xs">Alamat Email</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#f8fafc] dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] rounded-xl px-3.5 py-2.5 text-[#0e1d25] dark:text-[#f1f5f9] focus:border-[#1e4e2b] dark:focus:border-[#8fbc8f] focus:ring-1 focus:ring-[#1e4e2b] outline-none transition-all text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0e1d25] dark:text-[#f1f5f9] mb-1 text-xs">Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#f8fafc] dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] rounded-xl px-3.5 py-2.5 pr-10 text-[#0e1d25] dark:text-[#f1f5f9] focus:border-[#1e4e2b] dark:focus:border-[#8fbc8f] focus:ring-1 focus:ring-[#1e4e2b] outline-none transition-all text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727970] dark:text-[#a0aec0] hover:text-[#0e1d25] dark:hover:text-[#f1f5f9]"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0e1d25] dark:text-[#f1f5f9] mb-1 text-xs">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Ulangi kata sandi"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-[#f8fafc] dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] rounded-xl px-3.5 py-2.5 pr-10 text-[#0e1d25] dark:text-[#f1f5f9] focus:border-[#1e4e2b] dark:focus:border-[#8fbc8f] focus:ring-1 focus:ring-[#1e4e2b] outline-none transition-all text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727970] dark:text-[#a0aec0] hover:text-[#0e1d25] dark:hover:text-[#f1f5f9]"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-[#1e4e2b] focus:ring-[#1e4e2b]"
                />
                <label htmlFor="terms" className="text-[11px] text-[#424940] dark:text-[#a0aec0] leading-snug cursor-pointer">
                  Saya menyetujui <span className="font-bold text-[#1e4e2b] dark:text-[#8fbc8f]">Syarat & Ketentuan</span> serta <span className="font-bold text-[#1e4e2b] dark:text-[#8fbc8f]">Kebijakan Privasi</span>.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#1e4e2b] text-white font-bold rounded-xl shadow-lg shadow-[#1e4e2b]/20 hover:bg-[#1e4e2b]/90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                <span>{isSubmitting ? 'Memproses Pendaftaran...' : 'Daftar Akun Baru'}</span>
              </button>
            </form>
          )}

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 relative z-10 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-[#0e1d25] dark:text-[#f1f5f9] mb-1 text-xs">Email</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#f8fafc] dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] rounded-xl px-3.5 py-2.5 text-[#0e1d25] dark:text-[#f1f5f9] focus:border-[#1e4e2b] dark:focus:border-[#8fbc8f] focus:ring-1 focus:ring-[#1e4e2b] outline-none transition-all text-xs sm:text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-[#0e1d25] dark:text-[#f1f5f9] text-xs">Kata Sandi</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-[11px] font-bold text-[#1e4e2b] dark:text-[#8fbc8f] hover:underline cursor-pointer"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#f8fafc] dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] rounded-xl px-3.5 py-2.5 pr-10 text-[#0e1d25] dark:text-[#f1f5f9] focus:border-[#1e4e2b] dark:focus:border-[#8fbc8f] focus:ring-1 focus:ring-[#1e4e2b] outline-none transition-all text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727970] dark:text-[#a0aec0] hover:text-[#0e1d25] dark:hover:text-[#f1f5f9]"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#1e4e2b] text-white font-bold rounded-xl shadow-lg shadow-[#1e4e2b]/20 hover:bg-[#1e4e2b]/90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>{isSubmitting ? 'Memeriksa Kredensial...' : 'Masuk ke Akun'}</span>
              </button>
            </form>
          )}

          {/* Fast Demo Account Selector */}
          <div className="mt-5 pt-4 border-t border-[#d5e5ef] dark:border-[#28373f] relative z-10 space-y-2">
            <p className="text-[10px] font-bold text-[#727970] dark:text-[#a0aec0] uppercase tracking-wider text-center">
              Atau Gunakan Akun Demo Cepat
            </p>

            <div className="space-y-1.5">
              {accounts.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => fillDemoAccount(acc.email, acc.password || 'password123')}
                  className="w-full p-2 bg-[#f8fafc] dark:bg-[#1a282f] border border-[#d5e5ef] dark:border-[#28373f] hover:border-[#1e4e2b] dark:hover:border-[#8fbc8f] rounded-xl transition-all flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/20 text-[#1e4e2b] dark:text-[#8fbc8f] font-bold text-xs flex items-center justify-center shrink-0">
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[#0e1d25] dark:text-[#f1f5f9] leading-tight">{acc.name}</p>
                      <p className="text-[10px] text-[#727970] dark:text-[#a0aec0]">{acc.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#1e4e2b] dark:text-[#8fbc8f] opacity-70 group-hover:opacity-100 transition-opacity">
                    Pilih →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#142026] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#d5e5ef] dark:border-[#28373f] animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-[#0e1d25] dark:text-[#f1f5f9] mb-1">Lupa Kata Sandi</h3>
            <p className="text-xs text-[#727970] dark:text-[#a0aec0] mb-4">
              Masukkan email terdaftar Anda. Firebase Auth akan mengirimkan tautan pemulihan kata sandi resmi.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="email@domain.com"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
                className="w-full bg-[#f4faff] dark:bg-[#1a282f] border border-[#c2c9be] dark:border-[#28373f] rounded-xl px-4 py-2.5 text-xs text-[#0e1d25] dark:text-[#f1f5f9] outline-none focus:border-[#1e4e2b]"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#727970] dark:text-[#a0aec0] hover:text-[#0e1d25]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#1e4e2b] text-white rounded-xl hover:bg-[#1e4e2b]/90"
                >
                  Kirim Instruksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
