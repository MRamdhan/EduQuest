# 🎨 EduQuest Frontend (MVC + Hash Router)

Frontend EduQuest kini memakai arsitektur **MVC penuh** dengan **ES Modules** dan **hash router**. Setiap halaman punya URL sendiri, logic dipisahkan dari markup, dan state aplikasi dikelola satu `Store`.

> Backend Django **tidak diubah** pada refactor ini.

---

## 📁 Struktur Direktori

```text
frontend/
├── index.html                    # Shell aplikasi: navbar, footer, modal, #app-view
├── templates/
│   ├── layout/                   # Navbar, footer, toast, modal auth, modal fitur
│   └── pages/                    # Template halaman yang dimuat router
├── js/
│   ├── main.js                   # Entry point (import app.js)
│   ├── app.js                    # Composition root: model, view, controller, routes, guard
│   ├── config/
│   │   └── constants.js          # API URL, storage key, route, jenjang, rank
│   ├── core/
│   │   ├── store.js              # State + observer
│   │   ├── router.js             # Hash router + route guard
│   │   ├── template-loader.js    # Fetch & cache template HTML
│   │   ├── dom.js                # Helper query, delegation, escape HTML
│   │   └── format.js             # Format nama, angka, tanggal, XP
│   ├── models/
│   │   ├── api-client.js         # Satu-satunya lapisan yang memanggil REST API
│   │   ├── initial-state.js      # Bentuk state awal
│   │   ├── auth-model.js         # Login, register, logout, sesi & expiry
│   │   ├── progress-model.js     # XP, level, rank, materi selesai
│   │   ├── quest-model.js        # Katalog mapel/materi dari API sesuai jenjang
│   │   ├── quiz-model.js         # Siklus kuis dari bank soal backend
│   │   ├── ai-tutor-model.js     # Percakapan AI Tutor berbasis materi backend
│   │   └── profile-model.js      # Riwayat kuis, statistik, rekomendasi
│   ├── views/
│   │   ├── layout/               # View navbar, footer, toast, modal
│   │   ├── components/           # View komponen bersama (rank showcase)
│   │   └── *-view.js             # View per halaman
│   ├── controllers/
│   │   ├── base-controller.js    # Siklus hidup mount/destroy + event delegation
│   │   └── *-controller.js       # Controller per halaman + auth/navbar/feature modal
│   ├── assets/
│   │   └── mascot-assets.js      # Data URI maskot & emblem (export ASSETS)
│   └── tailwind-config.js        # Konfigurasi tema Tailwind (classic script)
├── css/
│   └── style.css                 # CSS legacy, tidak dipakai halaman MVC
├── API_ENDPOINTS.md              # Dokumentasi endpoint backend
└── README.md
```

---

## 🧭 Rute Aplikasi

| Hash | Halaman | Akses |
|------|---------|-------|
| `#/` | Landing page | Publik |
| `#/beranda` | Beranda pengguna baru/lama | Login |
| `#/quest` | Katalog quest, bab, dan materi | Login |
| `#/quest/:subjectId/:materialId?step=1` | Baca materi dari backend | Login |
| `#/quest/:subjectId/:materialId?step=2` | Latihan & mulai kuis | Login |
| `#/kuis` | Kuis 3 Nyawa dari bank soal backend | Login |
| `#/ai-tutor` | Percakapan AI Tutor | Login |
| `#/profil` | Profil, statistik, riwayat kuis | Login |

Route guard:
- Pengguna belum login yang membuka rute terproteksi akan diarahkan ke `#/` dan modal login dibuka otomatis.
- Pengguna yang sudah login dan membuka `#/` akan diarahkan ke `#/beranda`.
- Route tidak dikenal akan kembali ke fallback (`#/`), lalu guard menentukan tujuan akhir.

---

## 🔌 Sumber Data Dinamis

Tidak ada lagi data materi, soal kuis, mapel, atau jenjang yang di-hardcode di view. Semua dimuat dari REST API backend dan disesuaikan dengan jenjang pengguna:

| Bagian | Endpoint |
|--------|----------|
| Jenjang & pilihan kelas | `GET /levels/` (publik) |
| Mapel sesuai jenjang | `GET /subjects/?level=...` |
| Materi sesuai jenjang | `GET /materials/?level=...` |
| Detail & HTML materi | `GET /materials/{id}/` |
| Kuis, jawaban, ringkasan | `GET/POST /quizzes/...` |
| Progres, XP, rank, nyawa | `GET /progress/`, `GET /progress/stats/`, `GET /ranks/` |
| Riwayat & rekomendasi | `GET /quizzes/history/`, `GET /tutor/recommendations/` |
| AI Tutor | `POST /tutor/ask/` |

Katalog quest hanya menampilkan mapel yang benar-benar punya materi pada jenjang user. Jika endpoint gagal, halaman menampilkan status loading/error dengan tombol coba lagi, bukan data statis pengganti.

---

## 🏗️ Cara Kerja MVC

