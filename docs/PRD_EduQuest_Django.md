# Product Requirements Document (PRD) --- EduQuest

**Versi:** 2.0 --- konsolidasi kebutuhan produk\
**Tanggal:** 21 Oktober 2026\
**Status:** Draf kerja untuk validasi tim\
**Manajer proyek:** Mochamad Ramdhan Irawan\
**Periode proyek acuan:** 12 Oktober--11 Desember 2026\
**Stack terkini:** Python, Django, SQLite, Django Templates, HTML, CSS,
JavaScript, Figma\
**Dokumen terkait:** PRD AI EduQuest terpisah; ringkasan status proyek
dan audit dataset

> Dokumen ini mengonsolidasikan kebutuhan produk dari PRD sebelumnya dan
> addendum AI. Klarifikasi terbaru bahwa framework web adalah **Django**
> menggantikan penyebutan Flask dalam dokumen lama. Fitur dan keputusan
> yang belum disetujui secara eksplisit ditandai sebagai usulan atau
> perlu dikonfirmasi.

------------------------------------------------------------------------

## 1. Tujuan dokumen

Dokumen ini menjadi acuan kebutuhan produk, ruang lingkup MVP, kebutuhan
fungsional/nonfungsional, alur pengguna, rancangan data awal, pengujian,
risiko, dan kriteria penerimaan EduQuest. Dokumen ini tetap spesifikasi
produk; status implementasi terbaru dirujuk ke `Ringkasan_Status_Proyek_EduQuest_baru.md`.

## 2. Ringkasan produk

EduQuest adalah website pembelajaran interaktif untuk siswa SD, SMP,
SMA/SMK. Pengguna memilih jenjang, mata pelajaran, dan materi;
mempelajari konten; lalu menguji pemahaman melalui kuis atau permainan
edukatif. Sistem menampilkan hasil, progres, XP, level, rank, dan nyawa
per mata pelajaran. Kuis memberi umpan balik langsung per soal; jawaban
salah pertama memunculkan satu hint, sedangkan jawaban salah kedua
membuka kunci dan penjelasan sebelum lanjut. AI direncanakan mendukung
penjelasan belajar, pembuatan soal, hint kuis, serta rekomendasi latihan
adaptif.

### 2.1 Masalah yang ingin diselesaikan

-   Siswa membutuhkan akses materi dan latihan yang terorganisasi sesuai
    jenjang.
-   Pembelajaran mandiri perlu umpan balik yang mudah dipahami.
-   Latihan perlu memiliki tingkat tantangan yang sesuai dengan
    perkembangan siswa.
-   Siswa membutuhkan bantuan ketika tidak memahami konsep.

### 2.2 Visi

Menggabungkan belajar, bermain, progres yang terlihat, dan bantuan AI
dalam satu platform pembelajaran mandiri.

### 2.3 Tujuan produk

1.  Memudahkan akses materi berdasarkan jenjang dan mata pelajaran.
2.  Menyediakan kuis dengan penilaian dan umpan balik.
3.  Mendorong keterlibatan melalui gamifikasi yang konsisten.
4.  Menampilkan riwayat dan perkembangan belajar.
5.  Memberikan bantuan AI yang terkait dengan materi aktif.
6.  Menyediakan latihan adaptif yang transparan dan dapat dievaluasi.
7.  Memastikan alur inti tetap berjalan saat layanan AI tidak tersedia.

## 3. Pengguna dan kebutuhan

  -----------------------------------------------------------------------
  Persona                 Kebutuhan               Cakupan MVP
  ----------------------- ----------------------- -----------------------
  Siswa SD                Bahasa sederhana,       Ya
                          instruksi jelas,        
                          latihan singkat,        
                          pengalaman aman         

  Siswa SMP               Materi dan latihan per  Ya
                          topik dengan tantangan  
                          bertahap                

  Siswa SMA/SMK           Materi lebih mendalam   Ya
                          dan latihan terarah     

  Guru                    Media pendukung belajar Belum menjadi fokus

  Orang tua               Mendukung belajar       Belum menjadi fokus
                          mandiri                 

  Pengelola/admin konten  Mengelola materi, soal, Perlu diputuskan;
                          dan metadata            Django Admin dapat
                                                  menjadi pilihan
  -----------------------------------------------------------------------

