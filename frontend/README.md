# 🎨 EduQuest Frontend Workspace

Selamat datang di direktori **Frontend EduQuest**! Direktori ini dibuat terpisah dari backend agar tim frontend (**Raffa & Raffi**) dapat bekerja leluasa mendesain UI/UX tanpa terbebani konfigurasi backend Django.

---

## 📁 Struktur Direktori

```text
frontend/
├── index.html          # Starter UI interaktif / playground untuk tes API langsung
├── css/
│   └── style.css       # File style CSS dasar (bisa dimodifikasi/diganti framework lain)
├── js/
│   ├── api.js          # Library Client API EduQuest (siap pakai untuk semua endpoint)
│   └── app.js          # Contoh implementasi interaksi UI & pemanggilan API
├── API_ENDPOINTS.md    # Panduan lengkap endpoint API, Request Body, dan Response JSON
└── README.md           # Panduan ini
```

---

## 🚀 Cara Menjalankan Frontend

Frontend EduQuest berupa aplikasi web klien statis murni (*Decoupled Static / SPA*). Anda dapat menjalankannya dengan salah satu opsi berikut:

### Opsi 1: Menggunakan Live Server di VS Code (Paling Direkomendasikan)
1. Buka folder `frontend` di VS Code.
2. Pasang ekstensi **Live Server** (oleh Ritwick Dey) jika belum ada.
3. Klik kanan pada file `index.html` lalu pilih **"Open with Live Server"**.
4. Browser akan otomatis terbuka di `http://127.0.0.1:5500`.

### Opsi 2: Menggunakan Python Simple Server
Buka terminal di dalam folder `frontend`:
```bash
python -m http.server 5500
```
Buka browser di alamat `http://127.0.0.1:5500`.

### Opsi 3: Menggunakan Vite / Node.js (Jika ingin memakai React/Vue/Tailwind)
```bash
npx vite
```
Backend Django sudah dikonfigurasi untuk mengizinkan CORS dari port `5173`, `5500`, dan `8080`.

---

## ⚡ Memastikan Backend Berjalan

Sebelum menguji login, materi, atau kuis, pastikan backend Django sudah aktif:
```bash
# Di terminal terpisah dari root repository EduQuest:
cd backend
..\.venv\Scripts\python.exe manage.py runserver
```
Backend akan berjalan di `http://127.0.0.1:8000`.

---

## 💻 Cara Menggunakan `EduQuestAPI` di JavaScript

File `js/api.js` sudah menyediakan class helper `EduQuestAPI` untuk mempermudah pemanggilan endpoint tanpa harus menulis `fetch()` berulang-ulang:

### 1. Import di HTML:
```html
<script src="js/api.js"></script>
```

### 2. Contoh Pemanggilan di JavaScript:

#### Login Siswa:
```javascript
try {
  const result = await EduQuestAPI.login('username_murid', 'password123');
  console.log('Login berhasil, token tersimpan:', result.token);
} catch (error) {
  console.error('Login gagal:', error.message);
}
```

#### Mengambil Daftar Materi:
```javascript
const materials = await EduQuestAPI.getMaterials({ level: 'SD' });
console.log('Daftar materi:', materials);
```

#### Bertanya ke AI Tutor:
```javascript
const response = await EduQuestAPI.askTutor(1, 'Apa fungsi daun bagi tumbuhan?');
console.log('Jawaban tutor:', response.reply);
```

#### Memulai Kuis & Mengirim Jawaban:
```javascript
// 1. Mulai kuis
const session = await EduQuestAPI.startQuiz(materialId, 1);
const questionId = session.questions[0].id;

// 2. Jawab pertanyaan
const answerResult = await EduQuestAPI.answerQuestion(session.attempt_id, questionId, 'C');
console.log(answerResult.is_correct ? 'Benar!' : 'Salah!');
```

---

## 📖 Rujukan Endpoint Lengkap
Buka file [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) untuk melihat daftar lengkap URL endpoint, payload request, dan response JSON untuk semua fitur:
- Autentikasi (`/api/auth/`)
- Materi & Jenjang (`/api/materials/`, `/api/levels/`)
- Kuis Adaptif (`/api/quizzes/`)
- AI Tutor (`/api/tutor/`)
- Progres & Nyawa (`/api/progress/`)
- Papan Peringkat (`/api/leaderboard/`)

