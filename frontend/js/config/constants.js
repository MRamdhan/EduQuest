/**
 * Konfigurasi umum aplikasi EduQuest.
 * Berisi nilai yang dipakai lintas model, view, dan controller.
 */

export const API_BASE_URL = window.EDUQUEST_API_URL || 'http://127.0.0.1:8000/api';

export const TOKEN_TTL_MS = Number(window.EDUQUEST_TOKEN_TTL_MS) > 0
  ? Number(window.EDUQUEST_TOKEN_TTL_MS)
  : 60 * 60 * 1000;

export const STORAGE_KEYS = {
  token: 'eduquest_token',
  tokenExpiresAt: 'eduquest_token_expires_at',
  user: 'eduquest_user'
};

/** Path route aplikasi. Dipakai router dan tautan antar-halaman. */
export const ROUTES = {
  home: '/',
  beranda: '/beranda',
  quest: '/quest',
  material: (babId, matId, step = 1) => `/quest/${babId}/${matId}?step=${step}`,
  quiz: '/kuis',
  aiTutor: '/ai-tutor',
  profile: '/profil'
};

export const KELAS_BY_JENJANG = {
  'SD': ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
  'SMP': ['Kelas 7', 'Kelas 8', 'Kelas 9'],
  'SMA': ['Kelas 10', 'Kelas 11', 'Kelas 12'],
  'SMA/SMK': ['Kelas 10', 'Kelas 11', 'Kelas 12']
};

export const JENJANG_LABEL = {
  'SD': 'SD/Madrasah',
  'SMP': 'SMP/MTs',
  'SMA': 'SMA/SMK',
  'SMA/SMK': 'SMA/SMK'
};

export const RANK_TIERS = [
  { key: 'rekrut', rank: 'Bronze', title: 'Rekrut', minXp: '0 — 99 XP', desc: 'Petualang pemula yang memulai langkah pertama. Kuis tingkat Dasar.' },
  { key: 'penjelajah', rank: 'Silver', title: 'Penjelajah', minXp: '100 — 299 XP', desc: 'Membuka tantangan tingkat kesulitan Sedang.' },
  { key: 'kesatria', rank: 'Gold', title: 'Kesatria', minXp: '300 — 599 XP', desc: 'Menguasai berbagai bab dan membuka kuis tingkat Lanjut.' },
  { key: 'pahlawan', rank: 'Platinum', title: 'Pahlawan', minXp: '600 — 999 XP', desc: 'Pahlawan berprestasi tinggi yang menyelesaikan quest menantang.' },
  { key: 'legenda', rank: 'Diamond', title: 'Legenda', minXp: '1.000+ XP', desc: 'Peringkat tertinggi dengan penguasaan materi sempurna dan rekor istimewa.' }
];

export const SUBJECTS = ['IPS', 'IPA', 'Bahasa Indonesia', 'PPKN'];

export const LANDING_JENJANG_DATA = [
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

/** Mengubah nama rank dari backend menjadi key aset gambar pangkat. */
export function getRankAssetKey(rank) {
  const r = (rank || '').toLowerCase();
  if (r.includes('diamond') || r.includes('legenda')) return 'legenda';
  if (r.includes('platinum') || r.includes('pahlawan')) return 'pahlawan';
  if (r.includes('gold') || r.includes('kesatria')) return 'kesatria';
  if (r.includes('silver') || r.includes('penjelajah')) return 'penjelajah';
  return 'rekrut';
}