Login/akun diperlukan untuk menyimpan progres lintas sesi/perangkat.
Alur registrasi, autentikasi token, dan penggunaan progres tanpa akun
harus mengikuti keputusan produk yang terdokumentasi.

## 4. Stack dan arsitektur tingkat tinggi

  Komponen            Teknologi/keputusan
  ------------------- -------------------------------------------
  Web framework       Django
  Bahasa              Python
  Database awal       SQLite
  Template            Django Templates
  Frontend            HTML, CSS, JavaScript
  UI/UX               Figma
  Pengelolaan kerja   Trello
  Dokumentasi         Markdown/Google Drive
  AI                  Provider/model tersedia, belum ditentukan
  Model ML kustom     Tidak diperlukan untuk MVP

### 4.1 Prinsip arsitektur

-   Gunakan Django views untuk menerima request dan mengatur alur
    aplikasi.
-   Letakkan logika bisnis penting di service/module yang terpisah dari
    view.
-   Gunakan Django ORM dan migrasi untuk skema data.
-   Validasi input di server.
-   Hitung nilai kuis, XP, level, rank, nyawa per mata pelajaran, dan
    progres di backend, bukan mempercayai data dari browser.
-   Simpan kredensial AI di environment variables atau konfigurasi
    rahasia, bukan di source code atau frontend.
-   Pertahankan fallback bank soal agar alur kuis tidak bergantung penuh
    pada provider AI.
-   Gunakan Django Admin untuk pengelolaan internal jika sesuai, dengan
    akses yang dibatasi.

Struktur modul adalah rancangan awal, bukan representasi kode yang sudah
tersedia.

## 5. Ruang lingkup

### 5.1 Dalam ruang lingkup MVP --- Must

1.  Katalog jenjang SD, SMP, SMA/SMK.
2.  Katalog mata pelajaran per jenjang.
3.  Katalog dan halaman materi.
4.  Hubungan materi prasyarat.
5.  Bank soal yang dapat ditinjau.
6.  Kuis pilihan ganda dengan penilaian backend.
7.  Riwayat percobaan dan hasil kuis.
8.  Progres belajar dasar.
9.  Gamifikasi dasar: XP, level, rank, dan aturan nyawa per mata
    pelajaran.
10. Pemilihan latihan berbasis aturan.
11. Generator soal AI dengan validasi dan fallback jika kapasitas/waktu
    memungkinkan dalam MVP.
12. Penanganan kegagalan AI tanpa memutus alur belajar.
13. Pengujian fungsional dan integrasi inti.

**Catatan prioritas:** Jika waktu terbatas, selesaikan katalog, materi,
bank soal, kuis, penilaian, dan progres terlebih dahulu. Generator AI
dan AI Tutor tidak boleh menghambat alur belajar dasar.

### 5.2 Should --- jika fitur inti stabil

-   AI Tutor dengan konteks materi aktif.
-   Petunjuk dan penjelasan yang dihasilkan AI.
-   Rekomendasi latihan berdasarkan pola kesalahan.
-   Dashboard progres yang lebih terperinci.
-   Riwayat percakapan AI dengan batas retensi yang jelas.
-   Eksperimen model ML yang dibandingkan dengan baseline rule-based.

### 5.3 Di luar cakupan awal

-   Aplikasi native Android/iOS.
-   Kelas live atau konferensi video.
-   Sistem administrasi sekolah lengkap.
-   Pembayaran/langganan.
-   Integrasi sistem akademik sekolah.
-   Melatih LLM dari nol.
-   Menjamin cakupan seluruh kurikulum SD--SMA/SMK dalam versi pertama.
-   Menggunakan model ML untuk menentukan nilai tanpa verifikasi.

