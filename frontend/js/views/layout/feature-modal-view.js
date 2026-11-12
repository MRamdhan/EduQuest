/**
 * FeatureModalView — modal edit profil, ubah jenjang, achievement, pengaturan.
 */
import { KELAS_BY_JENJANG, JENJANG_LABEL, RANK_TIERS, getRankAssetKey } from '../../config/constants.js';
import { getInitials, jenjangText } from '../../core/format.js';
import { ASSETS } from '../../assets/mascot-assets.js';
import { escapeHtml } from '../../core/dom.js';

export class FeatureModalView {
  constructor(root) {
    this.root = root;
    this.type = null;
    this.tempJenjang = '';
  }

  qs(selector) {
    return this.root.querySelector(selector);
  }

  get content() {
    return this.qs('#feature-modal-content');
  }

  open(type, state) {
    if (!this.content) return;
    this.type = type;
    const user = state.user;
    const initial = getInitials(user.fullName);
    const displayJenjang = jenjangText(user);
    const rankAsset = ASSETS[getRankAssetKey(user.rank)] || '';

    if (type === 'profil') {
      this.content.innerHTML = `
        <div class="flex items-center justify-between border-b border-brand-100 pb-4">
          <div>
            <span class="pill">Edit Identitas</span>
            <h3 class="mt-1 font-display text-2xl font-extrabold text-ink-900">Edit Profil</h3>
          </div>
          <button type="button" data-action="close-feature" class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">✕</button>
        </div>
        <div class="mt-5 flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-brand-300 bg-brand-100 font-display text-2xl font-extrabold text-brand-700">
            ${initial}
          </div>
          <div>
            <h4 class="font-display text-xl font-extrabold text-ink-900">${escapeHtml(user.fullName)}</h4>
            <p class="text-xs font-semibold text-slate-600">${escapeHtml(displayJenjang)}</p>
            <span class="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-0.5 font-display text-xs font-extrabold text-brand-700">
              ${rankAsset ? `<img src="${rankAsset}" alt="${escapeHtml(user.rank)}" class="h-4 w-4 object-contain" />` : ''}
              <span>Level ${user.level} • ${escapeHtml(user.rank)} (${user.xp} / ${user.nextLevelXp} XP)</span>
            </span>
          </div>
        </div>
        <form id="form-edit-profil" class="mt-5 space-y-4">
          <div>
            <label class="block text-xs font-extrabold text-ink-900">Nama Lengkap</label>
            <input id="edit-profil-nama" type="text" value="${escapeHtml(user.fullName)}" class="mt-1.5 w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-600" required />
          </div>
          <div>
            <label class="block text-xs font-extrabold text-ink-900">Email</label>
            <input id="edit-profil-email" type="email" value="${escapeHtml(user.email)}" class="mt-1.5 w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-600" required />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" data-action="close-feature" class="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 font-display text-sm font-bold text-slate-600 hover:bg-slate-50">Batal</button>
            <button type="submit" class="btn-primary btn-sm">Simpan Profil</button>
          </div>
        </form>
      `;
    } else if (type === 'jenjang') {
      const normalizedJenjang = (user.jenjang === 'SMA' ? 'SMA/SMK' : user.jenjang) || 'SMP';
      this.tempJenjang = normalizedJenjang;
      const kelasOptions = (KELAS_BY_JENJANG[user.jenjang] || KELAS_BY_JENJANG[normalizedJenjang] || KELAS_BY_JENJANG['SMP'])
        .map(kelas => `<option value="${kelas}" ${kelas === user.kelas ? 'selected' : ''}>${kelas}</option>`)
        .join('');

      this.content.innerHTML = `
        <div class="flex items-center justify-between border-b border-brand-100 pb-4">
          <div>
            <span class="pill">Kurikulum &amp; Tingkatan</span>
            <h3 class="mt-1 font-display text-2xl font-extrabold text-ink-900">Ubah Jenjang &amp; Kelas</h3>
          </div>
          <button type="button" data-action="close-feature" class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">✕</button>
        </div>
        <form id="form-edit-jenjang" class="mt-5 space-y-4">
          <div>
            <label class="mb-2 block text-xs font-extrabold text-ink-900">Pilih Jenjang Pendidikan</label>
            <div class="grid grid-cols-3 gap-2.5">
              ${['SD', 'SMP', 'SMA/SMK'].map(jenjang => {
                const isSelected = normalizedJenjang === jenjang;
                return `
                <button type="button" data-modal-jenjang="${jenjang}"
                  class="modal-jenjang-btn cursor-pointer rounded-xl border px-2 py-2.5 font-display text-xs font-bold transition sm:text-sm ${
                    isSelected
                      ? 'border-brand-700 bg-brand-700 text-white shadow-xs'
                      : 'border-brand-200 bg-white text-ink-900 hover:bg-brand-50'
                  }">
                  ${JENJANG_LABEL[jenjang]}
                </button>
              `;
              }).join('')}
            </div>
          </div>
          <div>
            <label for="modal-select-kelas" class="block text-xs font-extrabold text-ink-900">Pilih Kelas</label>
            <select id="modal-select-kelas" class="mt-1.5 w-full rounded-xl border border-brand-200 px-4 py-2.5 text-sm outline-none focus:border-brand-600">
              ${kelasOptions}
            </select>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" data-action="close-feature" class="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 font-display text-sm font-bold text-slate-600 hover:bg-slate-50">Batal</button>
            <button type="submit" class="btn-primary btn-sm">Terapkan Perubahan</button>
          </div>
        </form>
      `;
    } else if (type === 'achievement') {
      const activeTierKey = getRankAssetKey(user.rank);
      const tiersHtml = RANK_TIERS.map(tier => {
        const source = ASSETS[tier.key] || '';
        const active = tier.key === activeTierKey;
        return `
          <div class="rounded-2xl border p-2.5 text-center ${active ? 'border-brand-700 bg-brand-50' : 'border-brand-100 bg-white'}">
            <img src="${source}" alt="${tier.title}" class="mx-auto h-10 w-10 object-contain" />
            <p class="mt-1 font-display text-xs font-extrabold text-ink-900">${tier.title}</p>
            <p class="text-[10px] font-bold text-brand-700">${tier.rank}</p>
          </div>
        `;
      }).join('');

      this.content.innerHTML = `
        <div class="flex items-center justify-between border-b border-brand-100 pb-4">
          <div>
            <span class="pill">Koleksi Lencana &amp; Pangkat</span>
            <h3 class="mt-1 font-display text-2xl font-extrabold text-ink-900">Achievement Saya</h3>
          </div>
          <button type="button" data-action="close-feature" class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">✕</button>
        </div>
        <div class="mt-4">
          <p class="mb-2 text-xs font-extrabold text-ink-900">Tingkat Pangkat Petualang</p>
          <div class="grid grid-cols-5 gap-2">${tiersHtml}</div>
        </div>
        <div class="mt-5 flex justify-end">
          <button type="button" data-action="close-feature" class="btn-primary btn-sm">Tutup</button>
        </div>
      `;
    } else if (type === 'pengaturan') {
      this.content.innerHTML = `
        <div class="flex items-center justify-between border-b border-brand-100 pb-4">
          <div>
            <span class="pill">Preferensi Akun</span>
            <h3 class="mt-1 font-display text-2xl font-extrabold text-ink-900">Pengaturan</h3>
          </div>
          <button type="button" data-action="close-feature" class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">✕</button>
        </div>
        <div class="mt-5 space-y-4">
          <label class="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div>
              <p class="font-display text-sm font-extrabold text-ink-900">Pengingat Belajar Harian</p>
              <p class="text-xs text-slate-500">Kirim notifikasi semangat belajar setiap sore</p>
            </div>
            <input type="checkbox" checked class="h-5 w-5 cursor-pointer rounded accent-brand-700" />
          </label>
        </div>
        <div class="mt-5 flex justify-end">
          <button type="button" data-action="close-feature" class="btn-primary btn-sm">Selesai</button>
        </div>
      `;
    }

