/**
 * ApiClient — satu-satunya lapisan yang berbicara dengan Django REST API.
 * Tidak boleh menyentuh DOM.
 */
import { API_BASE_URL, STORAGE_KEYS, TOKEN_TTL_MS } from '../config/constants.js';

export class ApiClient {
  static get baseUrl() {
    return API_BASE_URL;
  }

  static get tokenTtlMs() {
    return TOKEN_TTL_MS;
  }

  static getToken() {
    let token = null;
    let expiresAt = 0;
    try {
      token = localStorage.getItem(STORAGE_KEYS.token);
      expiresAt = Number(localStorage.getItem(STORAGE_KEYS.tokenExpiresAt) || 0);
    } catch (error) {
      token = window._memToken || null;
      expiresAt = Number(window._memExpiresAt || 0);
    }

    if (!token) return null;

    if (!expiresAt || Date.now() >= expiresAt) {
      this.logoutLocal();
      return null;
    }
    return token;
  }

  static getTokenExpiresAt() {
    try {
      return Number(localStorage.getItem(STORAGE_KEYS.tokenExpiresAt) || 0) || null;
    } catch (error) {
      return Number(window._memExpiresAt || 0) || null;
    }
  }

  static getTokenRemainingMs() {
    const expiresAt = this.getTokenExpiresAt();
    if (!expiresAt) return 0;
    return Math.max(0, expiresAt - Date.now());
  }

  static setToken(token, ttlMs = TOKEN_TTL_MS) {
    const expiresAt = Date.now() + ttlMs;
    try {
      localStorage.setItem(STORAGE_KEYS.token, token);
      localStorage.setItem(STORAGE_KEYS.tokenExpiresAt, String(expiresAt));
    } catch (error) {
      window._memToken = token;
      window._memExpiresAt = expiresAt;
    }
  }

  static getUser() {
    let user = null;
    try {
      user = localStorage.getItem(STORAGE_KEYS.user);
    } catch (error) {
      user = window._memUser || null;
    }
    return user ? JSON.parse(user) : null;
  }

  static setUser(user) {
    try {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } catch (error) {
      window._memUser = JSON.stringify(user);
    }
  }

  static logoutLocal() {
    try {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.tokenExpiresAt);
      localStorage.removeItem(STORAGE_KEYS.user);
    } catch (error) {
      // Lanjut membersihkan penyimpanan memori di bawah.
    }
    window._memToken = null;
    window._memExpiresAt = 0;
    window._memUser = null;
  }

  static isAuthenticated() {
    return Boolean(this.getToken());
  }

  static async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token) headers.Authorization = `Token ${token}`;

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

      if (response.status === 204) return null;

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.detail || data.message || 'Terjadi kesalahan pada server');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      if (error.status) throw error;

      const connectionError = new Error(
        `Gagal terhubung ke backend server. Pastikan Django backend berjalan di ${API_BASE_URL}`
      );
      connectionError.status = 0;
      connectionError.originalError = error;
      throw connectionError;
    }
  }

  // ==========================================
  // Autentikasi
  // ==========================================

  static async register(payload) {
    const data = await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (data.token) {
      this.setToken(data.token);
      if (data.user) this.setUser(data.user);
    }
    return data;
  }

  static async login(username, password) {
    const data = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data.token) {
      this.setToken(data.token);
      if (data.user) this.setUser(data.user);
    }
    return data;
  }

  static async logout() {
    const token = this.getToken();
    this.logoutLocal();
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        }
      });
    } catch (error) {
      // Token lokal sudah dihapus; kegagalan jaringan tidak menghalangi logout.
    }
  }

  static getProfile() {
    return this.request('/auth/me/').then(user => {
      this.setUser(user);
      return user;
    });
  }

  static updateProfile(payload) {
    return this.request('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }).then(user => {
      this.setUser(user);
      return user;
    });
  }

  // ==========================================
  // Konten
  // ==========================================

  static getLevels() {
    return this.request('/levels/');
  }

  static getSubjects(level = null, kelas = null) {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (kelas) params.append('kelas', kelas);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/subjects/${query}`);
  }

  static getMaterials({ level, kelas, subject } = {}) {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (kelas) params.append('kelas', kelas);
    if (subject) params.append('subject', subject);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/materials/${query}`);
  }

  static getMaterialDetail(id) {
    return this.request(`/materials/${id}/`);
  }

  static completeMaterial(id) {
    return this.request(`/materials/${id}/complete/`, { method: 'POST' });
  }

  // ==========================================
  // Kuis
  // ==========================================

  static startQuiz(materialId, difficulty = null) {
    const payload = { material_id: materialId };
    if (difficulty !== null && difficulty !== undefined && difficulty !== '') {
      payload.difficulty = Number(difficulty);
    }
    return this.request('/quizzes/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  static answerQuestion(attemptId, questionId, option) {
    return this.request(`/quizzes/${attemptId}/answer/`, {
      method: 'POST',
      body: JSON.stringify({ question_id: questionId, option })
    });
  }

  static getQuizHistory() {
    return this.request('/quizzes/history/');
  }

  static getQuizDetail(attemptId) {
    return this.request(`/quizzes/${attemptId}/`);
  }

  // ==========================================
  // AI Tutor
  // ==========================================

  static askTutor(materialId, question) {
    return this.request('/tutor/ask/', {
      method: 'POST',
      body: JSON.stringify({ material_id: materialId, question })
    });
  }

  static getAIRecommendations() {
    return this.request('/tutor/recommendations/');
  }

  // ==========================================
  // Progres
  // ==========================================

  static getProgress() {
    return this.request('/progress/');
  }

  static getLearningStats() {
    return this.request('/progress/stats/');
  }

  static getRanks() {
    return this.request('/ranks/');
  }

  static async getSubjectLives(subjectId = null) {
    const progress = await this.getProgress();
    if (!progress || !progress.subject_lives) return [];
    if (subjectId !== null) {
      return progress.subject_lives.find(item => item.subject_id === subjectId) || null;
    }
    return progress.subject_lives;
  }
}
