/**
 * AiTutorController — memilih mapel/materi backend dan mengirim pertanyaan.
 */
import { BaseController } from './base-controller.js';
import { AiTutorView } from '../views/ai-tutor-view.js';

export class AiTutorController extends BaseController {
  mount() {
    this.view = new AiTutorView(this.root);
    this.subscribe();

    this.bind('click', '[data-action="select-ai-subject"]', (event, target) => {
      this.app.models.aiTutor.selectSubject(target.dataset.subject);
    });

    this.bind('change', '[data-field="ai-material"]', (event, target) => {
      this.app.models.aiTutor.selectMaterial(target.value);
    });

    this.bind('click', '[data-action="ask-ai-starter"]', (event, target) => {
      this.app.models.aiTutor.askStarter(Number(target.dataset.index || 0));
    });

    this.bind('click', '[data-action="ask-ai-suggestion"]', (event, target) => {
      const question = target.dataset.question || '';
      if (question) this.app.models.aiTutor.send(question);
    });

    this.bind('click', '[data-action="reset-ai"]', () => {
      this.app.models.aiTutor.reset();
      this.app.toast.show('Percakapan Baru', 'Riwayat percakapan AI Tutor telah direset.', '🦉');
    });

    this.bind('click', '[data-action="ai-retry"]', async () => {
      await this.load({ force: true });
    });

    this.bind('input', '[data-field="ai-draft"]', (event, target) => {
      this.app.models.aiTutor.setDraft(target.value);
      this.view.syncDraftButton(target.value);
    });

    this.onSubmit('[data-form="ai-tutor"]', async () => {
      const state = this.app.store.state;
      const text = state.aiTutor.draft.trim();
      if (!text) {
        this.app.toast.show(
          'Tulis Pertanyaan',
          'Silakan ketik pertanyaanmu terlebih dahulu atau klik salah satu kartu contoh di atas.',
          '✍️'
        );
        return;
      }
      await this.app.models.aiTutor.send(text);
    });

    this.render();
    this.load();
  }

  async load({ force = false } = {}) {
    const quest = this.app.models.quest;
    if (force || !quest.state.loaded || quest.state.loadedLevel !== quest.levelCode()) {
      await quest.loadCatalog({ force });
    }
    this.app.models.aiTutor.ensureSelection();
    this.render();
  }

  render() {
    if (!this.view) return;
    this.view.render(this.app.store.state);
  }
}
