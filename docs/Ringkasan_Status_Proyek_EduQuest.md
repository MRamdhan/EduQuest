# EduQuest --- Ringkasan Proyek dan Status Pengerjaan

**Tanggal pembaruan:** 21 Oktober 2026\
**Status dokumen:** Ringkasan kerja berdasarkan dokumen proyek dan
percakapan sampai tanggal pembaruan\
**Status proyek:** Analisis kebutuhan dan audit dataset; implementasi
aplikasi belum dimulai atau belum dikonfirmasi\
**Stack yang berlaku:** Python, Django, SQLite, Django Templates, HTML,
CSS, JavaScript, Figma\
**Catatan penting:** Dokumen lama menyebut Flask. Berdasarkan
klarifikasi terbaru, framework yang dipakai adalah **Django**. Semua
rancangan teknis berikut menggunakan Django.

> **Dokumen historis (21 Oktober 2026).** Untuk status terbaru, termasuk
> implementasi backend, nyawa per mata pelajaran, rank, dan alur kuis per
> soal, lihat `Ringkasan_Status_Proyek_EduQuest_baru.md`.

------------------------------------------------------------------------

## 1. Gambaran singkat proyek

EduQuest adalah website pembelajaran interaktif untuk siswa SD, SMP,
SMA/SMK. Produk menggabungkan materi pembelajaran, kuis, game edukatif,
gamifikasi (XP, level, nyawa, achievement), progres belajar, dan
dukungan AI.

Rencana AI memiliki tiga bagian yang harus dibedakan: 1. **AI Tutor**
--- membantu menjelaskan materi, memberi petunjuk, dan menjawab
pertanyaan siswa dalam konteks pembelajaran. 2. **AI Question
Generator** --- menghasilkan draf soal sesuai jenjang, materi,
prasyarat, dan target kesulitan. 3. **Mesin adaptasi pembelajaran** ---
memilih tingkat kesulitan dan latihan berikutnya berdasarkan hasil
siswa. MVP dimulai dengan aturan yang transparan (*rule-based*), bukan
langsung mengandalkan machine learning (ML).

AI tidak menjadi satu-satunya penentu kunci jawaban atau nilai.
Penilaian kuis harus dilakukan backend dengan kunci jawaban yang
tersimpan dan tervalidasi. Soal hasil AI perlu melewati validasi; bila
AI gagal atau hasil tidak layak, aplikasi menggunakan bank soal cadangan
yang sudah ditinjau.

## 2. Tujuan produk

-   Memudahkan siswa menemukan materi sesuai jenjang dan mata pelajaran.
-   Menyediakan latihan/kuis yang memberi umpan balik.
-   Mendorong motivasi belajar melalui gamifikasi.
-   Menampilkan progres belajar.
-   Memberikan bantuan AI yang relevan dengan materi.
-   Mengembangkan latihan adaptif secara bertahap dan dapat dievaluasi.

## 3. Pengguna sasaran

  -----------------------------------------------------------------------
  Pengguna                Kebutuhan utama         Prioritas MVP
  ----------------------- ----------------------- -----------------------
  Siswa SD                Instruksi sederhana,    Tinggi
                          materi dasar, latihan   
                          singkat, pengalaman     
                          belajar yang aman       

  Siswa SMP               Materi dan latihan      Tinggi
                          bertahap sesuai mata    
                          pelajaran               

  Siswa SMA/SMK           Materi dan latihan yang Tinggi
                          lebih mendalam          

  Guru                    Media pendukung         Bukan fokus utama MVP
                          pembelajaran            

  Orang tua               Mendukung belajar       Bukan fokus utama MVP
                          mandiri anak            

  Admin/pengelola konten  Mengelola materi dan    Perlu ditentukan;
                          soal                    Django Admin dapat
                                                  dipertimbangkan
  -----------------------------------------------------------------------

## 4. Stack dan keputusan terkini

  Area                      Keputusan terkini
  ------------------------- --------------------------------------------------------
  Platform                  Website
  Bahasa backend            Python
  Framework backend         **Django**
  Database                  SQLite untuk versi awal
  Frontend                  Django Templates, HTML, CSS, JavaScript
  UI/UX                     Figma
  Manajemen proyek          Trello
  Dokumentasi               Markdown dan/atau Google Drive
  AI                        Layanan/model yang tersedia; provider belum ditetapkan
  Training model dari nol   Tidak termasuk ruang lingkup awal

**Peringatan dokumentasi:** file PRD lama dan addendum AI masih menyebut
Flask. Referensi tersebut harus diperbarui menjadi Django ketika dokumen
dipakai sebagai spesifikasi tim. Perubahan framework tidak mengubah
prinsip utama alur AI dan audit dataset.

## 5. Apa yang sedang dikerjakan?

Fokus saat ini adalah **audit dan kurasi dataset ScienceQA**, bukan
integrasi ke aplikasi. Dataset sedang ditinjau untuk memahami struktur,
kualitas, dan potensi pengulangan soal lintas split.

