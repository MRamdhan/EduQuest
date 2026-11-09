/**
 * EduQuest API Client
 * Library JavaScript untuk mempermudah komunikasi Frontend dengan Django REST API.
 * Mendukung autentikasi Token, otomatis menyimpan token di localStorage.
 */

const API_BASE_URL = window.EDUQUEST_API_URL || 'http://127.0.0.1:8000/api';

// Masa berlaku token: 1 jam sejak login/registrasi.
const TOKEN_TTL_MS = Number(window.EDUQUEST_TOKEN_TTL_MS) > 0
    ? Number(window.EDUQUEST_TOKEN_TTL_MS)
    : 60 * 60 * 1000;

const TOKEN_KEY = 'eduquest_token';
const TOKEN_EXPIRES_KEY = 'eduquest_token_expires_at';
const USER_KEY = 'eduquest_user';

class EduQuestAPI {
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
            token = localStorage.getItem(TOKEN_KEY);
            expiresAt = Number(localStorage.getItem(TOKEN_EXPIRES_KEY) || 0);
        } catch (e) {
            token = window._memToken || null;
            expiresAt = Number(window._memExpiresAt || 0);
        }

        if (!token) return null;

        // Token lama tanpa waktu kedaluwarsa atau sudah lebih dari 1 jam
        // dianggap kedaluwarsa dan langsung dibersihkan.
        if (!expiresAt || Date.now() >= expiresAt) {
            this.logoutLocal();
            return null;
        }
        return token;
    }

    static getTokenExpiresAt() {
        try {
            return Number(localStorage.getItem(TOKEN_EXPIRES_KEY) || 0) || null;
        } catch (e) {
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
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(TOKEN_EXPIRES_KEY, String(expiresAt));
        } catch (e) {
            window._memToken = token;
            window._memExpiresAt = expiresAt;
        }
    }

    static getUser() {
        let u = null; try { u = localStorage.getItem(USER_KEY); } catch (e) { u = window._memUser || null; }
        return u ? JSON.parse(u) : null;
    }

    static setUser(user) {
        try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch (e) { window._memUser = JSON.stringify(user); }
    }

    static logoutLocal() {
        try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(TOKEN_EXPIRES_KEY);
            localStorage.removeItem(USER_KEY);
        } catch (e) {
            // Falls through ke penyimpanan memori di bawah.
        }
        window._memToken = null;
        window._memExpiresAt = 0;
        window._memUser = null;
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Helper request internal dengan handling JSON dan Token Authorization
     */
    static async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }

        const url = `${API_BASE_URL}${endpoint}`;
        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // 204 No Content
            if (response.status === 204) {
                return null;
            }

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const error = new Error(data.detail || data.message || 'Terjadi kesalahan pada server');
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (err) {
            if (err.status) {
                throw err;
            }
            // Error koneksi / jaringan (CORS / server mati)
            const connErr = new Error('Gagal terhubung ke backend server. Pastikan Django backend berjalan di ' + API_BASE_URL);
            connErr.status = 0;
            connErr.originalError = err;
            throw connErr;
        }
    }

    // ==========================================
    // 1. AUTENTIKASI
    // ==========================================

    /**
     * Register user baru
     * @param {Object} payload { username, email, password, password_confirm, first_name, education_level, kelas }
     */
    static async register(payload) {
        const data = await this.request('/auth/register/', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        if (data.token) {
            this.setToken(data.token);
            if (data.user) this.setUser(data.user);
        }
        return data;
    }

    /**
     * Login user
     * @param {string} username
     * @param {string} password
     */
    static async login(username, password) {
        const data = await this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        if (data.token) {
            this.setToken(data.token);
            if (data.user) this.setUser(data.user);
        }
        return data;
    }

    /**
     * Logout user: hapus token lokal segera, lalu minta backend menghapus token.
     * Token disimpan dulu karena setelah logoutLocal() token tidak bisa dibaca.
     */
    static async logout() {
        const token = this.getToken();
        this.logoutLocal();
        if (!token) return;

        try {
            await fetch(`${API_BASE_URL}/auth/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });
        } catch (e) {
            // Token lokal sudah dihapus; kegagalan jaringan tidak menghalangi logout.
        }
    }

    /**
     * Ambil data profil user yang sedang login
     */
    static async getProfile() {
        const user = await this.request('/auth/me/');
        this.setUser(user);
        return user;
    }

    // ==========================================
    // 2. KONTEN (JENJANG, MAPEL, MATERI)
    // ==========================================

    /**
     * Ambil daftar jenjang pendidikan (SD, SMP, SMA)
     */
    static getLevels() {
        return this.request('/levels/');
    }

    /**
     * Ambil daftar mata pelajaran (bisa difilter level='SD' & kelas=4)
     */
    static getSubjects(level = null, kelas = null) {
        const params = new URLSearchParams();
        if (level) params.append('level', level);
        if (kelas) params.append('kelas', kelas);
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request(`/subjects/${query}`);
    }

    /**
     * Ambil daftar materi pembelajaran
     */
    static getMaterials(params = {}) {
        const q = new URLSearchParams();
        if (params.level) q.append('level', params.level);
        if (params.kelas) q.append('kelas', params.kelas);
        if (params.subject) q.append('subject', params.subject);
        const queryString = q.toString() ? `?${q.toString()}` : '';
        return this.request(`/materials/${queryString}`);
    }

    /**
     * Ambil detail materi pembelajaran berdasarkan ID (lengkap dengan body & gambar)
     */
    static getMaterialDetail(id) {
        return this.request(`/materials/${id}/`);
    }

    /**
     * Tandai materi selesai dibaca (+10 XP)
     */
    static completeMaterial(id) {
        return this.request(`/materials/${id}/complete/`, { method: 'POST' });
    }

    // ==========================================
    // 3. KUIS ADAPTIF & NYAWA
    // ==========================================

    /**
     * Mulai sesi kuis adaptif baru
     * @param {number} materialId
     * @param {number} difficulty 1=Mudah, 2=Sedang, 3=Sulit
     */
    static startQuiz(materialId, difficulty = 1) {
        return this.request('/quizzes/', {
            method: 'POST',
            body: JSON.stringify({ material_id: materialId, difficulty }),
        });
    }

    /**
     * Jawab salah satu pertanyaan pada sesi kuis
     * @param {number} attemptId
     * @param {number} questionId
     * @param {string} option 'A' | 'B' | 'C' | 'D'
     */
    static answerQuestion(attemptId, questionId, option) {
        return this.request(`/quizzes/${attemptId}/answer/`, {
            method: 'POST',
            body: JSON.stringify({ question_id: questionId, option }),
        });
    }

    /**
     * Ambil riwayat sesi kuis yang pernah dikerjakan murid
     */
    static getQuizHistory() {
        return this.request('/quizzes/history/');
    }

    /**
     * Ambil riwayat / detail sesi kuis yang telah selesai (lengkap dengan review & hint)
     * @param {number} attemptId
     */
    static getQuizDetail(attemptId) {
        return this.request(`/quizzes/${attemptId}/`);
    }

    // ==========================================
    // 4. AI TUTOR (SOCRATIC LEARNING)
    // ==========================================

    /**
     * Kirim pertanyaan murid ke AI Tutor
     * AI merespons secara ramah dan sokratik sesuai konteks materi
     * @param {number} materialId
     * @param {string} question
     */
    static askTutor(materialId, question) {
        return this.request('/tutor/ask/', {
            method: 'POST',
            body: JSON.stringify({ material_id: materialId, question }),
        });
    }

    /**
     * Dapatkan rekomendasi belajar personal dari AI Tutor
     */
    static getAIRecommendations() {
        return this.request('/tutor/recommendations/');
    }

    // ==========================================
    // 5. PROGRES, NYAWA & STATISTIK
    // ==========================================

    /**
     * Ambil ringkasan progres user (total XP, level, rank, subject_lives)
     */
    static getProgress() {
        return this.request('/progress/');
    }

    /**
     * Ambil statistik belajar analitis (akurasi, kelulusan, performa per mapel)
     */
    static getLearningStats() {
        return this.request('/progress/stats/');
    }

    /**
     * Helper praktis untuk mengambil status nyawa per mata pelajaran
     * Mengambil data dari endpoint resmi /progress/
     * @param {number|null} subjectId
     */
    static async getSubjectLives(subjectId = null) {
        const progress = await this.getProgress();
        if (!progress || !progress.subject_lives) return [];
        if (subjectId !== null) {
            return progress.subject_lives.find(s => s.subject_id === subjectId) || null;
        }
        return progress.subject_lives;
    }
}

// Export untuk module bundler (Vite, Webpack) & Fallback ke Window global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EduQuestAPI;
} else {
    window.EduQuestAPI = EduQuestAPI;
}

