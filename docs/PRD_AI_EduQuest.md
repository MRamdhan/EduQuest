# PRD AI --- EduQuest: AI Tutor, AI Question Generator, dan Adaptive Learning

**Versi:** 1.0 --- konsolidasi addendum AI\
**Tanggal:** 21 Oktober 2026\
**Status:** Draf spesifikasi; menunggu validasi tim\
**Stack aplikasi:** Python, Django, SQLite, Django Templates\
**Prinsip:** generator hibrida; adaptasi rule-based dahulu, ML sebagai
eksperimen lanjutan\
**Dokumen induk:** PRD EduQuest

> Dokumen ini menjelaskan kebutuhan AI secara khusus. Rancangan ini
> tidak menyatakan model, provider, endpoint, atau integrasi telah
> dipilih atau diimplementasikan.

------------------------------------------------------------------------

## 1. Ringkasan

AI EduQuest memiliki tiga komponen yang berbeda:

1.  **AI Tutor** --- menjelaskan materi, memberi petunjuk, dan membantu
    siswa memahami konsep.
2.  **AI Question Generator** --- membuat draf soal berdasarkan materi
    yang dipelajari, jenjang, prasyarat, dan target kesulitan.
3.  **Adaptive Learning Engine** --- memilih latihan/tingkat berikutnya
    berdasarkan riwayat hasil siswa. MVP memakai aturan transparan; ML
    baru dievaluasi setelah data dan label cukup.

Komponen tersebut harus beroperasi dengan batas yang jelas. Generative
AI bukan sumber kebenaran tunggal. Kunci jawaban dan penilaian kuis
berasal dari data yang tervalidasi dan diproses backend. Soal AI yang
belum ditinjau tidak otomatis menjadi soal resmi.

## 2. Tujuan AI

-   Membantu siswa memahami materi, bukan hanya memberikan jawaban
    akhir.
-   Menghasilkan draf soal relevan dan terstruktur.
-   Menjaga soal sesuai jenjang, materi aktif, dan prasyarat yang
    relevan.
-   Menyesuaikan latihan menggunakan bukti dari beberapa percobaan.
-   Menyimpan jejak keputusan adaptasi untuk audit dan evaluasi.
-   Mempertahankan fungsi kuis saat AI gagal melalui bank soal fallback.
-   Menyediakan jalur eksperimen ML yang dapat dibandingkan dengan
    baseline rule-based.

## 3. Non-goals

-   Melatih LLM dari nol.
-   Mengklaim AI selalu benar.
-   Membiarkan AI menjadi satu-satunya pemeriksa kunci jawaban.
-   Mengubah tingkat kesulitan hanya berdasarkan satu jawaban.
-   Menggunakan data pribadi siswa yang tidak diperlukan.
-   Menggunakan soal dari sumber yang hak penggunaannya tidak jelas.
-   Mengaktifkan ML di produksi tanpa evaluasi dan fallback.

## 4. Ruang lingkup dan prioritas

  -----------------------------------------------------------------------
  Fitur                   Prioritas rancangan     Catatan
  ----------------------- ----------------------- -----------------------
  Bank soal fallback      Must                    Kuis inti tidak boleh
  terkurasi                                       bergantung sepenuhnya
                                                  pada AI

  Validasi output         Must jika generator     Validasi skema, opsi,
  generator               digunakan               kunci, topik, kesulitan

  Selector soal           Must                    Memilih soal sesuai
                                                  materi dan kesulitan

  Adaptive engine         Must                    Keputusan dapat
  rule-based                                      dijelaskan

  Penilaian backend       Must                    Kunci jawaban tidak
                                                  dipercayakan kepada
                                                  model

  Logging                 Must                    Hindari log data
  generasi/validasi                               pribadi berlebihan

  AI Question Generator   Must/Should sesuai      Bisa dibatasi ke draf
                          kapasitas MVP           atau mode internal
                                                  terlebih dahulu

  AI Tutor                Should                  Konteks materi aktif
                                                  dan batas penggunaan

  Rekomendasi berbasis    Should                  Membutuhkan tag konsep
  kesalahan konsep                                yang baik

  ML rekomendasi/prediksi Eksperimen lanjutan     Tidak menjadi
                                                  dependency MVP
  -----------------------------------------------------------------------

