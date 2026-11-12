/**
 * Data kurikulum statis: bab, materi, dan topik AI Tutor.
 * Tidak ada akses DOM maupun API di sini — murni data.
 */

export const IPS_CHAPTERS = [
  {
    id: 'bab-01',
    code: 'BAB 01',
    title: 'Ruang dan Wilayah',
    desc: 'Mengenali tempat tinggal dan lingkungan kita.',
    iconType: 'map',
    materials: [
      { id: 'mat-1-1', title: 'Mengenal Ruang dan Wilayah', duration: '± 10 menit', recommended: true },
      { id: 'mat-1-2', title: 'Peta dan Letak Wilayah', duration: '± 12 menit' },
      { id: 'mat-1-3', title: 'Letak dan Luas Indonesia', duration: '± 10 menit' },
      { id: 'mat-1-4', title: 'Kondisi Alam Indonesia', duration: '± 12 menit' },
      { id: 'mat-1-5', title: 'Potensi Sumber Daya Alam', duration: '± 10 menit' }
    ]
  },
  {
    id: 'bab-02',
    code: 'BAB 02',
    title: 'Interaksi Antarruang',
    desc: 'Menelusuri hubungan antara satu tempat dan lainnya.',
    iconType: 'nodes',
    materials: [
      { id: 'mat-2-1', title: 'Mengenal Interaksi Antarruang', duration: '± 12 menit' },
      { id: 'mat-2-2', title: 'Faktor Pendorong Interaksi Antarruang', duration: '± 10 menit' },
      { id: 'mat-2-3', title: 'Interaksi Antarruang', duration: '± 12 menit' },
      { id: 'mat-2-4', title: 'Mobilitas Penduduk', duration: '± 10 menit' },
      { id: 'mat-2-5', title: 'Dampak Interaksi Antarruang', duration: '± 12 menit' }
    ]
  },
  {
    id: 'bab-03',
    code: 'BAB 03',
    title: 'Kehidupan Sosial dan Budaya',
    desc: 'Memahami cara manusia hidup bersama.',
    iconType: 'users',
    materials: [
      { id: 'mat-3-1', title: 'Manusia sebagai Makhluk Sosial', duration: '± 10 menit' },
      { id: 'mat-3-2', title: 'Bentuk Interaksi Sosial', duration: '± 12 menit' },
      { id: 'mat-3-3', title: 'Nilai dan Norma dalam Masyarakat', duration: '± 10 menit' },
      { id: 'mat-3-4', title: 'Lembaga Sosial di Sekitar Kita', duration: '± 12 menit' },
      { id: 'mat-3-5', title: 'Keragaman Budaya Indonesia', duration: '± 10 menit' }
    ]
  },
  {
    id: 'bab-04',
    code: 'BAB 04',
    title: 'Kegiatan Ekonomi',
    desc: 'Mengenali kebutuhan dan kegiatan ekonomi sehari-hari.',
    iconType: 'store',
    materials: [
      { id: 'mat-4-1', title: 'Kebutuhan dan Kelangkaan', duration: '± 10 menit' },
      { id: 'mat-4-2', title: 'Menyusun Skala Prioritas', duration: '± 10 menit' },
      { id: 'mat-4-3', title: 'Produksi, Distribusi, dan Konsumsi', duration: '± 12 menit' },
      { id: 'mat-4-4', title: 'Peran Pelaku Ekonomi', duration: '± 12 menit' },
      { id: 'mat-4-5', title: 'Pasar dan Kegiatan Jual Beli', duration: '± 10 menit' }
    ]
  }
];

