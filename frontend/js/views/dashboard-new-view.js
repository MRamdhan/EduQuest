/**
 * DashboardNewView — beranda petualang baru, diisi dari backend.
 */
import { ASSETS } from '../assets/mascot-assets.js';
import { escapeHtml } from '../core/dom.js';
import { getShortName, jenjangText, xpPercent, formatDate } from '../core/format.js';
import { RankShowcaseView } from './components/rank-showcase-view.js';

export class DashboardNewView {
  constructor(root) {
    this.root = root;
    this.rankShowcase = new RankShowcaseView(root);
  }

  render(state) {
    const user = state.user;

    const mascot = this.root.querySelector('#new-user-hero-mascot');
    if (mascot) mascot.src = ASSETS.mascot;

    const jenjangTag = this.root.querySelector('#new-user-jenjang-tag');
    if (jenjangTag) jenjangTag.textContent = jenjangText(user);

    const welcomeTitle = this.root.querySelector('#new-user-welcome-title');
    if (welcomeTitle) welcomeTitle.textContent = `Halo, ${getShortName(user.fullName)}!`;

    const copy = this.root.querySelector('#new-user-welcome-copy');
    if (copy) {
      copy.textContent = `Selamat datang! Materi dan kuis di jenjang ${user.jenjangDisplay || user.jenjang} sudah siap. Kumpulkan XP untuk naik level dan rank.`;
    }

    const levelBadge = this.root.querySelector('#new-user-level-badge');
    if (levelBadge) levelBadge.textContent = `Level ${user.level} • ${user.rank}`;

    const xpDisplay = this.root.querySelector('#new-user-xp-display');
    if (xpDisplay) xpDisplay.textContent = `${user.xp} / ${user.nextLevelXp || 100} XP`;

    const xpBar = this.root.querySelector('#new-user-xp-bar');
    if (xpBar) xpBar.style.width = `${xpPercent(user)}%`;

    const rankHint = this.root.querySelector('#new-user-rank-rule-hint');
    if (rankHint) {
      rankHint.textContent = user.nextRank
        ? `Rank ${user.nextRank} terbuka di ${Number(user.xpToNextRank || 0)} XP lagi.`
        : 'Kumpulkan XP dari materi dan kuis untuk naik rank.';
    }

    this.renderFirstQuest(state);
    this.renderAchievements(state);
    this.rankShowcase.render(user.rank, state.ranks || []);
  }

  renderFirstQuest(state) {
    const container = this.root.querySelector('#new-user-first-quest');
    if (!container) return;

    const quest = state.quest || {};
    const materials = Array.isArray(quest.materials) ? quest.materials : [];
    if (!materials.length) {
      container.innerHTML = `
        <div class="rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/60 p-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <span class="pill">Pilih Quest Pertamamu</span>
            <h2 class="mt-2 font-display text-xl font-extrabold text-ink-900">Materi belum tersedia untuk jenjangmu</h2>
            <p class="mt-1 text-xs text-slate-500">Katalog materi akan tampil otomatis setelah ditambahkan di backend.</p>
          </div>
          <button type="button" data-action="go" data-route="/quest" class="btn-primary btn-sm mt-4 sm:mt-0">Buka Quest</button>
        </div>
      `;
      return;
    }

    const material = materials.find(item => !item.is_completed) || materials[0];
    const subject = (quest.subjects || []).find(item => Number(item.id) === Number(material.subject_id));
    const subjectMaterials = materials.filter(item => Number(item.subject_id) === Number(material.subject_id));
    const completed = subjectMaterials.filter(item => item.is_completed).length;
    const total = subjectMaterials.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    container.innerHTML = `
      <div class="rounded-3xl border-2 border-brand-300 bg-brand-50/60 p-6 shadow-xs sm:p-7">
        <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div class="flex flex-1 items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-white text-2xl">${escapeHtml(subject?.icon || '🎯')}</div>
            <div class="flex-1">
              <span class="pill">Pilih Quest Pertamamu</span>
              <h2 class="mt-2 font-display text-xl font-extrabold text-ink-900">${escapeHtml(material.title)}</h2>
              <p class="mt-1 text-xs text-slate-500">${escapeHtml(subject?.name || material.subject || '')} • ${completed}/${total} materi selesai • ${escapeHtml(material.durationLabel || 'Materi singkat')}</p>
              <div class="mt-3 h-2 w-full max-w-md overflow-hidden rounded-full bg-brand-100">
                <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width:${percent}%"></div>
              </div>
            </div>
          </div>
          <div class="flex w-full shrink-0 flex-col gap-2 sm:flex-row md:w-auto">
            <button type="button" data-action="open-material" data-subject="${material.subject_id}" data-material="${material.id}" data-step="1"
              class="btn-primary btn-sm">Mulai Belajar</button>
            <button type="button" data-action="start-quiz" data-material="${material.id}"
              class="btn-outline btn-sm">Mulai Kuis</button>
          </div>
        </div>
      </div>
    `;
  }

  renderAchievements(state) {
    const container = this.root.querySelector('#new-user-achievements');
    const copy = this.root.querySelector('#new-user-achievement-copy');
    if (!container) return;

    const achievements = state.progressSummary?.achievements || [];
    if (!achievements.length) {
      if (copy) copy.textContent = 'Belum ada lencana. Selesaikan materi dan kuis pertama untuk membukanya.';
      container.innerHTML = `
        <div class="card !p-5 text-center bg-slate-50 opacity-75">
          <span class="text-2xl">🔒</span>
          <h4 class="mt-2 font-display text-sm font-extrabold text-ink-900">Langkah Pertama</h4>
          <p class="text-[11px] text-slate-400">Selesaikan 1 materi</p>
          <span class="mt-3 inline-block rounded-full bg-slate-200 px-3 py-0.5 text-[10px] font-bold text-slate-600">Terkunci</span>
        </div>
        <div class="card !p-5 text-center bg-slate-50 opacity-75">
          <span class="text-2xl">🔒</span>
          <h4 class="mt-2 font-display text-sm font-extrabold text-ink-900">Penakluk Kuis</h4>
          <p class="text-[11px] text-slate-400">Selesaikan 1 kuis</p>
          <span class="mt-3 inline-block rounded-full bg-slate-200 px-3 py-0.5 text-[10px] font-bold text-slate-600">Terkunci</span>
        </div>
      `;
      return;
    }

    if (copy) copy.textContent = `${achievements.length} lencana sudah terbuka dari petualanganmu.`;
    container.innerHTML = achievements.slice(0, 4).map(item => `
      <div class="card !p-5 text-center bg-white">
        <span class="text-2xl">🏅</span>
        <h4 class="mt-2 font-display text-sm font-extrabold text-ink-900">${escapeHtml(item.title)}</h4>
        <p class="text-[11px] text-slate-500">${escapeHtml(item.description)}</p>
        <span class="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-[10px] font-bold text-emerald-700">Terbuka · ${escapeHtml(formatDate(item.unlocked_at))}</span>
      </div>
    `).join('');
  }
}
