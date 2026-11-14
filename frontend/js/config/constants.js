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
  /** subjectId boleh 0/null; halaman materi akan mengambil subject dari detail backend. */
  material: (subjectId, materialId, step = 1) => `/quest/${subjectId || 0}/${materialId}?step=${step}`,
  quiz: '/kuis',
  aiTutor: '/ai-tutor',
  profile: '/profil'
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

/** Pilihan kelas darurat bila endpoint /levels/ belum termuat. */
export function fallbackKelasOptions(levelCode) {
  const code = String(levelCode || '').toUpperCase();
  if (code === 'SD') return [1, 2, 3, 4, 5, 6];
  if (code === 'SMP') return [7, 8, 9];
  return [10, 11, 12];
}

/** Label jenjang tampilan dari kode backend. */
export function levelDisplayName(level) {
  if (!level) return '';
  if (typeof level === 'string') return JENJANG_LABEL[level] || level;
  return level.name || JENJANG_LABEL[level.code] || level.code || '';
}

/** Mengubah nama rank dari backend menjadi key aset gambar pangkat. */
export function getRankAssetKey(rank) {
  const r = (rank || '').toLowerCase();
  if (r.includes('diamond') || r.includes('legenda')) return 'legenda';
  if (r.includes('platinum') || r.includes('pahlawan')) return 'pahlawan';
  if (r.includes('gold') || r.includes('kesatria')) return 'kesatria';
  if (r.includes('silver') || r.includes('penjelajah')) return 'penjelajah';
  return 'rekrut';
}
