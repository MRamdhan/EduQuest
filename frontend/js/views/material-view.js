/**
 * MaterialView — halaman baca materi dengan dua tahap (Materi & Contoh).
 */
export class MaterialView {
  constructor(root) {
    this.root = root;
  }

  render(data) {
    const { subject = 'IPS', chapter, material, nextMaterial, step, completed, totalCompleted, totalPct, chapterCount, totalMaterials } = data;
    const materialIndex = chapter.materials.findIndex(item => item.id === material.id);
    const currentMaterial = materialIndex >= 0 ? material : chapter.materials[0];
    const next = nextMaterial || chapter.materials[0];
    const chapterDone = chapter.materials.filter(item => completed[item.id]).length;

    const sidebarItemsHtml = chapter.materials.map(item => {
      const isCurrent = item.id === currentMaterial.id;
      const isDone = Boolean(completed[item.id]);
      return `
        <button type="button" data-action="open-material" data-bab="${chapter.id}" data-mat="${item.id}" data-step="1"
          class="flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3 text-left transition ${
            isCurrent ? 'border-brand-100 bg-brand-50/95' : 'border-transparent hover:bg-slate-50'
          }">
          <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center ${isCurrent || isDone ? 'text-brand-700' : 'text-slate-600'}">
            ${isDone
              ? `<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M8.5 12.5l2.5 2.5 4.5-5"/></svg>`
              : `<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
            }
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-display text-xs font-extrabold leading-snug ${isCurrent ? 'text-brand-700' : 'text-ink-900'}">${item.title}</p>
            <p class="mt-0.5 text-[11px] text-slate-500">
              ${isDone ? '✓ Selesai' : isCurrent ? 'Sedang dipelajari' : 'Belum dimulai'}
            </p>
          </div>
        </button>
      `;
    }).join('');

    const stepsMeta = [
      { num: 1, code: '01', label: 'Materi', done: step > 1 || Boolean(completed[currentMaterial.id]) },
      { num: 2, code: '02', label: 'Contoh', done: Boolean(completed[currentMaterial.id]) }
    ];

    const stepperHtml = stepsMeta.map(item => {
      const isActive = step === item.num;
      const showCheck = item.done && !isActive;
      return `
        <button type="button" data-action="set-step" data-step="${item.num}"
          class="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 pb-3.5 pr-4 font-display text-xs font-extrabold transition sm:text-sm ${
            isActive
              ? 'border-brand-700 text-brand-700'
              : showCheck
              ? 'border-transparent text-slate-600 hover:text-brand-700'
              : 'border-transparent text-slate-500 hover:text-ink-900'
          }">
          <span class="${isActive || showCheck ? 'text-brand-700' : 'text-slate-400'}">${showCheck ? '✓' : item.code}</span>
          <span>${item.label}</span>
        </button>
      `;
    }).join('');

    const stepBodyHtml = step === 1 ? this.renderMateriStep() : this.renderContohStep(chapter, currentMaterial, next);

    this.root.innerHTML = `
      <div class="grid items-start gap-8 lg:grid-cols-[260px_1fr]">
        <aside class="space-y-6 rounded-3xl border border-brand-100 bg-white p-5 shadow-xs">
          <button type="button" data-action="close-material" class="inline-flex cursor-pointer items-center gap-2 font-display text-xs font-extrabold text-brand-700 hover:underline sm:text-sm">
            <span>&larr;</span> Kembali ke daftar materi
          </button>

          <div class="rounded-2xl border border-brand-200/80 bg-brand-50/50 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-white text-xl shadow-2xs">🌍</div>
              <div>
                <h3 class="font-display text-base font-extrabold leading-tight text-ink-900">${subject}</h3>
                <p class="text-xs font-bold text-brand-700">${chapterCount} bab · ${totalMaterials} materi</p>
              </div>
            </div>
            <div class="mt-3.5 flex items-center justify-between text-[11px] font-extrabold text-brand-700">
              <span>${totalCompleted}/${totalMaterials} materi selesai</span>
              <span>${totalPct}%</span>
            </div>
            <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-100">
              <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width: ${totalPct}%"></div>
            </div>
          </div>

          <div>
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">${chapter.code}</p>
            <h4 class="mt-0.5 font-display text-base font-extrabold text-ink-900">${chapter.title}</h4>
            <p class="mt-0.5 text-xs text-slate-500">${chapterDone}/${chapter.materials.length} materi bab selesai</p>
            <div class="mt-4 space-y-1.5">${sidebarItemsHtml}</div>
          </div>

          <p class="border-t border-brand-100/70 pt-2 text-xs leading-relaxed text-slate-500">
            Kamu bebas membuka materi mana pun. Belajar sesuai kebutuhanmu.
          </p>
        </aside>

        <div class="min-w-0">
          <p class="text-xs font-semibold text-slate-500">
            ${subject} · ${chapter.code.charAt(0) + chapter.code.slice(1).toLowerCase()} ${chapter.title} · ${currentMaterial.duration.replace(' ', '')}
          </p>
          <h1 class="mt-1 font-display text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">${currentMaterial.title}</h1>

          <div class="mt-6 flex items-center gap-6 overflow-x-auto border-b border-brand-100 sm:gap-10">${stepperHtml}</div>

          <div class="mt-6">${stepBodyHtml}</div>
        </div>
      </div>
    `;
  }

