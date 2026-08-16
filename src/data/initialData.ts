import { Transaction, SavingsGoal, Bill, BudgetItem, Article, UserProfile } from '../types';

export const initialProfile: UserProfile = {
  name: 'Pengguna Baru',
  title: 'Pemula Finansial',
  level: 'Level 1',
  email: '',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeXlv6AkyxIMR7H8tTjglThq9MFgCYBDOXaFX1klKEM-PCLNXLltBULq2IXwDi1-_6Gc7frIpxU7xFqgVR6ixqCTvkn6Jj8Mp5o28AErnHDUWieJc-DShOeNOSFxh5AZHUA3ixOprh88bwM1DrQqx1F-NoHr2nOdk7uWBd5gQj0yXoE0IdI-IOPnBqynkDWTbWzFDJP1tnuDf85AlslRh3M1RYYqRUH2FMJbjmMbYCIVvkLsDF4X-E',
  isLoggedIn: false,
};

export const initialTransactions: Transaction[] = [];

export const initialGoals: SavingsGoal[] = [];

export const initialBills: Bill[] = [];

export const initialBudgetItems: BudgetItem[] = [];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Seni Mengatur Arus Kas Tanpa Rasa Cemas',
    summary: 'Pelajari teknik cashflow mindful untuk mengelola pengeluaran bulanan. Cara membuat setiap rupiah memiliki tujuan yang jelas tanpa membuat Anda merasa tersiksa atau terkekang.',
    readTime: '6 menit baca',
    author: 'Rina Wijaya, CFP',
    category: 'Dasar Keuangan',
    level: 'Pemula',
    isFeatured: true,
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Mengalirkan Dana Seperti Air: Prinsip Cashflow Mindful',
        body: 'Arus kas yang sehat bukan tentang menahan semua pengeluaran sampai hidup terasa kaku. Seperti aliran air yang lancar, dana Anda perlu memiliki wadah penampung (pos rekening) yang jelas agar tidak bocor tanpa disadari.',
        bulletPoints: [
          'Pisahkan rekening penerimaan gaji dengan rekening belanja harian.',
          'Alokasikan otomatis dana tabungan di hari pertama gajian, bukan dari sisa akhir bulan.',
          'Beri ruang jatah "bebas bersalah" (guilt-free spending) sebesar 10-15% untuk hobi dan refreshing.'
        ]
      },
      {
        heading: '2. Kebiasaan Jeda 3 Detik Sebelum Transaksi',
        body: 'Setiap kali akan membuka dompet digital atau menempelkan kartu pembayaran, ambil napas dalam dan tanyakan pada diri sendiri: "Apakah transaksi ini membawa ketenangan jangka panjang atau sekadar lonjakan dopamin sesaat?"',
        quote: '"Kekayaan sejati bukanlah tentang seberapa banyak barang yang Anda beli untuk membuat orang lain terkesan, melainkan ketenangan batin saat saldo Anda cukup untuk menghadapi masa depan."'
      },
      {
        heading: '3. Evaluasi Berkala Mingguan (Weekly Money Date)',
        body: 'Luangkan waktu 10 menit setiap akhir pekan (misalnya Minggu malam) untuk meninjau catatan transaksi di KelolaYuk. Cek kategori mana yang paling boros dan sesuaikan anggaran untuk pekan berikutnya.',
        bulletPoints: [
          'Cek apakah ada langganan aplikasi/layanan yang sudah tidak pernah dipakai.',
          'Bandingkan total pengeluaran dengan target anggaran bulanan.',
          'Apresiasi diri sendiri jika berhasil menahan belanja impulsif.'
        ]
      }
    ]
  },
  {
    id: 'art-2',
    title: 'Metode Budgeting 50/30/20: Kebutuhan, Keinginan & Tabungan',
    summary: 'Kunci dari ketenangan finansial bukanlah seberapa besar penghasilan Anda, melainkan bagaimana Anda membagi pos pengeluaran secara terukur dan disiplin.',
    readTime: '5 menit baca',
    author: 'Budi Darmawan, RFC',
    category: 'Perencanaan & Budgeting',
    level: 'Pemula',
    isPopular: true,
    heroImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Proporsi 50%: Kebutuhan Pokok (Needs)',
        body: 'Alokasikan maksimal 50% dari pendapatan bersih untuk hal-hal yang mutlak Anda perlukan untuk bertahan hidup dan bekerja. Ini mencakup sewa rumah/cicilan KPR, tagihan listrik, air, internet kerja, belanja makan pokok, transportasi harian, dan premi asuransi kesehatan.',
        bulletPoints: [
          'Jika porsi kebutuhan Anda melebihi 50%, prioritaskan efisiensi biaya makan harian atau cari alternatif transportasi hemat.',
          'Jangan masukkan cicilan barang konsumtif (gadget baru, pakaian bermerek) ke dalam pos ini.'
        ]
      },
      {
        heading: '2. Proporsi 30%: Keinginan & Gaya Hidup (Wants)',
        body: 'Anda tetap berhak menikmati hasil kerja keras Anda. Pos 30% ini adalah jatah untuk makan di kafe, nonton bioskop, traveling, membeli buku kesukaan, hingga merawat diri.',
        quote: '"Budgeting bukan penjara yang melarang Anda bersenang-senang, melainkan izin resmi dari diri Anda untuk menikmati hidup sesuai batas kemampuan."'
      },
      {
        heading: '3. Proporsi 20%: Masa Depan & Tabungan (Savings & Debt Repayment)',
        body: 'Porsi 20% ini dialokasikan langsung untuk tiga hal utama secara berurutan: pengisian Dana Darurat, pelunasan utang berbunga tinggi, dan investasi jangka panjang (reksa dana, emas, saham/SBN).',
        bulletPoints: [
          'Tahap 1: Kumpulkan dana darurat minimal 3 bulan pengeluaran rutin.',
          'Tahap 2: Lunasi utang konsumtif/paylater.',
          'Tahap 3: Investasikan sisa porsi ke instrumen pasar modal atau surat berharga negara.'
        ]
      }
    ]
  },
  {
    id: 'art-3',
    title: 'Panduan Membangun Dana Darurat 3–6 Bulan Tanpa Stres',
    summary: 'Langkah taktis dan realistis membangun jaring pengaman finansial pertama Anda agar tidak panik saat terjadi hal tak terduga seperti sakit atau perbaikan rumah mendadak.',
    readTime: '7 menit baca',
    author: 'Aulia Rahma, CFP',
    category: 'Dasar Keuangan',
    level: 'Menengah',
    heroImage: 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: 'Berapa Besar Dana Darurat yang Ideal untuk Anda?',
        body: 'Jumlah ideal dana darurat bergantung pada status tanggungan dan kestabilan pendapatan Anda:',
        bulletPoints: [
          'Lajang / Belum Menikah: 3 kali total pengeluaran rutin bulanan.',
          'Menikah tanpa anak: 6 kali total pengeluaran rutin bulanan.',
          'Menikah dengan 1-2 anak: 9 kali total pengeluaran rutin bulanan.',
          'Freelancer / Pengusaha dengan penghasilan fluktuatif: 12 kali pengeluaran bulanan.'
        ]
      },
      {
        heading: 'Di Mana Dana Darurat Sebaiknya Disimpan?',
        body: 'Kriteria utama tempat penyimpanan dana darurat adalah Likuid (mudah dicairkan dalam 1x24 jam), Aman (pokok tidak berfluktuasi tajam), dan Terpisah dari rekening operasional belanja harian.',
        bulletPoints: [
          '50% di Tabungan Digital / Rekening Bank Khusus (bebas biaya admin).',
          '30% di Reksa Dana Pasar Uang (RDPU) yang pencairannya T+1 tanpa biaya penarikan.',
          '20% dalam bentuk Logam Mulia (Emas) atau uang tunai di brankas rumah.'
        ]
      },
      {
        heading: 'Kapan Boleh Menggunakan Dana Darurat?',
        body: 'Gunakan dana ini HANYA jika memenuhi kriteria 3T: Tak Terduga (Unplanned), Terdesak/Darurat (Urgent), dan Tidak Bisa Ditunda (Essential). Diskon flash sale atau tiket konser bukan situasi darurat!'
      }
    ]
  },
  {
    id: 'art-4',
    title: 'Pondasi Inflasi 101: Menyelamatkan Daya Beli Uang Anda',
    summary: 'Pahami musuh tersembunyi tabungan konvensional Anda dan bagaimana strategi praktis agar nilai uang Anda tidak tergerus kenaikan harga barang dari tahun ke tahun.',
    readTime: '6 menit baca',
    author: 'Fajar Nugroho, CFA',
    category: 'Investasi & Inflasi',
    level: 'Menengah',
    isPopular: true,
    heroImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Apa Itu Inflasi dan Mengapa Anda Harus Peduli?',
        body: 'Inflasi adalah kenaikan harga barang dan jasa secara umum dan terus menerus. Contoh sederhananya: seporsi bakso pada tahun 2010 seharga Rp 7.000, kini di tahun 2026 harganya sudah mencapai Rp 20.000 - Rp 25.000. Uang Rp 100.000 di masa lalu bisa membeli jauh lebih banyak barang dibanding hari ini.',
        bulletPoints: [
          'Rata-rata inflasi tahunan di Indonesia berkisar antara 2.5% hingga 4.5% per tahun.',
          'Bunga tabungan bank biasa hanya sekitar 0% - 1% (belum dipotong pajak 20% dan biaya admin bulanan).',
          'Artinya: Menyimpan seluruh uang di rekening tabungan biasa justru membuat daya beli Anda berkurang setiap tahun.'
        ]
      },
      {
        heading: '2. Cara Menang Melawan Inflasi',
        body: 'Solusi satu-satunya agar daya beli Anda tidak turun adalah dengan menempatkan sebagian dana pada instrumen aset produktif yang imbal hasilnya melampaui tingkat inflasi.',
        quote: '"Inflasi adalah pajak tersembunyi bagi orang yang hanya menabung, tetapi menjadi peluang bagi mereka yang cerdas berinvestasi pada aset produktif."'
      },
      {
        heading: '3. Piramida Alokasi Aset Melawan Inflasi',
        body: 'Mulai dengan instrumen rendah risiko terlebih dahulu:',
        bulletPoints: [
          'Jangka Pendek (< 1 tahun): Reksa Dana Pasar Uang (return ~4.5% - 5.5% p.a.).',
          'Jangka Menengah (1 - 5 tahun): Surat Berharga Negara / Sukuk Ritel (SBN/ORI) & Emas.',
          'Jangka Panjang (> 5 tahun): Reksa Dana Saham / Index Fund IHSG.'
        ]
      }
    ]
  },
  {
    id: 'art-5',
    title: 'Strategi Bebas Utang: Metode Snowball vs Avalanche',
    summary: 'Dua metode teruji paling efektif untuk melunasi cicilan, utang kartu kredit, atau pinjaman online tanpa membuat mental Anda drop.',
    readTime: '8 menit baca',
    author: 'Rina Wijaya, CFP',
    category: 'Manajemen Utang',
    level: 'Lanjutan',
    heroImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Metode Debt Snowball (Kemenangan Psikologis)',
        body: 'Urutkan semua daftar utang Anda dari saldo nominal terkecil hingga terbesar, tanpa mempedulikan tingkat suku bunganya. Bayar jumlah minimum untuk semua utang, lalu kerahkan seluruh sisa uang ekstra untuk melunasi utang terkecil terlebih dahulu.',
        bulletPoints: [
          'Kelebihan: Memberikan kepuasan instan dan motivasi cepat karena jumlah daftar utang berkurang dalam waktu singkat.',
          'Sangat cocok bagi pemula yang membutuhkan dorongan semangat psikologis untuk konsisten.'
        ]
      },
      {
        heading: '2. Metode Debt Avalanche (Efisiensi Matematis)',
        body: 'Urutkan semua utang dari suku bunga tertinggi hingga terendah (misalnya bunga pinjaman online 24% p.a., disusul kartu kredit 21% p.a., lalu cicilan motor 10% p.a.). Lunasi yang bunganya paling mencekik terlebih dahulu.',
        bulletPoints: [
          'Kelebihan: Menghemat total pembayaran bunga terbanyak secara matematis.',
          'Memerlukan kedisiplinan dan ketahanan mental tinggi karena utang nominal besar membutuhkan waktu lebih lama untuk lunas.'
        ]
      },
      {
        heading: '3. Aturan Emas: Hentikan Menambah Utang Konsumtif Baru',
        body: 'Saat sedang dalam proses pelunasan, kunci atau hapus aplikasi paylater dari ponsel Anda. Jangan pernah meminjam uang baru untuk membayar cicilan lama (gali lubang tutup lubang).'
      }
    ]
  },
  {
    id: 'art-6',
    title: 'Panduan Investasi Pemula: Reksa Dana & Emas Digital',
    summary: 'Cara aman mulai menumbuhkan uang Anda mulai dari Rp 10.000 tanpa takut tertipu investasi bodong.',
    readTime: '6 menit baca',
    author: 'Andini Putri, ChFC',
    category: 'Investasi & Inflasi',
    level: 'Pemula',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Selalu Cek Legalitas 2L: Legal & Logis',
        body: 'Sebelum mentransfer uang ke platform investasi mana pun, pastikan platform tersebut terdaftar dan diawasi resmi oleh Otoritas Jasa Keuangan (OJK) atau Bappebti. Waspadai tawaran "keuntungan pasti 10% per bulan tanpa risiko" karena sudah pasti merupakan skema Ponzi/bodong.',
        bulletPoints: [
          'Legal: Memiliki izin resmi izin Agen Penjual Reksa Dana (APERD) dari OJK.',
          'Logis: Tingkat pengembalian sejalan dengan risiko (High Risk, High Return; Low Risk, Low Return).'
        ]
      },
      {
        heading: '2. Memilih Jenis Reksa Dana Sesuai Tujuan',
        body: 'Reksa dana adalah wadah yang dikelola oleh Manajer Investasi profesional untuk menghimpun dana masyarakat ke dalam portofolio efek:',
        bulletPoints: [
          'Reksa Dana Pasar Uang: Sangat stabil, risiko sangat rendah, cocok untuk tujuan < 1 tahun.',
          'Reksa Dana Pendapatan Tetap: Mayoritas di obligasi pemerintah, cocok untuk tujuan 1 - 3 tahun.',
          'Reksa Dana Saham: Potensi return tinggi namun fluktuatif, cocok untuk tujuan > 5 tahun (misal: dana pensiun, dana kuliah anak).'
        ]
      },
      {
        heading: '3. Strategi Dollar Cost Averaging (DCA)',
        body: 'Jangan mencoba menebak kapan pasar sedang di titik terendah (market timing). Lakukan metode DCA: beli secara rutin dengan nominal tetap setiap tanggal gajian, tidak peduli harga sedang naik atau turun. Dalam jangka panjang, ini memberikan harga beli rata-rata yang optimal.'
      }
    ]
  },
  {
    id: 'art-7',
    title: 'Mindful Spending: Menjinakkan FOMO dan Belanja Impulsif',
    summary: 'Kiat praktis mengendalikan godaan diskon e-commerce, paylater, dan tren media sosial agar dompet Anda tetap sehat lahir dan batin.',
    readTime: '5 menit baca',
    author: 'Budi Darmawan, RFC',
    category: 'Psikologi Uang',
    level: 'Pemula',
    heroImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Aturan Menunggu 72 Jam (The 72-Hour Rule)',
        body: 'Ketika melihat barang non-pokok yang ingin dibeli saat scrolling e-commerce, masukkan ke dalam keranjang atau wishlist terlebih dahulu. Tunggu selama 3 hari (72 jam). Jika setelah 3 hari rasa keinginan tersebut mereda, batalkan pembelian.',
        bulletPoints: [
          '90% keinginan belanja online didorong oleh lonjakan emosi sesaat.',
          'Memberi jeda waktu memulihkan fungsi otak logis kita untuk menimbang kegunaan nyata barang tersebut.'
        ]
      },
      {
        heading: '2. Hitung Harga Barang dengan Jam Kerja Anda',
        body: 'Ubah harga barang menjadi jam kerja nyata. Jika penghasilan bersih per jam Anda adalah Rp 50.000, dan Anda ingin membeli sepatu baru seharga Rp 1.500.000, tanyakan: "Apakah sepatu ini layak ditukar dengan 30 jam keringat dan tenaga kerja saya?"',
        quote: '"Saat Anda membeli sesuatu, Anda tidak membayarnya dengan uang semata, melainkan dengan potongan waktu hidup yang Anda habiskan untuk menghasilkan uang tersebut."'
      }
    ]
  },
  {
    id: 'art-8',
    title: 'Checklist Evaluasi Kesehatan Finansial Akhir Bulan',
    summary: 'Lembar evaluasi praktis 5 menit untuk mengukur kesehatan keuangan pribadi Anda sebelum memasuki bulan yang baru.',
    readTime: '4 menit baca',
    author: 'Tim Ahli KelolaYuk',
    category: 'Perencanaan & Budgeting',
    level: 'Semua Tingkat',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '5 Indikator Finansial Sehat',
        body: 'Periksa daftar berikut pada setiap akhir bulan untuk memastikan Anda berada di jalur yang benar:',
        bulletPoints: [
          'Rasio Tabungan > 15%: Minimal 15% dari total gaji bulan ini berhasil masuk ke pos tabungan/investasi.',
          'Rasio Cicilan Utang < 30%: Total cicilan utang bulanan Anda tidak melebihi 30% dari penghasilan.',
          'Arus Kas Bersih Positif: Total pemasukan lebih besar daripada total pengeluaran aktual.',
          'Semua Tagihan Rutin Lunas: Listrik, air, internet, dan asuransi terbayar tepat waktu tanpa denda keterlambatan.',
          'Tidak Menarik Saldo Dana Darurat untuk Keperluan Hiburan.'
        ]
      },
      {
        heading: 'Langkah Berikutnya',
        body: 'Jika seluruh checklist berwarna hijau, selamat! Pertahankan ritme ini. Jika masih ada yang merah, gunakan fitur Kalkulator dan Pengingat Tagihan di KelolaYuk untuk merapikan alokasi bulan depan.'
      }
    ]
  }
];