## 6. Kebutuhan fungsional

  ----------------------------------------------------------------------------
  ID                Fitur             Persyaratan            Prioritas
  ----------------- ----------------- ---------------------- -----------------
  FR-01             Pemilihan jenjang Pengguna dapat memilih Must
                                      SD, SMP, SMA/SMK       

  FR-02             Katalog pelajaran Pelajaran ditampilkan  Must
                                      berdasarkan jenjang    

  FR-03             Katalog materi    Materi dikelompokkan   Must
                                      menurut                
                                      pelajaran/topik        

  FR-04             Detail materi     Pengguna dapat membaca Must
                                      materi dan melihat     
                                      metadata/topik         

  FR-05             Prasyarat         Sistem dapat menyimpan Must
                                      materi prasyarat       

  FR-06             Status materi     Sistem mencatat status Must
                                      materi jika            
                                      identitas/progres      
                                      pengguna tersedia      

  FR-07             Bank soal         Soal terkurasi dapat   Must
                                      disimpan dengan opsi,  
                                      kunci, topik,          
                                      kesulitan, dan status  
                                      tinjauan               

  FR-08             Mulai kuis        Pengguna mendapat soal Must
                                      yang sesuai materi dan 
                                      tingkat yang dipilih   

  FR-09             Submit jawaban    Backend menerima       Must
                                      jawaban dan            
                                      memvalidasi            
                                      format/akses           

  FR-10             Penilaian         Backend mencocokkan    Must
                                      jawaban dengan kunci   
                                      tersimpan              

  FR-11             Hasil kuis        Pengguna melihat skor  Must
                                      dan umpan balik yang   
                                      sesuai                 

  FR-12             Riwayat           Percobaan dan hasil    Must
                                      disimpan secara        
                                      konsisten              

  FR-13             XP                XP diberikan menurut   Must
                                      aturan aktivitas yang  
                                      terdokumentasi         

  FR-14             Level             Level ditentukan dari  Must
                                      total XP dengan ambang 
                                      konfigurasi            

  FR-15             Nyawa per mapel   Nyawa berubah          Must
                                      berdasarkan aturan     
                                      kuis dan pulih 1 per   
                                      2 jam                  

  FR-16             Adaptasi          Tingkat latihan        Must
                                      berikutnya ditentukan  
                                      oleh mesin rule-based  
                                      dan dibatasi rank      

  FR-17             Fallback          Saat generator AI      Must bila
                                      gagal/tidak valid,     generator masuk
                                      sistem memakai bank    MVP
                                      soal yang cocok        

  FR-18             AI Question       Membuat draf soal      Should/Must
                    Generator         terstruktur sesuai     sesuai keputusan
                                      konteks yang diizinkan MVP

  FR-19             AI Tutor          Menjelaskan konsep dan Should
                                      memberi petunjuk dalam 
                                      konteks materi         

  FR-20             Rank              Rank diturunkan dari   Must
                                      XP; rank membuka       
                                      tingkat kuis dan       
                                      dapat diubah admin     

  FR-21             Progres           Pengguna dapat melihat Must
                                      ringkasan perkembangan 

  FR-22             Admin konten      Pengelola berwenang    Should; metode
                                      dapat                  perlu ditentukan
                                      menambah/memperbarui   
                                      materi dan soal        
  ----------------------------------------------------------------------------

## 7. User stories dan kriteria penerimaan

### US-01 --- Memilih materi

**Sebagai siswa**, saya ingin memilih jenjang dan mata pelajaran agar
menemukan materi yang relevan.

Kriteria: - Pilihan jenjang tampil dengan jelas. - Mata pelajaran yang
tampil terkait dengan jenjang. - Materi memiliki judul, topik, dan
konten yang dapat dibuka. - Kondisi katalog kosong ditangani dengan
pesan yang jelas.

### US-02 --- Mempelajari materi

**Sebagai siswa**, saya ingin membaca materi sebelum mengerjakan
latihan.

Kriteria: - Konten tampil dengan benar di browser modern. - Materi dapat
ditandai selesai sesuai aturan yang ditetapkan. - Status penyelesaian
tidak dapat dipalsukan hanya melalui perubahan data di browser.