Tujuan tahap ini: - memastikan pertanyaan, pilihan, indeks jawaban, dan
referensi gambar dapat dibaca; - memeriksa soal berulang; - memahami
penggunaan gambar/pertanyaan yang sama di train, validation, dan test; -
menentukan aturan kurasi sebelum data dipakai untuk eksperimen; -
menghindari klaim bahwa dataset telah siap untuk produksi sebelum
kualitasnya dievaluasi.

## 6. Yang sudah dikerjakan

### 6.1 Persiapan dataset

**AI2 ARC Easy** - Dataset telah diunduh dan diekspor. - Data train
berisi 2.251 baris. - Data berbahasa Inggris dan berfokus pada soal
sains tingkat sekolah. - Format ekspor mencakup CSV/JSONL dan kolom
pertanyaan, pilihan, serta kunci jawaban.

**ScienceQA** - Split train: 12.726 baris. - Split validation: 4.241
baris. - Split test: 4.241 baris. - Total: 21.208 baris. - Dataset
berbahasa Inggris dan memiliki konteks/kurikulum yang tidak otomatis
sesuai dengan kurikulum Indonesia. - Data mencakup pertanyaan, pilihan,
jawaban, petunjuk, penjelasan, kelas, mata pelajaran, topik, kategori,
skill, dan gambar jika tersedia.

### 6.2 Ekspor gambar ScienceQA

-   Data diekspor ke JSONL dengan `image_path` dan direktori gambar per
    split.
-   Total gambar yang tersimpan sebelumnya: 10.332.
-   Baris tanpa gambar: 10.876.
-   Audit sebelumnya tidak menemukan referensi gambar yang hilang atau
    file gambar rusak di antara file yang diekspor.
-   Jumlah tersebut merupakan hasil audit sebelumnya dan perlu dihitung
    ulang jika dataset diekspor ulang atau berubah.

### 6.3 Audit kualitas dasar

Hasil audit yang telah dicatat: - Tidak ditemukan pertanyaan kosong pada
tiga split. - Tidak ditemukan pilihan jawaban yang tidak valid pada
audit sebelumnya. - Tidak ditemukan indeks jawaban di luar rentang pada
audit sebelumnya. - `solution` kosong pada 2.006 baris secara total
(sekitar 9,5% dari 21.208). - Ditemukan banyak pertanyaan berulang;
sebagian dapat berasal dari pola/template soal dan tidak otomatis
merupakan duplikat yang salah.

### 6.4 Audit lintas split

Skrip yang telah dijalankan: - `inspect_cross_split_context.py` -
`summarize_cross_split_context.py`

Laporan yang telah dibuat: - `reports/cross_split_context_review.csv` -
`reports/cross_split_group_summary.csv` - laporan audit lintas split
terdahulu, termasuk `cross_split_image_details.csv` dan
`cross_split_needs_review.csv` jika masih tersedia.

Hasil terbaru dari terminal: - Kelompok lintas split: **454** - Baris
untuk ditinjau: **1.268** - Ringkasan kelompok: **454 baris**, satu per
`group_id`.

Kelompok tersebut didefinisikan sebagai pertanyaan ternormalisasi yang
sama dan gambar dengan SHA-256 sama, muncul di lebih dari satu split.
Laporan sebelumnya menandai variasi teks jawaban sebagai konflik, tetapi
perbedaan jawaban teks **bukan bukti otomatis bahwa kunci salah**:
pilihan jawaban dapat berbeda antarvarian. Konteks soal harus ditinjau
sebelum mengambil keputusan.

## 7. Yang belum dikerjakan / belum terkonfirmasi

Hal berikut tidak boleh dianggap sudah selesai: - audit manual atau
berbantuan ahli atas 454 kelompok; - keputusan final mengenai soal yang
dipertahankan, ditinjau, atau dikeluarkan; - validasi kesesuaian dengan
kurikulum Indonesia; - penentuan dataset utama untuk produk; - pemetaan
sumber materi dan hak penggunaan/lisensi; - rancangan final ERD dan
migrasi database; - implementasi website Django; - login/profil dan
penyimpanan progres; - bank soal final yang telah ditinjau; - integrasi
AI Tutor dan AI Question Generator; - pengujian adaptasi rule-based; -
pengumpulan data pengguna nyata; - pelatihan atau evaluasi model ML.

## 8. Langkah berikutnya

### Tahap A --- Tutup audit dataset

1.  Buka `cross_split_group_summary.csv`.
2.  Periksa sampel kelompok yang muncul di ketiga split terlebih dahulu.
3.  Bandingkan pertanyaan, gambar, opsi, jawaban, hint, solution, kelas,
    dan topik.
4.  Klasifikasikan setiap kelompok: `variasi_valid`,
    `kandidat_duplikat_lintas_split`, atau `perlu_tinjauan`.
5.  Dokumentasikan aturan kurasi. Jangan menghapus baris secara massal
    hanya karena jawabannya berbeda.
6.  Jika akan mengukur performa model, buat split evaluasi yang mencegah
    varian dari kelompok yang sama tersebar antara train dan test.

### Tahap B --- Tentukan relevansi pendidikan Indonesia

1.  Identifikasi jenjang, mata pelajaran, topik, dan format soal yang
    diperlukan untuk demo.
