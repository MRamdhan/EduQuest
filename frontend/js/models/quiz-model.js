/**
 * QuizModel — siklus kuis berbasis backend.
 *
 * Alur: start -> jawab soal -> umpan balik/next_question -> ringkasan.
 * Semua aturan (nyawa, XP, adaptasi, pemilihan soal) tetap di backend.
 */
import { createQuizState } from './initial-state.js';

export class QuizModel {
  constructor({ store, api, progress, quest }) {
    this.store = store;
    this.api = api;
    this.progress = progress;
    this.quest = quest;
  }

  get state() {
    return this.store.state.quiz;
  }

  setReturnPath(path) {
    if (path) this.state.returnPath = path;
  }

  resetState() {
    const returnPath = this.state.returnPath;
    this.store.state.quiz = createQuizState();
    this.store.state.quiz.returnPath = returnPath;
    this.store.touch();
  }

  applyContext(context) {
    if (!context) return;
    const state = this.state;

    if (context.lives !== undefined) state.lives = Number(context.lives);
    if (context.max_lives !== undefined) state.maxLives = Number(context.max_lives);
    if (context.unlocked_difficulty !== undefined) {
      state.unlockedDifficulty = Number(context.unlocked_difficulty);
    }
    if (Array.isArray(context.levels)) state.levels = context.levels;
    if (context.subject) state.subject = context.subject;

    if (this.progress?.applyQuizContext) {
      this.progress.applyQuizContext(context);
    }

    if (context.subject?.id && this.quest?.subjects) {
      const subject = this.quest.getSubject(context.subject.id);
      if (subject) {
        subject.lives = Number(context.lives ?? subject.lives);
        subject.max_lives = Number(context.max_lives ?? subject.max_lives);
      }
    }
  }

  materialFromState(materialId) {
    return this.quest?.getMaterial ? this.quest.getMaterial(materialId) : null;
  }

  /** Mulai atau lanjutkan sesi kuis untuk sebuah materi. */
  async start(materialId, difficulty = null) {
    const id = Number(materialId);
    const state = this.state;

    if (!Number.isFinite(id) || id <= 0) {
      state.phase = 'error';
      state.error = new Error('Materi kuis tidak ditemukan.');
      this.store.touch();
      return { ok: false, error: state.error };
    }

    const material = this.materialFromState(id);
    state.materialId = id;
    state.material = material
      ? { id: material.id, title: material.title }
      : null;
    state.phase = 'loading';
    state.error = null;
    state.loading = true;
    state.feedback = null;
    state.selectedOption = null;
    state.summary = null;
    this.store.touch();

    try {
      const response = await this.api.startQuiz(id, difficulty);
      this.applyContext(response);

      const attempt = response.attempt || null;
      state.attempt = attempt;
      state.attemptId = response.attempt_id || attempt?.id || null;
      state.totalQuestions = Number(attempt?.total_questions || attempt?.questions?.length || 0);
      if (attempt?.material) state.material = attempt.material;
      state.difficulty = attempt?.target_difficulty ?? difficulty ?? null;

      if (response.summary) {
        state.summary = response.summary;
        state.phase = 'summary';
        state.question = null;
        state.loading = false;
        this.store.touch();
        return { ok: true, summary: response.summary };
      }

      if (attempt?.status === 'submitted') {
        state.loading = false;
        return this.loadAttempt(state.attemptId);
      }

      const nextQuestion = response.next_question
        || attempt?.questions?.find(question => !question.is_resolved)
        || null;

      if (!nextQuestion) {
        state.loading = false;
        return this.loadAttempt(state.attemptId);
      }

      this.setQuestion(nextQuestion);
      state.phase = 'question';
      state.loading = false;
      this.store.touch();
      return { ok: true, attemptId: state.attemptId };
    } catch (error) {
      state.phase = 'error';
      state.error = error;
      state.loading = false;
      this.store.touch();
      return { ok: false, error };
    }
  }

  setQuestion(question) {
    const state = this.state;
    state.question = question;
    state.questionNumber = Number(question?.order || 0) || (state.questionNumber + 1);
    state.selectedOption = null;
  }