### US-03 --- Mengerjakan kuis

**Sebagai siswa**, saya ingin menjawab soal dan mengetahui hasilnya.

Kriteria:
- Sistem menampilkan soal dan opsi yang valid.
- Kunci jawaban tidak dikirim ke frontend sebelum soal diselesaikan.
- Jawaban dinilai di backend dan umpan balik diberikan langsung per soal.
- Soal tidak boleh dilewati; soal yang belum selesai harus dijawab lebih dulu.
- Jawaban salah pertama mengurangi 1 nyawa mata pelajaran, menampilkan
  tepat satu hint yang tidak membocorkan kunci, dan mempertahankan soal
  yang sama.
- Jawaban salah kedua mengurangi 1 nyawa lagi, membuka kunci dan
  penjelasan, lalu melanjutkan ke soal berikutnya.
- Jawaban benar memberi XP dan melanjutkan ke soal berikutnya.
- Sesi berakhir saat semua soal selesai atau nyawa mata pelajaran habis.
- Percobaan dan hasil tersimpan; pengiriman jawaban ganda tidak
  menggandakan reward.

### US-04 --- Melihat progres dan gamifikasi

**Sebagai siswa**, saya ingin melihat XP, level, rank, dan nyawa per mata
pelajaran.

Kriteria:
- XP dihitung oleh backend.
- Level berubah sesuai ambang yang ditetapkan.
- Rank diturunkan dari XP dan dapat diubah melalui tabel rank di admin.
- Nyawa disimpan per mata pelajaran; kehilangan nyawa di satu mapel tidak
  mengurangi nyawa mapel lain.
- Satu nyawa pulih setiap 2 jam per mapel, maksimal 3 nyawa.
- Tingkat kuis 2 dan 3 terkunci sampai rank tertentu tercapai.
- Perubahan progres tersimpan secara konsisten.
- Jika pengguna belum login, perilaku progres mengikuti keputusan produk
  yang terdokumentasi.

### US-05 --- Latihan adaptif

**Sebagai siswa**, saya ingin latihan berikutnya sesuai perkembangan
saya.

Kriteria: - Sistem menggunakan lebih dari satu jawaban untuk membuat
keputusan, bukan bereaksi berlebihan terhadap satu jawaban. - Aturan dan
ambang dapat dikonfigurasi. - Keputusan adaptasi menyimpan alasan dan
tingkat sebelumnya/berikutnya. - Jika data tidak cukup, sistem
menggunakan tingkat default atau latihan penguatan.

### US-06 --- AI Tutor

**Sebagai siswa**, saya ingin meminta penjelasan atau petunjuk saat
kesulitan.

Kriteria: - Tutor menerima konteks materi aktif yang diperlukan. - Tutor
menjawab dengan bahasa sesuai usia/jenjang jika dapat dikendalikan. -
Tutor tidak mengklaim kepastian saat konteks tidak cukup. -
Kegagalan/timeout provider menampilkan pesan yang jelas. - Tersedia
jalur bantuan non-AI seperti materi dan soal bank. - Hint kuis memakai
urutan manual (`Question.hint`) → AI Tutor → aturan berbasis materi, dan
tidak boleh menyebut kunci jawaban.

### US-07 --- Pembuatan soal AI

**Sebagai sistem**, saya ingin menghasilkan draf soal terstruktur yang
dapat divalidasi.

Kriteria: - Output memenuhi skema. - Jumlah opsi, tipe data, topik, dan
tingkat kesulitan diperiksa. - Jawaban dan penjelasan tidak kosong jika
diwajibkan skema. - Hasil tidak valid tidak ditampilkan sebagai soal
resmi. - Soal yang belum ditinjau diberi status yang sesuai dan tidak
otomatis dianggap bank soal terverifikasi.

## 8. Aturan gamifikasi

Aturan yang berlaku pada implementasi backend saat ini:

- **XP jawaban benar:** +10 XP per soal yang akhirnya dijawab benar.
  Hint dan percobaan kedua tetap boleh mendapat XP.
