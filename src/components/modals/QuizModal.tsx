import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const QuizModal: React.FC = () => {
  const { isQuizOpen, setIsQuizOpen, showToast } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  if (!isQuizOpen) return null;

  const questions = [
    {
      question: 'Saat melihat diskon besar untuk barang yang belum kamu butuhkan, apa reaksi pertamamu?',
      options: [
        'Langsung beli sebelum kehabisan!',
        'Ragu-ragu, tapi sering berakhir membelinya.',
        'Menerapkan aturan jeda 24 jam untuk berpikir.',
        'Mengabaikannya karena tidak ada di rencana anggaran.'
      ]
    },
    {
      question: 'Bagaimana perasaanmu ketika melihat angka saldo tabungan di akhir bulan?',
      options: [
        'Cemas karena terasa cepat berkurang.',
        'Biasa saja, asal tidak sampai minus.',
        'Tenang karena setiap pengeluaran sudah dialokasikan.',
        'Sangat puas dan bangga dengan konsistensi menabung.'
      ]
    },
    {
      question: 'Apa tujuan utama keuanganmu dalam 1 tahun ke depan?',
      options: [
        'Memiliki dana darurat 3-6 bulan pengeluaran.',
        'Mencapai target tabungan impian tertentu.',
        'Mengurangi pengeluaran impulsif dan hidup lebih mindful.',
        'Mulai rutin berinvestasi untuk jangka panjang.'
      ]
    }
  ];

  const handleSelectOption = (index: number) => {
    const nextAnswers = [...answers, index];
    setAnswers(nextAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(3); // Result step
    }
  };

  const handleFinish = () => {
    showToast('Kuis selesai! Profil Keuangan: "Mindful Builder" - Tingkatkan terus kedamaian finansialmu!');
    setIsQuizOpen(false);
    setStep(0);
    setAnswers([]);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg bg-[#FAF8F5]/95 rounded-2xl p-6 md:p-8 relative shadow-2xl border border-white/50">
        <div className="flex justify-between items-center mb-4 border-b border-[#e1dfdc] pb-3">
          <div className="flex items-center gap-2 text-[#3e6842]">
            <span className="material-symbols-outlined text-[24px]">quiz</span>
            <h3 className="font-bold text-lg text-[#0e1d25]">Kuis Psikologi Finansial</h3>
          </div>
          <button 
            onClick={() => {
              setIsQuizOpen(false);
              setStep(0);
              setAnswers([]);
            }}
            className="p-1 rounded-full text-[#424940] hover:bg-black/5"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {step < questions.length ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-[#727970]">
              <span>Pertanyaan {step + 1} dari {questions.length}</span>
              <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
            </div>

            <div className="w-full bg-[#d5e5ef] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#3e6842] h-full transition-all duration-300" 
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>

            <h4 className="font-bold text-sm md:text-base text-[#0e1d25] pt-2">
              {questions[step].question}
            </h4>

            <div className="space-y-2.5 pt-2">
              {questions[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className="w-full text-left p-3.5 rounded-xl border border-[#c2c9be] bg-white hover:bg-[#8fbc8f]/20 hover:border-[#3e6842] text-xs md:text-sm font-medium text-[#0e1d25] transition-all flex items-center justify-between"
                >
                  <span>{opt}</span>
                  <span className="material-symbols-outlined text-[#727970] text-[18px]">chevron_right</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-[#8fbc8f]/30 text-[#3e6842] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>

            <h4 className="font-bold text-xl text-[#0e1d25]">Profil Finansialmu: "Mindful Saver"</h4>
            <p className="text-xs md:text-sm text-[#424940] max-w-sm mx-auto leading-relaxed">
              Kamu memiliki kesadaran finansial yang sangat baik! Kamu cenderung mempertimbangkan keputusan belanja dengan tenang dan menghargai stabilitas jangka panjang.
            </p>

            <div className="p-4 bg-[#8fbc8f]/10 rounded-2xl border border-[#8fbc8f]/30 text-xs text-[#234c29] text-left">
              <p className="font-bold mb-1">Rekomendasi Langkah Berikutnya:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Pertahankan konsistensi menabung rutin setiap minggu.</li>
                <li>Gunakan Kalkulator Proyeksi Investasi untuk melihat pertumbuhan dana jangka panjang.</li>
              </ul>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 bg-[#3e6842] text-white font-bold text-sm rounded-xl shadow-lg hover:bg-[#3e6842]/90"
            >
              Selesai & Lanjutkan Belajar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