  renderMateriStep() {
    return `
      <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-9">
        <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">YANG AKAN KAMU PAHAMI</p>
        <h2 class="mt-1.5 font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">Satu lingkungan, dua cara melihat</h2>
        <p class="mt-2 text-sm leading-relaxed text-slate-600">
          Kenali ruang sebagai tempat beraktivitas dan wilayah dari ciri yang dimilikinya. Coba amati tempat-tempat di sekitarmu.
        </p>

        <div class="mt-7 space-y-6">
          <div class="flex items-start gap-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <h3 class="font-display text-lg font-extrabold text-ink-900 sm:text-xl">Apa itu ruang?</h3>
              <p class="mt-1 text-sm leading-relaxed text-slate-600">
                Ruang adalah tempat di permukaan bumi tempat makhluk hidup tinggal dan beraktivitas. Rumah untuk tinggal, sekolah untuk belajar, dan jalan untuk berpindah adalah contoh ruang dalam keseharian kita.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            </div>
            <div>
              <h3 class="font-display text-lg font-extrabold text-ink-900 sm:text-xl">Apa itu wilayah?</h3>
              <p class="mt-1 text-sm leading-relaxed text-slate-600">
                Wilayah adalah bagian ruang dengan ciri tertentu yang membedakannya dari bagian ruang lain. Cirinya dapat berupa kondisi alam atau kegiatan manusia. Batas wilayah tidak selalu mengikuti batas administratif, seperti desa atau kota.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-7 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-brand-100/80 bg-brand-50/60 p-5">
            <div class="flex items-center gap-2.5">
              <span class="text-brand-700"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg></span>
              <h4 class="font-display text-base font-extrabold text-ink-900">Di sekolah</h4>
            </div>
            <p class="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">Kamu belajar bersama guru dan teman. Perhatian kita ada pada tempat kegiatan berlangsung.</p>
          </div>

          <div class="rounded-2xl border border-brand-100/80 bg-brand-50/60 p-5">
            <div class="flex items-center gap-2.5">
              <span class="text-brand-700"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V6m0 0c-3 0-5 2-5 5 3 0 5-2 5-5zm0 0c3 0 5 2 5 5-3 0-5-2-5-5zM5 19h14"/></svg></span>
              <h4 class="font-display text-base font-extrabold text-ink-900">Di kawasan persawahan</h4>
            </div>
            <p class="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">Sawah-sawah berdekatan memiliki ciri kegiatan pertanian: menanam dan memanen padi.</p>
          </div>
        </div>

        <div class="mt-4 flex items-start gap-3.5 rounded-2xl border border-brand-100 bg-brand-50/90 p-5">
          <span class="mt-0.5 shrink-0 text-brand-700"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg></span>
          <div>
            <h4 class="font-display text-sm font-extrabold text-brand-700">Ingat: keduanya saling berkaitan</h4>
            <p class="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">Satu tempat bisa dipahami sebagai ruang sekaligus bagian suatu wilayah. Sekolah adalah ruang belajar dan dapat berada di dalam wilayah permukiman.</p>
          </div>
        </div>

        <div class="mt-8 flex flex-col items-center justify-between gap-4 border-t border-brand-100 pt-5 sm:flex-row">
          <button type="button" data-action="close-material" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline sm:text-sm">
            &larr; Kembali ke daftar materi
          </button>
          <button type="button" data-action="set-step" data-step="2" class="w-full cursor-pointer rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:w-auto">
            Lanjut ke Contoh &rarr;
          </button>
        </div>
      </div>
    `;
  }