export const SUBJECT_CHAPTERS = {
  'IPS': IPS_CHAPTERS,
  'IPA': [
    {
      id: 'bab-ipa-01',
      code: 'BAB 01',
      title: 'Besaran dan Pengukuran',
      desc: 'Mengenal besaran pokok, besaran turunan, dan alat ukur sains.',
      iconType: 'map',
      materials: [
        { id: 'mat-ipa-1-1', title: 'Mengenal Besaran Pokok & Satuan', duration: '± 10 menit', recommended: true },
        { id: 'mat-ipa-1-2', title: 'Alat Ukur Panjang, Massa, dan Waktu', duration: '± 12 menit' },
        { id: 'mat-ipa-1-3', title: 'Konversi Satuan Baku dalam Sains', duration: '± 10 menit' }
      ]
    },
    {
      id: 'bab-ipa-02',
      code: 'BAB 02',
      title: 'Gerak, Gaya, dan Energi',
      desc: 'Memahami bagaimana benda bergerak dan pengaruh gaya di alam.',
      iconType: 'nodes',
      materials: [
        { id: 'mat-ipa-2-1', title: 'Gerak Lurus Beraturan (GLB)', duration: '± 12 menit' },
        { id: 'mat-ipa-2-2', title: 'Hukum Newton tentang Gerak', duration: '± 15 menit' },
        { id: 'mat-ipa-2-3', title: 'Bentuk-Bentuk Energi di Sekitar Kita', duration: '± 10 menit' }
      ]
    },
    {
      id: 'bab-ipa-03',
      code: 'BAB 03',
      title: 'Tata Surya dan Bumi',
      desc: 'Menjelajahi planet-planet, rotasi, revolusi, dan struktur lapisan bumi.',
      iconType: 'users',
      materials: [
        { id: 'mat-ipa-3-1', title: 'Karakteristik Planet Tata Surya', duration: '± 10 menit' },
        { id: 'mat-ipa-3-2', title: 'Gerak Bumi dan Dampaknya', duration: '± 12 menit' }
      ]
    }
  ],
  'Bahasa Indonesia': [
    {
      id: 'bab-bind-01',
      code: 'BAB 01',
      title: 'Teks Deskripsi',
      desc: 'Belajar menggambarkan objek, tempat, dan suasana secara hidup dan rinci.',
      iconType: 'map',
      materials: [
        { id: 'mat-bind-1-1', title: 'Ciri dan Struktur Teks Deskripsi', duration: '± 10 menit', recommended: true },
        { id: 'mat-bind-1-2', title: 'Kaidah Kebahasaan Teks Deskripsi', duration: '± 12 menit' }
      ]
    },
    {
      id: 'bab-bind-02',
      code: 'BAB 02',
      title: 'Cerita Fantasi & Narasi',
      desc: 'Mengembangkan daya imajinasi melalui tokoh dan alur cerita petualangan.',
      iconType: 'nodes',
      materials: [
        { id: 'mat-bind-2-1', title: 'Unsur Intrinsik Cerita Fantasi', duration: '± 12 menit' },
        { id: 'mat-bind-2-2', title: 'Menulis Latar dan Watak Tokoh', duration: '± 15 menit' }
      ]
    }
  ],
  'PPKN': [
    {
      id: 'bab-ppkn-01',
      code: 'BAB 01',
      title: 'Nilai-Nilai Luhur Pancasila',
      desc: 'Memahami perumusan dan penerapan sila-sila Pancasila dalam kehidupan sehari-hari.',
      iconType: 'users',
      materials: [
        { id: 'mat-ppkn-1-1', title: 'Sejarah Perumusan Pancasila', duration: '± 10 menit', recommended: true },
        { id: 'mat-ppkn-1-2', title: 'Pengamalan Sila dalam Keseharian', duration: '± 12 menit' }
      ]
    },
    {
      id: 'bab-ppkn-02',
      code: 'BAB 02',
      title: 'Norma dan Keadilan',
      desc: 'Memahami aturan hidup bermasyarakat serta pentingnya menegakkan keadilan.',
      iconType: 'map',
      materials: [
        { id: 'mat-ppkn-2-1', title: 'Macam-Macam Norma di Masyarakat', duration: '± 10 menit' },
        { id: 'mat-ppkn-2-2', title: 'Arti Penting Ketaatan terhadap Hukum', duration: '± 12 menit' }
      ]
    }
  ]
};

