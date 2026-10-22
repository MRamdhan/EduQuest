# EduQuest — Ringkasan Proyek dan Status Pengerjaan

**Versi:** 3.0 (menggantikan ringkasan 21 Oktober 2026)
**Tanggal pembaruan:** 22 Oktober 2026
**Disusun dari:** dokumen proyek (proposal, PRD, ringkasan sebelumnya), tangkapan layar Trello, dan hasil kerja/eksekusi skrip sampai tanggal pembaruan
**Stack berlaku:** Python, Django, SQLite, Django Templates, HTML/CSS/JavaScript, Figma
**Jenis proyek:** capstone kampus (non-komersial), akan dipresentasikan ke dosen

> **Cara membaca dokumen ini.** Setiap butir diberi status:
> **[Selesai]** sudah dikerjakan dan hasilnya ada; **[Berjalan]** sedang dikerjakan;
> **[Belum]** direncanakan, belum dimulai; **[Usulan]** belum disetujui tim;
> **[Belum diverifikasi]** hasil otomatis/AI yang belum diperiksa manusia.
> Status Trello di bagian 7 mengikuti tangkapan layar terakhir dan perlu dicek ulang oleh tim.

---

## 1. Gambaran proyek

EduQuest adalah website pembelajaran interaktif untuk siswa SD, SMP, dan SMA/SMK. Siswa memilih jenjang dan mata pelajaran, membaca materi, lalu menguji pemahaman lewat kuis dengan sistem XP, level, rank, dan nyawa per mata pelajaran. Tingkat kesulitan latihan menyesuaikan hasil siswa dan dibatasi rank. AI Tutor direncanakan membantu menjelaskan materi dan memberi petunjuk.

Prinsip yang tidak berubah:
- Penilaian, XP, level, rank, dan nyawa per mata pelajaran dihitung di backend; kunci jawaban tidak dikirim ke browser sebelum soal diselesaikan.
- Adaptasi tingkat kesulitan berbasis aturan yang transparan (rule-based), bukan ML, untuk MVP.
- Alur belajar inti tetap jalan saat layanan AI gagal.
- AI bukan sumber kebenaran tunggal; soal dan materi perlu ditinjau manusia.

Dokumen lama menyebut Flask; **framework yang berlaku adalah Django**.

## 2. Tim dan peran (dari proposal)

| Nama | Peran |
|---|---|
| Mochamad Ramdhan Irawan | Project Manager |
| Muhammad Zaidan Yazid Ilmani | UI/UX Designer |
| Muhammad Aldi Syamsul Anwar | Backend Developer; saat ini juga memegang pencarian materi |
| M. Raffa Mustari | Frontend Developer |
| M. Raffi Mustari | Frontend Developer |

## 3. Keputusan yang sudah diambil

| No | Keputusan | Status |
|---|---|---|
| 1 | Login wajib (akun Django) | Diputuskan |
| 2 | 5 soal per sesi kuis; tingkat adaptif dicek tiap sesi | Diputuskan dan diimplementasikan |
| 3 | Ambang adaptasi: minimum 5 percobaan, jendela 10, naik jika akurasi ≥ 80%, turun jika < 50% | Diputuskan sebagai nilai awal (diuji kemudian) |
| 4 | 10 XP per jawaban benar; 15 XP selesai materi (sekali per materi) | Diputuskan dan diimplementasikan |
| 5 | Ambang level: XP dari level L ke L+1 = 100 × L (level 2 = 100 XP total, level 3 = 300, level 4 = 600, level 5 = 1.000) | Diputuskan dan diimplementasikan |
| 6 | Nyawa maksimal 3 per mata pelajaran; jawaban salah −1; pulih 1 nyawa tiap 2 jam | Diputuskan dan diimplementasikan |
| 7 | AI Tutor di MVP; generator soal AI di fase berikutnya | Diputuskan |
| 8 | Layanan AI: memakai model/API yang sudah ada (tier gratis), bukan melatih model sendiri | Arah diputuskan; penyedia belum final |
| 9 | Peninjauan soal dan materi: tim membagi per mata pelajaran | Diputuskan; penanggung jawab per mapel belum ditulis |
| 10 | Jalur PTN masuk fase berikutnya (bukan bank inti demo) | Diputuskan |
| 11 | Konten memakai kurikulum Indonesia | Diputuskan |
| 12 | Bank inti demo: SD sampai SMA, dari IndoMMLU, status `imported`/`validated` | Diputuskan |
| 13 | Database dan model Django ditunda sampai struktur data final | Sudah diimplementasikan: SQLite + Django ORM |
| 14 | Laporan audit dataset ditunda sampai pekerjaan dataset beres | Diputuskan |
| 15 | Nyawa disimpan per mata pelajaran, maksimal 3, pulih 1 nyawa setiap 2 jam | Diputuskan dan diimplementasikan |
| 16 | Kuis memberi umpan balik per soal; salah pertama −1 nyawa + satu hint, salah kedua −1 nyawa + kunci/penjelasan lalu lanjut | Diputuskan dan diimplementasikan |
| 17 | Tingkat kuis 2/3 terbuka berdasarkan rank; rank disimpan di tabel `Rank` yang dapat diedit lewat admin; rank terendah **Ayam** | Diputuskan; nama rank di atas Ayam masih placeholder |
| 18 | Rank diturunkan dari XP; ambang awal 0/100/300/600/1.000 XP | Diputuskan sebagai nilai awal |