## 5. Arsitektur AI konseptual

Alur umum:

1.  Django view menerima permintaan dari pengguna dan memvalidasi
    identitas/akses.
2.  Service mengambil materi aktif, metadata jenjang/topik, prasyarat,
    dan ringkasan progres minimum yang diperlukan.
3.  Selector/adaptive engine menentukan target kesulitan atau jenis
    bantuan.
4.  Service memanggil provider AI jika fitur memerlukannya.
5.  Output diperiksa oleh validator server.
6.  Output valid digunakan sesuai statusnya; output tidak valid ditolak
    atau dialihkan ke fallback.
7.  Hasil kuis dinilai oleh backend menggunakan kunci yang tersimpan.
8.  Percobaan dan event adaptasi dicatat.
9.  UI menampilkan hasil dan rekomendasi yang sesuai.

### Prinsip arsitektur

-   Provider AI dibungkus dalam adapter/service agar dapat diganti.
-   API key berada di environment/config rahasia.
-   Views tidak memuat seluruh logika prompt, validasi, scoring, dan
    adaptasi.
-   Semua output model dianggap tidak tepercaya sampai divalidasi.
-   Gunakan timeout, retry terbatas, batas panjang input/output, dan
    rate limiting yang sesuai.
-   Jangan kirim kunci jawaban ke prompt jika tidak diperlukan.
-   Jangan menyimpan chain-of-thought; simpan hasil, metadata, dan
    alasan keputusan yang ringkas.

## 6. AI Question Generator

### 6.1 Input yang diperbolehkan

-   ID dan konten materi aktif yang telah disetujui.
-   Jenjang pendidikan.
-   Mata pelajaran, topik, dan tag konsep.
-   Daftar prasyarat yang relevan.
-   Target tingkat kesulitan.
-   Jenis soal dan jumlah soal yang dibatasi.
-   Bahasa keluaran, awalnya Bahasa Indonesia jika konten sumber
    mendukung.

Jangan masukkan nama lengkap, alamat, nomor identitas, atau data
sensitif siswa ke prompt. Riwayat siswa sebaiknya diberikan dalam bentuk
ringkasan agregat minimum, bukan seluruh log mentah.

### 6.2 Alur generasi

1.  Pengguna menyelesaikan/memilih materi.
2.  Backend memeriksa bahwa materi dan prasyarat yang relevan tersedia.
3.  Adaptive engine atau aturan sesi memilih target kesulitan.
4.  Generator meminta sejumlah soal dalam skema yang disepakati.
5.  Validator memeriksa struktur, opsi, jawaban, penjelasan, topik,
    jenjang, dan konsistensi.
6.  Hasil yang lolos validasi diberi status draf/validasi sesuai
    kebijakan; bukan otomatis menjadi soal bank terverifikasi.
7.  Jika generasi gagal atau output tidak valid, selector mengambil soal
    bank yang cocok.
8.  Siswa mengerjakan soal; backend menilai menggunakan kunci yang
    tersimpan.
9.  Hasil dan metadata disimpan untuk progres dan audit.

### 6.3 Kontrak output internal

Contoh JSON untuk satu soal pilihan ganda:

``` json
{
  "topic_id": 12,
  "grade_band": "SMP",
  "difficulty": 2,
  "question_type": "multiple_choice",
  "question_text": "Jika 2x + 3 = 11, berapakah nilai x?",
  "options": [
    {"key": "A", "text": "2"},
    {"key": "B", "text": "4"},
    {"key": "C", "text": "5"},
    {"key": "D", "text": "7"}
  ],
  "correct_option": "B",
  "explanation": "Kurangi kedua ruas dengan 3 sehingga 2x = 8, lalu bagi 2.",
  "concept_tags": ["persamaan-linear"]
}
```

