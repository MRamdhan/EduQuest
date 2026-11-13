/**
 * ProgressModel — XP, level, rank, nyawa mapel, dan penyelesaian materi.
 * Sumber kebenaran tetap backend /api/progress/.
 */
export class ProgressModel {
  constructor({ store, api }) {
    this.store = store;
    this.api = api;
  }

  apply(progress) {
    if (!progress) return;

    const state = this.store.state;
    const user = state.user;

    state.progressSummary = progress;
    user.totalXp = progress.xp ?? user.totalXp;
    user.level = progress.level ?? user.level;
    user.rank = progress.rank?.name || user.rank;
    user.rankCode = progress.rank?.code || user.rankCode;
    user.xp = progress.xp_into_level ?? user.xp;
    user.nextLevelXp = progress.xp_for_next_level ?? user.nextLevelXp;
    user.nextRank = progress.next_rank?.name || '';
    user.xpToNextRank = progress.xp_to_next_rank ?? 0;

    state.isNewUser = Number(progress.xp || 0) === 0
      && Number(progress.materials_completed || 0) === 0
      && Number(progress.quizzes_submitted || 0) === 0;

    if (Array.isArray(progress.subject_lives)) {
      const activeId = state.quest?.activeSubjectId;
      const activeLives = progress.subject_lives.find(entry => Number(entry.subject_id) === Number(activeId));
      const selected = activeLives || progress.subject_lives[0];
      if (selected) {
        user.ipsLives = Number(selected.lives ?? user.ipsLives);
        user.ipsLivesMax = Number(selected.max_lives ?? user.ipsLivesMax);
      }
    }

    this.store.touch();
  }

  /** Terapkan konteks yang dikirim endpoint kuis setelah menjawab soal. */
  applyQuizContext(context) {
    if (!context) return;
    const state = this.store.state;
    const user = state.user;

    if (context.total_xp !== undefined) user.totalXp = context.total_xp;
    if (context.level !== undefined) user.level = context.level;
    if (context.rank?.name) user.rank = context.rank.name;
    if (context.rank?.code) user.rankCode = context.rank.code;
    if (context.next_rank?.name) user.nextRank = context.next_rank.name;
    if (context.xp_to_next_rank !== undefined) user.xpToNextRank = context.xp_to_next_rank;

    if (Array.isArray(state.progressSummary?.subject_lives) && context.subject?.id) {
      const entry = state.progressSummary.subject_lives.find(item => (
        Number(item.subject_id) === Number(context.subject.id)
      ));
      if (entry) {
        entry.lives = context.lives ?? entry.lives;
        entry.max_lives = context.max_lives ?? entry.max_lives;
      }
    }

    if (context.lives !== undefined) {
      user.ipsLives = context.lives;
      user.ipsLivesMax = context.max_lives ?? user.ipsLivesMax;
    }

    this.store.touch();
  }

  async refresh() {
    const progress = await this.api.getProgress();
    this.apply(progress);
    return progress;
  }

  async completeMaterial(materialId) {
    const result = await this.api.completeMaterial(materialId);
    if (result?.progress) this.apply(result.progress);
    await this.refresh().catch(() => {});
    return result;
  }

  async loadStats() {
    return this.api.getLearningStats();
  }

  async loadRanks() {
    try {
      const ranks = await this.api.getRanks();
      this.store.state.ranks = Array.isArray(ranks) ? ranks : [];
      this.store.touch();
      return this.store.state.ranks;
    } catch (error) {
      return [];
    }
  }
}
