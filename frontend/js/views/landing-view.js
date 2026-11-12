/**
 * LandingView — halaman publik sebelum login.
 */
import { LANDING_JENJANG_DATA } from '../config/constants.js';

export class LandingView {
  constructor(root) {
    this.root = root;
  }

  render() {
    const jenjangContainer = this.root.querySelector('#jenjang-list');
    const mapelContainer = this.root.querySelector('#mapel-list');

    if (jenjangContainer) {
      jenjangContainer.innerHTML = LANDING_JENJANG_DATA.map(item => `
        <div class="card flex flex-col justify-between transition hover:border-brand-300">
          <div>
            <div class="flex items-center justify-between">
              <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-2xl">${item.ikon}</span>
              <span class="pill">${item.rentang}</span>
            </div>
            <h3 class="mt-4 font-display text-xl font-extrabold text-ink-900">${item.judul}</h3>
            <p class="mt-2 text-xs leading-relaxed text-slate-500">${item.deskripsi}</p>
          </div>
          <button type="button" data-action="open-auth" data-view="register" data-jenjang="${item.kode}" class="btn-outline mt-6">
            Pilih ${item.judul}
          </button>
        </div>
      `).join('');
    }

    if (mapelContainer) {
      mapelContainer.innerHTML = LANDING_JENJANG_DATA.map(item => `
        <div class="rounded-2xl border border-brand-100 bg-brand-50/40 p-5">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">${item.ikon}</span>
            <h3 class="font-display text-base font-extrabold text-ink-900">${item.judul}</h3>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            ${item.mapel.map(mapel => `<span class="rounded-xl border border-brand-200 bg-white px-3 py-1 text-xs font-bold text-ink-800">${mapel}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }
  }
}