Ini adalah kontrak ilustratif, bukan soal tervalidasi. Nama field final
dapat disesuaikan dengan model data Django.

### 6.4 Validasi wajib

-   JSON/schema valid.
-   Jenis soal didukung.
-   Jumlah opsi sesuai aturan untuk tipe soal.
-   Setiap opsi memiliki key unik dan teks tidak kosong.
-   `correct_option` menunjuk ke opsi yang benar-benar ada.
-   Pertanyaan dan penjelasan tidak kosong jika diwajibkan.
-   Materi, jenjang, topik, dan kesulitan sesuai permintaan.
-   Tidak ada teks yang menyuruh model mengabaikan batasan sistem atau
    membocorkan data.
-   Tidak ada materi yang jelas di luar konteks yang diizinkan.
-   Tidak ada duplikat yang tak perlu di dalam satu batch.
-   Untuk soal numerik, lakukan pemeriksaan domain/aturan bila
    memungkinkan.
-   Status soal dan pesan validasi dicatat.

Validasi struktur tidak membuktikan kebenaran pedagogis. Bank soal yang
akan dipakai luas perlu ditinjau oleh manusia/pengajar atau proses QA
yang ditetapkan.

### 6.5 Status soal yang disarankan

-   `draft` --- hasil generasi belum diperiksa.
-   `validated` --- lolos validasi teknis.
-   `reviewed` --- telah ditinjau sesuai kebijakan konten.
-   `rejected` --- tidak layak digunakan.
-   `published` --- tersedia untuk siswa menurut aturan produk.

Jangan menyamakan `validated` dengan `reviewed`. Validator teknis tidak
selalu bisa memastikan kebenaran konsep.

## 7. Bank soal fallback dan selector

Bank soal cadangan adalah sumber soal yang sudah ditinjau dan dapat
digunakan tanpa provider AI.

Selector harus mempertimbangkan: - jenjang; - mata pelajaran/topik; -
materi aktif dan prasyarat; - tingkat kesulitan; - status
publikasi/peninjauan; - soal yang sudah dikerjakan baru-baru ini; -
batas pengulangan yang ditetapkan.

Jika AI gagal: 1. Catat kategori kegagalan tanpa menyimpan data pribadi
yang tidak diperlukan. 2. Pilih soal bank yang sesuai. 3. Jika tidak
tersedia, tampilkan pesan yang jelas dan arahkan pengguna ke
materi/latihan lain. 4. Jangan tampilkan soal AI yang gagal divalidasi.

## 8. AI Tutor

### 8.1 Kebutuhan utama

-   Menjelaskan konsep berdasarkan materi aktif.
-   Memberikan petunjuk bertahap sebelum jawaban akhir bila sesuai.
-   Menyesuaikan bahasa dan kompleksitas dengan jenjang.
-   Mengakui jika konteks tidak cukup.
-   Mengarahkan siswa kembali ke bagian materi yang relevan.
-   Tidak menggantikan penilaian backend.
-   Tidak mengarang sumber atau mengklaim bahwa jawabannya telah
    diverifikasi jika belum.

### 8.2 Konteks dan grounding

Tutor sebaiknya menerima: - konten materi yang relevan; -
judul/topik/jenjang; - pertanyaan siswa; - ringkasan jawaban sebelumnya
dalam percakapan jika diperlukan dan sesuai kebijakan retensi.

Tutor tidak perlu menerima seluruh database atau semua percakapan
pengguna. Jika menggunakan retrieval, sumber yang diambil harus terkait
dengan materi dan dapat ditelusuri. Untuk MVP, konteks materi aktif
dapat diberikan secara langsung sebelum mempertimbangkan sistem
retrieval yang lebih kompleks.

### 8.3 Perilaku jawaban

-   Dahulukan penjelasan yang mudah dipahami.
-   Gunakan contoh sesuai usia/jenjang.
-   Untuk permintaan petunjuk, berikan hint sebelum langsung memberi
    jawaban lengkap jika konteksnya adalah latihan aktif.