- **XP materi:** +15 XP saat materi ditandai selesai, sekali per materi.
- **Level:** XP dari level L ke L+1 = 100 × L. Level 1 = 0 XP, level 2 =
  100 XP total, level 3 = 300 XP, level 4 = 600 XP, level 5 = 1.000 XP.
- **Rank:** diturunkan dari XP melalui tabel `Rank` yang dapat diubah di
  Django Admin (`name`, `order`, `min_xp`, `unlocked_difficulty`, `icon`,
  `description`, `is_active`). Rank terendah adalah **Ayam** (0 XP).
  Nama rank di atas Ayam masih placeholder dan belum final.
- **Buka tingkat kuis:** tingkat 1 (Dasar) terbuka pada rank awal;
  tingkat 2 (Menengah) terbuka saat rank dengan `unlocked_difficulty=2`;
  tingkat 3 (Lanjut) terbuka saat rank dengan `unlocked_difficulty=3`.
- **Nyawa:** maksimal 3 per mata pelajaran. Jawaban salah pertama dan
  kedua masing-masing mengurangi 1 nyawa mapel tersebut.
- **Regenerasi:** 1 nyawa pulih setiap 2 jam per mapel, dihitung malas
  saat progres dibaca. Timer tidak di-reset ketika nyawa kembali
  berkurang selama interval berjalan.
- **Nyawa habis:** sesi kuis langsung selesai; soal yang belum dijawab
  dihitung tidak dijawab. Memulai kuis baru pada mapel dengan 0 nyawa
  ditolak sampai nyawa pulih.
- **Anti-farming:** XP jawaban benar idempoten per `QuizQuestion`; XP
  materi idempoten per materi; jawaban ganda pada soal yang sama ditolak.
- **Adaptasi:** keputusan tetap memakai mesin aturan dengan jendela
  riwayat, tetapi target tingkat dibatasi oleh rank yang sudah terbuka.

Prinsip wajib: - Aturan reward terpusat di backend. - Hasil tidak
dihitung dari nilai yang dikirim browser. - Reward dan pencatatan hasil
dilakukan dalam transaksi yang konsisten. - Nilai konfigurasi dapat
diubah tanpa menyalin logika di banyak tempat.

## 9. Alur pengguna utama

1.  Pengguna membuka EduQuest.
2.  Memilih jenjang.
3.  Memilih mata pelajaran.
4.  Memilih materi.
5.  Membaca materi dan prasyarat yang relevan.
6.  Memulai latihan; sistem menampilkan tingkat yang terbuka sesuai rank.
7.  Sistem memilih soal dari bank atau hasil generator yang telah
    divalidasi.
8.  Pengguna menjawab satu soal; backend langsung menilai.
9.  Jika salah pertama: nyawa mapel −1, tampilkan satu hint, soal yang
    sama tetap aktif.
10. Jika salah kedua: nyawa mapel −1, buka kunci dan penjelasan, lalu
    lanjut ke soal berikutnya.
11. Jika benar: beri XP, lalu lanjut ke soal berikutnya.
12. Sesi selesai saat semua soal selesai atau nyawa mapel habis; sistem
    menyimpan percobaan dan memperbarui progres/gamifikasi.
13. Mesin adaptasi memilih rekomendasi atau tingkat berikutnya, dibatasi
    rank yang terbuka.
14. Pengguna melihat hasil dan dapat meminta bantuan AI Tutor.
15. Jika AI gagal, pengguna tetap dapat membuka materi dan bank soal.

## 10. Rancangan data awal

