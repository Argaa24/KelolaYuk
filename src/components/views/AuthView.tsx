import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AuthView: React.FC = () => {
  const { profile, setProfile, setCurrentView, showToast, registerUser, loginUser, logoutUser, accounts } = useApp();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
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

    const res = registerUser({
      name: fullName,
      email: email,
      password: password,
    });

    if (res.success) {
      setCurrentView('dashboard');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
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

    const res = loginUser(email, password);
    if (res.success) {
      setCurrentView('dashboard');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      showToast('Masukkan alamat email yang valid.');
      return;
    }
    showToast(`Instruksi pemulihan kata sandi telah dikirim ke ${resetEmail}`);
    setIsForgotPasswordOpen(false);
    setResetEmail('');
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setActiveTab('login');
    setErrorMessage(null);
  };

  // If user is already logged in, show Profile and Logout card
  if (profile.isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-6 px-4 animate-in fade-in duration-300">
        <div className="glass-panel w-full max-w-lg bg-[#FAF8F5]/95 rounded-[28px] p-8 shadow-2xl border border-white/50 relative overflow-hidden text-center">
          {/* Ambient blur */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#8fbc8f] rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#d5e5ef] rounded-full mix-blend-multiply filter blur-2xl opacity-40 pointer-events-none" />

          <div className="relative z-10">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full border-4 border-[#3e6842] object-cover shadow-lg"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-[#3e6842] border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]" title="Terhubung">
                ✓
              </span>
            </div>

            <div className="inline-block px-3 py-1 bg-[#8fbc8f]/20 text-[#3e6842] text-xs font-bold rounded-full mb-2">
              Akun Aktif • {profile.level}
            </div>

            <h2 className="text-2xl font-bold text-[#0e1d25]">{profile.name}</h2>
            <p className="text-sm text-[#727970] mb-6">{profile.email}</p>

            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              <div className="p-4 bg-white/80 rounded-2xl border border-[#d5e5ef]">
                <p className="text-xs text-[#727970]">Status Keanggotaan</p>
                <p className="font-bold text-[#3e6842] text-sm mt-0.5">{profile.title}</p>
              </div>
              <div className="p-4 bg-white/80 rounded-2xl border border-[#d5e5ef]">
                <p className="text-xs text-[#727970]">Sesi Terhubung</p>
                <p className="font-bold text-[#0e1d25] text-sm mt-0.5">Aktif di Perangkat Ini</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full py-3.5 bg-[#3e6842] text-white font-bold rounded-xl shadow-md hover:bg-[#3e6842]/90 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                <span>Kembali ke Dasbor Utama</span>
              </button>

              <button
                onClick={() => {
                  logoutUser();
                  setActiveTab('login');
                }}
                className="w-full py-3 bg-white border border-[#ba1a1a]/30 text-[#ba1a1a] font-bold rounded-xl hover:bg-[#ba1a1a]/10 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span>Keluar dari Akun Ini</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4 animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-md bg-[#FAF8F5]/95 rounded-[28px] p-6 sm:p-8 shadow-2xl border border-white/50 relative overflow-hidden">
        {/* Ambient background blur */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#8fbc8f] rounded-full mix-blend-multiply filter blur-2xl opacity-20 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#d5e5ef] rounded-full mix-blend-multiply filter blur-2xl opacity-40 pointer-events-none" />

        {/* Brand */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#3e6842] text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#3e6842]/20">
            <span className="material-symbols-outlined text-[32px]">spa</span>
          </div>
          <h2 className="text-2xl font-bold text-[#0e1d25]">
            Selamat Datang di KelolaYuk
          </h2>
          <p className="text-xs text-[#424940] mt-1">
            Mulai kelola keuangan dengan tenang & terencana.
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#e7f6ff] rounded-2xl mb-6 relative z-10 border border-[#d5e5ef]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'register'
                ? 'bg-[#3e6842] text-white shadow-sm'
                : 'text-[#424940] hover:text-[#0e1d25]'
            }`}
          >
            Daftar
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-[#3e6842] text-white shadow-sm'
                : 'text-[#424940] hover:text-[#0e1d25]'
            }`}
          >
            Masuk
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-[#ba1a1a]/10 border border-[#ba1a1a]/30 rounded-xl text-xs text-[#ba1a1a] flex items-center gap-2 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 relative z-10 text-xs md:text-sm">
            <div>
              <label className="block font-semibold text-[#0e1d25] mb-1">Nama Lengkap</label>
              <input
                type="text"
                placeholder="Contoh: Andi Pratama"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full bg-white border border-[#c2c9be] rounded-xl px-4 py-3 text-[#0e1d25] focus:border-[#3e6842] focus:ring-1 focus:ring-[#3e6842] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0e1d25] mb-1">Alamat Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-[#c2c9be] rounded-xl px-4 py-3 text-[#0e1d25] focus:border-[#3e6842] focus:ring-1 focus:ring-[#3e6842] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0e1d25] mb-1">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-[#c2c9be] rounded-xl px-4 py-3 pr-10 text-[#0e1d25] focus:border-[#3e6842] focus:ring-1 focus:ring-[#3e6842] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727970] hover:text-[#0e1d25]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#0e1d25] mb-1">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi kata sandi"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-[#c2c9be] rounded-xl px-4 py-3 pr-10 text-[#0e1d25] focus:border-[#3e6842] focus:ring-1 focus:ring-[#3e6842] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727970] hover:text-[#0e1d25]"
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
                className="mt-0.5 rounded text-[#3e6842] focus:ring-[#3e6842]"
              />
              <label htmlFor="terms" className="text-xs text-[#424940] leading-snug cursor-pointer">
                Saya menyetujui <span className="font-bold text-[#3e6842]">Syarat & Ketentuan</span> serta <span className="font-bold text-[#3e6842]">Kebijakan Privasi</span>.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#3e6842] text-white font-bold rounded-xl shadow-lg shadow-[#3e6842]/20 hover:bg-[#3e6842]/90 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              <span>Daftar Akun Baru</span>
            </button>
          </form>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10 text-xs md:text-sm">
            <div>
              <label className="block font-semibold text-[#0e1d25] mb-1">Email</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-[#c2c9be] rounded-xl px-4 py-3 text-[#0e1d25] focus:border-[#3e6842] focus:ring-1 focus:ring-[#3e6842] outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-[#0e1d25]">Kata Sandi</label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs font-bold text-[#3e6842] hover:underline"
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
                  className="w-full bg-white border border-[#c2c9be] rounded-xl px-4 py-3 pr-10 text-[#0e1d25] focus:border-[#3e6842] focus:ring-1 focus:ring-[#3e6842] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727970] hover:text-[#0e1d25]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#3e6842] text-white font-bold rounded-xl shadow-lg shadow-[#3e6842]/20 hover:bg-[#3e6842]/90 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              <span>Masuk ke Akun</span>
            </button>
          </form>
        )}

        {/* Demo Accounts Quick Fill */}
        <div className="mt-6 pt-5 border-t border-[#d5e5ef] relative z-10 space-y-3">
          <p className="text-[11px] font-bold text-[#727970] uppercase tracking-wider text-center">
            Atau Gunakan Akun Cepat
          </p>

          <div className="space-y-2">
            {accounts.map(acc => (
              <button
                key={acc.id}
                onClick={() => fillDemoAccount(acc.email, acc.password)}
                className="w-full p-2.5 bg-white/80 border border-[#c2c9be] hover:border-[#3e6842] rounded-xl transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#8fbc8f]/20 text-[#3e6842] font-bold text-xs flex items-center justify-center shrink-0">
                    {acc.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#0e1d25]">{acc.name}</p>
                    <p className="text-[10px] text-[#727970]">{acc.email}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#3e6842] opacity-0 group-hover:opacity-100 transition-opacity">
                  Pilih →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#d5e5ef] animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-[#0e1d25] mb-1">Lupa Kata Sandi</h3>
            <p className="text-xs text-[#727970] mb-4">
              Masukkan email terdaftar Anda. Kami akan mengirimkan tautan pemulihan kata sandi.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="email@domain.com"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
                className="w-full bg-[#f4faff] border border-[#c2c9be] rounded-xl px-4 py-2.5 text-xs text-[#0e1d25] outline-none focus:border-[#3e6842]"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#727970] hover:text-[#0e1d25]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#3e6842] text-white rounded-xl hover:bg-[#3e6842]/90"
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
