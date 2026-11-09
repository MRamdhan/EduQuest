/**
 * EduQuest Main Application Controller
 * Mencakup:
 * 1. Mode Petualang Lama (Fira Putri — Level 8 • Gold, 2.920 XP) & Petualang Baru (Budi Santoso — Level 1 • Bronze, 0 XP)
 * 2. Beranda Petualang Lama, Quest Petualang Lama, Katalog Kuis Petualang Lama, dan Halaman Penuh "Profil Saya"
 * 3. Alur Lengkap Kuis 3 Nyawa (Nyawa IPS 3/3) sesuai 9 layar desain:
 *    - 01 Persiapan Kuis
 *    - 02 Soal 01 • Belum Dijawab (Nyawa 3/3)
 *    - 03 Soal 01 • Jawaban Dipilih (Nyawa 3/3)
 *    - 04 Soal 01 • Salah Pertama & Petunjuk AI Tutor (Nyawa 2/3)
 *    - 05 Soal 01 • Dua Percobaan Habis (Nyawa 1/3)
 *    - 06 Soal 02 • Jawaban Benar (+8 XP, Nyawa 1/3)
 *    - 07 Hasil Kuis Selesai • Cabang Utama (Skor 90/100, +72 XP, Nyawa 1/3)
 *    - 08 Pembahasan & Evaluasi AI Tutor (Tinjau soal 01—10)
 *    - 09 Nyawa Habis • Cabang Alternatif Setelah Soal 02 (Nyawa 0/3, Terhenti di soal 03)
 * 4. Halaman Belajar Materi 4 Tahap (01 Materi, 02 Contoh, 03 Latihan, 04 Selesai & Peta Konsep) + Halaman AI Tutor
 */

const KELAS_BY_JENJANG = {
  'SD': ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
  'SMP': ['Kelas 7', 'Kelas 8', 'Kelas 9'],
  'SMA/SMK': ['Kelas 10', 'Kelas 11', 'Kelas 12']
};

const JENJANG_LABEL = {
  'SD': 'SD/Madrasah',
  'SMP': 'SMP/MTs',
  'SMA/SMK': 'SMA/SMK'
};

const RANK_TIERS = [
  { key: 'rekrut', rank: 'Bronze', title: 'Rekrut', minXp: '0 — 99 XP', desc: 'Petualang pemula yang memulai langkah pertama. Kuis tingkat Dasar.' },
  { key: 'penjelajah', rank: 'Silver', title: 'Penjelajah', minXp: '100 — 299 XP', desc: 'Membuka tantangan tingkat kesulitan Sedang.' },
  { key: 'kesatria', rank: 'Gold', title: 'Kesatria', minXp: '300+ XP', desc: 'Menguasai berbagai bab dan membuka kuis tingkat Lanjut.' }
];

function getRankAssetKey(rank) {
  const r = (rank || '').toLowerCase();
  if (r.includes('silver') || r.includes('penjelajah')) return 'penjelajah';
  if (r.includes('gold') || r.includes('kesatria')) return 'kesatria';
  return 'rekrut';
}

const LANDING_JENJANG_DATA = [
  {
    kode: 'SD',
    judul: 'SD / Madrasah',
    rentang: 'Kelas 1 — 6',
    ikon: '🌱',
    deskripsi: 'Bangun fondasi berhitung, membaca, sains dasar, dan karakter melalui cerita interaktif.',
    mapel: ['Matematika Dasar', 'Bahasa Indonesia', 'IPAS', 'PPKn']
  },
  {
    kode: 'SMP',
    judul: 'SMP / MTs',
    rentang: 'Kelas 7 — 9',
    ikon: '🧭',
    deskripsi: 'Eksplorasi konsep ruang, ekosistem, aljabar, dan literasi kritis lewat tantangan bertahap.',
    mapel: ['IPS', 'IPA', 'Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'PPKn']
  },
  {
    kode: 'SMA/SMK',
    judul: 'SMA / SMK',
    rentang: 'Kelas 10 — 12',
    ikon: '🚀',
    deskripsi: 'Persiapan mendalam sains, sosial, dan penalaran analitis untuk ujian serta jenjang lanjut.',
    mapel: ['Matematika Lanjut', 'Fisika & Kimia', 'Biologi', 'Ekonomi & Geografi', 'Bahasa Inggris']
  }
];

const IPS_CHAPTERS = [
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

const AI_TUTOR_TOPICS = {
  'IPS': {
    id: 'IPS',
    mapel: 'IPS',
    sub: 'Ruang dan Wilayah',
    icon: '🌍',
    topicHeader: 'IPS • Ruang dan Wilayah → Mengenal Ruang dan Wilayah',
    greetingTitle: 'Siap menjelajah ruang dan wilayah?',
    greetingBody: 'Aku akan membantumu memahami konsep IPS selangkah demi selangkah. Apa yang ingin kamu ketahui tentang Mengenal Ruang dan Wilayah?',
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
    greetingBody: 'Aku akan membantumu memahami cara menggambarkan objek dan suasana secara hidup selangkah demi selangkah.',
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

// State aplikasi: mulai di landing page; dashboard tampil setelah login/registrasi
// atau saat sesi token yang masih berlaku dipulihkan ketika halaman di-refresh.
const appState = {
  isLoggedIn: false,
  isNewUser: false, // false = tampilan petualang lama, true = tampilan petualang baru
  activeTab: 'beranda', // 'beranda' | 'quest' | 'ai-tutor' | 'profil-saya'
  selectedRegJenjang: '',
  isRegistering: false,
  isLoggingIn: false,
  isProfileDropdownOpen: false,

  // State Kuis 3 Nyawa (9 Layar Desain Petualang Lama)
  inQuizSession: false,
  quizReturnTab: 'quest',
  quizScreenStep: 1,
  // 1: 01 Persiapan Kuis (Nyawa 3/3)
  // 2: 02 Soal 01 • Belum Dijawab (Nyawa 3/3)
  // 3: 03 Soal 01 • Jawaban Dipilih A (Nyawa 3/3)
  // 4: 04 Soal 01 • Salah Pertama & Petunjuk (Nyawa 2/3)
  // 5: 05 Soal 01 • Dua Percobaan Habis (Nyawa 1/3)
  // 6: 06 Soal 02 • Jawaban Benar (+8 XP, Nyawa 1/3)
  // 7: 07 Hasil Kuis Selesai • Cabang Utama (90/100, +72 XP, Nyawa 1/3)
  // 8: 08 Pembahasan & Evaluasi AI Tutor (Tinjau 01-10)
  // 9: 09 Nyawa Habis • Cabang Alternatif (Nyawa 0/3)
  quizQ1Selected: null, // 'A' | 'B' | 'C' | 'D'
  quizQ2Selected: 'B',
  quizReviewQuestionNum: 1,
  quizAiCustomPrompt: '',

  // State Halaman AI Tutor
  aiTutorSubject: 'IPS',
  aiTutorDraft: '',
  aiTutorMessages: [],

  // State Halaman Belajar Materi
  inMaterialReader: false,
  currentBabId: 'bab-01',
  currentMaterialId: 'mat-1-1',
  currentMaterialStep: 1,

  completedMaterials: {},
  completedQuizzes: {},
  passedSteps: { 1: true, 2: true },

  // Data Profil & Analitik Pembelajaran Riil
  profileStats: null,
  profileQuizHistory: null,
  profileRecommendation: null,
  isLoadingProfileData: false,

  // Mapel aktif di Quest
  activeSubject: 'IPS',

  user: {
    fullName: 'Petualang Baru',
    firstName: 'Petualang',
    email: '',
    jenjang: 'SMA',
    jenjangDisplay: 'SMA/SMK',
    kelas: 'Kelas 10',
    education_level: 'SMA',
    level: 1,
    rank: 'Bronze',
    totalXp: 0,
    xp: 0,
    nextLevelXp: 100,
    ipsLives: 3,
    ipsLivesMax: 3
  }
};

function getDefaultUserState() {
  return {
    fullName: 'Petualang Baru',
    firstName: 'Petualang',
    email: '',
    jenjang: 'SMA',
    jenjangDisplay: 'SMA/SMK',
    kelas: 'Kelas 10',
    education_level: 'SMA',
    level: 1,
    rank: 'Bronze',
    totalXp: 0,
    xp: 0,
    nextLevelXp: 100,
    ipsLives: 3,
    ipsLivesMax: 3
  };
}

function resetUserSessionState() {
  appState.isLoggedIn = false;
  appState.isNewUser = true;
  appState.inMaterialReader = false;
  appState.inQuizSession = false;
  appState.activeTab = 'beranda';
  appState.isProfileDropdownOpen = false;
  appState.profileStats = null;
  appState.profileQuizHistory = null;
  appState.profileRecommendation = null;
  appState.isLoadingProfileData = false;
  appState.completedMaterials = {};
  appState.completedQuizzes = {};
  appState.quizAttempts = [];
  appState.user = getDefaultUserState();
}
window.resetUserSessionState = resetUserSessionState;

function applyProgressToUser(progress) {
  if (!progress) return;
  appState.user.totalXp = progress.xp ?? appState.user.totalXp;
  appState.user.level = progress.level ?? appState.user.level;
  appState.user.rank = progress.rank?.name || appState.user.rank;
  appState.user.xp = progress.xp_into_level ?? appState.user.xp;
  appState.user.nextLevelXp = progress.xp_for_next_level ?? appState.user.nextLevelXp;
  if (progress.subject_lives && typeof progress.subject_lives === 'object') {
    const livesVal = Object.values(progress.subject_lives)[0];
    if (typeof livesVal === 'number') {
      appState.user.ipsLives = livesVal;
    }
  }
}
window.applyProgressToUser = applyProgressToUser;

let toastTimer = null;
function showToast(title, message, icon = '✓') {
  const toast = document.getElementById('toast');
  const iconEl = document.getElementById('toast-icon');
  const titleEl = document.getElementById('toast-title');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !titleEl || !msgEl) return;

  if (iconEl) iconEl.textContent = icon;
  titleEl.textContent = title;
  msgEl.textContent = message;
  toast.classList.remove('hidden');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}
window.showToast = showToast;

// ==========================================================
// MASA BERLAKU SESI — TOKEN 1 JAM
// ==========================================================
let sessionExpiryTimer = null;

function clearSessionExpiryTimer() {
  if (sessionExpiryTimer) {
    clearTimeout(sessionExpiryTimer);
    sessionExpiryTimer = null;
  }
}

function expireSession() {
  clearSessionExpiryTimer();
  if (window.EduQuestAPI) {
    window.EduQuestAPI.logoutLocal();
  }
  resetUserSessionState();
  closeProfileDropdown();
  closeAuthModal();
  updateMainViews();
  renderNavbarAuth();
  showToast('Sesi Berakhir', 'Sesi login sudah lebih dari 1 jam. Silakan masuk lagi.', '⏰');
}

function scheduleSessionExpiry() {
  clearSessionExpiryTimer();
  if (!window.EduQuestAPI) return;
  const remaining = window.EduQuestAPI.getTokenRemainingMs
    ? window.EduQuestAPI.getTokenRemainingMs()
    : 0;
  if (!remaining || remaining <= 0) return;
  // Tambah sedikit jeda agar token benar-benar sudah kedaluwarsa saat dicek.
  sessionExpiryTimer = setTimeout(expireSession, remaining + 100);
}

// Jika tab sempat tidak aktif (timer browser ditunda), cek lagi saat kembali aktif.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (!appState.isLoggedIn || !window.EduQuestAPI) return;
  if (!window.EduQuestAPI.isAuthenticated()) {
    expireSession();
  }
});

function getInitials(name) {
  if (!name || !name.trim()) return 'F';
  return name.trim().charAt(0).toUpperCase();
}

function getShortName(name) {
  if (!name || !name.trim()) return 'Fira';
  return name.trim().split(/\s+/)[0];
}

function renderHeartsInline(lives, maxLives = 3, sizeClass = 'w-4 h-4') {
  let html = '';
  for (let i = 1; i <= maxLives; i++) {
    if (i <= lives) {
      html += `<svg class="${sizeClass} text-[#b91c47] fill-current inline-block" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    } else {
      html += `<svg class="${sizeClass} text-brand-300 fill-brand-50 stroke-current inline-block" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    }
  }
  return html;
}

// ==========================================================
// RENDER NAVBAR PROFILE + LEVEL/XP BAR & DROPDOWN
// ==========================================================
function renderNavbarAuth() {
  const container = document.getElementById('nav-auth-container');
  const desktopNav = document.getElementById('nav-desktop');
  const mobileUserCard = document.getElementById('mobile-user-card');
  if (!container) return;

  if (!appState.isLoggedIn) {
    appState.isProfileDropdownOpen = false;
    if (desktopNav) desktopNav.classList.add('hidden');
    if (mobileUserCard) {
      mobileUserCard.classList.add('hidden');
      mobileUserCard.innerHTML = '';
    }
    container.innerHTML = `
      <button type="button" onclick="window.openAuthModal('login')" class="rounded-xl border-2 border-brand-200 bg-white px-4 py-2 font-display text-sm font-bold text-brand-700 transition hover:bg-brand-50 cursor-pointer">
        Masuk
      </button>
      <button type="button" id="nav-btn-auth" onclick="window.openAuthModal('choice')" class="btn-primary btn-sm">
        Mulai Quest
      </button>
    `;
    return;
  }

  if (desktopNav) desktopNav.classList.remove('hidden');

  const u = appState.user;
  const initial = getInitials(u.fullName);
  const shortName = getShortName(u.fullName);
  const jenjangText = `${u.jenjangDisplay || JENJANG_LABEL[u.jenjang] || u.jenjang} • ${u.kelas}`;
  const levelBadgeText = `Level ${u.level} • ${u.rank}`;
  const xpPct = Math.min(100, Math.round((u.xp / (u.nextLevelXp || 100)) * 100));
  const rankAsset = window.EDUQUEST_ASSETS?.[getRankAssetKey(u.rank)] || '';

  container.innerHTML = `
    <div class="flex items-center gap-3 sm:gap-4">
      <!-- Mini Level & XP Bar di Navbar -->
      <div class="hidden lg:flex flex-col items-end min-w-[155px]">
        <div class="flex items-center gap-2 text-[11px] font-display font-extrabold">
          <span class="text-ink-900">${levelBadgeText}</span>
          <span class="text-brand-700">${u.xp}/${u.nextLevelXp} XP &rarr; Lv. ${u.level + 1}</span>
        </div>
        <div class="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
          <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width: ${xpPct}%"></div>
        </div>
      </div>

      <!-- Profile Trigger & Dropdown -->
      <div class="relative" id="profile-dropdown-wrapper">
        <button
          type="button"
          id="profile-menu-btn"
          onclick="window.toggleProfileDropdown(event)"
          aria-expanded="${appState.isProfileDropdownOpen ? 'true' : 'false'}"
          aria-haspopup="true"
          class="group inline-flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-brand-50/80 focus:outline-none cursor-pointer select-none"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-100 font-display text-sm font-extrabold text-brand-700 shadow-xs">
            ${initial}
          </span>
          <span class="font-display text-base font-extrabold text-ink-900 tracking-tight">
            ${shortName}
          </span>
          <svg
            id="profile-chevron-icon"
            class="h-4 w-4 text-ink-900 transition-transform duration-200 ${appState.isProfileDropdownOpen ? 'rotate-180' : ''}"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          id="profile-dropdown-menu"
          class="${appState.isProfileDropdownOpen ? 'block animate-modalZoom' : 'hidden'} absolute right-0 mt-3 w-72 origin-top-right rounded-[1.75rem] border border-brand-100 bg-white shadow-[0_18px_40px_-10px_rgba(76,29,149,0.22)] z-50 overflow-hidden"
        >
          <div class="px-5 pt-5 pb-4 flex items-start gap-3.5">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-100 font-display text-base font-extrabold text-brand-700">
              ${initial}
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-display text-[17px] font-extrabold text-ink-900 leading-snug truncate">
                ${u.fullName}
              </p>
              <p class="text-[13px] font-semibold text-slate-600 mt-0.5">
                ${jenjangText}
              </p>
              <span class="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-100/90 px-3 py-0.5 font-display text-xs font-extrabold text-brand-700">
                ${rankAsset ? `<img src="${rankAsset}" alt="${u.rank}" class="w-4 h-4 object-contain" />` : ''}
                <span>${levelBadgeText}</span>
              </span>
            </div>
          </div>

          <div class="mx-4 border-t border-brand-100"></div>

          <div class="p-2 space-y-0.5">
            <button
              type="button"
              onclick="window.handleProfileAction('profil')"
              class="w-full flex items-center gap-3.5 rounded-2xl px-4 py-2.5 text-left transition hover:bg-brand-50 cursor-pointer group"
            >
              <svg class="h-5 w-5 shrink-0 text-brand-600 transition group-hover:scale-105" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="font-display text-[15px] font-extrabold text-ink-900">Profil Saya</span>
            </button>

            <button
              type="button"
              onclick="window.handleProfileAction('achievement')"
              class="w-full flex items-center gap-3.5 rounded-2xl px-4 py-2.5 text-left transition hover:bg-brand-50 cursor-pointer group"
            >
              <svg class="h-5 w-5 shrink-0 text-brand-600 transition group-hover:scale-105" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 21h8m-4-4v4m-5-9a5 5 0 0010 0V4H7v8zM7 6H4v2a3 3 0 003 3m10-5h3v2a3 3 0 01-3 3" />
              </svg>
              <span class="font-display text-[15px] font-extrabold text-ink-900">Achievement</span>
            </button>

            <button
              type="button"
              onclick="window.handleProfileAction('jenjang')"
              class="w-full flex items-center gap-3.5 rounded-2xl px-4 py-2.5 text-left transition hover:bg-brand-50 cursor-pointer group"
            >
              <svg class="h-5 w-5 shrink-0 text-brand-600 transition group-hover:scale-105" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <span class="font-display text-[15px] font-extrabold text-ink-900">Ubah Jenjang &amp; Kelas</span>
            </button>

            <button
              type="button"
              onclick="window.handleProfileAction('pengaturan')"
              class="w-full flex items-center gap-3.5 rounded-2xl px-4 py-2.5 text-left transition hover:bg-brand-50 cursor-pointer group"
            >
              <svg class="h-5 w-5 shrink-0 text-brand-600 transition group-hover:scale-105" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="font-display text-[15px] font-extrabold text-ink-900">Pengaturan</span>
            </button>
          </div>

          <div class="mx-4 border-t border-brand-100"></div>

          <div class="p-2">
            <button
              type="button"
              onclick="window.handleProfileAction('keluar')"
              class="w-full flex items-center gap-3.5 rounded-2xl px-4 py-2.5 text-left transition hover:bg-rose-50 cursor-pointer group"
            >
              <svg class="h-5 w-5 shrink-0 text-brand-600 group-hover:text-rose-600 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              <span class="font-display text-[15px] font-extrabold text-ink-900 group-hover:text-rose-700">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  if (mobileUserCard) {
    mobileUserCard.classList.remove('hidden');
    mobileUserCard.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-white font-display text-sm font-extrabold text-brand-700">
          ${initial}
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-display text-sm font-extrabold text-ink-900 truncate">${u.fullName}</p>
          <p class="text-xs text-slate-500">${jenjangText} • ${levelBadgeText}</p>
        </div>
      </div>
      <div class="mt-3 grid grid-cols-2 gap-2 border-t border-brand-200/60 pt-2.5">
        <button type="button" onclick="window.handleProfileAction('profil')" class="rounded-xl bg-white px-3 py-1.5 text-xs font-extrabold text-brand-700 border border-brand-200">Profil Saya</button>
        <button type="button" onclick="window.handleProfileAction('jenjang')" class="rounded-xl bg-white px-3 py-1.5 text-xs font-extrabold text-brand-700 border border-brand-200">Ubah Kelas</button>
        <button type="button" onclick="window.handleProfileAction('pengaturan')" class="rounded-xl bg-white px-3 py-1.5 text-xs font-extrabold text-brand-700 border border-brand-200">Pengaturan</button>
        <button type="button" onclick="window.handleProfileAction('keluar')" class="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-extrabold text-rose-700 border border-rose-200">Keluar</button>
      </div>
    `;
  }
}

function toggleProfileDropdown(event) {
  if (event) event.stopPropagation();
  appState.isProfileDropdownOpen = !appState.isProfileDropdownOpen;
  const menu = document.getElementById('profile-dropdown-menu');
  const chevron = document.getElementById('profile-chevron-icon');
  const btn = document.getElementById('profile-menu-btn');

  if (menu) {
    if (appState.isProfileDropdownOpen) {
      menu.classList.remove('hidden');
      menu.classList.add('block', 'animate-modalZoom');
    } else {
      menu.classList.add('hidden');
      menu.classList.remove('block');
    }
  }
  if (chevron) chevron.classList.toggle('rotate-180', appState.isProfileDropdownOpen);
  if (btn) btn.setAttribute('aria-expanded', appState.isProfileDropdownOpen ? 'true' : 'false');
}
window.toggleProfileDropdown = toggleProfileDropdown;

function closeProfileDropdown() {
  if (!appState.isProfileDropdownOpen) return;
  appState.isProfileDropdownOpen = false;
  const menu = document.getElementById('profile-dropdown-menu');
  const chevron = document.getElementById('profile-chevron-icon');
  const btn = document.getElementById('profile-menu-btn');
  if (menu) {
    menu.classList.add('hidden');
    menu.classList.remove('block');
  }
  if (chevron) chevron.classList.remove('rotate-180');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}
window.closeProfileDropdown = closeProfileDropdown;

document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('profile-dropdown-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    closeProfileDropdown();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProfileDropdown();
    closeFeatureModal();
    closeAuthModal();
  }
});