## 4. Yang sudah dikerjakan

### 4.1 Perencanaan dan dokumen
- **[Selesai]** Proposal proyek (judul, latar belakang, tujuan, ruang lingkup, RAB, tim, jadwal, WBS).
- **[Selesai]** PRD produk dan PRD AI versi sebelumnya (21 Oktober); **versi 3.0 disusun pada tanggal ini**.
- **[Selesai]** Papan Trello dibuat; kartu Perancangan sudah di kolom Done.

### 4.2 Audit dataset ScienceQA (kartu "Audit dan Validasi Dataset ScienceQA untuk AI EduQuest")
Dataset: AI2 ARC Easy (2.251 baris train) dan ScienceQA (21.208 baris: 12.726 train, 4.241 validation, 4.241 test). Keduanya berbahasa Inggris.

| Pekerjaan | Hasil | Status |
|---|---|---|
| Ekspor ScienceQA ke JSONL dengan gambar | 10.332 gambar; 10.876 baris tanpa gambar | Selesai |
| Pemeriksaan kelengkapan pertanyaan, pilihan, jawaban, gambar | Tidak ada pertanyaan kosong, indeks di luar rentang, atau gambar hilang/rusak; `solution` kosong pada 2.006 baris (±9,5%) | Selesai |
| Identifikasi kelompok pertanyaan+gambar lintas split | 454 kelompok, 1.268 entri untuk ditinjau | Selesai |
| Audit konteks pada 20 kelompok prioritas | Tidak ada duplikat identik; pola template | Selesai |
| Klasifikasi otomatis 454 kelompok | Tahap awal 44 kelompok "perlu_tinjauan" ternyata alarm palsu (passage ada di kolom `hint`); setelah `hint` dimasukkan: **454 `variasi_valid`, 0 duplikat, 0 konflik kunci**; 116 kelompok bertanda `gambar_template` | Selesai |
| Pembagian ulang (grouped split) | Versi akhir: train 12.727 / validation 4.244 / test 4.237 (60,0/20,0/20,0); 12.866 template; 46 template besar dipecah per varian; pemeriksaan "template di >1 split" = 0 | Selesai |
| Laporan hasil audit dan rekomendasi | Ditunda sesuai permintaan | Belum |
| Keputusan dataset untuk eksperimen AI | Usulan: ScienceQA/ARC hanya untuk prototipe pipeline; bank produksi dari sumber berbahasa Indonesia | Usulan |

**Temuan penting:**
1. Banyak soal ScienceQA memakai **gambar template yang sama** (satu gambar jerapah 162×162 piksel dipakai untuk soal tentang piranha, koala, kelinci, dll.). Hash yang sama juga ditemukan pada dataset asli (Hugging Face), jadi ini sifat dataset, bukan bug ekspor. Konsekuensi: gambar pada soal template tidak boleh ditampilkan ke siswa.
2. Pemeriksaan "template di >1 split = 0" pada versi akhir lebih lemah daripada versi pertama karena template besar dipecah per varian; saat melaporkan, tulis "pembagian per varian soal; template besar dipecah".
3. Topik kecil (pronouns 13 baris, culture, global-studies) tidak punya validation/test; jangan dievaluasi per topik.
4. Topik bahasa Inggris dan sejarah/ekonomi Amerika tidak relevan dengan kurikulum Indonesia.

