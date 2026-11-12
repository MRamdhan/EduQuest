/**
 * AuthController — modal masuk/daftar dan siklus sesi pengguna.
 */
import { AuthModalView } from '../views/layout/auth-modal-view.js';
import { delegate } from '../core/dom.js';

const USERNAME_PATTERN = /^[\w.@+-]+$/;

export class AuthController {
  constructor(app) {
    this.app = app;
    this.view = new AuthModalView(document);
    this.disposers = [];
    this.loading = false;
  }

  mount() {
    this.disposers.push(delegate(document, 'click', '[data-action="open-auth"]', (event, target) => {
      this.open(target.dataset.view || 'choice', target.dataset.jenjang);
    }));

    this.disposers.push(delegate(document, 'click', '[data-action="close-auth"]', () => {
      this.close();
    }));

    this.disposers.push(delegate(document, 'click', '[data-action="auth-view"]', (event, target) => {
      this.show(target.dataset.view || 'choice');
    }));

    this.disposers.push(delegate(document, 'click', '[data-jenjang-choice]', (event, target) => {
      this.view.setRegisterJenjang(target.dataset.jenjangChoice);
    }));

    this.disposers.push(delegate(document, 'input', '#form-register', () => {
      this.view.validateRegisterForm();
    }));

    this.disposers.push(delegate(document, 'submit', '#form-register', (event) => {
      event.preventDefault();
      this.handleRegister();
    }));

    this.disposers.push(delegate(document, 'submit', '#form-login', (event) => {
      event.preventDefault();
      this.handleLogin();
    }));

    this.disposers.push(delegate(document, 'click', '#auth-modal', (event, target) => {
      if (event.target === target) this.close();
    }));

    this.onKeyDown = (event) => {
      if (event.key === 'Escape' && this.view.isOpen()) this.close();
    };
    document.addEventListener('keydown', this.onKeyDown);
  }

  open(view = 'choice', jenjang = null) {
    if (this.app.store.state.isLoggedIn) return;
    this.view.open(view);
    if (jenjang && view === 'register') {
      this.view.setRegisterJenjang(jenjang);
    }
  }

  close() {
    this.view.close();
  }

  show(view) {
    this.view.showView(view);
  }

  async handleRegister() {
    if (this.loading) return;

    const values = this.view.getRegisterValues();
    if (!values.terms) {
      this.view.setRegisterError('Centang Syarat &amp; Ketentuan sebelum mendaftar.');
      return;
    }
    if (values.pass !== values.confirm) {
      this.view.setRegisterError('Konfirmasi kata sandi belum sama dengan kata sandi.');
      return;
    }
    if (!values.nama || !values.username || !values.email || !values.jenjang || !values.kelas) {
      this.view.setRegisterError('Lengkapi nama, nama pengguna, email, jenjang, dan kelas.');
      return;
    }
    if (!USERNAME_PATTERN.test(values.username)) {
      this.view.setRegisterError('Nama pengguna hanya boleh berisi huruf, angka, dan karakter . @ + - _');
      return;
    }
    if (values.pass.length < 8) {
      this.view.setRegisterError('Kata sandi minimal 8 karakter.');
      return;
    }

    this.loading = true;
    this.view.setRegisterLoading(true);

    try {
      await this.app.models.auth.register(values);
      this.view.close();
      this.view.resetRegisterForm();
      this.app.toast.show('Akun Dibuat!', `Selamat datang, ${values.nama}! Petualanganmu dimulai sekarang.`, '🎉');
      this.app.go('/beranda');
    } catch (error) {
      this.view.showRegisterServerErrors(error);
    } finally {
      this.loading = false;
      this.view.setRegisterLoading(false);
    }
  }

  async handleLogin() {
    if (this.loading) return;

    const values = this.view.getLoginValues();
    if (!values.username || !values.password) {
      this.view.setLoginError('Isi nama pengguna dan kata sandi terlebih dahulu.');
      if (!values.username) this.view.markLoginFieldInvalid('username');
      if (!values.password) this.view.markLoginFieldInvalid('password');
      return;
    }

    this.loading = true;
    this.view.setLoginLoading(true);

    try {
      await this.app.models.auth.login(values.username, values.password);
      this.view.close();
      this.view.resetLoginForm();
      this.app.toast.show('Selamat Datang Kembali!', 'Petualanganmu siap dilanjutkan.', '👋');
      this.app.go('/beranda');
    } catch (error) {
      this.view.setLoginError(this.view.loginErrorMessage(error));
      this.view.markLoginFieldInvalid('username');
      this.view.markLoginFieldInvalid('password');
    } finally {
      this.loading = false;
      this.view.setLoginLoading(false);
    }
  }

  async logout() {
    await this.app.models.auth.logout();
    this.app.toast.show('Berhasil Keluar', 'Sampai jumpa kembali di petualangan EduQuest berikutnya!', '👋');
    this.app.go('/');
  }

  destroy() {
    this.disposers.forEach(dispose => dispose());
    this.disposers = [];
    document.removeEventListener('keydown', this.onKeyDown);
  }
}