// ==========================================================
// 1. BERANDA — PETUALANG LAMA (FIRA PUTRI)
// Sesuai "Beranda — Petualang Lama.png"
// ==========================================================
function renderOldUserBeranda() {
  const container = document.getElementById('view-pengguna-lama');
  if (!container) return;

  const u = appState.user;
  const shortName = getShortName(u.fullName);
  const jenjangText = `${u.jenjangDisplay || JENJANG_LABEL[u.jenjang] || u.jenjang} • ${u.kelas}`;
  const mascotSrc = window.EDUQUEST_ASSETS?.mascot || '';
  const bronzeSrc = window.EDUQUEST_ASSETS?.rekrut || '';
  const silverSrc = window.EDUQUEST_ASSETS?.penjelajah || '';
  const goldSrc = window.EDUQUEST_ASSETS?.kesatria || '';
  const xpPct = Math.min(100, Math.round((u.xp / (u.nextLevelXp || 800)) * 100));
  const remXp = Math.max(0, (u.nextLevelXp || 800) - u.xp);
  const completedCount = Object.keys(appState.completedMaterials || {}).length;
  const quizzesCount = appState.profileStats?.total_quizzes || (appState.profileQuizHistory ? appState.profileQuizHistory.length : 0);
  const ipsPct = Math.min(100, Math.round((completedCount / 20) * 100));

  container.innerHTML = `
    <!-- 1. HERO CARD PETUALANG LAMA -->
    <section class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-xs">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <!-- Kiri: Maskot + Sapaan Halo, Fira! + Quest Aktif Pill -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
          <div class="w-24 sm:w-28 shrink-0 flex justify-center">
            <img src="${mascotSrc}" alt="Maskot EduQuest" class="w-full h-auto object-contain drop-shadow-sm select-none" />
          </div>
          <div class="flex-1">
            <span class="inline-block rounded-full bg-brand-100/90 px-3.5 py-1 font-display text-xs font-extrabold text-brand-700">
              ${jenjangText}
            </span>
            <h1 class="mt-2.5 font-display text-3xl sm:text-4xl font-extrabold text-ink-900">
              Halo, ${shortName}!
            </h1>
            <p class="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              ${completedCount} materi dan ${quizzesCount} kuis selesai • Total ${u.totalXp.toLocaleString('id-ID')} XP.<br>
              Level ${u.level} • Rank ${u.rank} • Sisa ${remXp} XP menuju Level ${u.level + 1}.
            </p>

            <!-- Mini Banner Quest Aktif -->
            <div
              onclick="window.openMaterialPage('bab-02', 'mat-2-1', 1)"
              class="mt-4 rounded-2xl bg-brand-50/90 border border-brand-100 px-4 py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-brand-100/60 transition"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span class="text-lg shrink-0">🎯</span>
                <div class="min-w-0">
                  <p class="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">QUEST AKTIF</p>
                  <p class="font-display text-xs sm:text-sm font-extrabold text-ink-900 truncate">
                    Mengenal Interaksi Antarruang &mdash; Bagian 4 dari 5
                  </p>
                </div>
              </div>
              <span class="shrink-0 rounded-full bg-brand-700 px-3 py-1 font-display text-xs font-extrabold text-white">
                60%
              </span>
            </div>
          </div>
        </div>

        <!-- Kanan: Level & Rank Gold Card + Bar XP -->
        <div class="w-full lg:w-80 space-y-3 shrink-0">
          <div class="rounded-2xl border border-brand-100 bg-brand-50/75 p-4 flex items-center gap-3.5">
            <img src="${goldSrc}" alt="Gold Emblem" class="w-12 h-12 object-contain shrink-0 drop-shadow-2xs" />
            <div>
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">LEVEL &amp; RANK SAAT INI</p>
              <p class="font-display text-lg font-extrabold text-ink-900 leading-tight">Level ${u.level} • ${u.rank}</p>
              <p class="text-xs text-slate-600 mt-0.5">Gold mulai 300 XP • Level terus naik</p>
            </div>
          </div>

          <div class="rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
            <div class="flex items-center justify-between text-xs font-display font-extrabold">
              <span class="text-ink-900">Level ${u.level} • ${u.rank}</span>
              <span class="text-brand-700">${u.totalXp.toLocaleString('id-ID')} XP • ${u.xp}/${u.nextLevelXp} ke Lv. ${u.level + 1}</span>
            </div>
            <div class="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-brand-100">
              <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width: ${xpPct}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Baris 3 Rank (Bronze, Silver, Gold) -->
      <div class="mt-6 pt-5 border-t border-brand-100 grid gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-brand-100 bg-white px-4 py-3 flex items-center gap-3">
          <img src="${bronzeSrc}" alt="Bronze" class="w-8 h-8 object-contain shrink-0" />
          <div>
            <p class="font-display text-xs font-extrabold text-ink-900">Bronze</p>
            <p class="text-[11px] text-slate-500">0–99 XP</p>
          </div>
        </div>
        <div class="rounded-2xl border border-brand-100 bg-white px-4 py-3 flex items-center gap-3">
          <img src="${silverSrc}" alt="Silver" class="w-8 h-8 object-contain shrink-0" />
          <div>
            <p class="font-display text-xs font-extrabold text-ink-900">Silver</p>
            <p class="text-[11px] font-bold text-brand-700">100–299 XP</p>
          </div>
        </div>
        <div class="rounded-2xl border-2 border-brand-700 bg-brand-50/75 px-4 py-3 flex items-center gap-3">
          <img src="${goldSrc}" alt="Gold" class="w-8 h-8 object-contain shrink-0" />
          <div>
            <p class="font-display text-xs font-extrabold text-brand-700">Gold</p>
            <p class="text-[11px] font-semibold text-ink-900">300 XP+</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. SECTION QUEST AKTIF DENGAN STEPPER 5 TAHAP -->
    <section class="space-y-3">
      <div>
        <h2 class="font-display text-2xl font-extrabold text-ink-900">Quest</h2>
        <p class="text-xs sm:text-sm text-slate-500">Questmu menunggu untuk dituntaskan.</p>
      </div>

      <div class="rounded-3xl border-2 border-brand-700 bg-white p-6 sm:p-7 shadow-xs space-y-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-start gap-4 flex-1">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 border border-brand-100 text-2xl">
              🌍
            </div>
            <div class="flex-1">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">IPS • BAGIAN 4 DARI 5</p>
              <h3 class="mt-0.5 font-display text-xl sm:text-2xl font-extrabold text-ink-900">Mengenal Interaksi Antarruang</h3>
              <p class="text-xs text-slate-500 mt-0.5">Bab Interaksi Antarruang • 3 dari 5 bagian materi selesai • Sekitar 8 menit lagi</p>
              <div class="mt-3 max-w-md">
                <div class="h-2 w-full overflow-hidden rounded-full bg-brand-100">
                  <div class="h-full w-[60%] rounded-full bg-brand-700"></div>
                </div>
                <p class="mt-1.5 text-[11px] font-extrabold text-brand-700">Materi Mengenal Interaksi Antarruang • 60% selesai</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onclick="window.openMaterialPage('bab-02', 'mat-2-1', 2)"
            class="w-full md:w-auto rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer shrink-0"
          >
            Lanjutkan belajar
          </button>
        </div>

        <!-- Stepper 5 Bagian -->
        <div>
          <p class="text-xs font-extrabold text-ink-900 mb-4">Alur Materi &mdash; Mengenal Interaksi Antarruang</p>
          <div class="grid grid-cols-5 gap-2 items-start text-center">
            <div class="flex flex-col items-center">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold">✓</span>
              <p class="mt-2 text-[11px] font-bold text-emerald-800 leading-tight">Mengenal<br>Ruang</p>
            </div>
            <div class="flex flex-col items-center">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold">✓</span>
              <p class="mt-2 text-[11px] font-bold text-emerald-800 leading-tight">Letak<br>Wilayah</p>
            </div>
            <div class="flex flex-col items-center">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white text-xs font-bold">✓</span>
              <p class="mt-2 text-[11px] font-bold text-emerald-800 leading-tight">Koneksi<br>Antarruang</p>
            </div>
            <div class="flex flex-col items-center">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white text-xs font-bold ring-4 ring-brand-100">⚔️</span>
              <p class="mt-2 text-[11px] font-extrabold text-brand-700 leading-tight">Contoh<br>Interaksi</p>
            </div>
            <div class="flex flex-col items-center">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-400 text-xs">🔒</span>
              <p class="mt-2 text-[11px] font-semibold text-slate-500 leading-tight">Kuis<br>Penutup</p>
            </div>
          </div>
        </div>

        <!-- Reward Strip Hijau -->
        <div class="rounded-2xl bg-emerald-50/80 border border-emerald-200/80 px-4 py-3 flex items-center gap-3 text-xs">
          <span class="text-lg">🎁</span>
          <div>
            <p class="font-display font-extrabold text-emerald-900">Kuis tingkat sedang • Maksimal 80 XP</p>
            <p class="text-slate-600">8 XP per jawaban benar • 10 soal</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. MATA PELAJARAN -->
    <section class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-7 shadow-xs space-y-5">
      <div>
        <h2 class="font-display text-xl sm:text-2xl font-extrabold text-ink-900">Mata Pelajaran</h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">${completedCount} materi selesai di jenjang ${u.jenjangDisplay || u.jenjang}. Nyawa terpisah per mapel, maksimal 3; pulih 1 nyawa tiap 1 jam.</p>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        <!-- IPS -->
        <div class="rounded-2xl border border-brand-100 p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">🌍</span>
              <div>
                <h3 class="font-display text-base font-extrabold text-ink-900">IPS</h3>
                <p class="text-[11px] font-bold text-brand-700">${u.jenjangDisplay || u.jenjang} • Ruang &amp; Wilayah</p>
              </div>
            </div>
            <div class="mt-4 flex justify-between text-xs font-extrabold text-brand-700">
              <span>${completedCount}/20 materi selesai</span>
              <span>${ipsPct}%</span>
            </div>
            <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-100">
              <div class="h-full rounded-full bg-brand-700" style="width: ${ipsPct}%"></div>
            </div>
          </div>
          <button type="button" onclick="window.switchQuestSubject('IPS'); window.handleNavClick('quest');" class="mt-4 w-full rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer">
            Lanjutkan Quest
          </button>
        </div>

        <!-- IPA -->
        <div class="rounded-2xl border border-brand-100 p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl">🧪</span>
              <div>
                <h3 class="font-display text-base font-extrabold text-ink-900">IPA</h3>
                <p class="text-[11px] font-bold text-brand-700">${u.jenjangDisplay || u.jenjang} • Sains &amp; Lingkungan</p>
              </div>
            </div>
            <div class="mt-4 flex justify-between text-xs font-extrabold text-emerald-700">
              <span>0/20 materi selesai</span>
              <span>0%</span>
            </div>
            <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
              <div class="h-full w-[0%] rounded-full bg-emerald-600"></div>
            </div>
          </div>
          <button type="button" onclick="window.switchQuestSubject('IPA'); window.handleNavClick('quest');" class="mt-4 w-full rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer">
            Lihat Bab
          </button>
        </div>

        <!-- Bahasa Indonesia -->
        <div class="rounded-2xl border border-brand-100 p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-xl">📖</span>
              <div>
                <h3 class="font-display text-base font-extrabold text-ink-900">Bahasa Indonesia</h3>
                <p class="text-[11px] font-bold text-brand-700">${u.jenjangDisplay || u.jenjang} • Teks &amp; Sastra</p>
              </div>
            </div>
            <div class="mt-4 flex justify-between text-xs font-extrabold text-amber-700">
              <span>0/20 materi selesai</span>
              <span>0%</span>
            </div>
            <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-amber-100">
              <div class="h-full w-[0%] rounded-full bg-amber-600"></div>
            </div>
          </div>
          <button type="button" onclick="window.switchQuestSubject('Bahasa Indonesia'); window.handleNavClick('quest');" class="mt-4 w-full rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer">
            Lihat Bab
          </button>
        </div>
      </div>
    </section>

    <!-- 4. REKOMENDASI QUEST BERIKUTNYA & BANTUAN AI TUTOR -->
    <section class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-7 shadow-xs space-y-5">
      <div>
        <h2 class="font-display text-xl sm:text-2xl font-extrabold text-ink-900">Rekomendasi Quest Berikutnya</h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Topik untuk memperkuat pemahaman. Latihan terbimbing tersedia di dalam materi.</p>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        <div class="rounded-2xl border border-brand-100 p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold text-brand-700">IPS</span>
              <span class="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-700">Sedang</span>
            </div>
            <h3 class="mt-2 font-display text-lg font-extrabold text-ink-900">Kegiatan Ekonomi</h3>
            <p class="mt-1 text-xs text-slate-500 leading-relaxed">Lanjutkan IPS setelah materi Interaksi Antarruang.</p>
          </div>
          <button type="button" onclick="window.openMaterialPage('bab-04', 'mat-4-1', 1)" class="mt-4 w-full rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer">
            Buka Quest
          </button>
        </div>

        <div class="rounded-2xl border border-brand-100 p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold text-brand-700">IPA</span>
              <span class="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-700">Mudah</span>
            </div>
            <h3 class="mt-2 font-display text-lg font-extrabold text-ink-900">Rantai Makanan</h3>
            <p class="mt-1 text-xs text-slate-500 leading-relaxed">Pelajari konsep dan coba latihan terbimbing di dalam materi.</p>
          </div>
          <button type="button" onclick="window.handleNavClick('quest')" class="mt-4 w-full rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer">
            Buka Quest
          </button>
        </div>

        <div class="rounded-2xl border border-brand-100 p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold text-brand-700">Bahasa Indonesia</span>
              <span class="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-700">Mudah</span>
            </div>
            <h3 class="mt-2 font-display text-lg font-extrabold text-ink-900">Mengenal Teks Narasi</h3>
            <p class="mt-1 text-xs text-slate-500 leading-relaxed">Lanjutkan ke teks narasi setelah memahami teks deskripsi.</p>
          </div>
          <button type="button" onclick="window.handleNavClick('quest')" class="mt-4 w-full rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer">
            Buka Quest
          </button>
        </div>
      </div>

      <div class="rounded-2xl bg-brand-50/75 border border-brand-100 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-start gap-3.5">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-brand-100 text-lg">🔮</span>
          <div>
            <h4 class="font-display text-base font-extrabold text-ink-900">Bantuan AI Tutor</h4>
            <p class="text-xs text-slate-600 mt-0.5">Butuh bantuan saat belajar? Gunakan AI Tutor untuk petunjuk bertahap.</p>
            <p class="text-xs font-extrabold text-brand-700 mt-1">Petunjuk bertahap, bukan jawaban akhir.</p>
            <p class="text-[11px] text-slate-500 mt-0.5">AI dapat keliru dan layanan bisa tidak tersedia. Kamu tetap bisa melanjutkan materi.</p>
          </div>
        </div>
        <button type="button" onclick="window.handleNavClick('ai-tutor')" class="rounded-xl border-2 border-brand-700 bg-white px-5 py-2.5 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer shrink-0">
          Tanya AI Tutor
        </button>
      </div>
    </section>

    <!-- 5. ACHIEVEMENT TERBARU -->
    <section class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-7 shadow-xs space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-display text-xl sm:text-2xl font-extrabold text-ink-900">Achievement Terbaru</h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Setiap usaha punya cerita. Inilah lencana dari petualanganmu.</p>
        </div>
        <button type="button" onclick="window.handleProfileAction('profil')" class="font-display text-xs font-extrabold text-brand-700 hover:underline cursor-pointer">
          Lihat Semua Lencana &rarr;
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${[
          { icon: '🏅', title: 'Langkah Pertama', sub: 'Selesaikan 1 materi' },
          { icon: '🏆', title: 'Penakluk Kuis', sub: 'Selesaikan 1 kuis' },
          { icon: '🏅', title: 'Penjelajah Tekun', sub: 'Selesaikan 10 materi' },
          { icon: '🏆', title: 'Ahli IPS', sub: 'Selesaikan 5 kuis IPS' }
        ].map(b => `
          <div class="rounded-2xl border border-brand-100 bg-white p-5 text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">${b.icon}</div>
            <h4 class="mt-3 font-display text-sm font-extrabold text-ink-900">${b.title}</h4>
            <p class="text-xs text-slate-500 mt-0.5">${b.sub}</p>
            <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
              <div class="h-full w-full rounded-full bg-emerald-700"></div>
            </div>
            <p class="mt-2 text-[11px] font-extrabold text-emerald-700">Terbuka • 100%</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 6. HASIL KUIS TERAKHIR -->
    <section class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-7 shadow-xs space-y-4">
      <h2 class="font-display text-xl sm:text-2xl font-extrabold text-ink-900">Hasil Kuis Terakhir</h2>
      <div class="rounded-2xl border border-brand-100 bg-brand-50/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white border border-brand-100 text-xl">🏆</div>
          <div>
            <h4 class="font-display text-base font-extrabold text-ink-900">Kuis IPS: Ruang dan Wilayah</h4>
            <p class="text-xs text-slate-500 mt-0.5">IPS • 2 November 2026 • 8 dari 10 jawaban benar</p>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div>
            <p class="text-[10px] font-bold text-slate-500">Skor</p>
            <p class="font-display text-xl font-extrabold text-ink-900">80 / 100</p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-slate-500">XP diraih</p>
            <p class="font-display text-xl font-extrabold text-ink-900">+64 XP</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ==========================================================
// 2. HALAMAN PROFIL SAYA (PENUH) — PETUALANG LAMA (FIRA PUTRI)
async function loadProfileDataAsync() {
  if (appState.isLoadingProfileData || !window.EduQuestAPI || !appState.isLoggedIn) return;
  appState.isLoadingProfileData = true;
  try {
    const [historyRes, statsRes, recomRes] = await Promise.allSettled([
      window.EduQuestAPI.getQuizHistory ? window.EduQuestAPI.getQuizHistory() : Promise.resolve([]),
      window.EduQuestAPI.getLearningStats ? window.EduQuestAPI.getLearningStats() : Promise.resolve(null),
      window.EduQuestAPI.getAIRecommendations ? window.EduQuestAPI.getAIRecommendations() : Promise.resolve(null),
    ]);

    if (historyRes.status === 'fulfilled' && Array.isArray(historyRes.value)) {
      appState.profileQuizHistory = historyRes.value;
    }
    if (statsRes.status === 'fulfilled' && statsRes.value) {
      appState.profileStats = statsRes.value;
    }
    if (recomRes.status === 'fulfilled' && recomRes.value) {
      appState.profileRecommendation = recomRes.value;
    }

    if (appState.activeTab === 'profil-saya') {
      renderProfilSayaPage(false);
    }
  } catch (err) {
    console.warn('Gagal memuat data profil:', err);
  } finally {
    appState.isLoadingProfileData = false;
  }
}
window.loadProfileDataAsync = loadProfileDataAsync;

// ==========================================================
// 2. HALAMAN PROFIL SAYA (PENUH)
// Terhubung dengan API Riwayat Kuis, Statistik & AI Rekomendasi
// ==========================================================
function renderProfilSayaPage(triggerFetch = true) {
  const container = document.getElementById('view-profil-saya');
  if (!container) return;

  if (triggerFetch && appState.isLoggedIn && !appState.profileStats && !appState.isLoadingProfileData) {
    loadProfileDataAsync();
  }

  const u = appState.user;
  const initial = getInitials(u.fullName);
  const jenjangText = `${u.jenjangDisplay || JENJANG_LABEL[u.jenjang] || u.jenjang} • ${u.kelas}`;
  const goldSrc = window.EDUQUEST_ASSETS?.[getRankAssetKey(u.rank)] || '';
  const displayTotalXp = u.totalXp || 0;
  const displayCurrXp = u.xp || 0;
  const displayNextXp = u.nextLevelXp || 100;
  const xpPct = displayNextXp > 0 ? Math.min(100, Math.round((displayCurrXp / displayNextXp) * 100)) : 0;
  const remXp = Math.max(0, displayNextXp - displayCurrXp);

  // 1. Data Riwayat Kuis Riil vs Empty State
  const realHistory = appState.profileQuizHistory;
  const hasRealHistory = Array.isArray(realHistory) && realHistory.length > 0;

  const quizRows = hasRealHistory
    ? realHistory.slice(0, 10).map((h, idx) => {
        const isLatest = idx === 0;
        const dateStr = h.started_at
          ? new Date(h.started_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'Baru saja';
        const diffLabel = h.target_difficulty === 3 ? 'Sulit' : h.target_difficulty === 2 ? 'Sedang' : 'Dasar';
        const title = h.material?.title || `Kuis Latihan #${h.id}`;
        const sub = `${diffLabel} · ${dateStr}${isLatest ? ' · <span class="font-extrabold text-brand-700">Terbaru</span>' : ''}`;
        const ans = `${h.correct_count}/${h.total_questions} benar`;
        const score = `${Math.round(h.percent || 0)}`;
        const xp = `+${h.xp_gained || 0} XP`;
        const isEndedEarly = h.ended_early || h.percent < 60;
        const statusText = isEndedEarly ? '⚠️ Gugur' : '✓ Selesai';
        const statusClass = isEndedEarly
          ? 'bg-amber-50 border border-amber-200 text-amber-700'
          : 'bg-emerald-50 border border-emerald-200 text-emerald-700';

        return {
          title,
          sub,
          ans,
          score,
          xp,
          highlight: isLatest,
          statusText,
          statusClass,
        };
      })
    : [];

  // 2. Data Statistik Pembelajaran
  const stats = appState.profileStats;
  const totalMateriSelesai = stats?.completed_materials ?? Object.keys(appState.completedMaterials || {}).length;
  const totalKuisSelesai = stats?.total_quizzes ?? (hasRealHistory ? realHistory.length : 0);
  const avgAccuracy = (stats && stats.total_quizzes > 0) ? `${stats.average_accuracy}%` : (hasRealHistory ? '85%' : '0%');

  // 3. AI Rekomendasi Belajar
  const recom = appState.profileRecommendation;
  const aiMessage = recom?.personalized_message ||
    `Halo ${u.fullName}! Ayo mulai petualangan belajarmu dengan membaca materi dan mengerjakan kuis untuk mendapatkan analisis dan rekomendasi personal dari AI Tutor!`;

  container.innerHTML = `
    <div class="space-y-8">
      <div>
        <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-ink-900">Profil Saya</h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">Jejak petualanganmu, dari langkah pertama hingga pencapaian hari ini.</p>
      </div>

      <!-- Kartu Profil Utama -->
      <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-xs">
        <div class="grid gap-8 lg:grid-cols-[1fr_360px] items-center">
          <!-- Kiri: Identitas & Tombol Edit -->
          <div>
            <div class="flex items-center gap-5">
              <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-brand-200 bg-brand-100 font-display text-3xl font-extrabold text-brand-700">
                ${initial}
              </div>
              <div>
                <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">PETUALANG EDUQUEST</p>
                <h2 class="mt-0.5 font-display text-2xl sm:text-3xl font-extrabold text-ink-900">${u.fullName}</h2>
                <p class="text-sm font-semibold text-slate-600 mt-0.5">${jenjangText}</p>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onclick="window.openFeatureModal('profil')"
                class="inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer"
              >
                <span>✏️</span>
                <span>Edit Profil</span>
              </button>
              <button
                type="button"
                onclick="window.openFeatureModal('jenjang')"
                class="px-3 py-2 font-display text-xs font-extrabold text-brand-700 hover:underline cursor-pointer"
              >
                Ubah Jenjang &amp; Kelas
              </button>
              <span class="text-slate-300">|</span>
              <button
                type="button"
                onclick="window.openFeatureModal('pengaturan')"
                class="px-3 py-2 font-display text-xs font-extrabold text-brand-700 hover:underline cursor-pointer"
              >
                Pengaturan
              </button>
            </div>

            <p class="mt-4 text-xs text-slate-500">
              Setiap materi dan kuis yang kamu tuntaskan tersimpan permanen di akun belajarmu.
            </p>
          </div>

          <!-- Kanan: Level, Total XP & Bar -->
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <img src="${goldSrc}" alt="${u.rank}" class="w-12 h-12 object-contain shrink-0" />
                <div>
                  <h3 class="font-display text-lg font-extrabold text-ink-900 leading-tight">Level ${u.level} • ${u.rank}</h3>
                  <p class="text-xs text-slate-500">Bronze &rarr; Silver &rarr; Gold</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-display text-2xl font-extrabold text-brand-700">${displayTotalXp.toLocaleString('id-ID')} XP</p>
                <p class="text-[11px] text-slate-500">Total terkumpul</p>
              </div>
            </div>

            <div class="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
              <div class="flex items-center justify-between text-xs font-display font-extrabold">
                <span class="text-ink-900">Level ${u.level} &rarr; Level ${u.level + 1}</span>
                <span class="text-brand-700">${displayCurrXp}/${displayNextXp} XP • ${xpPct}%</span>
              </div>
              <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-100">
                <div class="h-full rounded-full bg-brand-700" style="width: ${xpPct}%"></div>
              </div>
            </div>

            <p class="text-xs font-extrabold text-brand-700">${remXp} XP lagi menuju Level ${u.level + 1}</p>
            <p class="text-[11px] text-slate-500">Rank membuka tingkat kesulitan kuis berikutnya.</p>
          </div>
        </div>
      </div>

      <!-- 🌟 KARTU REKOMENDASI BELAJAR AI TUTOR -->
      <div class="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 p-6 sm:p-7 shadow-xs">
        <div class="flex flex-col sm:flex-row items-start gap-4">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white text-2xl shadow-md">
            🤖
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="font-display text-lg font-extrabold text-ink-900">Rekomendasi Belajar AI Tutor</h3>
              <span class="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700">Gemini Powered</span>
            </div>
            <p class="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              "${aiMessage}"
            </p>
            ${recom && recom.weak_topics && recom.weak_topics.length > 0 ? `
              <div class="mt-4 flex flex-wrap items-center gap-2">
                <span class="text-xs font-bold text-amber-700">Perlu Diulang:</span>
                ${recom.weak_topics.map(w => `
                  <button type="button" onclick="window.handleNavClick('quest')" class="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-extrabold text-amber-800 hover:bg-amber-100 transition cursor-pointer">
                    <span>🔄</span>
                    <span>${w.title} (${w.subject})</span>
                  </button>
                `).join('')}
              </div>
            ` : ''}
            ${recom && recom.next_topics && recom.next_topics.length > 0 ? `
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <span class="text-xs font-bold text-indigo-700">Materi Berikutnya:</span>
                ${recom.next_topics.map(n => `
                  <button type="button" onclick="window.handleNavClick('quest')" class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-extrabold text-indigo-800 hover:bg-indigo-100 transition cursor-pointer">
                    <span>📖</span>
                    <span>${n.title} (${n.subject})</span>
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- 3 Kartu Statistik Pembelajaran -->
      <div class="grid gap-5 md:grid-cols-3">
        <div class="rounded-3xl border border-brand-100 bg-white p-5 flex items-center gap-4 shadow-xs">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          </div>
          <div class="flex-1">
            <p class="font-display text-2xl font-extrabold text-ink-900">${totalMateriSelesai} <span class="text-sm font-bold">materi selesai</span></p>
            <p class="text-xs text-slate-500">Tersimpan di akun belajarmu</p>
          </div>
        </div>

        <div class="rounded-3xl border border-brand-100 bg-white p-5 flex items-center gap-4 shadow-xs">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="font-display text-2xl font-extrabold text-ink-900">${totalKuisSelesai} <span class="text-sm font-bold">kuis selesai</span></p>
            <p class="text-xs text-slate-500">Hasil dan pembahasan tersimpan</p>
          </div>
        </div>

        <div class="rounded-3xl border border-brand-100 bg-white p-5 flex items-center gap-4 shadow-xs">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <p class="font-display text-2xl font-extrabold text-ink-900">${avgAccuracy} <span class="text-sm font-bold">rata-rata akurasi</span></p>
            <p class="text-xs text-slate-500">Persentase skor kuis</p>
          </div>
        </div>
      </div>

      <!-- Perkembangan Belajarmu -->
      <div class="space-y-4">
        <div>
          <h2 class="font-display text-2xl font-extrabold text-ink-900">Perkembangan Belajarmu</h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Lihat sejauh mana penguasaan materi di mata pelajaranmu.</p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          ${stats && stats.subject_breakdown && stats.subject_breakdown.length > 0 ? stats.subject_breakdown.map(sb => `
            <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">📚</span>
                  <div>
                    <h3 class="font-display text-base font-extrabold text-ink-900">${sb.subject_name}</h3>
                    <p class="text-xs text-slate-500">${sb.mastery_level}</p>
                  </div>
                </div>
                <div class="mt-4 flex justify-between text-xs font-extrabold text-brand-700">
                  <span>${sb.materials_completed} materi • ${sb.quizzes_taken} kuis</span>
                  <span>${sb.avg_score}%</span>
                </div>
                <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-100">
                  <div class="h-full rounded-full bg-brand-700" style="width: ${Math.min(100, sb.avg_score)}%"></div>
                </div>
              </div>
              <button type="button" onclick="window.handleNavClick('quest')" class="mt-4 w-full rounded-xl bg-brand-700 py-2.5 font-display text-xs font-extrabold text-white hover:bg-brand-600 transition cursor-pointer">
                Lanjutkan Quest
              </button>
            </div>
          `).join('') : `
            <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">🌍</span>
                  <div>
                    <h3 class="font-display text-base font-extrabold text-ink-900">IPS</h3>
                    <p class="text-xs text-slate-500">Interaksi Antarruang</p>
                  </div>
                </div>
                <div class="mt-4 flex justify-between text-xs font-extrabold text-brand-700">
                  <span>Materi kurikulum aktif</span>
                  <span>Siap Belajar</span>
                </div>
              </div>
              <button type="button" onclick="window.handleNavClick('quest')" class="mt-4 w-full rounded-xl bg-brand-700 py-2.5 font-display text-xs font-extrabold text-white hover:bg-brand-600 transition cursor-pointer">
                Lanjutkan Quest
              </button>
            </div>
          `}
        </div>

        <div class="rounded-2xl bg-brand-50/75 border border-brand-100 px-5 py-3.5 flex flex-wrap items-center gap-4 text-xs">
          <div class="flex items-center gap-2">
            ${renderHeartsInline(3, 3, 'w-4 h-4')}
            <span class="font-display font-extrabold text-ink-900 ml-1">Nyawa Petualang 3/3</span>
          </div>
          <span class="text-slate-600">
            Maksimal 3 nyawa; pulih 1 nyawa tiap 1 jam. Materi tetap bisa dibaca kapan saja tanpa batas!
          </span>
        </div>
      </div>

      <!-- Riwayat Kuis -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-display text-xl sm:text-2xl font-extrabold text-ink-900">Riwayat Kuis</h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Tinjau hasilmu dan pelajari kembali pembahasan dari setiap tantangan.</p>
          </div>
          <span class="font-display text-xs font-extrabold text-brand-700">${hasRealHistory ? `${realHistory.length} kuis tercatat` : 'Hasil kuis tersimpan'}</span>
        </div>

        ${hasRealHistory && quizRows.length > 0 ? `
          <div class="rounded-3xl border border-brand-100 bg-white p-4 sm:p-6 shadow-xs overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr class="border-b border-brand-100 text-[11px] font-extrabold text-slate-500">
                  <th class="pb-3 pl-3">Kuis &amp; tanggal</th>
                  <th class="pb-3">Jawaban</th>
                  <th class="pb-3">Skor</th>
                  <th class="pb-3">XP diraih</th>
                  <th class="pb-3">Status</th>
                  <th class="pb-3 text-right pr-3">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-brand-100/70 text-xs sm:text-sm">
                ${quizRows.map(r => `
                  <tr class="${r.highlight ? 'bg-brand-50/70' : ''}">
                    <td class="py-4 pl-3 rounded-l-2xl">
                      <p class="font-display font-extrabold text-ink-900">${r.title}</p>
                      <p class="text-xs text-slate-500 mt-0.5">${r.sub}</p>
                    </td>
                    <td class="py-4 font-bold text-ink-900">${r.ans}</td>
                    <td class="py-4"><span class="font-display text-lg font-extrabold text-ink-900">${r.score}</span><span class="text-xs text-slate-500">/100</span></td>
                    <td class="py-4 font-display font-extrabold text-brand-700">${r.xp}</td>
                    <td class="py-4">
                      <span class="inline-block rounded-full px-3 py-0.5 font-display text-xs font-extrabold ${r.statusClass || 'bg-emerald-50 border border-emerald-200 text-emerald-700'}">
                        ${r.statusText || '✓ Selesai'}
                      </span>
                    </td>
                    <td class="py-4 pr-3 text-right rounded-r-2xl">
                      <button
                        type="button"
                        onclick="window.openQuizScreen(1)"
                        class="rounded-xl border border-brand-600 bg-white px-4 py-2 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer"
                      >
                        Ulangi Kuis
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="mt-4 pt-4 border-t border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 px-2">
              <span>Total ${displayTotalXp.toLocaleString('id-ID')} XP terkumpul dari aktivitas belajarmu.</span>
              <button type="button" onclick="window.openQuizScreen(1)" class="font-display font-extrabold text-brand-700 hover:underline cursor-pointer">
                Mulai Kuis Baru &rarr;
              </button>
            </div>
          </div>
        ` : `
          <div class="rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-8 sm:p-10 text-center">
            <span class="text-4xl">🎯</span>
            <h4 class="mt-3 font-display text-lg font-extrabold text-ink-900">Belum Ada Riwayat Kuis</h4>
            <p class="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Kamu belum menyelesaikan kuis apapun. Ayo mulai petualangan pertamamu di tab Kuis untuk mencatat skor dan mengumpulkan XP!
            </p>
            <button
              type="button"
              onclick="window.handleNavClick('kuis')"
              class="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer"
            >
              <span>⚔️</span>
              <span>Mulai Kuis Pertama</span>
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}

// ==========================================================
// 3. ALUR KUIS 3 NYAWA (9 LAYAR INTERAKTIF PETUALANG LAMA)
// Sesuai file 01 s.d. 09 di dalam Edu Quest (10).zip
// ==========================================================
function openQuizScreen(screenStep = 1, returnTab = null) {
  if (returnTab) {
    appState.quizReturnTab = returnTab;
  } else if (!appState.inQuizSession) {
    const prev = appState.activeTab;
    appState.quizReturnTab = (prev && prev !== 'kuis') ? prev : 'beranda';
  }
  appState.inMaterialReader = false;
  appState.inQuizSession = true;
  appState.quizScreenStep = screenStep;

  // Nyawa dan XP dinamis mengikuti alur simulasi kuis
  if (screenStep === 1 || screenStep === 2) {
    appState.quizQ1Selected = null;
    appState.quizLives = appState.user.ipsLives || 3;
  } else if (screenStep === 3) {
    appState.quizQ1Selected = appState.quizQ1Selected || 'A';
  } else if (screenStep === 4) {
    appState.quizQ1Selected = 'A';
    appState.quizLives = 2;
  } else if (screenStep === 5) {
    appState.quizLives = 1;
  } else if (screenStep === 9) {
    appState.quizLives = 0;
  }

  syncUserUI();
  updateMainViews();
  renderQuizSessionView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.openQuizScreen = openQuizScreen;

function exitQuizSession() {
  appState.inQuizSession = false;
  const targetTab = appState.quizReturnTab || 'beranda';
  appState.activeTab = targetTab;
  setNavbarActiveTab(targetTab);
  updateMainViews();
  if (targetTab === 'profil-saya') {
    renderProfilSayaPage();
  } else if (targetTab === 'quest') {
    renderQuestHeaderView();
    renderBabCatalog();
  } else if (targetTab === 'ai-tutor') {
    renderAiTutorPage();
  } else if (targetTab === 'beranda') {
    if (!appState.isNewUser) {
      renderOldUserBeranda();
    } else {
      renderRankEmblemsShowcase();
    }
  }
  syncUserUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.exitQuizSession = exitQuizSession;

function selectQuizQ1Option(opt) {
  appState.quizQ1Selected = opt;
  if (appState.quizScreenStep === 2) {
    appState.quizScreenStep = 3;
  }
  renderQuizSessionView();
}
window.selectQuizQ1Option = selectQuizQ1Option;

function checkQuizQ1Answer() {
  const sel = appState.quizQ1Selected || 'A';
  if (appState.quizScreenStep === 2 || appState.quizScreenStep === 3) {
    if (sel === 'B') {
      // Jika langsung pilih B (6 km), lompat ke Soal 02
      openQuizScreen(6);
      showToast('Jawaban Benar! (+8 XP)', 'Jarak sebenarnya adalah 6 km.', '🎉');
    } else {
      // Salah pertama -> kurangi 1 nyawa menjadi 2/3 (Layar 04)
      openQuizScreen(4);
      showToast('Nyawa IPS Berkurang 1 (Sisa 2/3)', 'Jawaban belum tepat. Kamu masih punya 1 kesempatan lagi di soal ini!', '💔');
    }
  } else if (appState.quizScreenStep === 4) {
    if (sel === 'B') {
      openQuizScreen(6);
      showToast('Jawaban Benar! (+8 XP)', 'Bagus! Percobaan keduamu tepat.', '🎉');
    } else {
      // Salah kedua -> kurangi 1 nyawa lagi menjadi 1/3 (Layar 05)
      openQuizScreen(5);
      showToast('Dua Percobaan Habis (Sisa 1/3 ❤️)', 'Kunci jawaban: B. 6 km. Lanjutkan ke soal berikutnya.', '💔');
    }
  }
}
window.checkQuizQ1Answer = checkQuizQ1Answer;

function selectQuizReviewQuestion(num) {
  appState.quizReviewQuestionNum = num;
  renderQuizSessionView();
}
window.selectQuizReviewQuestion = selectQuizReviewQuestion;

function submitQuizAiPrompt(event) {
  if (event) event.preventDefault();
  const inp = document.getElementById('quiz-ai-input-field');
  if (!inp || !inp.value.trim()) return;
  appState.quizAiCustomPrompt = inp.value.trim();
  inp.value = '';
  renderQuizSessionView();
}
window.submitQuizAiPrompt = submitQuizAiPrompt;

function renderQuizSessionView() {
  const container = document.getElementById('view-quiz-runner');
  if (!container) return;

  const u = appState.user;
  const shortName = getShortName(u.fullName);
  const jenjangText = `${u.jenjangDisplay || JENJANG_LABEL[u.jenjang] || u.jenjang} • ${u.kelas}`;
  const mascotSrc = window.EDUQUEST_ASSETS?.mascot || '';
  const goldSrc = window.EDUQUEST_ASSETS?.[getRankAssetKey(u.rank)] || '';
  const step = appState.quizScreenStep;
  const returnLabelMap = {
    'beranda': 'Beranda',
    'quest': 'Quest',
    'ai-tutor': 'AI Tutor',
    'profil-saya': 'Profil Saya'
  };
  const returnLabel = returnLabelMap[appState.quizReturnTab] || 'Quest';

  const displayTotalXp = u.totalXp || 0;
  const displayCurrXp = u.xp || 0;
  const displayNextXp = u.nextLevelXp || 100;
  const xpPct = displayNextXp > 0 ? Math.min(100, Math.round((displayCurrXp / displayNextXp) * 100)) : 0;
  const remXp = Math.max(0, displayNextXp - displayCurrXp);

  // Navigasi simulasi debug dinonaktifkan di production agar tampilan bersih sesuai hasil kuis
  const stepperNavHtml = '';

  // Helper Segmented 10-question bar
  function render10Segments(filledCount) {
    let segs = '';
    for (let i = 1; i <= 10; i++) {
      segs += `<div class="h-1.5 flex-1 rounded-full ${i <= filledCount ? 'bg-brand-700' : 'bg-brand-100'}"></div>`;
    }
    return `<div class="mt-2.5 flex items-center gap-1.5">${segs}</div>`;
  }

  let bodyHtml = '';

  if (step === 1) {
    // LAYAR 01: Persiapan Kuis
    bodyHtml = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Peta dan Letak Wilayah</p>
          <button type="button" onclick="window.exitQuizSession()" class="text-xs font-extrabold text-slate-500 hover:text-brand-700 cursor-pointer">
            &larr; Kembali ke ${returnLabel}
          </button>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-ink-900">Siap melanjutkan petualangan, ${shortName}?</h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">Uji pemahamanmu setelah mempelajari materi. Baca panduan singkat sebelum mulai.</p>
          </div>
          <span class="self-start inline-flex items-center rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">
            ${jenjangText}
          </span>
        </div>

        <div class="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
          <!-- Kiri -->
          <div class="space-y-6">
            <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div class="flex items-start gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 border border-brand-100 text-2xl">🌍</div>
                <div>
                  <span class="inline-block rounded-full bg-brand-100 px-3 py-0.5 font-display text-xs font-extrabold text-brand-700">IPS • Tingkat Sedang</span>
                  <h2 class="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-ink-900">Peta dan Letak Wilayah</h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">${jenjangText} • Peta dan Wilayah</p>
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-3">
                <div class="rounded-2xl bg-brand-50/60 p-4">
                  <p class="font-display text-2xl font-extrabold text-ink-900">10 soal</p>
                  <p class="text-xs text-slate-500 mt-0.5">Pilihan ganda</p>
                </div>
                <div class="rounded-2xl bg-brand-50/60 p-4">
                  <p class="font-display text-2xl font-extrabold text-brand-700">80 XP</p>
                  <p class="text-xs text-slate-500 mt-0.5">Maksimal XP sesi</p>
                </div>
                <div class="rounded-2xl bg-brand-50/60 p-4">
                  <p class="font-display text-2xl font-extrabold text-ink-900">Bronze</p>
                  <p class="text-xs text-slate-500 mt-0.5">Rank minimum</p>
                </div>
              </div>

              <div class="rounded-2xl bg-emerald-50/80 border border-emerald-200/80 p-4">
                <p class="font-display text-sm font-extrabold text-emerald-800">✓ Semua prasyarat terpenuhi</p>
                <p class="text-xs sm:text-sm text-slate-600 mt-1">Prasyarat tantangan siap. Rank ${u.rank} kamu memenuhi ketentuan petualangan ini.</p>
              </div>
            </div>

            <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <h3 class="font-display text-xl font-extrabold text-ink-900">Kenali aturan tantangannya</h3>
              <div class="space-y-4">
                <div class="flex items-start gap-3.5">
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 text-sm">💡</span>
                  <div>
                    <h4 class="font-display text-sm font-extrabold text-ink-900">2 percobaan per soal</h4>
                    <p class="text-xs text-slate-500 mt-0.5">Pilih jawaban, lalu periksa. Kesempatan kedua tersedia jika nyawa masih ada.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3.5">
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 text-sm">💡</span>
                  <div>
                    <h4 class="font-display text-sm font-extrabold text-ink-900">Salah mengurangi 1 nyawa IPS</h4>
                    <p class="text-xs text-slate-500 mt-0.5">Nyawa berkurang setelah jawaban diperiksa. Saat habis, kuis berhenti.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3.5">
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 text-sm">💡</span>
                  <div>
                    <h4 class="font-display text-sm font-extrabold text-ink-900">1 nyawa pulih tiap 1 jam</h4>
                    <p class="text-xs text-slate-500 mt-0.5">Maksimal 3 nyawa per mapel. Membaca materi tetap bisa saat nyawa habis.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3.5">
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 text-sm">💡</span>
                  <div>
                    <h4 class="font-display text-sm font-extrabold text-ink-900">8 XP per jawaban benar</h4>
                    <p class="text-xs text-slate-500 mt-0.5">Maksimal 80 XP dari 10 soal. Tidak ada batas waktu pengerjaan.</p>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-brand-100 flex items-center justify-between gap-4">
                <button type="button" onclick="window.exitQuizSession()" class="font-display text-xs sm:text-sm font-extrabold text-brand-700 hover:underline cursor-pointer">
                  &larr; Kembali ke ${returnLabel}
                </button>
                <button
                  type="button"
                  onclick="window.openQuizScreen(2)"
                  class="rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer"
                >
                  Mulai Kuis &rarr;
                </button>
              </div>
            </div>
          </div>

          <!-- Kanan -->
          <div class="space-y-4">
            <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs space-y-4">
              <div class="flex items-center gap-3.5">
                <img src="${goldSrc}" alt="${u.rank}" class="w-11 h-11 object-contain shrink-0" />
                <div>
                  <h3 class="font-display text-base font-extrabold text-ink-900">${u.fullName}</h3>
                  <p class="text-xs text-slate-500">Level ${u.level} • Rank ${u.rank}</p>
                </div>
              </div>

              <div class="rounded-2xl border border-brand-100 bg-brand-50/60 p-4 space-y-2.5">
                <div class="flex items-center justify-between text-[11px] font-display font-extrabold">
                  <span class="text-ink-900">Level ${u.level} • ${u.rank}</span>
                  <span class="text-brand-700">${displayTotalXp} XP • ${displayCurrXp}/${displayNextXp} ke Lv. ${u.level + 1}</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
                  <div class="h-full rounded-full bg-brand-700" style="width: ${xpPct}%"></div>
                </div>
                <div class="flex items-center justify-between pt-1 text-xs">
                  <div class="flex items-center gap-1">${renderHeartsInline(3, 3, 'w-3.5 h-3.5')}</div>
                  <span class="font-display font-extrabold text-ink-900">Nyawa IPS 3/3</span>
                </div>
              </div>

              <p class="text-xs text-slate-600 leading-relaxed">
                ${displayCurrXp}/${displayNextXp} XP • ${xpPct}% ke Level ${u.level + 1}<br>
                Sisa ${remXp} XP menuju Level ${u.level + 1}.
              </p>

              <div class="pt-3 border-t border-brand-100">
                <div class="flex items-center justify-between">
                  <span class="font-display text-xs font-extrabold text-ink-900">Nyawa IPS</span>
                  <span class="rounded-full bg-brand-100 px-2.5 py-0.5 font-display text-xs font-extrabold text-brand-700">3/3</span>
                </div>
                <div class="mt-2 flex items-center gap-1.5">
                  ${renderHeartsInline(3, 3, 'w-6 h-6')}
                </div>
                <p class="mt-2 text-xs text-slate-600">Penuh. Siap untuk tantangan ini.</p>
                <p class="text-[11px] text-slate-400 mt-0.5">Terpisah per mata pelajaran • Maks. 3</p>
              </div>
            </div>

            <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs space-y-3">
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">🌍</span>
                <div>
                  <h4 class="font-display text-base font-extrabold text-ink-900">IPS</h4>
                  <p class="text-xs font-bold text-brand-700">Peta dan Letak Wilayah</p>
                </div>
              </div>
              <div class="flex justify-between text-xs font-extrabold ${Object.keys(appState.completedMaterials || {}).length > 0 ? 'text-brand-700' : 'text-slate-500'} pt-1">
                <span>${Object.keys(appState.completedMaterials || {}).length > 0 ? 'Materi terkait selesai' : 'Materi pengantar'}</span>
                <span>${Object.keys(appState.completedMaterials || {}).length > 0 ? '100%' : '0%'}</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full ${Object.keys(appState.completedMaterials || {}).length > 0 ? 'bg-emerald-100' : 'bg-slate-100'}">
                <div class="h-full rounded-full ${Object.keys(appState.completedMaterials || {}).length > 0 ? 'w-full bg-emerald-700' : 'w-0 bg-brand-700'}"></div>
              </div>
              <button
                type="button"
                onclick="window.openMaterialPage('bab-01', 'mat-1-1', 1)"
                class="mt-2 w-full rounded-xl border-2 border-brand-700 py-2.5 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer"
              >
                ${Object.keys(appState.completedMaterials || {}).length > 0 ? 'Baca Ulang Materi' : 'Pelajari Materi Terkait'}
              </button>
              >
                Baca Ulang Materi
              </button>
            </div>

            <div class="flex items-center gap-3.5 px-2 pt-1">
              <img src="${mascotSrc}" alt="Maskot" class="w-12 h-12 object-contain shrink-0" />
              <p class="text-xs text-slate-600 leading-relaxed">
                Tidak perlu terburu-buru. Pahami soal, lalu tentukan jawabanmu.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (step === 2 || step === 3 || step === 4 || step === 5) {
    // LAYAR 02, 03, 04, 05: Soal 01 / 10 (Menghitung jarak sebenarnya)
    const isStep2 = step === 2;
    const isStep3 = step === 3;
    const isStep4 = step === 4;
    const isStep5 = step === 5;

    const lives = isStep2 || isStep3 ? 3 : isStep4 ? 2 : 1;
    const doneCount = isStep5 ? 1 : 0;
    const donePct = isStep5 ? '10%' : '0%';
    const attemptsUsed = isStep2 || isStep3 ? 0 : isStep4 ? 1 : 2;
    const selOpt = appState.quizQ1Selected || (isStep3 ? 'A' : null);

    const subHeaderMsg = isStep2
      ? 'Baca soal dengan teliti, lalu pilih jawaban yang paling tepat.'
      : isStep3
      ? 'Sudah yakin dengan pilihanmu? Periksa untuk melihat hasilnya.'
      : isStep4
      ? 'Belum tepat bukan berarti berhenti. Gunakan petunjuk, lalu coba sekali lagi.'
      : 'Soal pertama sudah selesai. Pelajari pembahasannya sebelum melanjutkan.';

    const q1Opts = [
      { code: 'A', label: '600 m' },
      { code: 'B', label: '6 km' },
      { code: 'C', label: '60 km' },
      { code: 'D', label: '600 km' }
    ];

    const optionsHtml = q1Opts.map(o => {
      if (isStep5) {
        if (o.code === 'A') {
          return `
            <div class="rounded-2xl border-2 border-[#b91c47] bg-rose-50/40 px-4 py-3.5 flex items-center justify-between">
              <div class="flex items-center gap-3.5">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#b91c47] text-white font-display text-xs font-extrabold">A</span>
                <span class="font-display text-sm sm:text-base font-extrabold text-ink-900">${o.label}</span>
              </div>
              <span class="font-display text-xs font-extrabold text-[#b91c47]">Salah • Percobaan 1</span>
            </div>
          `;
        }
        if (o.code === 'B') {
          return `
            <div class="rounded-2xl border-2 border-emerald-700 bg-emerald-50/50 px-4 py-3.5 flex items-center justify-between">
              <div class="flex items-center gap-3.5">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white font-display text-xs font-extrabold">B</span>
                <span class="font-display text-sm sm:text-base font-extrabold text-ink-900">${o.label}</span>
              </div>
              <span class="font-display text-xs font-extrabold text-emerald-800">✓ Jawaban benar</span>
            </div>
          `;
        }
        if (o.code === 'C') {
          return `
            <div class="rounded-2xl border-2 border-[#b91c47] bg-rose-50/40 px-4 py-3.5 flex items-center justify-between">
              <div class="flex items-center gap-3.5">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#b91c47] text-white font-display text-xs font-extrabold">C</span>
                <span class="font-display text-sm sm:text-base font-extrabold text-ink-900">${o.label}</span>
              </div>
              <span class="font-display text-xs font-extrabold text-[#b91c47]">Salah • Percobaan 2</span>
            </div>
          `;
        }
        return `
          <div class="rounded-2xl border border-brand-100 bg-white px-4 py-3.5 flex items-center gap-3.5 opacity-60">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-ink-900 font-display text-xs font-extrabold">D</span>
            <span class="font-display text-sm sm:text-base font-semibold text-slate-500">${o.label}</span>
          </div>
        `;
      }

      if (isStep4 && o.code === 'A') {
        return `
          <div class="rounded-2xl border-2 border-[#b91c47] bg-rose-50/40 px-4 py-3.5 flex items-center justify-between">
            <div class="flex items-center gap-3.5">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#b91c47] text-white font-display text-xs font-extrabold">A</span>
              <span class="font-display text-sm sm:text-base font-extrabold text-ink-900">${o.label}</span>
            </div>
            <span class="font-display text-xs font-extrabold text-[#b91c47]">Salah • Percobaan 1</span>
          </div>
        `;
      }

      const isSelected = selOpt === o.code && !(isStep4 && o.code === 'A');
      return `
        <button
          type="button"
          onclick="window.selectQuizQ1Option('${o.code}')"
          class="w-full text-left rounded-2xl px-4 py-3.5 transition flex items-center justify-between cursor-pointer ${
            isSelected
              ? 'border-2 border-brand-700 bg-brand-50/80 shadow-2xs'
              : 'border border-brand-100 bg-white hover:bg-brand-50/40'
          }"
        >
          <div class="flex items-center gap-3.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-extrabold ${
              isSelected ? 'bg-brand-700 text-white' : 'bg-brand-50 text-ink-900'
            }">${o.code}</span>
            <span class="font-display text-sm sm:text-base ${isSelected ? 'font-extrabold text-ink-900' : 'font-semibold text-ink-900'}">${o.label}</span>
          </div>
          ${isSelected ? `<span class="font-display text-xs font-extrabold text-brand-700">Dipilih</span>` : ''}
        </button>
      `;
    }).join('');

    bodyHtml = `
      <div class="space-y-6">
        <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Peta dan Letak Wilayah</p>
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-ink-900">Peta dan Letak Wilayah</h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">${subHeaderMsg}</p>
          </div>
          <span class="self-start inline-flex items-center rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">
            ${jenjangText}
          </span>
        </div>

        <!-- Bar Progres 10 Soal & Nyawa IPS -->
        <div class="rounded-3xl border border-brand-100 bg-white px-6 py-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center justify-between text-xs font-display font-extrabold">
              <span class="text-ink-900">${doneCount} dari 10 soal terselesaikan</span>
              <span class="text-brand-700">${donePct}</span>
            </div>
            ${render10Segments(doneCount)}
          </div>
          <div class="flex items-center gap-6 md:pl-6 md:border-l border-brand-100">
            <div>
              <div class="flex items-center gap-1.5">
                ${renderHeartsInline(lives, 3, 'w-4 h-4')}
                <span class="font-display text-sm font-extrabold text-[#b91c47] ml-1">${lives}/3</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-0.5">Nyawa IPS</p>
            </div>
            <div class="pl-4 border-l border-brand-100">
              <p class="font-display text-lg font-extrabold text-brand-700">+0 XP</p>
              <p class="text-[11px] text-slate-500">Sesi ini</p>
            </div>
          </div>
        </div>

        <!-- Grid Soal & Sidebar -->
        <div class="grid gap-6 lg:grid-cols-[1fr_330px] items-start">
          <!-- Kartu Soal Kiri -->
          <div class="space-y-4">
            <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <div class="flex items-center justify-between">
                <span class="rounded-full bg-brand-100/90 px-3.5 py-1 font-display text-xs font-extrabold text-brand-700">SOAL 01 / 10</span>
                <span class="text-xs font-extrabold text-slate-500">${attemptsUsed} dari 2 percobaan terpakai</span>
              </div>

              <div>
                <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-ink-900">Menghitung jarak sebenarnya</h2>
                <p class="mt-2.5 text-sm sm:text-base text-ink-900 leading-relaxed">
                  Sebuah peta memiliki skala 1 : 200.000. Jarak dua lokasi pada peta adalah 3 cm. Berapa jarak sebenarnya antara kedua lokasi tersebut?
                </p>
              </div>

              <!-- Kotak Ilustrasi Jarak P — Q & Skala Peta -->
              <div class="rounded-2xl bg-brand-50/75 border border-brand-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-xs font-extrabold text-brand-700">P</span>
                    <div class="flex-1 h-0.5 bg-brand-300 relative flex items-center justify-center">
                      <span class="bg-brand-50 px-2 font-display text-xs font-extrabold text-brand-700">3 cm</span>
                    </div>
                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-xs font-extrabold text-brand-700">Q</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-2">Ilustrasi jarak dua lokasi pada peta</p>
                </div>
                <div class="sm:pl-6 sm:border-l border-brand-200/60">
                  <p class="text-xs text-slate-500">Skala peta</p>
                  <p class="font-display text-xl font-extrabold text-ink-900">1 : 200.000</p>
                </div>
              </div>

              <!-- Opsi Jawaban -->
              <div class="space-y-3">
                ${optionsHtml}
              </div>

              <!-- Kotak Feedback di Step 4 atau Step 5 -->
              ${
                isStep4
                  ? `<div class="rounded-2xl bg-[#fef7ec] border border-amber-200/80 p-5">
                       <h4 class="font-display text-sm font-extrabold text-[#9a5b13]">Belum tepat. Kamu masih punya 1 kesempatan.</h4>
                       <p class="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                         Jawaban A sudah diperiksa: nyawa IPS berkurang 1 menjadi 2/3. Pilih jawaban lain untuk mencoba lagi; soal ini belum selesai.
                       </p>
                     </div>`
                  : ''
              }
              ${
                isStep5
                  ? `<div class="rounded-2xl bg-rose-50/70 border border-rose-200 p-5">
                       <h4 class="font-display text-sm font-extrabold text-[#b91c47]">Dua percobaan habis • Soal selesai salah</h4>
                       <p class="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                         Jawaban C juga belum tepat. Nyawa IPS kini 1/3. Kunci: B, 6 km.<br>
                         3 × 200.000 cm = 600.000 cm = 6 km. Dari cm ke km, bagi 100.000. Semua pilihan terkunci; tidak ada percobaan ketiga.
                       </p>
                     </div>`
                  : ''
              }

              <!-- Footer Aksi Soal -->
              <div class="pt-4 border-t border-brand-100 flex items-center justify-between gap-4">
                <span class="text-xs text-slate-500">
                  ${
                    isStep2
                      ? 'Pilih satu jawaban terlebih dahulu.'
                      : isStep3
                      ? 'Pilihanmu belum diperiksa.'
                      : isStep4
                      ? 'Pilih jawaban baru untuk melanjutkan.'
                      : 'Jawaban tersimpan • Tidak bisa diubah'
                  }
                </span>
                ${
                  isStep5
                    ? `<button
                         type="button"
                         onclick="window.openQuizScreen(6)"
                         class="rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer"
                       >
                         Soal Berikutnya &rarr;
                       </button>`
                    : isStep3 || (isStep4 && selOpt && selOpt !== 'A')
                    ? `<button
                         type="button"
                         onclick="window.checkQuizQ1Answer()"
                         class="rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer"
                       >
                         ${isStep4 ? 'Periksa lagi' : 'Periksa Jawaban'}
                       </button>`
                    : `<button
                         type="button"
                         onclick="window.openQuizScreen(${isStep2 ? 3 : 5})"
                         class="rounded-2xl bg-slate-200 px-6 py-3 font-display text-sm font-extrabold text-slate-500 hover:bg-slate-300 transition cursor-pointer"
                       >
                         ${isStep4 ? 'Periksa lagi' : 'Periksa Jawaban'}
                       </button>`
                }
              </div>
            </div>

            <div class="flex items-center gap-4 px-2 text-xs">
              <button type="button" onclick="window.exitQuizSession()" class="font-display font-extrabold text-brand-700 hover:underline cursor-pointer">
                &larr; Keluar dari Kuis
              </button>
              <span class="text-slate-400">IPS • Peta dan Letak Wilayah • Tingkat Sedang</span>
            </div>
          </div>

          <!-- Sidebar Kanan -->
          <div class="space-y-4">
            <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="font-display text-xs font-extrabold text-ink-900">Nyawa IPS</span>
                <span class="rounded-full ${lives === 1 ? 'bg-rose-50 text-[#b91c47]' : 'bg-brand-100 text-brand-700'} px-2.5 py-0.5 font-display text-xs font-extrabold">${lives}/3</span>
              </div>
              <div class="mt-2.5 flex items-center gap-1.5">
                ${renderHeartsInline(lives, 3, 'w-6 h-6')}
              </div>
              <p class="mt-2.5 text-xs text-slate-600">
                ${lives === 3 ? 'Penuh. Siap untuk tantangan ini.' : 'Pulih 1 nyawa tiap 1 jam.'}
              </p>
              <p class="text-[11px] text-slate-400 mt-0.5">Terpisah per mata pelajaran • Maks. 3</p>
            </div>

            ${
              isStep4
                ? `<!-- AI Tutor & Petunjuk Materi di Step 4 -->
                   <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs space-y-3.5">
                     <div class="flex items-center justify-between">
                       <div class="flex items-center gap-3">
                         <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-lg">🦉</div>
                         <div>
                           <h4 class="font-display text-sm font-extrabold text-ink-900">AI Tutor</h4>
                           <p class="text-xs font-extrabold text-emerald-700">Petunjuk bertahap</p>
                         </div>
                       </div>
                       <span class="text-slate-400 text-xs">✕</span>
                     </div>

                     <div class="rounded-2xl bg-brand-700 p-3.5 text-xs text-white leading-relaxed">
                       Aku memilih 600 m. Apa yang perlu kuperhatikan?
                     </div>

                     <div class="rounded-2xl border border-brand-100 p-4 space-y-2 text-xs text-ink-900 leading-relaxed">
                       <p>1. Perhatikan satuannya. Jarak pada peta ditulis dalam cm. Satuan apa yang diperoleh setelah dikalikan skala?</p>
                       <p>2. Ingat hubungan satuan. Ada 100 cm dalam 1 m dan 1.000 m dalam 1 km.</p>
                       <p class="font-semibold text-brand-700">3. Hitung dalam cm dahulu, lalu ubah ke km. Periksa kembali jumlah nol sebelum memilih.</p>
                     </div>

                     <form onsubmit="window.submitQuizAiPrompt(event)" class="flex items-center gap-2 rounded-2xl border border-brand-100 pl-3.5 pr-1.5 py-1.5">
                       <input id="quiz-ai-input-field" type="text" placeholder="Tanya langkah yang membingungkan..." class="w-full text-xs outline-none" />
                       <button type="submit" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white cursor-pointer">&uarr;</button>
                     </form>
                   </div>
                   <p class="text-[11px] text-slate-400 px-1">AI bisa keliru. Cocokkan dengan materi atau tanyakan kepada guru.</p>
                   <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs space-y-2.5">
                     <div class="flex items-center gap-2 font-display text-sm font-extrabold text-ink-900">
                       <span class="text-[#9a5b13]">💡</span>
                       <span>Petunjuk materi • Tanpa AI</span>
                     </div>
                     <p class="text-xs text-slate-600 leading-relaxed">
                       Kalikan jarak pada peta dengan penyebut skala. Hasilnya masih dalam cm. Samakan satuan sebelum membandingkan pilihan.
                     </p>
                     <button type="button" onclick="window.openMaterialPage('bab-01', 'mat-1-2', 1)" class="font-display text-xs font-extrabold text-brand-700 hover:underline cursor-pointer">
                       Buka konsep skala &amp; satuan &rarr;
                     </button>
                     <p class="text-[11px] text-slate-400">Tetap tersedia jika AI tidak bisa digunakan.</p>
                   </div>`
                : isStep5
                ? `<div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs space-y-3">
                     <div class="flex items-center gap-3">
                       <img src="${mascotSrc}" alt="Maskot" class="w-12 h-12 object-contain shrink-0" />
                       <h4 class="font-display text-base font-extrabold text-ink-900">Teruskan petualanganmu</h4>
                     </div>
                     <p class="text-xs text-slate-600 leading-relaxed">
                       Tidak apa-apa, sekarang kamu tahu letak kekeliruannya. Terapkan pemahaman ini pada soal berikutnya.
                     </p>
                     <span class="inline-block rounded-full bg-rose-50 px-3 py-1 font-display text-xs font-extrabold text-[#b91c47]">
                       Soal 01 • 0 XP
                     </span>
                   </div>`
                : `<div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs space-y-3.5">
                     <div class="flex items-center gap-3">
                       <img src="${mascotSrc}" alt="Maskot" class="w-12 h-12 object-contain shrink-0" />
                       <h4 class="font-display text-base font-extrabold text-ink-900">Pahami, pilih, periksa</h4>
                     </div>
                     <p class="text-xs text-slate-600 leading-relaxed">
                       Nyawa tidak berkurang saat memilih. Jawaban baru dinilai setelah kamu menekan Periksa Jawaban.
                     </p>
                     <button type="button" onclick="window.openQuizScreen(4)" class="block font-display text-xs font-extrabold text-brand-700 hover:underline cursor-pointer">
                       ☼ Buka Petunjuk Materi
                     </button>
                     <button type="button" onclick="window.openQuizScreen(4)" class="block font-display text-xs font-extrabold text-brand-700 hover:underline cursor-pointer">
                       Tanya AI Tutor &rarr;
                     </button>
                     <p class="text-[11px] text-slate-400 leading-relaxed pt-1">
                       Petunjuk bertahap, bukan kunci jawaban. Petunjuk materi tetap tersedia tanpa AI.
                     </p>
                   </div>`
            }
          </div>
        </div>
      </div>
    `;
  } else if (step === 6) {
    // LAYAR 06: Soal 02 • Jawaban Benar (+8 XP, Nyawa Dinamis)
    const step6Lives = Math.max(1, appState.quizLives ?? 2);
    const step6BadgeClass = step6Lives === 1 ? 'bg-rose-50 text-[#b91c47]' : 'bg-brand-100 text-brand-700';
    bodyHtml = `
      <div class="space-y-6">
        <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Peta dan Letak Wilayah</p>
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-ink-900">Peta dan Letak Wilayah</h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">Bagus, ${shortName}! Pemahaman arah mata anginmu sudah tepat.</p>
          </div>
          <span class="self-start inline-flex items-center rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">
            ${jenjangText}
          </span>
        </div>

        <div class="rounded-3xl border border-brand-100 bg-white px-6 py-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center justify-between text-xs font-display font-extrabold">
              <span class="text-ink-900">2 dari 10 soal terselesaikan</span>
              <span class="text-brand-700">20%</span>
            </div>
            ${render10Segments(2)}
          </div>
          <div class="flex items-center gap-6 md:pl-6 md:border-l border-brand-100">
            <div>
              <div class="flex items-center gap-1.5">
                ${renderHeartsInline(step6Lives, 3, 'w-4 h-4')}
                <span class="font-display text-sm font-extrabold ${step6Lives === 1 ? 'text-[#b91c47]' : 'text-brand-700'} ml-1">${step6Lives}/3</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-0.5">Nyawa IPS</p>
            </div>
            <div class="pl-4 border-l border-brand-100">
              <p class="font-display text-lg font-extrabold text-brand-700">+8 XP</p>
              <p class="text-[11px] text-slate-500">Sesi ini</p>
            </div>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-[1fr_330px] items-start">
          <div class="space-y-4">
            <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <div class="flex items-center justify-between">
                <span class="rounded-full bg-brand-100/90 px-3.5 py-1 font-display text-xs font-extrabold text-brand-700">SOAL 02 / 10</span>
                <span class="text-xs font-extrabold text-slate-500">1 dari 2 percobaan terpakai</span>
              </div>

              <div>
                <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-ink-900">Membaca arah mata angin</h2>
                <p class="mt-2.5 text-sm sm:text-base text-ink-900 leading-relaxed">
                  Arah utara pada peta mengarah ke atas. Pasar terletak di sebelah kanan sekolah. Pasar berada di arah ...
                </p>
              </div>

              <!-- Ilustrasi Arah Mata Angin -->
              <div class="rounded-2xl bg-brand-50/75 border border-brand-100 p-5 flex items-center gap-4">
                <span class="font-display text-lg font-extrabold text-brand-700 shrink-0">&uarr; U</span>
                <span class="rounded-full bg-white border border-brand-100 px-3.5 py-1 font-display text-xs font-extrabold text-brand-700">Sekolah</span>
                <div class="flex-1 h-0.5 bg-brand-300"></div>
                <span class="rounded-full bg-white border border-brand-100 px-3.5 py-1 font-display text-xs font-extrabold text-brand-700">Pasar</span>
              </div>

              <div class="space-y-3">
                <div class="rounded-2xl border border-brand-100 bg-white px-4 py-3.5 flex items-center gap-3.5 opacity-60">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 font-display text-xs font-extrabold">A</span>
                  <span class="font-display text-sm sm:text-base font-semibold text-slate-600">Barat</span>
                </div>
                <div class="rounded-2xl border-2 border-emerald-700 bg-emerald-50/50 px-4 py-3.5 flex items-center justify-between">
                  <div class="flex items-center gap-3.5">
                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-white font-display text-xs font-extrabold">B</span>
                    <span class="font-display text-sm sm:text-base font-extrabold text-ink-900">Timur</span>
                  </div>
                  <span class="font-display text-xs font-extrabold text-emerald-800">✓ Jawaban benar</span>
                </div>
                <div class="rounded-2xl border border-brand-100 bg-white px-4 py-3.5 flex items-center gap-3.5 opacity-60">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 font-display text-xs font-extrabold">C</span>
                  <span class="font-display text-sm sm:text-base font-semibold text-slate-600">Utara</span>
                </div>
                <div class="rounded-2xl border border-brand-100 bg-white px-4 py-3.5 flex items-center gap-3.5 opacity-60">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 font-display text-xs font-extrabold">D</span>
                  <span class="font-display text-sm sm:text-base font-semibold text-slate-600">Selatan</span>
                </div>
              </div>

              <div class="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-5">
                <h4 class="font-display text-sm font-extrabold text-emerald-800">Tepat sekali! +8 XP</h4>
                <p class="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  B, Timur. Saat utara mengarah ke atas, sebelah kanan peta adalah timur. Percobaan tepat; sisa nyawa IPS ${step6Lives}/3.
                </p>
              </div>

              <div class="pt-4 border-t border-brand-100 flex flex-wrap items-center justify-between gap-3">
                <span class="text-xs text-slate-500">Jawaban tersimpan • Tidak bisa diubah</span>
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    onclick="window.exitQuizSession()"
                    class="font-display text-xs font-extrabold text-brand-700 hover:underline cursor-pointer"
                  >
                    &larr; Keluar dari Kuis
                  </button>
                  <button
                    type="button"
                    onclick="window.openQuizScreen(7)"
                    class="rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer"
                  >
                    Selesaikan Kuis &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-display text-xs font-extrabold text-ink-900">Nyawa IPS</span>
                <span class="rounded-full ${step6BadgeClass} px-2.5 py-0.5 font-display text-xs font-extrabold">${step6Lives}/3</span>
              </div>
              <div class="flex items-center gap-1.5">
                ${renderHeartsInline(step6Lives, 3, 'w-6 h-6')}
              </div>
              <p class="text-xs text-slate-600">Pulih 1 nyawa tiap 1 jam.</p>
              <p class="text-[11px] text-slate-400">Terpisah per mata pelajaran • Maks. 3</p>
              <span class="inline-block rounded-full bg-emerald-50 px-3 py-1 font-display text-xs font-extrabold text-emerald-800">
                1 benar • +8 XP sesi
              </span>
            </div>
              </span>
            </div>

            <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs space-y-3">
              <div class="flex items-center gap-3">
                <img src="${mascotSrc}" alt="Maskot" class="w-12 h-12 object-contain shrink-0" />
                <h4 class="font-display text-base font-extrabold text-ink-900">Teruskan petualanganmu</h4>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Pemahaman materi Peta dan Letak Wilayahmu sudah sangat baik. Lanjutkan untuk melihat hasil akhir tantangan ini!
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (step === 7) {
    // LAYAR 07: Hasil Kuis Selesai • Cabang Utama
    const step7Lives = Math.max(1, appState.quizLives ?? 2);
    const step7BadgeClass = step7Lives === 1 ? 'bg-rose-50 text-[#b91c47]' : 'bg-brand-100 text-brand-700';
    const step7Lost = 3 - step7Lives;
    bodyHtml = `
      <div class="space-y-6">
        <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Peta dan Letak Wilayah</p>
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-ink-900">Tantangan selesai. Hebat, ${shortName}!</h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">Peta dan Letak Wilayah • IPS • Tingkat Sedang</p>
          </div>
          <span class="self-start inline-flex items-center rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">
            ${jenjangText}
          </span>
        </div>

        <div class="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
          <!-- Kiri -->
          <div class="space-y-6">
            <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div class="flex items-center gap-5">
                  <img src="${mascotSrc}" alt="Maskot" class="w-24 sm:w-28 h-auto object-contain shrink-0" />
                  <div>
                    <span class="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 font-display text-xs font-extrabold text-emerald-800">
                      ✓ Selesai • 10/10 soal
                    </span>
                    <p class="mt-2 font-display text-4xl sm:text-5xl font-extrabold text-ink-900">
                      90 <span class="text-xl text-slate-500">/ 100</span>
                    </p>
                    <p class="text-xs sm:text-sm text-slate-600 mt-1">9 jawaban benar dari 10 soal</p>
                  </div>
                </div>
                <div class="sm:text-right">
                  <p class="font-display text-3xl font-extrabold text-brand-700">+72 XP</p>
                  <p class="text-xs text-slate-500 mt-0.5">9 benar × 8 XP<br>XP sesi ini</p>
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-3">
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-emerald-800">9 benar</p>
                  <p class="text-xs text-slate-500 mt-0.5">Soal 02–10</p>
                </div>
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-[#b91c47]">1 salah</p>
                  <p class="text-xs text-slate-500 mt-0.5">Soal 01 • Skala &amp; satuan</p>
                </div>
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-ink-900">10/10</p>
                  <p class="text-xs text-slate-500 mt-0.5">Soal terselesaikan</p>
                </div>
              </div>

              <div class="rounded-2xl bg-brand-50/80 border border-brand-100 p-4">
                <h4 class="font-display text-xs sm:text-sm font-extrabold text-brand-700">XP sudah masuk ke totalmu</h4>
                <p class="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Selamat! +72 XP berhasil ditambahkan ke akunmu. Level ${u.level} • Rank ${u.rank}.
                </p>
              </div>
            </div>

            <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <h3 class="font-display text-xl font-extrabold text-ink-900">Bekal untuk petualangan berikutnya</h3>
              <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-2xl bg-emerald-50/75 border border-emerald-200/80 p-5">
                  <h4 class="font-display text-sm font-extrabold text-emerald-800">✓ Kekuatanmu</h4>
                  <p class="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Arah mata angin dan letak wilayah sudah kamu pahami. Soal 02–10 dijawab benar.
                  </p>
                </div>
                <div class="rounded-2xl bg-[#fef7ec] border border-amber-200/80 p-5">
                  <h4 class="font-display text-sm font-extrabold text-[#9a5b13]">☼ Perlu dilatih</h4>
                  <p class="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Skala peta dan konversi cm ke km. Dua percobaan pada soal 01 belum tepat.
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onclick="window.openQuizScreen(8)"
                  class="rounded-2xl bg-brand-700 px-6 py-3 font-display text-xs sm:text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer"
                >
                  Lihat Pembahasan
                </button>
                <button
                  type="button"
                  onclick="window.handleNavClick('ai-tutor')"
                  class="rounded-2xl border-2 border-brand-700 bg-white px-6 py-2.5 font-display text-xs sm:text-sm font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer"
                >
                  Tanya AI Tutor
                </button>
              </div>

              <div class="pt-2">
                <button type="button" onclick="window.exitQuizSession()" class="font-display text-xs font-extrabold text-brand-700 hover:underline cursor-pointer">
                  &larr; Kembali ke ${returnLabel}
                </button>
              </div>
            </div>
          </div>

          <!-- Kanan -->
          <div class="space-y-4">
            <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs space-y-4">
              <div class="flex items-center gap-3.5">
                <img src="${goldSrc}" alt="${u.rank}" class="w-11 h-11 object-contain shrink-0" />
                <div>
                  <h3 class="font-display text-base font-extrabold text-ink-900">${u.fullName}</h3>
                  <p class="text-xs text-slate-500">Level ${u.level} • Rank ${u.rank}</p>
                </div>
              </div>

              <div class="rounded-2xl border border-brand-100 bg-brand-50/60 p-4 space-y-2.5">
                <div class="flex items-center justify-between text-[11px] font-display font-extrabold">
                  <span class="text-ink-900">Level ${u.level} • ${u.rank}</span>
                  <span class="text-brand-700">${displayTotalXp} XP • ${displayCurrXp}/${displayNextXp} ke Lv. ${u.level + 1}</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
                  <div class="h-full rounded-full bg-brand-700" style="width: ${xpPct}%"></div>
                </div>
                <div class="flex items-center justify-between pt-1 text-xs">
                  <div class="flex items-center gap-1">${renderHeartsInline(step7Lives, 3, 'w-3.5 h-3.5')}</div>
                  <span class="font-display font-extrabold text-ink-900">Nyawa IPS ${step7Lives}/3</span>
                </div>
              </div>

              <p class="text-xs text-slate-600 leading-relaxed">
                ${displayCurrXp}/${displayNextXp} XP • ${xpPct}% ke Level ${u.level + 1}<br>
                Sisa ${remXp} XP menuju Level ${u.level + 1}.
              </p>

              <div class="grid grid-cols-2 gap-3 pt-2 border-t border-brand-100">
                <div>
                  <p class="font-display text-xl font-extrabold text-ink-900">${Object.keys(appState.completedMaterials || {}).length} materi</p>
                  <p class="text-xs text-slate-500">Selesai</p>
                </div>
                <div>
                  <p class="font-display text-xl font-extrabold text-ink-900">${(appState.profileStats?.total_quizzes || 0) + 1} kuis</p>
                  <p class="text-xs text-slate-500">Tercatat</p>
                </div>
              </div>
            </div>

            <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-display text-xs font-extrabold text-ink-900">Nyawa IPS</span>
                <span class="rounded-full ${step7BadgeClass} px-2.5 py-0.5 font-display text-xs font-extrabold">${step7Lives}/3</span>
              </div>
              <div class="flex items-center gap-1.5">
                ${renderHeartsInline(step7Lives, 3, 'w-6 h-6')}
              </div>
              <p class="text-xs text-slate-600">Pulih 1 nyawa tiap 1 jam.</p>
              <p class="text-[11px] text-slate-400">Terpisah per mata pelajaran • Maks. 3</p>
              <p class="text-xs text-slate-600 leading-relaxed pt-1">
                ${step7Lost > 0 ? `${step7Lost} jawaban salah mengurangi ${step7Lost} nyawa IPS.` : 'Semua jawaban benar tanpa kehilangan nyawa.'} Jawaban benar tidak mengurangi nyawa.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (step === 8) {
    // LAYAR 08: Pembahasan & Evaluasi AI Tutor
    const qNum = appState.quizReviewQuestionNum || 1;
    const numButtonsHtml = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
      const isWrong = n === 1;
      const isActive = qNum === n;
      const numStr = n < 10 ? `0${n}` : `${n}`;
      return `
        <button
          type="button"
          onclick="window.selectQuizReviewQuestion(${n})"
          class="rounded-2xl px-4 py-2.5 font-display text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 ${
            isWrong
              ? isActive
                ? 'border-2 border-[#b91c47] bg-rose-50/70 text-[#b91c47]'
                : 'border border-rose-200 bg-rose-50/40 text-[#b91c47]'
              : isActive
              ? 'border-2 border-emerald-700 bg-emerald-50 text-emerald-900'
              : 'border border-emerald-200 bg-emerald-50/50 text-emerald-800 hover:bg-emerald-100/60'
          }"
        >
          <span>${numStr}</span>
          <span>${isWrong ? '✕' : '✓'}</span>
        </button>
      `;
    }).join('');

    bodyHtml = `
      <div class="space-y-6">
        <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Hasil Kuis / Pembahasan</p>
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-ink-900">Pahami langkahnya, bukan hanya jawabannya</h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">Pembahasan Peta dan Letak Wilayah • Sesi selesai • Riwayat jawaban tidak bisa diubah</p>
          </div>
          <span class="self-start inline-flex items-center rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">
            ${jenjangText}
          </span>
        </div>

        <div class="rounded-2xl border border-brand-100 bg-white px-5 py-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex flex-wrap items-center gap-3">
            <span class="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-display font-extrabold text-emerald-800">
              9/10 benar • Skor 90
            </span>
            <span class="font-display font-extrabold text-ink-900">+72 XP sesi • Total ${displayTotalXp} XP • Level ${u.level} ${u.rank}</span>
          </div>
          <span class="text-slate-500">Pembahasan &amp; AI: tanpa XP tambahan</span>
        </div>

        <!-- Bar Nomor Soal 01 - 10 -->
        <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="font-display font-extrabold text-ink-900">Tinjau jawabanmu</span>
            <span class="text-slate-500">✕ Salah &nbsp; ✓ Benar</span>
          </div>
          <div class="grid grid-cols-5 sm:grid-cols-10 gap-2">
            ${numButtonsHtml}
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-[1fr_330px] items-start">
          <!-- Kiri: Detail Pembahasan Soal -->
          <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            ${
              qNum === 1
                ? `<div class="flex items-center justify-between">
                     <span class="rounded-full bg-rose-50 px-3.5 py-1 font-display text-xs font-extrabold text-[#b91c47]">SOAL 01 • Selesai salah</span>
                     <span class="text-xs font-extrabold text-slate-500">2/2 percobaan • 0 XP</span>
                   </div>
                   <div>
                     <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-ink-900">Skala peta dan konversi satuan</h2>
                     <p class="mt-2 text-sm text-slate-600 leading-relaxed">
                       Sebuah peta memiliki skala 1 : 200.000. Jarak dua lokasi pada peta adalah 3 cm. Berapa jarak sebenarnya antara kedua lokasi tersebut?
                     </p>
                   </div>
                   <div class="space-y-2.5">
                     <div class="rounded-2xl border border-[#b91c47] bg-rose-50/40 px-4 py-3 flex items-center justify-between">
                       <div class="flex items-center gap-3">
                         <span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#b91c47] text-white font-display text-xs font-extrabold">A</span>
                         <span class="font-display text-sm font-extrabold text-ink-900">600 m</span>
                       </div>
                       <span class="font-display text-xs font-extrabold text-[#b91c47]">Percobaan 1 • Salah</span>
                     </div>
                     <div class="rounded-2xl border border-[#b91c47] bg-rose-50/40 px-4 py-3 flex items-center justify-between">
                       <div class="flex items-center gap-3">
                         <span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#b91c47] text-white font-display text-xs font-extrabold">C</span>
                         <span class="font-display text-sm font-extrabold text-ink-900">60 km</span>
                       </div>
                       <span class="font-display text-xs font-extrabold text-[#b91c47]">Percobaan 2 • Salah</span>
                     </div>
                     <div class="rounded-2xl border-2 border-emerald-700 bg-emerald-50/50 px-4 py-3 flex items-center justify-between">
                       <div class="flex items-center gap-3">
                         <span class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-white font-display text-xs font-extrabold">B</span>
                         <span class="font-display text-sm font-extrabold text-ink-900">6 km</span>
                       </div>
                       <span class="font-display text-xs font-extrabold text-emerald-800">Kunci jawaban</span>
                     </div>
                   </div>
                   <div class="rounded-2xl bg-brand-50/75 border border-brand-100 p-5 space-y-3">
                     <h3 class="font-display text-lg font-extrabold text-ink-900">Dari jarak peta ke jarak sebenarnya</h3>
                     <div>
                       <p class="font-display text-xs font-extrabold text-brand-700">Maknai skala</p>
                       <p class="text-xs sm:text-sm text-slate-600">1 cm pada peta mewakili 200.000 cm jarak sebenarnya.</p>
                     </div>
                     <div>
                       <p class="font-display text-xs font-extrabold text-brand-700">Kalikan jarak peta</p>
                       <p class="text-xs sm:text-sm text-slate-600">3 × 200.000 cm = 600.000 cm.</p>
                     </div>
                     <div>
                       <p class="font-display text-xs font-extrabold text-brand-700">Ubah satuannya</p>
                       <p class="text-xs sm:text-sm text-slate-600">600.000 cm ÷ 100 = 6.000 m. Lalu, 6.000 m ÷ 1.000 = 6 km.</p>
                     </div>
                   </div>
                   <div class="rounded-2xl bg-[#fef7ec] border border-amber-200/80 p-4">
                     <p class="font-display text-xs sm:text-sm font-extrabold text-[#9a5b13]">Letak kekeliruannya</p>
                     <p class="mt-1 text-xs sm:text-sm text-slate-600">600 m terlalu kecil, sedangkan 60 km terlalu besar. Tulis satuan pada setiap langkah agar jumlah nol tidak tertukar.</p>
                   </div>`
                : `<div class="flex items-center justify-between">
                     <span class="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 font-display text-xs font-extrabold text-emerald-800">SOAL 0${qNum} • Dijawab benar</span>
                     <span class="text-xs font-extrabold text-emerald-700">1/2 percobaan • +8 XP</span>
                   </div>
                   <div>
                     <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-ink-900">Membaca arah mata angin &amp; letak wilayah</h2>
                     <p class="mt-2 text-sm text-slate-600 leading-relaxed">
                       Kamu berhasil menjawab soal nomor 0${qNum} dengan tepat pada percobaan pertama tanpa kehilangan nyawa IPS.
                     </p>
                   </div>
                   <div class="rounded-2xl border-2 border-emerald-700 bg-emerald-50/50 px-4 py-3.5 flex items-center justify-between">
                     <div class="flex items-center gap-3">
                       <span class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-white font-display text-xs font-extrabold">B</span>
                       <span class="font-display text-sm font-extrabold text-ink-900">Timur (Jawabanmu tepat)</span>
                     </div>
                     <span class="font-display text-xs font-extrabold text-emerald-800">✓ +8 XP</span>
                   </div>`
            }

            <div class="pt-4 border-t border-brand-100 flex items-center justify-between gap-4">
              <button type="button" onclick="window.openQuizScreen(7)" class="font-display text-xs sm:text-sm font-extrabold text-brand-700 hover:underline cursor-pointer">
                &larr; Kembali ke Hasil
              </button>
              <button
                type="button"
                onclick="window.selectQuizReviewQuestion(${qNum < 10 ? qNum + 1 : 1})"
                class="rounded-2xl border-2 border-brand-700 bg-white px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer"
              >
                Pembahasan Soal ${qNum < 10 ? `0${qNum + 1}` : '01'} &rarr;
              </button>
            </div>
          </div>

          <!-- Kanan: AI Tutor Refleksi Setelah Kuis -->
          <div class="space-y-4">
            <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs space-y-3.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-lg">🦉</div>
                  <div>
                    <h4 class="font-display text-sm font-extrabold text-ink-900">AI Tutor</h4>
                    <p class="text-xs font-extrabold text-emerald-700">Refleksi setelah kuis</p>
                  </div>
                </div>
                <span class="text-slate-400 text-xs">✕</span>
              </div>

              <div class="rounded-2xl bg-brand-700 p-3.5 text-xs text-white leading-relaxed">
                ${appState.quizAiCustomPrompt || 'Aku masih bingung mengubah satuan pada soal skala.'}
              </div>

              <div class="rounded-2xl border border-brand-100 p-4 space-y-2 text-xs text-ink-900 leading-relaxed">
                <p>1. Mulai dari satuan. Setelah jarak peta dikalikan skala, satuan apa yang kamu dapatkan?</p>
                <p>2. Hubungkan satuan. Ada 100 cm dalam 1 m dan 1.000 m dalam 1 km. Bagaimana urutan konversinya?</p>
                <p class="font-semibold text-brand-700">3. Coba jelaskan kembali caramu mengubah 600.000 cm menjadi km, tanpa melihat pembahasan.</p>
              </div>

              <form onsubmit="window.submitQuizAiPrompt(event)" class="flex items-center gap-2 rounded-2xl border border-brand-100 pl-3.5 pr-1.5 py-1.5">
                <input id="quiz-ai-input-field" type="text" placeholder="Tulis langkah yang kamu pahami..." class="w-full text-xs outline-none" />
                <button type="submit" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white cursor-pointer">&uarr;</button>
              </form>
            </div>

            <div class="px-1 space-y-2">
              <p class="text-[11px] text-slate-400">AI bisa keliru. Cocokkan dengan materi atau tanyakan kepada guru.</p>
              <p class="font-display text-xs font-extrabold text-brand-700 pt-1">Refleksi, bukan mengulang kuis</p>
              <p class="text-xs text-slate-600 leading-relaxed">
                Sesi sudah selesai. Bertanya ke AI tidak mengubah jawaban, skor, atau XP yang sudah tersimpan.
              </p>
            </div>

            <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs space-y-3">
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">🌍</span>
                <div>
                  <h4 class="font-display text-base font-extrabold text-ink-900">IPS</h4>
                  <p class="text-xs font-bold text-brand-700">Peta dan Letak Wilayah</p>
                </div>
              </div>
              <div class="flex justify-between text-xs font-extrabold ${Object.keys(appState.completedMaterials || {}).length > 0 ? 'text-brand-700' : 'text-slate-500'} pt-1">
                <span>${Object.keys(appState.completedMaterials || {}).length > 0 ? 'Materi terkait selesai' : 'Materi pengantar'}</span>
                <span>${Object.keys(appState.completedMaterials || {}).length > 0 ? '100%' : '0%'}</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full ${Object.keys(appState.completedMaterials || {}).length > 0 ? 'bg-emerald-100' : 'bg-slate-100'}">
                <div class="h-full rounded-full ${Object.keys(appState.completedMaterials || {}).length > 0 ? 'w-full bg-emerald-700' : 'w-0 bg-brand-700'}"></div>
              </div>
              <button
                type="button"
                onclick="window.openMaterialPage('bab-01', 'mat-1-1', 1)"
                class="mt-2 w-full rounded-xl border-2 border-brand-700 py-2.5 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer"
              >
                ${Object.keys(appState.completedMaterials || {}).length > 0 ? 'Baca Ulang Materi' : 'Pelajari Materi Terkait'}
              </button>
              >
                Baca Ulang Materi
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (step === 9) {
    // LAYAR 09: Nyawa Habis • Cabang Alternatif Setelah Soal 02
    bodyHtml = `
      <div class="space-y-6">
        <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Peta dan Letak Wilayah</p>
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-ink-900">Istirahat sebentar, petualang</h1>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">Peta dan Letak Wilayah • IPS • Ringkasan parsial, bukan hasil kuis lengkap</p>
          </div>
          <span class="self-start inline-flex items-center rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">
            ${jenjangText}
          </span>
        </div>

        <div class="rounded-2xl bg-brand-50/90 border border-brand-100 px-5 py-4">
          <h3 class="font-display text-sm font-extrabold text-brand-700">Ringkasan sesi • Terhenti di soal 03</h3>
          <p class="mt-0.5 text-xs sm:text-sm text-slate-600">
            Sesi berhenti di soal 03 setelah nyawa IPS habis. Hasil dan XP yang sudah kamu peroleh tetap tercatat.
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
          <!-- Kiri -->
          <div class="space-y-6">
            <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div class="flex items-start gap-4">
                <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 text-[#b91c47]">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <div>
                  <span class="inline-block rounded-full bg-rose-50 px-3 py-0.5 font-display text-xs font-extrabold text-[#b91c47]">
                    Kuis Terhenti
                  </span>
                  <h2 class="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-ink-900">Nyawa IPS kamu habis</h2>
                  <p class="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Kuis langsung berhenti meski masih ada 1 jatah percobaan pada soal 03.
                  </p>
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-3">
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-ink-900">3 soal</p>
                  <p class="text-xs text-slate-500 mt-0.5">Dijumpai dari 10 soal</p>
                </div>
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-emerald-800">1 benar</p>
                  <p class="text-xs text-slate-500 mt-0.5">Soal 02</p>
                </div>
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-brand-700">+8 XP</p>
                  <p class="text-xs text-slate-500 mt-0.5">XP sesi yang tersimpan</p>
                </div>
              </div>

              <div class="rounded-2xl bg-brand-50/80 border border-brand-100 p-4">
                <h4 class="font-display text-xs sm:text-sm font-extrabold text-brand-700">Usahamu tetap tercatat</h4>
                <p class="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  +8 XP sesi tersimpan. Total: ${displayTotalXp} XP. Level ${u.level} • Rank ${u.rank}.
                </p>
              </div>
            </div>

            <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <h3 class="font-display text-xl font-extrabold text-ink-900">Sampai di mana petualanganmu?</h3>
              <div class="divide-y divide-brand-100 text-xs sm:text-sm">
                <div class="py-3.5 flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3.5">
                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 font-display text-xs font-extrabold text-[#b91c47]">01</span>
                    <div>
                      <p class="font-display font-extrabold text-ink-900">Skala &amp; satuan</p>
                      <p class="text-xs text-slate-500">Salah • 2 percobaan</p>
                    </div>
                  </div>
                  <span class="font-display font-extrabold text-slate-600">0 XP</span>
                </div>

                <div class="py-3.5 flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3.5">
                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 font-display text-xs font-extrabold text-emerald-800">02</span>
                    <div>
                      <p class="font-display font-extrabold text-ink-900">Arah mata angin</p>
                      <p class="text-xs text-slate-500">Benar • Percobaan pertama</p>
                    </div>
                  </div>
                  <span class="font-display font-extrabold text-emerald-800">+8 XP</span>
                </div>

                <div class="py-3.5 flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3.5">
                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 font-display text-xs font-extrabold text-[#b91c47]">03</span>
                    <div>
                      <p class="font-display font-extrabold text-ink-900">Terhenti saat nyawa habis</p>
                      <p class="text-xs text-slate-500">Jawaban pertama salah • Tidak dilanjutkan</p>
                    </div>
                  </div>
                  <span class="font-display font-extrabold text-slate-600">0 XP</span>
                </div>
              </div>

              <p class="text-xs text-slate-500">Soal 04–10 • 7 soal belum dikerjakan.</p>

              <div class="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onclick="window.openMaterialPage('bab-01', 'mat-1-2', 1)"
                  class="rounded-2xl bg-brand-700 px-6 py-3 font-display text-xs sm:text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer"
                >
                  Pelajari Materi
                </button>
                <button
                  type="button"
                  onclick="window.openQuizScreen(8)"
                  class="rounded-2xl border-2 border-brand-700 bg-white px-6 py-2.5 font-display text-xs sm:text-sm font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer"
                >
                  Lihat Pembahasan
                </button>
              </div>

              <div class="pt-2">
                <button type="button" onclick="window.exitQuizSession()" class="font-display text-xs font-extrabold text-brand-700 hover:underline cursor-pointer">
                  &larr; Kembali ke ${returnLabel}
                </button>
              </div>
            </div>
          </div>

          <!-- Kanan -->
          <div class="space-y-4">
            <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs space-y-3.5">
              <div class="flex items-center justify-between">
                <span class="font-display text-xs font-extrabold text-ink-900">Nyawa IPS</span>
                <span class="rounded-full bg-rose-50 px-2.5 py-0.5 font-display text-xs font-extrabold text-[#b91c47]">0/3</span>
              </div>
              <div class="flex items-center gap-1.5">
                ${renderHeartsInline(0, 3, 'w-6 h-6')}
              </div>
              <p class="text-xs text-slate-600">1 nyawa pulih dalam 1 jam.</p>
              <p class="text-[11px] text-slate-400">Terpisah per mata pelajaran • Maks. 3</p>

              <div class="rounded-2xl bg-[#fef7ec] border border-amber-200/80 p-4">
                <p class="font-display text-xs font-extrabold text-[#9a5b13]">Materi tetap terbuka</p>
                <p class="mt-1 text-xs text-slate-600 leading-relaxed">
                  Kuis belum bisa dimulai lagi saat nyawa IPS 0. Nyawa mata pelajaran lain tidak terpengaruh.
                </p>
              </div>
            </div>

            <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs space-y-4">
              <div class="flex items-center gap-3.5">
                <img src="${goldSrc}" alt="${u.rank}" class="w-11 h-11 object-contain shrink-0" />
                <div>
                  <h3 class="font-display text-base font-extrabold text-ink-900">${u.fullName}</h3>
                  <p class="text-xs text-slate-500">Level ${u.level} • Rank ${u.rank}</p>
                </div>
              </div>

              <div class="rounded-2xl border border-brand-100 bg-brand-50/60 p-4 space-y-2.5">
                <div class="flex items-center justify-between text-[11px] font-display font-extrabold">
                  <span class="text-ink-900">Level ${u.level} • ${u.rank}</span>
                  <span class="text-brand-700">${displayTotalXp} XP • ${displayCurrXp}/${displayNextXp} ke Lv. ${u.level + 1}</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
                  <div class="h-full rounded-full bg-brand-700" style="width: ${xpPct}%"></div>
                </div>
                <div class="flex items-center justify-between pt-1 text-xs">
                  <div class="flex items-center gap-1">${renderHeartsInline(0, 3, 'w-3.5 h-3.5')}</div>
                  <span class="font-display font-extrabold text-ink-900">Nyawa IPS 0/3</span>
                </div>
              </div>

              <p class="text-xs text-slate-600 leading-relaxed">
                ${displayCurrXp}/${displayNextXp} XP • ${xpPct}% ke Level ${u.level + 1}<br>
                Sisa ${remXp} XP menuju Level ${u.level + 1}.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = stepperNavHtml + bodyHtml;
}

// ==========================================================
// HALAMAN AI TUTOR (BISA UNTUK FIRA MAUPUN BUDI)
// ==========================================================
function getStarterIconSvg(type) {
  if (type === 'materi') {
    return `<svg class="w-4 h-4 text-brand-700 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`;
  }
  if (type === 'petunjuk') {
    return `<svg class="w-4 h-4 text-brand-700 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`;
  }
  return `<svg class="w-4 h-4 text-brand-700 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>`;
}

function renderAiTutorPage() {
  const container = document.getElementById('new-view-ai-tutor');
  if (!container) return;

  const u = appState.user;
  const shortName = getShortName(u.fullName);
  const jenjangText = `${u.jenjangDisplay || JENJANG_LABEL[u.jenjang] || u.jenjang} • ${u.kelas}`;
  const xpPct = Math.min(100, Math.round((u.xp / (u.nextLevelXp || 100)) * 100));
  const topicData = AI_TUTOR_TOPICS[appState.aiTutorSubject] || AI_TUTOR_TOPICS['IPS'];
  const mascotSrc = window.EDUQUEST_ASSETS?.mascot || '';
  const rankAsset = window.EDUQUEST_ASSETS?.[getRankAssetKey(u.rank)] || '';

  const subjectKeys = ['IPS', 'Bahasa Indonesia', 'IPA', 'PPKN'];
  const subjectListHtml = subjectKeys.map(key => {
    const item = AI_TUTOR_TOPICS[key];
    const isActive = appState.aiTutorSubject === key;
    return `
      <button
        type="button"
        onclick="window.selectAiTutorSubject('${key}')"
        class="w-full flex items-center gap-3.5 rounded-2xl p-3.5 text-left transition cursor-pointer ${
          isActive
            ? 'border-2 border-brand-700 bg-brand-50/90 shadow-2xs'
            : 'border border-brand-100 bg-white hover:bg-brand-50/40'
        }"
      >
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 border border-brand-100 text-lg">
          ${item.icon}
        </span>
        <div class="min-w-0">
          <p class="font-display text-sm font-extrabold text-ink-900">${item.mapel}</p>
          <p class="text-xs text-slate-500 truncate">${item.sub}</p>
        </div>
      </button>
    `;
  }).join('');

  const startersHtml = topicData.starters.map((st, idx) => `
    <div
      onclick="window.askAiTutorStarter(${idx})"
      class="group rounded-2xl border border-brand-100 bg-white p-4 flex flex-col justify-between transition hover:border-brand-300 hover:bg-brand-50/30 cursor-pointer"
    >
      <div>
        <div class="flex items-center gap-2 font-display text-xs sm:text-sm font-extrabold text-brand-700">
          ${getStarterIconSvg(st.type)}
          <span>${st.title}</span>
        </div>
        <p class="mt-2.5 text-xs text-slate-600 leading-relaxed">
          ${st.prompt}
        </p>
      </div>
      <span class="mt-4 inline-block font-display text-xs font-extrabold text-brand-700 group-hover:translate-x-0.5 transition">
        Tanyakan ini &rarr;
      </span>
    </div>
  `).join('');

  const chatHistoryHtml = appState.aiTutorMessages.length > 0
    ? `<div class="mt-5 space-y-4 border-t border-brand-100 pt-5">
         ${appState.aiTutorMessages.map(msg => {
           if (msg.role === 'user') {
             return `
               <div class="flex justify-end">
                 <div class="max-w-lg rounded-2xl rounded-tr-xs bg-brand-700 px-4 py-3 text-xs sm:text-sm text-white leading-relaxed shadow-2xs">
                   ${msg.text}
                 </div>
               </div>
             `;
           }
           return `
             <div class="flex items-start gap-3.5">
               <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 border border-brand-100 text-base">
                 🦉
               </div>
               <div class="flex-1 rounded-2xl rounded-tl-xs border border-brand-100 bg-brand-50/60 p-4 space-y-2 text-xs sm:text-sm text-ink-900 leading-relaxed">
                 ${(msg.steps || []).map((line, i) => `
                   <p class="${i === msg.steps.length - 1 ? 'font-bold text-brand-700' : ''}">${line}</p>
                 `).join('')}
               </div>
             </div>
           `;
         }).join('')}
       </div>`
    : '';

  const hasDraft = appState.aiTutorDraft.trim().length > 0;

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-ink-900">AI Tutor</h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">
          Teman berpikir untuk petualangan belajarmu. Pahami konsep, selangkah demi selangkah.
        </p>
      </div>
      <span class="self-start inline-flex items-center rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">
        ${jenjangText}
      </span>
    </div>

    <div class="grid gap-6 lg:grid-cols-[290px_1fr] items-start">
      <div class="space-y-4">
        <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
          <h2 class="font-display text-lg font-extrabold text-ink-900">Mau belajar apa?</h2>
          <p class="text-xs text-slate-500 mt-0.5">Pilihan mapel untuk jenjang ${u.jenjang}.</p>
          <div class="mt-4 space-y-2.5">
            ${subjectListHtml}
          </div>
          <p class="mt-4 text-[11px] text-slate-500 leading-relaxed">
            Topik di atas adalah contoh untuk memulai, bukan seluruh cakupan materi.
          </p>
        </div>

        <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
          <div class="flex items-center justify-between text-xs font-display font-extrabold">
            <span class="inline-flex items-center gap-1.5 text-ink-900">
              ${rankAsset ? `<img src="${rankAsset}" alt="${u.rank}" class="w-4 h-4 object-contain" />` : ''}
              <span>Level ${u.level} • ${u.rank}</span>
            </span>
            <span class="text-brand-700">${u.xp}/${u.nextLevelXp} XP ke Level ${u.level + 1}</span>
          </div>
          <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-100">
            <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width: ${xpPct}%"></div>
          </div>
        </div>

        <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
          <h3 class="font-display text-base font-extrabold text-ink-900">Tetap bisa lanjut belajar</h3>
          <p class="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Nyawa ${topicData.mapel} pulih 1 tiap 1 jam. Bertanya AI tidak memakai nyawa. Jika AI tidak tersedia, buka materi di Quest.
          </p>
          <button
            type="button"
            onclick="window.openMaterialPage('bab-01', 'mat-1-1', 1)"
            class="mt-3 inline-block font-display text-xs font-extrabold text-brand-700 hover:underline cursor-pointer"
          >
            Buka materi di Quest &rarr;
          </button>
        </div>
      </div>

      <div class="space-y-4 min-w-0">
        <div class="rounded-3xl border border-brand-100 bg-white px-6 py-4 shadow-xs flex items-center gap-3.5">
          <span class="text-2xl">${topicData.icon}</span>
          <div class="min-w-0">
            <p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">TOPIK PERCAKAPAN</p>
            <h2 class="font-display text-sm sm:text-base font-extrabold text-ink-900 truncate">
              ${topicData.topicHeader}
            </h2>
          </div>
        </div>

        <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-7 shadow-xs">
          <div class="flex items-center justify-between gap-4 pb-4 border-b border-brand-100">
            <div class="flex items-center gap-3.5">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 border border-brand-100 text-xl">
                🦉
              </div>
              <div>
                <h3 class="font-display text-base font-extrabold text-ink-900 leading-tight">AI Tutor</h3>
                <p class="text-xs font-bold text-slate-600 mt-0.5">Petunjuk bertahap, bukan jawaban akhir.</p>
              </div>
            </div>
            <button
              type="button"
              onclick="window.resetAiTutorConversation()"
              class="rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700 hover:bg-brand-200/70 transition cursor-pointer shrink-0"
            >
              Percakapan baru
            </button>
          </div>

          <div class="mt-5 flex flex-col sm:flex-row items-center sm:items-center gap-4">
            <div class="shrink-0 flex justify-center">
              <img
                src="${mascotSrc}"
                alt="Maskot Penjelajah Cilik EduQuest"
                class="w-24 sm:w-28 h-auto object-contain select-none drop-shadow-sm"
              />
            </div>
            <div class="flex-1 rounded-3xl bg-brand-50/90 border border-brand-100 p-5 sm:p-6">
              <h4 class="font-display text-lg sm:text-2xl font-extrabold text-ink-900 leading-snug">
                Halo, ${shortName}! ${topicData.greetingTitle} 👋
              </h4>
              <p class="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                ${topicData.greetingBody}
              </p>
            </div>
          </div>

          ${chatHistoryHtml}

          <div class="mt-6">
            <h4 class="font-display text-base font-extrabold text-ink-900">Bingung mulai dari mana?</h4>
            <p class="text-xs text-slate-500 mt-0.5">Pilih contoh pertanyaan, atau tulis pertanyaanmu sendiri.</p>
            <div class="mt-3.5 grid gap-4 md:grid-cols-3">
              ${startersHtml}
            </div>
          </div>

          <form onsubmit="window.submitAiTutorMessage(event)" class="mt-6">
            <label for="ai-tutor-textarea" class="block text-xs font-extrabold text-ink-900 mb-2">Pertanyaanmu</label>
            <div class="rounded-2xl border border-brand-100 bg-white p-4 focus-within:border-brand-600 transition">
              <textarea
                id="ai-tutor-textarea"
                rows="2"
                oninput="window.handleAiTutorDraftInput(this.value)"
                placeholder="Tulis pertanyaan atau soal yang ingin kamu pahami..."
                class="w-full resize-none text-xs sm:text-sm text-ink-900 outline-none placeholder:text-slate-400"
              >${appState.aiTutorDraft}</textarea>
              <div class="mt-3 flex items-center justify-between gap-3 pt-2">
                <span class="text-[11px] text-slate-400">Tulis pertanyaanmu untuk mengirim.</span>
                <button
                  type="submit"
                  id="ai-tutor-send-btn"
                  class="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-extrabold transition ${
                    hasDraft
                      ? 'bg-brand-700 text-white shadow-btn hover:bg-brand-600 cursor-pointer'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300 cursor-pointer'
                  }"
                >
                  <span>Kirim</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="flex items-center gap-2 text-xs text-slate-500 px-1">
          <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01" />
          </svg>
          <span>AI bisa keliru. Cocokkan penjelasan dengan materi dan tanyakan kepada guru jika masih ragu.</span>
        </div>
      </div>
    </div>
  `;
}

function selectAiTutorSubject(subjectKey) {
  appState.aiTutorSubject = subjectKey;
  appState.aiTutorMessages = [];
  renderAiTutorPage();
}
window.selectAiTutorSubject = selectAiTutorSubject;

function resetAiTutorConversation() {
  appState.aiTutorMessages = [];
  appState.aiTutorDraft = '';
  renderAiTutorPage();
  showToast('Percakapan Baru', 'Riwayat percakapan AI Tutor telah direset.', '🦉');
}
window.resetAiTutorConversation = resetAiTutorConversation;

function askAiTutorStarter(starterIdx) {
  const topicData = AI_TUTOR_TOPICS[appState.aiTutorSubject] || AI_TUTOR_TOPICS['IPS'];
  const starter = topicData.starters[starterIdx];
  if (!starter) return;

  appState.aiTutorMessages.push({ role: 'user', text: starter.prompt });
  appState.aiTutorMessages.push({ role: 'assistant', steps: starter.replySteps });
  renderAiTutorPage();
}
window.askAiTutorStarter = askAiTutorStarter;

function handleAiTutorDraftInput(val) {
  appState.aiTutorDraft = val;
  const btn = document.getElementById('ai-tutor-send-btn');
  if (btn) {
    const hasText = val.trim().length > 0;
    btn.className = `inline-flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-extrabold transition ${
      hasText
        ? 'bg-brand-700 text-white shadow-btn hover:bg-brand-600 cursor-pointer'
        : 'bg-slate-200 text-slate-600 hover:bg-slate-300 cursor-pointer'
    }`;
  }
}
window.handleAiTutorDraftInput = handleAiTutorDraftInput;

function submitAiTutorMessage(event) {
  if (event) event.preventDefault();
  const text = appState.aiTutorDraft.trim();
  if (!text) {
    showToast('Tulis Pertanyaan', 'Silakan ketik pertanyaanmu terlebih dahulu atau klik salah satu kartu contoh di atas.', '💡');
    return;
  }
  const topicData = AI_TUTOR_TOPICS[appState.aiTutorSubject] || AI_TUTOR_TOPICS['IPS'];
  appState.aiTutorMessages.push({ role: 'user', text });
  appState.aiTutorMessages.push({
    role: 'assistant',
    steps: [
      `1. Pertanyaan bagus tentang ${topicData.sub}! Mari kita telaah konsep dasarnya terlebih dahulu.`,
      `2. Perhatikan ciri utama atau kegiatan yang terjadi pada objek yang kamu tanyakan.`,
      `3. Berdasarkan ciri tersebut, kesimpulan awal apa yang terpikirkan olehmu?`
    ]
  });
  appState.aiTutorDraft = '';
  renderAiTutorPage();
}
window.submitAiTutorMessage = submitAiTutorMessage;

function renderRankEmblemsShowcase() {
  const containers = document.querySelectorAll('.rank-emblems-showcase');
  if (!containers.length) return;

  const activeKey = getRankAssetKey(appState.user.rank);
  const html = RANK_TIERS.map(tier => {
    const src = window.EDUQUEST_ASSETS?.[tier.key] || '';
    const isCurrent = tier.key === activeKey;
    return `
      <div class="rounded-2xl border p-4 text-center transition flex flex-col items-center justify-between ${
        isCurrent
          ? 'border-2 border-brand-700 bg-brand-50/80 shadow-xs'
          : 'border-brand-100 bg-white opacity-85 hover:opacity-100'
      }">
        <div class="flex flex-col items-center">
          <img src="${src}" alt="${tier.title}" class="h-14 w-14 object-contain drop-shadow-xs select-none" />
          <h4 class="mt-2.5 font-display text-sm font-extrabold text-ink-900">${tier.title}</h4>
          <span class="text-[11px] font-extrabold text-brand-700">Rank ${tier.rank}</span>
          <p class="mt-1 text-[11px] text-slate-500 leading-snug">${tier.desc}</p>
        </div>
        <span class="mt-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
          isCurrent ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'
        }">
          ${isCurrent ? 'Pangkat Aktif' : tier.minXp}
        </span>
      </div>
    `;
  }).join('');

  containers.forEach(el => {
    el.innerHTML = html;
  });
}

// ==========================================================
// KATALOG BAB & MATERI + HALAMAN BELAJAR MATERI INTERAKTIF
// ==========================================================
function getChapterIconSvg(type) {
  if (type === 'map') {
    return `<svg class="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>`;
  }
  if (type === 'nodes') {
    return `<svg class="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 6h6M6 9v6"/></svg>`;
  }
  if (type === 'users') {
    return `<svg class="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`;
  }
  return `<svg class="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 9l2-4h14l2 4M4 9h16v10a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm5 4h6"/></svg>`;
}