### 4.3 Evaluasi dan pembangunan bank soal berbahasa Indonesia (IndoMMLU)
Sumber: IndoMMLU, soal ujian berbahasa Indonesia dari SD sampai seleksi PTN. Lisensi yang tertera di halaman dataset: CC BY-NC-SA 4.0 (non-komersial, atribusi, share-alike). Kolom `sumber` menunjukkan soal berasal dari situs pihak ketiga (blog soal, Scribd, Academia, bank soal Kemdikbud, SIMAK UI); **hak cipta soal aslinya tidak diverifikasi tim**.

| Tahap | Hasil |
|---|---|
| Inspeksi | 14.981 baris, tanpa nilai kosong, tanpa duplikat persis; opsi jawaban tergabung dalam satu kolom; kolom `kelas` dan `level` tidak rapi |
| Normalisasi ke skema EduQuest (11 mapel) | 9.478 baris setelah filter mapel; 9.476 valid, 2 ditolak |
| Audit kualitas | 29 soal merujuk gambar/tabel; 131 soal bertanda teks bacaan; 194 duplikat; 9.253 lolos termasuk PTN |
| Sampel manual 63 soal (pra-penilaian AI) | 8 soal bermasalah (12,7%): 2 kunci salah, 4 kunci diragukan, 1 ambigu, 1 cacat; 6 tidak yakin; 7 perlu cek teks lengkap. **Belum diverifikasi manusia.** Seluruh soal bermasalah berasal dari blog soal |
| **Bank inti demo** | **7.023 soal**: SD 1.904, SMP 1.964, SMA 3.155 |
| Dikeluarkan dari bank inti | PTN 2.016; `needs_passage_flag` 123; `opsi_identik` 88 (opsi ganda yang memang rusak di sumber); hasil pra-penilaian non-OK 21 |
| Sumber di bank inti | Blog soal 6.022; sumber pemerintah 668; unggahan pihak ketiga 333 |
| Label kesulitan sementara | Proxy dari kelas di dalam jenjang (lihat 4.4); SD IPA dan SD PPKN dipetakan ulang karena hanya memiliki kelas 3–6 |

Distribusi akhir bank inti (jenjang × mapel, total | tingkat 1/2/3/kosong):

| Jenjang | Mapel | Total | 1 / 2 / 3 / kosong |
|---|---|---|---|
| SD | Bahasa Indonesia | 1.032 | 332 / 326 / 374 / 0 |
| SD | IPA | 479 | 88 / 88 / 172 / 131 |
| SD | IPS | 295 | 111 / 98 / 86 / 0 |
| SD | PPKN | 98 | 49 / 29 / 20 / 0 |
| SMP | Bahasa Indonesia | 751 | 251 / 268 / 232 / 0 |
| SMP | IPA | 618 | 232 / 88 / 298 / 0 |
| SMP | IPS | 296 | 98 / 98 / 100 / 0 |
| SMP | PPKN | 299 | 79 / 129 / 91 / 0 |
| SMA | Bahasa Indonesia | 791 | 281 / 260 / 250 / 0 |
| SMA | Biologi | 449 | 180 / 141 / 128 / 0 |
| SMA | Ekonomi | 293 | 84 / 94 / 115 / 0 |
| SMA | Fisika | 282 | 113 / 86 / 83 / 0 |
| SMA | Geografi | 192 | 49 / 104 / 39 / 0 |
| SMA | Kimia | 282 | 127 / 70 / 85 / 0 |
| SMA | PPKN | 294 | 122 / 104 / 68 / 0 |
| SMA | Sejarah | 286 | 109 / 73 / 104 / 0 |
| SMA | Sosiologi | 286 | 108 / 53 / 125 / 0 |

**Keterbatasan bank:** tidak ada topik, penjelasan jawaban, atau gambar; tidak ada Matematika dan Bahasa Inggris; kunci jawaban belum diverifikasi; SD PPKN (tingkat 3 hanya 20 soal) dan SMA Geografi (tingkat 3 hanya 39 soal) tipis.

### 4.4 Modul logika inti (Python murni, tanpa Django)
Lokasi: `EduQuest/eduquest_logic/`, tes di `EduQuest/tests/`. **39 tes lulus** (dikonfirmasi di komputer pengembang).

