/**
 * QuizView — tampilan kuis berbasis data backend.
 * View hanya menggambar state; aturan kuis ada di QuizModel/backend.
 */
import { escapeHtml } from '../core/dom.js';
import { renderHeartsInline } from './helpers.js';

const DIFFICULTY_LABEL = {
  1: 'Dasar',
  2: 'Sedang',
  3: 'Sulit'
};

export class QuizView {
  constructor(root) {
    this.root = root;
  }

  render(data) {
    if (!this.root) return;
    const state = data.state || {};
    const quiz = state.quiz || {};

    if (quiz.phase === 'loading') {
      this.root.innerHTML = this.renderLoading(quiz);
      return;
    }
    if (quiz.phase === 'error') {
      this.root.innerHTML = this.renderError(quiz);
      return;
    }
    if (quiz.phase === 'summary') {
      this.root.innerHTML = this.renderSummary(state);
      return;
    }
    if (quiz.phase === 'question') {
      this.root.innerHTML = this.renderQuestion(state);
      return;
    }
    this.root.innerHTML = this.renderIdle(state);
  }

  returnLabel(path) {
    if (!path) return 'Beranda';
    if (path.startsWith('/quest/')) return 'Materi';
    if (path.startsWith('/quest')) return 'Quest';
    if (path.startsWith('/profil')) return 'Profil';
    if (path.startsWith('/ai-tutor')) return 'AI Tutor';
    return 'Beranda';
  }

  renderTopBar(state, quiz, title) {
    return `
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" data-action="quiz-exit"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-600 transition hover:bg-slate-50">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          ${escapeHtml(this.returnLabel(quiz.returnPath))}
        </button>
        <div class="flex items-center gap-3">
          <span class="pill">${escapeHtml(DIFFICULTY_LABEL[quiz.difficulty] || 'Dasar')}</span>
          <span class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-extrabold text-ink-900 ring-1 ring-brand-100">
            ${renderHeartsInline(Number(quiz.lives || 0), Number(quiz.maxLives || 3), 'h-4 w-4')}
            <span class="ml-1">${escapeHtml(title || '')}</span>
          </span>
        </div>
      </div>
    `;
  }

  renderLoading(quiz) {
    return `
      <div class="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-3xl border border-brand-100 bg-white px-6 py-20 text-center shadow-card">
        <span class="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700"></span>
        <h2 class="mt-5 font-display text-xl font-extrabold text-ink-900">Menyiapkan Kuis</h2>
        <p class="mt-2 max-w-md text-sm text-slate-500">Soal dipilih dari bank soal sesuai jenjang dan materi ${escapeHtml(quiz.material?.title || 'yang kamu pilih')}. Tunggu sebentar ya.</p>
      </div>
    `;
  }

  renderError(quiz) {
    const message = quiz.error?.message || 'Kuis belum bisa dimulai.';
    return `
      <div class="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-white p-6 text-center shadow-card sm:p-10">
        <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-3xl">🧭</span>
        <h2 class="mt-5 font-display text-2xl font-extrabold text-ink-900">Kuis Belum Bisa Dimulai</h2>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">${escapeHtml(message)}</p>
        ${quiz.material?.title ? `<p class="mt-2 text-xs font-bold text-slate-400">Materi: ${escapeHtml(quiz.material.title)}</p>` : ''}
        <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" data-action="quiz-retry" class="btn-primary w-full sm:w-auto">Coba Lagi</button>
          <button type="button" data-action="go" data-route="/quest" class="btn-outline w-full sm:w-auto">Kembali ke Quest</button>
        </div>
      </div>
    `;
  }

  renderIdle(state) {
    const quiz = state.quiz || {};
    return `
      <div class="mx-auto max-w-2xl rounded-3xl border border-brand-100 bg-white p-6 text-center shadow-card sm:p-10">
        <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-100 text-3xl">⚔️</span>
        <h2 class="mt-5 font-display text-2xl font-extrabold text-ink-900">Pilih Materi untuk Kuis</h2>
        <p class="mt-3 text-sm text-slate-600">Kuis dibuat dari materi yang sudah kamu baca. Buka Quest lalu pilih materi dan mulai tantangannya.</p>
        <button type="button" data-action="go" data-route="/quest" class="btn-primary mt-6">Buka Quest</button>
      </div>
    `;
  }