2.  Cari sumber berbahasa Indonesia yang sah digunakan dan lebih dekat
    dengan kurikulum target.
3.  Simpan metadata sumber, lisensi/izin, bahasa, jenjang, topik, dan
    tanggal pengambilan.
4.  Bandingkan dataset tambahan sebelum memilih data untuk MVP.
5.  Perlakukan AI2 ARC Easy dan ScienceQA sebagai kandidat data
    eksperimen/pendukung, bukan otomatis sebagai bank soal produksi
    Indonesia.

### Tahap C --- Tetapkan rancangan AI

1.  Tetapkan materi dan prasyarat sebagai sumber konteks.
2.  Gunakan bank soal terkurasi sebagai fallback.
3.  Buat generator soal dengan output terstruktur dan validasi backend.
4.  Buat adaptasi berbasis aturan terlebih dahulu.
5.  Tentukan batasan AI Tutor, perlindungan siswa, dan cara menangani
    jawaban yang tidak pasti.
6.  Tunda eksperimen ML sampai ada data dan target evaluasi yang jelas.

### Tahap D --- Rancang dan bangun aplikasi Django

1.  Konfirmasi fitur MVP dan alur pengguna.
2.  Buat desain Figma dan ERD.
3.  Buat proyek Django dan aplikasi modular.
4.  Implementasikan katalog materi, kuis, penilaian server-side,
    progres, dan gamifikasi.
5.  Integrasikan generator soal dan fallback.
6.  Integrasikan AI Tutor.
7.  Uji keamanan, integritas data, responsivitas, dan kegagalan layanan.
8.  Deploy demo setelah kriteria penerimaan terpenuhi.

## 9. Rencana kerja Trello

Kartu yang disarankan: 1. **Audit dan Kurasi Dataset ScienceQA** ---
Doing. 2. **Evaluasi Dataset Pendidikan Berbahasa Indonesia** --- To Do.
3. **Spesifikasi Bank Soal EduQuest** --- To Do. 4. **Perancangan
Arsitektur AI EduQuest** --- To Do. 5. **Perancangan ERD dan Model Data
Django** --- To Do. 6. **UI/UX Figma untuk Alur Belajar dan AI Tutor**
--- To Do. 7. **Implementasi MVP Django** --- To Do. 8. **Pengujian dan
Integrasi AI** --- To Do.

Tutup kartu audit pertama hanya setelah keputusan kurasi dan laporan
ringkasan ditinjau, bukan hanya setelah skrip berhasil dijalankan.

## 10. Timeline acuan

PRD sebelumnya mencantumkan periode proyek 12 Oktober--11 Desember 2026.
Jadwal rinci yang pernah direncanakan: - Analisis kebutuhan: 12--18
Oktober. - UI/UX dan database: 19--25 Oktober. - Fitur inti: 26
Oktober--15 November. - Integrasi AI Tutor: 16--22 November. -
Pengujian/perbaikan: 23 November--6 Desember. - Finalisasi/deployment:
7--11 Desember.

Timeline ini adalah rencana acuan, bukan bukti bahwa tiap fase telah
selesai. Karena audit dataset masih berjalan, tim perlu mengevaluasi
ulang jadwal dan mengutamakan MVP yang realistis.

## 11. Risiko utama

  -----------------------------------------------------------------------
  Risiko                              Mitigasi
  ----------------------------------- -----------------------------------
  Dataset tidak sesuai kurikulum      Gunakan dataset sebagai pendukung;
  Indonesia                           cari dan tinjau sumber lokal yang
                                      sah

  Duplikasi lintas split menyebabkan  Kelompokkan varian terkait sebelum
  evaluasi bias                       pembagian data evaluasi

  Jawaban AI keliru/ambigu            Validasi, peninjauan manusia, bank
                                      soal fallback

  Layanan AI gagal atau mahal         Timeout, batas penggunaan, fallback
                                      bank soal

  Lingkup terlalu besar untuk waktu   Dahulukan alur belajar inti dan
  proyek                              fitur Must

  Progres/XP tidak konsisten          Hitung di backend dan gunakan
                                      transaksi database

  Data siswa terlalu banyak           Minimalkan data dan batasi akses
  dikumpulkan                         
  -----------------------------------------------------------------------

## 12. Definisi selesai untuk fase dataset

Fase dataset dianggap selesai jika: - laporan audit dapat
direproduksi; - kelompok lintas split telah ditinjau dan
diklasifikasikan dengan aturan terdokumentasi; - keputusan tentang
penggunaan atau pengecualian data dicatat; - sumber, lisensi, bahasa,
jenjang, dan keterbatasan data didokumentasikan; - split eksperimen
tidak memiliki kebocoran yang belum ditangani; - tim menyepakati data
mana yang hanya untuk eksperimen dan mana yang layak menjadi bank soal
setelah peninjauan.

------------------------------------------------------------------------

**Prinsip kerja:** jangan menganggap dataset bersih atau AI siap hanya
karena file berhasil diunduh dan skrip audit berhasil dijalankan. Simpan
data mentah, laporan audit, dan hasil kurasi secara terpisah agar setiap
keputusan dapat ditelusuri.