| Modul | Fungsi |
|---|---|
| `adaptive_engine.py` | Keputusan naik/tahan/turun/remedial dari percobaan terbaru; tidak bereaksi pada satu jawaban; maksimal satu tingkat per keputusan; menyimpan alasan dan konfigurasi |
| `question_selector.py` | Memilih soal berdasar jenjang, mapel, tingkat; menghindari soal baru dikerjakan; fallback ke tingkat terdekat dengan catatan; `public_view` menghapus kunci dan penjelasan |
| `scoring.py` | Penilaian backend; hanya soal yang disajikan yang dinilai; jawaban kosong/tidak valid bukan salah; pengiriman ganda ditolak |
| `gamification.py` | XP, level, nyawa; XP materi sekali per materi; sesi berhenti saat nyawa habis; konfigurasi terpusat |

Pemetaan kesulitan sementara (kelas → tingkat): SD 1–2 → 1, 3–4 → 2, 5–6 → 3; SMP 7/8/9 → 1/2/3; SMA 10/11/12 → 1/2/3. Khusus SD IPA dan PPKN: kelas 1,3,4 → 1; 5 → 2; 6 → 3. Soal tanpa kelas jelas tidak diberi tingkat. Ini proxy lemah (kelas menunjukkan tempat soal diajarkan, bukan kesulitan) dan harus dikalibrasi dari data jawaban nanti.

### 4.5 Inventaris skrip dan berkas hasil

| Skrip | Lokasi | Fungsi |
|---|---|---|
| `audit_*`, `check_*`, `download_*`, `export_*`, `fix_*`, `inspect_*`, `review_*`, `summarize_*`, `verify_fish_images.py` | `dataset/scienceqa/` | Audit dan ekspor ScienceQA tahap awal |
| `inspect_priority_groups.py` | `dataset/scienceqa/` | Ekstrak 20 kelompok prioritas → `reports/priority_groups_detail.csv/.txt` |
| `classify_cross_split_groups.py` | `dataset/scienceqa/` | Klasifikasi 454 kelompok → `reports/group_classification.csv` |
| `make_grouped_split.py` | `dataset/scienceqa/` | Split per template → `data_grouped_split/` |
| `inspect_indommlu.py` | `dataset/` | Unduh dan inspeksi → `indommlu/` |
| `normalize_indommlu.py` | `dataset/` | Normalisasi → `indommlu/processed/` |
| `audit_indommlu_quality.py` | `dataset/` | Flag kualitas → `quality_flags.csv`, `indommlu_eligible.jsonl` |
| `make_review_sample.py`, `apply_prescreen_verdicts.py` | `dataset/` | Sampel tinjauan 63 soal dan pra-penilaian AI |
| `build_core_bank.py` | `dataset/` | Bangun bank inti → `indommlu/core/bank_inti.jsonl`, `excluded.csv`, `summary.txt` |
| `adaptive_engine.py`, `question_selector.py`, `scoring.py`, `gamification.py` | `eduquest_logic/` | Modul logika inti |

### 4.6 Implementasi backend Django (pembaruan 22 Oktober 2026)

Backend Django sudah menerapkan alur bermain baru. Frontend sengaja belum
diisi pada tahap ini.

| Area | Hasil | Status |
|---|---|---|
| Nyawa per mapel | `SubjectProgress` menyimpan maksimal 3 nyawa per mata pelajaran; 1 nyawa pulih tiap 2 jam; timer tidak di-reset saat kehilangan nyawa berikutnya | Selesai |
| Alur kuis per soal | `POST /api/quizzes/<id>/answer/` menilai satu jawaban dan langsung mengembalikan hasil, hint, nyawa, dan soal berikutnya | Selesai |
| Salah pertama | Nyawa mapel −1, soal tidak maju, satu hint dari `Question.hint` → AI Tutor → aturan materi | Selesai |
| Salah kedua | Nyawa mapel −1, kunci dan penjelasan dibuka, lalu sesi lanjut ke soal berikutnya | Selesai |
| Nyawa habis | Sesi langsung selesai; soal tersisa dihitung tidak dijawab; kuis baru pada mapel tersebut ditolak sampai nyawa pulih | Selesai |
| Rank | Tabel `Rank` (nama, urutan, `min_xp`, `unlocked_difficulty`, ikon, deskripsi, aktif) tersedia di admin; rank terendah Ayam | Selesai; nama rank di atas Ayam placeholder |
| Rank gate | Tingkat 1/2/3 hanya dapat dimulai jika `unlocked_difficulty` rank mencukupi; pelanggaran menghasilkan 403 `level_locked` | Selesai |
| XP | +10 per jawaban benar (idempoten per `QuizQuestion`), +15 per materi selesai (sekali per materi) | Selesai |
| Progres | `GET /api/progress/` mengembalikan XP, level, rank, rank berikutnya, XP menuju rank berikutnya, dan nyawa semua mapel | Selesai |
| Daftar rank | `GET /api/ranks/` | Selesai |
| Migrasi | `learning.0002`, `learning.0003` (backfill soal lama), `progress.0002`, `progress.0003` (seed rank) | Selesai |
| CLI | `quiz_cli` mengikuti alur hint/nyawa baru; `materials_cli` menampilkan rank | Selesai |
| Pengujian | 55 tes API/logika lulus; `manage.py check` bersih; migrasi diterapkan | Selesai |

