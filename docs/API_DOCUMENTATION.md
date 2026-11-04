# 📖 Dokumentasi Lengkap API EduQuest

> **Panduan Integrasi untuk Frontend Developer (Raffa & Raffi)**  
> **Base URL:** `http://127.0.0.1:8000/api/`  
> **Format Request & Response:** JSON (`Content-Type: application/json`)  
> **Autentikasi:** Token Authentication (`Authorization: Token <token>`)

---

## 📑 Daftar Isi
1. [Autentikasi & Akun](#1-autentikasi--profil-siswa)
2. [Jenjang, Kelas, & Mata Pelajaran](#2-jenjang-kelas--mata-pelajaran)
3. [Materi Pembelajaran](#3-materi-pembelajaran)
4. [Sistem Kuis & Gamifikasi](#4-sistem-kuis--latihan-adaptif)
5. [AI Tutor](#5-ai-tutor)
6. [Contoh Kode Integrasi Frontend (JavaScript)](#6-helper-javascript-untuk-frontend)

---

## 1. Autentikasi & Profil Siswa

### 🔹 Registrasi Akun Baru
- **Endpoint:** `POST /api/auth/register/`
- **Akses:** Publik (tanpa token)
- **Request Body:**
```json
{
  "username": "budi_santoso",
  "password": "Password123!",
  "password_confirm": "Password123!",
  "education_level": "SD",
  "kelas": 4,
  "email": "budi@example.com",
  "first_name": "Budi"
}
```
> *Catatan:* `education_level` bisa berupa kode (`"SD"`, `"SMP"`, `"SMA"`) atau ID angka. `kelas` harus sesuai dengan jenjang (SD: 1-6, SMP: 7-9, SMA: 10-12).

- **Response Success (201 Created):**
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": 1,
    "username": "budi_santoso",
    "email": "budi@example.com",
    "first_name": "Budi",
    "date_joined": "2026-11-04T08:00:00Z",
    "education_level": { "id": 1, "code": "SD", "name": "SD" },
    "kelas": 4
  }
}
```

---

### 🔹 Login
- **Endpoint:** `POST /api/auth/login/`
- **Request Body:**
```json
{
  "username": "budi_santoso",
  "password": "Password123!"
}
```
- **Response Success (200 OK):**
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": 1,
    "username": "budi_santoso",
    "email": "budi@example.com",
    "first_name": "Budi",
    "education_level": { "id": 1, "code": "SD", "name": "SD" },
    "kelas": 4
  }
}
```

---

### 🔹 Profil Siswa Saat Ini
- **Endpoint:** `GET /api/auth/me/`
- **Header:** `Authorization: Token <token>`
- **Response (200 OK):**
```json
{
  "id": 1,
  "username": "budi_santoso",
  "email": "budi@example.com",
  "first_name": "Budi",
  "education_level": { "id": 1, "code": "SD", "name": "SD" },
  "kelas": 4
}
```

---

### 🔹 Update Kelas / Profil
- **Endpoint:** `PATCH /api/auth/me/`
- **Header:** `Authorization: Token <token>`
- **Request Body:**
```json
{
  "first_name": "Budi Santoso",
  "education_level": "SMA",
  "kelas": 11
}
```

---

## 2. Jenjang, Kelas, & Mata Pelajaran

### 🔹 Daftar Jenjang & Pilihan Kelas
- **Endpoint:** `GET /api/levels/`
- **Akses:** Publik
- **Response (200 OK):**
```json
[
  {
    "id": 1,
    "code": "SD",
    "name": "SD",
    "order": 1,
    "subject_count": 1,
    "kelas_options": [1, 2, 3, 4, 5, 6]
  },
  {
    "id": 2,
    "code": "SMP",
    "name": "SMP",
    "order": 2,
    "subject_count": 1,
    "kelas_options": [7, 8, 9]
  },
  {
    "id": 3,
    "code": "SMA",
    "name": "SMA/SMK",
    "order": 3,
    "subject_count": 1,
    "kelas_options": [10, 11, 12]
  }
]
```

---

### 🔹 Daftar Mata Pelajaran & Sisa Nyawa
- **Endpoint:** `GET /api/subjects/?level=SD&kelas=4`
- **Header:** `Authorization: Token <token>`
- **Query Params:** `level` (opsional), `kelas` (opsional: 1-12)
- **Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "IPA",
    "slug": "ipa-sd",
    "icon": "🔬",
    "level": "SD",
    "level_name": "SD",
    "material_count": 3,
    "lives": 3,
    "max_lives": 3,
    "next_life_at": null,
    "seconds_to_next_life": null
  }
]
```
> *Catatan Nyawa:* Setiap mapel punya 3 nyawa. Jika berkurang, 1 nyawa pulih otomatis setiap 1 jam (3600 detik). `seconds_to_next_life` berisi hitungan mundur (detik).

---

## 3. Materi Pembelajaran

### 🔹 Daftar Materi
- **Endpoint:** `GET /api/materials/?level=SMA&kelas=11`
- **Header:** `Authorization: Token <token>`
- **Query Params:**
  - `level`: `"SD"` / `"SMP"` / `"SMA"`
  - `kelas`: `1` - `12`
  - `subject`: ID angka mata pelajaran
  - `search`: kata pencarian (judul/topik)
- **Response (200 OK):**
```json
[
  {
    "id": 10,
    "title": "Sistem Gerak dan Pernapasan Manusia",
    "slug": "sistem-gerak-dan-pernapasan-manusia",
    "kelas": 11,
    "topic": "Sistem Gerak dan Pernapasan Manusia",
    "topic_code": "SMA-BIO-09",
    "summary": "Materi sistem gerak dan pernapasan manusia...",
    "estimated_minutes": 10,
    "order": 9,
    "status": "published",
    "subject": {
      "id": 4,
      "name": "Biologi",
      "level": "SMA",
      "level_name": "SMA/SMK"
    },
    "completed": false
  }
]
```

---

### 🔹 Detail Materi (Isi Lengkap)
- **Endpoint:** `GET /api/materials/<id>/`
- **Header:** `Authorization: Token <token>`
- **Response (200 OK):**
```json
{
  "id": 10,
  "title": "Sistem Gerak dan Pernapasan Manusia",
  "content": "# Sistem Gerak dan Pernapasan Manusia\n\nIsi materi markdown...",
  "content_html": "<h1>Sistem Gerak dan Pernapasan Manusia</h1><p>...</p>",
  "summary": "...",
  "kelas": 11,
  "completed": false
}
```

---

### 🔹 Tandai Materi Selesai
- **Endpoint:** `POST /api/materials/<id>/complete/`
- **Header:** `Authorization: Token <token>`
- **Response (200 OK):**
```json
{
  "completed": true,
  "xp_gained": 15,
  "already_completed": false
}
```

---

## 4. Sistem Kuis & Latihan Adaptif

### 🔹 Mulai Sesi Kuis (5 Soal)
- **Endpoint:** `POST /api/quizzes/`
- **Header:** `Authorization: Token <token>`
- **Request Body:**
```json
{
  "material_id": 10,
  "difficulty": 1
}
```
*(Parameter `difficulty` opsional: 1=Dasar, 2=Menengah, 3=Lanjut).*

- **Response (201 Created):**
```json
{
  "attempt": {
    "id": 42,
    "status": "in_progress",
    "target_difficulty": 1,
    "total_questions": 5,
    "questions": [
      {
        "id": 101,
        "order": 1,
        "difficulty": 1,
        "question_text": "Nutrien yang sangat penting dalam pembentukan tulang adalah....",
        "options": [
          { "key": "A", "text": "karbohidrat dan lemak" },
          { "key": "B", "text": "kalsium dan vitamin D" },
          { "key": "C", "text": "protein dan vitamin C" },
          { "key": "D", "text": "besi dan vitamin A" }
        ],
        "is_resolved": false,
        "attempts": 0
      }
    ]
  },
  "lives": 3,
  "max_lives": 3,
  "rank": { "name": "Silver", "icon": "🥈" },
  "unlocked_difficulty": 2
}
```

---

### 🔹 Menjawab Soal Kuis
- **Endpoint:** `POST /api/quizzes/<attempt_id>/answer/`
- **Header:** `Authorization: Token <token>`
- **Request Body:**
```json
{
  "question_id": 101,
  "option": "B"
}
```

#### Skenario 1: Jawaban Benar
```json
{
  "correct": true,
  "retry": false,
  "lives": 3,
  "xp_gained": 10,
  "session_ended": false,
  "next_question": {
    "id": 102,
    "order": 2,
    "question_text": "Soal berikutnya...",
    "options": [...]
  }
}
```

#### Skenario 2: Jawaban Salah (Nyawa Masih Ada)
```json
{
  "correct": false,
  "retry": true,
  "lives": 2,
  "session_ended": false,
  "next_question": {
    "id": 101,
    "order": 1,
    "attempts": 1,
    "question_text": "Nutrien yang sangat penting dalam pembentukan tulang adalah....",
    "options": [...]
  }
}
```
> *Perhatikan:* Soal tetap sama, `retry: true`, dan **TIDAK ADA HINT** selama nyawa masih ada. Siswa diberi kesempatan menjawab lagi.

#### Skenario 3: Jawaban Salah & Nyawa Habis (Sesi Selesai Lebih Awal)
```json
{
  "correct": false,
  "retry": false,
  "lives": 0,
  "session_ended": true,
  "summary": {
    "score": {
      "total": 5,
      "correct": 1,
      "wrong": 1,
      "unanswered": 3,
      "percent": 20.0
    },
    "reward": {
      "xp_gained": 10,
      "lives": 0,
      "ended_early": true
    },
    "answers": [
      {
        "question_id": 101,
        "selected_option": "B",
        "correct_option": "B",
        "is_correct": true,
        "attempts": 1,
        "explanation": "Jawaban benar: B. kalsium dan vitamin D",
        "hint": ""
      },
      {
        "question_id": 102,
        "selected_option": "A",
        "correct_option": "B",
        "is_correct": false,
        "attempts": 1,
        "explanation": "Jawaban benar: B. Otot antartulang rusuk",
        "hint": "Halo! Fokuslah pada jenis respirasi dada, yang mekanisme utamanya digerakkan oleh otot di sela tulang rusuk..."
      }
    ]
  }
}
```
> *Perhatikan:* Saat nyawa habis, seluruh kunci jawaban, penjelasan, dan **Hint AI spesifik** untuk soal yang pernah salah otomatis muncul di `summary.answers`.

---

## 5. AI Tutor

### 🔹 Tanya AI Tutor Seputar Materi
- **Endpoint:** `POST /api/tutor/ask/`
- **Header:** `Authorization: Token <token>`
- **Request Body:**
```json
{
  "material_id": 10,
  "question": "Mengapa saat berolahraga napas kita menjadi lebih cepat?"
}
```
- **Response Success (200 OK):**
```json
{
  "available": true,
  "degraded": false,
  "provider": "gemini",
  "answer": "Saat berolahraga, otot-otot tubuh bekerja lebih keras dan membutuhkan banyak energi serta oksigen. Oleh karena itu, paru-paru dan jantung bekerja lebih cepat untuk memompa oksigen ke seluruh tubuh!",
  "material_id": 10
}
```

---

## 6. Helper JavaScript untuk Frontend

Frontend developer dapat menyalin file JavaScript bantuan ini untuk mempermudah pemanggilan API:

```javascript
// static/js/api.js

const API_BASE = 'http://127.0.0.1:8000/api';

class EduQuestAPI {
  static getToken() {
    return localStorage.getItem('eduquest_token');
  }

  static setToken(token) {
    localStorage.setItem('eduquest_token', token);
  }

  static removeToken() {
    localStorage.removeItem('eduquest_token');
  }

  static async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw { status: response.status, data };
    }

    return data;
  }

  // Auth
  static login(username, password) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  static register(userData) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static getProfile() {
    return this.request('/auth/me/');
  }

  // Levels & Subjects
  static getLevels() {
    return this.request('/levels/');
  }

  static getSubjects(level, kelas) {
    let query = '';
    if (level && kelas) query = `?level=${level}&kelas=${kelas}`;
    else if (level) query = `?level=${level}`;
    return this.request(`/subjects/${query}`);
  }

  // Materials
  static getMaterials(level, kelas, subjectId) {
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (kelas) params.append('kelas', kelas);
    if (subjectId) params.append('subject', subjectId);
    return this.request(`/materials/?${params.toString()}`);
  }

  static getMaterialDetail(id) {
    return this.request(`/materials/${id}/`);
  }

  static completeMaterial(id) {
    return this.request(`/materials/${id}/complete/`, { method: 'POST' });
  }

  // Quizzes
  static startQuiz(materialId, difficulty = 1) {
    return this.request('/quizzes/', {
      method: 'POST',
      body: JSON.stringify({ material_id: materialId, difficulty }),
    });
  }

  static answerQuestion(attemptId, questionId, option) {
    return this.request(`/quizzes/${attemptId}/answer/`, {
      method: 'POST',
      body: JSON.stringify({ question_id: questionId, option }),
    });
  }

  // AI Tutor
  static askTutor(materialId, question) {
    return this.request('/tutor/ask/', {
      method: 'POST',
      body: JSON.stringify({ material_id: materialId, question }),
    });
  }
}
```

