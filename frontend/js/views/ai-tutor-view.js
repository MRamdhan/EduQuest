/**
 * AiTutorView — halaman percakapan AI Tutor per mata pelajaran.
 * Markup dipindahkan dari halaman lama dan memakai atribut data-* untuk aksi.
 */
import { AI_TUTOR_TOPICS } from '../config/curriculum.js';
import { ASSETS } from '../assets/mascot-assets.js';
import { getRankAssetKey } from '../config/constants.js';
import { getShortName, jenjangText, xpPercent } from '../core/format.js';
import { starterIconSvg } from './helpers.js';

export class AiTutorView {
  constructor(root) {
    this.root = root;
  }

  render(state) {
    const container = this.root.querySelector('#ai-tutor-root') || this.root;
    const user = state.user;
    const shortName = getShortName(user.fullName);
    const topicData = AI_TUTOR_TOPICS[state.aiTutor.subject] || AI_TUTOR_TOPICS.IPS;
    const rankAsset = ASSETS[getRankAssetKey(user.rank)] || '';

    const subjectListHtml = Object.keys(AI_TUTOR_TOPICS).map(key => {
      const item = AI_TUTOR_TOPICS[key];
      const isActive = state.aiTutor.subject === key;
      return `
        <button type="button" data-action="select-ai-subject" data-subject="${key}"
          class="flex w-full cursor-pointer items-center gap-3.5 rounded-2xl p-3.5 text-left transition ${
            isActive
              ? 'border-2 border-brand-700 bg-brand-50/90 shadow-2xs'
              : 'border border-brand-100 bg-white hover:bg-brand-50/40'
          }">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-lg">
            ${item.icon}
          </span>
          <div class="min-w-0">
            <p class="font-display text-sm font-extrabold text-ink-900">${item.mapel}</p>
            <p class="truncate text-xs text-slate-500">${item.sub}</p>
          </div>
        </button>
      `;
    }).join('');

    const startersHtml = topicData.starters.map((starter, index) => `
      <button type="button" data-action="ask-ai-starter" data-index="${index}"
        class="group flex cursor-pointer flex-col justify-between rounded-2xl border border-brand-100 bg-white p-4 text-left transition hover:border-brand-300 hover:bg-brand-50/30">
        <div>
          <div class="flex items-center gap-2 font-display text-xs font-extrabold text-brand-700 sm:text-sm">
            ${starterIconSvg(starter.type)}
            <span>${starter.title}</span>
          </div>
          <p class="mt-2.5 text-xs leading-relaxed text-slate-600">${starter.prompt}</p>
        </div>
        <span class="mt-4 inline-block font-display text-xs font-extrabold text-brand-700 transition group-hover:translate-x-0.5">
          Tanyakan ini &rarr;
        </span>
      </button>
    `).join('');

    const loadingHtml = state.aiTutor.isLoading
      ? `
        <div class="flex items-start gap-3.5">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-base">
            🦉
          </div>
          <div class="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-brand-100 bg-brand-50/60 px-4 py-3 text-xs text-slate-500">
            <span class="inline-block h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            <span class="inline-block h-2 w-2 rounded-full bg-brand-500 animate-pulse [animation-delay:0.2s]"></span>
            <span class="inline-block h-2 w-2 rounded-full bg-brand-500 animate-pulse [animation-delay:0.4s]"></span>
            <span class="ml-1 font-medium text-slate-600">AI Tutor sedang berpikir...</span>
          </div>
        </div>
      `
      : '';

    const chatHistoryHtml = (state.aiTutor.messages.length > 0 || state.aiTutor.isLoading)
      ? `<div class="mt-5 space-y-4 border-t border-brand-100 pt-5">
           ${state.aiTutor.messages.map(message => {
             if (message.role === 'user') {
               return `
                 <div class="flex justify-end">
                   <div class="max-w-lg rounded-2xl rounded-tr-xs bg-brand-700 px-4 py-3 text-xs leading-relaxed text-white shadow-2xs sm:text-sm">
                     ${message.text}
                   </div>
                 </div>
               `;
             }
             return `
               <div class="flex items-start gap-3.5">
                 <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-base">
                   🦉
                 </div>
                 <div class="flex-1 space-y-2 rounded-2xl rounded-tl-xs border border-brand-100 bg-brand-50/60 p-4 text-xs leading-relaxed text-ink-900 sm:text-sm">
                   ${(message.steps || []).map((line, index) => `
                     <p class="${index === message.steps.length - 1 ? 'font-bold text-brand-700' : ''}">${line}</p>
                   `).join('')}
                 </div>
               </div>
             `;
           }).join('')}
           ${loadingHtml}
         </div>`
      : '';

    const hasDraft = state.aiTutor.draft.trim().length > 0;

    container.innerHTML = `
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 class="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">AI Tutor</h1>
          <p class="mt-1 text-xs text-slate-600 sm:text-sm">
            Teman berpikir untuk petualangan belajarmu. Pahami konsep, selangkah demi selangkah.
          </p>
        </div>
        <span class="inline-flex items-center self-start rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">
          ${jenjangText(user)}
        </span>
      </div>

      <div class="grid items-start gap-6 lg:grid-cols-[290px_1fr]">
        <div class="space-y-4">
          <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
            <h2 class="font-display text-lg font-extrabold text-ink-900">Mau belajar apa?</h2>
            <p class="mt-0.5 text-xs text-slate-500">Pilihan mapel untuk jenjang ${user.jenjang}.</p>
            <div class="mt-4 space-y-2.5">${subjectListHtml}</div>
            <p class="mt-4 text-[11px] leading-relaxed text-slate-500">
              Topik di atas adalah contoh untuk memulai, bukan seluruh cakupan materi.
            </p>
          </div>

          <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
            <div class="flex items-center justify-between font-display text-xs font-extrabold">
              <span class="inline-flex items-center gap-1.5 text-ink-900">
                ${rankAsset ? `<img src="${rankAsset}" alt="${user.rank}" class="h-4 w-4 object-contain" />` : ''}
                <span>Level ${user.level} • ${user.rank}</span>
              </span>
              <span class="text-brand-700">${user.xp}/${user.nextLevelXp} XP ke Level ${user.level + 1}</span>
            </div>
            <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-100">
              <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width: ${xpPercent(user)}%"></div>
            </div>
          </div>

          <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
            <h3 class="font-display text-base font-extrabold text-ink-900">Tetap bisa lanjut belajar</h3>
            <p class="mt-1.5 text-xs leading-relaxed text-slate-600">
              Nyawa ${topicData.mapel} pulih 1 tiap 1 jam. Bertanya AI tidak memakai nyawa. Jika AI tidak tersedia, buka materi di Quest.
            </p>
            <button type="button" data-action="open-material" data-bab="bab-01" data-mat="mat-1-1" data-step="1"
              class="mt-3 inline-block cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline">
              Buka materi di Quest &rarr;
            </button>
          </div>
        </div>

        <div class="min-w-0 space-y-4">
          <div class="flex items-center gap-3.5 rounded-3xl border border-brand-100 bg-white px-6 py-4 shadow-xs">
            <span class="text-2xl">${topicData.icon}</span>
            <div class="min-w-0">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">TOPIK PERCAKAPAN</p>
              <h2 class="truncate font-display text-sm font-extrabold text-ink-900 sm:text-base">${topicData.topicHeader}</h2>
            </div>
          </div>

          <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-7">
            <div class="flex items-center justify-between gap-4 border-b border-brand-100 pb-4">
              <div class="flex items-center gap-3.5">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-xl">🦉</div>
                <div>
                  <h3 class="font-display text-base font-extrabold leading-tight text-ink-900">AI Tutor</h3>
                  <p class="mt-0.5 text-xs font-bold text-slate-600">Petunjuk bertahap, bukan jawaban akhir.</p>
                </div>
              </div>
              <button type="button" data-action="reset-ai"
                class="shrink-0 cursor-pointer rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-200/70">
                Percakapan baru
              </button>
            </div>

            <div class="mt-5 flex flex-col items-center gap-4 sm:flex-row">
              <div class="flex shrink-0 justify-center">
                <img src="${ASSETS.mascot}" alt="Maskot Penjelajah Cilik EduQuest"
                  class="h-auto w-24 select-none object-contain drop-shadow-sm sm:w-28" />
              </div>
              <div class="flex-1 rounded-3xl border border-brand-100 bg-brand-50/90 p-5 sm:p-6">
                <h4 class="font-display text-lg font-extrabold leading-snug text-ink-900 sm:text-2xl">
                  Halo, ${shortName}! ${topicData.greetingTitle} 🌟
                </h4>
                <p class="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">${topicData.greetingBody}</p>
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
                <textarea id="ai-tutor-textarea" data-field="ai-draft" rows="2"
                  placeholder="Tulis pertanyaan atau soal yang ingin kamu pahami..."
                  class="w-full resize-none text-xs text-ink-900 outline-none placeholder:text-slate-400 sm:text-sm">${state.aiTutor.draft}</textarea>
                <div class="mt-3 flex items-center justify-between gap-3 border-t border-brand-50 pt-2">
                  <span class="text-[11px] text-slate-400">Tulis pertanyaanmu untuk mengirim.</span>
                  <button type="submit" id="ai-tutor-send-btn"
                    class="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-extrabold transition ${
                      hasDraft
                        ? 'bg-brand-700 text-white shadow-btn hover:bg-brand-600'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }">
                    <span>Kirim</span>
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div class="flex items-center gap-2 px-1 text-xs text-slate-500">
            <svg class="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01" />
            </svg>
            <span>AI bisa keliru. Cocokkan penjelasan dengan materi dan tanyakan kepada guru jika masih ragu.</span>
          </div>
        </div>
      </div>
    `;
  }

  syncDraftButton(value) {
    const button = this.root.querySelector('#ai-tutor-send-btn');
    if (!button) return;
    const hasText = value.trim().length > 0;
    button.className = `inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-extrabold transition ${
      hasText
        ? 'bg-brand-700 text-white shadow-btn hover:bg-brand-600'
        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
    }`;
  }

  rankKey(rank) {
    return getRankAssetKey(rank);
  }
}
