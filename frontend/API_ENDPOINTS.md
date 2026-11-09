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
- **Masa berlaku token di server & klien**: **1 jam** sejak login/register. Backend menerapkan `ExpiringTokenAuthentication` yang secara otomatis menolak token yang berusia lebih dari 1 jam dengan respon `401 Unauthorized`. Klien menyimpan token di `localStorage` dan melakukan auto-logout saat kedaluwarsa.

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
      "education_level": {
        "id": 2,
        "code": "SMP",
        "name": "SMP"
      },
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
      "education_level": {
        "id": 2,
        "code": "SMP",
        "name": "SMP"
      },
      "kelas": 8
    }
  }
  ```

### C. Logout
- **Endpoint**: `POST /api/auth/logout/`
- **Auth**: Wajib
- **Response `204 No Content`**

### D. Ambil Profil Saya
- **Endpoint**: `GET /api/auth/me/`
- **Auth**: Wajib
- **Response `200 OK`**:
  ```json
  {
    "id": 12,
    "username": "budi_santoso",
    "email": "budi@example.com",
    "first_name": "Budi Santoso",
    "date_joined": "2026-11-08T10:00:00+07:00",
    "education_level": {
      "id": 2,
      "code": "SMP",
      "name": "SMP"
    },
    "kelas": 8
  }
  ```
*(Catatan: data gamifikasi seperti XP, level, rank, dan nyawa diambil dari `GET /api/progress/`).*

---

## 2. 📚 Konten Pembelajaran

### A. Daftar Jenjang Pendidikan
- **Endpoint**: `GET /api/levels/`
- **Public**: Ya
- **Response `200 OK`**:
  ```json
  [
    {"id": 1, "code": "SD", "name": "SD"},
    {"id": 2, "code": "SMP", "name": "SMP"},
    {"id": 3, "code": "SMA", "name": "SMA/SMK"}
  ]
  ```

### B. Daftar Mata Pelajaran
- **Endpoint**: `GET /api/subjects/?level=SMP&kelas=8`
- **Public**: Ya
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 6,
      "name": "IPA",
      "slug": "ipa-smp",
      "level": {"id": 2, "code": "SMP", "name": "SMP"},
      "description": "Ilmu Pengetahuan Alam SMP"
    }
  ]
  ```

