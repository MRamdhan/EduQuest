/**
 * AiTutorModel — percakapan AI Tutor yang terikat pada materi backend.
 * Memakai POST /tutor/ask/ dengan material_id yang valid.
 */
export class AiTutorModel {
  constructor({ store, api, quest } = {}) {
    this.store = store;
    this.api = api;
    this.quest = quest;
  }

  get state() {
    return this.store.state.aiTutor;
  }

  get subjects() {
    return this.quest ? this.quest.subjectCards() : [];
  }

  activeSubject() {
    return this.subjects.find(subject => Number(subject.id) === Number(this.state.subjectId))
      || this.subjects[0]
      || null;
  }

  materials() {
    const subject = this.activeSubject();
    return subject ? subject.materials : [];
  }

  activeMaterial() {
    const materials = this.materials();
    return materials.find(material => Number(material.id) === Number(this.state.materialId))
      || materials[0]
      || null;
  }

  /** Pastikan pilihan mapel/materi selalu valid terhadap katalog backend. */
  ensureSelection() {
    const subjects = this.subjects;
    if (!subjects.length) {
      this.state.subjectId = null;
      this.state.materialId = null;
      return false;
    }

    let subject = subjects.find(item => Number(item.id) === Number(this.state.subjectId));
    if (!subject) {
      subject = subjects.find(item => item.materials.some(material => Number(material.id) === Number(this.state.materialId)))
        || subjects[0];
      this.state.subjectId = subject.id;
    }

    const material = subject.materials.find(item => Number(item.id) === Number(this.state.materialId))
      || subject.materials[0]
      || null;
    this.state.materialId = material ? material.id : null;
    return Boolean(material);
  }

  selectSubject(subjectId) {
    const subject = this.subjects.find(item => Number(item.id) === Number(subjectId));
    if (!subject) return false;
    this.state.subjectId = subject.id;
    this.state.materialId = subject.materials[0]?.id || null;
    this.state.messages = [];
    this.state.error = null;
    this.store.touch();
    return true;
  }

  selectMaterial(materialId) {
    const id = Number(materialId);
    const material = this.quest?.getMaterial(id);
    if (!material) return false;
    this.state.materialId = material.id;
    this.state.subjectId = material.subject_id;
    this.state.messages = [];
    this.state.error = null;
    this.store.touch();
    return true;
  }

  setDraft(value) {
    this.state.draft = value;
  }

  get starters() {
    const material = this.activeMaterial();
    if (!material) return [];
    const title = material.title;
    return [
      {
        title: 'Pahami inti materi',
        type: 'materi',
        prompt: `Jelaskan inti materi "${title}" dengan bahasa yang sederhana.`
      },
      {
        title: 'Minta contoh',
        type: 'contoh',
        prompt: `Beri satu contoh nyata yang berkaitan dengan "${title}".`
      },
      {
        title: 'Cek pemahaman',
        type: 'petunjuk',
        prompt: `Buat satu pertanyaan singkat untuk mengecek pemahaman saya tentang "${title}".`
      }
    ];
  }

  askStarter(index) {
    const starter = this.starters[index];
    if (!starter) return false;
    return this.send(starter.prompt, { displayText: starter.prompt });
  }

  async send(text, { displayText = null } = {}) {
    const message = String(text ?? this.state.draft).trim();
    if (!message || this.state.isLoading) return false;

    this.ensureSelection();
    const material = this.activeMaterial();
    if (!material) {
      this.state.error = new Error('Belum ada materi di jenjangmu. Buka Quest untuk melihat katalog.');
      this.store.touch();
      return false;
    }

    this.state.messages.push({ role: 'user', text: displayText || message });
    this.state.draft = '';
    this.state.isLoading = true;
    this.state.error = null;
    this.store.touch();

    try {
      const response = await this.api.askTutor(material.id, message);
      const answer = typeof response?.answer === 'string' ? response.answer.trim() : '';

      if (answer) {
        this.state.messages.push({
          role: 'assistant',
          text: answer,
          suggestions: Array.isArray(response.suggestions) ? response.suggestions : [],
          degraded: Boolean(response.degraded),
          provider: response.provider || ''
        });
      } else {
        this.pushFallback(material, 'AI Tutor belum mengirim jawaban. Coba lagi atau baca materi secara langsung.');
      }
    } catch (error) {
      this.state.error = error;
      this.pushFallback(material, error?.message || 'Layanan AI Tutor sedang tidak tersedia.');
    } finally {
      this.state.isLoading = false;
      this.store.touch();
    }

    return true;
  }

  pushFallback(material, reason) {
    this.state.messages.push({
      role: 'assistant',
      text: [
        `Maaf, AI Tutor belum bisa menjawab pertanyaan itu (${reason}).`,
        '',
        `Kamu tetap bisa mempelajari "${material.title}" dari mapel ${material.subject} melalui halaman materi.`,
        'Baca ringkasan materi, lalu coba mulai kuis untuk menguji pemahamanmu.'
      ].join('\n'),
      suggestions: [],
      degraded: true
    });
  }

  reset() {
    this.state.messages = [];
    this.state.draft = '';
    this.state.isLoading = false;
    this.state.error = null;
    this.store.touch();
  }
}
