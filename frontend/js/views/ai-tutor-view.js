/**
 * AiTutorView — percakapan AI Tutor dengan mapel/materi dari backend.
 */
import { ASSETS } from '../assets/mascot-assets.js';
import { getRankAssetKey } from '../config/constants.js';
import { escapeHtml } from '../core/dom.js';
import { getShortName, jenjangText, xpPercent } from '../core/format.js';
import { starterIconSvg } from './helpers.js';

function formatAssistantText(text) {
  let safe = escapeHtml(text || '');
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/\n/g, '<br>');
  return safe;
}

export class AiTutorView {
  constructor(root) {
    this.root = root;
  }

  render(state) {
    const container = this.root.querySelector('#ai-tutor-root') || this.root;
    if (!container) return;

    const user = state.user;
    const shortName = getShortName(user.fullName);
    const subjects = state.quest?.subjects || [];
    const ai = state.aiTutor;
    const activeSubject = subjects.find(subject => Number(subject.id) === Number(ai.subjectId))
      || subjects[0]
      || null;
    const materials = activeSubject
      ? (state.quest?.materials || []).filter(material => Number(material.subject_id) === Number(activeSubject.id))
      : [];
    const activeMaterial = materials.find(material => Number(material.id) === Number(ai.materialId))
      || materials[0]
      || null;
    const rankAsset = ASSETS[getRankAssetKey(user.rank)] || '';

    if (!subjects.length) {
      container.innerHTML = `
        <div class="mx-auto max-w-2xl rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-card">
          <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-100 text-3xl">🦉</span>
          <h1 class="mt-5 font-display text-2xl font-extrabold text-ink-900">AI Tutor Menunggu Materi</h1>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">AI Tutor menjawab berdasarkan materi backend. Katalog untuk jenjangmu belum termuat atau belum tersedia.</p>
          <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" data-action="go" data-route="/quest" class="btn-primary">Buka Quest</button>
            <button type="button" data-action="ai-retry" class="btn-outline">Muat Ulang</button>
          </div>
        </div>
      `;
      return;
    }

    const subjectListHtml = subjects.map(subject => {
      const isActive = Number(subject.id) === Number(activeSubject?.id);
      const materialCount = subject.materials?.length || 0;
      return `
        <button type="button" data-action="select-ai-subject" data-subject="${subject.id}"
          class="flex w-full cursor-pointer items-center gap-3.5 rounded-2xl p-3.5 text-left transition ${
            isActive ? 'border-2 border-brand-700 bg-brand-50/90 shadow-2xs' : 'border border-brand-100 bg-white hover:bg-brand-50/40'
          }">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-lg">${escapeHtml(subject.icon || '📚')}</span>
          <div class="min-w-0">
            <p class="font-display text-sm font-extrabold text-ink-900">${escapeHtml(subject.name)}</p>
            <p class="truncate text-xs text-slate-500">${materialCount} materi · ${Number(subject.lives ?? 3)}/${Number(subject.max_lives ?? 3)} nyawa</p>
          </div>
        </button>
      `;
    }).join('');

    const materialOptions = materials.map(material => `
      <option value="${material.id}" ${Number(material.id) === Number(activeMaterial?.id) ? 'selected' : ''}>${escapeHtml(material.title)}</option>
    `).join('');

    const starters = this.startersFor(activeMaterial);
    const startersHtml = starters.map((starter, index) => `
      <button type="button" data-action="ask-ai-starter" data-index="${index}"
        class="group flex cursor-pointer flex-col justify-between rounded-2xl border border-brand-100 bg-white p-4 text-left transition hover:border-brand-300 hover:bg-brand-50/30">
        <div>
          <div class="flex items-center gap-2 font-display text-xs font-extrabold text-brand-700 sm:text-sm">
            ${starterIconSvg(starter.type)}
            <span>${escapeHtml(starter.title)}</span>
          </div>
          <p class="mt-2.5 text-xs leading-relaxed text-slate-600">${escapeHtml(starter.prompt)}</p>
        </div>
        <span class="mt-4 inline-block font-display text-xs font-extrabold text-brand-700 transition group-hover:translate-x-0.5">Tanyakan ini &rarr;</span>
      </button>
    `).join('');

    const loadingHtml = ai.isLoading ? `
      <div class="flex items-start gap-3.5">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-base">🦉</div>
        <div class="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-brand-100 bg-brand-50/60 px-4 py-3 text-xs text-slate-500">
          <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-500"></span>
          <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-500 [animation-delay:0.2s]"></span>
          <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-brand-500 [animation-delay:0.4s]"></span>
          <span class="ml-1 font-medium text-slate-600">AI Tutor sedang berpikir...</span>
        </div>
      </div>
    ` : '';

    const chatHistoryHtml = (ai.messages.length > 0 || ai.isLoading) ? `
      <div class="mt-5 space-y-4 border-t border-brand-100 pt-5">
        ${ai.messages.map(message => {
          if (message.role === 'user') {
            return `
              <div class="flex justify-end">
                <div class="max-w-lg whitespace-pre-line rounded-2xl rounded-tr-xs bg-brand-700 px-4 py-3 text-xs leading-relaxed text-white shadow-2xs sm:text-sm">${escapeHtml(message.text)}</div>
              </div>
            `;
          }
          const suggestions = Array.isArray(message.suggestions) && message.suggestions.length
            ? `<div class="mt-3 flex flex-wrap gap-2">${message.suggestions.map(item => `
                <button type="button" data-action="ask-ai-suggestion" data-question="${escapeHtml(item)}"
                  class="cursor-pointer rounded-full border border-brand-200 bg-white px-3 py-1 text-[11px] font-bold text-brand-700 transition hover:bg-brand-50">${escapeHtml(item)}</button>
              `).join('')}</div>`
            : '';
          return `
            <div class="flex items-start gap-3.5">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-base">🦉</div>
              <div class="min-w-0 flex-1 rounded-2xl rounded-tl-xs border border-brand-100 bg-brand-50/60 p-4 text-xs leading-relaxed text-ink-900 sm:text-sm">
                ${message.degraded ? '<p class="mb-2 rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">Mode terbatas</p>' : ''}
                <div>${formatAssistantText(message.text)}</div>
                ${suggestions}
              </div>
            </div>
          `;
        }).join('')}
        ${loadingHtml}
      </div>
    ` : '';

    const hasDraft = ai.draft.trim().length > 0;

    container.innerHTML = `
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 class="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">AI Tutor</h1>
          <p class="mt-1 text-xs text-slate-600 sm:text-sm">Teman berpikir untuk petualangan belajarmu. Pahami materi, selangkah demi selangkah.</p>
        </div>
        <span class="inline-flex items-center self-start rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">${escapeHtml(jenjangText(user))}</span>
      </div>

      <div class="grid items-start gap-6 lg:grid-cols-[290px_1fr]">
        <div class="space-y-4">
          <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
            <h2 class="font-display text-lg font-extrabold text-ink-900">Mau belajar apa?</h2>
            <p class="mt-0.5 text-xs text-slate-500">Mapel dengan materi tersedia untuk jenjangmu.</p>
            <div class="mt-4 space-y-2.5">${subjectListHtml}</div>
          </div>

          <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
            <div class="flex items-center justify-between font-display text-xs font-extrabold">
              <span class="inline-flex items-center gap-1.5 text-ink-900">
                ${rankAsset ? `<img src="${rankAsset}" alt="${escapeHtml(user.rank || '')}" class="h-4 w-4 object-contain" />` : ''}
                <span>Level ${Number(user.level || 1)} • ${escapeHtml(user.rank || 'Bronze')}</span>
              </span>
              <span class="text-brand-700">${Number(user.xp || 0)}/${Number(user.nextLevelXp || 100)} XP</span>
            </div>
            <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-100">
              <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width: ${xpPercent(user)}%"></div>
            </div>
          </div>

          <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
            <h3 class="font-display text-base font-extrabold text-ink-900">Tetap bisa lanjut belajar</h3>
            <p class="mt-1.5 text-xs leading-relaxed text-slate-600">Bertanya AI tidak memakai nyawa. Jika AI tidak tersedia, buka materi di Quest.</p>
            ${activeMaterial ? `
              <button type="button" data-action="open-material" data-subject="${activeSubject.id}" data-material="${activeMaterial.id}" data-step="1"
                class="mt-3 inline-block cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline">Buka materi ${escapeHtml(activeMaterial.title)} &rarr;</button>
            ` : ''}
          </div>
        </div>

        <div class="min-w-0 space-y-4">
          <div class="flex flex-col gap-3 rounded-3xl border border-brand-100 bg-white px-6 py-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div class="flex min-w-0 items-center gap-3.5">
              <span class="text-2xl">${escapeHtml(activeSubject?.icon || '📚')}</span>
              <div class="min-w-0">
                <p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">MATERI PERCAKAPAN</p>
                <h2 class="truncate font-display text-sm font-extrabold text-ink-900 sm:text-base">${escapeHtml(activeMaterial?.title || 'Pilih materi')}</h2>
              </div>
            </div>
            ${materials.length > 1 ? `
              <select data-field="ai-material" class="w-full rounded-xl border border-brand-100 bg-white px-3 py-2 text-xs font-bold text-ink-900 outline-none focus:border-brand-600 sm:w-auto">
                ${materialOptions}
              </select>
            ` : ''}
          </div>

          ${ai.error ? `
            <div class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">${escapeHtml(ai.error.message || 'AI Tutor sedang tidak tersedia.')}</div>
          ` : ''}

          <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-7">
            <div class="flex items-center justify-between gap-4 border-b border-brand-100 pb-4">
              <div class="flex items-center gap-3.5">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-xl">🦉</div>
                <div>
                  <h3 class="font-display text-base font-extrabold leading-tight text-ink-900">AI Tutor</h3>
                  <p class="mt-0.5 text-xs font-bold text-slate-600">Petunjuk bertahap dari materi backend.</p>
                </div>
              </div>
              <button type="button" data-action="reset-ai" class="shrink-0 cursor-pointer rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-200/70">Percakapan baru</button>
            </div>

            <div class="mt-5 flex flex-col items-center gap-4 sm:flex-row">
              <div class="flex shrink-0 justify-center">
                <img src="${ASSETS.mascot}" alt="Maskot EduQuest" class="h-auto w-24 select-none object-contain drop-shadow-sm sm:w-28" />
              </div>
              <div class="flex-1 rounded-3xl border border-brand-100 bg-brand-50/90 p-5 sm:p-6">
                <h4 class="font-display text-lg font-extrabold leading-snug text-ink-900 sm:text-2xl">Halo, ${escapeHtml(shortName)}! Siap belajar ${escapeHtml(activeMaterial?.title || 'materi baru')}? 🌟</h4>
                <p class="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">Tanyakan bagian yang belum jelas dari materi ini. Aku akan membantu menjelaskan dengan bahasa sederhana.</p>
              </div>
            </div>

            ${chatHistoryHtml}

            <div class="mt-6">
              <h4 class="font-display text-base font-extrabold text-ink-900">Bingung mulai dari mana?</h4>
              <p class="mt-0.5 text-xs text-slate-500">Pilih contoh pertanyaan, atau tulis pertanyaanmu sendiri.</p>
              <div class="mt-3.5 grid gap-4 md:grid-cols-3">${startersHtml}</div>
            </div>

            <form data-form="ai-tutor" class="mt-6">
              <label for="ai-tutor-textarea" class="mb-2 block text-xs font-extrabold text-ink-900">Pertanyaanmu</label>
              <div class="rounded-2xl border border-brand-100 bg-white p-4 transition focus-within:border-brand-600">
                <textarea id="ai-tutor-textarea" data-field="ai-draft" rows="2" placeholder="Tulis pertanyaan tentang materi ini..."
                  class="w-full resize-none text-xs text-ink-900 outline-none placeholder:text-slate-400 sm:text-sm">${escapeHtml(ai.draft)}</textarea>
                <div class="mt-3 flex items-center justify-between gap-3 border-t border-brand-50 pt-2">
                  <span class="text-[11px] text-slate-400">AI dapat keliru. Cocokkan dengan materi dan gurumu.</span>
                  <button type="submit" id="ai-tutor-send-btn" ${ai.isLoading || !activeMaterial ? 'disabled' : ''}
                    class="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-extrabold transition ${hasDraft && !ai.isLoading ? 'bg-brand-700 text-white shadow-btn hover:bg-brand-600' : 'bg-slate-200 text-slate-600'}">
                    <span>${ai.isLoading ? 'Mengirim...' : 'Kirim'}</span>
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div class="flex items-center gap-2 px-1 text-xs text-slate-500">
            <svg class="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01" /></svg>
            <span>AI bisa keliru. Cocokkan penjelasan dengan materi dan tanyakan kepada guru jika masih ragu.</span>
          </div>
        </div>
      </div>
    `;
  }

  startersFor(material) {
    if (!material) return [];
    const title = material.title;
    return [
      { title: 'Pahami inti materi', type: 'materi', prompt: `Jelaskan inti materi "${title}" dengan bahasa yang sederhana.` },
      { title: 'Minta contoh', type: 'contoh', prompt: `Beri satu contoh nyata yang berkaitan dengan "${title}".` },
      { title: 'Cek pemahaman', type: 'petunjuk', prompt: `Buat satu pertanyaan singkat untuk mengecek pemahaman saya tentang "${title}".` }
    ];
  }

  syncDraftButton(value) {
    const button = this.root.querySelector('#ai-tutor-send-btn');
    if (!button) return;
    const hasText = String(value || '').trim().length > 0;
    button.className = `inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-extrabold transition ${
      hasText ? 'bg-brand-700 text-white shadow-btn hover:bg-brand-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
    }`;
  }
}