const SUBJECT_CHAPTERS = {
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

function switchQuestSubject(subj) {
  appState.activeSubject = subj;
  renderBabCatalog();
  const el = document.getElementById('ips-bab-catalog');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  showToast(`Mata Pelajaran ${subj}`, `Menampilkan bab dan materi untuk mapel ${subj}.`, '📚');
}
window.switchQuestSubject = switchQuestSubject;

function renderBabCatalog() {
  const container = document.getElementById('ips-bab-catalog');
  if (!container) return;

  const activeSubj = appState.activeSubject || 'IPS';
  const chapters = SUBJECT_CHAPTERS[activeSubj] || IPS_CHAPTERS;
  const totalCompleted = Object.keys(appState.completedMaterials).length;
  const anyCompleted = totalCompleted > 0 || !appState.isNewUser;
  let totalMaterialsInSubject = 0;
  chapters.forEach(ch => { totalMaterialsInSubject += ch.materials.length; });

  const cardsHtml = chapters.map(ch => {
    const doneInBab = ch.materials.filter(m => appState.completedMaterials[m.id]).length;
    const rowsHtml = ch.materials.map(m => {
      const isDone = !!appState.completedMaterials[m.id];
      const isHighlighted = m.recommended && !isDone;
      return `
        <div
          onclick="window.openMaterialPage('${ch.id}', '${m.id}', 1)"
          class="group flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition cursor-pointer ${
            isHighlighted
              ? 'bg-brand-50/90 hover:bg-brand-100/80'
              : 'hover:bg-brand-50/60'
          }"
        >
          <div class="flex items-center gap-3.5 min-w-0">
            ${
              isDone
                ? `<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                   </span>`
                : `<span class="flex h-6 w-6 shrink-0 items-center justify-center text-brand-700">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.9" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                   </span>`
            }
            <div class="min-w-0">
              <p class="font-display text-[15px] font-extrabold text-ink-900 truncate group-hover:text-brand-700 transition">${m.title}</p>
              <p class="text-xs text-slate-500 mt-0.5">${isDone ? '<span class="font-bold text-emerald-700">✓ Selesai</span>' : 'Belum dimulai'} • ${m.duration}</p>
            </div>
          </div>
          <span class="shrink-0 inline-flex items-center gap-1 font-display text-xs font-extrabold text-brand-700 group-hover:translate-x-0.5 transition">
            Lihat materi
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </span>
        </div>
      `;
    }).join('');

    return `
      <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 border border-brand-100">
                ${getChapterIconSvg(ch.iconType)}
              </div>
              <div>
                <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">${ch.code} • ${ch.materials.length} MATERI</p>
                <h3 class="font-display text-xl font-extrabold text-ink-900 mt-0.5">${ch.title}</h3>
              </div>
            </div>
            <span class="text-xs font-extrabold text-slate-500 shrink-0 pt-1">${doneInBab}/${ch.materials.length} selesai</span>
          </div>
          <p class="mt-3.5 text-xs sm:text-sm text-slate-600">${ch.desc}</p>
          <div class="my-4 border-t border-brand-100/80"></div>
          <div class="space-y-1">
            ${rowsHtml}
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="pt-4 space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-ink-900">Jelajahi bab dan materi &mdash; ${activeSubj}</h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Materi pelajaran ${activeSubj}. Ikuti urutan topik atau pilih bab yang ingin kamu pelajari.</p>
        </div>
        <span class="self-start sm:self-auto inline-flex items-center rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">
          ${chapters.length} bab • ${totalMaterialsInSubject} materi
        </span>
      </div>

      <div class="rounded-2xl border border-brand-200/80 bg-brand-50/90 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-start gap-3.5">
          <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-brand-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </span>
          <div>
            <h4 class="font-display text-sm font-extrabold text-ink-900">
              ${anyCompleted ? 'Kuis terkait: Siap dikerjakan! (Nyawa IPS 3/3)' : 'Kuis terkait: Belum terbuka'}
            </h4>
            <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Selesaikan materi terkait untuk membuka kuisnya. Materi lain tetap bisa kamu pelajari tanpa menunggu. Tingkat kesulitan kuis akan sesuai dengan rankmu.
            </p>
          </div>
        </div>
        ${
          anyCompleted
            ? `<button
                 type="button"
                 onclick="window.openQuizScreen(1)"
                 class="self-start sm:self-auto shrink-0 rounded-2xl bg-brand-700 px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer"
               >
                 Mulai Kuis &rarr;
               </button>`
            : ''
        }
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        ${cardsHtml}
      </div>

      <p class="text-xs text-slate-400 pt-1">
        Katalog ini berisi 20 contoh materi IPS jenjang SMP, belum mencakup seluruh kurikulum. ${appState.user.kelas} adalah informasi profilmu.
      </p>
    </div>
  `;
}

function openMaterialPage(babId, materialId, step = 1) {
  const safeStep = step >= 2 ? 2 : 1;
  appState.inQuizSession = false;
  appState.inMaterialReader = true;
  appState.currentBabId = babId || 'bab-01';
  appState.currentMaterialId = materialId || 'mat-1-1';
  appState.currentMaterialStep = safeStep;

  if (safeStep >= 2) {
    appState.passedSteps[1] = true;
  }

  updateMainViews();
  renderMaterialReader();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.openMaterialPage = openMaterialPage;

function closeMaterialPage() {
  appState.inMaterialReader = false;
  appState.activeTab = 'quest';
  updateMainViews();
  renderBabCatalog();
  syncUserUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.closeMaterialPage = closeMaterialPage;

function resolveBackendMaterialId(matId) {
  const u = appState.user || {};
  const raw = String(u.education_level || u.jenjang || '').toUpperCase();
  let validPool = [4, 5, 6, 10]; // SMA (Keanekaragaman Hayati, Virus, Plantae, Sistem Gerak)
  if (raw.includes('SD')) {
    validPool = [1, 2, 3]; // SD (Makhluk Hidup, Hewan, Energi)
  } else if (raw.includes('SMP')) {
    validPool = [7, 8, 9]; // SMP (Besaran, Gerak, Tata Surya)
  }

  if (typeof matId === 'number' && validPool.includes(matId)) {
    return matId;
  }

  const str = String(matId || '');
  const matches = str.match(/\d+/g);
  let idx = 0;
  if (matches && matches.length >= 2) {
    const b = Math.max(0, parseInt(matches[0], 10) - 1);
    const m = Math.max(0, parseInt(matches[1], 10) - 1);
    idx = (b * 3 + m) % validPool.length;
  } else if (matches && matches.length === 1) {
    idx = Math.max(0, parseInt(matches[0], 10) - 1) % validPool.length;
  }
  return validPool[idx] || validPool[0];
}
window.resolveBackendMaterialId = resolveBackendMaterialId;

async function markMaterialDone(matId) {
  if (appState.completedMaterials[matId]) {
    return false;
  }
  appState.completedMaterials[matId] = true;

  // Jika user sudah login, sinkronkan ke backend Django
  if (appState.isLoggedIn && window.EduQuestAPI && window.EduQuestAPI.completeMaterial) {
    try {
      const backendId = resolveBackendMaterialId(matId);
      const res = await window.EduQuestAPI.completeMaterial(backendId);
      if (res && res.progress) {
        applyProgressToUser(res.progress);
      }
      // Refetch progress lengkap untuk menyelaraskan XP bar
      if (window.EduQuestAPI.getProgress) {
        const fresh = await window.EduQuestAPI.getProgress();
        applyProgressToUser(fresh);
      }
      syncUserUI();
      return true;
    } catch (err) {
      console.warn('Gagal sinkronisasi materi selesai ke backend:', err);
    }
  }

  // Fallback lokal jika offline / demo
  appState.user.xp = Math.min(appState.user.nextLevelXp, appState.user.xp + 15);
  appState.user.totalXp = (appState.user.totalXp || 0) + 15;
  syncUserUI();
  return true;
}

function setMaterialStep(step) {
  openMaterialPage(appState.currentBabId, appState.currentMaterialId, step);
}
window.setMaterialStep = setMaterialStep;

async function finishMaterialAndNext(babId, currentMatId, nextMatId) {
  const newlyDone = await markMaterialDone(currentMatId);
  if (newlyDone) {
    showToast('Materi Selesai! (+15 XP)', 'Lanjut mempelajari materi berikutnya.', '🎉');
  }
  openMaterialPage(babId, nextMatId, 1);
}
window.finishMaterialAndNext = finishMaterialAndNext;

async function finishMaterialAndOpenQuiz(currentMatId) {
  const newlyDone = await markMaterialDone(currentMatId);
  if (newlyDone) {
    showToast('Materi Selesai! (+15 XP)', 'Siap mengerjakan tantangan Kuis 3 Nyawa!', '🎉');
  }
  openQuizScreen(1);
}
window.finishMaterialAndOpenQuiz = finishMaterialAndOpenQuiz;

function renderMaterialReader() {
  const readerEl = document.getElementById('view-materi-reader');
  if (!readerEl) return;

  const currentBab = IPS_CHAPTERS.find(b => b.id === appState.currentBabId) || IPS_CHAPTERS[0];
  const currentMat = currentBab.materials.find(m => m.id === appState.currentMaterialId) || currentBab.materials[0];
  const matIndex = currentBab.materials.findIndex(m => m.id === currentMat.id);
  const nextMat = currentBab.materials[matIndex + 1] || currentBab.materials[0];

  const totalCompleted = Object.keys(appState.completedMaterials).length;
  const totalPct = Math.round((totalCompleted / 20) * 100);
  const babCompleted = currentBab.materials.filter(m => appState.completedMaterials[m.id]).length;
  const step = appState.currentMaterialStep;

  const sidebarItemsHtml = currentBab.materials.map(m => {
    const isCurrent = m.id === currentMat.id;
    const isDone = !!appState.completedMaterials[m.id];
    return `
      <button
        type="button"
        onclick="window.openMaterialPage('${currentBab.id}', '${m.id}', 1)"
        class="w-full text-left flex items-start gap-3 rounded-2xl p-3 transition cursor-pointer ${
          isCurrent
            ? 'bg-brand-50/95 border border-brand-100'
            : 'hover:bg-slate-50 border border-transparent'
        }"
      >
        <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center ${isCurrent || isDone ? 'text-brand-700' : 'text-slate-600'}">
          ${
            isDone
              ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M8.5 12.5l2.5 2.5 4.5-5"/></svg>`
              : `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
          }
        </span>
        <div class="min-w-0 flex-1">
          <p class="font-display text-xs font-extrabold leading-snug ${isCurrent ? 'text-brand-700' : 'text-ink-900'}">${m.title}</p>
          <p class="text-[11px] text-slate-500 mt-0.5">
            ${isDone ? '✓ Selesai' : isCurrent ? 'Sedang dipelajari' : 'Belum dimulai'}
          </p>
        </div>
      </button>
    `;
  }).join('');

  const stepsMeta = [
    { num: 1, code: '01', label: 'Materi', done: step > 1 || !!appState.completedMaterials[currentMat.id] },
    { num: 2, code: '02', label: 'Contoh', done: !!appState.completedMaterials[currentMat.id] }
  ];

  const stepperHtml = stepsMeta.map(s => {
    const isActive = step === s.num;
    const showCheck = s.done && !isActive;
    return `
      <button
        type="button"
        onclick="window.setMaterialStep(${s.num})"
        class="pb-3.5 pr-4 inline-flex items-center gap-2 border-b-2 font-display text-xs sm:text-sm font-extrabold transition cursor-pointer whitespace-nowrap ${
          isActive
            ? 'border-brand-700 text-brand-700'
            : showCheck
            ? 'border-transparent text-slate-600 hover:text-brand-700'
            : 'border-transparent text-slate-500 hover:text-ink-900'
        }"
      >
        <span class="${isActive || showCheck ? 'text-brand-700' : 'text-slate-400'}">
          ${showCheck ? '✓' : s.code}
        </span>
        <span>${s.label}</span>
      </button>
    `;
  }).join('');

  let stepBodyHtml = '';

  if (step === 1) {
    stepBodyHtml = `
      <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-9 shadow-xs">
        <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">YANG AKAN KAMU PAHAMI</p>
        <h2 class="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-ink-900">Satu lingkungan, dua cara melihat</h2>
        <p class="mt-2 text-sm text-slate-600 leading-relaxed">
          Kenali ruang sebagai tempat beraktivitas dan wilayah dari ciri yang dimilikinya. Coba amati tempat-tempat di sekitarmu.
        </p>

        <div class="mt-7 space-y-6">
          <div class="flex items-start gap-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 border border-brand-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-display text-lg sm:text-xl font-extrabold text-ink-900">Apa itu ruang?</h3>
              <p class="mt-1 text-sm text-slate-600 leading-relaxed">
                Ruang adalah tempat di permukaan bumi tempat makhluk hidup tinggal dan beraktivitas. Rumah untuk tinggal, sekolah untuk belajar, dan jalan untuk berpindah adalah contoh ruang dalam keseharian kita.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 border border-brand-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </div>
            <div>
              <h3 class="font-display text-lg sm:text-xl font-extrabold text-ink-900">Apa itu wilayah?</h3>
              <p class="mt-1 text-sm text-slate-600 leading-relaxed">
                Wilayah adalah bagian ruang dengan ciri tertentu yang membedakannya dari bagian ruang lain. Cirinya dapat berupa kondisi alam atau kegiatan manusia. Batas wilayah tidak selalu mengikuti batas administratif, seperti desa atau kota.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-7 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl bg-brand-50/60 border border-brand-100/80 p-5">
            <div class="flex items-center gap-2.5">
              <span class="text-brand-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </span>
              <h4 class="font-display text-base font-extrabold text-ink-900">Di sekolah</h4>
            </div>
            <p class="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kamu belajar bersama guru dan teman. Perhatian kita ada pada tempat kegiatan berlangsung.
            </p>
          </div>

          <div class="rounded-2xl bg-brand-50/60 border border-brand-100/80 p-5">
            <div class="flex items-center gap-2.5">
              <span class="text-brand-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V6m0 0c-3 0-5 2-5 5 3 0 5-2 5-5zm0 0c3 0 5 2 5 5-3 0-5-2-5-5zM5 19h14"/></svg>
              </span>
              <h4 class="font-display text-base font-extrabold text-ink-900">Di kawasan persawahan</h4>
            </div>
            <p class="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sawah-sawah berdekatan memiliki ciri kegiatan pertanian: menanam dan memanen padi.
            </p>
          </div>
        </div>

        <div class="mt-4 rounded-2xl bg-brand-50/90 border border-brand-100 p-5 flex items-start gap-3.5">
          <span class="mt-0.5 text-brand-700 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          </span>
          <div>
            <h4 class="font-display text-sm font-extrabold text-brand-700">Ingat: keduanya saling berkaitan</h4>
            <p class="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Satu tempat bisa dipahami sebagai ruang sekaligus bagian suatu wilayah. Sekolah adalah ruang belajar dan dapat berada di dalam wilayah permukiman.
            </p>
          </div>
        </div>

        <div class="mt-8 pt-5 border-t border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button type="button" onclick="window.closeMaterialPage()" class="font-display text-xs sm:text-sm font-extrabold text-brand-700 hover:underline cursor-pointer">
            &larr; Kembali ke daftar materi
          </button>
          <button type="button" onclick="window.setMaterialStep(2)" class="w-full sm:w-auto rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer">
            Lanjut ke Contoh &rarr;
          </button>
        </div>
      </div>
    `;
  } else if (step === 2) {
    stepBodyHtml = `
      <div class="rounded-3xl border border-brand-100 bg-white p-6 sm:p-9 shadow-xs">
        <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">AMATI LINGKUNGAN SEKITAR</p>
        <h2 class="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-ink-900">Apa yang kamu lihat di sekitar sekolah?</h2>
        <p class="mt-2 text-sm text-slate-600 leading-relaxed">
          Ada rumah, jalan, sekolah, dan kawasan persawahan. Kita bisa memahaminya dengan memperhatikan tempat kegiatan atau kesamaan cirinya.
        </p>

        <div class="mt-6 rounded-3xl bg-[#f2f5ee] border border-slate-200/70 p-4 sm:p-6 overflow-hidden">
          <svg viewBox="0 0 800 250" class="w-full h-auto select-none">
            <text x="110" y="32" text-anchor="middle" fill="#1e1650" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14">Rumah</text>
            <text x="380" y="28" text-anchor="middle" fill="#1e1650" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14">Sekolah</text>
            <text x="645" y="24" text-anchor="middle" fill="#1e1650" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14">Kawasan persawahan</text>

            <g transform="translate(45, 55)">
              <polygon points="20,0 0,20 40,20" fill="#a78bfa"/>
              <rect x="4" y="20" width="32" height="30" rx="2" fill="#e9decb"/>
            </g>
            <g transform="translate(100, 48)">
              <polygon points="20,0 0,20 40,20" fill="#a78bfa"/>
              <rect x="4" y="20" width="32" height="30" rx="2" fill="#e9decb"/>
            </g>
            <g transform="translate(155, 58)">
              <polygon points="20,0 0,20 40,20" fill="#a78bfa"/>
              <rect x="4" y="20" width="32" height="30" rx="2" fill="#e9decb"/>
            </g>

            <g transform="translate(305, 42)">
              <polygon points="20,0 130,0 150,22 0,22" fill="#7c3aed"/>
              <rect x="0" y="22" width="150" height="44" rx="3" fill="#ddd6fe"/>
            </g>

            <g transform="translate(550, 38)">
              <rect x="0" y="0" width="190" height="22" rx="6" fill="#c7d3a8"/>
              <g stroke="#7b9645" stroke-width="1.6" stroke-linecap="round">
                <path d="M18 17v-9m0 4l-3-3m3 3l3-3"/><path d="M40 17v-9m0 4l-3-3m3 3l3-3"/><path d="M62 17v-9m0 4l-3-3m3 3l3-3"/><path d="M84 17v-9m0 4l-3-3m3 3l3-3"/><path d="M106 17v-9m0 4l-3-3m3 3l3-3"/><path d="M128 17v-9m0 4l-3-3m3 3l3-3"/><path d="M150 17v-9m0 4l-3-3m3 3l3-3"/><path d="M172 17v-9m0 4l-3-3m3 3l3-3"/>
              </g>
              <rect x="0" y="28" width="190" height="22" rx="6" fill="#c7d3a8"/>
              <g stroke="#7b9645" stroke-width="1.6" stroke-linecap="round" transform="translate(0, 28)">
                <path d="M18 17v-9m0 4l-3-3m3 3l3-3"/><path d="M40 17v-9m0 4l-3-3m3 3l3-3"/><path d="M62 17v-9m0 4l-3-3m3 3l3-3"/><path d="M84 17v-9m0 4l-3-3m3 3l3-3"/><path d="M106 17v-9m0 4l-3-3m3 3l3-3"/><path d="M128 17v-9m0 4l-3-3m3 3l3-3"/><path d="M150 17v-9m0 4l-3-3m3 3l3-3"/><path d="M172 17v-9m0 4l-3-3m3 3l3-3"/>
              </g>
              <rect x="0" y="56" width="190" height="22" rx="6" fill="#c7d3a8"/>
              <g stroke="#7b9645" stroke-width="1.6" stroke-linecap="round" transform="translate(0, 56)">
                <path d="M18 17v-9m0 4l-3-3m3 3l3-3"/><path d="M40 17v-9m0 4l-3-3m3 3l3-3"/><path d="M62 17v-9m0 4l-3-3m3 3l3-3"/><path d="M84 17v-9m0 4l-3-3m3 3l3-3"/><path d="M106 17v-9m0 4l-3-3m3 3l3-3"/><path d="M128 17v-9m0 4l-3-3m3 3l3-3"/><path d="M150 17v-9m0 4l-3-3m3 3l3-3"/><path d="M172 17v-9m0 4l-3-3m3 3l3-3"/>
              </g>
            </g>

            <path d="M 0 190 Q 200 185 330 150 T 800 155" fill="none" stroke="#d8d2e7" stroke-width="28" stroke-linecap="round"/>
            <text x="360" y="210" text-anchor="middle" fill="#1e1650" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14">Jalan</text>
            <text x="16" y="232" fill="#64748b" font-family="Nunito, sans-serif" font-size="11.5">Ilustrasi lingkungan sekitar sekolah · tidak berskala</text>
          </svg>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-brand-100 bg-white p-5">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">FOKUS PADA TEMPAT</p>
            <h3 class="mt-1 font-display text-lg font-extrabold text-ink-900">Sekolah &rarr; ruang belajar</h3>
            <p class="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Siswa belajar dan guru mengajar di sekolah. Sekolah adalah ruang tempat kegiatan belajar berlangsung.
            </p>
            <p class="mt-3 font-display text-xs font-extrabold text-brand-700">Alasannya: tempat suatu kegiatan.</p>
          </div>

          <div class="rounded-2xl border border-brand-100 bg-white p-5">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">FOKUS PADA CIRI KAWASAN</p>
            <h3 class="mt-1 font-display text-lg font-extrabold text-ink-900">Kumpulan sawah &rarr; wilayah pertanian</h3>
            <p class="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sawah-sawah berdekatan memiliki kegiatan serupa: menanam dan memanen padi.
            </p>
            <p class="mt-3 font-display text-xs font-extrabold text-brand-700">Alasannya: kesamaan kegiatan pertanian.</p>
          </div>
        </div>

        <div class="mt-4 rounded-2xl bg-brand-50/90 border border-brand-100 p-5 flex items-start gap-3.5">
          <span class="mt-0.5 text-brand-700 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          </span>
          <div>
            <h4 class="font-display text-sm font-extrabold text-ink-900">Ciri wilayah, bukan hanya garis batas</h4>
            <p class="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kawasan pertanian dapat melintasi batas desa. Satu tempat tetap dapat menjadi ruang kegiatan sekaligus bagian suatu wilayah.
            </p>
          </div>
        </div>

        <div class="mt-8 pt-5 border-t border-brand-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button type="button" onclick="window.setMaterialStep(1)" class="font-display text-xs sm:text-sm font-extrabold text-brand-700 hover:underline cursor-pointer">
            &larr; Kembali ke Materi
          </button>
          <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onclick="window.finishMaterialAndOpenQuiz('${currentMat.id}')"
              class="w-full sm:w-auto rounded-2xl border-2 border-brand-700 bg-white px-5 py-2.5 font-display text-xs sm:text-sm font-extrabold text-brand-700 hover:bg-brand-50 transition cursor-pointer"
            >
              Mulai Kuis (3 ❤️) &rarr;
            </button>
            <button
              type="button"
              onclick="window.finishMaterialAndNext('${currentBab.id}', '${currentMat.id}', '${nextMat.id}')"
              class="w-full sm:w-auto rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 transition cursor-pointer"
            >
              Lanjut ke ${nextMat.title} &rarr;
            </button>
          </div>
        </div>
      </div>
    `;
  }

  readerEl.innerHTML = `
    <div class="grid lg:grid-cols-[260px_1fr] gap-8 items-start">
      <aside class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs space-y-6">
        <button
          type="button"
          onclick="window.closeMaterialPage()"
          class="inline-flex items-center gap-2 font-display text-xs sm:text-sm font-extrabold text-brand-700 hover:underline cursor-pointer"
        >
          <span>&larr;</span> Kembali ke daftar materi
        </button>

        <div class="rounded-2xl border border-brand-200/80 bg-brand-50/50 p-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-brand-100 text-xl shadow-2xs">🌍</div>
            <div>
              <h3 class="font-display text-base font-extrabold text-ink-900 leading-tight">IPS</h3>
              <p class="text-xs font-bold text-brand-700">4 bab · 20 materi</p>
            </div>
          </div>
          <div class="mt-3.5 flex items-center justify-between text-[11px] font-extrabold text-brand-700">
            <span>${totalCompleted}/20 materi selesai</span>
            <span>${totalPct}%</span>
          </div>
          <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-100">
            <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width: ${totalPct}%"></div>
          </div>
        </div>

        <div>
          <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">${currentBab.code}</p>
          <h4 class="font-display text-base font-extrabold text-ink-900 mt-0.5">${currentBab.title}</h4>
          <p class="text-xs text-slate-500 mt-0.5">${babCompleted}/${currentBab.materials.length} materi bab selesai</p>

          <div class="mt-4 space-y-1.5">
            ${sidebarItemsHtml}
          </div>
        </div>

        <p class="text-xs text-slate-500 leading-relaxed pt-2 border-t border-brand-100/70">
          Kamu bebas membuka materi mana pun. Belajar sesuai kebutuhanmu.
        </p>
      </aside>

      <div class="min-w-0">
        <p class="text-xs font-semibold text-slate-500">
          IPS · ${currentBab.code.charAt(0) + currentBab.code.slice(1).toLowerCase()} ${currentBab.title} · ${currentMat.duration.replace(' ', '')}
        </p>
        <h1 class="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-ink-900 leading-tight">
          ${currentMat.title}
        </h1>

        <div class="mt-6 border-b border-brand-100 flex items-center gap-6 sm:gap-10 overflow-x-auto">
          ${stepperHtml}
        </div>

        <div class="mt-6">
          ${stepBodyHtml}
        </div>
      </div>
    </div>
  `;
}

function handleProfileAction(action) {
  closeProfileDropdown();
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.add('hidden');

  if (action === 'keluar') {
    clearSessionExpiryTimer();
    if (window.EduQuestAPI) {
      // logout() langsung menghapus token lokal lalu meminta backend
      // menghapus token agar tidak bisa dipakai lagi.
      window.EduQuestAPI.logout().catch(() => {});
    }
    resetUserSessionState();
    syncUserUI();
    updateMainViews();
    renderNavbarAuth();
    showToast('Berhasil Keluar', 'Sampai jumpa kembali di petualangan EduQuest berikutnya!', '👋');
    return;
  }

  if (action === 'profil') {
    // Buka halaman penuh "Profil Saya" sesuai "Profil Saya — Petualang Lama.png"
    appState.inMaterialReader = false;
    appState.inQuizSession = false;
    appState.activeTab = 'profil-saya';
    updateMainViews();
    renderProfilSayaPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (action === 'achievement') {
    openFeatureModal('achievement');
    return;
  }

  if (action === 'jenjang') {
    openFeatureModal('jenjang');
    return;
  }

  if (action === 'pengaturan') {
    openFeatureModal('pengaturan');
    return;
  }
}
window.handleProfileAction = handleProfileAction;

function openFeatureModal(type) {
  const modal = document.getElementById('feature-modal');
  const content = document.getElementById('feature-modal-content');
  if (!modal || !content) return;

  const u = appState.user;
  const initial = getInitials(u.fullName);
  const jenjangText = `${u.jenjangDisplay || JENJANG_LABEL[u.jenjang] || u.jenjang} • ${u.kelas}`;
  const rankAsset = window.EDUQUEST_ASSETS?.[getRankAssetKey(u.rank)] || '';

  if (type === 'profil') {
    content.innerHTML = `
      <div class="flex items-center justify-between border-b border-brand-100 pb-4">
        <div>
          <span class="pill">Edit Identitas</span>
          <h3 class="mt-1 font-display text-2xl font-extrabold text-ink-900">Edit Profil</h3>
        </div>
        <button type="button" onclick="window.closeFeatureModal()" class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">✕</button>
      </div>
      <div class="mt-5 flex items-center gap-4 rounded-2xl bg-brand-50/70 p-4 border border-brand-100">
        <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-brand-300 bg-brand-100 font-display text-2xl font-extrabold text-brand-700">
          ${initial}
        </div>
        <div>
          <h4 class="font-display text-xl font-extrabold text-ink-900">${u.fullName}</h4>
          <p class="text-xs font-semibold text-slate-600">${jenjangText}</p>
          <span class="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-0.5 font-display text-xs font-extrabold text-brand-700">
            ${rankAsset ? `<img src="${rankAsset}" alt="${u.rank}" class="w-4 h-4 object-contain" />` : ''}
            <span>Level ${u.level} • ${u.rank} (${u.xp} / ${u.nextLevelXp} XP)</span>
          </span>
        </div>
      </div>
      <form id="form-edit-profil" class="mt-5 space-y-4">
        <div>
          <label class="block text-xs font-extrabold text-ink-900">Nama Lengkap</label>
          <input id="edit-profil-nama" type="text" value="${u.fullName}" class="mt-1.5 w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-600" required />
        </div>
        <div>
          <label class="block text-xs font-extrabold text-ink-900">Email</label>
          <input id="edit-profil-email" type="email" value="${u.email}" class="mt-1.5 w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-600" required />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="window.closeFeatureModal()" class="rounded-xl border border-slate-200 px-4 py-2.5 font-display text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Batal</button>
          <button type="submit" class="btn-primary btn-sm">Simpan Profil</button>
        </div>
      </form>
    `;
    const form = document.getElementById('form-edit-profil');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('edit-profil-nama').value.trim();
        const newEmail = document.getElementById('edit-profil-email').value.trim();
        if (newName) {
          appState.user.fullName = newName;
          appState.user.firstName = getShortName(newName);
        }
        if (newEmail) appState.user.email = newEmail;
        syncUserUI();
        if (appState.activeTab === 'profil-saya') renderProfilSayaPage();
        if (appState.inQuizSession) renderQuizSessionView();
        closeFeatureModal();
        showToast('Profil Diperbarui', `Profil ${appState.user.fullName} berhasil disimpan.`);
      });
    }
  } else if (type === 'jenjang') {
    const kelasOptions = (KELAS_BY_JENJANG[u.jenjang] || KELAS_BY_JENJANG['SMP'])
      .map(k => `<option value="${k}" ${k === u.kelas ? 'selected' : ''}>${k}</option>`)
      .join('');
    content.innerHTML = `
      <div class="flex items-center justify-between border-b border-brand-100 pb-4">
        <div>
          <span class="pill">Kurikulum &amp; Tingkatan</span>
          <h3 class="mt-1 font-display text-2xl font-extrabold text-ink-900">Ubah Jenjang &amp; Kelas</h3>
        </div>
        <button type="button" onclick="window.closeFeatureModal()" class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">✕</button>
      </div>
      <form id="form-edit-jenjang" class="mt-5 space-y-4">
        <div>
          <label class="block text-xs font-extrabold text-ink-900 mb-2">Pilih Jenjang Pendidikan</label>
          <div class="grid grid-cols-3 gap-2.5">
            ${['SD', 'SMP', 'SMA/SMK'].map(j => `
              <button
                type="button"
                data-modal-jenjang="${j}"
                onclick="window.selectModalJenjang('${j}')"
                class="modal-jenjang-btn rounded-xl border py-2.5 px-2 font-display text-xs sm:text-sm font-bold transition cursor-pointer ${u.jenjang === j ? 'border-brand-700 bg-brand-700 text-white shadow-xs' : 'border-brand-200 bg-white text-ink-900 hover:bg-brand-50'}"
              >
                ${JENJANG_LABEL[j]}
              </button>
            `).join('')}
          </div>
        </div>
        <div>
          <label for="modal-select-kelas" class="block text-xs font-extrabold text-ink-900">Pilih Kelas</label>
          <select id="modal-select-kelas" class="mt-1.5 w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-600">
            ${kelasOptions}
          </select>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="window.closeFeatureModal()" class="rounded-xl border border-slate-200 px-4 py-2.5 font-display text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Batal</button>
          <button type="submit" class="btn-primary btn-sm">Terapkan Perubahan</button>
        </div>
      </form>
    `;
    window._tempModalJenjang = u.jenjang;
    const form = document.getElementById('form-edit-jenjang');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const chosenJenjang = window._tempModalJenjang || u.jenjang;
        const chosenKelas = document.getElementById('modal-select-kelas').value;
        appState.user.jenjang = chosenJenjang;
        appState.user.jenjangDisplay = JENJANG_LABEL[chosenJenjang] || chosenJenjang;
        appState.user.kelas = chosenKelas;
        syncUserUI();
        renderBabCatalog();
        renderAiTutorPage();
        if (appState.activeTab === 'profil-saya') renderProfilSayaPage();
        if (appState.inQuizSession) renderQuizSessionView();
        closeFeatureModal();
        showToast('Jenjang Diperbarui', `Sekarang aktif di ${appState.user.jenjangDisplay} • ${chosenKelas}.`, '🎓');
      });
    }
  } else if (type === 'achievement') {
    const activeTierKey = getRankAssetKey(u.rank);
    const tiersHtml = RANK_TIERS.map(t => {
      const src = window.EDUQUEST_ASSETS?.[t.key] || '';
      const active = t.key === activeTierKey;
      return `
        <div class="rounded-2xl border p-2.5 text-center ${active ? 'border-brand-700 bg-brand-50' : 'border-brand-100 bg-white'}">
          <img src="${src}" alt="${t.title}" class="mx-auto h-10 w-10 object-contain" />
          <p class="mt-1 font-display text-xs font-extrabold text-ink-900">${t.title}</p>
          <p class="text-[10px] font-bold text-brand-700">${t.rank}</p>
        </div>
      `;
    }).join('');

    content.innerHTML = `
      <div class="flex items-center justify-between border-b border-brand-100 pb-4">
        <div>
          <span class="pill">Koleksi Lencana &amp; Pangkat</span>
          <h3 class="mt-1 font-display text-2xl font-extrabold text-ink-900">Achievement Saya</h3>
        </div>
        <button type="button" onclick="window.closeFeatureModal()" class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">✕</button>
      </div>
      <div class="mt-4">
        <p class="text-xs font-extrabold text-ink-900 mb-2">5 Tingkat Pangkat Petualang</p>
        <div class="grid grid-cols-5 gap-2">
          ${tiersHtml}
        </div>
      </div>
      <div class="mt-5 flex justify-end">
        <button type="button" onclick="window.closeFeatureModal()" class="btn-primary btn-sm">Tutup</button>
      </div>
    `;
  } else if (type === 'pengaturan') {
    content.innerHTML = `
      <div class="flex items-center justify-between border-b border-brand-100 pb-4">
        <div>
          <span class="pill">Preferensi Akun</span>
          <h3 class="mt-1 font-display text-2xl font-extrabold text-ink-900">Pengaturan</h3>
        </div>
        <button type="button" onclick="window.closeFeatureModal()" class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">✕</button>
      </div>
      <div class="mt-5 space-y-4">
        <label class="flex items-center justify-between rounded-2xl border border-slate-200 p-4 cursor-pointer">
          <div>
            <p class="font-display text-sm font-extrabold text-ink-900">Pengingat Belajar Harian</p>
            <p class="text-xs text-slate-500">Kirim notifikasi semangat belajar setiap sore</p>
          </div>
          <input type="checkbox" checked class="h-5 w-5 accent-brand-700 rounded cursor-pointer" />
        </label>
      </div>
      <div class="mt-5 flex justify-end">
        <button type="button" onclick="window.closeFeatureModal()" class="btn-primary btn-sm">Selesai</button>
      </div>
    `;
  }

  modal.classList.remove('hidden');
}
window.openFeatureModal = openFeatureModal;

