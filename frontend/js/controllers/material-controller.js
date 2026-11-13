/**
 * MaterialController — membaca materi backend, menandai selesai, dan memulai kuis.
 */
import { BaseController } from './base-controller.js';
import { MaterialView } from '../views/material-view.js';
import { ApiClient } from '../models/api-client.js';
import { ROUTES } from '../config/constants.js';

export class MaterialController extends BaseController {
  constructor(app, params = {}, query = {}) {
    super(app, params, query);
    this.subjectId = params.babId || params.subjectId || 0;
    this.materialId = params.matId || params.materialId || 0;
    this.step = Number(query.step) >= 2 ? 2 : 1;
    this.detail = null;
    this.loading = true;
    this.error = null;
  }

  mount() {
    this.app.store.state.material = {
      subjectId: Number(this.subjectId) || null,
      materialId: Number(this.materialId) || null,
      step: this.step
    };

    this.view = new MaterialView(this.root);
    this.subscribe();

    this.bind('click', '[data-action="close-material"]', () => {
      this.app.go(ROUTES.quest);
    });

    this.bind('click', '[data-action="set-step"]', (event, target) => {
      const nextStep = Number(target.dataset.step) >= 2 ? 2 : 1;
      this.app.go(ROUTES.material(this.subjectId, this.materialId, nextStep));
    });

    this.bind('click', '[data-action="material-retry"]', () => {
      this.load();
    });

    this.bind('click', '[data-action="finish-next"]', async (event, target) => {
      const currentId = Number(target.dataset.current || this.materialId);
      const nextId = Number(target.dataset.next || 0);
      const result = await this.app.models.quest.markMaterialDone(currentId);

      if (result.ok && !result.already) {
        this.app.toast.show('Materi Selesai!', 'Progres materi tersimpan di akunmu.', '🎉');
      } else if (!result.ok) {
        this.app.toast.show('Gagal Menyimpan', result.error?.message || 'Coba lagi sebentar.', '⚠️');
        return;
      }

      if (this.detail) this.detail.is_completed = true;
      this.render();

      if (nextId) {
        this.app.go(ROUTES.material(this.subjectId, nextId, 1));
      } else {
        this.app.go(ROUTES.quest);
      }
    });

    this.bind('click', '[data-action="finish-quiz"]', async (event, target) => {
      const materialId = Number(target.dataset.material || this.materialId);
      const result = await this.app.models.quest.markMaterialDone(materialId);

      if (result.ok && !result.already) {
        this.app.toast.show('Materi Selesai!', 'Siap mengerjakan kuis dari bank soal backend.', '🎉');
      } else if (!result.ok) {
        this.app.toast.show('Gagal Menyimpan', result.error?.message || 'Coba lagi sebentar.', '⚠️');
        return;
      }

      if (this.detail) this.detail.is_completed = true;
      this.render();
      const returnPath = ROUTES.material(this.subjectId, materialId, 2);
      this.app.startQuiz(materialId, returnPath);
    });

    this.bind('click', '[data-action="material-ask-ai"]', (event, target) => {
      const materialId = Number(target.dataset.material || this.materialId);
      const aiTutor = this.app.store.state.aiTutor;
      aiTutor.materialId = materialId;
      aiTutor.subjectId = this.detail?.subject_id || null;
      aiTutor.messages = [];
      aiTutor.error = null;
      this.app.go(ROUTES.aiTutor);
    });

    this.render();
    this.load();
  }

  async load() {
    const materialId = Number(this.materialId);
    if (!Number.isFinite(materialId) || materialId <= 0) {
      this.loading = false;
      this.error = new Error('ID materi tidak valid.');
      this.render();
      return;
    }

    this.loading = true;
    this.error = null;
    this.render();

    const quest = this.app.models.quest;
    try {
      const catalogPromise = quest.state.loaded
        ? Promise.resolve(true)
        : quest.loadCatalog().catch(() => false);
      const [detail] = await Promise.all([
        ApiClient.getMaterialDetail(materialId),
        catalogPromise
      ]);

      if (!detail) throw new Error('Materi tidak ditemukan.');
      this.detail = detail;
      this.subjectId = Number(detail.subject_id) || this.subjectId;
      this.app.store.state.material = {
        subjectId: this.subjectId,
        materialId,
        step: this.step
      };
      this.loading = false;
      this.error = null;
      this.render();
    } catch (error) {
      this.loading = false;
      this.error = error;
      this.render();
    }
  }

  viewData() {
    const quest = this.app.models.quest;
    const detail = this.detail;

    if (!detail) {
      return {
        loading: this.loading,
        error: this.error,
        step: this.step,
        material: null,
        subject: null,
        siblings: [],
        nextMaterial: null,
        completedCount: 0,
        totalMaterials: 0,
        percent: 0
      };
    }

    const subject = quest.getSubject(detail.subject_id) || {
      id: detail.subject_id,
      name: detail.subject || 'Materi',
      level: detail.level,
      level_name: detail.level,
      icon: '📚',
      lives: detail.subject_lives?.lives,
      max_lives: detail.subject_lives?.max_lives
    };

    const subjectSiblings = quest.materialsForSubject(detail.subject_id);
    const siblingSource = subjectSiblings.length ? subjectSiblings : [detail];
    let siblings = siblingSource.map(item => ({
      ...item,
      is_completed: Boolean(item.is_completed || quest.isCompleted(item.id))
    }));

    if (!siblings.some(item => Number(item.id) === Number(detail.id))) {
      siblings = [{
        ...detail,
        is_completed: Boolean(detail.is_completed || quest.isCompleted(detail.id))
      }, ...siblings];
    }

    const currentIndex = siblings.findIndex(item => Number(item.id) === Number(detail.id));
    const nextMaterial = currentIndex >= 0 ? (siblings[currentIndex + 1] || null) : (siblings[0] || null);
    const totalMaterials = siblings.length || 1;
    const completedCount = siblings.filter(item => item.is_completed).length;
    const percent = Math.min(100, Math.round((completedCount / totalMaterials) * 100));

    const material = {
      ...detail,
      is_completed: Boolean(detail.is_completed || quest.isCompleted(detail.id)),
      durationLabel: detail.estimated_minutes
        ? `± ${detail.estimated_minutes} menit`
        : 'Materi singkat',
      lives: detail.subject_lives?.lives,
      maxLives: detail.subject_lives?.max_lives
    };

    return {
      loading: this.loading,
      error: this.error,
      step: this.step,
      material,
      subject,
      siblings,
      nextMaterial,
      completedCount,
      totalMaterials,
      percent
    };
  }

  render() {
    if (!this.view) return;
    this.view.render(this.viewData());
  }
}
