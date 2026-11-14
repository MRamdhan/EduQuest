/**
 * DashboardOldView — beranda petualang yang sudah punya progres.
 * Seluruh data diambil dari /progress/, /quest/, /quizzes/history/, dan /tutor/recommendations/.
 */
import { ASSETS } from '../assets/mascot-assets.js';
import { RANK_TIERS, getRankAssetKey } from '../config/constants.js';
import { escapeHtml } from '../core/dom.js';
import { formatDate, getShortName, jenjangText, xpPercent } from '../core/format.js';
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

function difficultyLabel(value) {
  if (Number(value) === 3) return 'Sulit';
  if (Number(value) === 2) return 'Sedang';
  return 'Dasar';
}

export class DashboardOldView {
  constructor(root) {
    this.root = root;
  }

  render(state) {
    const user = state.user;
    const progress = state.progressSummary || {};
    const stats = state.profileStats || {};
    const quest = state.quest || {};
    const materials = Array.isArray(quest.materials) ? quest.materials : [];
    const subjects = Array.isArray(quest.subjects) ? quest.subjects : [];
    const shortName = getShortName(user.fullName);
    const displayJenjang = jenjangText(user);
    const percent = xpPercent(user);
    const remainingXp = Math.max(0, (user.nextLevelXp || 100) - (user.xp || 0));
    const completedCount = Number(progress.materials_completed ?? Object.keys(state.completedMaterials || {}).length);
    const quizzesCount = Number(progress.quizzes_submitted ?? stats.total_quizzes ?? (state.profileQuizHistory?.length || 0));
    const activeRankKey = getRankAssetKey(user.rank);
    const rankEmblem = ASSETS[activeRankKey] || ASSETS.rekrut;

    this.root.innerHTML = `
      <div class="space-y-6 pb-12">
        <section class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-8">
          <div class="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div class="flex flex-1 flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div class="flex w-24 shrink-0 justify-center sm:w-28">
                <img src="${ASSETS.mascot}" alt="Maskot EduQuest" class="h-auto w-full select-none object-contain drop-shadow-sm" />
              </div>
              <div class="flex-1">
                <span class="inline-block rounded-full bg-brand-100/90 px-3.5 py-1 font-display text-xs font-extrabold text-brand-700">${escapeHtml(displayJenjang)}</span>
                <h1 class="mt-2.5 font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Halo, ${escapeHtml(shortName)}!</h1>
                <p class="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  ${completedCount} materi dan ${quizzesCount} kuis selesai • Total ${Number(user.totalXp || 0).toLocaleString('id-ID')} XP.<br>
                  Level ${Number(user.level || 1)} • Rank ${escapeHtml(user.rank || 'Bronze')} • Sisa ${remainingXp} XP menuju Level ${Number(user.level || 1) + 1}.
                </p>
                ${this.renderActiveQuest(state)}
              </div>
            </div>

            <div class="w-full shrink-0 space-y-3 lg:w-80">
              <div class="flex items-center gap-3.5 rounded-2xl border border-brand-100 bg-brand-50/75 p-4">
                <img src="${rankEmblem}" alt="${escapeHtml(user.rank || '')} Emblem" class="h-12 w-12 shrink-0 object-contain drop-shadow-2xs" />
                <div>
                  <p class="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">LEVEL &amp; RANK SAAT INI</p>
                  <p class="font-display text-lg font-extrabold leading-tight text-ink-900">Level ${Number(user.level || 1)} • ${escapeHtml(user.rank || 'Bronze')}</p>
                  <p class="mt-0.5 text-xs text-slate-600">${Number(user.totalXp || 0).toLocaleString('id-ID')} Total XP</p>
                </div>
              </div>

              <div class="rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
                <div class="flex items-center justify-between font-display text-xs font-extrabold">
                  <span class="text-ink-900">Level ${Number(user.level || 1)}</span>
                  <span class="text-brand-700">${Number(user.xp || 0)}/${Number(user.nextLevelXp || 100)} XP</span>
                </div>
                <div class="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-brand-100">
                  <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width: ${percent}%"></div>
                </div>
                <p class="mt-2 text-[11px] font-bold text-slate-500">${user.nextRank ? `Rank ${escapeHtml(user.nextRank)} di ${Number(user.xpToNextRank || 0)} XP lagi` : 'Terus kumpulkan XP untuk naik rank'}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 grid gap-3 border-t border-brand-100 pt-5 sm:grid-cols-3 lg:grid-cols-5">
            ${this.renderRankStrip(user, state.ranks || [])}
          </div>
        </section>

        ${this.renderSubjects(subjects, materials, user, completedCount)}

        ${this.renderRecommendations(state)}

        ${this.renderAchievements(state)}

        <section class="grid gap-5 lg:grid-cols-2">
          ${this.renderLastQuiz(state)}
          <div class="flex flex-col justify-between rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
            <div class="flex items-start gap-3.5">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-xl">🦉</span>
              <div>
                <h3 class="font-display text-lg font-extrabold text-ink-900">Bantuan AI Tutor</h3>
                <p class="mt-1 text-xs leading-relaxed text-slate-600">Tanyakan konsep dari materi yang sedang kamu pelajari. AI Tutor memberi petunjuk bertahap, bukan jawaban akhir.</p>
                <p class="mt-1 text-[11px] text-slate-400">AI dapat keliru. Jika layanan tidak tersedia, lanjutkan belajar melalui materi.</p>
              </div>
            </div>
            <button type="button" data-action="go" data-route="/ai-tutor" class="mt-4 w-full cursor-pointer rounded-2xl bg-brand-700 px-5 py-2.5 font-display text-xs font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:w-auto sm:self-start">Tanya AI Tutor</button>
          </div>
        </section>
      </div>
    `;
  }

