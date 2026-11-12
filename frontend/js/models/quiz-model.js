/**
 * QuizModel — state mesin kuis 3 nyawa (9 layar).
 * Semua transisi state ada di sini; view hanya menggambar hasilnya.
 */
export class QuizModel {
  constructor({ store }) {
    this.store = store;
  }

  get state() {
    return this.store.state.quiz;
  }

  setReturnPath(path) {
    if (path && path !== '/kuis') this.state.returnPath = path;
  }

  /** Pindah ke layar kuis dan atur nyawa/pilihan sesuai desain alur. */
  start(step = 1) {
    const quiz = this.state;
    const user = this.store.state.user;

    if (step === 1 || step === 2) {
      quiz.q1Selected = null;
      quiz.awarded = false;
      quiz.lives = typeof user.ipsLives === 'number' ? user.ipsLives : 3;
    } else if (step === 3) {
      quiz.q1Selected = quiz.q1Selected || 'A';
    } else if (step === 4) {
      quiz.q1Selected = 'A';
      quiz.lives = 2;
      user.ipsLives = 2;
    } else if (step === 5) {
      quiz.lives = 1;
      user.ipsLives = 1;
    } else if (step === 7) {
      if (!quiz.awarded) {
        user.xp = (user.xp || 0) + 72;
        user.totalXp = (user.totalXp || 0) + 72;
        while (user.xp >= user.nextLevelXp) {
          user.xp -= user.nextLevelXp;
          user.level = (user.level || 1) + 1;
          user.nextLevelXp = Math.round(user.nextLevelXp * 1.5);
        }
        if (user.totalXp >= 1000) user.rank = 'Diamond';
        else if (user.totalXp >= 600) user.rank = 'Platinum';
        else if (user.totalXp >= 300) user.rank = 'Gold';
        else if (user.totalXp >= 100) user.rank = 'Silver';
        else user.rank = 'Bronze';

        this.store.state.isNewUser = false;
        if (!this.store.state.completedQuizzes) this.store.state.completedQuizzes = {};
        this.store.state.completedQuizzes['kuis-peta'] = true;

        if (!Array.isArray(this.store.state.profileQuizHistory)) {
          this.store.state.profileQuizHistory = [];
        }
        const exists = this.store.state.profileQuizHistory.some(h => h.id === 'kuis-peta');
        if (!exists) {
          this.store.state.profileQuizHistory.unshift({
            id: 'kuis-peta',
            started_at: new Date().toISOString(),
            target_difficulty: 2,
            material: { title: 'Kuis Bab 1: Mengenal Peta & Komponennya' },
            title: 'Kuis Bab 1: Mengenal Peta & Komponennya',
            correct_count: 9,
            total_questions: 10,
            percent: 90,
            xp_gained: 72,
            ended_early: false,
            badge: 'Kuis Bab 1',
            scoreText: 'Skor 90%',
            scoreBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            meta: '10 soal • +72 XP',
            date: 'Baru saja'
          });
        }
        quiz.awarded = true;
      }
    } else if (step === 9) {
      quiz.lives = 0;
      user.ipsLives = 0;
    }

    quiz.step = step;
    this.store.touch();
    return step;
  }

  selectOption(option) {
    const quiz = this.state;
    quiz.q1Selected = option;
    if (quiz.step === 2) quiz.step = 3;
    this.store.touch();
  }

  /**
   * Periksa jawaban soal 01.
   * @returns {{nextStep: number, correct: boolean, secondAttempt: boolean}}
   */
  checkAnswer() {
    const quiz = this.state;
    const selected = quiz.q1Selected || 'A';

    if (quiz.step === 2 || quiz.step === 3) {
      if (selected === 'B') {
        this.start(6);
        return { nextStep: 6, correct: true, secondAttempt: false };
      }
      this.start(4);
      return { nextStep: 4, correct: false, secondAttempt: false };
    }

    if (quiz.step === 4) {
      if (selected === 'B') {
        this.start(6);
        return { nextStep: 6, correct: true, secondAttempt: true };
      }
      this.start(5);
      return { nextStep: 5, correct: false, secondAttempt: true };
    }

    return { nextStep: quiz.step, correct: false, secondAttempt: false };
  }

  selectReviewQuestion(number) {
    this.state.reviewQuestionNum = number;
    this.store.touch();
  }

  setAiPrompt(text) {
    this.state.aiPrompt = text;
    this.store.touch();
  }

  resetAiPrompt() {
    this.state.aiPrompt = '';
  }
}
