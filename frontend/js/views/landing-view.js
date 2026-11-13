/**
 * LandingView — halaman publik dengan data jenjang dari backend /levels/.
 */
import { escapeHtml } from '../core/dom.js';

const LEVEL_ICONS = {
  SD: '🎒',
  SMP: '🧭',
  SMA: '⚔️'
};

export class LandingView {
  constructor(root) {
    this.root = root;
  }

  render(data = {}) {
    const levels = Array.isArray(data.levels) ? data.levels : [];
    const jenjangContainer = this.root.querySelector('#jenjang-list');
    const mapelContainer = this.root.querySelector('#mapel-list');

    if (jenjangContainer) {
      if (data.loading && !levels.length) {
        jenjangContainer.innerHTML = Array.from({ length: 3 }).map(() => `
          <div class="card animate-pulse">
            <div class="h-12 w-12 rounded-2xl bg-brand-100"></div>
            <div class="mt-4 h-5 w-2/3 rounded bg-slate-100"></div>
            <div class="mt-2 h-3 w-full rounded bg-slate-100"></div>
            <div class="mt-2 h-3 w-4/5 rounded bg-slate-100"></div>
            <div class="mt-6 h-10 w-full rounded-2xl bg-slate-100"></div>
          </div>
        `).join('');
      } else if (data.error && !levels.length) {
        jenjangContainer.innerHTML = `
          <div class="card md:col-span-3 text-center">
            <p class="font-display text-lg font-extrabold text-ink-900">Jenjang belum bisa dimuat</p>
            <p class="mt-2 text-xs text-slate-500">${escapeHtml(data.error.message || 'Periksa koneksi ke backend lalu coba lagi.')}</p>
            <button type="button" data-action="landing-retry-levels" class="btn-outline mt-5">Coba Lagi</button>
          </div>
        `;
      } else if (!levels.length) {
        jenjangContainer.innerHTML = '';
      } else {
        jenjangContainer.innerHTML = levels.map(level => {
          const kelas = Array.isArray(level.kelas_options) ? level.kelas_options : [];
          const range = kelas.length
            ? `Kelas ${kelas[0]}–${kelas[kelas.length - 1]}`
            : `${Number(level.subject_count || 0)} mapel`;
          const code = String(level.code || '').toUpperCase();
          return `
            <div class="card flex flex-col justify-between transition hover:border-brand-300">
              <div>
                <div class="flex items-center justify-between">
                  <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-2xl">${LEVEL_ICONS[code] || '📚'}</span>
                  <span class="pill">${escapeHtml(range)}</span>
                </div>
                <h3 class="mt-4 font-display text-xl font-extrabold text-ink-900">${escapeHtml(level.name || code)}</h3>
                <p class="mt-2 text-xs leading-relaxed text-slate-500">${Number(level.subject_count || 0)} mata pelajaran tersedia di katalog backend. Materi dan kuis menyesuaikan jenjang ini.</p>
              </div>
              <button type="button" data-action="open-auth" data-view="register" data-jenjang="${escapeHtml(level.code || '')}" class="btn-outline mt-6">
                Pilih ${escapeHtml(level.name || code)}
              </button>
            </div>
          `;
        }).join('');
      }
    }

    if (mapelContainer) {
      if (data.loading && !levels.length) {
        mapelContainer.innerHTML = Array.from({ length: 3 }).map(() => `
          <div class="animate-pulse rounded-2xl border border-brand-100 bg-brand-50/40 p-5">
            <div class="h-5 w-1/2 rounded bg-brand-100"></div>
            <div class="mt-3 h-3 w-3/4 rounded bg-white"></div>
            <div class="mt-2 h-3 w-2/3 rounded bg-white"></div>
          </div>
        `).join('');
      } else {
        mapelContainer.innerHTML = levels.map(level => {
          const code = String(level.code || '').toUpperCase();
          return `
            <div class="rounded-2xl border border-brand-100 bg-brand-50/40 p-5">
              <div class="flex items-center gap-2.5">
                <span class="text-xl">${LEVEL_ICONS[code] || '📚'}</span>
                <h3 class="font-display text-base font-extrabold text-ink-900">${escapeHtml(level.name || code)}</h3>
              </div>
              <div class="mt-3 flex flex-wrap gap-2">
                <span class="rounded-xl border border-brand-200 bg-white px-3 py-1 text-xs font-bold text-ink-800">${Number(level.subject_count || 0)} mata pelajaran</span>
                <span class="rounded-xl border border-brand-200 bg-white px-3 py-1 text-xs font-bold text-ink-800">${Array.isArray(level.kelas_options) && level.kelas_options.length ? `${level.kelas_options.length} tingkat kelas` : 'Kelas sesuai jenjang'}</span>
              </div>
              <button type="button" data-action="open-auth" data-view="login" class="mt-4 cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline">
                Masuk untuk melihat daftar mapel &rarr;
              </button>
            </div>
          `;
        }).join('') || '<p class="text-xs text-slate-500">Daftar jenjang akan tampil setelah backend terhubung.</p>';
      }
    }
  }
}
