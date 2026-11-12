/**
 * QuestView — katalog mata pelajaran, bab, dan materi.
 */
import { chapterIconSvg } from './helpers.js';

export class QuestView {
  constructor(root) {
    this.root = root;
  }

  render(data) {
    const { user, jenjang, activeSubject, chapters, counts, anyCompleted, totalMaterials } = data;

    const subtitle = this.root.querySelector('#quest-page-subtitle');
    if (subtitle) {
      subtitle.textContent = data.completedCount > 0
        ? `${data.completedCount} dari ${totalMaterials} materi selesai di jenjang ${jenjang}. Lanjutkan materi aktif atau jelajahi mapel lainnya.`
        : `Quest pertamamu dimulai di sini. Pilih mata pelajaran jenjang ${jenjang}, lalu jelajahi materi dan tantangannya.`;
    }

    const activeJenjang = this.root.querySelector('#quest-active-jenjang');
    if (activeJenjang) activeJenjang.textContent = `${user.jenjangDisplay || user.jenjang} • ${user.kelas}`;

    const levelBadge = this.root.querySelector('#quest-subject-level-badge');
    if (levelBadge) levelBadge.textContent = `${user.jenjangDisplay || user.jenjang} • ${user.kelas}`;

    const levelNote = this.root.querySelector('#quest-subject-level-note');
    if (levelNote) levelNote.textContent = `Mapel dan materi mengikuti jenjang ${user.jenjangDisplay || user.jenjang}.`;

    const banner = this.root.querySelector('#quest-old-user-banner');
    if (banner) banner.classList.toggle('hidden', data.completedCount === 0);

    this.renderSubjectProgress('ips', counts.IPS);
    this.renderSubjectProgress('ipa', counts.IPA);
    this.renderSubjectProgress('bind', counts['Bahasa Indonesia'], 'amber');
    this.renderSubjectProgress('ppkn', counts.PPKN, 'amber');

    this.renderActiveSubjectCards(activeSubject);

    this.renderCatalog({ activeSubject, chapters, anyCompleted, totalMaterials, userKelas: user.kelas, jenjang });
  }

  renderActiveSubjectCards(activeSubject) {
    const buttons = this.root.querySelectorAll('[data-action="select-subject"]');
    buttons.forEach(btn => {
      const subj = btn.dataset.subject;
      const card = btn.closest('.flex.flex-col.justify-between.rounded-3xl');
      const isActive = subj === activeSubject;
      if (card) {
        if (isActive) {
          card.classList.remove('border', 'border-brand-100');
          card.classList.add('border-2', 'border-brand-700');
        } else {
          card.classList.remove('border-2', 'border-brand-700');
          card.classList.add('border', 'border-brand-100');
        }
      }
      if (isActive) {
        btn.className = 'mt-5 w-full cursor-pointer rounded-2xl bg-brand-700 py-2.5 font-display text-xs font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:text-sm';
        btn.textContent = 'Lanjutkan Quest';
      } else {
        btn.className = 'mt-5 w-full cursor-pointer rounded-2xl border-2 border-brand-700 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50 sm:text-sm';
        btn.textContent = 'Lihat Bab';
      }
    });
  }

  renderSubjectProgress(prefix, count, color = 'brand') {
    const done = this.root.querySelector(`#${prefix}-done-text`);
    if (done) done.textContent = `${count.done} materi selesai`;

    const percent = count.total ? Math.min(100, Math.round((count.done / count.total) * 100)) : 0;
    const pct = this.root.querySelector(`#${prefix}-pct-text`);
    if (pct) pct.textContent = `${percent}%`;

    const bar = this.root.querySelector(`#${prefix}-progress-bar`);
    if (bar) bar.style.width = `${percent}%`;
  }

