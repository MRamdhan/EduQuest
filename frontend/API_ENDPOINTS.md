# 📡 Dokumentasi Endpoint REST API EduQuest untuk Frontend Developer

Dokumentasi ini dibuat khusus untuk mempermudah developer Frontend (**Raffa & Raffi**) dalam menghubungkan antarmuka web dengan Backend Django REST Framework EduQuest.

---

## ⚙️ Base URL & Header

- **Base URL API**: `http://127.0.0.1:8000/api`
- **Default Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```
- **Header Autentikasi** (untuk endpoint yang memerlukan login):
  ```http
  Authorization: Token <access_token>
  ```
  *(Catatan: Token didapatkan saat response login / register berhasil).*
- **Masa berlaku token di frontend**: **1 jam** sejak login/register. Token disimpan di `localStorage` beserta waktu kedaluwarsanya. Selama token masih berlaku, refresh halaman langsung membuka dashboard. Setelah 1 jam, token dihapus dan pengguna harus login ulang. Logout juga menghapus token lokal dan meminta backend menghapus token tersebut.*

---

## 1. 🔐 Autentikasi (`/auth/`)

### A. Register Akun Baru
- **Endpoint**: `POST /api/auth/register/`
- **Public**: Ya
- **Request Body**:
  ```json
  {
    "username": "budi_santoso",
    "email": "budi@example.com",
    "first_name": "Budi Santoso",
    "education_level": "SMP",
    "kelas": 8,
    "password": "PasswordRahasia123!",
    "password_confirm": "PasswordRahasia123!"
  }
  ```
- **Catatan**:
  - `username` wajib dan unik (dipakai untuk login).
  - `education_level` menerima kode `SD` / `SMP` / `SMA` (atau id jenjang). Untuk pilihan UI "SMA/SMK", kirim `SMA`.
  - `kelas` harus sesuai jenjang: SD 1–6, SMP 7–9, SMA 10–12.
  - Kata sandi minimal 8 karakter dan tidak boleh terlalu umum/mirip data akun.
- **Response `201 Created`**:
  ```json
  {
    "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
    "user": {
      "id": 12,
      "username": "budi_santoso",
      "email": "budi@example.com",
      "first_name": "Budi Santoso",
      "date_joined": "2026-11-08T10:00:00+07:00",
      "education_level": {"id": 2, "code": "SMP", "name": "SMP"},
      "kelas": 8
    }
  }
  ```

### B. Login
- **Endpoint**: `POST /api/auth/login/`
- **Public**: Ya
- **Request Body**:
  ```json
  {
    "username": "budi_santoso",
    "password": "PasswordRahasia123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
    "user": {
      "id": 12,
      "username": "budi_santoso",
      "email": "budi@example.com",
      "first_name": "Budi Santoso",
      "date_joined": "2026-11-08T10:00:00+07:00",
      "education_level": {"id": 2, "code": "SMP", "name": "SMP"},
      "kelas": 8
    }
  }
  ```

### C. Logout
- **Endpoint**: `POST /api/auth/logout/`
- **Auth**: Wajib
- **Response `200 OK`**:
  ```json
  {
    "detail": "Logout berhasil."
  }
  ```

### D. Ambil Profil & Progres Saya
- **Endpoint**: `GET /api/auth/me/`
- **Auth**: Wajib
- **Response `200 OK`**:
  ```json
  {
    "id": 12,
    "username": "budi_santoso",
    "email": "budi@example.com",
    "full_name": "Budi Santoso",
    "role": "student",
    "grade_level": "SD",
    "kelas": 4,
    "progress": {
      "total_xp": 250,
      "level": 3,
      "rank": "Silver",
      "current_streak": 2,
      "longest_streak": 5
    }
  }
  ```

---

## 2. 📚 Konten Pembelajaran

### A. Daftar Jenjang Pendidikan
- **Endpoint**: `GET /api/levels/`
- **Public**: Ya
- **Response `200 OK`**:
  ```json
  [
    {"code": "SD", "name": "Sekolah Dasar", "grades": [1, 2, 3, 4, 5, 6]},
    {"code": "SMP", "name": "Sekolah Menengah Pertama", "grades": [7, 8, 9]},
    {"code": "SMA", "name": "Sekolah Menengah Atas", "grades": [10, 11, 12]}
  ]
  ```

### B. Daftar Mata Pelajaran
- **Endpoint**: `GET /api/subjects/?level=SD&kelas=4`
- **Query Params (opsional)**:
  - `level`: `SD` | `SMP` | `SMA`
  - `kelas`: angka integer (1 - 12)
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "name": "Ilmu Pengetahuan Alam dan Sosial (IPAS)",
      "slug": "ipas-sd-4",
      "level": "SD",
      "kelas": 4,
      "icon": "leaf"
    }
  ]
  ```

