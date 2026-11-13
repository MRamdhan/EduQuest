/**
 * EduQuestApp — composition root.
 * Membuat store, model, view layout, controller, lalu menjalankan router.
 */
import { Store } from './core/store.js';
import { Router } from './core/router.js';
import { mountTemplate } from './core/template-loader.js';
import { ROUTES } from './config/constants.js';
import { createInitialState } from './models/initial-state.js';
import { ApiClient } from './models/api-client.js';
import { ProgressModel } from './models/progress-model.js';
import { AuthModel } from './models/auth-model.js';
import { QuestModel } from './models/quest-model.js';
import { QuizModel } from './models/quiz-model.js';
import { AiTutorModel } from './models/ai-tutor-model.js';
import { ProfileModel } from './models/profile-model.js';

import { ToastView } from './views/layout/toast-view.js';
import { FooterView } from './views/layout/footer-view.js';

import { AuthController } from './controllers/auth-controller.js';
import { NavbarController } from './controllers/navbar-controller.js';
import { FeatureModalController } from './controllers/feature-modal-controller.js';
import { LandingController } from './controllers/landing-controller.js';
import { DashboardController } from './controllers/dashboard-controller.js';
import { QuestController } from './controllers/quest-controller.js';
import { MaterialController } from './controllers/material-controller.js';
import { QuizController } from './controllers/quiz-controller.js';
import { AiTutorController } from './controllers/ai-tutor-controller.js';
import { ProfileController } from './controllers/profile-controller.js';

export class EduQuestApp {
  constructor() {
    this.store = new Store(createInitialState());
    this.toast = new ToastView(document);
    this.router = null;

    const api = ApiClient;
    this.progress = new ProgressModel({ store: this.store, api });
    const quest = new QuestModel({ store: this.store, api, progress: this.progress });

    this.models = {
      auth: new AuthModel({ store: this.store, api, progress: this.progress }),
      progress: this.progress,
      quest,
      quiz: new QuizModel({
        store: this.store,
        api,
        progress: this.progress,
        quest
      }),
      aiTutor: new AiTutorModel({ store: this.store, api, quest }),
      profile: new ProfileModel({ store: this.store, api })
    };

    this.globalClick = null;
  }

  async init() {
    await this.mountLayout();

    this.footer = new FooterView(document);
    this.footer.render();

    this.auth = new AuthController(this);
    this.auth.mount();

    this.navbar = new NavbarController(this);
    this.navbar.mount();

    this.featureModal = new FeatureModalController(this);
    this.featureModal.mount();

    this.bindGlobalActions();

    this.models.auth.onExpire = () => {
      this.toast.show('Sesi Berakhir', 'Silakan masuk kembali untuk melanjutkan petualangan.', '⏰');
      if (this.router) this.router.navigate('/');
    };

    await this.models.auth.restoreSession();
    this.store.emit();

    this.router = new Router(this.routes(), {
      guard: (route, context) => this.guard(route, context),
      fallback: '/'
    });

    await this.router.start();
  }

  async mountLayout() {
    const layouts = [
      ['layout-toast', 'layout/toast.html'],
      ['layout-auth-modal', 'layout/auth-modal.html'],
      ['layout-feature-modal', 'layout/feature-modal.html'],
      ['layout-navbar', 'layout/navbar.html'],
      ['layout-footer', 'layout/footer.html']
    ];

    await Promise.all(layouts.map(async ([id, template]) => {
      const element = document.getElementById(id);
      if (!element) return;
      await mountTemplate(element, template);
    }));
  }

  routes() {
    return [
      {
        path: '/',
        template: 'pages/landing.html',
        create: () => new LandingController(this)
      },
      {
        path: '/beranda',
        template: () => (this.store.state.isNewUser ? 'pages/dashboard-new.html' : 'pages/dashboard-old.html'),
        create: () => new DashboardController(this)
      },
      {
        path: '/quest',
        template: 'pages/quest.html',
        create: () => new QuestController(this)
      },
      {
        path: '/quest/:babId/:matId',
        template: 'pages/material.html',
        create: (params, query) => new MaterialController(this, params, query)
      },
      {
        path: '/kuis',
        template: 'pages/quiz.html',
        create: () => new QuizController(this)
      },
      {
        path: '/ai-tutor',
        template: 'pages/ai-tutor.html',
        create: () => new AiTutorController(this)
      },
      {
        path: '/profil',
        template: 'pages/profile.html',
        create: () => new ProfileController(this)
      }
    ];
  }