Rancangan ini konseptual; nama dan relasi final ditetapkan saat ERD dan
model Django dibuat.

  -----------------------------------------------------------------------
  Entitas/tabel                       Tujuan dan data penting
  ----------------------------------- -----------------------------------
  `User`                              Django authentication/user identity
                                      bila login diterapkan

  `EducationLevel`                    SD, SMP, SMA/SMK

  `Subject`                           Mata pelajaran dan jenjang

  `Material`                          Judul, isi, topik, status
                                      publikasi, jenjang/pelajaran

  `MaterialPrerequisite`              Relasi materi dan prasyarat

  `UserMaterialProgress`              Status belajar dan waktu
                                      penyelesaian

  `Question`                          Pertanyaan, opsi, kunci, topik,
                                       kesulitan, sumber, status tinjauan,
                                       hint manual opsional

  `QuestionGeneration`                Metadata proses generasi, provider,
                                       status validasi, pesan error

  `QuizAttempt`                       Percobaan kuis, pengguna/sesi,
                                       skor, waktu, status

  `QuizQuestion`                      Soal dalam sesi: urutan, tingkat,
                                       jawaban terpilih, benar/salah,
                                       jumlah percobaan, status selesai,
                                       hint yang dipakai dan sumbernya

  `SubjectProgress`                   Nyawa per mata pelajaran dan timer
                                       regenerasi 2 jam

  `UserProgress`                      XP, level, dan ringkasan progres

  `Rank`                              Nama, urutan, ambang XP, tingkat
                                       kuis yang terbuka, ikon, status

  `Achievement`                       Definisi pencapaian (data lama;
                                       rank menjadi progres utama)

  `UserAchievement`                   Pencapaian pengguna (data lama)

  `AdaptationEvent`                   Keputusan tingkat, alasan,
                                      rule/model, waktu

  `TutorConversation` (opsional)      Metadata percakapan jika retensi
                                      percakapan dibutuhkan
  -----------------------------------------------------------------------

Gunakan foreign key dan indeks yang sesuai. Data yang disimpan harus
seminimal mungkin. Kunci jawaban dan informasi internal tidak boleh
dikirim sebelum diperlukan.

## 11. Kebutuhan UI/UX

UI dirancang di Figma sebelum implementasi. Halaman yang
direncanakan: 1. Landing/dashboard. 2. Pemilihan jenjang. 3. Katalog
mata pelajaran. 4. Katalog dan detail materi. 5. Halaman kuis. 6. Hasil
kuis. 7. Progres, XP, level, rank, dan nyawa per mata pelajaran. 8. AI
Tutor. 9. Login/profil jika akun diterapkan. 10. Halaman admin internal
bila diperlukan.

Prinsip: - Navigasi sederhana dan konsisten. - Responsif di laptop dan
ponsel. - Kontras dan ukuran teks memadai. - Instruksi disesuaikan
dengan rentang usia. - Jangan hanya menggunakan warna untuk menyampaikan
status. - Berikan loading, empty, error, dan success states.

## 12. Kebutuhan nonfungsional

  -----------------------------------------------------------------------
  ID                      Aspek                   Persyaratan
  ----------------------- ----------------------- -----------------------
  NFR-01                  Usability               Alur utama dapat
                                                  dipahami tanpa
                                                  instruksi teknis

  NFR-02                  Responsif               Layout beradaptasi
                                                  dengan layar laptop dan
                                                  ponsel

  NFR-03                  Performa                Halaman inti memuat
                                                  dalam waktu wajar;
                                                  target numerik
                                                  ditetapkan saat
                                                  pengujian

  NFR-04                  Keamanan                Validasi server,
                                                  kontrol akses, proteksi
                                                  CSRF Django, dan
                                                  pengelolaan rahasia

  NFR-05                  Privasi                 Minimasi data, akses
                                                  terbatas, dan kebijakan
                                                  retensi

  NFR-06                  Integritas              Skor, XP, level, rank,
                                                  nyawa per mapel, dan
                                                  progres konsisten di
                                                  database

  NFR-07                  Reliabilitas AI         Timeout, batas retry,
                                                  fallback, dan pesan
                                                  kegagalan

  NFR-08                  Maintainability         Modul bisnis dipisahkan
                                                  dari views/templates

  NFR-09                  Kompatibilitas          Browser modern yang
                                                  ditentukan tim

  NFR-10                  Auditabilitas           Perubahan adaptasi dan
                                                  status validasi soal
                                                  dapat ditelusuri
  -----------------------------------------------------------------------