-   Untuk konsep yang ambigu, ajukan klarifikasi atau nyatakan
    keterbatasan.
-   Jika tidak ada materi pendukung yang relevan, katakan bahwa konteks
    yang tersedia belum cukup.
-   Jangan mendorong siswa membagikan data pribadi.

### 8.4 Batasan dan keamanan

-   Batasi panjang pesan, frekuensi permintaan, dan ukuran konteks.
-   Tangani prompt injection yang mungkin muncul dalam teks materi atau
    pesan pengguna dengan memperlakukan konten tersebut sebagai data,
    bukan instruksi tingkat sistem.
-   Jangan mengekspos API key, prompt internal sensitif, atau data
    pengguna lain.
-   Jangan memberikan klaim bahwa Tutor menggantikan guru/tenaga
    profesional.
-   Sediakan tombol/opsi untuk kembali ke materi dan melaporkan jawaban
    keliru.
-   Tampilkan pesan kegagalan yang ramah ketika provider timeout, rate
    limit, atau tidak tersedia.

### 8.5 Hint otomatis pada kuis

Saat siswa salah pertama, backend memanggil layanan hint dengan urutan:

1. **Manual** --- isi `Question.hint` jika tersedia.
2. **AI Tutor** --- jika provider dikonfigurasi; prompt hanya memuat
   materi, soal, dan opsi, tanpa kunci jawaban.
3. **Aturan** --- fallback deterministik yang menunjuk bagian/topik
   materi dan menyarankan cara mengeliminasi opsi.

Hint wajib berupa satu petunjuk singkat, tidak menyebut kunci atau huruf
opsi benar, dan tidak menyalin penjelasan jawaban. Jika output AI
berpotensi membocorkan kunci, sistem menolaknya dan memakai fallback
aturan. Hint yang dipakai disimpan pada `QuizQuestion.hint_text` beserta
`hint_source` (`manual`, `ai`, atau `rule`) untuk audit.

## 9. Adaptive Learning Engine

### 9.1 MVP: rule-based

Mesin adaptasi awal harus sederhana, dapat dikonfigurasi, dan dapat
dijelaskan. Ia tidak membutuhkan training ML.

Input minimum: - hasil beberapa soal terakhir dalam topik yang sama; -
tingkat kesulitan soal; - jumlah percobaan yang tersedia; -
materi/prasyarat yang sudah dipelajari; - kategori konsep yang sering
salah jika tersedia.

Output: - target kesulitan berikutnya; - tindakan (lanjut, pertahankan,
remedial, atau prasyarat); - alasan ringkas; - metadata untuk audit.

### 9.2 Tingkat kesulitan awal

-   **1 --- Dasar:** pengenalan konsep dan penerapan langsung.
-   **2 --- Menengah:** beberapa langkah atau penerapan dalam konteks.
-   **3 --- Lanjut:** penalaran lebih kompleks atau transfer konsep.

Definisi soal pada tiap tingkat harus disesuaikan dengan mata pelajaran
dan ditinjau tim konten.

### 9.3 Aturan awal untuk eksperimen

Ambang berikut adalah nilai awal yang harus diuji, bukan standar
pedagogis universal: - Akurasi ≥ 80% pada jendela minimal soal yang
ditetapkan: pertimbangkan naik satu tingkat. - Akurasi 50--79%:
pertahankan tingkat dan beri variasi latihan. - Akurasi \< 50%: turunkan
satu tingkat atau berikan remedial/prasyarat.

Aturan pelaksanaan: - Jangan membuat keputusan dari satu jawaban saja. -
Tetapkan jumlah minimal soal valid sebelum adaptasi. - Batasi perubahan
maksimal satu tingkat per keputusan. - Jika sampel kurang,
pertahankan/default dan kumpulkan data. - Pertimbangkan tingkat
kesulitan dan topik; jangan gabungkan semua mata pelajaran sebagai satu
ukuran kemampuan. - Catat aturan, input ringkas, output, dan alasan. -
Uji ambang bersama pengguna/pengajar sebelum dianggap efektif.

