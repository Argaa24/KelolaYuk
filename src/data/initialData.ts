import { Transaction, SavingsGoal, Bill, BudgetItem, Article, UserProfile } from '../types';

export const initialProfile: UserProfile = {
  name: 'Budi Santoso',
  title: 'Perintis Keuangan',
  email: 'budi.santoso@kelolayuk.id',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Budi',
  level: 'Tingkat 3 - Sadar Finansial',
  isLoggedIn: true
};

export const initialTransactions: Transaction[] = [];

export const initialGoals: SavingsGoal[] = [];

export const initialBills: Bill[] = [];

export const initialBudgetItems: BudgetItem[] = [];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Seni Mengatur Arus Kas Tanpa Rasa Cemas',
    summary: 'Pelajari teknik cashflow mindful untuk mengelola pengeluaran bulanan dan usaha. Cara membuat setiap rupiah memiliki tujuan yang jelas tanpa membuat Anda merasa tersiksa atau terkekang.',
    readTime: '10 menit baca',
    author: 'Rina Wijaya, CFP',
    category: 'Dasar Keuangan',
    level: 'Pemula',
    isFeatured: true,
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Mengalirkan Dana Seperti Air: Prinsip Cashflow Mindful',
        body: 'Arus kas yang sehat bukan tentang menahan semua pengeluaran sampai hidup terasa kaku atau usaha Anda kekurangan modal operasional. Seperti aliran air yang lancar, dana Anda perlu memiliki wadah penampung (pos rekening) yang jelas agar tidak bocor tanpa disadari dan tidak bercampur aduk antara uang pribadi dengan uang operasional usaha.',
        bulletPoints: [
          'Pisahkan secara ketat rekening penerimaan gaji/omzet usaha dengan rekening belanja kebutuhan hidup harian.',
          'Alokasikan otomatis dana tabungan dan modal cadangan di hari pertama saat pemasukan masuk, bukan mengandalkan sisa uang di akhir bulan.',
          'Beri ruang jatah "bebas bersalah" (guilt-free spending) sebesar 10-15% untuk rekreasi dan menjaga kesehatan mental agar Anda tidak burnout.'
        ]
      },
      {
        heading: '2. Membangun Kebiasaan Jeda 3 Detik Sebelum Setiap Transaksi',
        body: 'Di era transaksi serba digital dengan kemudahan QRIS, kartu nirsentuh, dan paylater, rasa sakit saat mengeluarkan uang (the pain of paying) berkurang drastis. Akibatnya, kita sering berbelanja tanpa sadar. Setiap kali akan membuka dompet digital atau menempelkan kartu pembayaran, ambil napas dalam selama 3 detik dan tanyakan pada diri Anda: "Apakah pembelian ini benar-benar esensial, mendukung perkembangan jangka panjang, atau sekadar lonjakan dopamin sesaat?"',
        quote: '"Kekayaan dan kebebasan finansial sejati bukanlah tentang seberapa banyak barang mahal yang Anda beli untuk membuat orang lain terkesan, melainkan ketenangan batin saat saldo Anda cukup kuat untuk menghadapi masa depan dan memperluas peluang usaha."'
      },
      {
        heading: '3. Memisahkan Kas Pribadi dan Kas Bisnis/Usaha Sejak Hari Pertama',
        body: 'Salah satu penyebab utama kegagalan finansial pelaku usaha pemula adalah mencampur uang dagangan dengan uang dapur. Ketika kas bercampur, Anda akan merasa memiliki banyak uang, padahal sebagian besar uang tersebut adalah modal putar atau kewajiban membayar pemasok (supplier).',
        bulletPoints: [
          'Tetapkan "Gaji Tetap" untuk diri Anda sendiri dari bisnis, bukan mengambil laba semau-maunya.',
          'Buat rekening khusus operasional yang hanya digunakan untuk membeli stok, membayar ongkos kirim, dan biaya produksi.',
          'Cadangkan 10% dari keuntungan bersih usaha ke rekening "Dana Tahan Banting Usaha" untuk mengantisipasi penurunan omzet sewaktu-waktu.'
        ]
      },
      {
        heading: '4. Evaluasi Rutin Mingguan: The Weekly Money Date',
        body: 'Luangkan waktu 10 hingga 15 menit setiap akhir pekan (misalnya Minggu sore atau malam) untuk duduk tenang dan meninjau seluruh catatan transaksi di KelolaYuk. Analisis ke mana saja uang Anda mengalir selama 7 hari terakhir, cek kategori mana yang membengkak, dan sesuaikan strategi untuk pekan berikutnya.',
        bulletPoints: [
          'Cek apakah ada biaya langganan aplikasi atau layanan digital otomatis yang tidak lagi Anda gunakan secara aktif.',
          'Bandingkan realisasi pengeluaran dengan batasan target anggaran bulanan Anda.',
          'Berikan apresiasi pada diri sendiri ketika berhasil menahan diri dari godaan diskon impulsif.'
        ]
      }
    ]
  },
  {
    id: 'art-2',
    title: 'Metode Budgeting 50/30/20: Kebutuhan Pokok, Gaya Hidup & Investasi',
    summary: 'Kunci dari stabilitas finansial bukanlah seberapa besar penghasilan Anda semata, melainkan bagaimana Anda membagi pos alokasi dana secara proporsional, terukur, dan disiplin.',
    readTime: '9 menit baca',
    author: 'Budi Darmawan, RFC',
    category: 'Perencanaan & Budgeting',
    level: 'Pemula',
    isPopular: true,
    heroImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Porsi 50%: Kebutuhan Pokok & Kewajiban Mutlak (Needs)',
        body: 'Alokasikan maksimal 50% dari pendapatan bersih bulanan untuk pengeluaran yang mutlak diperlukan untuk bertahan hidup, bekerja, dan menjaga kewajiban hukum. Jika Anda tidak membayar pos ini, kelangsungan hidup atau pekerjaan Anda akan langsung terancam.',
        bulletPoints: [
          'Termasuk di dalamnya: Sewa tempat tinggal / cicilan KPR, tagihan listrik, air, internet kerja, belanja bahan makanan bergizi, transportasi harian, dan premi asuransi kesehatan dasar.',
          'Jika porsi kebutuhan Anda saat ini melebihi 50%, fokuslah pada efisiensi belanja dapur (meal prep) atau cari solusi transportasi yang lebih hemat.',
          'Peringatan penting: Jangan pernah memasukkan cicilan barang konsumtif seperti ponsel baru atau pakaian bermerek ke dalam pos kebutuhan pokok.'
        ]
      },
      {
        heading: '2. Porsi 30%: Keinginan, Hobi & Gaya Hidup (Wants)',
        body: 'Banyak orang gagal mengelola anggaran karena memangkas seluruh pengeluaran hiburan sampai merasa tertekan. Metode 50/30/20 justru memberikan lampu hijau sebesar 30% untuk menikmati hasil kerja keras Anda secara bertanggung jawab.',
        quote: '"Budgeting bukanlah penjara yang melarang Anda bersenang-senang, melainkan peta navigasi resmi dari Anda sendiri untuk menikmati hidup sesuai batas kemampuan tanpa rasa bersalah."'
      },
      {
        heading: '3. Porsi 20%: Tabungan, Pelunasan Utang & Investasi Masa Depan',
        body: 'Porsi 20% ini adalah fondasi kekayaan jangka panjang Anda. Begitu gaji atau penghasilan usaha masuk, langsung amankan 20% ini ke rekening terpisah sebelum Anda mulai membelanjakan pos lainnya.',
        bulletPoints: [
          'Prioritas 1: Bangun Dana Darurat likuid hingga mencapai minimal 3-6 kali pengeluaran rutin bulanan.',
          'Prioritas 2: Lunasi utang konsumtif berbunga tinggi (kartu kredit, paylater, pinjaman online).',
          'Prioritas 3: Investasikan ke instrumen pasar modal (Reksa Dana, Surat Berharga Negara/SBN, atau Emas) untuk mengalahkan inflasi.'
        ]
      },
      {
        heading: '4. Cara Menyesuaikan Proporsi Jika Penghasilan Masih Terbatas',
        body: 'Jika saat ini biaya hidup Anda memakan 70% dari pemasukan, jangan berkecil hati. Anda dapat memulai dengan formula alternatif yang disesuaikan secara bertahap, seperti formula 70/20/10 (70% Kebutuhan, 20% Keinginan, 10% Tabungan). Yang terpenting adalah membentuk kebiasaan menabung secara konsisten setiap bulan.'
      }
    ]
  },
  {
    id: 'art-3',
    title: 'Panduan Membangun Dana Darurat 3–6 Bulan Tanpa Beban Mental',
    summary: 'Langkah taktis dan realistis membangun jaring pengaman finansial pertama Anda agar tidak panik saat terjadi hal tak terduga seperti sakit, perbaikan kendaraan, atau penurunan omzet.',
    readTime: '11 menit baca',
    author: 'Aulia Rahma, CFP',
    category: 'Dasar Keuangan',
    level: 'Menengah',
    heroImage: 'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Mengapa Dana Darurat Adalah Pondasi Pertama Sebelum Investasi?',
        body: 'Banyak orang terburu-buru terjun membeli saham atau kripto tanpa memiliki dana darurat sepeser pun. Ketika terjadi musibah mendadak—seperti kendaraan rusak, anggota keluarga sakit, atau kehilangan pekerjaan—mereka terpaksa menjual aset investasi mereka dalam kondisi rugi (cut loss) atau terjebak dalam lingkaran pinjaman online berbunga tinggi. Dana darurat adalah rem darurat yang melindungi masa depan finansial Anda.'
      },
      {
        heading: '2. Menghitung Target Nominal Dana Darurat yang Tepat',
        body: 'Besaran ideal dana darurat bergantung pada status tanggung jawab keluarga dan kestabilan arus pendapatan Anda:',
        bulletPoints: [
          'Lajang / Belum Menikah: Minimal 3 kali total pengeluaran rutin bulanan.',
          'Menikah tanpa tanggungan anak: Minimal 6 kali total pengeluaran rutin bulanan.',
          'Menikah dengan anak (1-2 tanggungan): Minimal 9 kali total pengeluaran rutin bulanan.',
          'Pelaku Usaha Mandiri / Pekerja Lepas (Freelancer) dengan pemasukan fluktuatif: 12 kali pengeluaran bulanan.'
        ]
      },
      {
        heading: '3. Di Mana Dana Darurat Sebaiknya Disimpan?',
        body: 'Kriteria utama penyimpanan dana darurat adalah 3L: Likuid (dapat dicairkan dalam 1x24 jam), Low-Risk (pokok modal aman tidak fluktuatif), dan Luar Jangkauan (terpisah dari rekening belanja harian agar tidak terpakai tanpa sadar).',
        bulletPoints: [
          '50% di Tabungan Bank Digital Khusus (bebas biaya admin bulanan dan bunga harian kompetitif).',
          '30% di Reksa Dana Pasar Uang (RDPU) yang pencairannya cepat tanpa potongan denda atau penalti penarikan.',
          '20% dalam bentuk Logam Mulia (Emas Batangan) atau uang tunai cadangan di rumah untuk kondisi listrik/jaringan padam.'
        ]
      },
      {
        heading: '4. Aturan Penggunaan: Kriteria 3T',
        body: 'Gunakan dana ini HANYA jika memenuhi kriteria 3T: Tak Terduga (kejadian yang tidak direncanakan), Terdesak (harus diselesaikan secepatnya karena menyangkut keselamatan/kesehatan), dan Tidak Bisa Ditunda. Tiket konser, diskon midnight sale, atau ganti casing HP bukanlah kondisi darurat!'
      }
    ]
  },
  {
    id: 'art-4',
    title: 'Pondasi Inflasi 101: Menyelamatkan Daya Beli Uang Anda dari Erosi',
    summary: 'Pahami musuh tersembunyi tabungan konvensional Anda dan bagaimana strategi praktis menempatkan modal agar nilai uang Anda bertumbuh mengalahkan laju kenaikan harga barang.',
    readTime: '9 menit baca',
    author: 'Fajar Nugroho, CFA',
    category: 'Investasi & Inflasi',
    level: 'Menengah',
    isPopular: true,
    heroImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Apa Itu Inflasi dan Mengapa Kita Tidak Boleh Mengabaikannya?',
        body: 'Inflasi adalah penurunan daya beli mata uang yang tercermin dalam kenaikan harga barang dan jasa secara terus-menerus. Sebagai ilustrasi nyata: uang Rp 100.000 pada tahun 2005 dapat digunakan untuk mengisi penuh troli belanja sembako keluarga selama dua minggu. Saat ini di tahun 2026, uang Rp 100.000 mungkin hanya cukup untuk membeli minyak goreng, beras 2 kg, dan sedikit telur.',
        bulletPoints: [
          'Rata-rata laju inflasi tahunan di Indonesia berkisar antara 2.5% hingga 4.5% per tahun.',
          'Bunga tabungan bank konvensional umumnya hanya 0.1% - 0.5% (belum dipotong pajak bunga 20% dan biaya admin bulanan Rp 15.000).',
          'Kesimpulan nyata: Menyimpan seluruh modal di rekening tabungan biasa secara matematis justru membuat nilai kekayaan Anda menyusut setiap tahun.'
        ]
      },
      {
        heading: '2. Prinsip Mengalahkan Inflasi dengan Aset Produktif',
        body: 'Satu-satunya cara agar modal dan tabungan Anda tidak tergerus waktu adalah dengan menempatkan sebagian dana pada instrumen aset produktif yang mampu menghasilkan imbal hasil (return) di atas rata-rata inflasi nasional.',
        quote: '"Inflasi adalah pajak tersembunyi bagi mereka yang hanya menimbun uang tunai di bawah bantal, tetapi menjadi mesin pelipatganda kekayaan bagi mereka yang menanamkannya pada aset produktif."'
      },
      {
        heading: '3. Piramida Alokasi Aset Mengalahkan Inflasi Sesuai Horison Waktu',
        body: 'Sesuaikan instrumen investasi Anda dengan jangka waktu rencana penggunaan uang tersebut:',
        bulletPoints: [
          'Jangka Pendek (< 1 Tahun): Reksa Dana Pasar Uang (Imbal hasil rata-rata 4.5% - 5.5% per tahun, bebas pajak).',
          'Jangka Menengah (1 - 5 Tahun): Obligasi Negara / Sukuk Ritel (SBN/ORI/SR) dan Emas Murni (Imbal hasil 6.0% - 7.0% per tahun).',
          'Jangka Panjang (> 5 Tahun): Reksa Dana Indeks Saham (IHSG / LQ45) dan Saham Bluechip (Potensi imbal hasil 10% - 14% per tahun secara historis).'
        ]
      }
    ]
  },
  {
    id: 'art-5',
    title: 'Strategi Bebas Utang: Panduan Lengkap Debt Snowball vs Debt Avalanche',
    summary: 'Dua metode teruji paling efektif di dunia untuk melunasi cicilan, kartu kredit, atau pinjaman online tanpa membuat kesehatan mental Anda terpuruk.',
    readTime: '12 menit baca',
    author: 'Rina Wijaya, CFP',
    category: 'Manajemen Utang',
    level: 'Lanjutan',
    heroImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Mengaudit Seluruh Daftar Utang Anda Secara Transparan',
        body: 'Langkah awal yang paling menantang namun paling krusial adalah menghadapi kenyataan. Buat lembar catatan yang merinci seluruh utang Anda: nama kreditur/aplikasi, total sisa pokok pinjaman, bunga per bulan/tahun, dan jumlah cicilan minimum yang harus dibayar setiap bulan.'
      },
      {
        heading: '2. Metode Debt Snowball: Kemenangan Cepat untuk Psikologis',
        body: 'Pada metode Snowball (bola salju), Anda mengurutkan semua daftar utang dari nominal saldo terkecil hingga terbesar, tanpa mempedulikan berapa persentase suku bunganya. Bayar cicilan minimum untuk semua utang, lalu kerahkan seluruh sisa uang ekstra Anda untuk melunasi utang terkecil hingga tuntas.',
        bulletPoints: [
          'Kelebihan Utama: Memberikan kemenangan psikologis yang cepat. Ketika satu daftar utang tercoret dalam 1-2 bulan, motivasi dan rasa percaya diri Anda akan melonjak drastis.',
          'Cocok Untuk: Siapa pun yang merasa kewalahan, stres, dan membutuhkan suntikan semangat instan untuk tetap konsisten.'
        ]
      },
      {
        heading: '3. Metode Debt Avalanche: Efisiensi Maksimal Matematis',
        body: 'Pada metode Avalanche (longsoran salju), Anda mengurutkan utang dari suku bunga persentase tertinggi ke suku bunga terendah (misalnya bunga pinjaman online 24% p.a., kartu kredit 21% p.a., cicilan motor 12% p.a., lalu KPR 8% p.a.). Anda memprioritaskan pelunasan utang dengan bunga paling mencekik terlebih dahulu.',
        bulletPoints: [
          'Kelebihan Utama: Menghemat total biaya bunga uang yang harus dibayarkan secara keseluruhan dalam jangka panjang.',
          'Kelemahan: Membutuhkan ketahanan mental baja karena utang berbunga tinggi mungkin memiliki nominal besar yang butuh waktu berbulan-bulan untuk lunas.'
        ]
      },
      {
        heading: '4. Aturan Emas Selama Masa Pelunasan: Kunci Akses Kredit Baru',
        body: 'Saat Anda sedang dalam proses pemulihan utang, segera hapus aplikasi paylater, bekukan batas kartu kredit, dan hindari skema gali lubang tutup lubang (meminjam di tempat baru untuk membayar cicilan lama).'
      }
    ]
  },
  {
    id: 'art-6',
    title: 'Panduan Investasi Pemula: Reksa Dana, Saham & Emas Digital',
    summary: 'Cara aman dan terstruktur mulai menumbuhkan aset kekayaan Anda dari nominal kecil (mulai Rp 10.000) tanpa takut terjebak investasi bodong atau skema penipuan.',
    readTime: '10 menit baca',
    author: 'Andini Putri, ChFC',
    category: 'Investasi & Inflasi',
    level: 'Pemula',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Prinsip 2L: Wajib Legal dan Logis',
        body: 'Sebelum menginvestasikan uang Anda ke platform mana pun, lakukan verifikasi mandiri menggunakan prinsip 2L dari OJK:',
        bulletPoints: [
          'Legalitas: Periksa apakah platform dan perusahaannya memiliki izin resmi dari Otoritas Jasa Keuangan (OJK), Bappebti, atau Bank Indonesia.',
          'Logis: Waspadai penawaran dengan janji "profit pasti 10% per minggu tanpa risiko". Di dunia investasi nyata, tingkat pengembalian selalu berbanding lurus dengan risiko (High Risk, High Return; Low Risk, Low Return).'
        ]
      },
      {
        heading: '2. Mengenal Tiga Jenis Aset Ramah Pemula',
        body: 'Bagi pemula yang baru mulai membangun portofolio, tiga instrumen ini adalah pilihan terbaik:',
        bulletPoints: [
          'Reksa Dana: Wadah investasi kolektif yang dikelola Manajer Investasi berpengalaman. Anda tidak perlu repot menganalisis laporan keuangan perusahaan setiap hari.',
          'Emas Digital / Logam Mulia: Lindung nilai (safe haven) terbaik terhadap gejolak geopolitik dan inflasi jangka panjang.',
          'Surat Berharga Negara (SBN Ritel): Obligasi yang dijamin 100% oleh Undang-Undang Republik Indonesia dengan kupon bunga yang ditransfer setiap bulan ke rekening Anda.'
        ]
      },
      {
        heading: '3. Rahasia Sukses: Disiplin Dollar Cost Averaging (DCA)',
        body: 'Daripada pusing menebak waktu terbaik membeli saat harga turun (timing the market), terapkan metode Dollar Cost Averaging. Sisihkan nominal tetap (misalnya Rp 500.000) secara otomatis setiap tanggal gajian untuk membeli aset pilihan Anda, tanpa memedulikan apakah grafik pasar sedang hijau atau merah. Dalam rentang 5-10 tahun, metode ini secara konsisten menghasilkan harga beli rata-rata yang optimal.'
      }
    ]
  },
  {
    id: 'art-7',
    title: 'Mindful Spending: Menjinakkan FOMO, Paylater & Belanja Impulsif',
    summary: 'Kiat psikologis praktis mengendalikan godaan promo e-commerce, tren media sosial, dan kemudahan cicilan agar dompet Anda tetap tebal dan pikiran tetap tenang.',
    readTime: '9 menit baca',
    author: 'Budi Darmawan, RFC',
    category: 'Psikologi Uang',
    level: 'Pemula',
    heroImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Memahami Jebakan Dopamin di Balik Notifikasi Flash Sale',
        body: 'Aplikasi e-commerce dan media sosial didesain secara ilmiah untuk memicu lonjakan hormon dopamin instan di otak kita melalui countdown timer diskon, badge "tersisa 2 barang", dan voucher terbatas. Kita sering kali membeli bukan karena membutuhkan barang tersebut, melainkan karena takut merasa tertinggal (FOMO).'
      },
      {
        heading: '2. Menerapkan Aturan Menunggu 72 Jam (The 72-Hour Rule)',
        body: 'Setiap kali Anda tertarik membeli barang non-pokok di toko online, jangan langsung tekan tombol checkout. Masukkan barang tersebut ke dalam keranjang atau wishlist, lalu tutup aplikasi selama 72 jam (3 hari).',
        bulletPoints: [
          'Lebih dari 85% keinginan belanja impulsif akan lenyap dengan sendirinya setelah emosi awal mereda.',
          'Jeda 3 hari memberi kesempatan bagi korteks prefrontal (otak logis) untuk menilai apakah barang tersebut benar-benar bernilai guna tinggi bagi kehidupan Anda.'
        ]
      },
      {
        heading: '3. Konversi Harga Barang Menjadi "Jam Kerja Nyata"',
        body: 'Ubah harga barang yang ingin Anda beli menjadi setara dengan jam kerja Anda. Jika penghasilan bersih Anda per jam adalah Rp 50.000, dan Anda ingin membeli sepatu baru seharga Rp 1.500.000, tanyakan pada diri sendiri: "Apakah sepatu ini sebanding dengan 30 jam kerja keras dan keringat saya?"',
        quote: '"Saat Anda membeli sesuatu, Anda sebenarnya tidak membayarnya dengan nominal rupiah semata, melainkan dengan potongan waktu hidup yang Anda habiskan untuk bekerja menghasilkan uang tersebut."'
      }
    ]
  },
  {
    id: 'art-8',
    title: 'Checklist Evaluasi Kesehatan Finansial Akhir Bulan & Neraca Usaha',
    summary: 'Lembar evaluasi praktis 10 menit untuk mendiagnosis kesehatan keuangan pribadi dan usaha sebelum melangkah ke bulan yang baru.',
    readTime: '8 menit baca',
    author: 'Tim Ahli KelolaYuk',
    category: 'Perencanaan & Budgeting',
    level: 'Semua Tingkat',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        heading: '1. Lima Indikator Kunci Kesehatan Finansial Bulanan',
        body: 'Sebelum menutup buku bulan ini, pastikan Anda memeriksa 5 indikator utama berikut:',
        bulletPoints: [
          'Indikator 1 (Savings Rate > 15%): Minimal 15% dari total pemasukan bulan ini berhasil diamankan ke pos tabungan/investasi.',
          'Indikator 2 (Debt-to-Income Ratio < 30%): Total seluruh cicilan utang bulanan tidak melebihi 30% dari total pemasukan kotor.',
          'Indikator 3 (Arus Kas Bersih Positif): Total pemasukan aktual lebih besar dibandingkan total pengeluaran aktual.',
          'Indikator 4 (Ketepatan Waktu Tagihan 100%): Seluruh tagihan listrik, sewa, internet, dan premi asuransi terbayar lunas tanpa denda keterlambatan.',
          'Indikator 5 (Integritas Dana Darurat): Saldo dana darurat tetap utuh dan tidak tersentuh untuk pos belanja hiburan.'
        ]
      },
      {
        heading: '2. Menyusun Rencana Aksi untuk Bulan Berikutnya',
        body: 'Gunakan fitur-fitur di KelolaYuk seperti Dasbor Arus Kas, Anggaran 50/30/20, dan Pengingat Tagihan untuk menyempurnakan strategi keuangan Anda di bulan mendatang.'
      }
    ]
  }
];