## 13. Keamanan, privasi, dan keselamatan pengguna

-   Gunakan autentikasi dan otorisasi Django bila fitur akun diterapkan.
-   Jangan menyimpan password sebagai teks biasa.
-   Jangan memasukkan API key ke JavaScript/browser atau repositori
    publik.
-   Validasi semua input di backend.
-   Jangan mempercayai skor, XP, level, rank, nyawa, kunci jawaban, atau
    status admin dari klien.
-   Batasi panjang input AI, jumlah soal, retry, dan timeout.
-   Hindari meminta informasi pribadi siswa yang tidak dibutuhkan.
-   Jangan memasukkan data identitas siswa ke prompt provider kecuali
    benar-benar diperlukan dan disetujui.
-   Sediakan cara melaporkan soal/penjelasan yang keliru.
-   Materi dan dataset harus memiliki dasar penggunaan yang jelas.
-   Siapkan penanganan jawaban AI yang tidak relevan, tidak aman, atau
    tidak pasti.

## 14. Pengujian dan quality assurance

  -----------------------------------------------------------------------
  Jenis                               Fokus
  ----------------------------------- -----------------------------------
  Unit testing                        Scoring, gamification, validator,
                                      selector, adaptive engine

  Integration testing                 Django views/services dengan
                                      database dan provider AI mock

  Database testing                    Relasi, transaksi, penyimpanan
                                      percobaan, progres

  UI testing                          Navigasi, validasi form, layout
                                      responsif

  Failure testing                     Timeout, API error, output AI
                                      invalid, bank soal kosong

  Security testing                    Akses tanpa izin, CSRF, validasi
                                      input, kebocoran kunci jawaban

  Acceptance testing                  Siswa/calon pengguna menyelesaikan
                                      alur utama
  -----------------------------------------------------------------------

### Kriteria kelulusan MVP

-   Katalog dan materi dapat diakses.
-   Kuis dapat diselesaikan dan dinilai server-side.
-   Riwayat dan progres tersimpan konsisten.
-   XP/level/rank dan nyawa per mata pelajaran mengikuti aturan yang
    telah disepakati.
-   Kuis memberi hint pada salah pertama dan membuka kunci pada salah
    kedua tanpa mengirim kunci sebelum soal diselesaikan.
-   Tingkat kuis 2 dan 3 hanya terbuka sesuai rank.
-   Kegagalan AI tidak memblokir kuis berbasis bank soal.
-   Tidak ada masalah kritis pada alur belajar utama.
-   Semua fitur Must yang disetujui memiliki hasil pengujian yang
    terdokumentasi.

## 15. Indikator keberhasilan

Indikator awal: - Fitur Must lulus pengujian. - Pengguna dapat
menyelesaikan alur dari pemilihan materi hingga hasil kuis. - Tidak ada
ketidaksesuaian skor pada kasus uji yang ditetapkan. - Progres tetap
konsisten setelah halaman dimuat ulang. - Generator AI, jika masuk MVP,
lolos validasi atau fallback dengan benar. - Tutor, jika tersedia,
menangani kegagalan layanan secara jelas.

Target numerik seperti waktu respons, kepuasan, atau tingkat
penyelesaian harus ditetapkan setelah skenario uji dan sampel pengguna
disepakati. Jangan mengklaim peningkatan hasil belajar tanpa studi
evaluasi.

## 16. Rencana pengembangan dan fase

  -----------------------------------------------------------------------
  Fase                    Perkiraan jadwal acuan  Output
  ----------------------- ----------------------- -----------------------
  Analisis dan            12--18 Oktober 2026     PRD, prioritas, alur
  spesifikasi                                     pengguna

  UI/UX dan rancangan     19--25 Oktober 2026     Figma, ERD, model data
  data                                            awal

  Fitur inti              26 Oktober--15 November Materi, kuis,
                          2026                    penilaian, progres,
                                                  gamifikasi dasar

  AI                      16--22 November 2026    Generator/Tutor sesuai
                                                  prioritas final

  Pengujian/perbaikan     23 November--6 Desember Hasil tes dan perbaikan
                          2026                    

  Finalisasi/deployment   7--11 Desember 2026     Demo yang siap diuji
  -----------------------------------------------------------------------

