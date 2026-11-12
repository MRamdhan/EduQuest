/**
 * ProgressModel — mengelola XP, level, rank, dan penyelesaian materi.
 */
export class ProgressModel {
  constructor({ store, api }) {
    this.store = store;
    this.api = api;
  }

  apply(progress) {
    if (!progress) return;

    const user = this.store.state.user;
    user.totalXp = progress.xp ?? user.totalXp;
    user.level = progress.level ?? user.level;
    user.rank = progress.rank?.name || user.rank;
    user.xp = progress.xp_into_level ?? user.xp;
    user.nextLevelXp = progress.xp_for_next_level ?? user.nextLevelXp;

    if (progress.subject_lives) {
      if (Array.isArray(progress.subject_lives)) {
        const ipsEntry = progress.subject_lives.find(s => (s.subject_name || '').toUpperCase().includes('IPS')) || progress.subject_lives[0];
        if (ipsEntry && typeof ipsEntry.lives === 'number') {
          user.ipsLives = ipsEntry.lives;
        }
      } else if (typeof progress.subject_lives === 'object') {
        const raw = progress.subject_lives['IPS'] ?? Object.values(progress.subject_lives)[0];
        if (typeof raw === 'number') {
          user.ipsLives = raw;
        } else if (raw && typeof raw.lives === 'number') {
          user.ipsLives = raw.lives;
        }
      }
    }

    this.store.touch();
  }

  async refresh() {
    const progress = await this.api.getProgress();
    this.apply(progress);
    return progress;
  }

  async completeMaterial(backendId) {
    const result = await this.api.completeMaterial(backendId);
    if (result?.progress) this.apply(result.progress);
    await this.refresh().catch(() => {});
    return result;
  }

  async loadStats() {
    return this.api.getLearningStats();
  }
}