  renderFeedback(quiz) {
    const feedback = quiz.feedback;
    if (!feedback) return '';

    const hint = feedback.hint
      ? `<div class="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
           <span class="font-extrabold">Petunjuk:</span> ${escapeHtml(feedback.hint)}
         </div>`
      : '';

    if (feedback.retry) {
      return `
        <div class="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p class="font-extrabold">Belum tepat. Coba lagi!</p>
          <p class="mt-1 text-xs leading-relaxed">Nyawa berkurang satu. Baca soal dengan teliti, lalu pilih jawaban lain.</p>
          ${hint}
        </div>
      `;
    }

    if (feedback.correct) {
      const xp = feedback.xpGained > 0 ? ` <span class="text-emerald-700">+${feedback.xpGained} XP</span>` : '';
      return `
        <div class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p class="font-extrabold">Jawaban benar!${xp}</p>
          <p class="mt-1 text-xs leading-relaxed">Lanjut ke soal berikutnya. Pertahankan fokusmu!</p>
        </div>
      `;
    }

    const correctText = feedback.revealed && feedback.correctOption
      ? `<p class="mt-1 text-xs font-bold">Jawaban benar: ${escapeHtml(feedback.correctOption)}</p>`
      : '';
    const explanation = feedback.explanation
      ? `<p class="mt-2 text-xs leading-relaxed">${escapeHtml(feedback.explanation)}</p>`
      : '';

    return `
      <div class="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
        <p class="font-extrabold">Jawaban belum tepat.</p>
        ${correctText}
        ${explanation}
        ${hint}
      </div>
    `;
  }

