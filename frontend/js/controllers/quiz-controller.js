/**
 * QuizController — mengatur interaksi sembilan layar kuis.
 * Semua transisi state didelegasikan ke QuizModel.
 */
import { BaseController } from './base-controller.js';
import { QuizView } from '../views/quiz-view.js';

export class QuizController extends BaseController {
  mount() {
    this.view = new QuizView(this.root);
    this.subscribe();

    this.bind('click', '[data-action="quiz-step"]', (event, target) => {
      this.app.models.quiz.start(Number(target.dataset.step || 1));
    });

    this.bind('click', '[data-action="select-option"]', (event, target) => {
      this.app.models.quiz.selectOption(target.dataset.option);
    });

    this.bind('click', '[data-action="check-answer"]', () => {
      const result = this.app.models.quiz.checkAnswer();
      if (result.correct) {
        this.app.toast.show(
          'Jawaban Benar! (+8 XP)',
          result.secondAttempt ? 'Bagus! Percobaan keduamu tepat.' : 'Jarak sebenarnya adalah 6 km.',
          '🎉'
        );
      } else if (result.secondAttempt) {
        this.app.toast.show('Dua Percobaan Habis (Sisa 1/3 ❤️)', 'Kunci jawaban: B. 6 km. Lanjutkan ke soal berikutnya.', '💔');
      } else {
        this.app.toast.show('Nyawa IPS Berkurang 1 (Sisa 2/3)', 'Jawaban belum tepat. Kamu masih punya 1 kesempatan lagi di soal ini!', '💔');
      }
    });

    this.bind('click', '[data-action="review-question"]', (event, target) => {
      this.app.models.quiz.selectReviewQuestion(Number(target.dataset.question || 1));
    });

    this.bind('click', '[data-action="exit-quiz"]', () => {
      this.app.go(this.app.store.state.quiz.returnPath || '/beranda');
    });

    this.onSubmit('[data-form="quiz-ai"]', async (event, target) => {
      const input = target.querySelector('[data-field="quiz-ai-input"]');
      const value = input?.value.trim() || '';
      if (!value) return;
      this.app.models.quiz.setAiPrompt(value);
    });

    this.app.models.quiz.start(1);
    this.render();
  }

  render() {
    this.view.render(this.app.store.state);
  }
}
