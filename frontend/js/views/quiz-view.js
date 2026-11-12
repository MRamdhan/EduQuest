/**
 * QuizView — sembilan layar simulasi Kuis 3 Nyawa.
 * View hanya menggambar berdasarkan state; transisi ada di QuizModel.
 */
import { ASSETS } from '../assets/mascot-assets.js';
import { getRankAssetKey } from '../config/constants.js';
import { getShortName, jenjangText } from '../core/format.js';
import { renderHeartsInline } from './helpers.js';

export class QuizView {
  constructor(root) {
    this.root = root;
  }

  render(state) {
    const user = state.user;
    const shortName = getShortName(user.fullName);
    const displayJenjang = jenjangText(user);
    const mascotSrc = ASSETS.mascot;
    const rankSrc = ASSETS[getRankAssetKey(user.rank)] || '';
    const step = state.quiz.step;
    const returnLabel = this.returnLabel(state.quiz.returnPath);
    const completedCount = Object.keys(state.completedMaterials || {}).length;

    const displayTotalXp = user.totalXp || 0;
    const displayCurrXp = user.xp || 0;
    const displayNextXp = user.nextLevelXp || 100;
    const percent = displayNextXp > 0 ? Math.min(100, Math.round((displayCurrXp / displayNextXp) * 100)) : 0;
    const remainingXp = Math.max(0, displayNextXp - displayCurrXp);

    const context = {
      user, shortName, displayJenjang, mascotSrc, rankSrc, step, returnLabel,
      displayTotalXp, displayCurrXp, displayNextXp, percent, remainingXp, completedCount,
      lives: state.quiz.lives,
      q1Selected: state.quiz.q1Selected,
      totalQuizzes: state.profileStats?.total_quizzes
        ?? (Array.isArray(state.profileQuizHistory) ? state.profileQuizHistory.length : 0)
    };

    let bodyHtml = '';
    if (step === 1) bodyHtml = this.renderPreparation(context);
    else if (step >= 2 && step <= 5) bodyHtml = this.renderQuestionOne(context);
    else if (step === 6) bodyHtml = this.renderQuestionTwo(context);
    else if (step === 7) bodyHtml = this.renderResult(context);
    else if (step === 8) bodyHtml = this.renderReview(context, state);
    else if (step === 9) bodyHtml = this.renderOutOfLives(context, state);

    this.root.innerHTML = bodyHtml;
  }

  rankKey(rank) {
    return getRankAssetKey(rank);
  }

  returnLabel(path) {
    if (path === '/beranda') return 'Beranda';
    if (path === '/quest' || path?.startsWith('/quest/')) return 'Quest';
    if (path === '/ai-tutor') return 'AI Tutor';
    if (path === '/profil') return 'Profil Saya';
    return 'Quest';
  }

  render10Segments(filledCount) {
    let segments = '';
    for (let index = 1; index <= 10; index += 1) {
      segments += `<div class="h-1.5 flex-1 rounded-full ${index <= filledCount ? 'bg-brand-700' : 'bg-brand-100'}"></div>`;
    }
    return `<div class="mt-2.5 flex items-center gap-1.5">${segments}</div>`;
  }

