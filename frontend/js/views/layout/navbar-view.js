/**
 * NavbarView — bagian kanan navbar: status login, level/XP, dan menu profil.
 */
import { JENJANG_LABEL, getRankAssetKey } from '../../config/constants.js';
import { getInitials, getShortName, jenjangText, xpPercent } from '../../core/format.js';
import { ASSETS } from '../../assets/mascot-assets.js';

export class NavbarView {
  constructor(root) {
    this.root = root;
  }

  render(state) {
    const container = this.root.querySelector('#nav-auth-container');
    const desktopNav = this.root.querySelector('#nav-desktop');
    const mobileUserCard = this.root.querySelector('#mobile-user-card');
    const mobileMenu = this.root.querySelector('#mobile-menu');
    if (!container) return;

    if (!state.isLoggedIn) {
      if (desktopNav) {
        desktopNav.classList.add('hidden');
        desktopNav.classList.remove('md:flex');
      }
      if (mobileMenu) {
        mobileMenu.querySelectorAll('[data-nav]').forEach(button => button.classList.add('hidden'));
      }
      if (mobileUserCard) {
        mobileUserCard.classList.add('hidden');
        mobileUserCard.innerHTML = '';
      }
      container.innerHTML = `
        <button type="button" data-action="open-auth" data-view="login"
          class="cursor-pointer rounded-xl border-2 border-brand-200 bg-white px-4 py-2 font-display text-sm font-bold text-brand-700 transition hover:bg-brand-50">
          Masuk
        </button>
        <button type="button" data-action="open-auth" data-view="choice" class="btn-primary btn-sm">
          Mulai Quest
        </button>
      `;
      return;
    }

    if (desktopNav) {
      desktopNav.classList.remove('hidden');
      desktopNav.classList.add('md:flex');
    }
    if (mobileMenu) {
      mobileMenu.querySelectorAll('[data-nav]').forEach(button => button.classList.remove('hidden'));
    }

    const user = state.user;
    const initial = getInitials(user.fullName);
    const shortName = getShortName(user.fullName);
    const levelBadgeText = `Level ${user.level} • ${user.rank}`;
    const percent = xpPercent(user);
    const rankAsset = ASSETS[getRankAssetKey(user.rank)] || '';

    container.innerHTML = `
      <div class="flex items-center gap-3 sm:gap-4">
        <div class="hidden min-w-[155px] flex-col items-end lg:flex">
          <div class="flex items-center gap-2 font-display text-[11px] font-extrabold">
            <span class="text-ink-900">${levelBadgeText}</span>
            <span class="text-brand-700">${user.xp}/${user.nextLevelXp} XP &rarr; Lv. ${user.level + 1}</span>
          </div>
          <div class="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
            <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width: ${percent}%"></div>
          </div>
        </div>

        <div class="relative" id="profile-dropdown-wrapper">
          <button type="button" id="profile-menu-btn" data-action="toggle-profile" aria-expanded="false" aria-haspopup="true"
            class="group inline-flex cursor-pointer select-none items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-brand-50/80 focus:outline-none">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-100 font-display text-sm font-extrabold text-brand-700 shadow-xs">
              ${initial}
            </span>
            <span class="font-display text-base font-extrabold tracking-tight text-ink-900">${shortName}</span>
            <svg id="profile-chevron-icon" class="h-4 w-4 text-ink-900 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div id="profile-dropdown-menu" class="absolute right-0 z-50 mt-3 hidden w-72 origin-top-right overflow-hidden rounded-[1.75rem] border border-brand-100 bg-white shadow-[0_18px_40px_-10px_rgba(76,29,149,0.22)]">
            <div class="flex items-start gap-3.5 px-5 pb-4 pt-5">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-100 font-display text-base font-extrabold text-brand-700">
                ${initial}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate font-display text-[17px] font-extrabold leading-snug text-ink-900">${user.fullName}</p>
                <p class="mt-0.5 text-[13px] font-semibold text-slate-600">${jenjangText(user)}</p>
                <span class="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-100/90 px-3 py-0.5 font-display text-xs font-extrabold text-brand-700">
                  ${rankAsset ? `<img src="${rankAsset}" alt="${user.rank}" class="h-4 w-4 object-contain" />` : ''}
                  <span>${levelBadgeText}</span>
                </span>
              </div>
            </div>

            <div class="mx-4 border-t border-brand-100"></div>

            <div class="space-y-0.5 p-2">
              <button type="button" data-profile-action="profil" class="group flex w-full cursor-pointer items-center gap-3.5 rounded-2xl px-4 py-2.5 text-left transition hover:bg-brand-50">
                <svg class="h-5 w-5 shrink-0 text-brand-600 transition group-hover:scale-105" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span class="font-display text-[15px] font-extrabold text-ink-900">Profil Saya</span>
              </button>
              <button type="button" data-profile-action="achievement" class="group flex w-full cursor-pointer items-center gap-3.5 rounded-2xl px-4 py-2.5 text-left transition hover:bg-brand-50">
                <svg class="h-5 w-5 shrink-0 text-brand-600 transition group-hover:scale-105" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 21h8m-4-4v4m-5-9a5 5 0 0010 0V4H7v8zM7 6H4v2a3 3 0 003 3m10-5h3v2a3 3 0 01-3 3" /></svg>
                <span class="font-display text-[15px] font-extrabold text-ink-900">Achievement</span>
              </button>
              <button type="button" data-profile-action="jenjang" class="group flex w-full cursor-pointer items-center gap-3.5 rounded-2xl px-4 py-2.5 text-left transition hover:bg-brand-50">
                <svg class="h-5 w-5 shrink-0 text-brand-600 transition group-hover:scale-105" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                <span class="font-display text-[15px] font-extrabold text-ink-900">Ubah Jenjang &amp; Kelas</span>
              </button>
              <button type="button" data-profile-action="pengaturan" class="group flex w-full cursor-pointer items-center gap-3.5 rounded-2xl px-4 py-2.5 text-left transition hover:bg-brand-50">
                <svg class="h-5 w-5 shrink-0 text-brand-600 transition group-hover:scale-105" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span class="font-display text-[15px] font-extrabold text-ink-900">Pengaturan</span>
              </button>
            </div>

            <div class="mx-4 border-t border-brand-100"></div>

            <div class="p-2">
              <button type="button" data-profile-action="keluar" class="group flex w-full cursor-pointer items-center gap-3.5 rounded-2xl px-4 py-2.5 text-left transition hover:bg-rose-50">
                <svg class="h-5 w-5 shrink-0 text-brand-600 transition group-hover:text-rose-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                <span class="font-display text-[15px] font-extrabold text-ink-900 group-hover:text-rose-700">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (mobileUserCard) {
      mobileUserCard.classList.remove('hidden');
      mobileUserCard.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-white font-display text-sm font-extrabold text-brand-700">
            ${initial}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate font-display text-sm font-extrabold text-ink-900">${user.fullName}</p>
            <p class="text-xs text-slate-500">${jenjangText(user)} • ${levelBadgeText}</p>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2 border-t border-brand-200/60 pt-2.5">
          <button type="button" data-profile-action="profil" class="rounded-xl border border-brand-200 bg-white px-3 py-1.5 text-xs font-extrabold text-brand-700">Profil Saya</button>
          <button type="button" data-profile-action="jenjang" class="rounded-xl border border-brand-200 bg-white px-3 py-1.5 text-xs font-extrabold text-brand-700">Ubah Kelas</button>
          <button type="button" data-profile-action="pengaturan" class="rounded-xl border border-brand-200 bg-white px-3 py-1.5 text-xs font-extrabold text-brand-700">Pengaturan</button>
          <button type="button" data-profile-action="keluar" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-extrabold text-rose-700">Keluar</button>
        </div>
      `;
    }