### 9.4 Kasus tepi

-   Belum ada riwayat: mulai dari kesulitan dasar atau default materi.
-   Jumlah soal terlalu sedikit: jangan menaikkan/menurunkan tingkat
    secara agresif.
-   Materi prasyarat belum dipelajari: sarankan prasyarat, jangan
    memaksa soal lanjut.
-   Jawaban kosong/percobaan dibatalkan: jangan menganggapnya sebagai
    jawaban salah tanpa aturan eksplisit.
-   Soal tidak valid atau kunci salah dilaporkan: keluarkan dari
    perhitungan adaptasi sampai ditinjau.
-   Provider AI gagal: adaptasi tetap dapat memilih soal bank.
-   Nilai seri/ambang batas: gunakan aturan deterministik dan
    terdokumentasi.

## 10. Rencana eksperimen Machine Learning

ML adalah fase lanjutan dan tidak menjadi ketergantungan MVP.

### 10.1 Pertanyaan eksperimen

Tentukan satu target yang terukur, misalnya: - memprediksi apakah siswa
memerlukan latihan remedial setelah satu rangkaian; - memprediksi
tingkat latihan berikutnya; - merekomendasikan topik untuk diulang.

Jangan mencoba semua target sekaligus pada eksperimen pertama.

### 10.2 Persyaratan data

-   Label didefinisikan dan didokumentasikan.
-   Data cukup untuk setiap kelas target.
-   Identitas pribadi diminimalkan atau dihapus.
-   Train/validation/test dipisahkan berdasarkan siswa atau waktu sesuai
    tujuan, bukan hanya baris acak.
-   Variasi soal/kelompok soal yang sama tidak bocor lintas split
    evaluasi.
-   Data sintetik/label rule-based tidak dianggap ground truth sempurna.
-   Penggunaan data sesuai kebijakan privasi dan persetujuan yang
    berlaku.

### 10.3 Baseline dan evaluasi

1.  Buat baseline rule-based yang terdokumentasi.
2.  Tentukan kandidat model sederhana (misalnya Decision Tree) hanya
    jika target dan data mendukung.
3.  Gunakan metrik sesuai target, misalnya precision, recall, F1,
    confusion matrix, dan kalibrasi jika relevan.
4.  Analisis hasil per jenjang/topik bila ukuran sampel memungkinkan.
5.  Catat keterbatasan, bias, dan kasus gagal.
6.  Jalankan model dalam mode observasi/shadow sebelum memengaruhi
    rekomendasi siswa.
7.  Jangan mengganti rule-based sampai model memberi manfaat terukur dan
    risiko dapat diterima.
8.  Sediakan fallback ke rule-based jika prediksi tidak tersedia atau
    tidak meyakinkan.

Tidak ada jumlah minimum data universal yang ditetapkan di sini.
Kecukupan ditentukan dari target, distribusi label, desain evaluasi, dan
hasil analisis.

## 11. Data dan model Django yang disarankan