**Catatan implementasi:**
- Percobaan kuis lama sudah di-backfill menjadi soal terselesaikan agar
  ringkasan lama tetap benar.
- Provider AI belum dikonfigurasi, sehingga hint saat ini memakai
  fallback aturan; jalur AI sudah tersedia di kode.
- Soal bank belum dipetakan ke topik materi, jadi sebuah materi masih
  dapat menerima soal yang tidak sepenuhnya cocok. Ini pekerjaan
  pemetaan berikutnya.
- `POST /api/quizzes/<id>/submit/` sudah tidak dipakai; gunakan endpoint
  `answer/`.

## 5. Yang sedang dikerjakan

| Pekerjaan | Penanggung jawab (menurut proposal/percakapan) | Catatan |
|---|---|---|
| Desain UI/UX Figma (15–25 Okt) | Zaidan | Keputusan login, 5 soal/sesi, nyawa 3, layar nyawa habis perlu diteruskan |
| Pencarian dan penyiapan materi | Aldi | Cakupan demo belum ditetapkan (usulan: IPA SD, IPA SMP, Biologi SMA) |
| Penutupan kartu audit dataset | Aldi | Tersisa: centang klasifikasi, laporan, keputusan dataset |
| Tinjauan manusia atas soal bermasalah | Tim | 8 soal bermasalah + 6 "tidak yakin" + 7 "cek teks lengkap" |

## 6. Yang akan dikerjakan

### 6.1 Prioritas dekat (minggu ini)
1. **Tetapkan cakupan materi demo** dan kerangka topik dari Capaian Pembelajaran Kurikulum Merdeka.
2. **Verifikasi lisensi** sumber materi (buku Kemdikbud: status belum terverifikasi) sebelum menyalin isi.
3. **Tulis ringkasan materi** (draft) dan **petakan soal bank ke topik**.
4. **Tinjau 14 soal bermasalah**/tidak yakin dan **cek teks 7 soal terpotong**.
5. **Bagikan keputusan produk ke desainer** agar layar kuis, nyawa, dan hasil sesi sesuai.
6. **Finalisasi ERD dan model Django** (implementasi awal sudah ada; jadwal proposal: 25 Okt–1 Nov) dan dokumentasikan relasi `Rank`/`SubjectProgress`.
7. **Finalisasi nama rank di atas Ayam** dan teruskan aturan nyawa
   per mapel (maksimal 3, pulih 1 tiap 2 jam) ke desainer; saat nyawa 0
   siswa tetap bisa membaca materi dan memakai Tutor.

### 6.2 Fase pengembangan (mengikuti jadwal proposal)
- Implementasi halaman Django dan materi/kuis: 2–9 November.
- Gamifikasi dan progres belajar: 8–15 November.
- Integrasi AI Tutor: 16–23 November.
- Pengujian dan perbaikan bug: 24 November–1 Desember.
- Deployment dan finalisasi dokumentasi: 2–6 Desember (PRD menyebut batas 11 Desember; PM perlu menetapkan satu tanggal resmi).

### 6.3 Setelah itu
Laporan audit dataset; kalibrasi tingkat kesulitan dari data jawaban; generator soal AI (fase berikut); jalur PTN; pengumpulan data pengguna nyata; eksperimen ML terhadap baseline rule-based.

## 7. Status Trello (menurut tangkapan layar terakhir)

Papan "EduQuest": To Do (6), Doing (3), Done (1).