  renderActiveQuest(state) {
    const materials = state.quest?.materials || [];
    if (!materials.length) {
      return `
        <div class="mt-4 rounded-2xl border border-dashed border-brand-200 bg-brand-50/70 px-4 py-3 text-xs font-bold text-brand-700">
          Katalog materi belum tersedia untuk jenjangmu. Coba muat ulang halaman Quest.
        </div>
      `;
    }

    const material = materials.find(item => !item.is_completed) || materials[0];
    const subject = (state.quest?.subjects || []).find(item => Number(item.id) === Number(material.subject_id));
    const siblings = materials.filter(item => Number(item.subject_id) === Number(material.subject_id));
    const done = siblings.filter(item => item.is_completed).length;
    const total = siblings.length || 1;
    const pct = Math.round((done / total) * 100);

    return `
      <div data-action="open-material" data-subject="${material.subject_id}" data-material="${material.id}" data-step="1"
        class="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/90 px-4 py-3 transition hover:bg-brand-100/60">
        <div class="flex min-w-0 items-center gap-3">
          <span class="shrink-0 text-lg">🎯</span>
          <div class="min-w-0">
            <p class="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">QUEST AKTIF · ${escapeHtml(subject?.name || material.subject || '')}</p>
            <p class="truncate font-display text-xs font-extrabold text-ink-900 sm:text-sm">${escapeHtml(material.title)}</p>
            <p class="mt-0.5 text-[11px] text-slate-500">${done}/${total} materi mapel selesai</p>
          </div>
        </div>
        <span class="shrink-0 rounded-full bg-brand-700 px-3 py-1 font-display text-xs font-extrabold text-white">${pct}%</span>
      </div>
    `;
  }