Rancangan konseptual berikut harus disesuaikan saat membuat ERD dan
model Django:

  ------------------------------------------------------------------------
  Model                    Field penting (contoh)  Tujuan
  ------------------------ ----------------------- -----------------------
  `Material`               title, content,         Konteks belajar
                           subject, grade_band,    
                           topic                   

  `MaterialPrerequisite`   material, prerequisite  Relasi prasyarat

  `Question`               text, options,          Bank soal/soal AI
                           correct_option,         
                           explanation, hint,      
                           difficulty, source,     
                           review_status           

  `QuestionGeneration`     material, provider,     Audit generasi
                           status,                 
                           validation_message,     
                           created_at              

  `QuizAttempt`            user/session, material, Sesi kuis
                           score, started_at,      
                           completed_at, status    

  `QuizQuestion`           attempt, question,      Jawaban dan hint per
                           order, difficulty,      soal
                           selected_option,        
                           is_correct, attempts,   
                           is_resolved, hint_used, 
                           hint_text, hint_source  

  `UserMaterialProgress`   user, material, status, Progres materi
                           completed_at            

  `UserProgress`           user, xp, level         Gamifikasi utama

  `Rank`                   code, name, order,      Rank dan akses tingkat
                           min_xp,                 kuis
                           unlocked_difficulty,    
                           icon, description,      
                           is_active               

  `SubjectProgress`        user, subject, lives,   Nyawa per mata
                           life_regen_started_at   pelajaran

  `AdaptationEvent`        user/session, topic,    Jejak adaptasi
                           previous_difficulty,    
                           next_difficulty,        
                           rule_name, reason       

  `TutorConversation`      user/session, material, Riwayat Tutor jika
  (opsional)               retention metadata      dibutuhkan
  ------------------------------------------------------------------------

Prinsip: - Kunci jawaban disimpan di backend. - Foreign key dan
transaksi database digunakan untuk menjaga konsistensi. - Simpan data
minimal yang diperlukan. - Jangan simpan prompt/response mentah
selamanya tanpa alasan retensi. - Jika data AI disimpan untuk evaluasi,
dokumentasikan tujuan dan aksesnya.

## 12. Service/module Django yang disarankan

``` text
eduquest/
  config/                    # konfigurasi proyek Django
  learning/
    models.py
    views.py
    urls.py
    services/
      question_selector.py
      scoring.py
      gamification.py
      adaptive_engine.py
  ai_services/
    providers/
      base.py
      provider_adapter.py
    question_generator.py
    question_validator.py
    tutor.py
    prompts.py
  progress/
    models.py
    services.py
  templates/
  static/
  tests/
    test_question_validator.py
    test_question_fallback.py
    test_adaptive_engine.py
    test_scoring.py
    test_progress_persistence.py
```

Struktur ini usulan; tim boleh menyesuaikannya. Tujuannya memisahkan
integrasi provider, logika domain, views, dan template agar dapat diuji.

Implementasi backend saat ini memakai `apps/learning/services/quiz_service.py`
untuk alur jawab per soal, `apps/progress/services.py` untuk XP/rank/nyawa,
dan `apps/tutor/services/hint_service.py` untuk hint hibrida
(manual → AI → aturan). Logika murni tetap berada di `eduquest_logic/`.

## 13. Endpoint/route yang disarankan

Implementasi backend saat ini memakai prefix `/api/`:

-   `GET /levels/` --- daftar jenjang.
-   `GET /subjects/` --- daftar mapel beserta nyawa per mapel.
-   `GET /materials/` dan `GET /materials/<id>/` --- katalog dan detail
    materi; detail menyertakan nyawa mapel.
-   `POST /materials/<id>/complete/` --- tandai materi selesai (+15 XP
    sekali per materi).
-   `POST /quizzes/` --- mulai atau lanjutkan sesi kuis; payload
    `material_id` dan `difficulty` opsional (1--3).
-   `POST /quizzes/<id>/answer/` --- jawab satu soal; mengembalikan
    hasil langsung, hint, nyawa, dan soal berikutnya. Endpoint submit
    massal tidak dipakai lagi.
-   `GET /quizzes/history/` dan `GET /quizzes/<id>/` --- riwayat dan
    detail sesi, termasuk pembahasan setelah sesi selesai.
-   `GET /progress/` --- ringkasan XP, level, rank, rank berikutnya, dan
    nyawa semua mapel.
-   `GET /ranks/` --- daftar rank aktif dan tingkat kuis yang terbuka.
-   `POST /tutor/ask/` --- kirim pertanyaan ke Tutor.
-   `POST /questions/<id>/report/` --- laporkan soal yang keliru
    (opsional).