function closeFeatureModal() {
  const modal = document.getElementById('feature-modal');
  if (modal) modal.classList.add('hidden');
}
window.closeFeatureModal = closeFeatureModal;

function selectModalJenjang(jenjang) {
  window._tempModalJenjang = jenjang;
  document.querySelectorAll('.modal-jenjang-btn').forEach(btn => {
    const isSelected = btn.getAttribute('data-modal-jenjang') === jenjang;
    btn.className = `modal-jenjang-btn rounded-xl border py-2.5 px-2 font-display text-xs sm:text-sm font-bold transition cursor-pointer ${
      isSelected ? 'border-brand-700 bg-brand-700 text-white shadow-xs' : 'border-brand-200 bg-white text-ink-900 hover:bg-brand-50'
    }`;
  });
  const selectEl = document.getElementById('modal-select-kelas');
  if (selectEl) {
    const list = KELAS_BY_JENJANG[jenjang] || [];
    selectEl.innerHTML = list.map(k => `<option value="${k}">${k}</option>`).join('');
  }
}
window.selectModalJenjang = selectModalJenjang;

function syncUserUI() {
  const u = appState.user;
  const shortName = getShortName(u.fullName);
  const jenjangText = `${u.jenjangDisplay || JENJANG_LABEL[u.jenjang] || u.jenjang} • ${u.kelas}`;
  const completedCount = Object.keys(appState.completedMaterials || {}).length;
  const ipsPct = Math.min(100, Math.round((completedCount / 20) * 100));

  const newJenjangTag = document.getElementById('new-user-jenjang-tag');
  if (newJenjangTag) newJenjangTag.textContent = jenjangText;

  const questActiveJenjang = document.getElementById('quest-active-jenjang');
  if (questActiveJenjang) questActiveJenjang.textContent = jenjangText;

  const questSubjBadge = document.getElementById('quest-subject-level-badge');
  if (questSubjBadge) questSubjBadge.textContent = jenjangText;

  const questSubjNote = document.getElementById('quest-subject-level-note');
  if (questSubjNote) questSubjNote.textContent = `Mapel dan materi mengikuti jenjang ${u.jenjangDisplay || u.jenjang}.`;

  const ipsDone = document.getElementById('ips-done-text');
  if (ipsDone) ipsDone.textContent = `${completedCount}/20 materi selesai`;

  const ipsPctEl = document.getElementById('ips-pct-text');
  if (ipsPctEl) ipsPctEl.textContent = `${ipsPct}%`;

  const ipsBar = document.getElementById('ips-progress-bar');
  if (ipsBar) ipsBar.style.width = `${ipsPct}%`;

  const newWelcomeTitle = document.getElementById('new-user-welcome-title');
  if (newWelcomeTitle) newWelcomeTitle.textContent = `Halo, ${shortName}!`;

  const newLevelBadge = document.getElementById('new-user-level-badge');
  if (newLevelBadge) newLevelBadge.textContent = `Level ${u.level} • ${u.rank}`;

  const newXpDisplay = document.getElementById('new-user-xp-display');
  if (newXpDisplay) newXpDisplay.textContent = `${u.xp} / ${u.nextLevelXp || 100} XP`;

  const newXpBar = document.getElementById('new-user-xp-bar');
  if (newXpBar) {
    const xpPct = Math.min(100, Math.round((u.xp / (u.nextLevelXp || 100)) * 100));
    newXpBar.style.width = `${xpPct}%`;
  }

  renderNavbarAuth();
  renderOldUserBeranda();
  renderRankEmblemsShowcase();
}