### C. Daftar Materi
- **Endpoint**: `GET /api/materials/?level=SD&kelas=4&subject=1`
- **Public**: Ya
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 1,
      "title": "Tumbuhan, Sumber Kehidupan di Bumi",
      "slug": "tumbuhan-sumber-kehidupan",
      "subject": 1,
      "subject_name": "IPAS",
      "grade_level": "SD",
      "kelas": 4,
      "estimated_read_minutes": 5,
      "xp_reward": 10
    }
  ]
  ```

### D. Detail Materi Lengkap
- **Endpoint**: `GET /api/materials/{id}/`
- **Public**: Ya
- **Response `200 OK`**:
  ```json
  {
    "id": 1,
    "title": "Tumbuhan, Sumber Kehidupan di Bumi",
    "content": "Isi lengkap bacaan materi dengan teks atau format markdown...",
    "subject": 1,
    "grade_level": "SD",
    "kelas": 4,
    "estimated_read_minutes": 5,
    "xp_reward": 10,
    "has_quiz": true
  }
  ```

### E. Tandai Materi Selesai
- **Endpoint**: `POST /api/materials/{id}/complete/`
- **Auth**: Wajib
- **Response `200 OK`**:
  ```json
  {
    "message": "Materi selesai dibaca!",
    "xp_earned": 10,
    "total_xp": 260
  }
  ```

---

## 3. 🎯 Kuis Adaptif & Sistem Nyawa

> 💡 **Aturan Nyawa & Kuis**:
> - Maksimal nyawa = **3**.
> - Salah menjawab soal = **-1 nyawa**.
> - Jika nyawa habis (`0/3`), kuis langsung berhenti lebih awal (*early stop*) dan siswa harus menunggu regenerasi nyawa.
> - Regenerasi nyawa: **+1 nyawa setiap 1 jam**.
> - Hint edukatif & pembahasan lengkap akan disertakan setelah kuis selesai.

### A. Mulai Kuis
- **Endpoint**: `POST /api/quizzes/`
- **Auth**: Wajib
- **Request Body**:
  ```json
  {
    "material_id": 1,
    "difficulty": 1
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "attempt_id": 42,
    "material_id": 1,
    "difficulty": 1,
    "lives_remaining": 3,
    "questions": [
      {
        "id": 101,
        "question_text": "Bagian tumbuhan yang bertugas menyerap air dari dalam tanah adalah...",
        "option_a": "Daun",
        "option_b": "Batang",
        "option_c": "Akar",
        "option_d": "Bunga"
      }
    ]
  }
  ```

### B. Kirim Jawaban Soal
- **Endpoint**: `POST /api/quizzes/{attempt_id}/answer/`
- **Auth**: Wajib
- **Request Body**:
  ```json
  {
    "question_id": 101,
    "option": "C"
  }
  ```
- **Response `200 OK` (Jika Benar)**:
  ```json
  {
    "is_correct": true,
    "lives_remaining": 3,
    "xp_earned": 10,
    "is_finished": false
  }
  ```
- **Response `200 OK` (Jika Salah)**:
  ```json
  {
    "is_correct": false,
    "lives_remaining": 2,
    "xp_earned": 0,
    "is_finished": false
  }
  ```
- **Response `200 OK` (Jika Selesai atau Nyawa Habis)**:
  ```json
  {
    "is_finished": true,
    "final_score": 80.0,
    "total_correct": 4,
    "total_questions": 5,
    "total_xp_gained": 50,
    "lives_remaining": 2,
    "level_up": false,
    "review": [
      {
        "question_id": 101,
        "question_text": "Bagian tumbuhan yang bertugas...",
        "user_answer": "C",
        "correct_answer": "C",
        "is_correct": true,
        "hint": "Perhatikan organ tumbuhan yang berada di bawah permukaan tanah.",
        "explanation": "Jawaban benar adalah C. Akar berfungsi menyerap air dan hara mineral."
      }
    ]
  }
  ```

---

## 4. ❤️ Status Nyawa & Progres

### A. Cek Status Nyawa & Waktu Regenerasi
- **Endpoint**: `GET /api/progress/lives/`
- **Auth**: Wajib
- **Response `200 OK`**:
  ```json
  {
    "current_lives": 2,
    "max_lives": 3,
    "seconds_until_next_regen": 1845,
    "formatted_time_until_regen": "30m 45s",
    "can_play_quiz": true
  }
  ```

### B. Papan Peringkat (Leaderboard)
- **Endpoint**: `GET /api/leaderboard/?limit=10`
- **Public**: Ya
- **Response `200 OK`**:
  ```json
  [
    {
      "rank": 1,
      "username": "ahmad_bintang",
      "full_name": "Ahmad Bintang",
      "total_xp": 1420,
      "level": 12,
      "badge": "Gold"
    },
    {
      "rank": 2,
      "username": "siti_nurhaliza",
      "full_name": "Siti Nurhaliza",
      "total_xp": 1150,
      "level": 10,
      "badge": "Silver"
    }
  ]
  ```

---

## 5. 🤖 AI Tutor EduQuest

Fitur tanya-jawab langsung dengan tutor AI sokratik berorientasi materi pembelajaran.

### A. Tanya AI Tutor
- **Endpoint**: `POST /api/tutor/ask/`
- **Auth**: Wajib
- **Request Body**:
  ```json
  {
    "material_id": 1,
    "question": "Mengapa daun kebanyakan berwarna hijau?"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "reply": "Pertanyaan bagus! Daun memiliki pigmen atau zat warna khusus yang membantu menyerap cahaya matahari saat proses fotosintesis. Coba ingat kembali, apa nama pigmen hijau pada daun tersebut?",
    "material_id": 1,
    "material_title": "Tumbuhan, Sumber Kehidupan di Bumi",
    "latency_seconds": 1.42
  }
  ```

