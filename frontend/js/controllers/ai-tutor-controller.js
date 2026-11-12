/**
 * AiTutorController — memilih mapel, mengirim pertanyaan, dan mereset percakapan.
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

    this.bind('click', '[data-action="ask-ai-starter"]', (event, target) => {
      this.app.models.aiTutor.askStarter(Number(target.dataset.index || 0));
    });

    this.bind('click', '[data-action="reset-ai"]', () => {
      this.app.models.aiTutor.reset();
      this.app.toast.show('Percakapan Baru', 'Riwayat percakapan AI Tutor telah direset.', '🦉');
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
  }

  render() {
    this.view.render(this.app.store.state);
  }
}
