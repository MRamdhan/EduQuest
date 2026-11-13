/**
 * QuizController — memulai kuis dari materi aktif dan meneruskan aksi ke model.
 */
import { BaseController } from './base-controller.js';
import { QuizView } from '../views/quiz-view.js';
import { ROUTES } from '../config/constants.js';

export class QuizController extends BaseController {
  mount() {
    this.view = new QuizView(this.root);
    this.subscribe();
    this.render();

    this.bind('click', '[data-action="select-option"]', (event, target) => {
      this.app.models.quiz.selectOption(target.dataset.option);
    });

    this.bind('click', '[data-action="submit-answer"]', async () => {
      const result = await this.app.models.quiz.submitAnswer();
      this.showAnswerToast(result);
    });

    this.bind('click', '[data-action="quiz-retry"]', async () => {
      const result = await this.app.models.quiz.restart();
      if (result?.ok === false && result.error) {
        this.app.toast.show('Kuis Gagal Dimulai', result.error.message, '⚠️');
      }
    });

    this.bind('click', '[data-action="quiz-exit"]', () => {
      const returnPath = this.app.store.state.quiz.returnPath || ROUTES.beranda;
      this.app.go(returnPath);
    });

    this.bootstrap();
  }

  async bootstrap() {
    const state = this.app.store.state;
    const quiz = this.app.models.quiz;
    const quest = this.app.models.quest;

    // Ambil katalog bila belum ada (mis. pengguna membuka /kuis langsung).
    if (!quest.state.loaded || quest.state.loadedLevel !== quest.levelCode()) {
      const loaded = await quest.loadCatalog();
      if (!loaded) {
        const error = quest.state.error || new Error('Katalog materi belum bisa dimuat.');
        quiz.state.phase = 'error';
        quiz.state.error = error;
        this.app.store.touch();
        return;
      }
    }

    if (quiz.state.loading) return;

    // Materi dipilih dari state (tombol kuis) atau materi pertama yang belum selesai.
    const activeSubject = quest.activeSubject();
    const candidates = activeSubject
      ? quest.materialsForSubject(activeSubject.id)
      : quest.materials();
    const fallbackMaterial = candidates.find(material => !material.is_completed)
      || candidates[0]
      || quest.firstIncompleteMaterial();

    const requestedId = Number(state.quiz.materialId || state.quiz.pendingMaterialId || 0);
    const materialId = requestedId > 0 ? requestedId : Number(fallbackMaterial?.id || 0);

    if (!materialId) {
      quiz.state.phase = 'error';
      quiz.state.error = new Error('Belum ada materi yang tersedia untuk kuis di jenjangmu.');
      this.app.store.touch();
      return;
    }

    await quiz.start(materialId);
  }

  showAnswerToast(result) {
    if (!result) return;
    if (result.ok === false) {
      this.app.toast.show('Jawaban Belum Terkirim', result.error?.message || 'Coba lagi sebentar.', '⚠️');
      return;
    }

    const response = result.response || {};
    if (response.retry) {
      this.app.toast.show('Belum Tepat', 'Coba pilih jawaban lain. Nyawa berkurang satu.', '💔');
      return;
    }
    if (response.correct) {
      this.app.toast.show(
        'Jawaban Benar!',
        `Kamu mendapatkan +${Number(response.xp_gained || 0)} XP.`,
        '🎉'
      );
      return;
    }
    if (response.revealed && response.correct_option) {
      this.app.toast.show(
        'Jawaban Kurang Tepat',
        `Jawaban benar: ${response.correct_option}. Baca penjelasannya ya.`,
        '📘'
      );
    }
  }

  viewData() {
    return { state: this.app.store.state };
  }

  render() {
    if (!this.view) return;
    this.view.render(this.viewData());
  }
}