| Kolom | Kartu |
|---|---|
| Done | Perancangan |
| Doing | Desain UI/UX (15–25 Okt); Pencarian Materi; Audit dan Validasi Dataset ScienceQA untuk AI EduQuest |
| To Do | Perancangan database dan struktur aplikasi (mulai 25 Okt); Implementasi halaman website menggunakan Django (2 Nov); Implementasi materi dan kuis (2 Nov); Implementasi gamifikasi (…); dua kartu lain tidak terlihat |

**Penyesuaian yang disarankan:**
1. Kartu audit: centang "Klasifikasikan duplikasi, variasi valid, dan kasus ambigu" (hasil sudah ada); biarkan "Laporan" dan "Tentukan dataset" terbuka; tambahkan catatan temuan gambar template.
2. Ubah "Pencarian Materi" menjadi kartu bercheklist: cakupan demo, CP, kerangka topik, lisensi, ringkasan materi (draft), tinjauan, pemetaan soal ke topik.
3. Tambahkan kartu **Evaluasi Dataset Berbahasa Indonesia** (IndoMMLU: normalisasi, audit, bank inti selesai; tinjauan manusia terbuka).
4. Tambahkan kartu **Modul logika inti** (4 modul, 39 tes lulus; sisa: integrasi Django).
5. Tambahkan kartu **Keputusan Tim** (checklist bagian 3 dan 8) dan jadikan dependensi kartu database.
6. Rename "Perancangan database dan struktur aplikasi" agar mencakup ERD dan model Django.
7. Tambahkan kartu: spesifikasi skema soal dan status soal, arsitektur AI (adapter provider), AI Tutor, pengujian dan integrasi AI, rencana cadangan demo bila AI gagal, cek syarat dan kuota tier gratis penyedia AI.

## 8. Keputusan yang masih terbuka

1. Nama final rank di atas **Ayam**; nama saat ini placeholder dan dapat diubah di admin. Perilaku saat nyawa 0 sudah ditetapkan: sesi berhenti, materi/Tutor tetap dapat diakses.
2. Apakah XP perlu dibedakan menurut tingkat soal; implementasi saat ini memberi +10 XP per jawaban benar tanpa membedakan tingkat.
3. `min_attempts` 5 (keputusan tiap sesi, lebih berisik) atau 10 (tiap dua sesi).
4. Jawaban kosong: tetap netral (asumsi saat ini) atau dihitung salah.
5. Penyedia AI final, kuota tier gratis, dan apakah demo butuh rencana cadangan; anggaran proposal (Rp 100.000) hanya mencakup hosting.
6. Retensi riwayat percakapan Tutor dan log AI.
7. Sumber dan status hak cipta materi belajar; siapa yang menulis dan meninjau per mapel.
8. Apakah heuristik/aturan adaptasi dan angka gamifikasi diuji pengguna sebelum demo.
9. Satu tanggal resmi akhir proyek (6 atau 11 Desember) dan tanggal mulai (7, 9, atau 12 Oktober).
10. Cara menangani 131 soal SD IPA tanpa kelas dan soal tanpa topik di bank.

## 9. Risiko utama

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kunci jawaban salah di bank impor (±13% pada sampel 63, pra-penilaian AI) | Siswa dinilai keliru | Tinjauan manusia; fitur laporkan soal; status soal; soal bermasalah dikeluarkan dari adaptasi |
| Sumber soal berasal dari blog dan unggahan pihak ketiga | Hak cipta tidak jelas | Hanya untuk capstone non-komersial; catat sumber; jangan publikasikan bank |
| Materi belajar belum punya sumber | Tutor tanpa dasar, alur "baca lalu kuis" tidak lengkap | Tulis ringkasan materi sendiri berbasis CP; verifikasi lisensi |
| Tidak ada tingkat kesulitan sungguhan dan topik | Adaptasi kasar | Proxy kelas; kalibrasi dari data; pelabelan topik |
| Kuota/penyedia AI gratis berubah atau habis | Tutor tidak jalan saat demo | Adapter provider, pesan fallback, rencana cadangan |
| Jadwal ketat dan beberapa kartu bergantung keputusan | MVP tidak selesai | Prioritaskan alur inti; tutup keputusan terbuka lewat rapat |
| Data siswa di tier gratis penyedia AI dapat dipakai penyedia | Privasi | Jangan kirim data pribadi; hanya materi dan pertanyaan |

---

**Prinsip kerja:** jangan menganggap dataset bersih atau AI siap hanya karena skrip berjalan. Simpan data mentah, laporan, dan hasil kurasi terpisah, dan catat setiap keputusan agar dapat ditelusuri.