Ini adalah jadwal awal dari dokumen proyek. Karena audit dataset masih
berlangsung pada tanggal dokumen, manajer proyek perlu memvalidasi ulang
dependensi dan kapasitas tim.

## 17. Risiko

  -----------------------------------------------------------------------
  Risiko                  Dampak                  Mitigasi
  ----------------------- ----------------------- -----------------------
  Cakupan fitur terlalu   MVP tidak selesai tepat Prioritaskan alur inti
  besar                   waktu                   

  Dataset tidak relevan   Soal tidak sesuai       Audit sumber dan kurasi
  dengan kurikulum        target                  lokal

  Duplikasi lintas split  Evaluasi AI bias        Split berdasarkan
                                                  grup/varian, bukan
                                                  baris acak

  AI membuat soal salah   Pembelajaran keliru     Validator, bank soal
                                                  tinjauan, pelaporan

  Provider AI gagal/mahal Fitur terganggu         Fallback, batas
                                                  penggunaan

  Skor/reward dapat       Progres tidak dapat     Semua perhitungan di
  dimanipulasi            dipercaya               backend

  Data siswa terlalu      Risiko privasi          Minimasi dan retensi
  banyak                                          terbatas

  Framework dokumen tidak Salah implementasi      Jadikan Django sebagai
  konsisten                                       stack acuan dan revisi
                                                  dokumen lama
  -----------------------------------------------------------------------

## 18. Asumsi dan keputusan yang masih terbuka

Keputusan gamifikasi utama (XP, ambang level, rank, nyawa per mapel, dan
regenerasi 2 jam) sudah diterapkan seperti pada §8. Tim masih perlu
memutuskan dan mencatat:

1. Nama final rank di atas **Ayam**; nama saat ini placeholder dan dapat
   diubah di Django Admin.
2. Jumlah soal per sesi dan jumlah percobaan (implementasi saat ini: 5
   soal per sesi, maksimal 2 jawaban per soal sebelum kunci dibuka).
3. Format soal awal (implementasi saat ini: pilihan ganda).
4. Provider AI dan anggaran pemakaian.
5. Apakah generator AI masuk MVP atau menjadi fase berikutnya.
6. Siapa yang meninjau materi dan bank soal.
7. Sumber kurikulum dan kebijakan lisensi.
8. Retensi data percakapan AI.
9. Target performa terukur.
10. Kriteria kapan ML boleh diuji dan/atau digunakan.

## 19. Referensi dan dokumen terkait

-   `Proyek-EduQuest.txt` --- ide awal proyek dan anggota tim; stack di
    dalamnya menyebut Flask dan perlu diperbarui mengikuti keputusan
    Django.
-   `PRD_EduQuest.md` --- PRD awal tanggal 13 Oktober 2026.
-   `Addendum_PRD_EduQuest_AI_Adaptif.md` --- strategi generator soal,
    adaptasi rule-based, dan rencana eksperimen ML; penyebutan Flask di
    dalamnya perlu diperbarui.
-   `EduQuest — Ringkasan Proyek dan Status Pengerjaan.md` --- catatan
    status dataset dan langkah kerja.

------------------------------------------------------------------------

## 20. Persetujuan

  Peran                      Nama                      Status
  -------------------------- ------------------------- ---------------------
  Project Manager            Mochamad Ramdhan Irawan   Menunggu review
  Tim pengembang             Anggota tim EduQuest      Menunggu review
  Pemilik kebutuhan produk   Perlu ditentukan          Menunggu konfirmasi

**Catatan:** PRD ini adalah spesifikasi kerja. Perubahan fitur, stack,
dan jadwal harus dicatat sebagai keputusan tim; keberadaan fitur dalam
dokumen tidak berarti fitur telah selesai dibuat.
