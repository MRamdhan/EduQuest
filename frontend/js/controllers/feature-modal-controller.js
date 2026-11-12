/**
 * FeatureModalController — modal edit profil, ubah jenjang, achievement,
 * dan pengaturan.
 */
import { FeatureModalView } from '../views/layout/feature-modal-view.js';
import { JENJANG_LABEL } from '../config/constants.js';
import { ApiClient } from '../models/api-client.js';
import { delegate } from '../core/dom.js';

export class FeatureModalController {
  constructor(app) {
    this.app = app;
    this.view = new FeatureModalView(document);
    this.disposers = [];
    this.onKeyDown = null;
  }

  mount() {
    this.disposers.push(delegate(document, 'click', '[data-action="open-feature"]', (event, target) => {
      this.open(target.dataset.modal || 'profil');
    }));

    this.disposers.push(delegate(document, 'click', '[data-action="close-feature"]', () => {
      this.view.close();
    }));

    this.disposers.push(delegate(document, 'click', '[data-modal-jenjang]', (event, target) => {
      this.view.selectJenjang(target.dataset.modalJenjang);
    }));

    this.disposers.push(delegate(document, 'click', '#feature-modal', (event, target) => {
      if (event.target === target) this.view.close();
    }));

    this.disposers.push(delegate(document, 'submit', '#form-edit-profil', (event) => {
      event.preventDefault();
      this.saveProfile();
    }));

    this.disposers.push(delegate(document, 'submit', '#form-edit-jenjang', (event) => {
      event.preventDefault();
      this.saveJenjang();
    }));

    this.onKeyDown = (event) => {
      if (event.key === 'Escape' && this.view.isOpen()) this.view.close();
    };
    document.addEventListener('keydown', this.onKeyDown);
  }

  open(type) {
    this.view.open(type, this.app.store.state);
  }

  saveProfile() {
    const values = this.view.getEditProfileValues();
    if (!values.fullName || !values.email) return;

    const state = this.app.store.state;
    state.user.fullName = values.fullName;
    state.user.firstName = values.fullName.split(/\s+/)[0] || values.fullName;
    state.user.email = values.email;
    ApiClient.setUser(state.user);
    this.app.store.touch();

    this.view.close();
    this.app.toast.show('Profil Diperbarui', 'Perubahan identitasmu sudah disimpan.', '✅');
  }

  saveJenjang() {
    const values = this.view.getJenjangValues();
    if (!values.jenjang || !values.kelas) return;

    const state = this.app.store.state;
    const kelasNumber = values.kelas.replace(/\D/g, '');
    state.user.jenjang = values.jenjang;
    state.user.jenjangDisplay = JENJANG_LABEL[values.jenjang] || values.jenjang;
    state.user.education_level = values.jenjang === 'SMA/SMK' ? 'SMA' : values.jenjang;
    state.user.kelas = `Kelas ${kelasNumber}`;
    ApiClient.setUser(state.user);
    this.app.store.touch();

    this.view.close();
    this.app.toast.show(
      'Jenjang Diperbarui',
      `Kamu sekarang belajar di ${state.user.jenjangDisplay} • ${state.user.kelas}.`,
      '🎓'
    );
  }

  destroy() {
    this.disposers.forEach(dispose => dispose());
    this.disposers = [];
    document.removeEventListener('keydown', this.onKeyDown);
  }
}
