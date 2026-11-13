/**
 * QuestModel — katalog mata pelajaran dan materi yang berasal dari backend.
 *
 * Semua data diambil dari endpoint /levels/, /subjects/?, dan /materials/?.
 * Filter utama memakai jenjang pengguna (education_level). Parameter kelas
 * hanya dipakai sebagai penyaring tambahan jika backend menyediakan materi
 * khusus kelas; jika tidak ada, katalog tingkat jenjang tetap ditampilkan.
 */
const CACHE_TTL_MS = 2 * 60 * 1000;

function normalizeLevelCode(code) {
  const value = String(code || '').toUpperCase();
  return value === 'SMA/SMK' ? 'SMA' : value;
}

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export class QuestModel {
  constructor({ store, api, progress }) {
    this.store = store;
    this.api = api;
    this.progress = progress;
    this.loadPromise = null;
    this.levelsPromise = null;
  }

  get state() {
    return this.store.state.quest;
  }

  levelCode() {
    const user = this.store.state.user || {};
    return normalizeLevelCode(user.education_level || user.jenjang || 'SMA');
  }

  kelasNumber() {
    const user = this.store.state.user || {};
    if (Number.isFinite(Number(user.kelasNumber))) return Number(user.kelasNumber);
    const match = String(user.kelas || '').match(/\d+/);
    return match ? Number(match[0]) : null;
  }

  /** Muat daftar jenjang publik dari backend (dipakai landing & modal). */
  async loadLevels({ force = false } = {}) {
    const state = this.store.state;
    if (state.levelsLoaded && !force) return state.levels;
    if (this.levelsPromise) return this.levelsPromise;

    state.levelsLoading = true;
    state.levelsError = null;
    this.store.touch();

    this.levelsPromise = (async () => {
      try {
        const levels = await this.api.getLevels();
        state.levels = Array.isArray(levels) ? levels : [];
        state.levelsLoaded = true;
        return state.levels;
      } catch (error) {
        state.levelsError = error;
        throw error;
      } finally {
        state.levelsLoading = false;
        this.levelsPromise = null;
        this.store.touch();
      }
    })();

    return this.levelsPromise;
  }

  /**
   * Muat katalog mapel + materi untuk jenjang pengguna.
   * @param {{force?: boolean, level?: string}} options
   */
  async loadCatalog({ force = false, level = null } = {}) {
    const state = this.state;
    const requestedLevel = normalizeLevelCode(level || this.levelCode());

    if (!this.store.state.isLoggedIn) return false;
    if (state.loading && this.loadPromise) return this.loadPromise;
    if (!force && state.loaded && state.loadedLevel === requestedLevel
      && Date.now() - state.loadedAt < CACHE_TTL_MS) {
      return true;
    }

    state.loading = true;
    state.error = null;
    this.store.touch();

    this.loadPromise = (async () => {
      try {
        const [subjects, materials] = await Promise.all([
          this.api.getSubjects(requestedLevel),
          this.api.getMaterials({ level: requestedLevel })
        ]);

        const normalizedMaterials = (Array.isArray(materials) ? materials : []).map(material => ({
          ...material,
          id: Number(material.id),
          subject_id: Number(material.subject_id),
          is_completed: Boolean(material.is_completed),
          __done: Boolean(material.is_completed),
          durationLabel: material.estimated_minutes
            ? `± ${material.estimated_minutes} menit`
            : 'Materi singkat',
          topicLabel: material.topic || material.title
        }));

        const materialSubjectIds = new Set(normalizedMaterials.map(item => item.subject_id));
        const allSubjects = (Array.isArray(subjects) ? subjects : []).map(subject => ({
          ...subject,
          id: Number(subject.id)
        }));
        const usableSubjects = allSubjects.filter(subject => materialSubjectIds.has(subject.id));

        state.subjects = usableSubjects;
        state.materials = normalizedMaterials;
        state.loaded = true;
        state.loadedLevel = requestedLevel;
        state.loadedAt = Date.now();

        if (!usableSubjects.some(subject => subject.id === state.activeSubjectId)) {
          state.activeSubjectId = usableSubjects[0]?.id || null;
        }

        const completed = {};
        normalizedMaterials.forEach(material => {
          if (material.is_completed) completed[material.id] = true;
        });
        this.store.state.completedMaterials = completed;

        return true;
      } catch (error) {
        state.error = error;
        state.loaded = false;
        return false;
      } finally {
        state.loading = false;
        this.loadPromise = null;
        this.store.touch();
      }
    })();

    return this.loadPromise;
  }

  /** Paksa muat ulang pada kunjungan berikutnya. */
  invalidate() {
    const state = this.state;
    state.loaded = false;
    state.loadedAt = 0;
    state.loadedLevel = null;
    this.store.touch();
  }

  async refresh() {
    return this.loadCatalog({ force: true });
  }

  subjects() {
    return this.state.subjects || [];
  }

  materials() {
    return this.state.materials || [];
  }

  getSubject(subjectId) {
    if (subjectId === null || subjectId === undefined) return null;
    const normalized = String(subjectId).toLowerCase();
    return this.subjects().find(subject => (
      String(subject.id) === normalized
      || String(subject.slug || '').toLowerCase() === normalized
      || String(subject.name || '').toLowerCase() === normalized
    )) || null;
  }

  activeSubject() {
    return this.getSubject(this.state.activeSubjectId) || this.subjects()[0] || null;
  }

  setSubject(subjectId) {
    const subject = this.getSubject(subjectId);
    if (!subject) return false;
    this.state.activeSubjectId = subject.id;
    this.store.touch();
    return true;
  }

  materialsForSubject(subjectId) {
    const subject = this.getSubject(subjectId);
    const id = subject ? subject.id : asNumber(subjectId);
    if (id === null) return [];
    return this.materials().filter(material => Number(material.subject_id) === Number(id));
  }

  getMaterial(materialId) {
    const id = asNumber(materialId);
    if (id === null) return null;
    return this.materials().find(material => Number(material.id) === id) || null;
  }

  getSiblingMaterials(materialId) {
    const material = this.getMaterial(materialId);
    if (!material) return [];
    return this.materialsForSubject(material.subject_id);
  }

  nextMaterial(materialId) {
    const material = this.getMaterial(materialId);
    if (!material) return null;
    const siblings = this.materialsForSubject(material.subject_id);
    const index = siblings.findIndex(item => Number(item.id) === Number(material.id));
    return index >= 0 ? (siblings[index + 1] || null) : (siblings[0] || null);
  }

  firstIncompleteMaterial() {
    return this.materials().find(material => !material.is_completed) || this.materials()[0] || null;
  }

  isCompleted(materialId) {
    const id = asNumber(materialId);
    if (id === null) return false;
    return Boolean(
      this.store.state.completedMaterials[id]
      || this.getMaterial(id)?.is_completed
    );
  }

  completedCount() {
    return Object.keys(this.store.state.completedMaterials || {}).length;
  }

  subjectCompletedCount(subjectId) {
    return this.materialsForSubject(subjectId).filter(material => this.isCompleted(material.id)).length;
  }

  subjectMaterialCount(subjectId) {
    return this.materialsForSubject(subjectId).length;
  }

  /** Data siap-render untuk kartu mata pelajaran. */
  subjectCards() {
    return this.subjects().map(subject => {
      const materials = this.materialsForSubject(subject.id);
      const completed = materials.filter(material => this.isCompleted(material.id)).length;
      const total = materials.length;
      return {
        ...subject,
        materials,
        completed,
        total,
        percent: total ? Math.round((completed / total) * 100) : 0,
        lives: Number(subject.lives ?? 3),
        maxLives: Number(subject.max_lives ?? 3),
        icon: subject.icon || '📚'
      };
    });
  }

  /** Tandai materi selesai di backend lalu sinkronkan state lokal. */
  async markMaterialDone(materialId) {
    const id = asNumber(materialId);
    if (id === null) return { ok: false, error: new Error('ID materi tidak valid.') };
    if (this.isCompleted(id)) return { ok: true, already: true };

    try {
      await this.progress.completeMaterial(id);
    } catch (error) {
      return { ok: false, error };
    }

    const material = this.getMaterial(id);
    if (material) material.is_completed = true;
    this.store.state.completedMaterials[id] = true;
    this.store.touch();
    return { ok: true, already: false };
  }

  /** Cari materi pertama yang cocok dengan kata kunci pencarian. */
  searchMaterials(query, subjectId = null) {
    const term = String(query || '').trim().toLowerCase();
    let pool = subjectId ? this.materialsForSubject(subjectId) : this.materials();
    if (!term) return pool;
    return pool.filter(material => [
      material.title,
      material.topic,
      material.summary,
      material.subject,
      material.kelas_label
    ].filter(Boolean).join(' ').toLowerCase().includes(term));
  }
}
