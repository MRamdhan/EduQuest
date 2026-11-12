/**
 * QuestModel — katalog bab/materi dan penandaan materi selesai.
 */
import { IPS_CHAPTERS, SUBJECT_CHAPTERS } from '../config/curriculum.js';

export class QuestModel {
  constructor({ store, api, progress }) {
    this.store = store;
    this.api = api;
    this.progress = progress;
  }

  chapters(subject = this.store.state.activeSubject) {
    return SUBJECT_CHAPTERS[subject] || IPS_CHAPTERS;
  }

  setSubject(subject) {
    this.store.state.activeSubject = subject;
    this.store.touch();
  }

  getChapter(babId) {
    if (!babId) return this.chapters()[0] || IPS_CHAPTERS[0];

    const current = this.chapters().find(chapter => chapter.id === babId);
    if (current) return current;

    for (const list of Object.values(SUBJECT_CHAPTERS)) {
      const found = list.find(chapter => chapter.id === babId);
      if (found) return found;
    }

    return IPS_CHAPTERS[0];
  }

  getSubjectByChapterId(babId) {
    for (const [subj, list] of Object.entries(SUBJECT_CHAPTERS)) {
      if (list.some(chapter => chapter.id === babId)) return subj;
    }
    return this.store.state.activeSubject || 'IPS';
  }

  getMaterial(babId, matId) {
    const chapter = this.getChapter(babId);
    return chapter.materials.find(material => material.id === matId) || chapter.materials[0];
  }

  isCompleted(matId) {
    return Boolean(this.store.state.completedMaterials[matId]);
  }

  completedCount() {
    return Object.keys(this.store.state.completedMaterials).length;
  }

  subjectCompletedCount(subject) {
    return this.chapters(subject)
      .flatMap(chapter => chapter.materials)
      .filter(material => this.isCompleted(material.id)).length;
  }

  subjectMaterialCount(subject) {
    return this.chapters(subject)
      .reduce((total, chapter) => total + chapter.materials.length, 0);
  }

  /** Menyesuaikan ID materi UI dengan ID materi yang tersedia di backend. */
  resolveBackendMaterialId(matId) {
    const user = this.store.state.user || {};
    const raw = String(user.education_level || user.jenjang || '').toUpperCase();
    let validPool = [4, 5, 6, 10];

    if (raw.includes('SD')) validPool = [1, 2, 3];
    else if (raw.includes('SMP')) validPool = [7, 8, 9];

    if (typeof matId === 'number' && validPool.includes(matId)) return matId;

    const matches = String(matId || '').match(/\d+/g);
    let index = 0;

    if (matches && matches.length >= 2) {
      const bab = Math.max(0, parseInt(matches[0], 10) - 1);
      const mat = Math.max(0, parseInt(matches[1], 10) - 1);
      index = (bab * 3 + mat) % validPool.length;
    } else if (matches && matches.length === 1) {
      index = Math.max(0, parseInt(matches[0], 10) - 1) % validPool.length;
    }

    return validPool[index] || validPool[0];
  }

  /**
   * Tandai materi selesai. Jika login, sinkronkan ke backend.
   * @returns {Promise<boolean>} true bila materi baru saja selesai.
   */
  async markMaterialDone(matId) {
    const state = this.store.state;
    if (state.completedMaterials[matId]) return false;

    state.completedMaterials[matId] = true;
    this.store.touch();

    if (state.isLoggedIn && this.api) {
      try {
        const backendId = this.resolveBackendMaterialId(matId);
        await this.progress.completeMaterial(backendId);
        return true;
      } catch (error) {
        console.warn('Gagal sinkronisasi materi selesai ke backend:', error);
      }
    }

    // Fallback lokal (offline/demo).
    state.user.xp = Math.min(state.user.nextLevelXp, state.user.xp + 15);
    state.user.totalXp = (state.user.totalXp || 0) + 15;
    this.store.touch();
    return true;
  }
}