  /** Muat ulang attempt (mis. semua soal sudah terjawab). */
  async loadAttempt(attemptId = this.state.attemptId) {
    const state = this.state;
    if (!attemptId) {
      state.phase = 'error';
      state.error = new Error('Sesi kuis tidak ditemukan.');
      this.store.touch();
      return { ok: false, error: state.error };
    }

    state.loading = true;
    state.error = null;
    this.store.touch();

    try {
      const response = await this.api.getQuizDetail(attemptId);
      this.applyContext(response);
      const attempt = response.attempt || null;
      state.attempt = attempt;
      state.attemptId = response.attempt_id || attempt?.id || attemptId;
      state.totalQuestions = Number(attempt?.total_questions || attempt?.questions?.length || 0);
      if (attempt?.material) state.material = attempt.material;

      if (response.summary || attempt?.status === 'submitted') {
        state.summary = response.summary || null;
        state.phase = 'summary';
        state.question = null;
      } else {
        const nextQuestion = response.next_question
          || attempt?.questions?.find(question => !question.is_resolved)
          || null;
        if (nextQuestion) {
          this.setQuestion(nextQuestion);
          state.phase = 'question';
        } else {
          state.phase = 'summary';
          state.summary = response.summary || null;
        }
      }

      state.loading = false;
      this.store.touch();
      return { ok: true };
    } catch (error) {
      state.phase = 'error';
      state.error = error;
      state.loading = false;
      this.store.touch();
      return { ok: false, error };
    }
  }

  selectOption(option) {
    const state = this.state;
    if (state.phase !== 'question' || state.loading) return false;
    state.selectedOption = String(option || '').toUpperCase();
    state.feedback = null;
    this.store.touch();
    return true;
  }

  /** Kirim jawaban lalu perbarui soal, nyawa, dan ringkasan. */
  async submitAnswer() {
    const state = this.state;
    if (state.phase !== 'question' || state.loading) {
      return { ok: false, error: new Error('Soal belum siap dijawab.') };
    }
    if (!state.selectedOption) {
      return { ok: false, error: new Error('Pilih salah satu jawaban terlebih dahulu.') };
    }

    const question = state.question;
    const selected = state.selectedOption;
    state.loading = true;
    state.error = null;
    this.store.touch();

    try {
      const response = await this.api.answerQuestion(
        state.attemptId,
        question.id,
        selected
      );

      this.applyContext(response);

      state.feedback = {
        questionId: question.id,
        correct: Boolean(response.correct),
        retry: Boolean(response.retry),
        revealed: Boolean(response.revealed),
        hint: response.hint || '',
        hintSource: response.hint_source || '',
        xpGained: Number(response.xp_gained || 0),
        correctOption: response.correct_option || null,
        explanation: response.explanation || null,
        selectedOption: selected
      };

      if (response.session_ended) {
        state.summary = response.summary || null;
        state.phase = 'summary';
        state.question = null;
        state.selectedOption = null;
        state.loading = false;
        this.refreshProgressSoon();
        this.store.touch();
        return { ok: true, ended: true, response };
      }

      if (response.next_question) {
        this.setQuestion(response.next_question);
        state.phase = 'question';
      } else {
        state.phase = 'question';
        state.selectedOption = null;
      }

      state.loading = false;
      this.refreshProgressSoon();
      this.store.touch();
      return { ok: true, response };
    } catch (error) {
      state.loading = false;
      state.error = error;
      this.store.touch();
      return { ok: false, error };
    }
  }

  refreshProgressSoon() {
    if (!this.progress?.refresh) return;
    this.progress.refresh().catch(() => {});
  }

  /** Ulangi kuis untuk materi yang sama (membuat attempt baru bila perlu). */
  async restart() {
    const materialId = this.state.materialId;
    if (!materialId) return { ok: false };
    this.resetState();
    return this.start(materialId);
  }

  isQuestionLocked() {
    return this.state.loading || this.state.phase !== 'question';
  }
}