    const modal = this.qs('#feature-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  close() {
    const modal = this.qs('#feature-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    this.type = null;
  }

  isOpen() {
    const modal = this.qs('#feature-modal');
    return Boolean(modal && !modal.classList.contains('hidden'));
  }

  selectJenjang(jenjang) {
    this.tempJenjang = jenjang;
    this.root.querySelectorAll('.modal-jenjang-btn').forEach(button => {
      const selected = button.getAttribute('data-modal-jenjang') === jenjang;
      button.className = `modal-jenjang-btn cursor-pointer rounded-xl border px-2 py-2.5 font-display text-xs font-bold transition sm:text-sm ${
        selected
          ? 'border-brand-700 bg-brand-700 text-white shadow-xs'
          : 'border-brand-200 bg-white text-ink-900 hover:bg-brand-50'
      }`;
    });

    const select = this.qs('#modal-select-kelas');
    if (select) {
      const options = KELAS_BY_JENJANG[jenjang] || [];
      select.innerHTML = options.map(kelas => `<option value="${kelas}">${kelas}</option>`).join('');
    }
  }

  getEditProfileValues() {
    return {
      fullName: (this.qs('#edit-profil-nama')?.value || '').trim(),
      email: (this.qs('#edit-profil-email')?.value || '').trim()
    };
  }

  getJenjangValues() {
    return {
      jenjang: this.tempJenjang,
      kelas: this.qs('#modal-select-kelas')?.value || ''
    };
  }
}