  renderContohStep(chapter, material, nextMaterial) {
    return `
      <div class="rounded-3xl border border-brand-100 bg-white p-6 shadow-xs sm:p-9">
        <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">AMATI LINGKUNGAN SEKITAR</p>
        <h2 class="mt-1.5 font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">Apa yang kamu lihat di sekitar sekolah?</h2>
        <p class="mt-2 text-sm leading-relaxed text-slate-600">
          Ada rumah, jalan, sekolah, dan kawasan persawahan. Kita bisa memahaminya dengan memperhatikan tempat kegiatan atau kesamaan cirinya.
        </p>

        <div class="mt-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-[#f2f5ee] p-4 sm:p-6">
          <svg viewBox="0 0 800 250" class="h-auto w-full select-none">
            <text x="110" y="32" text-anchor="middle" fill="#1e1650" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14">Rumah</text>
            <text x="380" y="28" text-anchor="middle" fill="#1e1650" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14">Sekolah</text>
            <text x="645" y="24" text-anchor="middle" fill="#1e1650" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14">Kawasan persawahan</text>

            <g transform="translate(45, 55)"><polygon points="20,0 0,20 40,20" fill="#a78bfa"/><rect x="4" y="20" width="32" height="30" rx="2" fill="#e9decb"/></g>
            <g transform="translate(100, 48)"><polygon points="20,0 0,20 40,20" fill="#a78bfa"/><rect x="4" y="20" width="32" height="30" rx="2" fill="#e9decb"/></g>
            <g transform="translate(155, 58)"><polygon points="20,0 0,20 40,20" fill="#a78bfa"/><rect x="4" y="20" width="32" height="30" rx="2" fill="#e9decb"/></g>

            <g transform="translate(305, 42)"><polygon points="20,0 130,0 150,22 0,22" fill="#7c3aed"/><rect x="0" y="22" width="150" height="44" rx="3" fill="#ddd6fe"/></g>

            <g transform="translate(550, 38)">
              <rect x="0" y="0" width="190" height="22" rx="6" fill="#c7d3a8"/>
              <g stroke="#7b9645" stroke-width="1.6" stroke-linecap="round">
                <path d="M18 17v-9m0 4l-3-3m3 3l3-3"/><path d="M40 17v-9m0 4l-3-3m3 3l3-3"/><path d="M62 17v-9m0 4l-3-3m3 3l3-3"/><path d="M84 17v-9m0 4l-3-3m3 3l3-3"/><path d="M106 17v-9m0 4l-3-3m3 3l3-3"/><path d="M128 17v-9m0 4l-3-3m3 3l3-3"/><path d="M150 17v-9m0 4l-3-3m3 3l3-3"/><path d="M172 17v-9m0 4l-3-3m3 3l3-3"/>
              </g>
              <rect x="0" y="28" width="190" height="22" rx="6" fill="#c7d3a8"/>
              <g stroke="#7b9645" stroke-width="1.6" stroke-linecap="round" transform="translate(0, 28)">
                <path d="M18 17v-9m0 4l-3-3m3 3l3-3"/><path d="M40 17v-9m0 4l-3-3m3 3l3-3"/><path d="M62 17v-9m0 4l-3-3m3 3l3-3"/><path d="M84 17v-9m0 4l-3-3m3 3l3-3"/><path d="M106 17v-9m0 4l-3-3m3 3l3-3"/><path d="M128 17v-9m0 4l-3-3m3 3l3-3"/><path d="M150 17v-9m0 4l-3-3m3 3l3-3"/><path d="M172 17v-9m0 4l-3-3m3 3l3-3"/>
              </g>
              <rect x="0" y="56" width="190" height="22" rx="6" fill="#c7d3a8"/>
              <g stroke="#7b9645" stroke-width="1.6" stroke-linecap="round" transform="translate(0, 56)">
                <path d="M18 17v-9m0 4l-3-3m3 3l3-3"/><path d="M40 17v-9m0 4l-3-3m3 3l3-3"/><path d="M62 17v-9m0 4l-3-3m3 3l3-3"/><path d="M84 17v-9m0 4l-3-3m3 3l3-3"/><path d="M106 17v-9m0 4l-3-3m3 3l3-3"/><path d="M128 17v-9m0 4l-3-3m3 3l3-3"/><path d="M150 17v-9m0 4l-3-3m3 3l3-3"/><path d="M172 17v-9m0 4l-3-3m3 3l3-3"/>
              </g>
            </g>

            <path d="M 0 190 Q 200 185 330 150 T 800 155" fill="none" stroke="#d8d2e7" stroke-width="28" stroke-linecap="round"/>
            <text x="360" y="210" text-anchor="middle" fill="#1e1650" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14">Jalan</text>
            <text x="16" y="232" fill="#64748b" font-family="Nunito, sans-serif" font-size="11.5">Ilustrasi lingkungan sekitar sekolah · tidak berskala</text>
          </svg>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-brand-100 bg-white p-5">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">FOKUS PADA TEMPAT</p>
            <h3 class="mt-1 font-display text-lg font-extrabold text-ink-900">Sekolah &rarr; ruang belajar</h3>
            <p class="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">Siswa belajar dan guru mengajar di sekolah. Sekolah adalah ruang tempat kegiatan belajar berlangsung.</p>
            <p class="mt-3 font-display text-xs font-extrabold text-brand-700">Alasannya: tempat suatu kegiatan.</p>
          </div>

          <div class="rounded-2xl border border-brand-100 bg-white p-5">
            <p class="text-[11px] font-extrabold uppercase tracking-wider text-brand-700">FOKUS PADA CIRI KAWASAN</p>
            <h3 class="mt-1 font-display text-lg font-extrabold text-ink-900">Kumpulan sawah &rarr; wilayah pertanian</h3>
            <p class="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">Sawah-sawah berdekatan memiliki kegiatan serupa: menanam dan memanen padi.</p>
            <p class="mt-3 font-display text-xs font-extrabold text-brand-700">Alasannya: kesamaan kegiatan pertanian.</p>
          </div>
        </div>

        <div class="mt-4 flex items-start gap-3.5 rounded-2xl border border-brand-100 bg-brand-50/90 p-5">
          <span class="mt-0.5 shrink-0 text-brand-700"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg></span>
          <div>
            <h4 class="font-display text-sm font-extrabold text-ink-900">Ciri wilayah, bukan hanya garis batas</h4>
            <p class="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">Kawasan pertanian dapat melintasi batas desa. Satu tempat tetap dapat menjadi ruang kegiatan sekaligus bagian suatu wilayah.</p>
          </div>
        </div>

        <div class="mt-8 flex flex-col items-center justify-between gap-4 border-t border-brand-100 pt-5 sm:flex-row">
          <button type="button" data-action="set-step" data-step="1" class="cursor-pointer font-display text-xs font-extrabold text-brand-700 hover:underline sm:text-sm">
            &larr; Kembali ke Materi
          </button>
          <div class="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <button type="button" data-action="finish-quiz" data-mat="${material.id}"
              class="w-full cursor-pointer rounded-2xl border-2 border-brand-700 bg-white px-5 py-2.5 font-display text-xs font-extrabold text-brand-700 transition hover:bg-brand-50 sm:w-auto sm:text-sm">
              Mulai Kuis (3 ❤️) &rarr;
            </button>
            <button type="button" data-action="finish-next" data-bab="${chapter.id}" data-current="${material.id}" data-next="${nextMaterial.id}"
              class="w-full cursor-pointer rounded-2xl bg-brand-700 px-6 py-3 font-display text-sm font-extrabold text-white shadow-btn transition hover:bg-brand-600 sm:w-auto">
              Lanjut ke ${nextMaterial.title} &rarr;
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