// ==========================================================
// NAVIGASI VIEW & TAB DASHBOARD
// ==========================================================
function updateMainViews() {
  const landing = document.getElementById('view-landing-page');
  const viewBaru = document.getElementById('view-pengguna-baru');
  const viewLama = document.getElementById('view-pengguna-lama');
  const viewReader = document.getElementById('view-materi-reader');
  const viewQuizRunner = document.getElementById('view-quiz-runner');
  const viewProfilSaya = document.getElementById('view-profil-saya');

  [landing, viewBaru, viewLama, viewReader, viewQuizRunner, viewProfilSaya].forEach(el => {
    if (el) el.classList.add('hidden');
  });

  if (!appState.isLoggedIn) {
    if (landing) landing.classList.remove('hidden');
    return;
  }

  if (appState.inQuizSession) {
    if (viewQuizRunner) viewQuizRunner.classList.remove('hidden');
    setNavbarActiveTab('kuis');
    return;
  }

  if (appState.inMaterialReader) {
    if (viewReader) viewReader.classList.remove('hidden');
    setNavbarActiveTab('quest');
    return;
  }

  if (appState.activeTab === 'profil-saya') {
    if (viewProfilSaya) viewProfilSaya.classList.remove('hidden');
    renderProfilSayaPage();
    setNavbarActiveTab('');
    return;
  }

  if (!appState.isNewUser && appState.activeTab === 'beranda') {
    if (viewLama) viewLama.classList.remove('hidden');
    renderOldUserBeranda();
    setNavbarActiveTab('beranda');
    return;
  }

  if (viewBaru) viewBaru.classList.remove('hidden');
  switchNewUserTab(appState.activeTab);
}