Semua route harus menggunakan validasi akses, CSRF protection sesuai
pola Django, validasi payload, dan batas request. Kunci jawaban hanya
boleh muncul pada respons soal yang sudah diselesaikan atau sesi yang
sudah berstatus `submitted`.

## 14. Observability dan logging

Catat seperlunya: - provider/model dan versi konfigurasi bila
tersedia; - waktu respons; - status berhasil/gagal; - kategori error; -
status validasi; - sumber soal (`ai`/`bank`); - target dan tingkat
adaptasi; - alasan keputusan ringkas; - token/biaya agregat jika
provider mendukung dan perlu dipantau.

Jangan memasukkan kata sandi, API key, atau data identitas siswa ke log.
Batasi retensi dan akses. Log harus membantu debugging tanpa menjadi
gudang data pribadi.

## 15. Pengujian AI

  -----------------------------------------------------------------------
  ID                      Skenario                Hasil yang diharapkan
  ----------------------- ----------------------- -----------------------
  AI-T01                  Provider mengembalikan  Output lolos skema dan
                          JSON valid              lanjut ke status yang
                                                  ditetapkan

  AI-T02                  Provider mengembalikan  Output ditolak;
                          JSON rusak              fallback dipanggil

  AI-T03                  Kunci tidak ada di opsi Output ditolak

  AI-T04                  Jumlah opsi tidak       Output ditolak
                          sesuai                  

  AI-T05                  Soal tidak sesuai       Ditolak atau masuk
                          topik/jenjang           tinjauan, tidak
                                                  dipublikasikan

  AI-T06                  Provider timeout        Timeout ditangani dan
                                                  fallback digunakan

  AI-T07                  Provider                Pesan yang jelas dan
                          rate-limit/kuota habis  fallback

  AI-T08                  Bank soal fallback      Sistem tidak membuat
                          kosong                  soal tak tervalidasi;
                                                  tampilkan alternatif

  AI-T09                  Siswa menjawab soal     Backend menilai dengan
                                                  kunci tersimpan

  AI-T10                  Akurasi tinggi dalam    Rule engine dapat naik
                          jendela cukup           satu tingkat sesuai
                                                  konfigurasi

  AI-T11                  Akurasi rendah dalam    Rule engine dapat
                          jendela cukup           memberi
                                                  remedial/menurunkan
                                                  satu tingkat

  AI-T12                  Data percobaan belum    Tidak ada perubahan
                          cukup                   agresif

  AI-T13                  Soal dilaporkan salah   Soal dapat ditandai
                                                  untuk ditinjau dan
                                                  dikecualikan sesuai
                                                  kebijakan

  AI-T14                  Tutor menerima materi   Jawaban berhubungan
                          relevan                 dengan materi

  AI-T15                  Tutor tidak punya       Tutor menyatakan
                          konteks memadai         keterbatasan atau
                                                  meminta klarifikasi

  AI-T16                  Input mengandung        Batas sistem tetap
                          instruksi manipulatif   diikuti; konten
                                                  pengguna diperlakukan
                                                  sebagai data
  -----------------------------------------------------------------------

## 16. Kriteria penerimaan AI

AI MVP diterima bila: 1. Generator mengikuti skema yang disepakati. 2.
Output tidak valid tidak disajikan sebagai soal resmi. 3. Fallback dapat
menyajikan soal bank yang cocok saat AI gagal. 4. Penilaian dilakukan di
backend. 5. Adaptasi rule-based menghasilkan keputusan deterministik
yang dapat dijelaskan. 6. Hasil dan event adaptasi tersimpan secara
konsisten. 7. Tutor, bila masuk MVP, menggunakan konteks relevan dan
menangani kegagalan. 8. Kunci jawaban, API key, dan data siswa tidak
bocor ke browser/log. 9. Pengujian kegagalan dan kasus batas
terdokumentasi. 10. Tidak ada klaim efektivitas belajar atau akurasi ML
tanpa evaluasi.

## 17. Data ScienceQA dan AI2 ARC Easy: penggunaan sementara

