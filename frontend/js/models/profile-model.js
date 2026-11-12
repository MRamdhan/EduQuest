/**
 * ProfileModel — riwayat kuis, statistik belajar, dan rekomendasi AI.
 */
export class ProfileModel {
  constructor({ store, api }) {
    this.store = store;
    this.api = api;
  }

  async load() {
    const state = this.store.state;
    if (state.isLoadingProfileData || !state.isLoggedIn) return false;

    state.isLoadingProfileData = true;
    this.store.touch();

    try {
      const [historyResult, statsResult, recommendationResult] = await Promise.allSettled([
        this.api.getQuizHistory ? this.api.getQuizHistory() : Promise.resolve([]),
        this.api.getLearningStats ? this.api.getLearningStats() : Promise.resolve(null),
        this.api.getAIRecommendations ? this.api.getAIRecommendations() : Promise.resolve(null)
      ]);

      if (historyResult.status === 'fulfilled' && Array.isArray(historyResult.value)) {
        state.profileQuizHistory = historyResult.value;
      }
      if (statsResult.status === 'fulfilled' && statsResult.value) {
        state.profileStats = statsResult.value;
      }
      if (recommendationResult.status === 'fulfilled' && recommendationResult.value) {
        state.profileRecommendation = recommendationResult.value;
      }
      return true;
    } catch (error) {
      console.warn('Gagal memuat data profil:', error);
      return false;
    } finally {
      state.isLoadingProfileData = false;
      this.store.touch();
    }
  }
}