1. `main.js` membuat `EduQuestApp` dari `app.js`.
2. `app.js` memuat template layout, membuat model, memasang controller global (auth, navbar, modal fitur), lalu menjalankan router.
3. Saat hash berubah, `Router` memilih route, menjalankan guard, memuat template halaman dari `templates/pages/`, lalu memanggil `controller.mount()`.
4. Controller mengambil data dari model, memanggil view untuk menggambar markup, dan memasang event delegation pada `#app-view`.
5. Model mengubah `Store`; view yang berlangganan (`store.subscribe`) otomatis dirender ulang.
6. Saat rute berganti, `controller.destroy()` melepas listener dan subscription lama.

Pemisahan tanggung jawab:

- **Model** — state, aturan bisnis, dan pemanggilan API. Tidak menyentuh DOM.
- **View** — menyusun markup dan membaca state. Tidak memanggil API.
- **Controller** — menghubungkan event pengguna, model, view, dan navigasi.
- **Core** — infrastruktur umum (router, store, template loader, helper DOM/format).
- **Config** — konstanta, label tampilan, dan fallback aman saat API belum termuat.

---

## 🚀 Cara Menjalankan

Frontend **wajib** dijalankan lewat HTTP karena memakai ES Modules dan `fetch()` untuk template.

### Opsi 1 — Python

```bash
# dari root repository
python -m http.server 5500 --directory frontend
```

Buka `http://127.0.0.1:5500`.

### Opsi 2 — Live Server VS Code

1. Buka folder `frontend` di VS Code.
2. Klik kanan `index.html` → **Open with Live Server**.

### Backend Django

```bash
# terminal terpisah, dari root repository
cd backend
..\.venv\Scripts\python.exe manage.py runserver
```

Backend berjalan di `http://127.0.0.1:8000`.

---

## ⚙️ Konfigurasi API & Sesi

- Base URL default: `http://127.0.0.1:8000/api`
- Override sebelum `js/main.js` dimuat (mis. untuk staging):
  ```html
  <script>window.EDUQUEST_API_URL = 'http://127.0.0.1:8000/api';</script>
  ```
- Token disimpan di `localStorage`:
  - `eduquest_token`
  - `eduquest_token_expires_at`
  - `eduquest_user`
- Masa berlaku token default 1 jam. Dapat diubah lewat `window.EDUQUEST_TOKEN_TTL_MS`.
- Jika token kedaluwarsa, sesi direset, toast “Sesi Berakhir” muncul, dan pengguna diarahkan ke landing.

---

## ➕ Menambah Halaman Baru

1. Buat template di `templates/pages/nama-halaman.html` dengan kontainer root, misalnya:
   ```html
   <div id="nama-root"></div>
   ```
2. Buat view di `js/views/nama-view.js` yang mengisi kontainer tersebut.
3. Buat controller di `js/controllers/nama-controller.js`:
   ```js
   import { BaseController } from './base-controller.js';
   import { NamaView } from '../views/nama-view.js';

   export class NamaController extends BaseController {
     mount() {
       this.view = new NamaView(this.root);
       this.subscribe();
       this.render();
     }

     render() {
       this.view.render(this.app.store.state);
     }
   }
   ```
4. Daftarkan route di `js/app.js`:
   ```js
   {
     path: '/nama-halaman',
     template: 'pages/nama-halaman.html',
     create: () => new NamaController(this)
   }
   ```
5. Tambahkan menu di `templates/layout/navbar.html` jika perlu:
   ```html
   <button type="button" data-nav="nama-halaman">Nama Halaman</button>
   ```
   Lalu tambahkan pemetaannya di `NAV_ROUTES` pada `navbar-controller.js`.

---

## 🧩 Konvensi Interaksi

- Gunakan atribut `data-action` untuk aksi umum:
  - `data-action="go" data-route="/quest"`
  - `data-action="open-material" data-bab="bab-01" data-mat="mat-1-1" data-step="1"`
  - `data-action="start-quiz"`
  - `data-action="open-feature" data-modal="profil"`
  - `data-action="open-auth" data-view="login"`
- Gunakan `data-nav` untuk navigasi navbar dan `data-profile-action` untuk menu profil.
- Gunakan `data-form="nama-form"` dan `data-field="nama-field"` untuk form.
- **Jangan** memakai inline `onclick`. Semua event ditangani lewat event delegation di controller (halaman) atau di `app.js` (aksi global).
- Jangan menaruh logic aplikasi di variabel global. Satu-satunya global yang disengaja adalah konfigurasi `window.EDUQUEST_*` dan akses browser bawaan (`window.location`, `window.history`).

---

## 📌 Catatan Perilaku

- Kuis 3 Nyawa adalah simulasi client-side 9 layar; langkah kuis disimpan di `state.quiz.step`, bukan di URL.
- Halaman baca materi saat ini memakai konten IPS (perilaku legacy dipertahankan).
- Modal edit profil/ubah jenjang menyimpan perubahan ke state lokal (demo), bukan ke API.
- Data kuis dan kurikulum masih lokal/demo; riwayat, statistik, dan rekomendasi profil diambil dari API bila tersedia.

---

## 📖 Referensi API

Lihat [`API_ENDPOINTS.md`](./API_ENDPOINTS.md) untuk daftar endpoint autentikasi, materi, kuis adaptif, AI Tutor, progres/nyawa, dan leaderboard.
