/**
 * ProfileView — halaman profil lengkap dengan statistik, rekomendasi,
 * dan riwayat kuis pengguna.
 */
import { ASSETS } from '../assets/mascot-assets.js';
import { escapeHtml } from '../core/dom.js';
import { formatDate, getInitials, jenjangText, xpPercent } from '../core/format.js';
import { getRankAssetKey } from '../config/constants.js';
import { renderHeartsInline } from './helpers.js';

export class ProfileView {
  constructor(root) {
    this.root = root;
  }

  render(state) {
    const container = this.root.querySelector('#profile-root') || this.root;
    const user = state.user;
    const initial = getInitials(user.fullName);
    const displayTotalXp = user.totalXp || 0;
    const displayCurrXp = user.xp || 0;
    const displayNextXp = user.nextLevelXp || 100;
    const percent = xpPercent(user);
    const remainingXp = Math.max(0, displayNextXp - displayCurrXp);
    const rankSrc = ASSETS[getRankAssetKey(user.rank)] || '';

    const realHistory = state.profileQuizHistory;
    const hasRealHistory = Array.isArray(realHistory) && realHistory.length > 0;

    const quizRows = hasRealHistory
      ? realHistory.slice(0, 10).map((row, index) => {
          const isLatest = index === 0;
          const date = formatDate(row.started_at);
          const difficulty = row.target_difficulty === 3 ? 'Sulit' : row.target_difficulty === 2 ? 'Sedang' : 'Dasar';
          const title = row.material?.title || row.title || `Kuis Latihan #${row.id}`;
          const submission = `${difficulty} · ${date}${isLatest ? ' · <span class="font-extrabold text-brand-700">Terbaru</span>' : ''}`;
          const needsReview = Math.round(row.percent || 0) < 60;
          return {
            title,
            sub: submission,
            answer: `${row.correct_count}/${row.total_questions} benar`,
            score: `${Math.round(row.percent || 0)}`,
            xp: `+${row.xp_gained || 0} XP`,
            highlight: isLatest,
            materialId: row.material?.id || null,
            statusText: needsReview ? 'Perlu diulang' : '✓ Selesai',
            statusClass: needsReview
              ? 'border border-amber-200 bg-amber-50 text-amber-700'
              : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          };
        })
      : [];

    const stats = state.profileStats;
    const totalMaterials = stats?.completed_materials ?? Object.keys(state.completedMaterials || {}).length;
    const totalQuizzes = stats?.total_quizzes ?? (hasRealHistory ? realHistory.length : 0);
    const historyAverage = hasRealHistory
      ? Math.round(realHistory.reduce((total, row) => total + Number(row.percent || 0), 0) / realHistory.length)
      : 0;
    const averageAccuracy = (stats && stats.total_quizzes > 0)
      ? `${Math.round(Number(stats.average_accuracy || 0))}%`
      : (hasRealHistory ? `${historyAverage}%` : '0%');

    const recommendation = state.profileRecommendation;
    const aiMessage = recommendation?.personalized_message
      || `Halo ${user.fullName}! Ayo mulai petualangan belajarmu dengan membaca materi dan mengerjakan kuis untuk mendapatkan analisis dan rekomendasi personal dari AI Tutor!`;

    const breakdown = stats?.subject_breakdown;
    const livesEntries = Array.isArray(state.progressSummary?.subject_lives)
      ? state.progressSummary.subject_lives.slice(0, 5)
      : [];

    container.innerHTML = `
      <div class="space-y-8">
        <div>
          <h1 class="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Profil Saya</h1>
          <p class="mt-1 text-xs text-slate-600 sm:text-sm">Jejak petualanganmu, dari langkah pertama hingga pencapaian hari ini.</p>
        </div>

        <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
          <div class="grid items-center gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <div class="flex items-center gap-5">
                <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-brand-200 bg-brand-100 font-display text-3xl font-extrabold text-brand-700">
                  ${initial}
                </div>
                <div>
                  <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">PETUALANG EDUQUEST</p>
                  <h2 class="mt-0.5 font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">${escapeHtml(user.fullName)}</h2>
                  <p class="mt-0.5 text-sm font-semibold text-slate-600">${escapeHtml(jenjangText(user))}</p>
                </div>
              </div>

              <div class="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" data-action="open-feature" data-modal="profil"
                  class="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-brand-700 px-5 py-2.5 font-display text-xs font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:text-sm">
                  <span>✏️</span>
                  <span>Edit Profil</span>
                </button>
                <button type="button" data-action="open-feature" data-modal="jenjang"
                  class="cursor-pointer px-3 py-2 font-display text-xs font-extrabold text-brand-700 hover:underline">
                  Ubah Jenjang &amp; Kelas
                </button>
                <span class="text-slate-300">|</span>
                <button type="button" data-action="open-feature" data-modal="pengaturan"
                  class="cursor-pointer px-3 py-2 font-display text-xs font-extrabold text-brand-700 hover:underline">
                  Pengaturan
                </button>
              </div>

              <p class="mt-4 text-xs text-slate-500">
                Setiap materi dan kuis yang kamu tuntaskan tersimpan permanen di akun belajarmu.
              </p>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <img src="${rankSrc}" alt="${escapeHtml(user.rank)}" class="h-12 w-12 shrink-0 object-contain" />
                  <div>
                    <h3 class="font-display text-lg font-extrabold leading-tight text-ink-900">Level ${user.level} • ${escapeHtml(user.rank)}</h3>
                    <p class="text-xs text-slate-500">${escapeHtml(user.rank || 'Bronze')}${user.nextRank ? ` &rarr; ${escapeHtml(user.nextRank)}` : ''}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-display text-2xl font-extrabold text-brand-700">${displayTotalXp.toLocaleString('id-ID')} XP</p>
                  <p class="text-[11px] text-slate-500">Total terkumpul</p>
                </div>
              </div>

              <div class="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                <div class="flex items-center justify-between font-display text-xs font-extrabold">
                  <span class="text-ink-900">Level ${user.level} &rarr; Level ${user.level + 1}</span>
                  <span class="text-brand-700">${displayCurrXp}/${displayNextXp} XP • ${percent}%</span>
                </div>
                <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-100">
                  <div class="h-full rounded-full bg-brand-700" style="width: ${percent}%"></div>
                </div>
              </div>

              <p class="text-xs font-extrabold text-brand-700">${remainingXp} XP lagi menuju Level ${user.level + 1}</p>
              <p class="text-[11px] text-slate-500">Rank membuka tingkat kesulitan kuis berikutnya.</p>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 p-6 shadow-xs sm:p-7">
          <div class="flex flex-col items-start gap-4 sm:flex-row">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-md">
              🤖
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="font-display text-lg font-extrabold text-ink-900">Rekomendasi Belajar AI Tutor</h3>
                <span class="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700">Gemini Powered</span>
              </div>
              <p class="mt-2 text-xs font-medium leading-relaxed text-slate-700 sm:text-sm">
                "${escapeHtml(aiMessage)}"
              </p>
              ${recommendation?.weak_topics?.length ? `
                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <span class="text-xs font-bold text-amber-700">Perlu Diulang:</span>
                  ${recommendation.weak_topics.map(topic => `
                    <button type="button" data-action="open-material" data-subject="0" data-material="${Number(topic.material_id || 0)}" data-step="1"
                      class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-800 transition hover:bg-amber-100">
                      <span>🔄</span>
                      <span>${escapeHtml(topic.title)} (${escapeHtml(topic.subject)})</span>
                    </button>
                  `).join('')}
                </div>
              ` : ''}
              ${recommendation?.next_topics?.length ? `
                <div class="mt-3 flex flex-wrap items-center gap-2">
                  <span class="text-xs font-bold text-indigo-700">Materi Berikutnya:</span>
                  ${recommendation.next_topics.map(topic => `
                    <button type="button" data-action="open-material" data-subject="0" data-material="${Number(topic.material_id || 0)}" data-step="1"
                      class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-800 transition hover:bg-indigo-100">
                      <span>📖</span>
                      <span>${escapeHtml(topic.title)} (${escapeHtml(topic.subject)})</span>
                    </button>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <div class="flex items-center gap-4 rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <div class="flex-1">
              <p class="font-display text-2xl font-extrabold text-ink-900">${totalMaterials} <span class="text-sm font-bold">materi selesai</span></p>
              <p class="text-xs text-slate-500">Tersimpan di akun belajarmu</p>
            </div>
          </div>

          <div class="flex items-center gap-4 rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <p class="font-display text-2xl font-extrabold text-ink-900">${totalQuizzes} <span class="text-sm font-bold">kuis selesai</span></p>
              <p class="text-xs text-slate-500">Hasil dan pembahasan tersimpan</p>
            </div>
          </div>

          <div class="flex items-center gap-4 rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div>
              <p class="font-display text-2xl font-extrabold text-ink-900">${averageAccuracy} <span class="text-sm font-bold">rata-rata akurasi</span></p>
              <p class="text-xs text-slate-500">Persentase skor kuis</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <h2 class="font-display text-2xl font-extrabold text-ink-900">Perkembangan Belajarmu</h2>
            <p class="mt-0.5 text-xs text-slate-500 sm:text-sm">Lihat sejauh mana penguasaan materi di mata pelajaranmu.</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            ${breakdown?.length ? breakdown.map(subject => `
              <div class="flex flex-col justify-between rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
                <div>
                  <div class="flex items-center gap-3">
                    <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">📚</span>
                    <div>
                      <h3 class="font-display text-base font-extrabold text-ink-900">${escapeHtml(subject.subject_name)}</h3>
                      <p class="text-xs text-slate-500">${escapeHtml(subject.mastery_level)}</p>
                    </div>
                  </div>
                  <div class="mt-4 flex justify-between text-xs font-extrabold text-brand-700">
                    <span>${subject.materials_completed} materi • ${subject.quizzes_taken} kuis</span>
                    <span>${subject.avg_score}%</span>
                  </div>
                  <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-100">
                    <div class="h-full rounded-full bg-brand-700" style="width: ${Math.min(100, subject.avg_score)}%"></div>
                  </div>
                </div>
                <button type="button" data-action="select-subject" data-subject="${Number(subject.subject_id || 0)}"
                  class="mt-4 w-full cursor-pointer rounded-xl bg-brand-700 py-2.5 font-display text-xs font-extrabold text-white transition hover:bg-brand-600">
                  Lanjutkan Quest
                </button>
              </div>
            `).join('') : `
              <div class="flex flex-col justify-between rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-5 shadow-xs sm:col-span-2 lg:col-span-4">
                <div class="flex items-start gap-3">
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl ring-1 ring-brand-100">📊</span>
                  <div>
                    <h3 class="font-display text-base font-extrabold text-ink-900">Belum ada data per mata pelajaran</h3>
                    <p class="mt-1 text-xs leading-relaxed text-slate-500">Selesaikan materi atau kuis pertama. Statistik mapel akan muncul otomatis dari progres belajarmu.</p>
                  </div>
                </div>
                <button type="button" data-action="go" data-route="/quest"
                  class="mt-4 w-full cursor-pointer rounded-xl border-2 border-brand-700 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50 sm:w-auto sm:self-start sm:px-5">
                  Buka Quest
                </button>
              </div>
            `}
          </div>

          <div class="rounded-2xl border border-brand-100 bg-brand-50/75 px-5 py-4 text-xs">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-display font-extrabold text-ink-900">Nyawa per mapel:</span>
              ${livesEntries.length ? livesEntries.map(entry => `
                <span class="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 font-bold text-slate-700 ring-1 ring-brand-100">
                  ${renderHeartsInline(Number(entry.lives || 0), Number(entry.max_lives || 3), 'w-3.5 h-3.5')}
                  <span>${escapeHtml(entry.subject)}</span>
                  <span class="text-[11px] text-slate-500">${Number(entry.lives || 0)}/${Number(entry.max_lives || 3)}</span>
                </span>
              `).join('') : '<span class="text-slate-500">Data nyawa belum tersedia.</span>'}
            </div>
            <p class="mt-2 text-slate-600">Maksimal 3 nyawa per mapel; pulih 1 nyawa tiap 1 jam. Materi tetap bisa dibaca kapan saja tanpa batas.</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Riwayat Kuis</h2>
              <p class="mt-0.5 text-xs text-slate-500 sm:text-sm">Tinjau hasilmu dan pelajari kembali pembahasan dari setiap tantangan.</p>
            </div>
            <span class="font-display text-xs font-extrabold text-brand-700">${hasRealHistory ? `${realHistory.length} kuis tercatat` : 'Hasil kuis tersimpan'}</span>
          </div>

          ${hasRealHistory && quizRows.length > 0 ? `
            <div class="overflow-x-auto rounded-3xl border border-brand-100 bg-white p-4 shadow-xs sm:p-6">
              <table class="min-w-[640px] w-full border-collapse text-left">
                <thead>
                  <tr class="border-b border-brand-100 text-[11px] font-extrabold text-slate-500">
                    <th class="pb-3 pl-3">Kuis &amp; tanggal</th>
                    <th class="pb-3">Jawaban</th>
                    <th class="pb-3">Skor</th>
                    <th class="pb-3">XP diraih</th>
                    <th class="pb-3">Status</th>
                    <th class="pb-3 pr-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-brand-100/70 text-xs sm:text-sm">
                  ${quizRows.map(row => `
                    <tr class="${row.highlight ? 'bg-brand-50/70' : ''}">
                      <td class="rounded-l-2xl py-4 pl-3">
                        <p class="font-display font-extrabold text-ink-900">${escapeHtml(row.title)}</p>
                        <p class="mt-0.5 text-xs text-slate-500">${row.sub}</p>
                      </td>
                      <td class="py-4 font-bold text-ink-900">${row.answer}</td>
                      <td class="py-4"><span class="font-display text-lg font-extrabold text-ink-900">${row.score}</span><span class="text-xs text-slate-500">/100</span></td>
                      <td class="py-4 font-display font-extrabold text-brand-700">${row.xp}</td>
                      <td class="py-4">
                        <span class="inline-block rounded-full px-3 py-0.5 font-display text-xs font-extrabold ${row.statusClass}">
                          ${row.statusText}
                        </span>
                      </td>
                      <td class="rounded-r-2xl py-4 pr-3 text-right">
                        <button type="button" data-action="start-quiz" ${row.materialId ? `data-material="${row.materialId}"` : ''}
                          class="cursor-pointer rounded-xl border border-brand-600 bg-white px-4 py-2 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50">
                          Ulangi Kuis
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="mt-4 flex flex-col justify-between gap-2 border-t border-brand-100 px-2 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center">
                <span>Total ${displayTotalXp.toLocaleString('id-ID')} XP terkumpul dari aktivitas belajarmu.</span>
                <button type="button" data-action="start-quiz" class="cursor-pointer font-display font-extrabold text-brand-700 hover:underline">
                  Mulai Kuis Baru &rarr;
                </button>
              </div>
            </div>
          ` : `
            <div class="rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-8 text-center sm:p-10">
              <span class="text-4xl">🎯</span>
              <h4 class="mt-3 font-display text-lg font-extrabold text-ink-900">Belum Ada Riwayat Kuis</h4>
              <p class="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
                Kamu belum menyelesaikan kuis apapun. Ayo mulai petualangan pertamamu di tab Kuis untuk mencatat skor dan mengumpulkan XP!
              </p>
              <button type="button" data-action="start-quiz"
                class="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-brand-700 px-5 py-2.5 font-display text-xs font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:text-sm">
                <span>⚔️</span>
                <span>Mulai Kuis Pertama</span>
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }
}
