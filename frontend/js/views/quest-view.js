/**
 * QuestView — katalog mata pelajaran dan materi dari backend.
 */
import { escapeHtml } from '../core/dom.js';
import { renderHeartsInline } from './helpers.js';

const SUBJECT_EMOJI = [
  ['biologi', '🧬'], ['fisika', '⚛️'], ['kimia', '🧪'], ['ipa', '🔬'],
  ['matematika', '📐'], ['bahasa indonesia', '📖'], ['bahasa inggris', '🗣️'],
  ['ekonomi', '💹'], ['geografi', '🌍'], ['sejarah', '🏛️'], ['sosiologi', '👥'],
  ['ppkn', '🤝'], ['pancasila', '🤝'], ['informatika', '💻'], ['seni', '🎨'],
  ['pjok', '⚽'], ['ips', '🌏'], ['bahasa', '📚']
];

function subjectEmoji(name) {
  const value = String(name || '').toLowerCase();
  const found = SUBJECT_EMOJI.find(([keyword]) => value.includes(keyword));
  return found ? found[1] : '📚';
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

export class QuestView {
  constructor(root) {
    this.root = root;
  }

  render(data) {
    if (!this.root) return;
    const user = data.user || {};
    const jenjang = user.jenjangDisplay || user.jenjang || 'jenjangmu';
    const kelas = user.kelas || '';

    const subtitle = this.root.querySelector('#quest-page-subtitle');
    if (subtitle) {
      subtitle.textContent = data.totalMaterials > 0
        ? `${data.completedCount} dari ${data.totalMaterials} materi selesai di jenjang ${jenjang}. Pilih mapel lalu lanjutkan quest-mu.`
        : `Materi untuk jenjang ${jenjang} akan tampil di sini setelah tersedia.`;
    }

    const activeJenjang = this.root.querySelector('#quest-active-jenjang');
    if (activeJenjang) {
      activeJenjang.textContent = `${jenjang}${kelas && kelas !== '-' ? ` • ${kelas}` : ''}`;
    }

    const levelBadge = this.root.querySelector('#quest-subject-level-badge');
    if (levelBadge) {
      levelBadge.textContent = `${jenjang}${kelas && kelas !== '-' ? ` • ${kelas}` : ''}`;
    }

    const levelNote = this.root.querySelector('#quest-subject-level-note');
    if (levelNote) {
      levelNote.textContent = data.loading
        ? 'Memuat mapel dan materi dari backend...'
        : `${data.subjects.length} mapel dengan materi tersedia untuk jenjang ${jenjang}.`;
    }

    this.renderStatus(data);
    this.renderSubjects(data);
    this.renderCatalog(data);
  }

  renderStatus(data) {
    const container = this.root.querySelector('#quest-status-banner');
    if (!container) return;

    if (data.loading && data.subjects.length === 0) {
      container.innerHTML = `
        <div class="flex items-center gap-3 rounded-3xl border border-brand-100 bg-brand-50/70 p-5 text-sm text-brand-900">
          <span class="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700"></span>
          <span class="font-bold">Memuat katalog materi dari backend...</span>
        </div>
      `;
      return;
    }

    if (data.error) {
      container.innerHTML = `
        <div class="flex flex-col justify-between gap-3 rounded-3xl border border-rose-200 bg-rose-50 p-5 sm:flex-row sm:items-center">
          <div>
            <p class="font-display text-sm font-extrabold text-rose-900">Katalog belum bisa dimuat</p>
            <p class="mt-1 text-xs leading-relaxed text-rose-700">${escapeHtml(data.error.message || 'Periksa koneksi backend lalu coba lagi.')}</p>
          </div>
          <button type="button" data-action="quest-refresh" class="shrink-0 rounded-2xl bg-rose-700 px-5 py-2.5 font-display text-xs font-extrabold text-white transition hover:bg-rose-600">Coba Lagi</button>
        </div>
      `;
      return;
    }

    if (data.subjects.length === 0) {
      container.innerHTML = `
        <div class="rounded-3xl border border-dashed border-brand-200 bg-brand-50/60 p-6 text-center">
          <p class="font-display text-sm font-extrabold text-ink-900">Belum ada materi untuk jenjang ini</p>
          <p class="mt-1 text-xs text-slate-600">Materi yang tersedia di backend saat ini belum mencakup jenjang ${escapeHtml(data.user?.jenjangDisplay || data.user?.jenjang || '')}.</p>
          <button type="button" data-action="quest-refresh" class="btn-outline mt-4">Muat Ulang</button>
        </div>
      `;
      return;
    }

    const subject = data.activeSubject;
    if (!subject) {
      container.innerHTML = '';
      return;
    }

    const materials = data.activeMaterials || [];
    const next = materials.find(material => !material.is_completed) || materials[0] || null;
    const completed = materials.filter(material => material.is_completed).length;
    const total = materials.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    container.innerHTML = `
      <div class="flex flex-col items-start justify-between gap-4 rounded-3xl border border-brand-100 bg-brand-50/90 p-5 md:flex-row md:items-center">
        <div class="flex items-start gap-3.5">
          <span class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-xl ring-1 ring-brand-100">${escapeHtml(subject.icon || subjectEmoji(subject.name))}</span>
          <div class="space-y-1 text-xs text-slate-600 sm:text-sm">
            <p class="font-extrabold text-ink-900">${completed > 0 ? 'Lanjutkan quest' : 'Mulai quest pertamamu'} — ${escapeHtml(subject.name)}</p>
            <p>${next ? escapeHtml(next.title) : 'Semua materi sudah selesai'} · ${completed}/${total} materi selesai (${percent}%)</p>
            <p class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span class="inline-flex items-center gap-1">${renderHeartsInline(subject.lives, subject.maxLives, 'h-4 w-4')} Nyawa ${escapeHtml(subject.name)}: ${subject.lives}/${subject.maxLives}</span>
              <span>•</span>
              <span>Kuis mengikuti rank dan jenjangmu.</span>
            </p>
          </div>
        </div>
        <div class="flex w-full shrink-0 flex-col gap-2 sm:flex-row md:w-auto">
          ${next ? `
            <button type="button" data-action="open-material" data-subject="${subject.id}" data-material="${next.id}" data-step="1"
              class="cursor-pointer rounded-2xl bg-brand-700 px-5 py-2.5 font-display text-xs font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:text-sm">
              ${completed > 0 ? 'Lanjutkan Quest' : 'Mulai Materi'}
            </button>
            <button type="button" data-action="start-quiz" data-material="${next.id}"
              class="cursor-pointer rounded-2xl border-2 border-brand-700 px-5 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50 sm:text-sm">
              Mulai Kuis
            </button>
          ` : `
            <button type="button" data-action="start-quiz" data-material="${materials[0]?.id || ''}"
              class="cursor-pointer rounded-2xl bg-brand-700 px-5 py-2.5 font-display text-xs font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:text-sm">
              Uji dengan Kuis
            </button>
          `}
        </div>
      </div>
    `;
  }

  renderSubjects(data) {
    const container = this.root.querySelector('#quest-subject-grid');
    if (!container) return;

    if (data.loading && data.subjects.length === 0) {
      container.innerHTML = Array.from({ length: 3 }).map(() => `
        <div class="animate-pulse rounded-3xl border border-brand-100 bg-white p-6">
          <div class="h-11 w-11 rounded-2xl bg-brand-100"></div>
          <div class="mt-4 h-4 w-2/3 rounded bg-slate-100"></div>
          <div class="mt-2 h-3 w-1/2 rounded bg-slate-100"></div>
          <div class="mt-5 h-2 w-full rounded bg-slate-100"></div>
        </div>
      `).join('');
      return;
    }

    if (data.subjects.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = data.subjects.map(subject => {
      const active = data.activeSubject && Number(data.activeSubject.id) === Number(subject.id);
      const percent = clampPercent(subject.percent);
      const firstTopic = subject.materials?.[0]?.topicLabel || subject.materials?.[0]?.title || 'Materi dari backend';
      return `
        <div class="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-xs ${active ? 'border-2 border-brand-700' : 'border border-brand-100'}">
          <div>
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3.5">
                <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-xl">${escapeHtml(subject.icon || subjectEmoji(subject.name))}</span>
                <div>
                  <h3 class="font-display text-lg font-extrabold text-ink-900">${escapeHtml(subject.name)}</h3>
                  <p class="line-clamp-1 text-xs text-slate-500">${escapeHtml(firstTopic)}</p>
                </div>
              </div>
              <span class="inline-flex shrink-0 items-center gap-0.5" title="Nyawa ${escapeHtml(subject.name)}">${renderHeartsInline(subject.lives, subject.maxLives, 'h-3.5 w-3.5')}</span>
            </div>
            <div class="mt-5 flex justify-between text-xs font-extrabold ${active ? 'text-brand-700' : 'text-slate-600'}">
              <span>${subject.completed} dari ${subject.total} materi</span>
              <span>${percent}%</span>
            </div>
            <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full ${active ? 'bg-brand-100' : 'bg-slate-100'}">
              <div class="h-full rounded-full ${active ? 'bg-brand-700' : 'bg-slate-400'} transition-all duration-300" style="width:${percent}%"></div>
            </div>
            <p class="mt-2 text-[11px] font-bold text-slate-400">${subject.total} materi tersedia · ${subject.lives}/${subject.maxLives} nyawa</p>
          </div>
          <button type="button" data-action="select-subject" data-subject="${subject.id}"
            class="mt-5 w-full cursor-pointer rounded-2xl py-2.5 font-display text-xs font-extrabold transition sm:text-sm ${active
              ? 'bg-brand-700 text-white shadow-btn hover:bg-brand-600'
              : 'border-2 border-brand-700 text-brand-700 hover:bg-brand-50'}">
            ${active ? 'Lanjutkan Quest' : 'Lihat Materi'}
          </button>
        </div>
      `;
    }).join('');
  }

  renderCatalog(data) {
    const container = this.root.querySelector('#quest-catalog');
    if (!container) return;

    if (data.loading && data.subjects.length === 0) {
      container.innerHTML = '';
      return;
    }
    if (data.error || data.subjects.length === 0) {
      container.innerHTML = '';
      return;
    }

    const searching = Boolean(data.search);
    const materials = data.visibleMaterials || [];
    const subject = data.activeSubject;
    const title = searching
      ? `Hasil pencarian "${escapeHtml(data.search)}"`
      : `Jelajahi materi — ${escapeHtml(subject?.name || '')}`;
    const subtitle = searching
      ? `${materials.length} materi cocok di seluruh mapel jenjangmu.`
      : `Materi ${escapeHtml(subject?.name || '')} diambil langsung dari katalog backend. Klik materi untuk membaca, atau mulai kuisnya.`;

    const rows = materials.map(material => this.materialRow(material, searching)).join('');

    container.innerHTML = `
      <div class="space-y-5 pt-4">
        <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 class="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">${title}</h2>
            <p class="mt-1 text-xs text-slate-500 sm:text-sm">${subtitle}</p>
          </div>
          <span class="inline-flex items-center self-start rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700 sm:self-auto">
            ${materials.length} materi
          </span>
        </div>

        <div class="flex flex-col justify-between gap-4 rounded-2xl border border-brand-200/80 bg-brand-50/90 px-5 py-4 sm:flex-row sm:items-center">
          <div class="flex items-start gap-3.5">
            <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-brand-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </span>
            <div>
              <h4 class="font-display text-sm font-extrabold text-ink-900">Kuis terkait materi</h4>
              <p class="mt-0.5 text-xs leading-relaxed text-slate-600">Kuis berisi soal dari bank soal backend sesuai jenjang, mapel, dan tingkat kesulitan rankmu. Nyawa terpisah per mapel dan pulih seiring waktu.</p>
            </div>
          </div>
          ${subject ? `
            <span class="shrink-0 self-start rounded-full bg-white px-4 py-2 font-display text-xs font-extrabold text-brand-700 ring-1 ring-brand-100 sm:self-auto">
              ${escapeHtml(subject.name)} · ${subject.lives}/${subject.maxLives} nyawa
            </span>
          ` : ''}
        </div>

        ${rows ? `<div class="space-y-3">${rows}</div>` : `
          <div class="rounded-3xl border border-dashed border-brand-200 bg-white p-8 text-center">
            <p class="font-display text-sm font-extrabold text-ink-900">Materi tidak ditemukan</p>
            <p class="mt-1 text-xs text-slate-500">Coba kata kunci lain, atau pilih mapel di atas.</p>
          </div>
        `}

        <p class="pt-1 text-xs text-slate-400">
          Menampilkan ${materials.length} materi dari backend untuk jenjang ${escapeHtml(data.user?.jenjangDisplay || data.user?.jenjang || '')}. Materi baru akan otomatis muncul saat ditambahkan ke katalog.
        </p>
      </div>
    `;
  }

  materialRow(material, showSubject = false) {
    const done = Boolean(material.is_completed);
    return `
      <div data-action="open-material" data-subject="${material.subject_id}" data-material="${material.id}" data-step="1"
        class="group flex cursor-pointer flex-col justify-between gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3.5 transition hover:border-brand-300 hover:bg-brand-50/60 sm:flex-row sm:items-center">
        <div class="flex min-w-0 items-start gap-3.5">
          ${done
            ? `<span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                 <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
               </span>`
            : `<span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                 <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
               </span>`
          }
          <div class="min-w-0">
            <p class="truncate font-display text-[15px] font-extrabold text-ink-900 transition group-hover:text-brand-700">${escapeHtml(material.title)}</p>
            <p class="mt-0.5 line-clamp-1 text-xs text-slate-500">
              ${showSubject ? `<span class="font-bold text-brand-700">${escapeHtml(material.subject || '')}</span> · ` : ''}
              ${done ? '<span class="font-bold text-emerald-700">Selesai</span>' : 'Belum dimulai'} · ${escapeHtml(material.durationLabel || 'Materi singkat')}
              ${material.kelas_label ? ` · ${escapeHtml(material.kelas_label)}` : ''}
            </p>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <button type="button" data-action="start-quiz" data-material="${material.id}"
            class="cursor-pointer rounded-xl border border-brand-200 px-3.5 py-2 font-display text-[11px] font-extrabold text-brand-700 transition hover:bg-brand-100">
            ${done ? 'Kuis Lagi' : 'Kuis'}
          </button>
          <span class="inline-flex items-center gap-1 font-display text-xs font-extrabold text-brand-700 transition group-hover:translate-x-0.5">
            Baca
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    `;
  }
}