  renderCatalog({ activeSubject, chapters, anyCompleted, totalMaterials, userKelas, jenjang }) {
    const container = this.root.querySelector('#ips-bab-catalog');
    if (!container) return;

    const cardsHtml = chapters.map(chapter => {
      const doneInBab = chapter.materials.filter(material => material.__done).length;
      const rowsHtml = chapter.materials.map(material => this.materialRow(chapter, material)).join('');

      return `
        <div class="flex flex-col justify-between rounded-3xl border border-brand-100 bg-white p-6 shadow-xs">
          <div>
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3.5">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50">
                  ${chapterIconSvg(chapter.iconType)}
                </div>
                <div>
                  <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">${chapter.code} • ${chapter.materials.length} MATERI</p>
                  <h3 class="mt-0.5 font-display text-xl font-extrabold text-ink-900">${chapter.title}</h3>
                </div>
              </div>
              <span class="shrink-0 pt-1 text-xs font-extrabold text-slate-500">${doneInBab}/${chapter.materials.length} selesai</span>
            </div>
            <p class="mt-3.5 text-xs text-slate-600 sm:text-sm">${chapter.desc}</p>
            <div class="my-4 border-t border-brand-100/80"></div>
            <div class="space-y-1">${rowsHtml}</div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="space-y-5 pt-4">
        <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 class="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">Jelajahi bab dan materi &mdash; ${activeSubject}</h2>
            <p class="mt-1 text-xs text-slate-500 sm:text-sm">Materi pelajaran ${activeSubject}. Ikuti urutan topik atau pilih bab yang ingin kamu pelajari.</p>
          </div>
          <span class="inline-flex items-center self-start rounded-full bg-brand-100/90 px-4 py-1.5 font-display text-xs font-extrabold text-brand-700 sm:self-auto">
            ${chapters.length} bab • ${totalMaterials} materi
          </span>
        </div>

        <div class="flex flex-col justify-between gap-4 rounded-2xl border border-brand-200/80 bg-brand-50/90 px-5 py-4 sm:flex-row sm:items-center">
          <div class="flex items-start gap-3.5">
            <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-brand-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </span>
            <div>
              <h4 class="font-display text-sm font-extrabold text-ink-900">
                ${anyCompleted ? 'Kuis terkait: Siap dikerjakan! (Nyawa IPS 3/3)' : 'Kuis terkait: Belum terbuka'}
              </h4>
              <p class="mt-0.5 text-xs leading-relaxed text-slate-600">
                Selesaikan materi terkait untuk membuka kuisnya. Materi lain tetap bisa kamu pelajari tanpa menunggu. Tingkat kesulitan kuis akan sesuai dengan rankmu.
              </p>
            </div>
          </div>
          ${anyCompleted ? `
            <button type="button" data-action="start-quiz"
              class="shrink-0 cursor-pointer self-start rounded-2xl bg-brand-700 px-5 py-2.5 font-display text-xs font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:self-auto sm:text-sm">
              Mulai Kuis &rarr;
            </button>
          ` : ''}
        </div>

        <div class="grid gap-6 lg:grid-cols-2">${cardsHtml}</div>

        <p class="pt-1 text-xs text-slate-400">
          Katalog ini berisi ${totalMaterials} contoh materi ${activeSubject} untuk ${jenjang}, belum mencakup seluruh kurikulum. ${userKelas} adalah informasi profilmu.
        </p>
      </div>
    `;
  }

  materialRow(chapter, material) {
    const isDone = Boolean(material.__done);
    const isHighlighted = material.recommended && !isDone;

    return `
      <div data-action="open-material" data-bab="${chapter.id}" data-mat="${material.id}" data-step="1"
        class="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition ${
          isHighlighted ? 'bg-brand-50/90 hover:bg-brand-100/80' : 'hover:bg-brand-50/60'
        }">
        <div class="flex min-w-0 items-center gap-3.5">
          ${isDone
            ? `<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                 <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
               </span>`
            : `<span class="flex h-6 w-6 shrink-0 items-center justify-center text-brand-700">
                 <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.9" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
               </span>`
          }
          <div class="min-w-0">
            <p class="truncate font-display text-[15px] font-extrabold text-ink-900 transition group-hover:text-brand-700">${material.title}</p>
            <p class="mt-0.5 text-xs text-slate-500">${isDone ? '<span class="font-bold text-emerald-700">✓ Selesai</span>' : 'Belum dimulai'} • ${material.duration}</p>
          </div>
        </div>
        <span class="inline-flex shrink-0 items-center gap-1 font-display text-xs font-extrabold text-brand-700 transition group-hover:translate-x-0.5">
          Lihat materi
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </span>
      </div>
    `;
  }
}
