/**
 * NavbarController — navigasi utama, dropdown profil, menu mobile, dan footer.
 */
import { NavbarView } from '../views/layout/navbar-view.js';
import { delegate } from '../core/dom.js';

const NAV_ROUTES = {
  beranda: '/beranda',
  quest: '/quest',
  kuis: '/kuis',
  'ai-tutor': '/ai-tutor'
};

export class NavbarController {
  constructor(app) {
    this.app = app;
    this.view = new NavbarView(document);
    this.disposers = [];
    this.unsubscribe = null;
  }

  mount() {
    this.subscribe();

    this.disposers.push(delegate(document, 'click', '[data-nav]', (event, target) => {
      event.preventDefault();
      const navKey = target.dataset.nav;
      this.view.closeMobileMenu();
      this.view.closeDropdown();

      if (navKey === 'beranda' && !this.app.store.state.isLoggedIn) {
        this.app.go('/');
        return;
      }

      const route = NAV_ROUTES[navKey];
      if (route) this.app.go(route);
    }));

    this.disposers.push(delegate(document, 'click', '#menu-btn', () => {
      this.view.toggleMobileMenu();
    }));

    this.disposers.push(delegate(document, 'click', '[data-action="toggle-profile"]', () => {
      this.view.toggleDropdown();
    }));

    this.disposers.push(delegate(document, 'click', '[data-profile-action]', (event, target) => {
      this.handleProfileAction(target.dataset.profileAction);
    }));

    this.disposers.push(delegate(document, 'click', '[data-footer-info]', (event, target) => {
      const type = target.dataset.footerInfo;
      if (type === 'terms') {
        this.app.toast.show('Syarat & Ketentuan', 'Dokumen lengkap akan tersedia di portal EduQuest.', '📄');
      } else {
        this.app.toast.show('Kebijakan Privasi', 'Data belajar hanya dipakai untuk pengalaman belajarmu.', '🔒');
      }
    }));

    this.onDocumentClick = (event) => {
      const wrapper = document.getElementById('profile-dropdown-wrapper');
      if (wrapper && !wrapper.contains(event.target)) this.view.closeDropdown();
    };
    document.addEventListener('click', this.onDocumentClick);
  }

  subscribe() {
    this.unsubscribe = this.app.store.subscribe(state => {
      this.view.render(state);
      this.view.setActive(state.route || '/');
    });
    this.view.render(this.app.store.state);
    this.view.setActive(this.app.store.state.route || '/');
  }

  handleProfileAction(action) {
    this.view.closeDropdown();
    this.view.closeMobileMenu();

    if (action === 'keluar') {
      this.app.auth.logout();
      return;
    }
    if (action === 'profil') {
      this.app.go('/profil');
      return;
    }
    if (action === 'achievement' || action === 'jenjang' || action === 'pengaturan') {
      this.app.featureModal.open(action);
    }
  }

  destroy() {
    this.disposers.forEach(dispose => dispose());
    this.disposers = [];
    if (this.unsubscribe) this.unsubscribe();
    document.removeEventListener('click', this.onDocumentClick);
  }
}
