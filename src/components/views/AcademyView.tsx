import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Article } from '../../types';

export const AcademyView: React.FC = () => {
  const { articles, selectedArticle, setSelectedArticle, setIsQuizOpen, setCurrentView, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [savedArticles, setSavedArticles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kelolayuk_saved_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleSaveArticle = (articleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedArticles(prev => {
      const isSaved = prev.includes(articleId);
      const updated = isSaved ? prev.filter(id => id !== articleId) : [...prev, articleId];
      try {
        localStorage.setItem('kelolayuk_saved_articles', JSON.stringify(updated));
      } catch {}
      showToast(isSaved ? 'Dihapus dari simpanan' : 'Artikel disimpan untuk dibaca nanti');
      return updated;
    });
  };

  const categories = ['Semua', 'Dasar Keuangan', 'Perencanaan & Budgeting', 'Investasi & Inflasi', 'Psikologi Uang', 'Manajemen Utang'];

  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchCategory = selectedCategory === 'Semua' || art.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = articles.find(a => a.isFeatured) || articles[0];

  // If reading a single article
  if (selectedArticle) {
    const isSaved = savedArticles.includes(selectedArticle.id);
    const relatedArticles = articles
      .filter(a => a.id !== selectedArticle.id)
      .slice(0, 3);

    return (
      <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-4xl mx-auto">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => setSelectedArticle(null)}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-[#1e4e2b] dark:text-[#8fbc8f] hover:bg-[#1e4e2b]/10 dark:hover:bg-[#8fbc8f]/10 bg-white dark:bg-[#162228] border border-[#e2e8f0] dark:border-[#28373f] px-4 py-2.5 rounded-full transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali ke Daftar Artikel</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Font size toggle */}
            <div className="flex items-center bg-white dark:bg-[#162228] border border-[#e2e8f0] dark:border-[#28373f] rounded-full p-1 shadow-xs text-xs font-bold text-[#526458] dark:text-[#a0aec0]">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${fontSize === 'normal' ? 'bg-[#1e4e2b] text-white' : 'hover:text-[#0e1d25] dark:hover:text-[#f1f5f9]'}`}
                title="Ukuran teks normal"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${fontSize === 'large' ? 'bg-[#1e4e2b] text-white' : 'hover:text-[#0e1d25] dark:hover:text-[#f1f5f9]'}`}
                title="Ukuran teks besar"
              >
                A+
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => toggleSaveArticle(selectedArticle.id)}
              className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-xs flex items-center justify-center ${
                isSaved 
                  ? 'bg-[#1e4e2b] text-white border-[#1e4e2b]' 
                  : 'bg-white dark:bg-[#162228] border-[#e2e8f0] dark:border-[#28373f] text-[#526458] dark:text-[#a0aec0] hover:text-[#1e4e2b] dark:hover:text-[#8fbc8f]'
              }`}
              title={isSaved ? 'Tersimpan di daftar baca' : 'Simpan artikel ini'}
            >
              <span className="material-symbols-outlined text-[19px]">
                {isSaved ? 'bookmark_added' : 'bookmark_border'}
              </span>
            </button>
          </div>
        </div>

        {/* Main Article Container */}
        <article className="bg-white dark:bg-[#162228] rounded-[32px] p-6 md:p-10 border border-[#e2e8f0] dark:border-[#28373f] shadow-xs space-y-7">
          {/* Category & Metadata */}
          <div className="flex items-center gap-2.5 flex-wrap text-xs font-bold">
            <span className="bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/20 text-[#1e4e2b] dark:text-[#8fbc8f] px-3.5 py-1.5 rounded-full">
              {selectedArticle.category}
            </span>
            {selectedArticle.level && (
              <span className="bg-[#eef2f6] dark:bg-[#20313a] text-[#526458] dark:text-[#a0aec0] px-3 py-1.5 rounded-full">
                Level: {selectedArticle.level}
              </span>
            )}
            <span className="text-[#8a99a8] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              {selectedArticle.readTime}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#0e1d25] dark:text-[#f1f5f9] leading-tight tracking-tight">
            {selectedArticle.title}
          </h1>

          {/* Author Badge */}
          <div className="flex items-center gap-3.5 pt-4 pb-4 border-y border-[#edf2f7] dark:border-[#23333c]">
            <div className="w-11 h-11 rounded-full bg-[#1e4e2b] dark:bg-[#8fbc8f] text-white dark:text-[#0e1d25] flex items-center justify-center font-extrabold text-base shrink-0 shadow-xs">
              {selectedArticle.author.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm text-[#0e1d25] dark:text-[#f1f5f9] flex items-center gap-1.5">
                <span>{selectedArticle.author}</span>
                <span className="material-symbols-outlined text-[16px] text-[#1e4e2b] dark:text-[#8fbc8f]" title="Konsultan Terverifikasi">verified</span>
              </p>
              <p className="text-xs text-[#718096] dark:text-[#8a99a8]">Edukator Keuangan & Perencana Keuangan Terverifikasi</p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden max-h-[380px] border border-[#edf2f7] dark:border-[#23333c] shadow-xs">
            <img 
              src={selectedArticle.heroImage} 
              alt={selectedArticle.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Summary / Lead Quote */}
          <div className="p-5 md:p-6 rounded-2xl bg-[#f7faf8] dark:bg-[#1c2c34] border-l-4 border-[#1e4e2b] dark:border-[#8fbc8f] text-[#2d3748] dark:text-[#e2e8f0]">
            <p className="font-medium text-sm md:text-base leading-relaxed italic">
              "{selectedArticle.summary}"
            </p>
          </div>

          {/* Article Sections */}
          <div className={`space-y-8 pt-2 ${fontSize === 'large' ? 'text-base md:text-lg' : 'text-sm md:text-base'} text-[#334155] dark:text-[#cbd5e1] leading-relaxed`}>
            {selectedArticle.sections && selectedArticle.sections.length > 0 ? (
              selectedArticle.sections.map((sec, idx) => (
                <section key={idx} className="space-y-3.5 pt-2">
                  <h2 className="text-lg md:text-2xl font-bold text-[#0e1d25] dark:text-[#f1f5f9] tracking-tight">
                    {sec.heading}
                  </h2>
                  <p className="leading-relaxed">
                    {sec.body}
                  </p>

                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <div className="my-4 p-4 md:p-5 rounded-2xl bg-[#f8faf9] dark:bg-[#19272f] border border-[#e2e8f0] dark:border-[#28373f] space-y-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#1e4e2b] dark:text-[#8fbc8f] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>Poin Kunci & Langkah Praktis</span>
                      </p>
                      <ul className="space-y-2 text-xs md:text-sm font-medium text-[#1e293b] dark:text-[#e2e8f0] pl-1">
                        {sec.bulletPoints.map((bp, bidx) => (
                          <li key={bidx} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1e4e2b] dark:bg-[#8fbc8f] mt-2 shrink-0"></span>
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sec.quote && (
                    <blockquote className="p-4 md:p-5 rounded-2xl bg-[#fffbeb] dark:bg-[#28261e] border-l-4 border-[#f59e0b] dark:border-[#fbbf24] text-xs md:text-sm italic text-[#92400e] dark:text-[#fde68a] my-5 leading-relaxed">
                      {sec.quote}
                    </blockquote>
                  )}
                </section>
              ))
            ) : (
              <p>
                Mengelola keuangan dengan sadar dan tenang (mindful finance) adalah kunci utama membangun masa depan yang aman. Sisihkan waktu untuk meninjau arus kas secara berkala.
              </p>
            )}
          </div>

          {/* Quick Action Box */}
          <div className="pt-6 border-t border-[#edf2f7] dark:border-[#23333c] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-sm text-[#0e1d25] dark:text-[#f1f5f9]">Ingin menguji pemahaman Anda?</h3>
              <p className="text-xs text-[#718096] dark:text-[#8a99a8]">Ikuti kuis psikologi finansial interaktif untuk mengetahui profil keuanganmu.</p>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setCurrentView('calculator')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 dark:bg-[#20313a] text-[#0e1d25] dark:text-[#f1f5f9] hover:bg-slate-200 dark:hover:bg-[#283d48] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">calculate</span>
                <span>Kalkulator</span>
              </button>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-[#1e4e2b] hover:bg-[#1e4e2b]/90 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#1e4e2b]/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">quiz</span>
                <span>Mulai Kuis</span>
              </button>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        <section className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-[#0e1d25] dark:text-[#f1f5f9] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1e4e2b] dark:text-[#8fbc8f]">auto_stories</span>
            <span>Artikel Keuangan Terkait Lainnya</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map(art => (
              <div
                key={art.id}
                onClick={() => {
                  setSelectedArticle(art);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#162228] border border-[#e2e8f0] dark:border-[#28373f] hover:border-[#1e4e2b]/40 dark:hover:border-[#8fbc8f]/40 transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:-translate-y-0.5"
              >
                <div>
                  <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={art.heroImage} 
                      alt={art.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/20 text-[#1e4e2b] dark:text-[#8fbc8f] px-2 py-0.5 rounded-full">
                    {art.category}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0e1d25] dark:text-[#f1f5f9] mt-2 group-hover:text-[#1e4e2b] dark:group-hover:text-[#8fbc8f] line-clamp-2">
                    {art.title}
                  </h4>
                </div>
                <p className="text-[11px] text-[#718096] dark:text-[#8a99a8] mt-3 flex items-center justify-between">
                  <span>{art.readTime}</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Articles Catalog View
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#fcf9f2] dark:bg-[#192429] p-6 md:p-8 rounded-[32px] border border-[#eee6d4] dark:border-[#28373f] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/20 text-[#1e4e2b] dark:text-[#8fbc8f] font-bold text-xs">
              Edukasi Finansial Terverifikasi
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0e1d25] dark:text-[#f1f5f9] tracking-tight">
            Akademi Uang
          </h2>
          <p className="text-xs md:text-sm text-[#526458] dark:text-[#a0aec0] mt-1 max-w-xl leading-relaxed">
            Kumpulan artikel panduan praktis, strategi arus kas, psikologi uang, dan investasi dari para perencana keuangan bersertifikat.
          </p>
        </div>

        <button
          onClick={() => setIsQuizOpen(true)}
          className="bg-[#ffe088] text-[#241a00] hover:bg-[#ffd666] font-bold text-xs md:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">quiz</span>
          <span>Kuis Psikologi Uang</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#718096]">
              search
            </span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik artikel (misal: dana darurat, inflasi, 50/30/20, utang)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#162228] border border-[#e2e8f0] dark:border-[#28373f] text-xs sm:text-sm text-[#0e1d25] dark:text-[#f1f5f9] placeholder-[#8a99a8] focus:outline-none focus:border-[#1e4e2b] dark:focus:border-[#8fbc8f] shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#718096] hover:text-[#0e1d25]"
              >
                Batal
              </button>
            )}
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1e4e2b] text-white shadow-xs'
                  : 'bg-white dark:bg-[#162228] text-[#526458] dark:text-[#a0aec0] border border-[#e2e8f0] dark:border-[#28373f] hover:bg-slate-50 dark:hover:bg-[#1e2f38]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article Card (Shown when on "Semua" and no search) */}
      {selectedCategory === 'Semua' && searchQuery.trim() === '' && featuredArticle && (
        <section 
          onClick={() => setSelectedArticle(featuredArticle)}
          className="bg-white dark:bg-[#162228] rounded-[32px] p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 cursor-pointer hover:shadow-lg transition-all duration-300 group overflow-hidden border border-[#e2e8f0] dark:border-[#28373f] hover:border-[#1e4e2b]/50 dark:hover:border-[#8fbc8f]/50"
        >
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <span className="px-3 py-1 bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/20 text-[#1e4e2b] dark:text-[#8fbc8f] font-bold text-xs rounded-full">
                  ★ Artikel Utama
                </span>
                <span className="text-xs text-[#718096] dark:text-[#8a99a8] font-semibold">{featuredArticle.category}</span>
                <span className="text-xs text-[#718096] dark:text-[#8a99a8] font-medium">• {featuredArticle.readTime}</span>
              </div>
              <h3 className="text-xl md:text-3xl font-extrabold text-[#0e1d25] dark:text-[#f1f5f9] group-hover:text-[#1e4e2b] dark:group-hover:text-[#8fbc8f] transition-colors leading-tight">
                {featuredArticle.title}
              </h3>
              <p className="text-xs md:text-sm text-[#526458] dark:text-[#a0aec0] mt-3 line-clamp-3 leading-relaxed">
                {featuredArticle.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#edf2f7] dark:border-[#23333c]">
              <span className="text-xs font-bold text-[#526458] dark:text-[#a0aec0]">Oleh: {featuredArticle.author}</span>
              <span className="text-xs font-bold text-[#1e4e2b] dark:text-[#8fbc8f] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Baca Selengkapnya
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            </div>
          </div>

          <div className="md:col-span-5 h-56 md:h-auto rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img 
              src={featuredArticle.heroImage} 
              alt={featuredArticle.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-[#0e1d25] dark:text-[#f1f5f9]">
            {searchQuery ? `Hasil Pencarian ("${searchQuery}")` : selectedCategory === 'Semua' ? 'Koleksi Artikel Lengkap' : `Topik: ${selectedCategory}`}
          </h3>
          <span className="text-xs text-[#718096] dark:text-[#8a99a8] font-semibold">
            {filteredArticles.length} Artikel
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#162228] rounded-[28px] border border-dashed border-[#e2e8f0] dark:border-[#28373f] space-y-3">
            <span className="material-symbols-outlined text-[40px] text-[#718096]">menu_book</span>
            <p className="text-sm font-bold text-[#0e1d25] dark:text-[#f1f5f9]">Tidak ada artikel yang cocok</p>
            <p className="text-xs text-[#718096] max-w-sm mx-auto">Coba gunakan kata kunci lain atau pilih kategori "Semua" untuk melihat seluruh panduan.</p>
            <button
              onClick={() => { setSelectedCategory('Semua'); setSearchQuery(''); }}
              className="px-4 py-2 bg-[#1e4e2b] text-white rounded-xl text-xs font-bold mt-2"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => {
              const isSaved = savedArticles.includes(article.id);
              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white dark:bg-[#162228] rounded-[24px] p-5 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300 group border border-[#e2e8f0] dark:border-[#28373f] hover:border-[#1e4e2b]/40 dark:hover:border-[#8fbc8f]/40"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="h-44 rounded-2xl overflow-hidden mb-4 relative bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={article.heroImage} 
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <button
                        onClick={(e) => toggleSaveArticle(article.id, e)}
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
                          isSaved 
                            ? 'bg-[#1e4e2b] text-white' 
                            : 'bg-white/90 dark:bg-[#162228]/90 text-[#0e1d25] dark:text-[#f1f5f9] hover:bg-[#1e4e2b] hover:text-white'
                        }`}
                        title={isSaved ? 'Tersimpan' : 'Simpan artikel'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isSaved ? 'bookmark' : 'bookmark_border'}
                        </span>
                      </button>
                    </div>

                    {/* Category & Level Badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] font-bold bg-[#1e4e2b]/10 dark:bg-[#8fbc8f]/20 text-[#1e4e2b] dark:text-[#8fbc8f] px-2.5 py-0.5 rounded-full">
                        {article.category}
                      </span>
                      {article.level && (
                        <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-[#526458] dark:text-[#a0aec0] px-2 py-0.5 rounded-full">
                          {article.level}
                        </span>
                      )}
                      <span className="text-[10px] text-[#718096] dark:text-[#8a99a8]">• {article.readTime}</span>
                    </div>

                    <h4 className="font-bold text-base text-[#0e1d25] dark:text-[#f1f5f9] group-hover:text-[#1e4e2b] dark:group-hover:text-[#8fbc8f] transition-colors leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-xs text-[#526458] dark:text-[#a0aec0] mt-2 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#edf2f7] dark:border-[#23333c] flex justify-between items-center text-xs">
                    <span className="text-[#718096] dark:text-[#8a99a8] font-medium truncate max-w-[150px]">
                      {article.author}
                    </span>
                    <span className="font-bold text-[#1e4e2b] dark:text-[#8fbc8f] group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                      <span>Baca</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
