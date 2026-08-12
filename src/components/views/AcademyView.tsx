import React from 'react';
import { useApp } from '../../context/AppContext';
import { Article } from '../../types';

export const AcademyView: React.FC = () => {
  const { articles, selectedArticle, setSelectedArticle, setIsQuizOpen } = useApp();

  const featuredArticle = articles.find(a => a.isFeatured) || articles[0];
  const otherArticles = articles.filter(a => a.id !== featuredArticle.id);

  if (selectedArticle) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300 pb-16 max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#3e6842] hover:text-[#234c29] bg-[#8fbc8f]/10 px-4 py-2 rounded-full transition-colors w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Akademi Uang</span>
        </button>

        {/* Article Header */}
        <div className="glass-card rounded-[24px] p-6 md:p-10 space-y-6 overflow-hidden">
          <div className="flex items-center gap-3 text-xs font-semibold text-[#3e6842]">
            <span className="bg-[#8fbc8f]/20 px-3 py-1 rounded-full">{selectedArticle.category}</span>
            <span>•</span>
            <span className="text-[#727970]">{selectedArticle.readTime}</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-[#0e1d25] leading-tight">
            {selectedArticle.title}
          </h1>

          <div className="flex items-center gap-3 pt-2 border-t border-[#d5e5ef]">
            <div className="w-10 h-10 rounded-full bg-[#3e6842] text-white flex items-center justify-center font-bold text-sm">
              {selectedArticle.author.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-xs md:text-sm text-[#0e1d25]">{selectedArticle.author}</p>
              <p className="text-[11px] text-[#727970]">Penulis & Konsultan Keuangan Mindful</p>
            </div>
          </div>

          <img 
            src={selectedArticle.heroImage} 
            alt={selectedArticle.title}
            className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-sm my-6"
          />

          <p className="text-base md:text-lg text-[#0e1d25] font-medium leading-relaxed italic bg-[#8fbc8f]/10 p-5 rounded-2xl border-l-4 border-[#3e6842]">
            "{selectedArticle.summary}"
          </p>

          {/* Article Content Sections */}
          <div className="space-y-6 pt-4 text-sm md:text-base text-[#424940] leading-relaxed">
            {selectedArticle.sections ? (
              selectedArticle.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-[#0e1d25] pt-2">{sec.heading}</h3>
                  <p>{sec.body}</p>
                  
                  {sec.bulletPoints && (
                    <ul className="list-disc pl-6 space-y-1.5 text-xs md:text-sm font-medium text-[#0e1d25]">
                      {sec.bulletPoints.map((bp, bidx) => (
                        <li key={bidx}>{bp}</li>
                      ))}
                    </ul>
                  )}

                  {sec.quote && (
                    <blockquote className="p-4 rounded-xl bg-[#ffe088]/20 border-l-4 border-[#735c00] text-xs md:text-sm italic text-[#534200] my-4">
                      {sec.quote}
                    </blockquote>
                  )}
                </div>
              ))
            ) : (
              <p>
                Mengelola keuangan dengan mindful berarti hadir secara penuh di setiap keputusan finansial.
                Setiap kali kamu hendak membelanjakan uang, beri ruang bernapas sejenak untuk mengevaluasi apakah
                transaksi ini membawa nilai nyata bagi hidupmu.
              </p>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 rounded-2xl bg-[#8fbc8f]/20 border border-[#8fbc8f]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-[#0e1d25]">Selesai Membaca?</h4>
            <p className="text-xs text-[#424940]">Uji pemahamanmu dengan kuis psikologi finansial interaktif.</p>
          </div>
          <button
            onClick={() => setIsQuizOpen(true)}
            className="px-6 py-3 bg-[#3e6842] text-white rounded-xl font-bold text-xs md:text-sm shadow-md hover:bg-[#3e6842]/90 transition-all shrink-0"
          >
            Mulai Kuis Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0e1d25]">Akademi Uang</h2>
          <p className="text-xs md:text-sm text-[#424940] mt-0.5">
            Edukasi finansial bernapas lega untuk membangun kesadaran dan ketenangan.
          </p>
        </div>

        <button
          onClick={() => setIsQuizOpen(true)}
          className="bg-[#ffe088] text-[#241a00] hover:bg-[#ffd666] font-bold text-xs md:text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">quiz</span>
          <span>Kuis Psikologi Uang</span>
        </button>
      </div>

      {/* Featured Article Card */}
      <section 
        onClick={() => setSelectedArticle(featuredArticle)}
        className="glass-card rounded-[28px] p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 cursor-pointer hover:shadow-xl transition-all duration-300 group overflow-hidden border border-[#8fbc8f]/40"
      >
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-[#8fbc8f]/20 text-[#3e6842] font-bold text-xs rounded-full">
                {featuredArticle.category}
              </span>
              <span className="text-xs text-[#727970] font-medium">• {featuredArticle.readTime}</span>
            </div>
            <h3 className="text-xl md:text-3xl font-extrabold text-[#0e1d25] group-hover:text-[#3e6842] transition-colors leading-tight">
              {featuredArticle.title}
            </h3>
            <p className="text-xs md:text-sm text-[#424940] mt-3 line-clamp-3 leading-relaxed">
              {featuredArticle.summary}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#d5e5ef]">
            <span className="text-xs font-bold text-[#424940]">Oleh: {featuredArticle.author}</span>
            <span className="text-xs font-bold text-[#3e6842] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Baca Selengkapnya
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </span>
          </div>
        </div>

        <div className="md:col-span-5 h-56 md:h-auto rounded-2xl overflow-hidden">
          <img 
            src={featuredArticle.heroImage} 
            alt={featuredArticle.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Other Articles Grid */}
      <section className="space-y-4">
        <h3 className="font-bold text-lg text-[#0e1d25]">Artikel Pilihan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="glass-card rounded-[20px] p-5 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
            >
              <div>
                <div className="h-40 rounded-xl overflow-hidden mb-4">
                  <img 
                    src={article.heroImage} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold bg-[#e7f6ff] text-[#3e6842] px-2.5 py-0.5 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-[#727970]">• {article.readTime}</span>
                </div>
                <h4 className="font-bold text-base text-[#0e1d25] group-hover:text-[#3e6842] transition-colors leading-snug">
                  {article.title}
                </h4>
                <p className="text-xs text-[#424940] mt-2 line-clamp-2 leading-normal">
                  {article.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#d5e5ef] flex justify-between items-center text-xs">
                <span className="text-[#727970]">{article.author}</span>
                <span className="font-bold text-[#3e6842] group-hover:translate-x-1 transition-transform inline-flex items-center">
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