  async guard(route, { path }) {
    const loggedIn = this.store.state.isLoggedIn;

    if (!loggedIn && path !== '/') {
      this.auth.open('login');
      await this.router.navigate('/', { replace: true });
      return false;
    }

    if (loggedIn && path === '/') {
      await this.router.navigate(ROUTES.beranda, { replace: true });
      return false;
    }

    this.store.state.route = path;
    this.navbar.view.render(this.store.state);
    this.navbar.view.setActive(path);
    return true;
  }

  /** Navigasi terpusat; halaman kuis mencatat asal pengguna. */
  go(path, { returnPath } = {}) {
    if (!this.router) return Promise.resolve();
    if (path === ROUTES.quiz && this.router.currentPath !== ROUTES.quiz) {
      const from = returnPath || this.router.currentPath || ROUTES.beranda;
      this.models.quiz.setReturnPath(from);
    }
    return this.router.navigate(path);
  }

  /** Siapkan materi kuis lalu biarkan QuizController memulai sesi. */
  startQuiz(materialId = null, returnPath = null) {
    const quiz = this.models.quiz;
    const target = Number(materialId);
    this.store.state.quiz.materialId = Number.isFinite(target) && target > 0 ? target : null;
    this.store.state.quiz.phase = 'idle';
    this.store.state.quiz.feedback = null;
    this.store.state.quiz.summary = null;
    this.store.state.quiz.selectedOption = null;
    this.store.state.quiz.error = null;
    if (returnPath) quiz.setReturnPath(returnPath);

    return this.go(ROUTES.quiz, {
      returnPath: returnPath || this.router?.currentPath || ROUTES.beranda
    });
  }

  /** Muat ulang rute aktif setelah data profil/jenjang berubah. */
  reloadCurrentRoute() {
    if (!this.router) return Promise.resolve();
    return this.router.resolve();
  }

  /** Sinkronisasi katalog setelah login/registrasi. */
  async afterLogin() {
    const quest = this.models.quest;
    await Promise.allSettled([
      quest.loadLevels().catch(() => []),
      quest.loadCatalog({ force: true }),
      this.models.progress.loadRanks(),
      this.models.progress.refresh()
    ]);
    this.store.touch();
  }

  bindGlobalActions() {
    this.globalClick = (event) => {
      const target = event.target.closest('[data-action]');
      if (!target) return;

      switch (target.dataset.action) {
        case 'go':
          if (target.dataset.route) this.go(target.dataset.route);
          break;

        case 'open-material': {
          const subjectId = target.dataset.subject || target.dataset.bab || 0;
          const materialId = target.dataset.material || target.dataset.mat;
          if (!materialId) break;
          const step = Number(target.dataset.step) >= 2 ? 2 : 1;
          this.go(ROUTES.material(subjectId, materialId, step));
          break;
        }

        case 'start-quiz': {
          const materialId = target.dataset.material || null;
          this.startQuiz(materialId, this.router?.currentPath || null);
          break;
        }

        case 'open-subject':
        case 'select-subject': {
          const rawId = target.dataset.subject;
          const subject = this.models.quest.getSubject(rawId);
          if (!subject) break;
          this.models.quest.setSubject(subject.id);
          this.toast.show(
            `Mata Pelajaran ${subject.name}`,
            `Materi ${subject.name} siap dijelajahi.`,
            subject.icon || '📚'
          );
          if (this.router?.currentPath !== ROUTES.quest) {
            this.go(ROUTES.quest).then(() => {
              setTimeout(() => {
                const el = document.getElementById('quest-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 180);
            });
          } else {
            setTimeout(() => {
              const el = document.getElementById('quest-catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
          break;
        }

        default:
          break;
      }
    };

    document.addEventListener('click', this.globalClick);
  }
}