export const AI_TUTOR_TOPICS = {
  'IPS': {
    id: 'IPS',
    mapel: 'IPS',
    sub: 'Ruang dan Wilayah',
    icon: '🌍',
    topicHeader: 'IPS • Ruang dan Wilayah → Mengenal Ruang dan Wilayah',
    greetingTitle: 'Siap menjelajah ruang dan wilayah?',
    greetingBody: 'Aku akan membantumu memahami konsep IPS selangkah demi langkah. Apa yang ingin kamu ketahui tentang Mengenal Ruang dan Wilayah?',
    starters: [
      {
        type: 'materi',
        title: 'Jelaskan materi',
        prompt: 'Apa itu ruang dan wilayah dalam konteks IPS? Jelaskan konsepnya!',
        replySteps: [
          '1. Bayangkan tempat kamu berada sekarang (misalnya rumah atau sekolah). Tempat makhluk hidup tinggal dan beraktivitas itulah yang disebut Ruang.',
          '2. Sekarang perhatikan beberapa tempat yang punya ciri khas serupa, seperti deretan sawah tempat petani menanam padi. Bagian ruang dengan kesamaan ciri itu disebut Wilayah.',
          '3. Menurutmu, apakah sekolahmu termasuk contoh ruang atau wilayah jika dilihat dari tempat kegiatan belajarnya?'
        ]
      },
      {
        type: 'petunjuk',
        title: 'Beri petunjuk soal',
        prompt: 'Aku bingung membedakan ruang dan wilayah. Bantu aku memahaminya bertahap.',
        replySteps: [
          '1. Fokus pada kata kuncinya: Ruang menekankan pada "tempat kegiatan berlangsung" (seperti ruang kelas untuk belajar, jalan untuk berpindah).',
          '2. Wilayah menekankan pada "kesamaan ciri kawasan" (seperti kawasan pertanian atau kawasan permukiman).',
          '3. Jika kamu melihat hamparan kebun teh di pegunungan, ciri apa yang menyatukan kawasan tersebut?'
        ]
      },
      {
        type: 'latihan',
        title: 'Sarankan latihan',
        prompt: 'Sarankan latihan soal tentang Mengenal Ruang dan Wilayah untuk pemula. Mulai dari mana?',
        replySteps: [
          '1. Mulai dari pengamatan sederhana: sebutkan 2 contoh ruang kegiatan di sekitar rumahmu!',
          '2. Lanjutkan dengan mengelompokkan: apakah lingkungan rumahmu termasuk wilayah permukiman, pertanian, atau perdagangan?',
          '3. Setelah memahami materi dan contohnya, kamu bisa langsung membuka Kuis untuk menguji pemahamanmu!'
        ]
      }
    ]
  },
  'Bahasa Indonesia': {
    id: 'Bahasa Indonesia',
    mapel: 'Bahasa Indonesia',
    sub: 'Teks Deskripsi',
    icon: '📖',
    topicHeader: 'Bahasa Indonesia • Teks Deskripsi → Mengenal Teks Deskripsi',
    greetingTitle: 'Siap merangkai kata lewat teks deskripsi?',
    greetingBody: 'Aku akan membantumu memahami cara menggambarkan objek dan suasana secara hidup selangkah demi langkah.',
    starters: [
      {
        type: 'materi',
        title: 'Jelaskan materi',
        prompt: 'Apa tujuan utama teks deskripsi dan bagaimana ciri-cirinya?',
        replySteps: [
          '1. Teks deskripsi bertujuan menggambarkan suatu objek, tempat, atau suasana seolah-olah pembaca ikut melihat dan merasakannya langsung.',
          '2. Ciri utamanya menggunakan kata-kata pancaindra (penglihatan, pendengaran, perabaan).',
          '3. Coba sebutkan 3 kata sifat yang menggambarkan suasana sekolahmu di pagi hari!'
        ]
      },
      {
        type: 'petunjuk',
        title: 'Beri petunjuk soal',
        prompt: 'Bagaimana cara membedakan kalimat deskripsi dengan kalimat biasa?',
        replySteps: [
          '1. Perhatikan apakah kalimat tersebut memerinci warna, bentuk, suara, atau ukuran objek.',
          '2. Bandingkan: "Itu adalah pantai" vs "Pantai itu berpasir putih lembut dengan deburan ombak tenang".',
          '3. Kalimat mana yang membuatmu bisa membayangkan wujud pantainya?'
        ]
      },
      {
        type: 'latihan',
        title: 'Sarankan latihan',
        prompt: 'Sarankan latihan menulis paragraf deskripsi singkat untuk pemula.',
        replySteps: [
          '1. Pilih satu benda terdekat di mejamu (misalnya tas atau buku catatan).',
          '2. Tuliskan warna, tekstur permukaan, dan ciri khas benda tersebut dalam 3 kalimat.',
          '3. Kirimkan kalimatmu di kolom bawah agar kita bahas bersama!'
        ]
      }
    ]
  },
  'IPA': {
    id: 'IPA',
    mapel: 'IPA',
    sub: 'Ciri Makhluk Hidup',
    icon: '🧪',
    topicHeader: 'IPA • Makhluk Hidup → Ciri Makhluk Hidup',
    greetingTitle: 'Siap mengamati ciri makhluk hidup di sekitarmu?',
    greetingBody: 'Aku akan membantumu mengenali apa yang membedakan makhluk hidup dengan benda tak hidup secara bertahap.',
    starters: [
      {
        type: 'materi',
        title: 'Jelaskan materi',
        prompt: 'Apa saja ciri-ciri utama makhluk hidup dalam IPA?',
        replySteps: [
          '1. Makhluk hidup memiliki ciri bernapas, memerlukan nutrisi, bergerak, tumbuh, berkembang biak, dan peka terhadap rangsang (iritabilitas).',
          '2. Meskipun tumbuhan terlihat diam, tumbuhan tetap tumbuh dan bergerak mengikuti arah cahaya matahari.',
          '3. Menurutmu, mengapa robot yang bisa berjalan tidak dikelompokkan sebagai makhluk hidup?'
        ]
      },
      {
        type: 'petunjuk',
        title: 'Beri petunjuk soal',
        prompt: 'Aku bingung membedakan tumbuh dan berkembang pada makhluk hidup.',
        replySteps: [
          '1. Tumbuh adalah pertambahan ukuran (tinggi, berat, volume) yang dapat diukur dengan angka.',
          '2. Berkembang adalah proses menuju kedewasaan fungsi organ yang tidak diukur dengan angka.',
          '3. Jika kecambah bertambah tinggi dari 2 cm menjadi 8 cm, apakah itu contoh tumbuh atau berkembang?'
        ]
      },
      {
        type: 'latihan',
        title: 'Sarankan latihan',
        prompt: 'Sarankan latihan pengamatan ciri makhluk hidup di lingkungan rumah.',
        replySteps: [
          '1. Amati satu tanaman (seperti putri malu atau tanaman pot) dan satu hewan peliharaan.',
          '2. Catat bagaimana keduanya merespons sentuhan atau cahaya.',
          '3. Ciri makhluk hidup apa yang sedang kamu buktikan dari pengamatan itu?'
        ]
      }
    ]
  },
  'PPKN': {
    id: 'PPKN',
    mapel: 'PPKN',
    sub: 'Nilai Pancasila',
    icon: '💬',
    topicHeader: 'PPKN • Pancasila → Nilai-Nilai Pancasila',
    greetingTitle: 'Siap memahami penerapan nilai-nilai Pancasila?',
    greetingBody: 'Aku akan membantumu menghubungkan sila-sila Pancasila dengan sikap sehari-hari di rumah dan sekolah.',
    starters: [
      {
        type: 'materi',
        title: 'Jelaskan materi',
        prompt: 'Bagaimana cara menerapkan nilai Pancasila dalam kehidupan di sekolah?',
        replySteps: [
          '1. Setiap sila memiliki nilai inti: Ketuhanan, Kemanusiaan, Persatuan, Musyawarah, dan Keadilan Sosial.',
          '2. Contoh di sekolah: menghargai pendapat teman saat diskusi kelas merupakan penerapan sila ke-4.',
          '3. Kalau bekerja bakti membersihkan kelas bersama-sama tanpa membeda-bedakan teman, sila ke berapa yang paling berkaitan?'
        ]
      },
      {
        type: 'petunjuk',
        title: 'Beri petunjuk soal',
        prompt: 'Bagaimana membedakan contoh pengamalan sila ke-2 dan sila ke-5?',
        replySteps: [
          '1. Sila ke-2 menekankan penghormatan harkat martabat manusia, empati, dan tenggang rasa kepada sesama.',
          '2. Sila ke-5 menekankan keseimbangan hak dan kewajiban, keadilan, serta menghargai hasil karya orang lain.',
          '3. Coba perhatikan fokus tindakan pada soal: apakah membantu korban bencana (kemanusiaan) atau membagi tugas piket secara adil (keadilan sosial)?'
        ]
      },
      {
        type: 'latihan',
        title: 'Sarankan latihan',
        prompt: 'Sarankan latihan mengenali nilai Pancasila dari kejadian sehari-hari.',
        replySteps: [
          '1. Pilih 3 kegiatan yang kamu lakukan hari ini di rumah atau sekolah.',
          '2. Cocokkan masing-masing kegiatan tersebut dengan sila ke-1 sampai sila ke-5.',
          '3. Ceritakan satu kegiatanmu di sini, yuk kita bahas sila mana yang paling tepat!'
        ]
      }
    ]
  }
};
