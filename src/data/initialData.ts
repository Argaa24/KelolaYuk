import { Transaction, SavingsGoal, Bill, BudgetItem, Article, UserProfile } from '../types';

export const initialProfile: UserProfile = {
  name: 'Budi Santoso',
  title: 'Mindful Saver',
  level: 'Zen Master',
  email: 'budi.santoso@kelolayuk.id',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeXlv6AkyxIMR7H8tTjglThq9MFgCYBDOXaFX1klKEM-PCLNXLltBULq2IXwDi1-_6Gc7frIpxU7xFqgVR6ixqCTvkn6Jj8Mp5o28AErnHDUWieJc-DShOeNOSFxh5AZHUA3ixOprh88bwM1DrQqx1F-NoHr2nOdk7uWBd5gQj0yXoE0IdI-IOPnBqynkDWTbWzFDJP1tnuDf85AlslRh3M1RYYqRUH2FMJbjmMbYCIVvkLsDF4X-E',
  isLoggedIn: true,
};

export const initialTransactions: Transaction[] = [];

export const initialGoals: SavingsGoal[] = [];

export const initialBills: Bill[] = [];

export const initialBudgetItems: BudgetItem[] = [];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Seni Mengatur Arus Kas Tanpa Rasa Cemas',
    summary: 'Pelajari teknik aliran air dalam mengelola pengeluaran bulanan. Bagaimana membuat setiap rupiah memiliki tujuan tanpa membuat Anda merasa terkekang.',
    readTime: '8 menit baca',
    author: 'Rina Wijaya, CFP',
    category: 'Dasar Keuangan',
    isFeatured: true,
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBme1N4-vRXfZpG7ijKs5LO3m9rOB-2bpSrntY8NDNS1tlALBQvgu8C6YZBYBbRLoGF7v2uF7ntMGKTTqjIY0UYfU8ivi9ydJPoWB_u-TltvqXFfnnSt_vKRCHdwxxAVTNgjVywJqd3urkw12eh17W8Jep-tb7XEqJNkB-xdYgidKcqpVRkzt9YOC4motTA8o6t9SSD3CEErbEzaFF5DZcYsJKT1Jl-Xfkdhl0FeByPrqa7OkziSNpR',
    sections: [
      {
        heading: '1. Mengalirkan Dana Seperti Air',
        body: 'Arus kas yang sehat bukan tentang menahan napas atau menahan semua pengeluaran sampai merasa tersiksa. Seperti aliran air yang lancar, dana Anda perlu memiliki wadah yang jelas dan terarah.',
        bulletPoints: [
          'Pisahkan wadah kebutuhan pokok di awal bulan.',
          'Alokasikan porsi khusus untuk rasa tenang (dana darurat).',
          'Beri ruang untuk menikmati hidup tanpa rasa bersalah.',
        ]
      },
      {
        heading: '2. Membangun Habit Kesadaran Bulanan',
        body: 'Setiap kali bertransaksi, sempatkan jeda 3 detik untuk bertanya: "Apakah transaksi ini membawa ketenangan jangka panjang atau sekadar kepuasan sesaat?"',
      }
    ]
  },
  {
    id: 'art-2',
    title: 'Memahami Kebutuhan vs. Keinginan',
    summary: 'Kunci dari ketenangan finansial bukanlah seberapa banyak yang kita hasilkan, melainkan seberapa bijak kita membedakan apa yang benar-benar kita perlukan dengan apa yang sekadar kita inginkan saat ini.',
    readTime: '5 menit baca',
    author: 'Budi Darmawan',
    category: 'Psikologi Uang',
    isPopular: true,
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiX3vJ31VtJBkDLKwowy6YHjH-uXUw7_Ef1Zencsp3La9aR_W7juydNNVIp0Kar2Gl4bxSHxX_3RhrobEONTfDrowHgt-8X-PK5eTAQQ9q9MZF3hfUYZdBMMMewTBc06f-M23Ua1Ti44E7KDs-Ass2Y55OYVfbpDTabZVwtkvPHO6B-Jx1Gm_rUDsJgR65SjBBUtOfOeE0TAXOjbjVO6CzD1s8LZcx1RQYvJrt9gAgupdiWnp4EVNGRQ',
    sections: [
      {
        heading: 'Apa itu Kebutuhan?',
        body: 'Kebutuhan adalah segala sesuatu yang esensial bagi kelangsungan hidup dan fungsi dasar kita sehari-hari. Tanpanya, kehidupan atau kesehatan kita akan terganggu secara signifikan.',
        bulletPoints: [
          'Tempat tinggal yang aman dan layak.',
          'Nutrisi seimbang untuk tubuh.',
          'Transportasi dasar untuk bekerja.',
        ]
      },
      {
        heading: 'Apa itu Keinginan?',
        body: 'Keinginan adalah hal-hal yang meningkatkan kualitas hidup kita, memberikan kesenangan, atau status, tetapi tidak mendesak untuk kelangsungan hidup.',
        quote: '"Garis antara kebutuhan dan keinginan seringkali kabur karena pengaruh iklan dan media sosial. Sesuatu yang kita inginkan seringkali kita labeli sebagai kebutuhan agar kita merasa nyaman membelinya."'
      },
      {
        heading: 'Metode 24 Jam',
        body: 'Salah satu cara termudah untuk membedakan keduanya adalah dengan menerapkan aturan 24 jam. Jika Anda melihat sesuatu yang ingin Anda beli secara impulsif, tunggulah selama 24 jam penuh sebelum menekan tombol beli.',
      }
    ]
  },
  {
    id: 'art-3',
    title: 'Pondasi Inflasi 101',
    summary: 'Pahami musuh tersembunyi tabungan Anda dan bagaimana cara menjinakkan dampaknya terhadap masa depan.',
    readTime: '5 menit baca',
    author: 'Aulia Rahma',
    category: 'Investasi Mindful',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2R-wd9957y6l4XC2Ts3yQXzcsSVpjdT4y81h4M9U-KNYLeed1v_l6QOMX_G00HKxOtPv9SAOOyDq1jtDkNMpTLqZY9L7dC9JwlDLiDEx0Am64_fFtK3szk6xtoLHScZaiDer4SHcM9bPFB4cUKRDDXBZv0z9NvNdmwZQqPmOwMGtFC3co1VzGfkAsRkp85uk5x39J9fGlRtGf715iJQ6RVp6iwzfHituyuHTo_v6h82hk4br2lc-k',
    level: 'Pemula'
  },
  {
    id: 'art-4',
    title: '5 Langkah Dana Darurat',
    summary: 'Langkah mudah membangun jaring pengaman finansial pertama Anda dengan aman.',
    readTime: '4 menit baca',
    author: 'Rina Wijaya, CFP',
    category: 'Dasar Keuangan',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaSm02rNp4AHYkgzJoWNA5-wphe5q1uBgVrWH_nuaqjnIf7SQ2G4zI99waIOkfcpCwewOZu0LvGKXfo0RK6oPEnUQQnSqCX5OV03n3_URvs-0OMKjPxzMGVVBH4NO4kTBa8QksSAtbVC2MqUhYNEMuo_Fy2oul11v-VPmm8g-_Ac-VqFZiH6oj4dg4uEL8fH-uZdEXyd9JrPtVTLtw8VF0mAx4H27DHlRclKfxqyIGTJFogLwCIS_y',
  },
  {
    id: 'art-5',
    title: 'Sejarah Singkat Uang Modern',
    summary: 'Memahami evolusi uang dari barter hingga bentuk digital modern.',
    readTime: '6 menit baca',
    author: 'Tim KelolaYuk',
    category: 'Dasar Keuangan',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoB1YEJG4JgI40XZhTaDo85MVoYsbSNxojGVr3qUxTelhR-2quUc2pTgIfGuyoKAfGtfrAu2btUXNGmit1uLEGfobp37HaRLIH684pchZzdu_G6aeZF5geGF1UIb8wkLJephUbhDtnhx4UH_4IdXZaEhcJdYKPq_0WhZ2qGC4Kljk9995SwT2AiWKOpV3TSk4iVYo2NBgPrjM9H2ei9b7XU1oPyvMa1JgQnuXlpg9F6y6pV4nQEHET',
  },
  {
    id: 'art-6',
    title: 'Checklist Budgeting Bulanan',
    summary: 'Daftar periksa lengkap untuk menyusun anggaran bebas rasa cemas.',
    readTime: '3 menit baca',
    author: 'Andini Putri',
    category: 'Dasar Keuangan',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSnIBpIuMz7SqRL71cr1yOaGxFqXboARhk48wo1Wd6cC8QcXsPb7g5Cn6pA8-RYSVCgTD_-b-rzx-Ib21cnidHZYjhAbhNFsovsBTwLgXza1CRjHyGjtkWeS7MCClpnlvukSW1vOlD1_hsGFkrIzMqqshBOp5jckjcTt4dookrJJSH6yz5c6KggIGitoCPedN8L0CDEXALRMXTAy6SwRVau6BLZ4fGBemYNAgHEpJ7Ad89pyg3Iszk',
  }
];