  renderPreparation(ctx) {
    const { user, shortName, displayJenjang, rankSrc, displayTotalXp, displayCurrXp, displayNextXp, percent, remainingXp, returnLabel, mascotSrc } = ctx;
    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Peta dan Letak Wilayah</p>
          <button type="button" data-action="exit-quiz" class="cursor-pointer text-xs font-extrabold text-slate-500 hover:text-brand-700">
            &larr; Kembali ke ${returnLabel}
          </button>
        </div>
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 class="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Siap melanjutkan petualangan, ${shortName}?</h1>
            <p class="mt-1 text-xs text-slate-600 sm:text-sm">Uji pemahamanmu setelah mempelajari materi. Baca panduan singkat sebelum mulai.</p>
          </div>
          <span class="inline-flex items-center self-start rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">${displayJenjang}</span>
        </div>

        <div class="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <div class="space-y-6">
            <div class="space-y-6 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
              <div class="flex items-start gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-2xl">🌍</div>
                <div>
                  <span class="inline-block rounded-full bg-brand-100 px-3 py-0.5 font-display text-xs font-extrabold text-brand-700">IPS • Tingkat Sedang</span>
                  <h2 class="mt-1.5 font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">Peta dan Letak Wilayah</h2>
                  <p class="mt-0.5 text-xs text-slate-500 sm:text-sm">${displayJenjang} • Peta dan Wilayah</p>
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-3">
                <div class="rounded-2xl bg-brand-50/60 p-4">
                  <p class="font-display text-2xl font-extrabold text-ink-900">10 soal</p>
                  <p class="mt-0.5 text-xs text-slate-500">Pilihan ganda</p>
                </div>
                <div class="rounded-2xl bg-brand-50/60 p-4">
                  <p class="font-display text-2xl font-extrabold text-brand-700">80 XP</p>
                  <p class="mt-0.5 text-xs text-slate-500">Maksimal XP sesi</p>
                </div>
                <div class="rounded-2xl bg-brand-50/60 p-4">
                  <p class="font-display text-2xl font-extrabold text-ink-900">Bronze</p>
                  <p class="mt-0.5 text-xs text-slate-500">Rank minimum</p>
                </div>
              </div>

              <div class="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4">
                <p class="font-display text-sm font-extrabold text-emerald-800">✓ Semua prasyarat terpenuhi</p>
                <p class="mt-1 text-xs text-slate-600 sm:text-sm">Prasyarat tantangan siap. Rank ${user.rank} kamu memenuhi ketentuan petualangan ini.</p>
              </div>
            </div>

            <div class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
              <h3 class="font-display text-xl font-extrabold text-ink-900">Kenali aturan tantangannya</h3>
              <div class="space-y-4">
                ${[
                  ['2 percobaan per soal', 'Pilih jawaban, lalu periksa. Kesempatan kedua tersedia jika nyawa masih ada.'],
                  ['Salah mengurangi 1 nyawa IPS', 'Nyawa berkurang setelah jawaban diperiksa. Saat habis, kuis berhenti.'],
                  ['1 nyawa pulih tiap 1 jam', 'Maksimal 3 nyawa per mapel. Membaca materi tetap bisa saat nyawa habis.'],
                  ['8 XP per jawaban benar', 'Maksimal 80 XP dari 10 soal. Tidak ada batas waktu pengerjaan.']
                ].map(([title, description]) => `
                  <div class="flex items-start gap-3.5">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm text-brand-700">💡</span>
                    <div>
                      <h4 class="font-display text-sm font-extrabold text-ink-900">${title}</h4>
                      <p class="mt-0.5 text-xs text-slate-500">${description}</p>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="flex items-center justify-between gap-4 border-t border-brand-100 pt-4">
                <button type="button" data-action="exit-quiz" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline sm:text-sm">
                  &larr; Kembali ke ${returnLabel}
                </button>
                <button type="button" data-action="quiz-step" data-step="2" class="cursor-pointer rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn transition hover:bg-brand-600">
                  Mulai Kuis &rarr;
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
              <div class="flex items-center gap-3.5">
                <img src="${rankSrc}" alt="${user.rank}" class="h-11 w-11 shrink-0 object-contain" />
                <div>
                  <h3 class="font-display text-base font-extrabold text-ink-900">${user.fullName}</h3>
                  <p class="text-xs text-slate-500">Level ${user.level} • Rank ${user.rank}</p>
                </div>
              </div>

              <div class="space-y-2.5 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                <div class="flex items-center justify-between font-display text-[11px] font-extrabold">
                  <span class="text-ink-900">Level ${user.level} • ${user.rank}</span>
                  <span class="text-brand-700">${displayTotalXp} XP • ${displayCurrXp}/${displayNextXp} ke Lv. ${user.level + 1}</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
                  <div class="h-full rounded-full bg-brand-700" style="width: ${percent}%"></div>
                </div>
                <div class="flex items-center justify-between pt-1 text-xs">
                  <div class="flex items-center gap-1">${renderHeartsInline(3, 3, 'w-3.5 h-3.5')}</div>
                  <span class="font-display font-extrabold text-ink-900">Nyawa IPS 3/3</span>
                </div>
              </div>

              <p class="text-xs leading-relaxed text-slate-600">
                ${displayCurrXp}/${displayNextXp} XP • ${percent}% ke Level ${user.level + 1}<br>
                Sisa ${remainingXp} XP menuju Level ${user.level + 1}.
              </p>

              <div class="border-t border-brand-100 pt-3">
                <div class="flex items-center justify-between">
                  <span class="font-display text-xs font-extrabold text-ink-900">Nyawa IPS</span>
                  <span class="rounded-full bg-brand-100 px-2.5 py-0.5 font-display text-xs font-extrabold text-brand-700">3/3</span>
                </div>
                <div class="mt-2 flex items-center gap-1.5">${renderHeartsInline(3, 3, 'w-6 h-6')}</div>
                <p class="mt-2 text-xs text-slate-600">Penuh. Siap untuk tantangan ini.</p>
                <p class="mt-0.5 text-[11px] text-slate-400">Terpisah per mata pelajaran • Maks. 3</p>
              </div>
            </div>

            <div class="space-y-3 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">🌍</span>
                <div>
                  <h4 class="font-display text-base font-extrabold text-ink-900">IPS</h4>
                  <p class="text-xs font-bold text-brand-700">Peta dan Letak Wilayah</p>
                </div>
              </div>
              <div class="flex justify-between pt-1 text-xs font-extrabold ${ctx.completedCount > 0 ? 'text-brand-700' : 'text-slate-500'}">
                <span>${ctx.completedCount > 0 ? 'Materi terkait selesai' : 'Materi pengantar'}</span>
                <span>${ctx.completedCount > 0 ? '100%' : '0%'}</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full ${ctx.completedCount > 0 ? 'bg-emerald-100' : 'bg-slate-100'}">
                <div class="h-full rounded-full ${ctx.completedCount > 0 ? 'w-full bg-emerald-700' : 'w-0 bg-brand-700'}"></div>
              </div>
              <button type="button" data-action="open-material" data-bab="bab-01" data-mat="mat-1-1" data-step="1"
                class="mt-2 w-full cursor-pointer rounded-xl border-2 border-brand-700 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50">
                ${ctx.completedCount > 0 ? 'Baca Ulang Materi' : 'Pelajari Materi Terkait'}
              </button>
            </div>

            <div class="flex items-center gap-3.5 px-2 pt-1">
              <img src="${mascotSrc}" alt="Maskot" class="h-12 w-12 shrink-0 object-contain" />
              <p class="text-xs leading-relaxed text-slate-600">Tidak perlu terburu-buru. Pahami soal, lalu tentukan jawabanmu.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderQuestionOne(ctx) {
    const { user, displayJenjang, mascotSrc, step, completedCount } = ctx;
    const isStep2 = step === 2;
    const isStep3 = step === 3;
    const isStep4 = step === 4;
    const isStep5 = step === 5;

    const lives = isStep2 || isStep3 ? 3 : isStep4 ? 2 : 1;
    const doneCount = isStep5 ? 1 : 0;
    const donePercent = isStep5 ? '10%' : '0%';
    const attemptsUsed = isStep2 || isStep3 ? 0 : isStep4 ? 1 : 2;
    const selected = ctx.q1Selected || (isStep3 ? 'A' : null);

    const subHeader = isStep2
      ? 'Baca soal dengan teliti, lalu pilih jawaban yang paling tepat.'
      : isStep3
      ? 'Sudah yakin dengan pilihanmu? Periksa untuk melihat hasilnya.'
      : isStep4
      ? 'Belum tepat bukan berarti berhenti. Gunakan petunjuk, lalu coba sekali lagi.'
      : 'Soal pertama sudah selesai. Pelajari pembahasannya sebelum melanjutkan.';

    const options = [
      { code: 'A', label: '600 m' },
      { code: 'B', label: '6 km' },
      { code: 'C', label: '60 km' },
      { code: 'D', label: '600 km' }
    ];

    const optionsHtml = options.map(option => {
      if (isStep5) {
        if (option.code === 'A') {
          return this.fixedOption(option.code, option.label, 'Salah • Percobaan 1', 'rose');
        }
        if (option.code === 'B') {
          return this.fixedOption(option.code, option.label, '✓ Jawaban benar', 'emerald');
        }
        if (option.code === 'C') {
          return this.fixedOption(option.code, option.label, 'Salah • Percobaan 2', 'rose');
        }
        return this.mutedOption(option.code, option.label);
      }

      if (isStep4 && option.code === 'A') {
        return this.fixedOption(option.code, option.label, 'Salah • Percobaan 1', 'rose');
      }

      const isSelected = selected === option.code && !(isStep4 && option.code === 'A');
      return `
        <button type="button" data-action="select-option" data-option="${option.code}"
          class="flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3.5 text-left transition ${
            isSelected ? 'border-2 border-brand-700 bg-brand-50/80 shadow-2xs' : 'border border-brand-100 bg-white hover:bg-brand-50/40'
          }">
          <div class="flex items-center gap-3.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-extrabold ${
              isSelected ? 'bg-brand-700 text-white' : 'bg-brand-50 text-ink-900'
            }">${option.code}</span>
            <span class="font-display text-sm ${isSelected ? 'font-extrabold text-ink-900' : 'font-semibold text-ink-900'} sm:text-base">${option.label}</span>
          </div>
          ${isSelected ? '<span class="font-display text-xs font-extrabold text-brand-700">Dipilih</span>' : ''}
        </button>
      `;
    }).join('');

    const actionButton = isStep5
      ? `<button type="button" data-action="quiz-step" data-step="6" class="cursor-pointer rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn transition hover:bg-brand-600">Soal Berikutnya &rarr;</button>`
      : isStep3 || (isStep4 && selected && selected !== 'A')
      ? `<button type="button" data-action="check-answer" class="cursor-pointer rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn transition hover:bg-brand-600">${isStep4 ? 'Periksa lagi' : 'Periksa Jawaban'}</button>`
      : `<button type="button" data-action="quiz-step" data-step="${isStep2 ? 3 : 5}" class="cursor-pointer rounded-2xl bg-slate-200 px-6 py-3 font-display text-sm font-extrabold text-slate-500 transition hover:bg-slate-300">${isStep4 ? 'Periksa lagi' : 'Periksa Jawaban'}</button>`;

    return `
      <div class="space-y-6">
        <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Peta dan Letak Wilayah</p>
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 class="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Peta dan Letak Wilayah</h1>
            <p class="mt-1 text-xs text-slate-600 sm:text-sm">${subHeader}</p>
          </div>
          <span class="inline-flex items-center self-start rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">${displayJenjang}</span>
        </div>

        <div class="flex flex-col justify-between gap-4 rounded-3xl border border-brand-100 bg-white px-6 py-4 shadow-xs md:flex-row md:items-center">
          <div class="flex-1">
            <div class="flex items-center justify-between font-display text-xs font-extrabold">
              <span class="text-ink-900">${doneCount} dari 10 soal terselesaikan</span>
              <span class="text-brand-700">${donePercent}</span>
            </div>
            ${this.render10Segments(doneCount)}
          </div>
          <div class="flex items-center gap-6 border-brand-100 md:border-l md:pl-6">
            <div>
              <div class="flex items-center gap-1.5">
                ${renderHeartsInline(lives, 3, 'w-4 h-4')}
                <span class="ml-1 font-display text-sm font-extrabold text-[#b91c47]">${lives}/3</span>
              </div>
              <p class="mt-0.5 text-[11px] text-slate-500">Nyawa IPS</p>
            </div>
            <div class="border-l border-brand-100 pl-4">
              <p class="font-display text-lg font-extrabold text-brand-700">+0 XP</p>
              <p class="text-[11px] text-slate-500">Sesi ini</p>
            </div>
          </div>
        </div>

        <div class="grid items-start gap-6 lg:grid-cols-[1fr_330px]">
          <div class="space-y-4">
            <div class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
              <div class="flex items-center justify-between">
                <span class="rounded-full bg-brand-100/90 px-3.5 py-1 font-display text-xs font-extrabold text-brand-700">SOAL 01 / 10</span>
                <span class="text-xs font-extrabold text-slate-500">${attemptsUsed} dari 2 percobaan terpakai</span>
              </div>

              <div>
                <h2 class="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">Menghitung jarak sebenarnya</h2>
                <p class="mt-2.5 text-sm leading-relaxed text-ink-900 sm:text-base">
                  Sebuah peta memiliki skala 1 : 200.000. Jarak dua lokasi pada peta adalah 3 cm. Berapa jarak sebenarnya antara kedua lokasi tersebut?
                </p>
              </div>

              <div class="flex flex-col justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/75 p-5 sm:flex-row sm:items-center">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-xs font-extrabold text-brand-700">P</span>
                    <div class="relative flex h-0.5 flex-1 items-center justify-center bg-brand-300">
                      <span class="bg-brand-50 px-2 font-display text-xs font-extrabold text-brand-700">3 cm</span>
                    </div>
                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-xs font-extrabold text-brand-700">Q</span>
                  </div>
                  <p class="mt-2 text-[11px] text-slate-500">Ilustrasi jarak dua lokasi pada peta</p>
                </div>
                <div class="border-brand-200/60 sm:border-l sm:pl-6">
                  <p class="text-xs text-slate-500">Skala peta</p>
                  <p class="font-display text-xl font-extrabold text-ink-900">1 : 200.000</p>
                </div>
              </div>

              <div class="space-y-3">${optionsHtml}</div>

              ${isStep4 ? `
                <div class="rounded-2xl border border-amber-200/80 bg-[#fef7ec] p-5">
                  <h4 class="font-display text-sm font-extrabold text-[#9a5b13]">Belum tepat. Kamu masih punya 1 kesempatan.</h4>
                  <p class="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    Jawaban A sudah diperiksa: nyawa IPS berkurang 1 menjadi 2/3. Pilih jawaban lain untuk mencoba lagi; soal ini belum selesai.
                  </p>
                </div>
              ` : ''}

              ${isStep5 ? `
                <div class="rounded-2xl border border-rose-200 bg-rose-50/70 p-5">
                  <h4 class="font-display text-sm font-extrabold text-[#b91c47]">Dua percobaan habis • Soal selesai salah</h4>
                  <p class="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    Jawaban C juga belum tepat. Nyawa IPS kini 1/3. Kunci: B, 6 km.<br>
                    3 × 200.000 cm = 600.000 cm = 6 km. Dari cm ke km, bagi 100.000. Semua pilihan terkunci; tidak ada percobaan ketiga.
                  </p>
                </div>
              ` : ''}

              <div class="flex items-center justify-between gap-4 border-t border-brand-100 pt-4">
                <span class="text-xs text-slate-500">
                  ${isStep2 ? 'Pilih satu jawaban terlebih dahulu.' : isStep3 ? 'Pilihanmu belum diperiksa.' : isStep4 ? 'Pilih jawaban baru untuk melanjutkan.' : 'Jawaban tersimpan • Tidak bisa diubah'}
                </span>
                ${actionButton}
              </div>
            </div>

            <div class="flex items-center gap-4 px-2 text-xs">
              <button type="button" data-action="exit-quiz" class="cursor-pointer font-display font-extrabold text-brand-700 hover:underline">&larr; Keluar dari Kuis</button>
              <span class="text-slate-400">IPS • Peta dan Letak Wilayah • Tingkat Sedang</span>
            </div>
          </div>

          <div class="space-y-4">
            <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="font-display text-xs font-extrabold text-ink-900">Nyawa IPS</span>
                <span class="rounded-full px-2.5 py-0.5 font-display text-xs font-extrabold ${lives === 1 ? 'bg-rose-50 text-[#b91c47]' : 'bg-brand-100 text-brand-700'}">${lives}/3</span>
              </div>
              <div class="mt-2.5 flex items-center gap-1.5">${renderHeartsInline(lives, 3, 'w-6 h-6')}</div>
              <p class="mt-2.5 text-xs text-slate-600">${lives === 3 ? 'Penuh. Siap untuk tantangan ini.' : 'Pulih 1 nyawa tiap 1 jam.'}</p>
              <p class="mt-0.5 text-[11px] text-slate-400">Terpisah per mata pelajaran • Maks. 3</p>
            </div>

            ${isStep4 ? this.renderAiHintPanel() : isStep5 ? `
              <div class="space-y-3 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
                <div class="flex items-center gap-3">
                  <img src="${mascotSrc}" alt="Maskot" class="h-12 w-12 shrink-0 object-contain" />
                  <h4 class="font-display text-base font-extrabold text-ink-900">Teruskan petualanganmu</h4>
                </div>
                <p class="text-xs leading-relaxed text-slate-600">Tidak apa-apa, sekarang kamu tahu letak kekeliruannya. Terapkan pemahaman ini pada soal berikutnya.</p>
                <span class="inline-block rounded-full bg-rose-50 px-3 py-1 font-display text-xs font-extrabold text-[#b91c47]">Soal 01 • 0 XP</span>
              </div>
            ` : `
              <div class="space-y-3.5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
                <div class="flex items-center gap-3">
                  <img src="${mascotSrc}" alt="Maskot" class="h-12 w-12 shrink-0 object-contain" />
                  <h4 class="font-display text-base font-extrabold text-ink-900">Pahami, pilih, periksa</h4>
                </div>
                <p class="text-xs leading-relaxed text-slate-600">Nyawa tidak berkurang saat memilih. Jawaban baru dinilai setelah kamu menekan Periksa Jawaban.</p>
                <button type="button" data-action="quiz-step" data-step="4" class="block cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline">☼ Buka Petunjuk Materi</button>
                <button type="button" data-action="quiz-step" data-step="4" class="block cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline">Tanya AI Tutor &rarr;</button>
                <p class="pt-1 text-[11px] leading-relaxed text-slate-400">Petunjuk bertahap, bukan kunci jawaban. Petunjuk materi tetap tersedia tanpa AI.</p>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  fixedOption(code, label, note, tone) {
    const isRose = tone === 'rose';
    const border = isRose ? 'border-[#b91c47]' : 'border-emerald-700';
    const bg = isRose ? 'bg-rose-50/40' : 'bg-emerald-50/50';
    const badge = isRose ? 'bg-[#b91c47]' : 'bg-emerald-700';
    const text = isRose ? 'text-[#b91c47]' : 'text-emerald-800';
    return `
      <div class="flex items-center justify-between rounded-2xl border-2 ${border} ${bg} px-4 py-3.5">
        <div class="flex items-center gap-3.5">
          <span class="flex h-8 w-8 items-center justify-center rounded-full ${badge} font-display text-xs font-extrabold text-white">${code}</span>
          <span class="font-display text-sm font-extrabold text-ink-900 sm:text-base">${label}</span>
        </div>
        <span class="font-display text-xs font-extrabold ${text}">${note}</span>
      </div>
    `;
  }

  mutedOption(code, label) {
    return `
      <div class="flex items-center gap-3.5 rounded-2xl border border-brand-100 bg-white px-4 py-3.5 opacity-60">
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 font-display text-xs font-extrabold text-ink-900">${code}</span>
        <span class="font-display text-sm font-semibold text-slate-500 sm:text-base">${label}</span>
      </div>
    `;
  }

  renderAiHintPanel() {
    return `
      <div class="space-y-3.5 rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-lg">🦉</div>
            <div>
              <h4 class="font-display text-sm font-extrabold text-ink-900">AI Tutor</h4>
              <p class="text-xs font-extrabold text-emerald-700">Petunjuk bertahap</p>
            </div>
          </div>
          <span class="text-xs text-slate-400">✕</span>
        </div>

        <div class="rounded-2xl bg-brand-700 p-3.5 text-xs leading-relaxed text-white">Aku memilih 600 m. Apa yang perlu kuperhatikan?</div>

        <div class="space-y-2 rounded-2xl border border-brand-100 p-4 text-xs leading-relaxed text-ink-900">
          <p>1. Perhatikan satuannya. Jarak pada peta ditulis dalam cm. Satuan apa yang diperoleh setelah dikalikan skala?</p>
          <p>2. Ingat hubungan satuan. Ada 100 cm dalam 1 m dan 1.000 m dalam 1 km.</p>
          <p class="font-semibold text-brand-700">3. Hitung dalam cm dahulu, lalu ubah ke km. Periksa kembali jumlah nol sebelum memilih.</p>
        </div>

        <form data-form="quiz-ai" class="flex items-center gap-2 rounded-2xl border border-brand-100 py-1.5 pl-3.5 pr-1.5">
          <input data-field="quiz-ai-input" type="text" placeholder="Tanya langkah yang membingungkan..." class="w-full text-xs outline-none" />
          <button type="submit" class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-brand-700 text-white">&uarr;</button>
        </form>
      </div>
      <p class="px-1 text-[11px] text-slate-400">AI bisa keliru. Cocokkan dengan materi atau tanyakan kepada guru.</p>
      <div class="space-y-2.5 rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
        <div class="flex items-center gap-2 font-display text-sm font-extrabold text-ink-900">
          <span class="text-[#9a5b13]">💡</span>
          <span>Petunjuk materi • Tanpa AI</span>
        </div>
        <p class="text-xs leading-relaxed text-slate-600">Kalikan jarak pada peta dengan penyebut skala. Hasilnya masih dalam cm. Samakan satuan sebelum membandingkan pilihan.</p>
        <button type="button" data-action="open-material" data-bab="bab-01" data-mat="mat-1-2" data-step="1" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline">Buka konsep skala &amp; satuan &rarr;</button>
        <p class="text-[11px] text-slate-400">Tetap tersedia jika AI tidak bisa digunakan.</p>
      </div>
    `;
  }

  renderQuestionTwo(ctx) {
    const { user, displayJenjang, mascotSrc, rankSrc } = ctx;
    const lives = Math.max(1, ctx.lives ?? 2);
    const badgeClass = lives === 1 ? 'bg-rose-50 text-[#b91c47]' : 'bg-brand-100 text-brand-700';

    return `
      <div class="space-y-6">
        <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Peta dan Letak Wilayah</p>
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 class="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Peta dan Letak Wilayah</h1>
            <p class="mt-1 text-xs text-slate-600 sm:text-sm">Bagus, ${ctx.shortName}! Pemahaman arah mata anginmu sudah tepat.</p>
          </div>
          <span class="inline-flex items-center self-start rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">${displayJenjang}</span>
        </div>

        <div class="flex flex-col justify-between gap-4 rounded-3xl border border-brand-100 bg-white px-6 py-4 shadow-xs md:flex-row md:items-center">
          <div class="flex-1">
            <div class="flex items-center justify-between font-display text-xs font-extrabold">
              <span class="text-ink-900">2 dari 10 soal terselesaikan</span>
              <span class="text-brand-700">20%</span>
            </div>
            ${this.render10Segments(2)}
          </div>
          <div class="flex items-center gap-6 border-brand-100 md:border-l md:pl-6">
            <div>
              <div class="flex items-center gap-1.5">
                ${renderHeartsInline(lives, 3, 'w-4 h-4')}
                <span class="ml-1 font-display text-sm font-extrabold ${lives === 1 ? 'text-[#b91c47]' : 'text-brand-700'}">${lives}/3</span>
              </div>
              <p class="mt-0.5 text-[11px] text-slate-500">Nyawa IPS</p>
            </div>
            <div class="border-l border-brand-100 pl-4">
              <p class="font-display text-lg font-extrabold text-brand-700">+8 XP</p>
              <p class="text-[11px] text-slate-500">Sesi ini</p>
            </div>
          </div>
        </div>

        <div class="grid items-start gap-6 lg:grid-cols-[1fr_330px]">
          <div class="space-y-4">
            <div class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
              <div class="flex items-center justify-between">
                <span class="rounded-full bg-brand-100/90 px-3.5 py-1 font-display text-xs font-extrabold text-brand-700">SOAL 02 / 10</span>
                <span class="text-xs font-extrabold text-slate-500">1 dari 2 percobaan terpakai</span>
              </div>

              <div>
                <h2 class="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">Membaca arah mata angin</h2>
                <p class="mt-2.5 text-sm leading-relaxed text-ink-900 sm:text-base">Arah utara pada peta mengarah ke atas. Pasar terletak di sebelah kanan sekolah. Pasar berada di arah ...</p>
              </div>

              <div class="flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50/75 p-5">
                <span class="shrink-0 font-display text-lg font-extrabold text-brand-700">&uarr; U</span>
                <span class="rounded-full border border-brand-100 bg-white px-3.5 py-1 font-display text-xs font-extrabold text-brand-700">Sekolah</span>
                <div class="h-0.5 flex-1 bg-brand-300"></div>
                <span class="rounded-full border border-brand-100 bg-white px-3.5 py-1 font-display text-xs font-extrabold text-brand-700">Pasar</span>
              </div>

              <div class="space-y-3">
                ${this.mutedOption('A', 'Barat')}
                ${this.fixedOption('B', 'Timur', '✓ Jawaban benar', 'emerald')}
                ${this.mutedOption('C', 'Utara')}
                ${this.mutedOption('D', 'Selatan')}
              </div>

              <div class="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
                <h4 class="font-display text-sm font-extrabold text-emerald-800">Tepat sekali! +8 XP</h4>
                <p class="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">B, Timur. Saat utara mengarah ke atas, sebelah kanan peta adalah timur. Percobaan tepat; sisa nyawa IPS ${lives}/3.</p>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-4">
                <span class="text-xs text-slate-500">Jawaban tersimpan • Tidak bisa diubah</span>
                <div class="flex flex-wrap items-center gap-3">
                  <button type="button" data-action="exit-quiz" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline">&larr; Keluar dari Kuis</button>
                  <button type="button" data-action="quiz-step" data-step="9" class="cursor-pointer rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 font-display text-xs font-extrabold text-rose-700 transition hover:bg-rose-100">Simulasi: Nyawa Habis</button>
                  <button type="button" data-action="quiz-step" data-step="7" class="cursor-pointer rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn transition hover:bg-brand-600">Selesaikan Kuis &rarr;</button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="space-y-3 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="font-display text-xs font-extrabold text-ink-900">Nyawa IPS</span>
                <span class="rounded-full px-2.5 py-0.5 font-display text-xs font-extrabold ${badgeClass}">${lives}/3</span>
              </div>
              <div class="flex items-center gap-1.5">${renderHeartsInline(lives, 3, 'w-6 h-6')}</div>
              <p class="text-xs text-slate-600">Pulih 1 nyawa tiap 1 jam.</p>
              <p class="text-[11px] text-slate-400">Terpisah per mata pelajaran • Maks. 3</p>
              <span class="inline-block rounded-full bg-emerald-50 px-3 py-1 font-display text-xs font-extrabold text-emerald-800">1 benar • +8 XP sesi</span>
            </div>

            <div class="space-y-3 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
              <div class="flex items-center gap-3">
                <img src="${mascotSrc}" alt="Maskot" class="h-12 w-12 shrink-0 object-contain" />
                <h4 class="font-display text-base font-extrabold text-ink-900">Teruskan petualanganmu</h4>
              </div>
              <p class="text-xs leading-relaxed text-slate-600">Pemahaman materi Peta dan Letak Wilayahmu sudah sangat baik. Lanjutkan untuk melihat hasil akhir tantangan ini!</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderResult(ctx) {
    const { user, shortName, displayJenjang, mascotSrc, rankSrc, displayTotalXp, displayCurrXp, displayNextXp, percent, remainingXp, completedCount } = ctx;
    const lives = Math.max(1, ctx.lives ?? 2);
    const badgeClass = lives === 1 ? 'bg-rose-50 text-[#b91c47]' : 'bg-brand-100 text-brand-700';
    const lost = 3 - lives;

    return `
      <div class="space-y-6">
        <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Peta dan Letak Wilayah</p>
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 class="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Tantangan selesai. Hebat, ${shortName}!</h1>
            <p class="mt-1 text-xs text-slate-600 sm:text-sm">Peta dan Letak Wilayah • IPS • Tingkat Sedang</p>
          </div>
          <span class="inline-flex items-center self-start rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">${displayJenjang}</span>
        </div>

        <div class="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <div class="space-y-6">
            <div class="space-y-6 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
              <div class="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                <div class="flex items-center gap-5">
                  <img src="${mascotSrc}" alt="Maskot" class="h-auto w-24 shrink-0 object-contain sm:w-28" />
                  <div>
                    <span class="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 font-display text-xs font-extrabold text-emerald-800">✓ Selesai • 10/10 soal</span>
                    <p class="mt-2 font-display text-4xl font-extrabold text-ink-900 sm:text-5xl">90 <span class="text-xl text-slate-500">/ 100</span></p>
                    <p class="mt-1 text-xs text-slate-600 sm:text-sm">9 jawaban benar dari 10 soal</p>
                  </div>
                </div>
                <div class="sm:text-right">
                  <p class="font-display text-3xl font-extrabold text-brand-700">+72 XP</p>
                  <p class="mt-0.5 text-xs text-slate-500">9 benar × 8 XP<br>XP sesi ini</p>
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-3">
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-emerald-800">9 benar</p>
                  <p class="mt-0.5 text-xs text-slate-500">Soal 02–10</p>
                </div>
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-[#b91c47]">1 salah</p>
                  <p class="mt-0.5 text-xs text-slate-500">Soal 01 • Skala &amp; satuan</p>
                </div>
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-ink-900">10/10</p>
                  <p class="mt-0.5 text-xs text-slate-500">Soal terselesaikan</p>
                </div>
              </div>

              <div class="rounded-2xl border border-brand-100 bg-brand-50/80 p-4">
                <h4 class="font-display text-xs font-extrabold text-brand-700 sm:text-sm">XP sudah masuk ke totalmu</h4>
                <p class="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">Selamat! +72 XP berhasil ditambahkan ke akunmu. Level ${user.level} • Rank ${user.rank}.</p>
              </div>
            </div>

            <div class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
              <h3 class="font-display text-xl font-extrabold text-ink-900">Bekal untuk petualangan berikutnya</h3>
              <div class="grid gap-4 md:grid-cols-2">
                <div class="rounded-2xl border border-emerald-200/80 bg-emerald-50/75 p-5">
                  <h4 class="font-display text-sm font-extrabold text-emerald-800">✓ Kekuatanmu</h4>
                  <p class="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">Arah mata angin dan letak wilayah sudah kamu pahami. Soal 02–10 dijawab benar.</p>
                </div>
                <div class="rounded-2xl border border-amber-200/80 bg-[#fef7ec] p-5">
                  <h4 class="font-display text-sm font-extrabold text-[#9a5b13]">☼ Perlu dilatih</h4>
                  <p class="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">Skala peta dan konversi cm ke km. Dua percobaan pada soal 01 belum tepat.</p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3 pt-2">
                <button type="button" data-action="quiz-step" data-step="8" class="cursor-pointer rounded-2xl bg-brand-700 px-6 py-3 font-display text-xs font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:text-sm">Lihat Pembahasan</button>
                <button type="button" data-action="go" data-route="/ai-tutor" class="cursor-pointer rounded-2xl border-2 border-brand-700 bg-white px-6 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50 sm:text-sm">Tanya AI Tutor</button>
              </div>

              <div class="pt-2">
                <button type="button" data-action="exit-quiz" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline">&larr; Kembali ke ${ctx.returnLabel}</button>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
              <div class="flex items-center gap-3.5">
                <img src="${rankSrc}" alt="${user.rank}" class="h-11 w-11 shrink-0 object-contain" />
                <div>
                  <h3 class="font-display text-base font-extrabold text-ink-900">${user.fullName}</h3>
                  <p class="text-xs text-slate-500">Level ${user.level} • Rank ${user.rank}</p>
                </div>
              </div>

              <div class="space-y-2.5 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                <div class="flex items-center justify-between font-display text-[11px] font-extrabold">
                  <span class="text-ink-900">Level ${user.level} • ${user.rank}</span>
                  <span class="text-brand-700">${displayTotalXp} XP • ${displayCurrXp}/${displayNextXp} ke Lv. ${user.level + 1}</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
                  <div class="h-full rounded-full bg-brand-700" style="width: ${percent}%"></div>
                </div>
                <div class="flex items-center justify-between pt-1 text-xs">
                  <div class="flex items-center gap-1">${renderHeartsInline(lives, 3, 'w-3.5 h-3.5')}</div>
                  <span class="font-display font-extrabold text-ink-900">Nyawa IPS ${lives}/3</span>
                </div>
              </div>

              <p class="text-xs leading-relaxed text-slate-600">
                ${displayCurrXp}/${displayNextXp} XP • ${percent}% ke Level ${user.level + 1}<br>
                Sisa ${remainingXp} XP menuju Level ${user.level + 1}.
              </p>

              <div class="grid grid-cols-2 gap-3 border-t border-brand-100 pt-2">
                <div>
                  <p class="font-display text-xl font-extrabold text-ink-900">${completedCount} materi</p>
                  <p class="text-xs text-slate-500">Selesai</p>
                </div>
                <div>
                  <p class="font-display text-xl font-extrabold text-ink-900">${(ctx.totalQuizzes || 0) + 1} kuis</p>
                  <p class="text-xs text-slate-500">Tercatat</p>
                </div>
              </div>
            </div>

            <div class="space-y-3 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="font-display text-xs font-extrabold text-ink-900">Nyawa IPS</span>
                <span class="rounded-full px-2.5 py-0.5 font-display text-xs font-extrabold ${badgeClass}">${lives}/3</span>
              </div>
              <div class="flex items-center gap-1.5">${renderHeartsInline(lives, 3, 'w-6 h-6')}</div>
              <p class="text-xs text-slate-600">Pulih 1 nyawa tiap 1 jam.</p>
              <p class="text-[11px] text-slate-400">Terpisah per mata pelajaran • Maks. 3</p>
              <p class="pt-1 text-xs leading-relaxed text-slate-600">
                ${lost > 0 ? `${lost} jawaban salah mengurangi ${lost} nyawa IPS.` : 'Semua jawaban benar tanpa kehilangan nyawa.'} Jawaban benar tidak mengurangi nyawa.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderReview(ctx, state) {
    const { user, displayJenjang, displayTotalXp } = ctx;
    const questionNumber = state.quiz.reviewQuestionNum || 1;
    const questionLabel = String(questionNumber).padStart(2, '0');
    const nextLabel = String(questionNumber < 10 ? questionNumber + 1 : 1).padStart(2, '0');
    const completedCount = ctx.completedCount;

    const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(number => {
      const isWrong = number === 1;
      const isActive = questionNumber === number;
      const label = String(number).padStart(2, '0');
      return `
        <button type="button" data-action="review-question" data-question="${number}"
          class="flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl px-4 py-2.5 font-display text-xs font-extrabold transition ${
            isWrong
              ? isActive
                ? 'border-2 border-[#b91c47] bg-rose-50/70 text-[#b91c47]'
                : 'border border-rose-200 bg-rose-50/40 text-[#b91c47]'
              : isActive
              ? 'border-2 border-emerald-700 bg-emerald-50 text-emerald-900'
              : 'border border-emerald-200 bg-emerald-50/50 text-emerald-800 hover:bg-emerald-100/60'
          }">
          <span>${label}</span>
          <span>${isWrong ? '✕' : '✓'}</span>
        </button>
      `;
    }).join('');

    return `
      <div class="space-y-6">
        <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Hasil Kuis / Pembahasan</p>
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 class="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Pahami langkahnya, bukan hanya jawabannya</h1>
            <p class="mt-1 text-xs text-slate-600 sm:text-sm">Pembahasan Peta dan Letak Wilayah • Sesi selesai • Riwayat jawaban tidak bisa diubah</p>
          </div>
          <span class="inline-flex items-center self-start rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">${displayJenjang}</span>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white px-5 py-3.5 text-xs shadow-2xs">
          <div class="flex flex-wrap items-center gap-3">
            <span class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-display font-extrabold text-emerald-800">9/10 benar • Skor 90</span>
            <span class="font-display font-extrabold text-ink-900">+72 XP sesi • Total ${displayTotalXp} XP • Level ${user.level} ${user.rank}</span>
          </div>
          <span class="text-slate-500">Pembahasan &amp; AI: tanpa XP tambahan</span>
        </div>

        <div class="space-y-3 rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
          <div class="flex items-center justify-between text-xs">
            <span class="font-display font-extrabold text-ink-900">Tinjau jawabanmu</span>
            <span class="text-slate-500">✕ Salah &nbsp; ✓ Benar</span>
          </div>
          <div class="grid grid-cols-5 gap-2 sm:grid-cols-10">${numberButtons}</div>
        </div>

        <div class="grid items-start gap-6 lg:grid-cols-[1fr_330px]">
          <div class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
            ${questionNumber === 1 ? `
              <div class="flex items-center justify-between">
                <span class="rounded-full bg-rose-50 px-3.5 py-1 font-display text-xs font-extrabold text-[#b91c47]">SOAL 01 • Selesai salah</span>
                <span class="text-xs font-extrabold text-slate-500">2/2 percobaan • 0 XP</span>
              </div>
              <div>
                <h2 class="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">Skala peta dan konversi satuan</h2>
                <p class="mt-2 text-sm leading-relaxed text-slate-600">Sebuah peta memiliki skala 1 : 200.000. Jarak dua lokasi pada peta adalah 3 cm. Berapa jarak sebenarnya antara kedua lokasi tersebut?</p>
              </div>
              <div class="space-y-2.5">
                <div class="flex items-center justify-between rounded-2xl border border-[#b91c47] bg-rose-50/40 px-4 py-3">
                  <div class="flex items-center gap-3">
                    <span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#b91c47] font-display text-xs font-extrabold text-white">A</span>
                    <span class="font-display text-sm font-extrabold text-ink-900">600 m</span>
                  </div>
                  <span class="font-display text-xs font-extrabold text-[#b91c47]">Percobaan 1 • Salah</span>
                </div>
                <div class="flex items-center justify-between rounded-2xl border border-[#b91c47] bg-rose-50/40 px-4 py-3">
                  <div class="flex items-center gap-3">
                    <span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#b91c47] font-display text-xs font-extrabold text-white">C</span>
                    <span class="font-display text-sm font-extrabold text-ink-900">60 km</span>
                  </div>
                  <span class="font-display text-xs font-extrabold text-[#b91c47]">Percobaan 2 • Salah</span>
                </div>
                <div class="flex items-center justify-between rounded-2xl border-2 border-emerald-700 bg-emerald-50/50 px-4 py-3">
                  <div class="flex items-center gap-3">
                    <span class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 font-display text-xs font-extrabold text-white">B</span>
                    <span class="font-display text-sm font-extrabold text-ink-900">6 km</span>
                  </div>
                  <span class="font-display text-xs font-extrabold text-emerald-800">Kunci jawaban</span>
                </div>
              </div>
              <div class="space-y-3 rounded-2xl border border-brand-100 bg-brand-50/75 p-5">
                <h3 class="font-display text-lg font-extrabold text-ink-900">Dari jarak peta ke jarak sebenarnya</h3>
                <div>
                  <p class="font-display text-xs font-extrabold text-brand-700">Maknai skala</p>
                  <p class="text-xs text-slate-600 sm:text-sm">1 cm pada peta mewakili 200.000 cm jarak sebenarnya.</p>
                </div>
                <div>
                  <p class="font-display text-xs font-extrabold text-brand-700">Kalikan jarak peta</p>
                  <p class="text-xs text-slate-600 sm:text-sm">3 × 200.000 cm = 600.000 cm.</p>
                </div>
                <div>
                  <p class="font-display text-xs font-extrabold text-brand-700">Ubah satuannya</p>
                  <p class="text-xs text-slate-600 sm:text-sm">600.000 cm ÷ 100 = 6.000 m. Lalu, 6.000 m ÷ 1.000 = 6 km.</p>
                </div>
              </div>
              <div class="rounded-2xl border border-amber-200/80 bg-[#fef7ec] p-4">
                <p class="font-display text-xs font-extrabold text-[#9a5b13] sm:text-sm">Letak kekeliruannya</p>
                <p class="mt-1 text-xs text-slate-600 sm:text-sm">600 m terlalu kecil, sedangkan 60 km terlalu besar. Tulis satuan pada setiap langkah agar jumlah nol tidak tertukar.</p>
              </div>
            ` : `
              <div class="flex items-center justify-between">
                <span class="rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 font-display text-xs font-extrabold text-emerald-800">SOAL ${questionLabel} • Dijawab benar</span>
                <span class="text-xs font-extrabold text-emerald-700">1/2 percobaan • +8 XP</span>
              </div>
              <div>
                <h2 class="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">Membaca arah mata angin &amp; letak wilayah</h2>
                <p class="mt-2 text-sm leading-relaxed text-slate-600">Kamu berhasil menjawab soal nomor ${questionLabel} dengan tepat pada percobaan pertama tanpa kehilangan nyawa IPS.</p>
              </div>
              <div class="flex items-center justify-between rounded-2xl border-2 border-emerald-700 bg-emerald-50/50 px-4 py-3.5">
                <div class="flex items-center gap-3">
                  <span class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 font-display text-xs font-extrabold text-white">B</span>
                  <span class="font-display text-sm font-extrabold text-ink-900">Timur (Jawabanmu tepat)</span>
                </div>
                <span class="font-display text-xs font-extrabold text-emerald-800">✓ +8 XP</span>
              </div>
            `}

            <div class="flex items-center justify-between gap-4 border-t border-brand-100 pt-4">
              <button type="button" data-action="quiz-step" data-step="7" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline sm:text-sm">&larr; Kembali ke Hasil</button>
              <button type="button" data-action="review-question" data-question="${questionNumber < 10 ? questionNumber + 1 : 1}" class="cursor-pointer rounded-2xl border-2 border-brand-700 bg-white px-5 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50 sm:text-sm">
                Pembahasan Soal ${nextLabel} &rarr;
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <div class="space-y-3.5 rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-lg">🦉</div>
                  <div>
                    <h4 class="font-display text-sm font-extrabold text-ink-900">AI Tutor</h4>
                    <p class="text-xs font-extrabold text-emerald-700">Refleksi setelah kuis</p>
                  </div>
                </div>
                <span class="text-xs text-slate-400">✕</span>
              </div>

              <div class="rounded-2xl bg-brand-700 p-3.5 text-xs leading-relaxed text-white">${state.quiz.aiPrompt || 'Aku masih bingung mengubah satuan pada soal skala.'}</div>

              <div class="space-y-2 rounded-2xl border border-brand-100 p-4 text-xs leading-relaxed text-ink-900">
                <p>1. Mulai dari satuan. Setelah jarak peta dikalikan skala, satuan apa yang kamu dapatkan?</p>
                <p>2. Hubungkan satuan. Ada 100 cm dalam 1 m dan 1.000 m dalam 1 km. Bagaimana urutan konversinya?</p>
                <p class="font-semibold text-brand-700">3. Coba jelaskan kembali caramu mengubah 600.000 cm menjadi km, tanpa melihat pembahasan.</p>
              </div>

              <form data-form="quiz-ai" class="flex items-center gap-2 rounded-2xl border border-brand-100 py-1.5 pl-3.5 pr-1.5">
                <input data-field="quiz-ai-input" type="text" placeholder="Tulis langkah yang kamu pahami..." class="w-full text-xs outline-none" />
                <button type="submit" class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-brand-700 text-white">&uarr;</button>
              </form>
            </div>

            <div class="space-y-2 px-1">
              <p class="text-[11px] text-slate-400">AI bisa keliru. Cocokkan dengan materi atau tanyakan kepada guru.</p>
              <p class="pt-1 font-display text-xs font-extrabold text-brand-700">Refleksi, bukan mengulang kuis</p>
              <p class="text-xs leading-relaxed text-slate-600">Sesi sudah selesai. Bertanya ke AI tidak mengubah jawaban, skor, atau XP yang sudah tersimpan.</p>
            </div>

            <div class="space-y-3 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">🌍</span>
                <div>
                  <h4 class="font-display text-base font-extrabold text-ink-900">IPS</h4>
                  <p class="text-xs font-bold text-brand-700">Peta dan Letak Wilayah</p>
                </div>
              </div>
              <div class="flex justify-between pt-1 text-xs font-extrabold ${completedCount > 0 ? 'text-brand-700' : 'text-slate-500'}">
                <span>${completedCount > 0 ? 'Materi terkait selesai' : 'Materi pengantar'}</span>
                <span>${completedCount > 0 ? '100%' : '0%'}</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full ${completedCount > 0 ? 'bg-emerald-100' : 'bg-slate-100'}">
                <div class="h-full rounded-full ${completedCount > 0 ? 'w-full bg-emerald-700' : 'w-0 bg-brand-700'}"></div>
              </div>
              <button type="button" data-action="open-material" data-bab="bab-01" data-mat="mat-1-1" data-step="1" class="mt-2 w-full cursor-pointer rounded-xl border-2 border-brand-700 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50">
                ${completedCount > 0 ? 'Baca Ulang Materi' : 'Pelajari Materi Terkait'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderOutOfLives(ctx, state) {
    const { user, displayJenjang, rankSrc, displayTotalXp, displayCurrXp, displayNextXp, percent, remainingXp } = ctx;
    return `
      <div class="space-y-6">
        <p class="font-display text-xs font-extrabold text-brand-700">Kuis / Peta dan Letak Wilayah</p>
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 class="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Istirahat sebentar, petualang</h1>
            <p class="mt-1 text-xs text-slate-600 sm:text-sm">Peta dan Letak Wilayah • IPS • Ringkasan parsial, bukan hasil kuis lengkap</p>
          </div>
          <span class="inline-flex items-center self-start rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700">${displayJenjang}</span>
        </div>

        <div class="rounded-2xl border border-brand-100 bg-brand-50/90 px-5 py-4">
          <h3 class="font-display text-sm font-extrabold text-brand-700">Ringkasan sesi • Terhenti di soal 03</h3>
          <p class="mt-0.5 text-xs text-slate-600 sm:text-sm">Sesi berhenti di soal 03 setelah nyawa IPS habis. Hasil dan XP yang sudah kamu peroleh tetap tercatat.</p>
        </div>

        <div class="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <div class="space-y-6">
            <div class="space-y-6 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
              <div class="flex items-start gap-4">
                <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-[#b91c47]">
                  <svg class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <div>
                  <span class="inline-block rounded-full bg-rose-50 px-3 py-0.5 font-display text-xs font-extrabold text-[#b91c47]">Kuis Terhenti</span>
                  <h2 class="mt-1.5 font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">Nyawa IPS kamu habis</h2>
                  <p class="mt-0.5 text-xs text-slate-600 sm:text-sm">Kuis langsung berhenti meski masih ada 1 jatah percobaan pada soal 03.</p>
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-3">
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-ink-900">3 soal</p>
                  <p class="mt-0.5 text-xs text-slate-500">Dijumpai dari 10 soal</p>
                </div>
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-emerald-800">1 benar</p>
                  <p class="mt-0.5 text-xs text-slate-500">Soal 02</p>
                </div>
                <div class="rounded-2xl bg-brand-50/50 p-4">
                  <p class="font-display text-2xl font-extrabold text-brand-700">+8 XP</p>
                  <p class="mt-0.5 text-xs text-slate-500">XP sesi yang tersimpan</p>
                </div>
              </div>

              <div class="rounded-2xl border border-brand-100 bg-brand-50/80 p-4">
                <h4 class="font-display text-xs font-extrabold text-brand-700 sm:text-sm">Usahamu tetap tercatat</h4>
                <p class="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">+8 XP sesi tersimpan. Total: ${displayTotalXp} XP. Level ${user.level} • Rank ${user.rank}.</p>
              </div>
            </div>

            <div class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
              <h3 class="font-display text-xl font-extrabold text-ink-900">Sampai di mana petualanganmu?</h3>
              <div class="divide-y divide-brand-100 text-xs sm:text-sm">
                <div class="flex items-center justify-between gap-4 py-3.5">
                  <div class="flex items-center gap-3.5">
                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 font-display text-xs font-extrabold text-[#b91c47]">01</span>
                    <div>
                      <p class="font-display font-extrabold text-ink-900">Skala &amp; satuan</p>
                      <p class="text-xs text-slate-500">Salah • 2 percobaan</p>
                    </div>
                  </div>
                  <span class="font-display font-extrabold text-slate-600">0 XP</span>
                </div>

                <div class="flex items-center justify-between gap-4 py-3.5">
                  <div class="flex items-center gap-3.5">
                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 font-display text-xs font-extrabold text-emerald-800">02</span>
                    <div>
                      <p class="font-display font-extrabold text-ink-900">Arah mata angin</p>
                      <p class="text-xs text-slate-500">Benar • Percobaan pertama</p>
                    </div>
                  </div>
                  <span class="font-display font-extrabold text-emerald-800">+8 XP</span>
                </div>

                <div class="flex items-center justify-between gap-4 py-3.5">
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
                <button type="button" data-action="open-material" data-bab="bab-01" data-mat="mat-1-2" data-step="1" class="cursor-pointer rounded-2xl bg-brand-700 px-6 py-3 font-display text-xs font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:text-sm">Pelajari Materi</button>
                <button type="button" data-action="quiz-step" data-step="8" class="cursor-pointer rounded-2xl border-2 border-brand-700 bg-white px-6 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50 sm:text-sm">Lihat Pembahasan</button>
              </div>

              <div class="pt-2">
                <button type="button" data-action="exit-quiz" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline">&larr; Kembali ke ${ctx.returnLabel}</button>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="space-y-3.5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
              <div class="flex items-center justify-between">
                <span class="font-display text-xs font-extrabold text-ink-900">Nyawa IPS</span>
                <span class="rounded-full bg-rose-50 px-2.5 py-0.5 font-display text-xs font-extrabold text-[#b91c47]">0/3</span>
              </div>
              <div class="flex items-center gap-1.5">${renderHeartsInline(0, 3, 'w-6 h-6')}</div>
              <p class="text-xs text-slate-600">1 nyawa pulih dalam 1 jam.</p>
              <p class="text-[11px] text-slate-400">Terpisah per mata pelajaran • Maks. 3</p>

              <div class="rounded-2xl border border-amber-200/80 bg-[#fef7ec] p-4">
                <p class="font-display text-xs font-extrabold text-[#9a5b13]">Materi tetap terbuka</p>
                <p class="mt-1 text-xs leading-relaxed text-slate-600">Kuis belum bisa dimulai lagi saat nyawa IPS 0. Nyawa mata pelajaran lain tidak terpengaruh.</p>
              </div>
            </div>

            <div class="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
              <div class="flex items-center gap-3.5">
                <img src="${rankSrc}" alt="${user.rank}" class="h-11 w-11 shrink-0 object-contain" />
                <div>
                  <h3 class="font-display text-base font-extrabold text-ink-900">${user.fullName}</h3>
                  <p class="text-xs text-slate-500">Level ${user.level} • Rank ${user.rank}</p>
                </div>
              </div>

              <div class="space-y-2.5 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                <div class="flex items-center justify-between font-display text-[11px] font-extrabold">
                  <span class="text-ink-900">Level ${user.level} • ${user.rank}</span>
                  <span class="text-brand-700">${displayTotalXp} XP • ${displayCurrXp}/${displayNextXp} ke Lv. ${user.level + 1}</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
                  <div class="h-full rounded-full bg-brand-700" style="width: ${percent}%"></div>
                </div>
                <div class="flex items-center justify-between pt-1 text-xs">
                  <div class="flex items-center gap-1">${renderHeartsInline(0, 3, 'w-3.5 h-3.5')}</div>
                  <span class="font-display font-extrabold text-ink-900">Nyawa IPS 0/3</span>
                </div>
              </div>

              <p class="text-xs leading-relaxed text-slate-600">
                ${displayCurrXp}/${displayNextXp} XP • ${percent}% ke Level ${user.level + 1}<br>
                Sisa ${remainingXp} XP menuju Level ${user.level + 1}.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