  renderRankStrip(user, ranks) {
    const tiers = Array.isArray(ranks) && ranks.length
      ? ranks.map(rank => ({
        key: getRankAssetKey(rank.name || rank.code),
        rank: rank.name || rank.code,
        minXp: rank.min_xp !== undefined ? `${Number(rank.min_xp).toLocaleString('id-ID')}+ XP` : ''
      }))
      : RANK_TIERS;
    const activeKey = getRankAssetKey(user.rank);

    return tiers.map(tier => {
      const isActive = tier.key === activeKey;
      return `
        <div class="flex items-center gap-3 rounded-2xl ${isActive ? 'border-2 border-brand-700 bg-brand-50/75' : 'border border-brand-100 bg-white'} px-4 py-3">
          <img src="${ASSETS[tier.key] || ''}" alt="${escapeHtml(tier.rank)}" class="h-8 w-8 shrink-0 object-contain" />
          <div>
            <p class="font-display text-xs font-extrabold ${isActive ? 'text-brand-700' : 'text-ink-900'}">${escapeHtml(tier.rank)}</p>
            <p class="text-[11px] ${isActive ? 'font-bold text-brand-700' : 'text-slate-500'}">${escapeHtml(tier.minXp)}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  renderSubjects(subjects, materials, user, completedCount) {
    const cards = subjects.map(subject => {
      const list = materials.filter(item => Number(item.subject_id) === Number(subject.id));
      const done = list.filter(item => item.is_completed).length;
      const total = list.length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      return `
        <div class="flex flex-col justify-between rounded-2xl border border-brand-100 p-5">
          <div>
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">${escapeHtml(subject.icon || subjectEmoji(subject.name))}</span>
                <div>
                  <h3 class="font-display text-base font-extrabold text-ink-900">${escapeHtml(subject.name)}</h3>
                  <p class="text-[11px] font-bold text-brand-700">${escapeHtml(subject.level_name || user.jenjangDisplay || '')}</p>
                </div>
              </div>
              <span class="inline-flex items-center gap-0.5">${renderHeartsInline(Number(subject.lives ?? 3), Number(subject.max_lives ?? 3), 'h-3.5 w-3.5')}</span>
            </div>
            <div class="mt-4 flex justify-between text-xs font-extrabold text-brand-700">
              <span>${done}/${total} materi selesai</span>
              <span>${pct}%</span>
            </div>
            <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-100">
              <div class="h-full rounded-full bg-brand-700" style="width: ${pct}%"></div>
            </div>
          </div>
          <button type="button" data-action="select-subject" data-subject="${subject.id}" class="mt-4 w-full cursor-pointer rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50">
            ${done > 0 ? 'Lanjutkan Quest' : 'Lihat Materi'}
          </button>
        </div>
      `;
    }).join('');

    return `
      <section class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-7">
        <div>
          <h2 class="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Mata Pelajaran</h2>
          <p class="mt-0.5 text-xs text-slate-500 sm:text-sm">${completedCount} materi selesai di jenjang ${escapeHtml(user.jenjangDisplay || user.jenjang)}. Nyawa terpisah per mapel dan pulih seiring waktu.</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">${cards || '<p class="text-xs text-slate-500">Belum ada mapel dengan materi di jenjangmu.</p>'}</div>
      </section>
    `;
  }

  renderRecommendations(state) {
    const reco = state.profileRecommendation;
    const weak = reco?.weak_topics || [];
    const next = reco?.next_topics || [];
    const items = [
      ...weak.map(item => ({ ...item, kind: 'weak', badge: 'Perlu penguatan' })),
      ...next.map(item => ({ ...item, kind: 'next', badge: 'Berikutnya' }))
    ].slice(0, 3);

    const hasTopics = items.length > 0;
    const emptyCopy = reco
      ? 'Semua materi di jenjangmu sudah tuntas dan tidak ada nilai kuis yang perlu diulang. Coba kuis di tingkat kesulitan lebih tinggi untuk tantangan baru.'
      : 'Belum ada rekomendasi. Selesaikan satu kuis untuk mendapatkan saran topik.';

    const cards = items.map(item => `
      <div class="flex flex-col justify-between rounded-2xl border border-brand-100 p-5">
        <div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-extrabold text-brand-700">${escapeHtml(item.subject || '')}</span>
            <span class="rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${item.kind === 'weak' ? 'bg-amber-100 text-amber-800' : 'bg-brand-100 text-brand-700'}">${escapeHtml(item.badge)}</span>
          </div>
          <h3 class="mt-2 font-display text-lg font-extrabold text-ink-900">${escapeHtml(item.title || '')}</h3>
          <p class="mt-1 text-xs leading-relaxed text-slate-500">${escapeHtml(item.reason || '')}</p>
        </div>
        <button type="button" data-action="open-material" data-subject="0" data-material="${Number(item.material_id || 0)}" data-step="1" class="mt-4 w-full cursor-pointer rounded-xl border-2 border-brand-700 py-2 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50" ${!item.material_id ? 'disabled' : ''}>
          Buka Materi
        </button>
      </div>
    `).join('');

    return `
      <section class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-7">
        <div>
          <h2 class="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Rekomendasi Quest Berikutnya</h2>
          <p class="mt-0.5 text-xs text-slate-500 sm:text-sm">${reco?.personalized_message ? escapeHtml(reco.personalized_message) : 'Rekomendasi dibuat dari riwayat kuis dan progres materimu.'}</p>
        </div>
        <div class="grid gap-5 md:grid-cols-3">${hasTopics ? cards : `<p class="text-xs text-slate-500">${escapeHtml(emptyCopy)}</p>`}</div>
      </section>
    `;
  }

  renderAchievements(state) {
    const achievements = state.progressSummary?.achievements || [];
    const cards = achievements.slice(0, 4).map(item => `
      <div class="rounded-2xl border border-brand-100 bg-white p-5 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">🏅</div>
        <h4 class="mt-3 font-display text-sm font-extrabold text-ink-900">${escapeHtml(item.title)}</h4>
        <p class="mt-0.5 text-xs text-slate-500">${escapeHtml(item.description)}</p>
        <p class="mt-2 text-[11px] font-extrabold text-emerald-700">Terbuka · ${escapeHtml(formatDate(item.unlocked_at))}</p>
      </div>
    `).join('');

    return `
      <section class="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-7">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Achievement Terbaru</h2>
            <p class="mt-0.5 text-xs text-slate-500 sm:text-sm">Lencana yang sudah terbuka dari petualanganmu.</p>
          </div>
          <button type="button" data-action="go" data-route="/profil" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline">Lihat Profil &rarr;</button>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">${cards || `
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center opacity-80">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl">🔒</div>
            <h4 class="mt-3 font-display text-sm font-extrabold text-ink-900">Belum ada lencana</h4>
            <p class="mt-0.5 text-xs text-slate-500">Selesaikan materi dan kuis untuk membuka lencana pertamamu.</p>
          </div>
        `}</div>
      </section>
    `;
  }

  renderLastQuiz(state) {
    const recent = state.progressSummary?.recent_attempts?.[0]
      || state.profileQuizHistory?.[0]
      || null;

    if (!recent) {
      return `
        <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
          <h2 class="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Hasil Kuis Terakhir</h2>
          <p class="mt-2 text-xs text-slate-500">Belum ada kuis yang selesai. Mulai dari materi aktifmu, lalu uji pemahaman lewat kuis.</p>
          <button type="button" data-action="go" data-route="/quest" class="btn-primary btn-sm mt-4">Buka Quest</button>
        </div>
      `;
    }

    const title = recent.material?.title || recent.title || `Kuis #${recent.id}`;
    const correct = Number(recent.correct_count || 0);
    const total = Number(recent.total_questions || 0);
    const score = Math.round(Number(recent.percent || 0));
    const date = formatDate(recent.submitted_at || recent.started_at);

    return `
      <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">Hasil Kuis Terakhir</h2>
          <span class="pill">${escapeHtml(difficultyLabel(recent.target_difficulty))}</span>
        </div>
        <div class="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 sm:flex-row sm:items-center">
          <div class="flex items-center gap-3.5">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-white text-xl">🏆</div>
            <div>
              <h4 class="font-display text-base font-extrabold text-ink-900">${escapeHtml(title)}</h4>
              <p class="mt-0.5 text-xs text-slate-500">${escapeHtml(date)} • ${correct} dari ${total} jawaban benar</p>
            </div>
          </div>
          <div class="flex items-center gap-6">
            <div>
              <p class="text-[10px] font-bold text-slate-500">Skor</p>
              <p class="font-display text-xl font-extrabold text-ink-900">${score}%</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-500">XP diraih</p>
              <p class="font-display text-xl font-extrabold text-ink-900">+${Number(recent.xp_gained || 0)} XP</p>
            </div>
          </div>
        </div>
        ${recent.material?.id ? `
          <button type="button" data-action="start-quiz" data-material="${recent.material.id}" class="btn-outline btn-sm mt-4">Ulangi Kuis</button>
        ` : ''}
      </div>
    `;
  }
}