    this.setActive(state.route);
    this.closeDropdown();
    this.closeMobileMenu();
  }

  /** Menandai tombol navigasi yang sedang aktif. */
  setActive(path = '/') {
    const section = path === '/'
      ? 'beranda'
      : path.startsWith('/ai-tutor')
      ? 'ai-tutor'
      : path.startsWith('/kuis')
      ? 'kuis'
      : path.startsWith('/quest')
      ? 'quest'
      : '';

    this.root.querySelectorAll('button[data-nav]').forEach(button => {
      const isActive = Boolean(section) && button.dataset.nav === section;
      button.classList.toggle('bg-brand-700', isActive);
      button.classList.toggle('text-white', isActive);
      button.classList.toggle('text-ink-800', !isActive);
      button.classList.toggle('hover:bg-brand-50', !isActive);
    });
  }

  toggleDropdown() {
    const menu = this.root.querySelector('#profile-dropdown-menu');
    const chevron = this.root.querySelector('#profile-chevron-icon');
    const button = this.root.querySelector('#profile-menu-btn');
    if (!menu) return;

    const isOpen = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !isOpen);
    menu.classList.toggle('block', isOpen);
    menu.classList.toggle('animate-modalZoom', isOpen);
    if (chevron) chevron.classList.toggle('rotate-180', isOpen);
    if (button) button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  closeDropdown() {
    const menu = this.root.querySelector('#profile-dropdown-menu');
    const chevron = this.root.querySelector('#profile-chevron-icon');
    const button = this.root.querySelector('#profile-menu-btn');
    if (!menu) return;
    menu.classList.add('hidden');
    menu.classList.remove('block', 'animate-modalZoom');
    if (chevron) chevron.classList.remove('rotate-180');
    if (button) button.setAttribute('aria-expanded', 'false');
  }

  toggleMobileMenu() {
    const menu = this.root.querySelector('#mobile-menu');
    if (menu) menu.classList.toggle('hidden');
  }

  closeMobileMenu() {
    const menu = this.root.querySelector('#mobile-menu');
    if (menu) menu.classList.add('hidden');
  }
}
