/**
 * AuthModalView — modal masuk/daftar.
 * Semua akses DOM form ada di sini; controller hanya mengatur alur.
 */
import { KELAS_BY_JENJANG } from '../../config/constants.js';
import { escapeHtml } from '../../core/dom.js';
import { ASSETS } from '../../assets/mascot-assets.js';

const REG_USERNAME_PATTERN = /^[\w.@+-]+$/;

const REG_FIELD_INPUTS = {
  username: 'reg-username',
  email: 'reg-email',
  first_name: 'reg-nama',
  kelas: 'reg-kelas',
  password: 'reg-pass',
  password_confirm: 'reg-pass-confirm'
};

const REG_FIELD_LABELS = {
  username: 'Nama pengguna',
  email: 'Email',
  first_name: 'Nama lengkap',
  education_level: 'Jenjang',
  kelas: 'Kelas',
  password: 'Kata sandi',
  password_confirm: 'Konfirmasi kata sandi',
  non_field_errors: 'Pendaftaran'
};

export class AuthModalView {
  constructor(root) {
    this.root = root;
    this.mascotBindingDone = false;
  }

  qs(selector) {
    return this.root.querySelector(selector);
  }

  open(view = 'choice') {
    const modal = this.qs('#auth-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    this.bindMascot();
    this.showView(view);
    if (view === 'register') this.resetRegisterForm();
    if (view === 'login') this.setLoginError('');
  }

  close() {
    const modal = this.qs('#auth-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  isOpen() {
    const modal = this.qs('#auth-modal');
    return Boolean(modal && !modal.classList.contains('hidden'));
  }

  showView(view) {
    ['choice', 'register', 'login'].forEach(name => {
      const panel = this.qs(`#view-${name}`);
      if (!panel) return;
      panel.classList.toggle('hidden', name !== view);
    });
  }

  bindMascot() {
    if (this.mascotBindingDone) return;
    const mascot = this.qs('#mascot-img-choice');
    if (mascot) mascot.src = ASSETS.mascot;
    this.mascotBindingDone = true;
  }

  getRegisterValues() {
    return {
      nama: (this.qs('#reg-nama')?.value || '').trim(),
      username: (this.qs('#reg-username')?.value || '').trim(),
      email: (this.qs('#reg-email')?.value || '').trim(),
      jenjang: this.qs('#view-register')?.dataset.selectedJenjang || '',
      kelas: this.qs('#reg-kelas')?.value || '',
      pass: this.qs('#reg-pass')?.value || '',
      confirm: this.qs('#reg-pass-confirm')?.value || '',
      terms: this.qs('#reg-terms')?.checked || false
    };
  }

  isRegisterFormValid() {
    const v = this.getRegisterValues();
    return (
      v.nama.length >= 2 &&
      v.username.length >= 3 &&
      REG_USERNAME_PATTERN.test(v.username) &&
      v.email.includes('@') &&
      Boolean(v.jenjang) &&
      Boolean(v.kelas) &&
      v.pass.length >= 8 &&
      v.pass === v.confirm &&
      v.terms
    );
  }

  setRegisterJenjang(jenjang) {
    const registerPanel = this.qs('#view-register');
    if (registerPanel) registerPanel.dataset.selectedJenjang = jenjang;

    this.root.querySelectorAll('.jenjang-choice-btn').forEach(button => {
      const active = button.getAttribute('data-jenjang-choice') === jenjang;
      button.className = `jenjang-choice-btn flex cursor-pointer items-center justify-center rounded-xl border py-2.5 font-display text-xs font-bold transition sm:text-sm ${
        active
          ? 'border-brand-700 bg-brand-700 text-white'
          : 'border-brand-200 bg-white text-ink-900 hover:bg-brand-50'
      }`;
    });

    const kelasSelect = this.qs('#reg-kelas');
    if (kelasSelect) {
      kelasSelect.disabled = false;
      const options = KELAS_BY_JENJANG[jenjang] || [];
      kelasSelect.innerHTML = options.map(kelas => `<option value="${kelas}">${kelas}</option>`).join('');
    }

    this.setRegisterError('');
    this.clearRegisterFieldErrors();
    this.validateRegisterForm();
  }

  setRegisterError(message) {
    const box = this.qs('#reg-form-error');
    if (!box) return;
    box.innerHTML = message || '';
    box.classList.toggle('hidden', !message);
  }

  clearRegisterFieldErrors() {
    Object.values(REG_FIELD_INPUTS).forEach(id => {
      this.qs(`#${id}`)?.classList.remove('border-rose-400');
    });
  }

  validateRegisterForm() {
    const values = this.getRegisterValues();
    const valid = this.isRegisterFormValid();
    const mismatchHint = this.qs('#reg-pass-mismatch-hint');
    const confirmInput = this.qs('#reg-pass-confirm');

    if (mismatchHint) {
      const showMismatch = values.confirm.length > 0 && values.pass !== values.confirm;
      mismatchHint.classList.toggle('hidden', !showMismatch);
      confirmInput?.classList.toggle('border-rose-400', showMismatch);
    }

    const submitButton = this.qs('#btn-submit-register');
    if (submitButton && !submitButton.disabled) {
      submitButton.className = valid
        ? 'w-full cursor-pointer rounded-xl bg-brand-700 py-3.5 font-display text-sm font-extrabold text-white shadow-btn transition hover:bg-brand-600'
        : 'w-full cursor-pointer rounded-xl bg-brand-600/80 py-3.5 font-display text-sm font-extrabold text-white transition hover:bg-brand-600';
    }
  }

  showRegisterServerErrors(error) {
    const data = error?.data;
    this.clearRegisterFieldErrors();

    if (!data || typeof data !== 'object') {
      this.setRegisterError(escapeHtml(error?.message || 'Pendaftaran gagal. Silakan coba lagi.'));
      return;
    }

    const messages = [];
    Object.keys(data).forEach(field => {
      if (field === 'code') return;
      const raw = data[field];
      if (field === 'detail') {
        messages.push(escapeHtml(String(raw)));
        return;
      }
      const list = Array.isArray(raw) ? raw : [raw];
      const label = REG_FIELD_LABELS[field] || field;
      list.forEach(message => {
        const text = typeof message === 'string' ? message : JSON.stringify(message);
        messages.push(`<span class="font-extrabold">${escapeHtml(label)}:</span> ${escapeHtml(text)}`);
      });
      const inputId = REG_FIELD_INPUTS[field];
      if (inputId) this.qs(`#${inputId}`)?.classList.add('border-rose-400');
    });

    this.setRegisterError(messages.join('<br>') || 'Pendaftaran gagal. Periksa kembali data yang diisi.');
  }

  setRegisterLoading(loading) {
    const button = this.qs('#btn-submit-register');
    if (!button) return;
    button.disabled = loading;
    button.textContent = loading ? 'Mendaftarkan...' : 'Buat Akun Baru';
    if (loading) {
      button.className = 'w-full cursor-wait rounded-xl bg-brand-400 py-3.5 font-display text-sm font-extrabold text-white opacity-80';
    } else {
      this.validateRegisterForm();
    }
  }

  resetRegisterForm() {
    const form = this.qs('#form-register');
    if (form) form.reset();

    const registerPanel = this.qs('#view-register');
    if (registerPanel) registerPanel.dataset.selectedJenjang = '';

    this.root.querySelectorAll('.jenjang-choice-btn').forEach(button => {
      button.className = 'jenjang-choice-btn flex cursor-pointer items-center justify-center rounded-xl border border-brand-200 bg-white py-2.5 font-display text-xs font-bold text-ink-900 transition hover:bg-brand-50 sm:text-sm';
    });

    const kelasSelect = this.qs('#reg-kelas');
    if (kelasSelect) {
      kelasSelect.disabled = true;
      kelasSelect.innerHTML = '<option value="">Pilih jenjang terlebih dahulu</option>';
    }

    this.setRegisterError('');
    this.clearRegisterFieldErrors();
    this.validateRegisterForm();
  }

  getLoginValues() {
    return {
      username: (this.qs('#login-username')?.value || '').trim(),
      password: this.qs('#login-password')?.value || ''
    };
  }

  setLoginError(message) {
    const box = this.qs('#login-form-error');
    if (!box) return;
    box.innerHTML = message ? escapeHtml(message) : '';
    box.classList.toggle('hidden', !message);
    this.qs('#login-username')?.classList.remove('border-rose-400');
    this.qs('#login-password')?.classList.remove('border-rose-400');
  }

  markLoginFieldInvalid(field) {
    this.qs(`#login-${field}`)?.classList.add('border-rose-400');
  }

  setLoginLoading(loading) {
    const button = this.qs('#btn-submit-login');
    if (!button) return;
    button.disabled = loading;
    button.textContent = loading ? 'Memeriksa akun...' : 'Masuk ke Akun';
    button.className = loading
      ? 'w-full cursor-wait rounded-xl bg-brand-400 py-3.5 font-display text-sm font-extrabold text-white opacity-80'
      : 'w-full cursor-pointer rounded-xl bg-brand-700 py-3.5 font-display text-sm font-extrabold text-white shadow-btn hover:bg-brand-600';
  }

  resetLoginForm() {
    this.qs('#form-login')?.reset();
    this.setLoginError('');
  }

  loginErrorMessage(error) {
    const data = error?.data;
    if (data && typeof data === 'object') {
      const parts = [];
      ['non_field_errors', 'detail', 'username', 'password'].forEach(field => {
        if (data[field]) {
          const list = Array.isArray(data[field]) ? data[field] : [data[field]];
          list.forEach(item => parts.push(typeof item === 'string' ? item : JSON.stringify(item)));
        }
      });
      if (parts.length) return parts.join(' ');
    }
    return error?.message || 'Gagal masuk. Silakan coba lagi.';
  }
}
