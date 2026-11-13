/**
 * MaterialView — halaman baca materi dari backend (content_html).
 */
import { escapeHtml } from '../core/dom.js';
import { renderHeartsInline } from './helpers.js';

const SUBJECT_EMOJI = [
  ['biologi', '🧬'], ['fisika', '⚛️'], ['kimia', '🧪'], ['ipa', '🔬'],
  ['matematika', '📐'], ['bahasa indonesia', '📖'], ['bahasa inggris', '🗣️'],
  ['ekonomi', '💹'], ['geografi', '🌍'], ['sejarah', '🏛️'], ['sosiologi', '👥'],
  ['ppkn', '🤝'], ['pancasila', '🤝'], ['informatika', '💻'], ['ips', '🌏']
];

function subjectEmoji(name) {
  const value = String(name || '').toLowerCase();
  const found = SUBJECT_EMOJI.find(([keyword]) => value.includes(keyword));
  return found ? found[1] : '📚';
}

export class MaterialView {
  constructor(root) {
    this.root = root;
  }

  render(data) {
    if (!this.root) return;
    if (data.loading && !data.material) {
      this.root.innerHTML = this.renderLoading();
      return;
    }
    if (data.error) {
      this.root.innerHTML = this.renderError(data);
      return;
    }

    const { subject, material, siblings, nextMaterial, step, completedCount, totalMaterials, percent } = data;
    const lives = Number(material.lives ?? subject.lives ?? 3);
    const maxLives = Number(material.maxLives ?? subject.maxLives ?? 3);
    const done = Boolean(material.is_completed);
    const currentIndex = siblings.findIndex(item => Number(item.id) === Number(material.id));
    const currentNumber = currentIndex >= 0 ? currentIndex + 1 : 1;

    const sidebarItems = siblings.map(item => {
      const isCurrent = Number(item.id) === Number(material.id);
      const isDone = Boolean(item.is_completed);
      return `
        <button type="button" data-action="open-material" data-subject="${subject.id || material.subject_id}" data-material="${item.id}" data-step="1"
          class="flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3 text-left transition ${
            isCurrent ? 'border-brand-200 bg-brand-50/95' : 'border-transparent hover:bg-slate-50'
          }">
          <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center ${isCurrent || isDone ? 'text-brand-700' : 'text-slate-500'}">
            ${isDone
              ? '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M8.5 12.5l2.5 2.5 4.5-5"/></svg>'
              : '<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>'}
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-display text-xs font-extrabold leading-snug ${isCurrent ? 'text-brand-700' : 'text-ink-900'}">${escapeHtml(item.title)}</p>
            <p class="mt-0.5 text-[11px] text-slate-500">${isDone ? '✓ Selesai' : isCurrent ? 'Sedang dipelajari' : 'Belum dimulai'}</p>
          </div>
        </button>
      `;
    }).join('');

    const steps = [
      { num: 1, code: '01', label: 'Materi' },
      { num: 2, code: '02', label: 'Ringkasan & Kuis' }
    ];

    const stepper = steps.map(item => {
      const active = Number(step) === item.num;
      return `
        <button type="button" data-action="set-step" data-step="${item.num}"
          class="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 pb-3.5 pr-4 font-display text-xs font-extrabold transition sm:text-sm ${
            active ? 'border-brand-700 text-brand-700' : 'border-transparent text-slate-500 hover:text-ink-900'
          }">
          <span class="${active ? 'text-brand-700' : 'text-slate-400'}">${item.code}</span>
          <span>${item.label}</span>
        </button>
      `;
    }).join('');

    this.root.innerHTML = `
      <div class="grid items-start gap-8 lg:grid-cols-[270px_1fr]">
        <aside class="space-y-6 rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
          <button type="button" data-action="close-material" class="inline-flex cursor-pointer items-center gap-2 font-display text-xs font-extrabold text-brand-700 hover:underline sm:text-sm">
            <span>&larr;</span> Kembali ke daftar materi
          </button>

          <div class="rounded-2xl border border-brand-200/80 bg-brand-50/50 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-white text-xl shadow-2xs">${escapeHtml(subject.icon || subjectEmoji(subject.name))}</div>
              <div>
                <h3 class="font-display text-base font-extrabold leading-tight text-ink-900">${escapeHtml(subject.name)}</h3>
                <p class="text-xs font-bold text-brand-700">${escapeHtml(subject.level_name || subject.level || '')} · ${totalMaterials} materi</p>
              </div>
            </div>
            <div class="mt-3.5 flex items-center justify-between text-[11px] font-extrabold text-brand-700">
              <span>${completedCount}/${totalMaterials} materi selesai</span>
              <span>${percent}%</span>
            </div>
            <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-100">
              <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width: ${percent}%"></div>
            </div>
            <div class="mt-3 flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500">
              ${renderHeartsInline(lives, maxLives, 'h-3.5 w-3.5')}
              <span>Nyawa ${escapeHtml(subject.name)}: ${lives}/${maxLives}</span>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">Materi ${escapeHtml(subject.name)}</p>
              <span class="text-[11px] font-bold text-slate-400">${currentNumber}/${siblings.length}</span>
            </div>
            <div class="mt-3 space-y-1.5">${sidebarItems || '<p class="text-xs text-slate-500">Belum ada materi lain.</p>'}</div>
          </div>

          <p class="border-t border-brand-100/70 pt-2 text-xs leading-relaxed text-slate-500">
            Kamu bebas membuka materi mana pun. Progres materi dan nyawa tersimpan di akunmu.
          </p>
        </aside>

        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span class="rounded-full bg-brand-50 px-2.5 py-1 font-bold text-brand-700">${escapeHtml(subject.name)}</span>
            <span>·</span>
            <span>${escapeHtml(material.topic || 'Materi')}</span>
            <span>·</span>
            <span>${escapeHtml(material.durationLabel || 'Materi singkat')}</span>
            ${material.kelas_label ? `<span>·</span><span>${escapeHtml(material.kelas_label)}</span>` : ''}
            ${done ? '<span class="rounded-full bg-emerald-100 px-2.5 py-1 font-bold text-emerald-700">✓ Selesai</span>' : ''}
          </div>
          <h1 class="mt-1.5 font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">${escapeHtml(material.title)}</h1>
          <p class="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">${escapeHtml(material.summary || 'Baca materi berikut, lalu uji pemahamanmu lewat kuis.')}</p>

          <div class="mt-6 flex items-center gap-6 overflow-x-auto border-b border-brand-100 sm:gap-10">${stepper}</div>

          <div class="mt-6">
            ${Number(step) === 2 ? this.renderPracticeStep(data) : this.renderContentStep(data)}
          </div>
        </div>
      </div>
    `;
  }