function setNavbarActiveTab(tab) {
  const tabs = ['beranda', 'quest', 'kuis', 'ai-tutor'];
  tabs.forEach(t => {
    const btn = document.getElementById(`nav-btn-${t}`);
    if (!btn) return;
    if (t === tab) {
      btn.className = 'rounded-full bg-brand-700 px-5 py-1.5 font-display text-sm font-bold text-white transition cursor-pointer';
    } else {
      btn.className = 'rounded-full px-5 py-1.5 font-display text-sm font-bold text-ink-800 transition hover:bg-brand-50 cursor-pointer';
    }
  });
}

function renderQuestHeaderView() {
  const bannerOld = document.getElementById('quest-old-user-banner');
  const subTitle = document.getElementById('quest-page-subtitle');
  const u = appState.user || {};
  const jenjang = u.jenjangDisplay || JENJANG_LABEL[u.jenjang] || u.jenjang || 'SMA/SMK';
  const completedCount = Object.keys(appState.completedMaterials || {}).length;

  if (completedCount > 0) {
    if (bannerOld) {
      bannerOld.classList.remove('hidden');
      const bannerTitle = bannerOld.querySelector('p.font-semibold');
      const bannerProg = bannerOld.querySelector('p:nth-child(2)');
      if (bannerTitle) {
        bannerTitle.innerHTML = `Materi Terakhir Dipelajari &mdash; ${jenjang}`;
      }
      if (bannerProg) {
        const pct = Math.min(100, Math.round((completedCount / 20) * 100));
        bannerProg.textContent = `${completedCount} dari 20 materi selesai • Progres materi ${pct}%`;
      }
    }
    if (subTitle) subTitle.textContent = `${completedCount} dari 20 materi selesai di jenjang ${jenjang}. Lanjutkan materi aktif atau jelajahi mapel lainnya.`;
  } else {
    if (bannerOld) bannerOld.classList.add('hidden');
    if (subTitle) subTitle.textContent = `Quest pertamamu dimulai di sini. Pilih mata pelajaran jenjang ${jenjang}, lalu jelajahi materi dan tantangannya.`;
  }
}