  renderQuestion(state) {
    const quiz = state.quiz;
    const question = quiz.question;
    if (!question) return this.renderLoading(quiz);

    const questionText = question.question_text || question.text || 'Soal tidak tersedia.';
    const options = Array.isArray(question.options) ? question.options : [];
    const feedback = quiz.feedback;
    const feedbackForCurrent = feedback && feedback.questionId === question.id;
    const selected = quiz.selectedOption;
    const total = Math.max(1, Number(quiz.totalQuestions || 0));
    const current = Math.max(1, Number(quiz.questionNumber || 1));
    const percent = Math.min(100, Math.round((Math.min(current - 1, total) / total) * 100));
    const subjectName = quiz.subject?.name || state.quest?.subjects?.find(item => item.id === quiz.subject?.id)?.name || '';
    const materialTitle = quiz.material?.title || '';
    const botName = state.user?.firstName || 'Petualang';

    const optionsHtml = options.map((option, index) => {
      const key = String(option.key || String.fromCharCode(65 + index)).toUpperCase();
      const text = option.text || option.label || String(option);
      const isSelected = selected === key;
      const isRevealedCorrect = feedbackForCurrent && feedback.revealed && feedback.correctOption === key;
      const isRevealedWrong = feedbackForCurrent && feedback.revealed && isSelected && feedback.correctOption !== key;

      let classes = 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40';
      if (isSelected) classes = 'border-brand-500 bg-brand-50 ring-2 ring-brand-200';
      if (isRevealedCorrect) classes = 'border-emerald-400 bg-emerald-50';
      if (isRevealedWrong) classes = 'border-rose-300 bg-rose-50';

      return `
        <button type="button" data-action="select-option" data-option="${escapeHtml(key)}"
          aria-pressed="${isSelected ? 'true' : 'false'}"
          class="group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${classes} ${quiz.loading ? 'opacity-70' : ''}"
          ${quiz.loading ? 'disabled' : ''}>
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white font-display text-sm font-extrabold text-ink-900 group-hover:border-brand-300">${escapeHtml(key)}</span>
          <span class="pt-1.5 text-sm font-semibold leading-relaxed text-ink-900">${escapeHtml(text)}</span>
        </button>
      `;
    }).join('');

    const submitLabel = feedbackForCurrent?.retry ? 'Coba Jawaban Lain' : 'Periksa Jawaban';

    return `
      <div class="mx-auto max-w-3xl">
        ${this.renderTopBar(state, quiz, materialTitle)}
        <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-card sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span class="pill">${escapeHtml(subjectName || 'Kuis')}</span>
              <p class="mt-2 text-xs font-bold text-slate-400">${escapeHtml(materialTitle)}</p>
            </div>
            <span class="font-display text-sm font-extrabold text-ink-900">Soal ${current} <span class="text-slate-400">/ ${total}</span></span>
          </div>

          <div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-brand-100">
            <div class="h-full rounded-full bg-brand-700 transition-all duration-300" style="width:${percent}%"></div>
          </div>

          <div class="mt-6 flex items-start gap-3">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-xl">🦉</span>
            <div>
              <p class="text-xs font-extrabold uppercase tracking-wide text-brand-700">Tantangan untuk ${escapeHtml(botName)}</p>
              <h1 class="mt-1 font-display text-xl font-extrabold leading-snug text-ink-900 sm:text-2xl">${escapeHtml(questionText)}</h1>
            </div>
          </div>

          <div class="mt-6 space-y-3">${optionsHtml}</div>

          ${this.renderFeedback(quiz)}

          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-[11px] font-bold text-slate-400">Nyawa: ${Number(quiz.lives || 0)}/${Number(quiz.maxLives || 3)} · XP total: ${Number(state.user?.totalXp || 0)}</p>
            <button type="button" data-action="submit-answer" class="btn-primary w-full sm:w-auto"
              ${(!selected || quiz.loading) ? 'disabled' : ''}>
              ${quiz.loading ? 'Memeriksa...' : submitLabel}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderSummary(state) {
    const quiz = state.quiz;
    const summary = quiz.summary || {};
    const score = summary.score || {};
    const reward = summary.reward || {};
    const percent = Math.round(Number(score.percent || 0));
    const materialTitle = quiz.material?.title || 'Materi';
    const subjectName = quiz.subject?.name || '';
    const answers = Array.isArray(summary.answers) ? summary.answers : [];
    const questions = Array.isArray(quiz.attempt?.questions) ? quiz.attempt.questions : [];
    const questionMap = new Map(questions.map(question => [Number(question.id), question]));

    const answerRows = answers.map((answer, index) => {
      const question = questionMap.get(Number(answer.question_id));
      const text = question?.question_text || `Soal ${answer.order || index + 1}`;
      const isCorrect = answer.is_correct === true;
      const isUnanswered = answer.is_correct === null || answer.is_correct === undefined;
      const statusLabel = isCorrect ? 'Benar' : (isUnanswered ? 'Tidak dijawab' : 'Salah');
      const statusClass = isCorrect
        ? 'bg-emerald-100 text-emerald-800'
        : (isUnanswered ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-800');
      const selected = answer.selected_option || '—';
      const correct = answer.correct_option || '—';
      const explanation = answer.explanation
        ? `<p class="mt-2 text-xs leading-relaxed text-slate-500">${escapeHtml(answer.explanation)}</p>`
        : '';
      return `
        <div class="rounded-2xl border border-slate-200 bg-white p-4">
          <div class="flex items-start justify-between gap-3">
            <p class="text-sm font-bold leading-relaxed text-ink-900"><span class="text-slate-400">#${answer.order || index + 1}</span> ${escapeHtml(text)}</p>
            <span class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${statusClass}">${statusLabel}</span>
          </div>
          <p class="mt-2 text-[11px] font-bold text-slate-500">Jawabanmu: <span class="text-ink-900">${escapeHtml(selected)}</span> · Kunci: <span class="text-emerald-700">${escapeHtml(correct)}</span></p>
          ${explanation}
        </div>
      `;
    }).join('');

    const adaptation = summary.adaptation;
    const adaptationText = adaptation?.reason
      ? `<div class="mt-5 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 text-xs leading-relaxed text-brand-900">
           <span class="font-extrabold">Adaptasi berikutnya:</span> ${escapeHtml(adaptation.reason)}
         </div>`
      : '';

    return `
      <div class="mx-auto max-w-3xl">
        ${this.renderTopBar(state, quiz, materialTitle)}
        <div class="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-card">
          <div class="bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-8 text-center text-white sm:px-10">
            <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-100">Kuis Selesai</p>
            <h1 class="mt-2 font-display text-3xl font-extrabold">${percent}%</h1>
            <p class="mt-1 text-sm font-bold text-brand-100">${escapeHtml(subjectName)} · ${escapeHtml(materialTitle)}</p>
            ${reward.ended_early ? '<p class="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold">Sesi berakhir lebih awal karena nyawa habis.</p>' : ''}
          </div>

          <div class="p-5 sm:p-8">
            <div class="grid gap-3 sm:grid-cols-4">
              <div class="rounded-2xl bg-emerald-50 p-4 text-center"><p class="font-display text-2xl font-extrabold text-emerald-700">${Number(score.correct || 0)}</p><p class="text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">Benar</p></div>
              <div class="rounded-2xl bg-rose-50 p-4 text-center"><p class="font-display text-2xl font-extrabold text-rose-700">${Number(score.wrong || 0)}</p><p class="text-[10px] font-extrabold uppercase tracking-wide text-rose-700">Salah</p></div>
              <div class="rounded-2xl bg-slate-100 p-4 text-center"><p class="font-display text-2xl font-extrabold text-slate-700">${Number(score.unanswered || 0)}</p><p class="text-[10px] font-extrabold uppercase tracking-wide text-slate-600">Kosong</p></div>
              <div class="rounded-2xl bg-brand-50 p-4 text-center"><p class="font-display text-2xl font-extrabold text-brand-700">+${Number(reward.xp_gained || 0)}</p><p class="text-[10px] font-extrabold uppercase tracking-wide text-brand-700">XP</p></div>
            </div>

            <div class="mt-5 grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl border border-slate-200 p-4">
                <p class="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Level</p>
                <p class="mt-1 font-display text-lg font-extrabold text-ink-900">${Number(reward.level_after || state.user?.level || 1)}</p>
                <p class="text-[11px] font-bold text-slate-500">${reward.leveled_up ? 'Naik level! 🎉' : 'Terus kumpulkan XP'}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 p-4">
                <p class="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Nyawa tersisa</p>
                <p class="mt-1 flex items-center gap-1 font-display text-lg font-extrabold text-ink-900">${renderHeartsInline(Number(reward.lives ?? quiz.lives ?? 0), Number(quiz.maxLives || 3), 'h-4 w-4')}</p>
                <p class="text-[11px] font-bold text-slate-500">${Number(reward.lives_lost || 0)} nyawa terpakai</p>
              </div>
              <div class="rounded-2xl border border-slate-200 p-4">
                <p class="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Total soal</p>
                <p class="mt-1 font-display text-lg font-extrabold text-ink-900">${Number(score.total || questions.length || 0)}</p>
                <p class="text-[11px] font-bold text-slate-500">Satu sesi kuis</p>
              </div>
            </div>

            ${adaptationText}

            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" data-action="quiz-retry" class="btn-primary flex-1">Ulangi Kuis</button>
              <button type="button" data-action="quiz-exit" class="btn-outline flex-1">Kembali ke ${escapeHtml(this.returnLabel(quiz.returnPath))}</button>
            </div>

            ${answerRows ? `
              <details class="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4" open>
                <summary class="cursor-pointer text-sm font-extrabold text-ink-900">Rincian Jawaban</summary>
                <div class="mt-3 space-y-3">${answerRows}</div>
              </details>
            ` : ''}

            <div class="mt-5 flex justify-center">
              <button type="button" data-action="go" data-route="/quest" class="text-xs font-extrabold text-brand-700 hover:underline">Jelajahi materi lain →</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