  renderLoading() {
    return `
      <div class="mx-auto max-w-3xl animate-pulse space-y-5">
        <div class="h-4 w-40 rounded bg-slate-100"></div>
        <div class="h-10 w-3/4 rounded bg-slate-100"></div>
        <div class="h-64 rounded-3xl bg-slate-100"></div>
      </div>
    `;
  }

  renderError(data) {
    return `
      <div class="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-white p-6 text-center shadow-card sm:p-10">
        <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-100 text-3xl">📕</span>
        <h2 class="mt-5 font-display text-2xl font-extrabold text-ink-900">Materi Belum Bisa Dibuka</h2>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">${escapeHtml(data.error?.message || 'Materi tidak ditemukan atau belum dipublikasikan.')}</p>
        <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" data-action="material-retry" class="btn-primary w-full sm:w-auto">Coba Lagi</button>
          <button type="button" data-action="go" data-route="/quest" class="btn-outline w-full sm:w-auto">Kembali ke Quest</button>
        </div>
      </div>
    `;
  }

  renderContentStep(data) {
    const { material } = data;
    const html = material.content_html
      || `<p>${escapeHtml(material.summary || 'Isi materi belum tersedia.')}</p>`;

    const prerequisites = Array.isArray(material.prerequisites) && material.prerequisites.length
      ? `
        <div class="mt-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
          <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">Materi prasyarat</p>
          <div class="mt-2 flex flex-wrap gap-2">
            ${material.prerequisites.map(item => `<span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-brand-100">${escapeHtml(item.title)}</span>`).join('')}
          </div>
        </div>
      `
      : '';

    return `
      <article class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-9">
        <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">MATERI BELAJAR</p>
        <div class="material-content mt-4">${html}</div>
        ${prerequisites}

        <div class="mt-8 flex flex-col items-center justify-between gap-4 border-t border-brand-100 pt-5 sm:flex-row">
          <button type="button" data-action="close-material" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline sm:text-sm">
            &larr; Kembali ke daftar materi
          </button>
          <button type="button" data-action="set-step" data-step="2" class="w-full cursor-pointer rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:w-auto">
            Lanjut ke Ringkasan & Kuis &rarr;
          </button>
        </div>
      </article>
    `;
  }

  renderPracticeStep(data) {
    const { material, subject, nextMaterial, step } = data;
    const done = Boolean(material.is_completed);
    const nextLabel = nextMaterial ? `Selesai & Lanjut ke ${nextMaterial.title}` : 'Selesai & Kembali ke Quest';

    return `
      <div class="space-y-5">
        <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-9">
          <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">RINGKASAN</p>
          <h2 class="mt-1.5 font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">${escapeHtml(material.topic || material.title)}</h2>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">${escapeHtml(material.summary || 'Gunakan ringkasan ini untuk mengingat inti materi sebelum mengerjakan kuis.')}</p>

          <div class="mt-6 grid gap-3 sm:grid-cols-3">
            <div class="rounded-2xl bg-brand-50 p-4">
              <p class="text-[10px] font-extrabold uppercase tracking-wide text-brand-700">Mata pelajaran</p>
              <p class="mt-1 font-display text-sm font-extrabold text-ink-900">${escapeHtml(subject.name)}</p>
            </div>
            <div class="rounded-2xl bg-brand-50 p-4">
              <p class="text-[10px] font-extrabold uppercase tracking-wide text-brand-700">Estimasi belajar</p>
              <p class="mt-1 font-display text-sm font-extrabold text-ink-900">${escapeHtml(material.durationLabel || 'Materi singkat')}</p>
            </div>
            <div class="rounded-2xl bg-brand-50 p-4">
              <p class="text-[10px] font-extrabold uppercase tracking-wide text-brand-700">Status</p>
              <p class="mt-1 font-display text-sm font-extrabold ${done ? 'text-emerald-700' : 'text-ink-900'}">${done ? 'Sudah selesai' : 'Belum selesai'}</p>
            </div>
          </div>

          <div class="mt-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
            <h3 class="font-display text-base font-extrabold text-ink-900">Siap menguji pemahaman?</h3>
            <p class="mt-1 text-xs leading-relaxed text-slate-600">Kuis berisi soal dari backend sesuai jenjang, mapel, dan rankmu. Setiap jawaban salah mengurangi nyawa mapel. Materi tetap bisa dibaca saat nyawa habis.</p>
            <div class="mt-4 flex flex-col gap-3 sm:flex-row">
              <button type="button" data-action="finish-quiz" data-material="${material.id}"
                class="cursor-pointer rounded-2xl bg-brand-700 px-5 py-2.5 font-display text-xs font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:text-sm">
                ${done ? 'Kuis Lagi' : 'Mulai Kuis'} &rarr;
              </button>
              <button type="button" data-action="material-ask-ai" data-material="${material.id}"
                class="cursor-pointer rounded-2xl border-2 border-brand-700 px-5 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50 sm:text-sm">
                🦉 Tanya AI Tutor
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center justify-between gap-4 rounded-3xl border border-brand-100 bg-white p-5 sm:flex-row">
          <button type="button" data-action="set-step" data-step="1" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline sm:text-sm">
            &larr; Kembali ke Materi
          </button>
          <div class="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <button type="button" data-action="finish-next" data-current="${material.id}" data-next="${nextMaterial?.id || ''}"
              class="w-full cursor-pointer rounded-2xl border-2 border-brand-700 bg-white px-5 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50 sm:w-auto sm:text-sm">
              Tandai Selesai
            </button>
            <button type="button" data-action="finish-next" data-current="${material.id}" data-next="${nextMaterial?.id || ''}"
              class="w-full cursor-pointer rounded-2xl bg-brand-700 px-5 py-2.5 font-display text-xs font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:w-auto sm:text-sm">
              ${escapeHtml(nextLabel)}
            </button>
          </div>
        </div>

        <div class="text-center">
          <button type="button" data-action="set-step" data-step="1" class="text-[11px] font-bold text-slate-400 hover:text-brand-700">Lihat kembali isi materi (langkah ${step === 2 ? '1' : '1'})</button>
        </div>
      </div>
    `;
  }
}
