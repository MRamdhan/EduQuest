/**
 * AuthModel — sesi pengguna, registrasi, login, logout, dan masa berlaku token.
 */
import { JENJANG_LABEL } from '../config/constants.js';
import { getShortName } from '../core/format.js';
import { createInitialState } from './initial-state.js';

export class AuthModel {
  constructor({ store, api, progress }) {
    this.store = store;
    this.api = api;
    this.progress = progress;
    this.expiryTimer = null;
    this.onExpire = null;
  }

  normalizeJenjangForBackend(jenjang) {
    return jenjang === 'SMA/SMK' ? 'SMA' : jenjang;
  }

  jenjangUiFromBackend(code) {
    if (!code) return '';
    return code === 'SMA' ? 'SMA/SMK' : code;
  }

  /** Ubah payload user backend menjadi format yang dipakai UI. */
  buildUserFromBackend(apiUser, fallback = {}) {
    const displayName = (apiUser?.first_name || fallback.nama || '').trim()
      || apiUser?.username
      || 'Petualang';
    const jenjangCode = apiUser?.education_level?.code
      || this.normalizeJenjangForBackend(fallback.jenjang || '');
    const jenjang = this.jenjangUiFromBackend(jenjangCode) || fallback.jenjang || '';
    const kelasNumber = apiUser?.kelas ?? fallback.kelasNumber;

    return {
      id: apiUser?.id,
      username: apiUser?.username || fallback.username || '',
      fullName: displayName,
      firstName: getShortName(displayName),
      email: apiUser?.email || fallback.email || '',
      jenjang,
      jenjangDisplay: JENJANG_LABEL[jenjang] || jenjang,
      kelas: kelasNumber ? `Kelas ${kelasNumber}` : '-',
      education_level: jenjangCode || this.normalizeJenjangForBackend(jenjang) || 'SMA',
      level: 1,
      rank: 'Bronze',
      totalXp: 0,
      xp: 0,
      nextLevelXp: 100,
      ipsLives: 3,
      ipsLivesMax: 3
    };
  }

  async restoreSession() {
    if (!this.api.isAuthenticated()) return false;

    try {
      const [profile, progress] = await Promise.all([
        this.api.getProfile(),
        this.api.getProgress()
      ]);

      const state = this.store.state;
      state.isLoggedIn = true;
      state.isNewUser = Number(progress?.xp || 0) === 0;
      state.user = this.buildUserFromBackend(profile);
      this.progress.apply(progress);
      this.scheduleExpiry();
      return true;
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        this.api.logoutLocal();
      }
      this.store.state.isLoggedIn = false;
      this.store.touch();
      return false;
    }
  }

  async register(values) {
    const kelasNumber = parseInt(values.kelas.replace(/\D/g, ''), 10);
    const result = await this.api.register({
      username: values.username,
      email: values.email,
      first_name: values.nama,
      education_level: this.normalizeJenjangForBackend(values.jenjang),
      kelas: kelasNumber,
      password: values.pass,
      password_confirm: values.confirm
    });

    const state = this.store.state;
    state.isLoggedIn = true;
    state.isNewUser = true;
    state.user = this.buildUserFromBackend(result.user, {
      nama: values.nama,
      username: values.username,
      email: values.email,
      jenjang: values.jenjang,
      kelasNumber
    });
    this.scheduleExpiry();
    this.store.touch();
    return result;
  }

  async login(username, password) {
    const result = await this.api.login(username, password);

    const state = this.store.state;
    state.isLoggedIn = true;
    state.isNewUser = false;
    state.user = this.buildUserFromBackend(result.user, {
      username,
      email: result.user?.email || ''
    });
    this.scheduleExpiry();
    this.store.touch();

    try {
      const progress = await this.progress.refresh();
      state.isNewUser = Number(progress?.xp || 0) === 0;
      this.store.touch();
    } catch (error) {
      // Login tetap berhasil walau progres gagal dimuat.
      console.warn('Gagal memuat progres setelah login:', error);
    }

    return result;
  }

  async logout() {
    this.clearExpiry();
    await this.api.logout().catch(() => {});
    this.resetSession();
  }

  resetSession() {
    this.clearExpiry();
    this.store.reset(createInitialState());
  }

  expireSession() {
    this.clearExpiry();
    this.api.logoutLocal();
    this.store.reset(createInitialState());
    if (this.onExpire) this.onExpire();
  }

  scheduleExpiry() {
    this.clearExpiry();
    const remaining = this.api.getTokenRemainingMs();
    if (!remaining || remaining <= 0) return;
    this.expiryTimer = setTimeout(() => this.expireSession(), remaining + 100);
  }

  clearExpiry() {
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = null;
    }
  }
}