Dataset yang telah diaudit: - AI2 ARC Easy: 2.251 baris train yang
dicatat dalam hasil kerja. - ScienceQA: 21.208 baris total pada
train/validation/test. - Keduanya berbahasa Inggris dan tidak otomatis
sesuai dengan kurikulum Indonesia. - ScienceQA memiliki gambar pada
sebagian baris dan metadata kelas/topik/penjelasan.

Kebijakan sementara: - Gunakan dataset tersebut untuk memahami format
soal, prototipe pipeline, dan eksperimen awal yang sesuai. - Jangan
langsung mempublikasikan soal sebagai bank soal siswa tanpa peninjauan
dan pemeriksaan hak penggunaan. - Jangan menganggap label otomatis benar
hanya karena berasal dari dataset. - Audit 454 kelompok lintas split
yang memiliki pertanyaan ternormalisasi dan hash gambar sama. - Jangan
menyimpulkan semua kelompok adalah konflik jawaban atau duplikat yang
harus dihapus. - Untuk evaluasi, hindari menyebarkan varian dari
kelompok yang sama ke split berbeda jika hal itu dapat membiaskan
hasil. - Cari data Bahasa Indonesia yang relevan dan memiliki dasar
penggunaan yang jelas sebelum menyatakan cakupan kurikulum lokal.

## 18. Risiko dan mitigasi

  -----------------------------------------------------------------------
  Risiko                              Mitigasi
  ----------------------------------- -----------------------------------
  Soal AI salah/ambigu                Validasi teknis, tinjauan manusia,
                                      laporan soal, fallback

  AI keluar konteks                   Batasi konteks ke materi/topik yang
                                      diizinkan

  Provider gagal                      Timeout, retry terbatas, fallback
                                      bank soal

  Biaya tidak terkendali              Batas panjang, jumlah soal,
                                      frekuensi, dan pemantauan

  Adaptasi tidak tepat                Beberapa percobaan, aturan
                                      transparan, uji pengguna

  Dataset tidak relevan               Audit sumber dan konten lokal

  Kebocoran evaluasi                  Split berdasarkan grup/siswa/waktu
                                      sesuai tujuan

  Data siswa sensitif                 Minimasi data dan kontrol akses

  Model ML bias atau tak stabil       Baseline, evaluasi per kelompok,
                                      mode observasi
  -----------------------------------------------------------------------

## 19. Keputusan terbuka

-   Provider/model AI dan anggaran.
-   Apakah AI Tutor masuk MVP atau fase berikutnya.
-   Apakah generator AI aktif untuk siswa atau hanya mode internal pada
    tahap awal.
-   Bahasa dan batas panjang output.
-   Jumlah soal per permintaan.
-   Definisi status materi selesai.
-   Aturan adaptasi dan jumlah soal minimum per keputusan.
-   Proses peninjauan manusia dan pihak yang bertanggung jawab.
-   Retensi percakapan dan log AI.
-   Target kualitas yang terukur.
-   Kriteria data yang cukup untuk eksperimen ML.

## 20. Tahapan implementasi AI

1.  Tetapkan skema soal dan metadata materi.
2.  Siapkan bank soal awal dan fallback.
3.  Implementasikan scoring backend.
4.  Implementasikan validator dan selector.
5.  Integrasikan generator melalui adapter provider.
6.  Implementasikan adaptive engine rule-based dan log keputusan.
7.  Integrasikan Tutor dengan konteks materi.
8.  Jalankan tes otomatis dan uji kegagalan.
9.  Kumpulkan data operasional secara minimal dan sah.
10. Rancang eksperimen ML dengan baseline dan split bebas kebocoran.
11. Pertimbangkan penggunaan ML hanya setelah hasil evaluasi mendukung.

------------------------------------------------------------------------

**Prinsip akhir:** AI adalah komponen pendukung proses belajar. Kualitas
materi, validasi soal, penilaian yang benar, privasi siswa, dan fallback
yang dapat diandalkan lebih penting daripada menambahkan model yang
kompleks terlalu awal.
