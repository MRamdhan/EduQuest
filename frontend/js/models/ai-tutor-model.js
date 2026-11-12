/**
 * AiTutorModel — topik, riwayat percakapan, dan balasan bertahap.
 */
import { AI_TUTOR_TOPICS } from '../config/curriculum.js';

export class AiTutorModel {
  constructor({ store, api, quest } = {}) {
    this.store = store;
    this.api = api;
    this.quest = quest;
  }

  get state() {
    return this.store.state.aiTutor;
  }

  get topic() {
    return AI_TUTOR_TOPICS[this.state.subject] || AI_TUTOR_TOPICS['IPS'];
  }

  get subjects() {
    return Object.keys(AI_TUTOR_TOPICS);
  }

  selectSubject(subject) {
    this.state.subject = subject;
    this.state.messages = [];
    this.state.isLoading = false;
    this.store.touch();
  }

  setDraft(value) {
    this.state.draft = value;
  }

  askStarter(index) {
    const starter = this.topic.starters[index];
    if (!starter) return false;

    this.state.messages.push({ role: 'user', text: starter.prompt });
    this.state.messages.push({ role: 'assistant', steps: starter.replySteps });
    this.store.touch();
    return true;
  }

  async send(text) {
    const message = (text ?? this.state.draft).trim();
    if (!message) return false;

    this.state.messages.push({ role: 'user', text: message });
    this.state.draft = '';
    this.state.isLoading = true;
    this.store.touch();

    try {
      if (this.store.state.isLoggedIn && this.api && typeof this.api.askTutor === 'function') {
        const materialId = this.quest ? this.quest.resolveBackendMaterialId(1) : 4;
        const res = await this.api.askTutor(materialId, message);
        let steps = null;
        if (Array.isArray(res?.steps) && res.steps.length > 0) {
          steps = res.steps;
        } else if (typeof res?.answer === 'string' && res.answer.trim()) {
          steps = res.answer.split('\n').map(s => s.trim()).filter(Boolean);
        } else if (typeof res?.reply === 'string' && res.reply.trim()) {
          steps = res.reply.split('\n').map(s => s.trim()).filter(Boolean);
        }

        if (steps && steps.length > 0) {
          this.state.messages.push({ role: 'assistant', steps });
          return true;
        }
      }
    } catch (error) {
      console.warn('AI Tutor API request failed, using offline pedagogical fallback:', error);
    } finally {
      this.state.isLoading = false;
      this.store.touch();
    }

    // Fallback socratic answer
    this.state.messages.push({
      role: 'assistant',
      steps: [
        `1. Pertanyaan bagus tentang ${this.topic.sub}! Mari kita telaah konsep dasarnya terlebih dahulu.`,
        '2. Perhatikan ciri utama atau kegiatan yang terjadi pada objek yang kamu tanyakan.',
        '3. Berdasarkan ciri tersebut, kesimpulan awal apa yang terpikirkan olehmu?'
      ]
    });
    this.store.touch();
    return true;
  }

  reset() {
    this.state.messages = [];
    this.state.draft = '';
    this.state.isLoading = false;
    this.store.touch();
  }
}
