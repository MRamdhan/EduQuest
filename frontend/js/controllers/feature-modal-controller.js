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
    this.saving = false;
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

  async open(type) {
    const state = this.app.store.state;
    if (type === 'jenjang' && (!Array.isArray(state.levels) || !state.levels.length)) {
      try {
        await this.app.models.quest.loadLevels();
      } catch (error) {
        // Modal memakai fallback statis bila endpoint gagal.
      }
    }
    if (type === 'achievement' && (!Array.isArray(state.ranks) || !state.ranks.length)) {
      await this.app.models.progress.loadRanks();
    }
    this.view.open(type, this.app.store.state);
  }

  async saveProfile() {
    if (this.saving) return;
    const values = this.view.getEditProfileValues();
    if (!values.fullName || !values.email) {
      this.app.toast.show('Data Belum Lengkap', 'Isi nama lengkap dan email terlebih dahulu.', '✍️');
      return;
    }

    this.saving = true;
    try {
      const updated = await ApiClient.updateProfile({
        first_name: values.fullName,
        email: values.email
      });

      const state = this.app.store.state;
      state.user.fullName = updated.first_name || values.fullName;
      state.user.firstName = state.user.fullName.split(/\s+/)[0] || state.user.fullName;
      state.user.email = updated.email || values.email;
      ApiClient.setUser(state.user);
      this.app.store.touch();

      this.view.close();
      this.app.toast.show('Profil Diperbarui', 'Perubahan identitasmu sudah disimpan ke akun.', '✅');
    } catch (error) {
      this.app.toast.show('Gagal Menyimpan Profil', error?.message || 'Coba lagi sebentar.', '⚠️');
    } finally {
      this.saving = false;
    }
  }

  async saveJenjang() {
    if (this.saving) return;
    const values = this.view.getJenjangValues();
    const kelasNumber = parseInt(String(values.kelas || '').replace(/\D/g, ''), 10);
    if (!values.jenjang || !kelasNumber) {
      this.app.toast.show('Data Belum Lengkap', 'Pilih jenjang dan kelas terlebih dahulu.', '✍️');
      return;
    }

    const backendLevel = values.jenjang === 'SMA/SMK' ? 'SMA' : values.jenjang;
    this.saving = true;
    try {
      const updated = await ApiClient.updateProfile({
        education_level: backendLevel,
        kelas: kelasNumber
      });

      const state = this.app.store.state;
      const savedLevel = updated.education_level?.code || backendLevel;
      const displayLevel = savedLevel === 'SMA' ? 'SMA/SMK' : savedLevel;
      const savedKelas = Number(updated.kelas || kelasNumber);

      state.user.jenjang = displayLevel;
      state.user.jenjangDisplay = JENJANG_LABEL[displayLevel] || displayLevel;
      state.user.education_level = savedLevel;
      state.user.kelas = `Kelas ${savedKelas}`;
      state.user.kelasNumber = savedKelas;
      ApiClient.setUser(state.user);
      this.app.store.touch();

      this.app.models.quest.invalidate();
      await Promise.allSettled([
        this.app.models.quest.loadCatalog({ force: true }),
        this.app.models.progress.refresh()
      ]);

      this.view.close();
      this.app.toast.show(
        'Jenjang Diperbarui',
        `Kamu sekarang belajar di ${state.user.jenjangDisplay} • ${state.user.kelas}.`,
        '🎓'
      );
      this.app.go('/beranda');
    } catch (error) {
      this.app.toast.show('Gagal Menyimpan Jenjang', error?.message || 'Coba lagi sebentar.', '⚠️');
    } finally {
      this.saving = false;
    }
  }

  destroy() {
    this.disposers.forEach(dispose => dispose());
    this.disposers = [];
    document.removeEventListener('keydown', this.onKeyDown);
  }
}
