/**
 * DashboardOldView — beranda petualang lama (sudah punya progres).
 */
import { ASSETS } from '../assets/mascot-assets.js';
import { RANK_TIERS, getRankAssetKey } from '../config/constants.js';
import { getShortName, jenjangText, xpPercent } from '../core/format.js';

export class DashboardOldView {
  constructor(root) {
    this.root = root;
  }

  render(state) {
    const user = state.user;
    const shortName = getShortName(user.fullName);
    const displayJenjang = jenjangText(user);
    const percent = xpPercent(user, 800);
    const remainingXp = Math.max(0, (user.nextLevelXp || 800) - user.xp);
    const completedCount = Object.keys(state.completedMaterials || {}).length;
    const quizzesCount = state.profileStats?.total_quizzes
      || (state.profileQuizHistory ? state.profileQuizHistory.length : 0);
    const ipsPct = Math.min(100, Math.round((completedCount / 20) * 100));
    const activeRankKey = getRankAssetKey(user.rank);
    const rankEmblem = ASSETS[activeRankKey] || ASSETS.rekrut;

    this.root.innerHTML = `
      <section class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
        <div class="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div class="flex flex-1 flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div class="flex w-24 shrink-0 justify-center sm:w-28">
              <img src="${ASSETS.mascot}" alt="Maskot EduQuest" class="h-auto w-full select-none object-contain drop-shadow-sm" />
            </div>
            <div class="flex-1">
              <span class="inline-block rounded-full bg-brand-100/90 px-3.5 py-1 font-display text-xs font-extrabold text-brand-700">${displayJenjang}</span>
              <h1 class="mt-2.5 font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Halo, ${shortName}!</h1>
              <p class="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                ${completedCount} materi dan ${quizzesCount} kuis selesai • Total ${user.totalXp.toLocaleString('id-ID')} XP.<br>
                Level ${user.level} • Rank ${user.rank} • Sisa ${remainingXp} XP menuju Level ${user.level + 1}.
              </p>

              <div data-action="open-material" data-bab="bab-02" data-mat="mat-2-1" data-step="1"
                class="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/90 px-4 py-3 transition hover:bg-brand-100/60">
                <div class="flex min-w-0 items-center gap-3">
                  <span class="shrink-0 text-lg">🎯</span>
                  <div class="min-w-0">
                    <p class="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">QUEST AKTIF</p>
                    <p class="truncate font-display text-xs font-extrabold text-ink-900 sm:text-sm">Mengenal Interaksi Antarruang &mdash; Bagian 4 dari 5</p>
                  </div>
                </div>
                <span class="shrink-0 rounded-full bg-brand-700 px-3 py-1 font-display text-xs font-extrabold text-white">60%</span>
              </div>
            </div>
          </div>

          <div class="w-full shrink-0 space-y-3 lg:w-80">
            <div class="flex items-center gap-3.5 rounded-2xl border border-brand-100 bg-brand-50/75 p-4">
              <img src="${rankEmblem}" alt="${user.rank} Emblem" class="h-12 w-12 shrink-0 object-contain drop-shadow-2xs" />
              <div>
                <p class="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">LEVEL &amp; RANK SAAT INI</p>
                <p class="font-display text-lg font-extrabold leading-tight text-ink-900">Level ${user.level} • ${user.rank}</p>
                <p class="mt-0.5 text-xs text-slate-600">${user.totalXp.toLocaleString('id-ID')} Total XP • Level terus naik</p>
              </div>
            </div>

            <div class="rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
              <div class="flex items-center justify-between font-display text-xs font-extrabold">
                <span class="text-ink-900">Level ${user.level} • ${user.rank}</span>
                <span class="text-brand-700">${user.totalXp.toLocaleString('id-ID')} XP • ${user.xp}/${user.nextLevelXp} ke Lv. ${user.level + 1}</span>
              </div>
              <div class="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-brand-100">
                <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width: ${percent}%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 grid gap-3 border-t border-brand-100 pt-5 sm:grid-cols-3 lg:grid-cols-5">
          ${RANK_TIERS.map(tier => {
            const isActive = tier.key === activeRankKey;
            return `
              <div class="flex items-center gap-3 rounded-2xl ${isActive ? 'border-2 border-brand-700 bg-brand-50/75' : 'border border-brand-100 bg-white'} px-4 py-3">
                <img src="${ASSETS[tier.key] || ''}" alt="${tier.rank}" class="h-8 w-8 shrink-0 object-contain" />
                <div>
                  <p class="font-display text-xs font-extrabold ${isActive ? 'text-brand-700' : 'text-ink-900'}">${tier.rank}</p>
                  <p class="text-[11px] ${isActive ? 'font-bold text-brand-700' : 'text-slate-500'}">${tier.minXp}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <section class="space-y-3">
        <div>
          <h2 class="font-display text-2xl font-extrabold text-ink-900">Quest</h2>
          <p class="text-xs text-slate-500 sm:text-sm">Questmu menunggu untuk dituntaskan.</p>
        </div>

        <div class="space-y-6 rounded-3xl border-2 border-brand-700 bg-white p-6 shadow-xs sm:p-7">
          <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div class="flex flex-1 items-start gap-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-2xl">🌍</div>
              <div class="flex-1">
                <p class="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">IPS • BAGIAN 4 DARI 5</p>
                <h3 class="mt-0.5 font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Mengenal Interaksi Antarruang</h3>
                <p class="mt-0.5 text-xs text-slate-500">Bab Interaksi Antarruang • 3 dari 5 bagian materi selesai • Sekitar 8 menit lagi</p>
                <div class="mt-3 max-w-md">
                  <div class="h-2 w-full overflow-hidden rounded-full bg-brand-100">
                    <div class="h-full w-[60%] rounded-full bg-brand-700"></div>
                  </div>
                  <p class="mt-1.5 text-[11px] font-extrabold text-brand-700">Materi Mengenal Interaksi Antarruang • 60% selesai</p>
                </div>
              </div>
            </div>
            <button type="button" data-action="open-material" data-bab="bab-02" data-mat="mat-2-1" data-step="2"
              class="w-full shrink-0 cursor-pointer rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn transition hover:bg-brand-600 md:w-auto">
              Lanjutkan belajar
            </button>
          </div>

          <div>
            <p class="mb-4 text-xs font-extrabold text-ink-900">Alur Materi &mdash; Mengenal Interaksi Antarruang</p>
            <div class="grid grid-cols-5 items-start gap-2 text-center">
              <div class="flex flex-col items-center">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">✓</span>
                <p class="mt-2 text-[11px] font-bold leading-tight text-emerald-800">Mengenal<br>Ruang</p>
              </div>
              <div class="flex flex-col items-center">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">✓</span>
                <p class="mt-2 text-[11px] font-bold leading-tight text-emerald-800">Letak<br>Wilayah</p>
              </div>
              <div class="flex flex-col items-center">
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">✓</span>
                <p class="mt-2 text-[11px] font-bold leading-tight text-emerald-800">Koneksi<br>Antarruang</p>
              </div>
              <div class="flex flex-col items-center">
                <span class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white ring-4 ring-brand-100">⚔️</span>
                <p class="mt-2 text-[11px] font-extrabold leading-tight text-brand-700">Contoh<br>Interaksi</p>
              </div>
              <div class="flex flex-col items-center">
                <span class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs text-slate-400">🔒</span>
                <p class="mt-2 text-[11px] font-semibold leading-tight text-slate-500">Kuis<br>Penutup</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-xs">
            <span class="text-lg">🎁</span>
            <div>
              <p class="font-display font-extrabold text-emerald-900">Kuis tingkat sedang • Maksimal 80 XP</p>
              <p class="text-slate-600">8 XP per jawaban benar • 10 soal</p>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-7">
        <div>
          <h2 class="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Mata Pelajaran</h2>
          <p class="mt-0.5 text-xs text-slate-500 sm:text-sm">${completedCount} materi selesai di jenjang ${user.jenjangDisplay || user.jenjang}. Nyawa terpisah per mapel, maksimal 3; pulih 1 nyawa tiap 1 jam.</p>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <div class="flex flex-col justify-between rounded-2xl border border-brand-100 p-5">
            <div>
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">🌍</span>
                <div>
                  <h3 class="font-display text-base font-extrabold text-ink-900">IPS</h3>
                  <p class="text-[11px] font-bold text-brand-700">${user.jenjangDisplay || user.jenjang} • Ruang &amp; Wilayah</p>
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
            <button type="button" data-action="open-subject" data-subject="IPS" class="mt-4 w-full cursor-pointer rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50">
              Lanjutkan Quest
            </button>
          </div>

          <div class="flex flex-col justify-between rounded-2xl border border-brand-100 p-5">
            <div>
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xl">🧪</span>
                <div>
                  <h3 class="font-display text-base font-extrabold text-ink-900">IPA</h3>
                  <p class="text-[11px] font-bold text-brand-700">${user.jenjangDisplay || user.jenjang} • Sains &amp; Lingkungan</p>
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
            <button type="button" data-action="open-subject" data-subject="IPA" class="mt-4 w-full cursor-pointer rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50">
              Lihat Bab
            </button>
          </div>

          <div class="flex flex-col justify-between rounded-2xl border border-brand-100 p-5">
            <div>
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-xl">📖</span>
                <div>
                  <h3 class="font-display text-base font-extrabold text-ink-900">Bahasa Indonesia</h3>
                  <p class="text-[11px] font-bold text-brand-700">${user.jenjangDisplay || user.jenjang} • Teks &amp; Sastra</p>
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
            <button type="button" data-action="open-subject" data-subject="Bahasa Indonesia" class="mt-4 w-full cursor-pointer rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50">
              Lihat Bab
            </button>
          </div>
        </div>
      </section>

      <section class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-7">
        <div>
          <h2 class="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Rekomendasi Quest Berikutnya</h2>
          <p class="mt-0.5 text-xs text-slate-500 sm:text-sm">Topik untuk memperkuat pemahaman. Latihan terbimbing tersedia di dalam materi.</p>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <div class="flex flex-col justify-between rounded-2xl border border-brand-100 p-5">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-brand-700">IPS</span>
                <span class="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-700">Sedang</span>
              </div>
              <h3 class="mt-2 font-display text-lg font-extrabold text-ink-900">Kegiatan Ekonomi</h3>
              <p class="mt-1 text-xs leading-relaxed text-slate-500">Lanjutkan IPS setelah materi Interaksi Antarruang.</p>
            </div>
            <button type="button" data-action="open-material" data-bab="bab-04" data-mat="mat-4-1" data-step="1" class="mt-4 w-full cursor-pointer rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50">
              Buka Quest
            </button>
          </div>

          <div class="flex flex-col justify-between rounded-2xl border border-brand-100 p-5">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-brand-700">IPA</span>
                <span class="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-700">Mudah</span>
              </div>
              <h3 class="mt-2 font-display text-lg font-extrabold text-ink-900">Rantai Makanan</h3>
              <p class="mt-1 text-xs leading-relaxed text-slate-500">Pelajari konsep dan coba latihan terbimbing di dalam materi.</p>
            </div>
            <button type="button" data-action="go" data-route="/quest" class="mt-4 w-full cursor-pointer rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50">
              Buka Quest
            </button>
          </div>

          <div class="flex flex-col justify-between rounded-2xl border border-brand-100 p-5">
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-brand-700">Bahasa Indonesia</span>
                <span class="rounded-full bg-brand-100 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-700">Mudah</span>
              </div>
              <h3 class="mt-2 font-display text-lg font-extrabold text-ink-900">Mengenal Teks Narasi</h3>
              <p class="mt-1 text-xs leading-relaxed text-slate-500">Lanjutkan ke teks narasi setelah memahami teks deskripsi.</p>
            </div>
            <button type="button" data-action="go" data-route="/quest" class="mt-4 w-full cursor-pointer rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50">
              Buka Quest
            </button>
          </div>
        </div>

        <div class="flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/75 p-5 sm:flex-row sm:items-center">
          <div class="flex items-start gap-3.5">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-white text-lg">🔮</span>
            <div>
              <h4 class="font-display text-base font-extrabold text-ink-900">Bantuan AI Tutor</h4>
              <p class="mt-0.5 text-xs text-slate-600">Butuh bantuan saat belajar? Gunakan AI Tutor untuk petunjuk bertahap.</p>
              <p class="mt-1 text-xs font-extrabold text-brand-700">Petunjuk bertahap, bukan jawaban akhir.</p>
              <p class="mt-0.5 text-[11px] text-slate-500">AI dapat keliru dan layanan bisa tidak tersedia. Kamu tetap bisa melanjutkan materi.</p>
            </div>
          </div>
          <button type="button" data-action="go" data-route="/ai-tutor" class="shrink-0 cursor-pointer rounded-xl border-2 border-brand-700 bg-white px-5 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50">
            Tanya AI Tutor
          </button>
        </div>
      </section>

      <section class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-7">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Achievement Terbaru</h2>
            <p class="mt-0.5 text-xs text-slate-500 sm:text-sm">Setiap usaha punya cerita. Inilah lencana dari petualanganmu.</p>
          </div>
          <button type="button" data-action="go" data-route="/profil" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline">
            Lihat Semua Lencana &rarr;
          </button>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          ${[
            { icon: '🏅', title: 'Langkah Pertama', sub: 'Selesaikan 1 materi' },
            { icon: '🏆', title: 'Penakluk Kuis', sub: 'Selesaikan 1 kuis' },
            { icon: '🏅', title: 'Penjelajah Tekun', sub: 'Selesaikan 10 materi' },
            { icon: '🏆', title: 'Ahli IPS', sub: 'Selesaikan 5 kuis IPS' }
          ].map(badge => `
            <div class="rounded-2xl border border-brand-100 bg-white p-5 text-center">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">${badge.icon}</div>
              <h4 class="mt-3 font-display text-sm font-extrabold text-ink-900">${badge.title}</h4>
              <p class="mt-0.5 text-xs text-slate-500">${badge.sub}</p>
              <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
                <div class="h-full w-full rounded-full bg-emerald-700"></div>
              </div>
              <p class="mt-2 text-[11px] font-extrabold text-emerald-700">Terbuka • 100%</p>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-7">
        <h2 class="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Hasil Kuis Terakhir</h2>
        <div class="flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 sm:flex-row sm:items-center">
          <div class="flex items-center gap-3.5">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-white text-xl">🏆</div>
            <div>
              <h4 class="font-display text-base font-extrabold text-ink-900">Kuis IPS: Ruang dan Wilayah</h4>
              <p class="mt-0.5 text-xs text-slate-500">IPS • 2 November 2026 • 8 dari 10 jawaban benar</p>
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
}
