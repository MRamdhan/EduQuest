/**
 * EduQuest API Client
 * Library JavaScript untuk mempermudah komunikasi Frontend dengan Django REST API.
 * Mendukung autentikasi Token, otomatis menyimpan token di localStorage.
 */

const API_BASE_URL = window.EDUQUEST_API_URL || 'http://127.0.0.1:8000/api';

class EduQuestAPI {
    static get baseUrl() {
        return API_BASE_URL;
    }

    static getToken() {
        return localStorage.getItem('eduquest_token');
    }

    static setToken(token) {
        localStorage.setItem('eduquest_token', token);
    }

    static getUser() {
        const u = localStorage.getItem('eduquest_user');
        return u ? JSON.parse(u) : null;
    }

    static setUser(user) {
        localStorage.setItem('eduquest_user', JSON.stringify(user));
    }

    static logoutLocal() {
        localStorage.removeItem('eduquest_token');
        localStorage.removeItem('eduquest_user');
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
     * @param {Object} payload { username, email, password, full_name, role, grade_level, kelas }
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
     * Logout user & hapus token dari localStorage
     */
    static async logout() {
        try {
            await this.request('/auth/logout/', { method: 'POST' });
        } finally {
            this.logoutLocal();
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

    // ==========================================
    // 5. PROGRES, NYAWA & LEADERBOARD
    // ==========================================

    /**
     * Ambil ringkasan progres user (total XP, level, rank, streak)
     */
    static getProgress() {
        return this.request('/progress/');
    }

    /**
     * Ambil status nyawa user saat ini & waktu regenerasi nyawa berikutnya (1 nyawa per jam)
     */
    static getUserLives() {
        return this.request('/progress/lives/');
    }

    /**
     * Ambil papan peringkat (Leaderboard) global
     */
    static getGlobalLeaderboard() {
        return this.request('/leaderboard/');
    }

    /**
     * Ambil papan peringkat berdasarkan mata pelajaran
     * @param {number} subjectId
     */
    static getSubjectLeaderboard(subjectId) {
        return this.request(`/leaderboard/?subject_id=${subjectId}`);
    }
}

// Export untuk module bundler (Vite, Webpack) & Fallback ke Window global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EduQuestAPI;
} else {
    window.EduQuestAPI = EduQuestAPI;
}