function switchNewUserTab(tab) {
  if (tab === 'kuis') {
    appState.quizReturnTab = (appState.activeTab && appState.activeTab !== 'kuis') ? appState.activeTab : 'beranda';
    openQuizScreen(1, appState.quizReturnTab);
    return;
  }

  appState.inMaterialReader = false;
  appState.inQuizSession = false;
  setNavbarActiveTab(tab);

  const subviews = {
    'beranda': document.getElementById('new-view-beranda'),
    'quest': document.getElementById('new-view-quest'),
    'ai-tutor': document.getElementById('new-view-ai-tutor')
  };
  Object.keys(subviews).forEach(k => {
    if (subviews[k]) {
      subviews[k].classList.toggle('hidden', k !== tab);
    }
  });

  if (tab === 'quest') {
    renderQuestHeaderView();
    renderBabCatalog();
  } else if (tab === 'ai-tutor') {
    renderAiTutorPage();
  } else if (tab === 'beranda') {
    renderRankEmblemsShowcase();
  }
}
window.switchNewUserTab = switchNewUserTab;

function handleNavClick(tab) {
  closeProfileDropdown();
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.add('hidden');

  if (!appState.isLoggedIn) {
    window.openAuthModal('choice');
    return;
  }

  if (tab === 'kuis') {
    appState.quizReturnTab = (appState.activeTab && appState.activeTab !== 'kuis') ? appState.activeTab : 'beranda';
    openQuizScreen(1, appState.quizReturnTab);
    return;
  }

  appState.inMaterialReader = false;
  appState.inQuizSession = false;
  appState.activeTab = tab;
  setNavbarActiveTab(tab);
  updateMainViews();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.handleNavClick = handleNavClick;

function scrollToBabCatalog() {
  const el = document.getElementById('ips-bab-catalog');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
window.scrollToBabCatalog = scrollToBabCatalog;

function openAuthModal(view = 'choice') {
  const modal = document.getElementById('auth-modal');
  const vChoice = document.getElementById('view-choice');
  const vReg = document.getElementById('view-register');
  const vLogin = document.getElementById('view-login');
  if (!modal) return;

  modal.classList.remove('hidden');
  if (vChoice) vChoice.classList.toggle('hidden', view !== 'choice');
  if (vReg) vReg.classList.toggle('hidden', view !== 'register');
  if (vLogin) vLogin.classList.toggle('hidden', view !== 'login');

  // Bersihkan pesan error lama supaya tidak terbawa saat modal dibuka ulang.
  ['reg-form-error', 'login-form-error'].forEach(id => {
    const box = document.getElementById(id);
    if (box) {
      box.innerHTML = '';
      box.classList.add('hidden');
    }
  });
  document.querySelectorAll('#auth-modal .border-rose-400').forEach(el => el.classList.remove('border-rose-400'));
}
window.openAuthModal = openAuthModal;

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('hidden');
}
window.closeAuthModal = closeAuthModal;

function renderLandingContent() {
  const jenjangContainer = document.getElementById('jenjang-list');
  const mapelContainer = document.getElementById('mapel-list');

  if (jenjangContainer) {
    jenjangContainer.innerHTML = LANDING_JENJANG_DATA.map(item => `
      <div class="card flex flex-col justify-between hover:border-brand-300 transition">
        <div>
          <div class="flex items-center justify-between">
            <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-2xl">${item.ikon}</span>
            <span class="pill">${item.rentang}</span>
          </div>
          <h3 class="mt-4 font-display text-xl font-extrabold text-ink-900">${item.judul}</h3>
          <p class="mt-2 text-xs text-slate-500 leading-relaxed">${item.deskripsi}</p>
        </div>
        <button type="button" onclick="window.openAuthModal('register')" class="btn-outline mt-6">
          Pilih ${item.judul}
        </button>
      </div>
    `).join('');
  }

  if (mapelContainer) {
    mapelContainer.innerHTML = LANDING_JENJANG_DATA.map(item => `
      <div class="rounded-2xl border border-brand-100 bg-brand-50/40 p-5">
        <div class="flex items-center gap-2.5">
          <span class="text-xl">${item.ikon}</span>
          <h3 class="font-display text-base font-extrabold text-ink-900">${item.judul}</h3>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          ${item.mapel.map(m => `<span class="rounded-xl border border-brand-200 bg-white px-3 py-1 text-xs font-bold text-ink-800">${m}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  renderLandingContent();
  renderBabCatalog();
  renderAiTutorPage();
  syncUserUI();
  updateMainViews();

  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', closeAuthModal);
  });

  const btnChoiceReg = document.getElementById('btn-choice-register');
  if (btnChoiceReg) btnChoiceReg.addEventListener('click', () => openAuthModal('register'));

  const btnChoiceLogin = document.getElementById('btn-choice-login');
  if (btnChoiceLogin) btnChoiceLogin.addEventListener('click', () => openAuthModal('login'));

  const linkToLogin = document.getElementById('link-to-login');
  if (linkToLogin) linkToLogin.addEventListener('click', () => openAuthModal('login'));

  const linkToReg = document.getElementById('link-to-register');
  if (linkToReg) linkToReg.addEventListener('click', () => openAuthModal('register'));

  const regKelasSelect = document.getElementById('reg-kelas');
  document.querySelectorAll('.jenjang-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const jenjang = btn.getAttribute('data-jenjang-choice');
      appState.selectedRegJenjang = jenjang;
      document.querySelectorAll('.jenjang-choice-btn').forEach(b => {
        const active = b.getAttribute('data-jenjang-choice') === jenjang;
        b.className = `jenjang-choice-btn flex items-center justify-center rounded-xl border py-2.5 font-display text-xs sm:text-sm font-bold transition cursor-pointer ${
          active ? 'border-brand-700 bg-brand-700 text-white' : 'border-brand-200 bg-white text-ink-900 hover:bg-brand-50'
        }`;
      });
      if (regKelasSelect) {
        regKelasSelect.disabled = false;
        const list = KELAS_BY_JENJANG[jenjang] || [];
        regKelasSelect.innerHTML = list.map(k => `<option value="${k}">${k}</option>`).join('');
      }
      setRegisterError('');
      clearRegisterFieldErrors();
      validateRegisterForm();
    });
  });

  const regInputs = ['reg-nama', 'reg-username', 'reg-email', 'reg-kelas', 'reg-pass', 'reg-pass-confirm', 'reg-terms'];
  regInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        validateRegisterForm();
        setRegisterError('');
        el.classList.remove('border-rose-400');
      });
      el.addEventListener('change', () => {
        validateRegisterForm();
        setRegisterError('');
        el.classList.remove('border-rose-400');
      });
    }
  });

  const REG_USERNAME_PATTERN = /^[\w.@+-]+$/;
  const REG_FIELD_INPUTS = {
    username: 'reg-username',
    email: 'reg-email',
    first_name: 'reg-nama',
    kelas: 'reg-kelas',
    password: 'reg-pass',
    password_confirm: 'reg-pass-confirm',
  };
  const REG_FIELD_LABELS = {
    username: 'Nama pengguna',
    email: 'Email',
    first_name: 'Nama lengkap',
    education_level: 'Jenjang',
    kelas: 'Kelas',
    password: 'Kata sandi',
    password_confirm: 'Konfirmasi kata sandi',
    non_field_errors: 'Pendaftaran',
  };

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setRegisterError(html) {
    const box = document.getElementById('reg-form-error');
    if (!box) return;
    box.innerHTML = html || '';
    box.classList.toggle('hidden', !html);
  }

  function clearRegisterFieldErrors() {
    Object.values(REG_FIELD_INPUTS).forEach(id => {
      document.getElementById(id)?.classList.remove('border-rose-400');
    });
  }

  function getRegisterValues() {
    return {
      nama: (document.getElementById('reg-nama')?.value || '').trim(),
      username: (document.getElementById('reg-username')?.value || '').trim(),
      email: (document.getElementById('reg-email')?.value || '').trim(),
      jenjang: appState.selectedRegJenjang,
      kelas: document.getElementById('reg-kelas')?.value || '',
      pass: document.getElementById('reg-pass')?.value || '',
      confirm: document.getElementById('reg-pass-confirm')?.value || '',
      terms: document.getElementById('reg-terms')?.checked || false,
    };
  }

  function isRegisterFormValid() {
    const v = getRegisterValues();
    return (
      v.nama.length >= 2 &&
      v.username.length >= 3 &&
      REG_USERNAME_PATTERN.test(v.username) &&
      v.email.includes('@') &&
      !!v.jenjang &&
      !!v.kelas &&
      v.pass.length >= 8 &&
      v.pass === v.confirm &&
      v.terms
    );
  }

  function validateRegisterForm() {
    if (appState.isRegistering) return;
    const v = getRegisterValues();
    const isValid = isRegisterFormValid();
    const submitBtn = document.getElementById('btn-submit-register');

    // Tampilkan hint mismatch real-time
    const mismatchHint = document.getElementById('reg-pass-mismatch-hint');
    if (mismatchHint) {
      const showMismatch = v.confirm.length > 0 && v.pass !== v.confirm;
      mismatchHint.classList.toggle('hidden', !showMismatch);
      const confirmInput = document.getElementById('reg-pass-confirm');
      if (confirmInput) {
        if (showMismatch) confirmInput.classList.add('border-rose-400');
        else confirmInput.classList.remove('border-rose-400');
      }
    }

    if (submitBtn) {
      // Tombol tetap aktif agar user bisa mengklik dan mendapatkan pesan validasi yang jelas
      submitBtn.disabled = false;
      submitBtn.className = isValid
        ? 'w-full rounded-xl bg-brand-700 py-3.5 font-display text-sm font-extrabold text-white shadow-btn hover:bg-brand-600 cursor-pointer transition'
        : 'w-full rounded-xl bg-brand-600/80 py-3.5 font-display text-sm font-extrabold text-white hover:bg-brand-600 cursor-pointer transition';
    }
  }

  function normalizeJenjangForBackend(jenjang) {
    return jenjang === 'SMA/SMK' ? 'SMA' : jenjang;
  }

  function jenjangUiFromBackend(code) {
    if (!code) return '';
    return code === 'SMA' ? 'SMA/SMK' : code;
  }

  /**
   * Ubah payload user dari backend menjadi format appState.user yang dipakai UI.
   * Backend mengirim { username, email, first_name, education_level: {code}, kelas }.
   */
  function buildUserFromBackend(apiUser, fallback = {}) {
    const displayName = (apiUser?.first_name || fallback.nama || '').trim() || apiUser?.username || 'Petualang';
    const jenjangCode = apiUser?.education_level?.code || normalizeJenjangForBackend(fallback.jenjang || '');
    const jenjang = jenjangUiFromBackend(jenjangCode) || fallback.jenjang || '';
    const kelasNumber = apiUser?.kelas ?? fallback.kelasNumber;

    return {
      id: apiUser?.id,
      username: apiUser?.username || fallback.username || '',
      fullName: displayName,
      firstName: getShortName(displayName),
      email: apiUser?.email || fallback.email || '',
      jenjang,
      jenjangDisplay: JENJANG_LABEL[jenjang] || jenjang,
      kelas: kelasNumber ? `Kelas ${kelasNumber}` : '-',
      education_level: jenjangCode || normalizeJenjangForBackend(jenjang) || 'SMA',
      level: 1,
      rank: 'Bronze',
      totalXp: 0,
      xp: 0,
      nextLevelXp: 100,
      ipsLives: 3,
      ipsLivesMax: 3,
    };
  }

  function showRegisterServerErrors(error) {
    const data = error?.data;
    clearRegisterFieldErrors();

    if (!data || typeof data !== 'object') {
      setRegisterError(escapeHtml(error?.message || 'Pendaftaran gagal. Silakan coba lagi.'));
      return;
    }

    const messages = [];
    Object.keys(data).forEach(field => {
      if (field === 'code') return;
      const raw = data[field];
      if (field === 'detail') {
        messages.push(escapeHtml(String(raw)));
        return;
      }
      const list = Array.isArray(raw) ? raw : [raw];
      const label = REG_FIELD_LABELS[field] || field;
      list.forEach(msg => {
        const text = typeof msg === 'string' ? msg : JSON.stringify(msg);
        messages.push(`<span class="font-extrabold">${escapeHtml(label)}:</span> ${escapeHtml(text)}`);
      });
      const inputId = REG_FIELD_INPUTS[field];
      if (inputId) document.getElementById(inputId)?.classList.add('border-rose-400');
    });

    setRegisterError(messages.join('<br>') || 'Pendaftaran gagal. Periksa kembali data yang diisi.');
  }

  function resetRegisterForm() {
    const formRegister = document.getElementById('form-register');
    if (formRegister) formRegister.reset();

    appState.selectedRegJenjang = '';
    document.querySelectorAll('.jenjang-choice-btn').forEach(btn => {
      btn.className = 'jenjang-choice-btn flex items-center justify-center rounded-xl border border-brand-200 bg-white py-2.5 font-display text-xs sm:text-sm font-bold text-ink-900 transition hover:bg-brand-50 cursor-pointer';
    });

    const kelasSelect = document.getElementById('reg-kelas');
    if (kelasSelect) {
      kelasSelect.disabled = true;
      kelasSelect.innerHTML = '<option value="">Pilih jenjang terlebih dahulu</option>';
    }

    setRegisterError('');
    clearRegisterFieldErrors();
    validateRegisterForm();
  }

  // Registrasi Petualang Baru -> terhubung ke POST /api/auth/register/
  const formRegister = document.getElementById('form-register');
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (appState.isRegistering) return;

      const values = getRegisterValues();

      // Validasi interaktif dengan pesan yang jelas
      if (values.nama.length < 2) {
        setRegisterError('Nama Lengkap minimal 2 karakter.');
        document.getElementById('reg-nama')?.focus();
        return;
      }
      if (values.username.length < 3) {
        setRegisterError('Nama Pengguna minimal 3 karakter.');
        document.getElementById('reg-username')?.focus();
        return;
      }
      if (!REG_USERNAME_PATTERN.test(values.username)) {
        setRegisterError('Nama Pengguna hanya boleh huruf, angka, dan karakter . @ + - _');
        document.getElementById('reg-username')?.focus();
        return;
      }
      if (!values.email.includes('@')) {
        setRegisterError('Format email tidak valid (harus mengandung @).');
        document.getElementById('reg-email')?.focus();
        return;
      }
      if (!values.jenjang) {
        setRegisterError('Silakan pilih salah satu jenjang pendidikan (SD, SMP, atau SMA/SMK).');
        return;
      }
      if (!values.kelas) {
        setRegisterError('Silakan pilih kelas terlebih dahulu.');
        document.getElementById('reg-kelas')?.focus();
        return;
      }
      if (values.pass.length < 8) {
        setRegisterError('Kata Sandi minimal 8 karakter.');
        document.getElementById('reg-pass')?.focus();
        return;
      }
      if (values.pass !== values.confirm) {
        setRegisterError('Konfirmasi Kata Sandi tidak sama dengan Kata Sandi.');
        document.getElementById('reg-pass-confirm')?.focus();
        return;
      }
      if (!values.terms) {
        setRegisterError('Harap centang persetujuan "Saya menyetujui Syarat & Ketentuan".');
        document.getElementById('reg-terms')?.focus();
        return;
      }

      if (!window.EduQuestAPI) {
        setRegisterError('Klien API tidak tersedia. Muat ulang halaman lalu coba lagi.');
        return;
      }

      const kelasNumber = parseInt(values.kelas.replace(/\D/g, ''), 10);
      const submitBtn = document.getElementById('btn-submit-register');

      appState.isRegistering = true;
      setRegisterError('');
      clearRegisterFieldErrors();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mendaftarkan...';
        submitBtn.className = 'w-full rounded-xl bg-brand-400 py-3.5 font-display text-sm font-extrabold text-white opacity-80 cursor-wait';
      }

      try {
        const result = await window.EduQuestAPI.register({
          username: values.username,
          email: values.email,
          first_name: values.nama,
          education_level: normalizeJenjangForBackend(values.jenjang),
          kelas: kelasNumber,
          password: values.pass,
          password_confirm: values.confirm,
        });

        appState.isLoggedIn = true;
        appState.isNewUser = true;
        appState.inMaterialReader = false;
        appState.inQuizSession = false;
        appState.activeTab = 'beranda';
        appState.user = buildUserFromBackend(result.user, {
          nama: values.nama,
          username: values.username,
          email: values.email,
          jenjang: values.jenjang,
          kelasNumber,
        });
        scheduleSessionExpiry();

        resetRegisterForm();
        closeAuthModal();
        syncUserUI();
        updateMainViews();
        showToast('Pendaftaran Berhasil!', `Selamat datang, ${appState.user.fullName}! Mulai quest pertamamu.`, '⚔️');

        try {
          const progress = await window.EduQuestAPI.getProgress();
          applyProgressToUser(progress);
          syncUserUI();
        } catch (progressError) {
          // Registrasi sudah berhasil; kegagalan memuat progres tidak boleh
          // membatalkan sesi. Data default (Level 1 • Bronze) tetap dipakai.
          console.warn('Gagal memuat progres setelah registrasi:', progressError);
        }
      } catch (error) {
        showRegisterServerErrors(error);
      } finally {
        appState.isRegistering = false;
        if (submitBtn) submitBtn.textContent = 'Buat Akun Baru';
        validateRegisterForm();
      }
    });
  }


  // Login -> terhubung ke POST /api/auth/login/
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const loginSubmitBtn = document.getElementById('btn-submit-login');
    const loginErrorBox = document.getElementById('login-form-error');

    function setLoginError(message) {
      if (!loginErrorBox) return;
      loginErrorBox.innerHTML = message ? escapeHtml(message) : '';
      loginErrorBox.classList.toggle('hidden', !message);
      loginUsernameInput?.classList.remove('border-rose-400');
      loginPasswordInput?.classList.remove('border-rose-400');
    }

    function loginErrorMessage(error) {
      const data = error?.data;
      if (data && typeof data === 'object') {
        const parts = [];
        ['non_field_errors', 'detail', 'username', 'password'].forEach(field => {
          if (data[field]) {
            const list = Array.isArray(data[field]) ? data[field] : [data[field]];
            list.forEach(item => parts.push(typeof item === 'string' ? item : JSON.stringify(item)));
          }
        });
        if (parts.length) return parts.join(' ');
      }
      return error?.message || 'Gagal masuk. Silakan coba lagi.';
    }

    [loginUsernameInput, loginPasswordInput].forEach(input => {
      if (!input) return;
      ['input', 'change'].forEach(eventName => {
        input.addEventListener(eventName, () => {
          input.classList.remove('border-rose-400');
          if (loginErrorBox) {
            loginErrorBox.innerHTML = '';
            loginErrorBox.classList.add('hidden');
          }
        });
      });
    });

    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (appState.isLoggingIn) return;

      const username = (loginUsernameInput?.value || '').trim();
      const password = loginPasswordInput?.value || '';

      if (!username || !password) {
        setLoginError('Nama pengguna dan kata sandi wajib diisi.');
        if (!username) loginUsernameInput?.classList.add('border-rose-400');
        if (!password) loginPasswordInput?.classList.add('border-rose-400');
        return;
      }

      if (!window.EduQuestAPI) {
        setLoginError('Klien API tidak tersedia. Muat ulang halaman lalu coba lagi.');
        return;
      }

      appState.isLoggingIn = true;
      setLoginError('');

      if (loginSubmitBtn) {
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.textContent = 'Memeriksa akun...';
        loginSubmitBtn.className = 'w-full rounded-xl bg-brand-400 py-3.5 font-display text-sm font-extrabold text-white opacity-80 cursor-wait';
      }

      try {
        const result = await window.EduQuestAPI.login(username, password);

        appState.isLoggedIn = true;
        appState.isNewUser = false;
        appState.inMaterialReader = false;
        appState.inQuizSession = false;
        appState.activeTab = 'beranda';
        appState.user = buildUserFromBackend(result.user, {
          username,
          email: result.user?.email || '',
        });
        scheduleSessionExpiry();

        // Ambil progres agar level, rank, dan XP di dashboard sesuai akun backend.
        try {
          const progress = await window.EduQuestAPI.getProgress();
          applyProgressToUser(progress);
          appState.isNewUser = Number(progress?.xp || 0) === 0;
        } catch (progressError) {
          console.warn('Gagal memuat progres setelah login:', progressError);
        }

        formLogin.reset();
        closeAuthModal();
        syncUserUI();
        updateMainViews();
        showToast('Berhasil Masuk!', `Selamat datang kembali, ${appState.user.fullName}!`, '🗡️');
      } catch (error) {
        setLoginError(loginErrorMessage(error));
        if (error?.data?.username) loginUsernameInput?.classList.add('border-rose-400');
        if (error?.data?.password) loginPasswordInput?.classList.add('border-rose-400');
      } finally {
        appState.isLoggingIn = false;
        if (loginSubmitBtn) {
          loginSubmitBtn.disabled = false;
          loginSubmitBtn.textContent = 'Masuk ke Akun';
          loginSubmitBtn.className = 'w-full rounded-xl bg-brand-700 py-3.5 font-display text-sm font-extrabold text-white shadow-btn hover:bg-brand-600';
        }
      }
    });
  }

  // Pulihkan sesi dari token yang tersimpan. Jika token masih berlaku (< 1 jam),
  // pengguna langsung masuk dashboard tanpa login ulang. Jika kedaluwarsa,
  // getToken() otomatis menghapus token dan landing page tetap tampil.
  async function restoreSession() {
    if (!window.EduQuestAPI || !window.EduQuestAPI.isAuthenticated()) {
      updateMainViews();
      return;
    }

    try {
      const [profile, progress] = await Promise.all([
        window.EduQuestAPI.getProfile(),
        window.EduQuestAPI.getProgress(),
      ]);

      appState.isLoggedIn = true;
      appState.isNewUser = Number(progress?.xp || 0) === 0;
      appState.inMaterialReader = false;
      appState.inQuizSession = false;
      appState.activeTab = 'beranda';
      appState.user = buildUserFromBackend(profile);
      applyProgressToUser(progress);
      scheduleSessionExpiry();

      syncUserUI();
      updateMainViews();
    } catch (error) {
      // Token tidak valid/kedaluwarsa: bersihkan dan tetap di landing page.
      // Kegagalan koneksi tidak menghapus token agar bisa dicoba lagi nanti.
      if (error?.status === 401 || error?.status === 403) {
        window.EduQuestAPI.logoutLocal();
      }
      appState.isLoggedIn = false;
      appState.activeTab = 'beranda';
      syncUserUI();
      updateMainViews();
    }
  }

  restoreSession();

});