### C. Daftar Materi
- **Endpoint**: `GET /api/materials/?subject=6`
- **Public**: Ya
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 7,
      "title": "Besaran dan Pengukuran",
      "slug": "besaran-dan-pengukuran",
      "subject": 6,
      "topic_code": "SMP-IPA-01",
      "kelas": 7
    }
  ]
  ```

### D. Detail Materi Lengkap
- **Endpoint**: `GET /api/materials/{id}/`
- **Public**: Ya
- **Response `200 OK`**:
  ```json
  {
    "id": 7,
    "title": "Besaran dan Pengukuran",
    "slug": "besaran-dan-pengukuran",
    "subject": 6,
    "topic_code": "SMP-IPA-01",
    "kelas": 7,
    "body": "Teks lengkap materi pembelajaran...",
    "status": "published"
  }
  ```

### E. Tandai Materi Selesai
- **Endpoint**: `POST /api/materials/{id}/complete/`
- **Auth**: Wajib
- **Response `200 OK`**:
  ```json
  {
    "already_completed": false,
    "xp_gained": 15,
    "progress": {
      "xp": 15,
      "level": 1,
      "rank": {"code": "bronze", "name": "Bronze"}
    }
  }
  ```

---

## 3. 🎯 Kuis Adaptif & Sistem Nyawa

> 💡 **Aturan Nyawa & Kuis**:
> - Maksimal nyawa = **3 per mata pelajaran**.
> - Salah menjawab soal = **-1 nyawa**.
> - Jika nyawa habis (`0/3`), kuis langsung berhenti lebih awal (*ended early*) dan siswa harus menunggu regenerasi nyawa.
> - Regenerasi nyawa: **+1 nyawa setiap 1 jam**.
> - Hint edukatif & pembahasan lengkap baru disertakan pada akhir sesi kuis atau saat nyawa habis.

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
    "attempt": {
      "id": 42,
      "material": {
        "id": 1,
        "title": "Makhluk Hidup dan Ciri-cirinya"
      },
      "target_difficulty": 1,
      "questions": [
        {
          "id": 101,
          "question_text": "Bagian tumbuhan yang berfungsi menyerap air adalah...",
          "options": [
            {"key": "A", "text": "Daun"},
            {"key": "B", "text": "Batang"},
            {"key": "C", "text": "Akar"},
            {"key": "D", "text": "Bunga"}
          ]
        }
      ]
    },
    "reused": false,
    "attempt_id": 42,
    "lives": 3,
    "max_lives": 3,
    "unlocked_difficulty": 1,
    "user_xp": 45,
    "user_level": 1,
    "user_rank": {
      "code": "bronze",
      "name": "Bronze"
    }
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
- **Response `200 OK` (Jika kuis masih berjalan)**:
  ```json
  {
    "correct": true,
    "retry": false,
    "revealed": false,
    "hint": null,
    "lives": 3,
    "session_ended": false,
    "summary": null
  }
  ```
- **Response `200 OK` (Jika kuis selesai atau nyawa habis)**:
  ```json
  {
    "correct": true,
    "retry": false,
    "revealed": true,
    "hint": null,
    "lives": 3,
    "session_ended": true,
    "summary": {
      "attempt_id": 42,
      "percent": 80.0,
      "correct_count": 4,
      "total_questions": 5,
      "xp_gained": 50,
      "lives_remaining": 3,
      "ended_early": false,
      "review": [
        {
          "question_id": 101,
          "question_text": "Bagian tumbuhan yang berfungsi menyerap air adalah...",
          "user_answer": "C",
          "correct_answer": "C",
          "is_correct": true,
          "hint": "Fokus pada organ tumbuhan yang berada di bawah tanah.",
          "explanation": "Jawaban benar adalah C. Akar berfungsi menyerap air dan mineral dari tanah."
        }
      ]
    }
  }
  ```

### C. Riwayat Kuis Siswa
- **Endpoint**: `GET /api/quizzes/history/`
- **Auth**: Wajib
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 42,
      "material": {
        "id": 1,
        "title": "Makhluk Hidup dan Ciri-cirinya"
      },
      "status": "submitted",
      "target_difficulty": 1,
      "total_questions": 5,
      "correct_count": 4,
      "percent": 80.0,
      "xp_gained": 50,
      "started_at": "2026-11-09T09:30:00+07:00",
      "submitted_at": "2026-11-09T09:35:00+07:00"
    }
  ]
  ```

---

## 4. ❤️ Progres & Nyawa (`/progress/`)

### A. Ringkasan Progres & Nyawa per Mapel
- **Endpoint**: `GET /api/progress/`
- **Auth**: Wajib
- **Response `200 OK`**:
  ```json
  {
    "rank": {
      "code": "bronze",
      "name": "Bronze",
      "min_xp": 0,
      "order": 1
    },
    "level": 1,
    "xp": 65,
    "xp_into_level": 65,
    "xp_for_next_level": 100,
    "xp_to_next_level": 35,
    "materials_completed": 2,
    "quizzes_submitted": 3,
    "subject_lives": [
      {
        "subject_id": 6,
        "subject_name": "IPA",
        "lives": 3,
        "max_lives": 3,
        "seconds_to_next_life": 0,
        "regen_interval_seconds": 3600
      }
    ],
    "achievements": []
  }
  ```

---

## 5. 🤖 AI Tutor EduQuest (`/tutor/`)

### A. Tanya AI Tutor Sokratik
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
    "reply": "Pertanyaan bagus! Daun memiliki zat warna khusus yang membantu proses pembuatan makanan (fotosintesis). Coba ingat kembali, apa nama pigmen hijau pada daun tersebut?",
    "material_id": 1,
    "material_title": "Makhluk Hidup dan Ciri-cirinya",
    "latency_seconds": 1.42
  }
  ```
