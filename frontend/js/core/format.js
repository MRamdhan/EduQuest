/**
 * Helper format data untuk ditampilkan.
 */

export function getInitials(name) {
  if (!name || !name.trim()) return 'P';
  return name.trim().charAt(0).toUpperCase();
}

export function getShortName(name) {
  if (!name || !name.trim()) return 'Petualang';
  return name.trim().split(/\s+/)[0];
}

export function formatNumber(value) {
  return Number(value || 0).toLocaleString('id-ID');
}

export function formatDate(value) {
  if (!value) return 'Baru saja';
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function jenjangText(user) {
  if (!user) return '';
  return `${user.jenjangDisplay || user.jenjang} • ${user.kelas}`;
}

export function xpPercent(user, fallback = 100) {
  const next = user?.nextLevelXp || fallback;
  if (!next) return 0;
  return Math.min(100, Math.round(((user?.xp || 0) / next) * 100));
}
