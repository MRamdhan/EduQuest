# Laporan Hasil Kurasi Bank Soal EduQuest (Versi 2.1 — 12 Topik Prioritas)

**Tanggal Pembaruan:** 22 Oktober 2026  
**Status Bank Soal:** TERVALIDASI & SIAP PAKAI (Grade Production Quality per Butir)  
**Total Butir Soal Terkurasi:** 180 butir (15 butir per topik; 9 topik IPA/Biologi + 3 topik Bahasa Indonesia)  
**Komposisi Kesulitan per Topik:** Tepat 5 Mudah, 5 Sedang, 5 Sukar (1:1:1)  
**Format Pilihan:** 4 Opsi (A–D) untuk SD & SMP, 5 Opsi (A–E) untuk SMA  
**Cakupan Mapel:** IPAS/IPA, Biologi, dan **Bahasa Indonesia** untuk mendemokan alur multi-mapel (*Pilih Mapel*).

> [!IMPORTANT]
> **Penyempurnaan Utama pada Versi 2.0:**
> 1. **Eliminasi Bias Posisi Kunci Jawaban:**
>    - Pada versi sebelumnya, opsi A mendominasi hingga ~43% dan opsi E pada jenjang SMA kosong (0%).
>    - Pada Versi 2.0, posisi kunci jawaban telah disebar merata secara ketat: SD (A: 12, B: 12, C: 11, D: 10), SMP (A: 11, B: 13, C: 11, D: 10), dan SMA (A: 9, B: 9, C: 9, D: 9, E: 9 — tepat 20,0% per opsi!).
> 2. **Peningkatan Tingkat Kognitif & Penajaman HOTS (C4–C5):**
>    - Seluruh soal tier Sukar (45 butir) kini 100% merupakan soal analisis data/kasus (C4: 27 butir) dan evaluasi kebijakan/solusi sains (C5: 18 butir).
>    - Istilah asing yang sekadar hafalan kamus (seperti *thanatosis* untuk anak SD) telah digantikan oleh analisis perilaku adaptasi kontekstual.
> 3. **Penggantian Soal Usang/Goyah:**
>    - Soal usang `CUR-SMP-IPA-01-09` (definisi 1 kg = 1 liter air pada 4 °C yang sudah kedaluwarsa pasca-redefinisi SI 2019 berbasis tetapan Planck) telah diganti total dengan analisis pengukuran volume dan massa jenis benda tak beraturan menggunakan metode gelas ukur berpancur.
>    - Distraktor yang lemah pada tingkat Mudah diperkuat agar memiliki daya diskriminasi yang bermakna.
> 4. **Kelengkapan Metadata Model Django `Question`:**
>    - Setiap butir kini memuat metadata lengkap: `question_type`, `cognitive_level` (C1–C5 Bloom), `concept_tags`, `curriculum_target` (CP/TP), dan `difficulty_reason` (rubrik penentuan tingkat).
> 5. **Kedalaman Pool 15 Butir per Topik:**
>    - Tiap tingkat kesulitan (Mudah, Sedang, Sukar) kini memiliki 5 butir soal penuh, menjamin bahwa satu sesi kuis standar (5 soal) dapat dilayani secara mandiri per tier tanpa kebocoran ke tier lain.
> 6. **Ekspansi Multi-Mapel (Wave-2 Bahasa Indonesia):**
>    - Ditambahkan 45 butir Bahasa Indonesia pada 3 topik (SD: Ide Pokok; SMP: Teks Laporan Observasi & Deskripsi; SMA: Teks Eksposisi & Kritik) dengan skema metadata identik.
>    - Kunci jawaban SMA Bahasa Indonesia disebar tepat 3/3/3/3/3 (A–E, 20% per opsi); seluruh tier Sukar tetap 100% HOTS (C4–C5).

## 1. Rekapitulasi Distribusi Bank Soal v2.1

### A. Distribusi Topik & Tingkat Kesulitan

| ID Topik | Jenjang | Mata Pelajaran | Nama Topik Materi | Mudah (C1–C2) | Sedang (C2–C3) | Sukar (C4–C5 HOTS) | Total Butir |
|---|---|---|---|:---:|:---:|:---:|:---:|
| `SD-IPA-02` | SD | IPAS | Makhluk Hidup dan Ciri-cirinya | 5 | 5 | 5 | **15** |
| `SD-IPA-04` | SD | IPAS | Hewan dan Pengelompokannya | 5 | 5 | 5 | **15** |
| `SD-IPA-10` | SD | IPAS | Energi dan Perubahannya | 5 | 5 | 5 | **15** |
| `SMP-IPA-01` | SMP | IPA | Besaran dan Pengukuran | 5 | 5 | 5 | **15** |
| `SMP-IPA-04` | SMP | IPA | Gerak dan Gaya | 5 | 5 | 5 | **15** |
| `SMP-IPA-15` | SMP | IPA | Tata Surya dan Bumi | 5 | 5 | 5 | **15** |
| `SMA-BIO-01` | SMA | Biologi | Keanekaragaman Hayati | 5 | 5 | 5 | **15** |
| `SMA-BIO-03` | SMA | Biologi | Virus, Bakteri, dan Protista | 5 | 5 | 5 | **15** |
| `SMA-BIO-05` | SMA | Biologi | Tumbuhan (Plantae) | 5 | 5 | 5 | **15** |
| `SD-BIN-01` | SD | Bahasa Indonesia | Ide Pokok dan Gagasan Utama Paragraf | 5 | 5 | 5 | **15** |
| `SMP-BIN-01` | SMP | Bahasa Indonesia | Teks Laporan Hasil Observasi dan Teks Deskripsi | 5 | 5 | 5 | **15** |
| `SMA-BIN-01` | SMA | Bahasa Indonesia | Teks Eksposisi dan Teks Kritik | 5 | 5 | 5 | **15** |
| **TOTAL** | | | | **60** | **60** | **60** | **180** |

### B. Sebaran Posisi Kunci Jawaban (Bebas Bias)

| Jenjang / Cakupan | A | B | C | D | E | Total Butir |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **IPA/Biologi (v2.0 — 135)** | | | | | | |
| SD (4 Opsi: A–D) | 12 (26,7%) | 12 (26,7%) | 11 (24,4%) | 10 (22,2%) | - | 45 |
| SMP (4 Opsi: A–D) | 11 (24,4%) | 13 (28,9%) | 11 (24,4%) | 10 (22,2%) | - | 45 |
| SMA (5 Opsi: A–E) | 9 (20,0%) | 9 (20,0%) | 9 (20,0%) | 9 (20,0%) | 9 (20,0%) | 45 |
| **Bahasa Indonesia (Wave-2 — 45)** | | | | | | |
| SD (4 Opsi: A–D) | 5 (33,3%) | 3 (20,0%) | 3 (20,0%) | 4 (26,7%) | - | 15 |
| SMP (4 Opsi: A–D) | 3 (20,0%) | 4 (26,7%) | 3 (20,0%) | 5 (33,3%) | - | 15 |
| SMA (5 Opsi: A–E) | 3 (20,0%) | 3 (20,0%) | 3 (20,0%) | 3 (20,0%) | 3 (20,0%) | 15 |
| **KESELURUHAN (180)** | **43 (23,9%)** | **44 (24,4%)** | **40 (22,2%)** | **41 (22,8%)** | **12 (6,7%)** | **180** |

### C. Sebaran Taksonomi Kognitif (Bloom)

- **C1 (Mengingat):** 37 butir (20,6%) — fakta dasar, nama ilmiah, definisi satuan baku, istilah struktur teks.
- **C2 (Memahami):** 42 butir (23,3%) — perbandingan ciri, hubungan sebab-akibat sederhana, interpretasi fenomena/teks.
- **C3 (Menerapkan):** 40 butir (22,2%) — penerapan rumus fisika dasar ($F=ma$, $v=s/t$, $\rho=m/V$), konversi satuan, identifikasi struktur teks.
- **C4 (Menganalisis — HOTS):** 41 butir (22,8%) — interpretasi grafik gerak, pemecahan masalah ekosistem, analisis paragraf/struktur teks, evaluasi koherensi.
- **C5 (Mengevaluasi — HOTS):** 20 butir (11,1%) — evaluasi kebijakan konservasi, pemilihan instrumen presisi, kritik sastra/teks.

> **Catatan:** Seluruh 60 butir tier Sukar (45 IPA/Biologi + 15 Bahasa Indonesia) adalah 100% HOTS (C4–C5).

---

## Topik `SD-IPA-02`: Makhluk Hidup dan Ciri-cirinya (SD — IPAS)

### CUR-SD-IPA-02-01 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 3615)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B (Kelas 3–4): Mengidentifikasi ciri-ciri makhluk hidup dan membedakannya dari benda mati.*  
- **Tag Konsep:** `ciri_makhluk_hidup, perkembangbiakan`  
- **Rubrik Kesulitan:** Mengingat (C1) karakteristik dasar makhluk hidup dengan opsi pembeda yang sangat kontras.  

**Soal:**  
Berikut ini yang merupakan salah satu ciri utama dari seluruh makhluk hidup adalah ....

**Pilihan Jawaban:**  
- `A`. Berkembang biak untuk melestarikan keturunan **<== (Kunci Jawaban)**
- `B`. Ukurannya selalu bertambah kecil
- `C`. Tidak pernah berubah bentuk
- `D`. Tidak membutuhkan makanan dan air

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Semua makhluk hidup memiliki ciri bernapas, bergerak, makan, tumbuh, peka terhadap rangsang, dan berkembang biak.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SD-IPA-02-02 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 3632)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Menjelaskan proses pertumbuhan pada makhluk hidup.*  
- **Tag Konsep:** `ciri_makhluk_hidup, pertumbuhan`  
- **Rubrik Kesulitan:** Memahami (C2) konsep pertumbuhan bahwa ukuran tubuh makhluk hidup mengalami perubahan.  

**Soal:**  
Pernyataan berikut ini merupakan ciri-ciri makhluk hidup, KECUALI ....

**Pilihan Jawaban:**  
- `A`. Mampu bergerak secara aktif maupun pasif
- `B`. Bentuk dan ukuran tubuhnya tidak pernah bertambah **<== (Kunci Jawaban)**
- `C`. Memerlukan makanan dan minuman untuk bertahan hidup
- `D`. Peka terhadap rangsangan dari lingkungan sekitar

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Makhluk hidup mengalami pertumbuhan dan perkembangan; benda yang tidak pernah bertambah ukuran adalah benda mati.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SD-IPA-02-03 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 3631)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Mengelompokkan komponen biotik dan abiotik di lingkungan sekitar.*  
- **Tag Konsep:** `biotik_abiotik, benda_mati`  
- **Rubrik Kesulitan:** Mengenali (C1) perbedaan benda mati (abiotik) dengan organisme hidup.  

**Soal:**  
Di bawah ini yang termasuk kelompok benda tak hidup (benda mati) di sekitar kita adalah ....

**Pilihan Jawaban:**  
- `A`. Tanaman cabai dan pohon pisang
- `B`. Kucing dan anak ayam
- `C`. Batu kerikil dan pasir kali **<== (Kunci Jawaban)**
- `D`. Ikan mas dan kura-kura

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Batu kerikil dan pasir kali adalah benda tak hidup karena tidak bernapas, tidak tumbuh, dan tidak bereproduksi.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SD-IPA-02-04 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 3619)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Menjelaskan perbedaan gerak aktif hewan dan gerak pasif tumbuhan.*  
- **Tag Konsep:** `ciri_makhluk_hidup, gerak_hewan_tumbuhan`  
- **Rubrik Kesulitan:** Memahami (C2) bahwa berlari adalah jenis gerak khusus hewan berkaki, bukan ciri mutlak semua makhluk hidup.  

**Soal:**  
Aktivitas berikut yang BUKAN merupakan ciri mendasar bagi seluruh makhluk hidup (termasuk tumbuhan) adalah ....

**Pilihan Jawaban:**  
- `A`. Mengeluarkan zat sisa (ekskresi)
- `B`. Melakukan respirasi (bernapas)
- `C`. Bereaksi terhadap rangsangan (iritabilitas)
- `D`. Berlari berpindah tempat dengan cepat **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Berlari hanya dilakukan sebagian hewan berkaki. Tumbuhan tetap hidup dan bergerak pasif tanpa bisa berlari.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SD-IPA-02-05 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 3553)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Menjelaskan tujuan makhluk hidup berkembang biak.*  
- **Tag Konsep:** `perkembangbiakan, kelestarian`  
- **Rubrik Kesulitan:** Memahami (C2) konsep kelangsungan hidup spesies.  

**Soal:**  
Tujuan utama seluruh makhluk hidup berkembang biak adalah untuk ....

**Pilihan Jawaban:**  
- `A`. Melestarikan keturunannya agar jenisnya tidak punah **<== (Kunci Jawaban)**
- `B`. Mendapatkan wilayah tempat tinggal yang paling luas
- `C`. Mempercepat proses pergantian kulit
- `D`. Mengurangi kebutuhan makanan di alam

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Perkembangbiakan (reproduksi) bertujuan menghasilkan individu baru demi menjaga kelestarian spesies dari ancaman kepunahan.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SD-IPA-02-06 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 3750)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Mendeskripsikan siklus daur hidup pada beberapa hewan.*  
- **Tag Konsep:** `daur_hidup, metamorfosis`  
- **Rubrik Kesulitan:** Membedakan (C2) antara konsep payung daur hidup secara keseluruhan dengan istilah metamorfosis.  

**Soal:**  
Seluruh tahapan pertumbuhan dan perkembangan yang dilalui oleh makhluk hidup sejak lahir atau menetas hingga dewasa disebut ....

**Pilihan Jawaban:**  
- `A`. Metamorfosis
- `B`. Daur hidup (siklus hidup) **<== (Kunci Jawaban)**
- `C`. Penyerbukan
- `D`. Fotosintesis

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Daur hidup adalah tahapan hidup lengkap dari awal kehidupan hingga menghasilkan keturunan lagi. Metamorfosis adalah perubahan bentuk fisik di dalam daur hidup.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SD-IPA-02-07 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 3904)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Mengidentifikasi tahapan metamorfosis sempurna pada serangga.*  
- **Tag Konsep:** `metamorfosis_sempurna, kupu_kupu`  
- **Rubrik Kesulitan:** Menerapkan (C3) istilah metamorfosis pada perubahan bentuk larva menjadi imago.  

**Soal:**  
Perubahan bentuk tubuh yang sangat berbeda secara bertahap dari fase telur, ulat (larva), kepompong (pupa), hingga kupu-kupu dewasa dinamakan ....

**Pilihan Jawaban:**  
- `A`. Regenerasi sel
- `B`. Adaptasi morfologi
- `C`. Metamorfosis sempurna **<== (Kunci Jawaban)**
- `D`. Perkembangbiakan vegetatif

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Perubahan bentuk yang melalui fase pupa/kepompong disebut metamorfosis sempurna.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SD-IPA-02-08 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 3761)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C (Kelas 5–6): Menganalisis hubungan antar makhluk hidup (simbiosis) dalam ekosistem.*  
- **Tag Konsep:** `simbiosis, mutualisme`  
- **Rubrik Kesulitan:** Menerapkan (C3) konsep simbiosis mutualisme pada contoh interaksi nyata.  

**Soal:**  
Hubungan antar makhluk hidup yang saling menguntungkan kedua belah pihak (simbiosis mutualisme) terjadi antara pasangan ....

**Pilihan Jawaban:**  
- `A`. Pohon mangga dan tanaman benalu
- `B`. Kutu rambut dan kepala manusia
- `C`. Ikan hiu dan ikan remora
- `D`. Burung jalak dan kerbau **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Burung jalak memakan kutu di tubuh kerbau (mendapat makanan), sedangkan kerbau merasa nyaman karena bebas dari rasa gatal.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SD-IPA-02-09 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 3639)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B–C: Menjelaskan bentuk penyesuaian diri tumbuhan dengan lingkungan hidupnya.*  
- **Tag Konsep:** `adaptasi_tumbuhan, kaktus`  
- **Rubrik Kesulitan:** Menghubungkan (C3) bentuk modifikasi organ tumbuhan dengan fungsi bertahan hidup di habitat kering.  

**Soal:**  
Tanaman kaktus yang hidup di tempat kering (gurun pasir) memiliki daun berbentuk duri. Fungsi utama daun duri pada kaktus adalah untuk ....

**Pilihan Jawaban:**  
- `A`. Mengurangi penguapan air dari tubuh tumbuhan **<== (Kunci Jawaban)**
- `B`. Mempercepat proses penguapan air di siang hari
- `C`. Menyerap gas karbondioksida sebanyak mungkin
- `D`. Menarik serangga pemangsa agar mendekat

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Bentuk duri memperkecil luas permukaan daun sehingga penguapan air melalui stomata dapat ditekan sekecil mungkin.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SD-IPA-02-10 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 3559)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Memahami peran produsen, konsumen, dan pengurai dalam rantai makanan.*  
- **Tag Konsep:** `rantai_makanan, produsen`  
- **Rubrik Kesulitan:** Memahami (C2) kedudukan vital tumbuhan hijau sebagai produsen primer.  

**Soal:**  
Komponen makhluk hidup yang berperan sebagai produsen utama penghasil makanan dan oksigen bagi seluruh makhluk hidup di darat adalah ....

**Pilihan Jawaban:**  
- `A`. Bakteri pengurai di dalam tanah
- `B`. Tumbuhan hijau yang berfotosintesis **<== (Kunci Jawaban)**
- `C`. Hewan herbivora pemakan rumput
- `D`. Jamur pelapuk kayu

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Hanya tumbuhan hijau (dan alga) yang dapat mengolah energi matahari menjadi bahan makanan organik (glukosa) dan oksigen.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SD-IPA-02-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 3638)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Menganalisis ketergantungan antar komponen biotik dan dampak perubahan populasi.*  
- **Tag Konsep:** `rantai_makanan, analisis_ekosistem_sawah`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) dampak terputusnya rantai makanan terhadap populasi konsumen tingkat berikutnya.  

**Soal:**  
Di sebuah ekosistem sawah terdapat rantai makanan: Padi -> Belalang -> Katak -> Ular -> Burung Elang. Jika petani menyemprotkan insektisida hingga seluruh populasi belalang mati musnah, peristiwa yang PALING MUNGKIN terjadi pada populasi hewan lainnya adalah ....

**Pilihan Jawaban:**  
- `A`. Populasi ular langsung bertambah banyak karena sawah menjadi sepi
- `B`. Populasi padi berkurang drastis karena tidak ada belalang
- `C`. Populasi katak akan menurun drastis karena kehilangan sumber makanan utamanya **<== (Kunci Jawaban)**
- `D`. Populasi burung elang langsung bertambah pesat

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Katak adalah pemangsa khusus belalang. Bila belalang punah, katak kelaparan dan populasinya anjlok, yang kemudian berimbas pada penurunan populasi ular dan elang.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SD-IPA-02-12 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 3552)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Menganalisis adaptasi khusus tumbuhan pemakan serangga (insektivora).*  
- **Tag Konsep:** `adaptasi_fisiologi, kantung_semar_nitrogen`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) hubungan kondisi lingkungan tanah rawa miskin hara dengan kebutuhan nutrisi tumbuhan.  

**Soal:**  
Tumbuhan kantung semar dan venus flytrap hidup di habitat tanah rawa gambut. Meskipun dapat berfotosintesis menghasilkan karbohidrat, tumbuhan tersebut tetap menangkap dan mencerna serangga. Alasan ilmiah utama di balik perilaku ini adalah ....

**Pilihan Jawaban:**  
- `A`. Untuk menyerap cadangan air saat musim kemarau panjang
- `B`. Mendapatkan energi cahaya tambahan yang tersimpan pada serangga
- `C`. Menghilangkan serangga pengganggu yang merusak bunganya
- `D`. Memenuhi kebutuhan unsur hara nitrogen yang sangat sedikit tersedia di tanah rawa **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Tanah rawa sangat miskin nitrogen. Tumbuhan insektivora menguraikan protein serangga menjadi senyawa nitrogen untuk menyusun asam amino dan enzim.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SD-IPA-02-13 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 3650)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Mengevaluasi dampak peristiwa alam terhadap keanekaragaman hayati dan tanah.*  
- **Tag Konsep:** `lingkungan, evaluasi_dampak_letusan`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) dampak jangka panjang letusan gunung api terhadap siklus kehidupan tanah.  

**Soal:**  
Letusan gunung berapi awalnya mematikan tumbuhan dan hewan di sekitarnya. Namun, beberapa tahun pasca-erupsi, kawasan lereng gunung justru berubah menjadi sangat rimbun dan subur. Penjelasan ilmiah yang paling tepat mengevaluasi fenomena ini adalah ....

**Pilihan Jawaban:**  
- `A`. Abu vulkanik dan lapukan batuan lava mengandung mineral hara tinggi yang memperkaya unsur hara tanah **<== (Kunci Jawaban)**
- `B`. Suhu tanah bekas lahar menjadi hangat secara abadi sehingga biji lebih cepat tumbuh
- `C`. Hewan-hewan pemangsa punah seluruhnya sehingga tumbuhan tidak ada yang memakan
- `D`. Air hujan di sekitar gunung berapi mengandung pupuk kimia alami

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Abu vulkanik kaya unsur fosfor, kalium, dan magnesium yang saat terurai menyuburkan tanah, memicu suksesi ekologis yang lebat.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SD-IPA-02-14 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 3893)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses IPAS Fase C: Menganalisis data hasil pengamatan pertumbuhan tanaman.*  
- **Tag Konsep:** `perkecambahan, analisis_eksperimen_cahaya`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) hasil percobaan pengaruh cahaya terhadap perkecambahan biji kacang hijau.  

**Soal:**  
Siswa kelas 5 melakukan percobaan menanam biji kacang hijau di dua wadah:
• Wadah A ditaruh di dalam lemari gelap
• Wadah B ditaruh di dekat jendela yang terkena sinar matahari
Setelah 5 hari, kecambah di Wadah A batangnya tumbuh sangat tinggi tetapi pucat dan kurus. Sedangkan kecambah di Wadah B batangnya lebih pendek, kokoh, dan berdaun hijau segar. Kesimpulan yang tepat dari data pengamatan tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Tanaman sama sekali tidak membutuhkan cahaya matahari untuk hidup
- `B`. Cahaya matahari mengendalikan pertumbuhan tinggi batang dan mutlak dibutuhkan untuk pembentukan klorofil **<== (Kunci Jawaban)**
- `C`. Kecambah di wadah gelap lebih sehat karena batangnya tumbuh lebih cepat
- `D`. Keberadaan cahaya matahari merusak seluruh jaringan pertumbuhan kecambah

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Fenomena etiolasi: di tempat gelap hormon auksin tidak terurai sehingga batang memanjang cepat tapi lemah dan klorofil tidak terbentuk.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SD-IPA-02-15 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 3644)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Mengevaluasi upaya manusia dalam menjaga keseimbangan alam.*  
- **Tag Konsep:** `konservasi_lingkungan, evaluasi_kebijakan_hutan`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) solusi pencegahan kepunahan satwa akibat fragmentasi hutan.  

**Soal:**  
Pembangunan jalan raya melintasi tengah hutan lindung menyebabkan habitat satwa terbelah dua (fragmentasi habitat), sehingga banyak hewan tertabrak kendaraan saat melintas. Tindakan rekayasa lingkungan yang PALING EFEKTIF untuk melindungi keselamatan satwa tanpa harus menutup jalan tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Memasang pengeras suara bising di sepanjang jalan agar hewan takut mendekat
- `B`. Menangkap seluruh satwa liar untuk dipindahkan ke kebun binatang kota
- `C`. Membangun jembatan kanopi layang atau terowongan lintasan khusus satwa (wildlife crossing) **<== (Kunci Jawaban)**
- `D`. Menebang pepohonan di pinggir jalan raya sejauh 50 meter

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Wildlife corridors (ekoduk/jembatan satwa) memungkinkan hewan berpindah mencari makan dan pasangan secara alami melintasi jalan raya tanpa tertabrak.

**Catatan Kurasi:** *Kunci C.*  

---

## Topik `SD-IPA-04`: Hewan dan Pengelompokannya (SD — IPAS)

### CUR-SD-IPA-04-01 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 3900)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Mengelompokkan hewan berdasarkan jenis makanannya.*  
- **Tag Konsep:** `pengelompokan_hewan, herbivora`  
- **Rubrik Kesulitan:** Mengingat (C1) istilah pengelompokan pemakan tumbuhan.  

**Soal:**  
Kelompok hewan seperti kambing, sapi, dan kelinci yang sumber makanan utamanya adalah daun dan rumput disebut ....

**Pilihan Jawaban:**  
- `A`. Karnivora
- `B`. Omnivora
- `C`. Insektivora
- `D`. Herbivora **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Herbivora adalah sebutan untuk hewan yang memakan bagian tumbuhan seperti dedaunan, biji, atau rumput.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SD-IPA-04-02 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 3912)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Mengidentifikasi hewan pemakan serangga.*  
- **Tag Konsep:** `pengelompokan_hewan, insektivora`  
- **Rubrik Kesulitan:** Mengenali (C1) kelompok hewan pemakan serangga.  

**Soal:**  
Hewan seperti cicak, katak pohon, dan trenggiling yang mengonsumsi serangga sebagai makanan utamanya digolongkan ke dalam ....

**Pilihan Jawaban:**  
- `A`. Insektivora **<== (Kunci Jawaban)**
- `B`. Herbivora
- `C`. Omnivora
- `D`. Frugivora

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Insektivora adalah kelompok hewan yang secara khusus memangsa serangga kecil.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SD-IPA-04-03 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 3921)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Membedakan hewan berdasarkan variasi makanannya.*  
- **Tag Konsep:** `pengelompokan_hewan, omnivora`  
- **Rubrik Kesulitan:** Memahami (C2) konsep omnivora pada hewan ternak ayam.  

**Soal:**  
Ayam dapat memakan biji-bijian jagung (tumbuhan) sekaligus rayap dan cacing tanah (hewan). Berdasarkan jenis makanannya, ayam termasuk ....

**Pilihan Jawaban:**  
- `A`. Herbivora
- `B`. Omnivora **<== (Kunci Jawaban)**
- `C`. Karnivora
- `D`. Pengurai

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Omnivora adalah hewan pemakan segala (memakan bahan nabati dari tumbuhan maupun hewani).

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SD-IPA-04-04 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 3915)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Mengelompokkan hewan berdasarkan cara perkembangbiakannya.*  
- **Tag Konsep:** `pengelompokan_hewan, perkembangbiakan_hewan`  
- **Rubrik Kesulitan:** Mengenali (C1) hewan bertelur (ovipar).  

**Soal:**  
Kelompok hewan berikut ini yang berkembang biak dengan cara bertelur (ovipar) adalah ....

**Pilihan Jawaban:**  
- `A`. Sapi, kambing, dan kuda
- `B`. Kucing, anjing, dan kelinci
- `C`. Ayam, bebek, dan burung merpati **<== (Kunci Jawaban)**
- `D`. Ikan paus, lumba-lumba, dan singa laut

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Ayam, bebek, dan burung termasuk kelompok unggas yang berkembang biak dengan mengeluarkan telur (ovipar). Paus dan lumba-lumba melahirkan (vivipar).

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SD-IPA-04-05 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 3918)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Mengidentifikasi organ pernapasan pada hewan air.*  
- **Tag Konsep:** `pengelompokan_hewan, alat_pernapasan`  
- **Rubrik Kesulitan:** Mengingat (C1) organ pernapasan ikan.  

**Soal:**  
Ikan bernapas di dalam air menggunakan organ pernapasan khusus yang disebut ....

**Pilihan Jawaban:**  
- `A`. Paru-paru
- `B`. Trakea
- `C`. Kulit basah
- `D`. Insang **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Insang memiliki lembaran-lembaran tipis kaya pembuluh darah untuk menyaring oksigen yang terlarut dalam air.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SD-IPA-04-06 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 3729)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Mengidentifikasi ciri morfologi hewan karnivora di sekitar.*  
- **Tag Konsep:** `ciri_anatomi, kucing`  
- **Rubrik Kesulitan:** Menyimpulkan (C2) jenis hewan berdasarkan daftar ciri fisik dan perilakunya.  

**Soal:**  
Perhatikan ciri-ciri hewan berikut:
• Memiliki cakar yang dapat disembunyikan dan gigi taring tajam
• Suka berburu hewan pengerat (seperti tikus)
• Memiliki bantalan halus di telapak kaki agar langkahnya senyap
Hewan dengan ciri-ciri tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Kucing **<== (Kunci Jawaban)**
- `B`. Kelinci
- `C`. Merpati
- `D`. Kambing

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Kucing adalah karnivora dengan gigi taring dan cakar tajam serta bantalan halus di kakinya.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SD-IPA-04-07 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 3903)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Menghubungkan bentuk paruh burung dengan jenis makanannya.*  
- **Tag Konsep:** `adaptasi_burung, paruh_pipit`  
- **Rubrik Kesulitan:** Menerapkan (C3) bentuk paruh pendek kuat untuk memecah biji.  

**Soal:**  
Jenis burung berikut yang memiliki bentuk paruh pendek, tebal, dan kuat yang berfungsi memecah cangkang biji-bijian adalah ....

**Pilihan Jawaban:**  
- `A`. Burung elang
- `B`. Burung pipit **<== (Kunci Jawaban)**
- `C`. Burung pelikan
- `D`. Burung bangau

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Burung pipit memiliki paruh pendek kokoh untuk memecah biji-bijian (granivora). Elang paruhnya bengkok tajam untuk mencabik daging.

**Catatan Kurasi:** *Kunci B. Koreksi kesalahan kunci IndoMMLU mentah.*  

---

### CUR-SD-IPA-04-08 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 3550)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Menjelaskan kemampuan khusus kelelawar.*  
- **Tag Konsep:** `adaptasi_hewan, ekolokasi_kelelawar`  
- **Rubrik Kesulitan:** Memahami (C2) konsep navigasi gelombang suara pada kelelawar.  

**Soal:**  
Kelelawar mampu terbang di malam gelap gulita tanpa menabrak dinding goa dan mampu menangkap mangsa kecil karena memiliki kemampuan ....

**Pilihan Jawaban:**  
- `A`. Mata yang dapat melihat sinar inframerah
- `B`. Penciuman tajam yang bisa menembus bebatuan
- `C`. Ekolokasi (memancarkan dan menangkap pantulan bunyi ultrasonik) **<== (Kunci Jawaban)**
- `D`. Sayap yang menyala dalam kegelapan

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Ekolokasi adalah sonar biologis yang memungkinkan kelelawar memperkirakan jarak dan bentuk rintangan melalui pantulan suara.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SD-IPA-04-09 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 3913)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Membedakan sistem pencernaan hewan herbivora pemamah biak dengan karnivora.*  
- **Tag Konsep:** `adaptasi_fisiologi, ruminansia`  
- **Rubrik Kesulitan:** Mengidentifikasi (C3) ciri anatomi yang bukan milik karnivora.  

**Soal:**  
Hewan pemangsa (karnivora) memiliki adaptasi khusus untuk berburu. Ciri tubuh berikut yang BUKAN merupakan ciri karnivora melainkan ciri hewan pemamah biak (ruminansia) adalah ....

**Pilihan Jawaban:**  
- `A`. Gigi taring yang runcing dan melengkung
- `B`. Cakar yang tajam dan kokoh
- `C`. Penglihatan binokular yang fokus ke depan
- `D`. Lambung bersekat empat (rumen, retikulum, omasum, abomasum) **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Lambung empat ruang dimiliki oleh ruminansia (seperti sapi dan domba) untuk mencerna serat selulosa tanaman, bukan karnivora.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SD-IPA-04-10 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 3907)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Menjelaskan tahapan daur hidup katak.*  
- **Tag Konsep:** `daur_hidup, katak_amfibi`  
- **Rubrik Kesulitan:** Mengurutkan (C3) perubahan organ pernapasan berudu menjadi katak dewasa.  

**Soal:**  
Pada daur hidup katak, berudu hidup di dalam air dan bernapas dengan insang. Setelah bermetamorfosis menjadi katak dewasa yang hidup di darat dan air, organ pernapasannya berubah menggunakan ....

**Pilihan Jawaban:**  
- `A`. Paru-paru dan permukaan kulit yang lembap **<== (Kunci Jawaban)**
- `B`. Insang luar dan sirip dada
- `C`. Trakea dan stomata
- `D`. Kantung udara di sayap

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Katak dewasa bernapas dengan paru-paru sederhana dan menyerap oksigen melalui kulitnya yang tipis dan basah.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SD-IPA-04-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 3524)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Menganalisis perbedaan strategi pertahanan diri pada berbagai hewan.*  
- **Tag Konsep:** `adaptasi_perilaku, kamuflase_vs_autotomi`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) jenis adaptasi perilaku pertahanan diri secara kontekstual tanpa istilah asing obscure.  

**Soal:**  
Perhatikan cara hewan mempertahankan diri dari serangan pemangsa berikut:
1. Cecak memutuskan ekornya yang masih bergeliut untuk mengalihkan perhatian musuh
2. Bunglon mengubah warna kulitnya menyerupai ranting atau daun tempat ia hinggap
3. Walang sangit mengeluarkan bau busuk menyengat
Berdasarkan cara pertahanan tersebut, strategi yang digunakan oleh cecak (nomor 1) dan bunglon (nomor 2) berturut-turut adalah ....

**Pilihan Jawaban:**  
- `A`. Kamuflase dan mimikri
- `B`. Autotomi (memutuskan bagian tubuh) dan kamuflase (menyamar dengan lingkungan) **<== (Kunci Jawaban)**
- `C`. Hibernasi dan adaptasi fisiologi
- `D`. Ekolokasi dan sengatan bisa racun

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Cecak melakukan autotomi untuk meloloskan diri, sedangkan bunglon melakukan kamuflase warna kulit agar tersamar dari pandangan predator.

**Catatan Kurasi:** *Kunci B. Merevisi soal asli agar edukatif bagi anak SD.*  

---

### CUR-SD-IPA-04-12 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 3649)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Mengevaluasi dampak kerusakan ekosistem laut terhadap populasi ikan.*  
- **Tag Konsep:** `konservasi_laut, terumbu_karang_evaluasi`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) hubungan antara karang sebagai habitat dengan penurunan drastis populasi ikan pesisir.  

**Soal:**  
Penangkapan ikan menggunakan bahan peledak (bom ikan) merusak terumbu karang secara luas. Dampak paling berbahaya bagi kelangsungan hidup hewan-hewan laut dalam jangka panjang adalah ....

**Pilihan Jawaban:**  
- `A`. Air laut menjadi terasa lebih tawar karena terumbu karang hancur
- `B`. Suhu air laut menjadi sangat dingin dan membekukan ikan
- `C`. Ikan kehilangan tempat bertelur, berlindung, dan mencari makan sehingga populasinya runtuh **<== (Kunci Jawaban)**
- `D`. Hewan laut bertransformasi menjadi hewan darat

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Terumbu karang adalah nursery ground (tempat pemijahan dan asuhan anak ikan). Hancurnya karang memutus siklus regenerasi populasi ikan laut.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SD-IPA-04-13 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 3517)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Menganalisis ketidakseimbangan ekosistem akibat hilangnya predator puncak.*  
- **Tag Konsep:** `analisis_rantai_makanan, dampak_perburuan_predator`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) hubungan sebab-akibat perburuan predator puncak dengan ledakan hama pertanian.  

**Soal:**  
Di suatu kawasan perkebunan kelapa sawit dan ladang singkong, perburuan liar terhadap burung hantu dan ular piton marak terjadi. Dua bulan kemudian, petani mengeluhkan hasil panen singkong rusak parah digerogoti tikus. Analisis ilmiah yang tepat menjelaskan kejadian tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Burung hantu dan ular adalah pemangsa alami hama tikus; ketika predator musnah, populasi tikus meledak tanpa kendali **<== (Kunci Jawaban)**
- `B`. Tikus memakan bangkai burung hantu sehingga tubuh tikus menjadi kebal racun
- `C`. Tanaman singkong menarik tikus karena tidak ada bau bulu burung hantu
- `D`. Perburuan ular membuat tanah menjadi tandus dan menarik kedatangan tikus

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Burung hantu dan ular adalah pengendali biologis (predator) alami hama tikus. Hilangnya pemangsa memicu lonjakan eksponensial hama.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SD-IPA-04-14 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 3520)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B–C: Menganalisis hubungan bentuk kaki burung dengan habitat dan cara berburu makanannya.*  
- **Tag Konsep:** `morfologi_burung, analisis_kaki_burung`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) kesesuaian struktur jari kaki berselaput dengan fungsi berenang di air.  

**Soal:**  
Bebek dan angsa memiliki selaput renang di antara jari-jari kakinya, sedangkan ayam memiliki jari kaki terpisah dengan cakar pendek. Jika bebek dipelihara di tanah kering tanpa kolam air dan ayam dilepas di kolam yang dalam, analisis adaptasi yang BENAR adalah ....

**Pilihan Jawaban:**  
- `A`. Ayam akan berenang lebih cepat daripada bebek karena cakarnya tajam mencengkeram air
- `B`. Kaki berselaput bebek berfungsi seperti dayung di air; ayam akan tenggelam di air dalam karena kakinya tidak memiliki selaput untuk mengayuh **<== (Kunci Jawaban)**
- `C`. Bebek tidak bisa berjalan di darat karena selaput kakinya akan robek seketika
- `D`. Keduanya dapat berenang dengan kemampuan yang sama persis

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Kaki berselaput bertindak sebagai dayung efektif di air. Kaki ayam beradaptasi untuk mengais tanah kering (mencakar), bukan berenang.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SD-IPA-04-15 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 3528)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Mengevaluasi metode perlindungan satwa terancam punah di Indonesia.*  
- **Tag Konsep:** `konservasi_spesies, evaluasi_suaka_margasatwa`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) perbedaan pendekatan perlindungan satwa liar di alam bebas vs penangkaran buatan.  

**Soal:**  
Orangutan kalimantan (*Pongo pygmaeus*) saat ini terancam punah akibat penyempitan habitat hutan hujan. Pemerintah mendirikan Pusat Rehabilitasi Orangutan di Tanjung Puting untuk merawat anak orangutan korban kebakaran hutan sebelum dilepasliarkan kembali ke alam liar. Evaluasi yang paling tepat mengenai program tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Program tersebut sia-sia karena orangutan lebih baik dijadikan hewan sirkus dan tontonan komersial
- `B`. Rehabilitasi dan pelatihan bertahan hidup sangat penting agar orangutan dapat mandiri mencari makan dan selamat saat kembali ke habitat alaminya **<== (Kunci Jawaban)**
- `C`. Semua orangutan sebaiknya dikurung permanen di kandang besi agar tidak diganggu manusia
- `D`. Pelepasliaran satwa liar langsung ke hutan tanpa rehabilitasi lebih aman dan hemat biaya

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Orangutan muda yang lama terpisah dari induknya kehilangan naluri memanjat dan mengenali buah hutan. Sekolah hutan mengajarkan survival skills sebelum rilis.

**Catatan Kurasi:** *Kunci B.*  

---

## Topik `SD-IPA-10`: Energi dan Perubahannya (SD — IPAS)

### CUR-SD-IPA-10-01 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 3862)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Mengidentifikasi sumber energi utama di bumi.*  
- **Tag Konsep:** `sumber_energi, matahari`  
- **Rubrik Kesulitan:** Mengingat (C1) sumber energi panas dan cahaya terbesar bumi.  

**Soal:**  
Sumber energi panas dan cahaya terbesar yang menjadi penopang utama kehidupan di bumi adalah ....

**Pilihan Jawaban:**  
- `A`. Batu bara
- `B`. Minyak bumi
- `C`. Matahari **<== (Kunci Jawaban)**
- `D`. Aliran listrik PLN

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Matahari memancarkan energi cahaya dan panas raksasa yang menggerakkan siklus cuaca, air, dan fotosintesis tanaman di bumi.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SD-IPA-10-02 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 3864)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Mengidentifikasi perubahan energi pada alat rumah tangga.*  
- **Tag Konsep:** `perubahan_energi, listrik_ke_gerak`  
- **Rubrik Kesulitan:** Mengenali (C1) peralatan yang menghasilkan gerak dari listrik.  

**Soal:**  
Peralatan rumah tangga berikut ini yang memanfaatkan perubahan energi listrik menjadi energi gerak adalah ....

**Pilihan Jawaban:**  
- `A`. Setrika baju dan pemanggang roti
- `B`. Lampu LED dan senter
- `C`. Radio dan pengeras suara
- `D`. Kipas angin dan blender **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Kipas angin dan blender memanfaatkan motor listrik untuk memutar baling-baling atau pisau pencacah.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SD-IPA-10-03 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 3644)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Menjelaskan manfaat energi panas matahari dalam kehidupan sehari-hari.*  
- **Tag Konsep:** `energi_panas, penguapan_jemuran`  
- **Rubrik Kesulitan:** Memahami (C2) penerapan panas matahari untuk menguapkan air.  

**Soal:**  
Kegiatan sehari-hari yang memanfaatkan langsung energi panas matahari adalah ....

**Pilihan Jawaban:**  
- `A`. Menjemur pakaian basah hingga kering **<== (Kunci Jawaban)**
- `B`. Menyalakan televisi untuk menonton berita
- `C`. Membunyikan bel rumah
- `D`. Menghidupkan pendingin ruangan (AC)

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Radiasi panas matahari memanaskan partikel air di pakaian basah sehingga menguap ke udara menjadi kering.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SD-IPA-10-04 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 3870)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Mengidentifikasi bentuk energi yang tersimpan pada benda.*  
- **Tag Konsep:** `bentuk_energi, energi_kimia_baterai`  
- **Rubrik Kesulitan:** Mengingat (C1) bentuk energi yang tersimpan dalam baterai.  

**Soal:**  
Baterai yang belum digunakan dan makanan yang kita konsumsi sama-sama menyimpan bentuk energi ....

**Pilihan Jawaban:**  
- `A`. Energi gerak
- `B`. Energi kimia **<== (Kunci Jawaban)**
- `C`. Energi bunyi
- `D`. Energi cahaya

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Senyawa kimia di dalam baterai dan nutrisi makanan menyimpan energi ikatan kimia yang siap diubah menjadi energi lain.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SD-IPA-10-05 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 3895)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B: Menunjukkan perilaku hemat energi di rumah.*  
- **Tag Konsep:** `hemat_energi, perilaku_ramah_energi`  
- **Rubrik Kesulitan:** Memahami (C2) tindakan nyata penghematan energi.  

**Soal:**  
Tindakan bijak di rumah yang mencerminkan sikap hemat energi listrik adalah ....

**Pilihan Jawaban:**  
- `A`. Menyalakan lampu kamar tidur sepanjang siang hari
- `B`. Membiarkan pintu kulkas terbuka lebar saat memasak
- `C`. Mematikan lampu dan kipas angin saat meninggalkan ruangan kosong **<== (Kunci Jawaban)**
- `D`. Membiarkan kabel charger HP terus tertancap di stopkontak tanpa dipakai

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Mematikan perangkat elektronik yang sedang tidak dipakai mencegah pemborosan daya listrik.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SD-IPA-10-06 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 3872)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Menganalisis alur konversi energi pada rangkaian listrik sederhana.*  
- **Tag Konsep:** `perubahan_energi, senter_baterai`  
- **Rubrik Kesulitan:** Menerapkan (C3) urutan perubahan energi dari baterai ke nyala lampu.  

**Soal:**  
Saat kita menyalakan senter yang dipasangi baterai, urutan perubahan energi yang terjadi secara berurutan adalah ....

**Pilihan Jawaban:**  
- `A`. Energi listrik -> energi kimia -> energi panas
- `B`. Energi cahaya -> energi gerak -> energi kimia
- `C`. Energi kimia -> energi gerak -> energi bunyi
- `D`. Energi kimia -> energi listrik -> energi cahaya **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Energi kimia dari bahan elektrolit baterai mengalirkan arus listrik, yang kemudian diubah filamen lampu menjadi cahaya terang.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SD-IPA-10-07 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 3875)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Membedakan sumber energi terbarukan dan tidak terbarukan.*  
- **Tag Konsep:** `energi_terbarukan, sumber_energi_alternatif`  
- **Rubrik Kesulitan:** Mengklasifikasikan (C2) kelompok sumber energi ramah lingkungan yang tidak akan habis.  

**Soal:**  
Kelompok sumber energi berikut yang seluruhnya tergolong sebagai sumber energi terbarukan (tidak akan pernah habis dipakai) adalah ....

**Pilihan Jawaban:**  
- `A`. Sinar matahari, hembusan angin, dan aliran air sungai **<== (Kunci Jawaban)**
- `B`. Minyak tanah, batu bara, dan bensin
- `C`. Gas alam, elpiji, dan solar
- `D`. Batu bara, uranium, dan minyak bumi

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Matahari, angin, dan air mengalir terus diperbarui oleh siklus alam sehingga pasokannya berkelanjutan.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SD-IPA-10-08 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 3881)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase B–C: Menjelaskan perubahan bentuk energi pada alat musik.*  
- **Tag Konsep:** `perubahan_energi, gitar_akustik`  
- **Rubrik Kesulitan:** Menerapkan (C3) konsep getaran dan bunyi pada senar gitar.  

**Soal:**  
Perubahan bentuk energi yang terjadi saat seorang musisi memetik senar gitar akustik adalah ....

**Pilihan Jawaban:**  
- `A`. Energi panas menjadi energi kimia
- `B`. Energi gerak jari menjadi energi getaran dan bunyi **<== (Kunci Jawaban)**
- `C`. Energi listrik menjadi energi gerak
- `D`. Energi bunyi menjadi energi listrik

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Gerakan jari memetik senar menimbulkan getaran mekanik yang merambat di udara menghasilkan gelombang suara.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SD-IPA-10-09 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 3888)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Menjelaskan alasan pentingnya menghemat bahan bakar fosil.*  
- **Tag Konsep:** `bahan_bakar_fosil, kelangkaan_energi`  
- **Rubrik Kesulitan:** Memahami (C2) proses pembentukan bahan bakar fosil yang membutuhkan waktu jutaan tahun.  

**Soal:**  
Alasan utama mengapa manusia harus menghemat penggunaan bahan bakar minyak (BBM) dan batu bara adalah ....

**Pilihan Jawaban:**  
- `A`. Minyak bumi hanya dapat dipompa keluar pada musim hujan
- `B`. Batu bara tidak dapat menghasilkan panas yang tinggi
- `C`. Jumlahnya di perut bumi sangat terbatas dan butuh waktu jutaan tahun untuk terbentuk kembali **<== (Kunci Jawaban)**
- `D`. Mesin kendaraan bermotor akan rusak jika diberi bensin terus-menerus

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Bahan bakar fosil terbentuk dari fosil purba jutaan tahun lalu; pemakaian tanpa henti akan menguras habis cadangannya.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SD-IPA-10-10 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 3898)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Menjelaskan perubahan bentuk energi pada peristiwa fotosintesis.*  
- **Tag Konsep:** `fotosintesis, konversi_energi_kimia`  
- **Rubrik Kesulitan:** Menghubungkan (C3) penyerapan cahaya dengan pembentukan molekul glukosa.  

**Soal:**  
Peristiwa fotosintesis pada daun tumbuhan hijau melibatkan transformasi energi yang sangat penting bagi bumi, yaitu ....

**Pilihan Jawaban:**  
- `A`. Energi panas menjadi energi kinetik gerak
- `B`. Energi listrik menjadi energi cahaya
- `C`. Energi kimia menjadi energi nuklir
- `D`. Energi cahaya matahari menjadi energi kimia dalam bentuk karbohidrat/makanan **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Klorofil menyerap foton cahaya matahari untuk mengikat karbon dioksida dan air menjadi molekul gula glukosa (energi kimia).

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SD-IPA-10-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 3892)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Menganalisis alur transformasi energi pada pembangkit listrik tenaga air (PLTA).*  
- **Tag Konsep:** `plta, analisis_konversi_energi`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) rantai transformasi energi potensial ketinggian air hingga menjadi daya listrik.  

**Soal:**  
Di sebuah bendungan PLTA, air waduk di ketinggian dialirkan melalui pipa besar menuruni lereng untuk menabrak sudu-sudu turbin, yang kemudian memutar generator listrik. Urutan perubahan energi yang tepat pada proses tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Energi potensial gravitasi air -> energi kinetik gerak turbin -> energi listrik generator **<== (Kunci Jawaban)**
- `B`. Energi kimia air -> energi listrik generator -> energi panas turbin
- `C`. Energi panas air -> energi bunyi -> energi gerak turbin
- `D`. Energi listrik -> energi kinetik -> energi potensial

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Ketinggian waduk menyimpan energi potensial gravitasi. Saat meluncur berubah jadi kinetik memutar turbin, lalu generator mengubahnya jadi arus listrik.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SD-IPA-10-12 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 3878)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Mengevaluasi kelebihan dan kelemahan pemanfaatan sel surya (solar cell).*  
- **Tag Konsep:** `panel_surya, evaluasi_energi_bersih`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) solusi energi panel surya di daerah terpencil tropis.  

**Soal:**  
Sebuah desa terpencil di pulau kecil belum terjangkau jaringan listrik PLN. Kepala desa berencana membangun pembangkit listrik dengan memasang panel surya fotovoltaik di atap rumah warga alih-alih menggunakan mesin genset diesel berbahan bakar solar. Keunggulan utama pilihan panel surya tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Panel surya dapat menghasilkan listrik berkekuatan sama banyak saat malam hari tanpa baterai
- `B`. Energi matahari gratis dan melimpah di wilayah tropis serta bebas polusi asap beracun dan kebisingan mesin **<== (Kunci Jawaban)**
- `C`. Panel surya tidak memerlukan kabel dan instalasi apapun untuk mengalirkan listrik
- `D`. Panel surya bekerja lebih bertenaga ketika langit mendung tebal dan hujan badai

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Panel surya memanfaatkan sumber daya terbarukan tanpa emisi karbon dan tanpa biaya beli bahan bakar diesel yang mahal.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SD-IPA-10-13 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 3885)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses IPAS Fase C: Menganalisis pengaruh tarikan pegas/karet terhadap jarak tempuh benda.*  
- **Tag Konsep:** `energi_potensial_pegas, eksperimen_mobil_mainan`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) hubungan regangan elastisitas dengan energi kinetik yang dihasilkan.  

**Soal:**  
Budi membuat mobil mainan bertenaga karet gelang. Ketika karet diputar 5 putaran, mobil meluncur sejauh 2 meter. Ketika karet diputar 15 putaran, mobil meluncur sejauh 6 meter. Penjelasan ilmiah yang tepat mengenai hubungan putaran karet dengan laju mobil mainan adalah ....

**Pilihan Jawaban:**  
- `A`. Semakin banyak putaran karet, massa mobil bertambah berat sehingga melaju kencang
- `B`. Putaran karet tidak memengaruhi energi gerak mobil sama sekali
- `C`. Semakin banyak putaran karet, semakin besar energi potensial pegas yang tersimpan untuk diubah menjadi energi kinetik gerak **<== (Kunci Jawaban)**
- `D`. Karet gelang memanaskan roda mobil sehingga gaya gesek lantai hilang

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Deformasi elastis karet menyimpan energi potensial pegas ($E_p$). Semakin banyak regangan/putaran, semakin besar $E_p$ yang dikonversi menjadi energi kinetik ($E_k$).

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SD-IPA-10-14 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 3890)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Menganalisis efisiensi energi pada teknologi pencahayaan.*  
- **Tag Konsep:** `efisiensi_energi, lampu_led_vs_pijar`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) mengapa lampu LED lebih hemat listrik dibandingkan lampu pijar lama.  

**Soal:**  
Lampu pijar model lama dengan daya 40 watt menghasilkan cahaya yang sama terangnya dengan lampu LED berdaya hanya 6 watt. Jika kedua lampu dinyalakan selama 1 jam, tabung lampu pijar terasa sangat panas ketika disentuh, sedangkan lampu LED tetap dingin. Analisis efisiensi energi yang BENAR adalah ....

**Pilihan Jawaban:**  
- `A`. Lampu LED tidak menggunakan aliran listrik sama sekali
- `B`. Lampu pijar menyerap energi magnet dari dinding rumah
- `C`. Lampu pijar lebih awet karena memproduksi banyak energi panas yang berguna
- `D`. Lampu pijar boros listrik karena sebagian besar energi listrik terbuang percuma menjadi energi panas, sedangkan LED sangat efisien mengubah listrik langsung menjadi cahaya **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Lampu pijar membuang >85% energi listriknya menjadi panas sampingan, sementara LED mengonversi daya langsung ke emisi foton cahaya dingin.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SD-IPA-10-15 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 3897)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPAS Fase C: Merumuskan dan mengevaluasi rencana aksi penghematan energi di sekolah.*  
- **Tag Konsep:** `audit_energi_sekolah, evaluasi_solusi_pemborosan`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) rancangan aksi efisiensi energi bangunan sekolah.  

**Soal:**  
Gedung sekolah SD Harapan Bangsa memiliki tagihan listrik bulanan yang sangat mahal karena banyak ruang kelas yang menggunakan lampu dan pendingin udara (AC) sepanjang hari. Kepala sekolah meminta saran program penghematan energi. Usulan tindakan yang PALING TEPAT dan ramah lingkungan adalah ....

**Pilihan Jawaban:**  
- `A`. Membuka ventilasi dan tirai jendela lebar-lebar untuk memanfaatkan pencahayaan alami matahari dan sirkulasi angin segar, serta mematikan AC dan lampu di jam luar pelajaran **<== (Kunci Jawaban)**
- `B`. Melarang seluruh siswa menyalakan komputer di lab selamanya
- `C`. Mengganti seluruh kaca jendela dengan triplek rapat agar sinar matahari tidak masuk
- `D`. Membeli mesin genset bensin untuk menyalakan AC secara terpisah

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Pemanfaatan ventilasi silang dan daylighting memaksimalkan sumber daya alam tanpa biaya listrik serta menciptakan lingkungan belajar yang sehat.

**Catatan Kurasi:** *Kunci A.*  

---

## Topik `SMP-IPA-01`: Besaran dan Pengukuran (SMP — IPA)

### CUR-SMP-IPA-01-01 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 3995)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D (Kelas 7–9): Mengidentifikasi besaran pokok dan satuan Sistem Internasional (SI).*  
- **Tag Konsep:** `besaran_pokok, satuan_si_panjang`  
- **Rubrik Kesulitan:** Mengingat (C1) satuan baku SI untuk besaran pokok panjang.  

**Soal:**  
Di antara satuan-satuan panjang berikut, yang merupakan satuan baku menurut Sistem Internasional (SI) adalah ....

**Pilihan Jawaban:**  
- `A`. Inci (inch)
- `B`. Meter (m) **<== (Kunci Jawaban)**
- `C`. Kaki (feet)
- `D`. Mil laut (nautical mile)

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Dalam Sistem Internasional (SI), standar satuan pokok untuk panjang adalah meter (m). Inci, kaki, dan mil adalah satuan sistem imperial non-SI.

**Catatan Kurasi:** *Kunci B. Distraktor ditingkatkan dari 'depa' menjadi satuan imperial nyata.*  

---

### CUR-SMP-IPA-01-02 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 3997)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Mengidentifikasi satuan standar besaran pokok waktu.*  
- **Tag Konsep:** `besaran_pokok, satuan_si_waktu`  
- **Rubrik Kesulitan:** Mengingat (C1) satuan SI untuk waktu.  

**Soal:**  
Satuan baku besaran waktu dalam Sistem Internasional (SI) adalah ....

**Pilihan Jawaban:**  
- `A`. Menit
- `B`. Jam
- `C`. Sekon (detik) **<== (Kunci Jawaban)**
- `D`. Hari

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Satuan baku SI untuk besaran waktu adalah sekon (s). Menit dan jam adalah satuan turunan waktu non-SI.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMP-IPA-01-03 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 4020)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menjelaskan pentingnya standarisasi satuan baku dalam sains.*  
- **Tag Konsep:** `satuan_baku, standarisasi`  
- **Rubrik Kesulitan:** Memahami (C2) konsep satuan baku yang nilainya tetap seragam bagi siapa saja.  

**Soal:**  
Satuan pengukuran yang apabila digunakan oleh siapa pun dan di negara mana pun akan menghasilkan nilai ukur yang tepat sama dinamakan ....

**Pilihan Jawaban:**  
- `A`. Satuan tak baku
- `B`. Satuan lokal daerah
- `C`. Satuan perkiraan
- `D`. Satuan baku (standar) **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Satuan baku telah didefinisikan secara konstan melalui perjanjian internasional sehingga dapat direproduksi oleh siapa saja dengan hasil seragam.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMP-IPA-01-04 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 3992)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Membedakan satuan baku dan satuan tak baku.*  
- **Tag Konsep:** `satuan_tak_baku, anatomi_tubuh`  
- **Rubrik Kesulitan:** Membedakan (C2) kelemahan satuan tak baku berbasis tubuh manusia.  

**Soal:**  
Dahulu orang sering mengukur jarak menggunakan ukuran anggota tubuh seperti jengkal, hasta, dan depa. Satuan tersebut dikategorikan sebagai satuan tak baku karena ....

**Pilihan Jawaban:**  
- `A`. Ukuran fisik tubuh setiap orang berbeda-beda sehingga hasil ukur tidak konsisten **<== (Kunci Jawaban)**
- `B`. Sulit dihitung menggunakan kalkulator
- `C`. Hanya boleh digunakan untuk mengukur benda yang berbentuk lingkaran
- `D`. Dilarang secara hukum pidana dalam perdagangan

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Satuan tubuh bersifat subjektif karena panjang jengkal atau depa tiap manusia berbeda, menimbulkan ketidakpastian tinggi.

**Catatan Kurasi:** *Kunci A. Opsi diperbaiki agar memiliki daya diskriminasi konseptual.*  

---

### CUR-SMP-IPA-01-05 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 4402)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Mengidentifikasi pasangan 7 besaran pokok dan satuan SI.*  
- **Tag Konsep:** `besaran_pokok, satuan_si_kelvin`  
- **Rubrik Kesulitan:** Memahami (C2) pasangan besaran pokok dan satuan SI tanpa terkecoh satuan non-SI.  

**Soal:**  
Pasangan antara besaran pokok dan satuan Sistem Internasional (SI) yang PALING TEPAT adalah ....

**Pilihan Jawaban:**  
- `A`. Massa — gram (g)
- `B`. Kuat arus listrik — ampere (A) **<== (Kunci Jawaban)**
- `C`. Suhu mutlak — derajat Celcius (°C)
- `D`. Panjang — kilometer (km)

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Kuat arus listrik satuannya ampere. Massa standar SI adalah kilogram (bukan gram), suhu mutlak SI adalah kelvin (bukan Celcius), panjang SI adalah meter (bukan km).

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMP-IPA-01-06 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 3999)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menentukan satuan besaran turunan berdasarkan rumus penurunannya.*  
- **Tag Konsep:** `besaran_turunan, dimensi_kecepatan`  
- **Rubrik Kesulitan:** Menerapkan (C3) penurunan satuan kecepatan dari jarak dibagi waktu.  

**Soal:**  
Kecepatan merupakan salah satu besaran turunan yang diturunkan dari panjang lintasan dibagi selang waktu. Satuan kecepatan dalam Sistem Internasional (SI) adalah ....

**Pilihan Jawaban:**  
- `A`. km/jam
- `B`. m/s²
- `C`. m/s **<== (Kunci Jawaban)**
- `D`. kg·m/s

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Panjang bersatuan meter (m) dan waktu bersatuan sekon (s), sehingga kecepatan bersatuan m/s. km/jam adalah satuan praktis non-SI, m/s² adalah percepatan.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMP-IPA-01-07 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 4000)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menganalisis besaran pokok penyusun besaran turunan massa jenis.*  
- **Tag Konsep:** `besaran_turunan, massa_jenis`  
- **Rubrik Kesulitan:** Menerapkan (C3) definisi matematis massa jenis terhadap besaran pokok penyusunnya.  

**Soal:**  
Besaran massa jenis (ρ) dirumuskan sebagai perbandingan massa terhadap volumenya (ρ = m/V). Besaran pokok yang menyusun massa jenis adalah ....

**Pilihan Jawaban:**  
- `A`. Massa dan waktu
- `B`. Massa dan percepatan
- `C`. Massa, panjang, dan waktu
- `D`. Massa dan panjang **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Volume (V) diturunkan dari perkalian besaran pokok panjang (panjang x lebar x tinggi = m³). Jadi massa jenis hanya disusun oleh besaran pokok massa dan panjang.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMP-IPA-01-08 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 4007)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses IPA Fase D: Melakukan konversi satuan massa dalam sistem metrik.*  
- **Tag Konsep:** `konversi_satuan, metrik_massa`  
- **Rubrik Kesulitan:** Menerapkan (C3) tangga konversi satuan metrik dari kg ke mg.  

**Soal:**  
Sebuah sampel serbuk kimia bermassa 0,02 kg. Jika dinyatakan dalam satuan miligram (mg), massa serbuk tersebut bernilai ....

**Pilihan Jawaban:**  
- `A`. 20.000 mg **<== (Kunci Jawaban)**
- `B`. 2.000 mg
- `C`. 200.000 mg
- `D`. 200 mg

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
1 kg = 1.000 g = 1.000.000 mg. Maka 0,02 kg = 0,02 × 1.000.000 mg = 20.000 mg.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMP-IPA-01-09 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 4410)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses IPA Fase D: Memilih dan menggunakan alat ukur panjang yang sesuai.*  
- **Tag Konsep:** `alat_ukur, jangka_sorong`  
- **Rubrik Kesulitan:** Menentukan (C3) alat ukur yang tepat untuk mengukur diameter dalam tabung reaksi.  

**Soal:**  
Seorang siswa ingin mengukur diameter bagian dalam sebuah pipa paralon kecil dengan ketelitian mencapai 0,1 mm. Alat ukur yang paling tepat digunakan adalah ....

**Pilihan Jawaban:**  
- `A`. Mistar penggaris baja
- `B`. Jangka sorong menggunakan rahang atasnya **<== (Kunci Jawaban)**
- `C`. Mikrometer sekrup
- `D`. Pita meteran keliling

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Jangka sorong memiliki rahang atas khusus untuk mengukur diameter dalam lubang/pipa dengan batas ketelitian 0,1 mm (atau 0,05 mm). Mikrometer sekrup tidak memiliki rahang dalam.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMP-IPA-01-10 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 4415)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses IPA Fase D: Membaca dan memilih alat ukur dengan tingkat ketelitian tertinggi.*  
- **Tag Konsep:** `alat_ukur, mikrometer_sekrup`  
- **Rubrik Kesulitan:** Menentukan (C3) instrumen yang mampu mengukur ketebalan helai kertas atau kawat tipis.  

**Soal:**  
Untuk mengukur ketebalan selembar kertas HVS atau diameter kawat tembaga halus dengan ketelitian mencapai 0,01 mm, alat ukur yang paling tepat digunakan adalah ....

**Pilihan Jawaban:**  
- `A`. Mistar rol meter
- `B`. Jangka sorong rahang bawah
- `C`. Mikrometer sekrup **<== (Kunci Jawaban)**
- `D`. Neraca pegas

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Mikrometer sekrup memiliki tingkat ketelitian tertinggi di antara alat ukur panjang mekanis sederhana, yaitu hingga 0,01 mm (0,001 cm).

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMP-IPA-01-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 4420)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses IPA Fase D: Menganalisis volume benda tak beraturan menggunakan metode perpindahan zat cair.*  
- **Tag Konsep:** `pengukuran_volume, gelas_ukur_benda_tak_beraturan`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) metode gelas ukur untuk menghitung volume dan massa jenis batu kerikil.  

**Soal:**  
Sebuah batu kerikil yang bentuknya tidak beraturan ditimbang dengan neraca dan massanya terukur 150 gram. Untuk mengetahui volumenya, batu tersebut dimasukkan ke dalam gelas ukur yang mula-mula berisi air 50 mL. Setelah batu tenggelam seluruhnya di dasar gelas ukur, permukaan air naik menjadi 110 mL. Massa jenis batu kerikil tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. 1,5 g/cm³
- `B`. 3,0 g/cm³
- `C`. 0,4 g/cm³
- `D`. 2,5 g/cm³ **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Volume batu V = V_akhir - V_awal = 110 mL - 50 mL = 60 mL = 60 cm³. Massa jenis ρ = m / V = 150 g / 60 cm³ = 2,5 g/cm³ (atau 2.500 kg/m³).

**Catatan Kurasi:** *Kunci D. Menggantikan soal usang 1 kg air pada 4°C dengan soal HOTS pengukuran nyata.*  

---

### CUR-SMP-IPA-01-12 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 4425)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses IPA Fase D: Membaca hasil pengukuran jangka sorong dengan skala utama dan nonius.*  
- **Tag Konsep:** `pembacaan_jangka_sorong, skala_nonius`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) pembacaan skala utama dan skala nonius jangka sorong.  

**Soal:**  
Hasil pengukuran tebal sebuah balok kayu dengan jangka sorong menunjukkan angka pada skala utama berada tepat setelah 3,4 cm. Garis ke-7 pada skala nonius terlihat berimpit lurus dengan garis skala utama di atasnya. Jika ketelitian jangka sorong tersebut adalah 0,01 cm (0,1 mm), maka tebal balok kayu yang terukur adalah ....

**Pilihan Jawaban:**  
- `A`. 3,47 cm **<== (Kunci Jawaban)**
- `B`. 3,74 cm
- `C`. 3,407 cm
- `D`. 4,10 cm

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Tebal = Skala Utama + (Skala Nonius × Ketelitian) = 3,4 cm + (7 × 0,01 cm) = 3,4 cm + 0,07 cm = 3,47 cm.

**Catatan Kurasi:** *Kunci A. Soal HOTS pembacaan instrumen.*  

---

### CUR-SMP-IPA-01-13 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 4430)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses IPA Fase D: Mengevaluasi sumber-sumber kesalahan pengukuran di laboratorium.*  
- **Tag Konsep:** `kesalahan_pengukuran, paralaks_evaluasi`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) penyebab kesalahan pembacaan skala (kesalahan paralaks).  

**Soal:**  
Tiga orang siswa membaca ketinggian zat cair pada sebuah tabung buret:
• Siswa A melihat dari posisi miring ke atas
• Siswa B melihat dengan posisi mata tegak lurus mendatar persis sejajar meniskus bawah cairan
• Siswa C melihat dari posisi miring ke bawah
Hasil bacaan siswa A, B, dan C menghasilkan angka yang berbeda-beda. Penjelasan yang paling tepat mengevaluasi terjadinya perbedaan hasil ukur tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Cairan di dalam buret menguap sangat cepat sehingga volumenya selalu berubah
- `B`. Terjadi kesalahan paralaks akibat sudut pandang mata yang tidak tegak lurus skala; pembacaan yang valid hanya posisi Siswa B **<== (Kunci Jawaban)**
- `C`. Suhu tubuh siswa memuai buret sehingga skalanya melengkung
- `D`. Semua hasil pembacaan harus dijumlahkan lalu dibagi tiga untuk mendapatkan nilai mutlak

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Kesalahan paralaks terjadi karena sudut pandang tidak tegak lurus dengan permukaan skala. Mata pengamat harus tegak lurus tepat sejajar meniskus cairan.

**Catatan Kurasi:** *Kunci B. Evaluasi prosedur pengukuran saintifik.*  

---

### CUR-SMP-IPA-01-14 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 4435)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Memprediksi posisi benda dalam air berdasarkan perbandingan massa jenis.*  
- **Tag Konsep:** `massa_jenis_benda, prediksi_terapung_tenggelam`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) perhitungan massa jenis balok dan memprediksi interaksinya di dalam fluida air.  

**Soal:**  
Sebuah balok padat memiliki ukuran panjang 10 cm, lebar 5 cm, dan tebal 4 cm. Ketika ditimbang, massa balok tersebut adalah 160 gram. Jika massa jenis air murni adalah 1,0 g/cm³ (1.000 kg/m³), peristiwa yang akan terjadi ketika balok tersebut dicelupkan ke dalam bejana berisi air adalah ....

**Pilihan Jawaban:**  
- `A`. Balok akan tenggelam sepenuhnya dan menetap di dasar bejana
- `B`. Balok akan larut seketika menjadi gas
- `C`. Balok akan terapung dengan sebagian volumenya menyembul di atas permukaan air **<== (Kunci Jawaban)**
- `D`. Balok akan melayang persis di tengah air tanpa ada yang muncul

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Volume balok = 10 × 5 × 4 = 200 cm³. Massa jenis balok ρ_benda = m / V = 160 g / 200 cm³ = 0,8 g/cm³. Karena ρ_benda (0,8) < ρ_air (1,0), balok terapung (80% tenggelam, 20% menyembul).

**Catatan Kurasi:** *Kunci C. Analisis massa jenis dan Archimedes.*  

---

### CUR-SMP-IPA-01-15 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 4440)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses IPA Fase D: Mengevaluasi kesesuaian alat ukur terhadap objek eksperimen.*  
- **Tag Konsep:** `pemilihan_alat_ukur, evaluasi_presisi_eksperimen`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) ketepatan pemilihan instrumen ukur berdasarkan batas ketelitian minimum yang dituntut.  

**Soal:**  
Seorang teknisi laboratorium diminta membuat kabel jaringan khusus dengan toleransi diameter kawat tembaga tidak boleh meleset lebih dari 0,02 mm. Teknisi tersebut memiliki tiga pilihan alat: (1) Mistar baja ketelitian 1 mm, (2) Jangka sorong ketelitian 0,1 mm, dan (3) Mikrometer sekrup ketelitian 0,01 mm. Evaluasi pilihan alat yang PALING TEPAT memenuhi syarat toleransi tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Mistar baja karena panjangnya mencukupi untuk mengukur seluruh kawat
- `B`. Jangka sorong karena memiliki rahang pengunci yang kuat
- `C`. Semua alat sama baiknya asalkan dilakukan berulang kali
- `D`. Mikrometer sekrup, karena memiliki batas ketelitian 0,01 mm yang jauh lebih kecil dan teliti daripada batas toleransi 0,02 mm **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Untuk mendeteksi deviasi 0,02 mm, instrumen harus memiliki skala terkecil lebih halus dari batas toleransi tersebut. Mikrometer sekrup (0,01 mm) adalah satu-satunya alat yang mampu.

**Catatan Kurasi:** *Kunci D.*  

---

## Topik `SMP-IPA-04`: Gerak dan Gaya (SMP — IPA)

### CUR-SMP-IPA-04-01 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 6961)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menjelaskan karakteristik Gerak Lurus Beraturan (GLB).*  
- **Tag Konsep:** `glb, ciri_kecepatan_tetap`  
- **Rubrik Kesulitan:** Mengingat (C1) definisi dasar GLB.  

**Soal:**  
Ciri utama dari suatu benda yang bergerak lurus beraturan (GLB) pada lintasan lurus adalah ....

**Pilihan Jawaban:**  
- `A`. Kecepatan geraknya selalu tetap (konstan) dan percepatannya nol **<== (Kunci Jawaban)**
- `B`. Kecepatannya bertambah semakin besar secara teratur
- `C`. Kecepatannya berkurang hingga akhirnya berhenti mendadak
- `D`. Arah geraknya berbelok-belok mengikuti arah angin

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Pada GLB, kecepatan benda tidak berubah terhadap waktu (konstan), yang berarti nilai percepatannya sama dengan nol (a = 0).

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMP-IPA-04-02 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 4385)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menentukan resultan dua gaya segaris dan searah.*  
- **Tag Konsep:** `resultan_gaya, vektor_gaya_searah`  
- **Rubrik Kesulitan:** Memahami (C2) aturan penjumlahan vektor gaya searah.  

**Soal:**  
Resultan dari dua buah gaya yang bekerja pada satu garis lurus dan memiliki arah yang sama diperoleh dengan cara ....

**Pilihan Jawaban:**  
- `A`. Mengurangkan gaya yang besar dengan gaya yang kecil
- `B`. Menjumlahkan kedua nilai gaya tersebut (R = F1 + F2) **<== (Kunci Jawaban)**
- `C`. Mengalikan kedua nilai gaya tersebut
- `D`. Membagi nilai gaya pertama dengan gaya kedua

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Gaya adalah besaran vektor. Dua vektor yang segaris dan searah saling menguatkan sehingga resultannya merupakan penjumlahan kedua gaya.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMP-IPA-04-03 — Tingkat: **Mudah** | Kognitif: **C3** (Sumber ID: 6930)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses IPA Fase D: Menghitung resultan gaya searah pada benda.*  
- **Tag Konsep:** `perhitungan_resultan, gaya_searah`  
- **Rubrik Kesulitan:** Menerapkan (C3) rumus penjumlahan resultan gaya searah.  

**Soal:**  
Ali dan Joko mendorong sebuah gerobak ke arah barat. Ali mendorong dengan gaya 35 N dan Joko mendorong dengan gaya 45 N. Besar dan arah resultan gaya dorong mereka berdua adalah ....

**Pilihan Jawaban:**  
- `A`. 10 N ke arah timur
- `B`. 80 N ke arah timur
- `C`. 80 N ke arah barat **<== (Kunci Jawaban)**
- `D`. 10 N ke arah barat

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Kedua gaya sama-sama berarah ke barat: R = F1 + F2 = 35 N + 45 N = 80 N ke arah barat.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMP-IPA-04-04 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 4017)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Mengidentifikasi bentuk energi yang dimiliki oleh benda bergerak.*  
- **Tag Konsep:** `energi_kinetik, gerak_dan_massa`  
- **Rubrik Kesulitan:** Mengingat (C1) istilah energi gerak (energi kinetik).  

**Soal:**  
Setiap benda yang memiliki massa dan sedang bergerak dengan kelajuan tertentu di ruang angkasa maupun bumi memiliki bentuk energi ....

**Pilihan Jawaban:**  
- `A`. Energi kimia
- `B`. Energi potensial listrik
- `C`. Energi pegas
- `D`. Energi kinetik **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Energi kinetik ($E_k = \frac{1}{2}mv^2$) adalah energi yang melekat pada setiap benda yang sedang bergerak dengan kecepatan v.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMP-IPA-04-05 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 6970)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menjelaskan konsep kelembaman (Hukum I Newton).*  
- **Tag Konsep:** `hukum_newton_1, kelembaman_inersia`  
- **Rubrik Kesulitan:** Memahami (C2) konsep inersia pada tubuh penumpang kendaraan.  

**Soal:**  
Peristiwa tubuh penumpang bus yang terdorong ke depan ketika sopir tiba-tiba menginjak rem mendadak merupakan bukti berlakunya ....

**Pilihan Jawaban:**  
- `A`. Hukum I Newton (sifat kelembaman atau inersia benda) **<== (Kunci Jawaban)**
- `B`. Hukum II Newton tentang percepatan gravitasi
- `C`. Hukum III Newton tentang aksi dan reaksi
- `D`. Hukum Kekekalan Massa

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Hukum I Newton menyatakan benda cenderung mempertahankan kondisi geraknya. Saat bus melaju lalu direm, tubuh penumpang ingin mempertahankan gerak maju sehingga terdorong ke depan.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMP-IPA-04-06 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 4384)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menghitung resultan dua gaya yang berlawanan arah.*  
- **Tag Konsep:** `resultan_gaya, gaya_berlawanan_arah`  
- **Rubrik Kesulitan:** Menerapkan (C3) aturan pengurangan gaya yang berlawanan arah.  

**Soal:**  
Dua regu siswa sedang melakukan tarik tambang. Regu A menarik tambang ke arah kiri dengan gaya 150 N, sedangkan Regu B menarik ke arah kanan dengan gaya 115 N. Besar dan arah resultan gaya tarik tambang tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. 265 N ke arah kiri
- `B`. 35 N ke arah kiri **<== (Kunci Jawaban)**
- `C`. 35 N ke arah kanan
- `D`. 265 N ke arah kanan

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Kedua gaya berlawanan arah: R = F_kiri - F_kanan = 150 N - 115 N = 35 N ke arah kiri (searah gaya yang lebih besar).

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMP-IPA-04-07 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 6883)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menghitung kelajuan rata-rata kendaraan.*  
- **Tag Konsep:** `kecepatan_rata_rata, glb_jarak_waktu`  
- **Rubrik Kesulitan:** Menerapkan (C3) rumus v = s/t dengan konversi satuan menit ke jam.  

**Soal:**  
Sebuah sepeda motor menempuh perjalanan antarkota sejauh 30 km dalam waktu 45 menit. Kelajuan rata-rata sepeda motor tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. 22,5 km/jam
- `B`. 30 km/jam
- `C`. 40 km/jam **<== (Kunci Jawaban)**
- `D`. 60 km/jam

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Waktu t = 45 menit = 45/60 jam = 0,75 jam. Kelajuan v = s / t = 30 km / 0,75 jam = 40 km/jam.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMP-IPA-04-08 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 6782)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menerapkan Hukum II Newton untuk menentukan massa benda.*  
- **Tag Konsep:** `hukum_newton_2, perhitungan_massa`  
- **Rubrik Kesulitan:** Menerapkan (C3) rumus Hukum II Newton m = F/a.  

**Soal:**  
Sebuah resultan gaya konstan sebesar 50 N bekerja pada sebuah balok kayu di atas lantai licin dan menimbulkan percepatan gerak sebesar 2,5 m/s². Massa balok kayu tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. 125 kg
- `B`. 12,5 kg
- `C`. 20 N
- `D`. 20 kg **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Berdasarkan Hukum II Newton F = m × a, maka m = F / a = 50 N / 2,5 m/s² = 20 kg. Satuan massa adalah kg, bukan Newton.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMP-IPA-04-09 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 6781)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Membedakan massa dan berat serta menghitung gaya berat benda.*  
- **Tag Konsep:** `gaya_berat, percepatan_gravitasi`  
- **Rubrik Kesulitan:** Menerapkan (C3) rumus w = m × g.  

**Soal:**  
Seorang astronot bermassa 60 kg berada di permukaan Bulan yang memiliki percepatan gravitasi g = 1,6 m/s². Gaya berat astronot tersebut saat ditimbang di permukaan Bulan adalah ....

**Pilihan Jawaban:**  
- `A`. 96 N **<== (Kunci Jawaban)**
- `B`. 600 N
- `C`. 37,5 N
- `D`. 96 kg

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Gaya berat w = m × g = 60 kg × 1,6 m/s² = 96 N. Di bumi beratnya 600 N, namun di bulan hanya 96 N karena gravitasi bulan lebih lemah.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMP-IPA-04-10 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 6885)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menghitung percepatan pada gerak lurus berubah beraturan (GLBB).*  
- **Tag Konsep:** `glbb, perhitungan_percepatan`  
- **Rubrik Kesulitan:** Menerapkan (C3) rumus a = (vt - vo)/t.  

**Soal:**  
Sebuah mobil mula-mula diam di garasi. Saat mesin dinyalakan dan digas, kecepatannya bertambah secara teratur hingga mencapai 18 m/s dalam selang waktu 6 detik. Percepatan mobil tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. 108 m/s²
- `B`. 3 m/s² **<== (Kunci Jawaban)**
- `C`. 0,33 m/s²
- `D`. 12 m/s²

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Percepatan a = (vt - v0) / t = (18 m/s - 0 m/s) / 6 s = 3 m/s².

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMP-IPA-04-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 6938)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menganalisis percepatan benda dengan resultan gaya ganda.*  
- **Tag Konsep:** `hukum_newton_2, resultan_dua_gaya_percepatan`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) percepatan peti dengan dua gaya dorong searah di atas lantai licin.  

**Soal:**  
Sebuah peti bermassa total 100 kg berada di atas lantai gudang yang licin (gesekan diabaikan). Dua orang pekerja mendorong peti tersebut secara bersamaan ke arah pintu keluar. Pekerja pertama mendorong dengan gaya 55 N dan pekerja kedua mendorong dengan gaya 45 N. Percepatan yang dialami peti tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. 0,1 m/s²
- `B`. 0,45 m/s²
- `C`. 1,0 m/s² **<== (Kunci Jawaban)**
- `D`. 2,0 m/s²

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Total gaya F_total = F1 + F2 = 55 N + 45 N = 100 N. Berdasarkan Hukum II Newton: a = F_total / m = 100 N / 100 kg = 1,0 m/s².

**Catatan Kurasi:** *Kunci C. Koreksi perhitungan ilmiah.*  

---

### CUR-SMP-IPA-04-12 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 6965)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses IPA Fase D: Menganalisis grafik kecepatan terhadap waktu (v-t).*  
- **Tag Konsep:** `grafik_gerak, analisis_v_t`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) grafik gerak v-t horizontal vs miring.  

**Soal:**  
Pada grafik kecepatan terhadap waktu (v–t) suatu kendaraan:
• Dari detik ke-0 hingga detik ke-5, kurva grafik membentuk garis lurus mendatar (sejajar sumbu waktu t pada nilai v = 20 m/s)
• Dari detik ke-5 hingga detik ke-10, kurva grafik membentuk garis lurus miring ke atas (nilai v naik dari 20 m/s menjadi 35 m/s)
Analisis jenis gerak kendaraan pada selang 0–5 detik dan 5–10 detik berturut-turut adalah ....

**Pilihan Jawaban:**  
- `A`. GLBB dipercepat, kemudian GLB
- `B`. Kendaraan diam total, kemudian GLB
- `C`. GLBB diperlambat, kemudian GLBB dipercepat
- `D`. GLB dengan kecepatan tetap 20 m/s, kemudian GLBB dipercepat secara teratur **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Garis mendatar pada grafik v-t menandakan v konstan (GLB, percepatan 0). Garis miring ke atas menandakan v bertambah secara teratur (GLBB dipercepat).

**Catatan Kurasi:** *Kunci D. Soal HOTS interpretasi grafik fisika.*  

---

### CUR-SMP-IPA-04-13 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 6975)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Mengevaluasi pasangan gaya aksi-reaksi (Hukum III Newton).*  
- **Tag Konsep:** `hukum_newton_3, aksi_reaksi_roket`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) penerapan Hukum III Newton pada daya dorong roket di ruang hampa.  

**Soal:**  
Sebuah roket antariksa dapat melesat maju di ruang hampa udara yang tidak memiliki udara atau benda padat untuk ditolak. Fenomena ini dapat dijelaskan secara ilmiah berdasarkan Hukum III Newton karena ....

**Pilihan Jawaban:**  
- `A`. Roket menyemburkan gas pembakaran ke belakang (gaya aksi), dan semburan gas tersebut memberikan gaya dorong reaksi yang sama besar ke depan pada badan roket **<== (Kunci Jawaban)**
- `B`. Massa roket bertambah ringan saat bahan bakar habis sehingga terbang sendiri
- `C`. Gaya gesek ruang hampa menarik bagian moncong roket ke depan
- `D`. Gravitasi matahari menarik roket tanpa perlu adanya gaya dorong

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Gaya aksi-reaksi bekerja pada dua benda berbeda (roket dan gas semburan). Semburan gas ke belakang menghasilkan reaksi dorong ke depan tanpa perlu atmosfer luar.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMP-IPA-04-14 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 6942)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menghitung percepatan gerak dengan mempertimbangkan gaya gesekan.*  
- **Tag Konsep:** `gaya_gesek, hukum_newton_2_dengan_gesekan`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) resultan gaya netto yang dikurangi gaya gesek lantai.  

**Soal:**  
Sebuah balok es bermassa 20 kg ditarik di atas lantai kasar dengan gaya mendatar sebesar 90 N. Jika gaya gesekan antara lantai dan balok es adalah 30 N berlawanan arah gerak, maka percepatan yang dialami balok es tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. 4,5 m/s²
- `B`. 3,0 m/s² **<== (Kunci Jawaban)**
- `C`. 6,0 m/s²
- `D`. 1,5 m/s²

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Resultan gaya bersih F_net = F_tarik - f_gesek = 90 N - 30 N = 60 N. Percepatan a = F_net / m = 60 N / 20 kg = 3,0 m/s².

**Catatan Kurasi:** *Kunci B. Soal HOTS dinamika partikel.*  

---

### CUR-SMP-IPA-04-15 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 6980)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Mengevaluasi kaitan kecepatan dan inersia dengan jarak aman berkendara.*  
- **Tag Konsep:** `keselamatan_jalan, evaluasi_jarak_pengereman`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) bahaya mengemudi kencang berdasarkan prinsip energi kinetik dan perlambatan.  

**Soal:**  
Berdasarkan prinsip fisika, energi kinetik benda sebanding dengan kuadrat kelajuannya (Ek ~ v²). Jika sebuah mobil menggandakan kelajuannya dari 30 km/jam menjadi 60 km/jam di jalan tol, evaluasi yang BENAR mengenai jarak aman pengereman mendadak yang dibutuhkan hingga mobil benar-benar berhenti adalah ....

**Pilihan Jawaban:**  
- `A`. Jarak pengereman tetap sama persis karena massa mobil tidak bertambah
- `B`. Jarak pengereman hanya bertambah 2 kali lipat lebih panjang
- `C`. Jarak pengereman meningkat menjadi sekitar 4 kali lipat lebih panjang sehingga risiko tabrakan melonjak drastis jika tidak menjaga jarak aman **<== (Kunci Jawaban)**
- `D`. Mobil akan berhenti seketika tanpa memerlukan jarak pengereman sama sekali

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Usaha rem W = F × s = ΔEk = ½ m(v²). Bila kelajuan naik 2 kali (2v), Ek naik 2² = 4 kali lipat, menuntut jarak henti pengereman 4 kali lebih panjang.

**Catatan Kurasi:** *Kunci C. Evaluasi keselamatan berkendara kontekstual.*  

---

## Topik `SMP-IPA-15`: Tata Surya dan Bumi (SMP — IPA)

### CUR-SMP-IPA-15-01 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 6870)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Mengidentifikasi Matahari sebagai pusat sistem tata surya.*  
- **Tag Konsep:** `heliosentris, pusat_tata_surya`  
- **Rubrik Kesulitan:** Mengingat (C1) pusat peredaran planet dalam sistem tata surya.  

**Soal:**  
Benda langit yang menjadi pusat peredaran seluruh planet dan komet di tata surya kita karena memiliki massa dan gravitasi terbesar adalah ....

**Pilihan Jawaban:**  
- `A`. Bumi
- `B`. Bulan
- `C`. Yupiter
- `D`. Matahari **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Model heliosentris membuktikan Matahari sebagai bintang pusat tata surya yang mengikat orbit seluruh planet di sekitarnya.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMP-IPA-15-02 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 6871)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Mengenal karakteristik planet-planet anggota tata surya.*  
- **Tag Konsep:** `planet_raksasa, yupiter`  
- **Rubrik Kesulitan:** Mengingat (C1) planet terbesar di tata surya.  

**Soal:**  
Planet di tata surya yang memiliki ukuran fisik terbesar dan tergolong ke dalam kelompok planet raksasa gas adalah ....

**Pilihan Jawaban:**  
- `A`. Yupiter **<== (Kunci Jawaban)**
- `B`. Saturnus
- `C`. Neptunus
- `D`. Bumi

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Yupiter adalah planet terbesar dengan diameter sekitar 142.984 km (volume lebih dari 1.300 kali volume Bumi).

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMP-IPA-15-03 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 6873)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Membedakan meteoroid, meteor, dan meteorit.*  
- **Tag Konsep:** `benda_langit, meteor_meteoroid`  
- **Rubrik Kesulitan:** Mengingat (C1) istilah lintasan cahaya 'bintang jatuh'.  

**Soal:**  
Pecahan batuan antariksa yang memasuki atmosfer bumi dan berpijar terbakar akibat gesekan hebat dengan udara sehingga tampak seperti 'bintang jatuh' dinamakan ....

**Pilihan Jawaban:**  
- `A`. Asteroid
- `B`. Meteor **<== (Kunci Jawaban)**
- `C`. Komet
- `D`. Satelit

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Batuan luar angkasa disebut meteoroid. Saat melesat berpijar di atmosfer disebut meteor. Jika sisanya mendarat di tanah disebut meteorit.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMP-IPA-15-04 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 6880)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Mengurutkan planet-planet dalam (terestrial) dari Matahari.*  
- **Tag Konsep:** `planet_terestrial, planet_dalam`  
- **Rubrik Kesulitan:** Mengingat (C1) urutan empat planet terestrial terdekat ke Matahari.  

**Soal:**  
Empat planet dalam (planet berbatu/terestrial) di tata surya berurutan mulai dari yang paling dekat dengan Matahari adalah ....

**Pilihan Jawaban:**  
- `A`. Venus, Merkurius, Bumi, dan Mars
- `B`. Merkurius, Bumi, Venus, dan Mars
- `C`. Merkurius, Venus, Bumi, dan Mars **<== (Kunci Jawaban)**
- `D`. Mars, Bumi, Venus, dan Merkurius

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Urutan planet terestrial dari yang paling dekat ke matahari adalah Merkurius, Venus, Bumi, dan Mars (dibatasi sabuk asteroid).

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMP-IPA-15-05 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 6875)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menjelaskan dampak rotasi bumi terhadap kehidupan.*  
- **Tag Konsep:** `rotasi_bumi, siang_malam`  
- **Rubrik Kesulitan:** Memahami (C2) akibat perputaran bumi pada porosnya.  

**Soal:**  
Peristiwa alam berikut yang terjadi sebagai akibat langsung dari perputaran Bumi pada porosnya sendiri (rotasi bumi) adalah ....

**Pilihan Jawaban:**  
- `A`. Perubahan musim kemarau dan penghujan
- `B`. Perbedaan lamanya waktu siang dan malam di kutub
- `C`. Pergeseran rasi bintang di langit malam sepanjang tahun
- `D`. Pergantian waktu siang dan malam serta gerak semu harian matahari **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Rotasi bumi berlangsung 24 jam menyebabkan sisi bumi bergantian menghadap matahari (siang) dan membelakangi matahari (malam).

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMP-IPA-15-06 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 6878)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menjelaskan fenomena yang diakibatkan oleh revolusi bumi.*  
- **Tag Konsep:** `revolusi_bumi, pergantian_musim`  
- **Rubrik Kesulitan:** Memahami (C2) interaksi kemiringan poros bumi dan revolusi terhadap pergantian musim.  

**Soal:**  
Peredaran Bumi mengelilingi Matahari (revolusi bumi) yang berlangsung sekitar 365,25 hari disertai kemiringan sumbu rotasi bumi 23,5° mengakibatkan ....

**Pilihan Jawaban:**  
- `A`. Pergantian empat musim di wilayah belahan bumi utara dan selatan **<== (Kunci Jawaban)**
- `B`. Terjadinya fenomena pasang surut air laut harian
- `C`. Pembelokan arah angin pasat oleh gaya Coriolis
- `D`. Perbedaan waktu 1 jam tiap selisih 15 derajat garis bujur

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Kombinasi revolusi dan kemiringan poros 23,5° menyebabkan intensitas sinar matahari yang diterima kutub utara dan selatan bergantian secara periodik menghasilkan musim.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMP-IPA-15-07 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 6884)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menjelaskan karakteristik fisik dan orbit komet.*  
- **Tag Konsep:** `komet, ekor_komet_angin_matahari`  
- **Rubrik Kesulitan:** Memahami (C2) mengapa ekor komet selalu mengarah menjauhi Matahari.  

**Soal:**  
Benda langit komet sering dijuluki 'bintang berekor'. Ketika komet bergerak mendekati Matahari, ekor gas dan debunya selalu terlihat mengarah ....

**Pilihan Jawaban:**  
- `A`. Selalu tegak lurus mengarah ke bumi
- `B`. Selalu menjauhi Matahari karena terdorong oleh radiasi dan angin matahari **<== (Kunci Jawaban)**
- `C`. Selalu tertarik mendekat dan menabrak permukaan Matahari
- `D`. Selalu searah dengan lintasan maju komet

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Tekanan radiasi foton dan partikel bermuatan dari angin matahari (solar wind) meniup material gas dan debu komet sehingga ekornya selalu menjauh dari matahari.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMP-IPA-15-08 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 6889)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menjelaskan posisi Matahari, Bumi, dan Bulan saat gerhana matahari.*  
- **Tag Konsep:** `gerhana_matahari, posisi_benda_langit`  
- **Rubrik Kesulitan:** Menerapkan (C3) konfigurasi geometri gerhana matahari total.  

**Soal:**  
Fenomena gerhana matahari total dapat terjadi apabila konfigurasi letak benda-benda langit berada pada satu garis lurus dengan susunan ....

**Pilihan Jawaban:**  
- `A`. Matahari berada di antara Bulan dan Bumi
- `B`. Bumi berada di antara Matahari dan Bulan pada fase bulan purnama
- `C`. Bulan berada di antara Matahari dan Bumi pada fase bulan baru (mati) **<== (Kunci Jawaban)**
- `D`. Bulan membentuk sudut 90 derajat terhadap garis edar Bumi-Matahari

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Gerhana matahari terjadi saat bayangan umbra Bulan jatuh menutupi permukaan Bumi, yang hanya terjadi jika Bulan berada di tengah antara Matahari dan Bumi pada fase bulan baru.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMP-IPA-15-09 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 6893)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menganalisis pengaruh gravitasi Bulan dan Matahari terhadap pasang surut air laut.*  
- **Tag Konsep:** `pasang_surut, pasang_perbani`  
- **Rubrik Kesulitan:** Menghubungkan (C3) sudut tegak lurus Bulan-Bumi-Matahari dengan pasang perbani.  

**Soal:**  
Pasang perbani (pasang air laut dengan selisih ketinggian terendah antara pasang dan surut) terjadi pada saat posisi Matahari, Bumi, dan Bulan membentuk sudut ....

**Pilihan Jawaban:**  
- `A`. 180° (posisi segaris lurus penuh)
- `B`. 0° (posisi sejajar berimpit)
- `C`. 45°
- `D`. 90° (posisi tegak lurus satu sama lain pada kuartir pertama dan ketiga) **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Pada sudut 90°, gaya tarik gravitasi Matahari saling meniadakan/mengurangi gaya tarik gravitasi Bulan sehingga pasang yang dihasilkan paling rendah (pasang perbani).

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMP-IPA-15-10 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 6897)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Mengidentifikasi karakteristik lapisan atmosfer bumi.*  
- **Tag Konsep:** `atmosfer_bumi, lapisan_troposfer`  
- **Rubrik Kesulitan:** Memahami (C2) fungsi lapisan troposfer sebagai tempat berlangsungnya cuaca.  

**Soal:**  
Lapisan atmosfer Bumi yang paling bawah tempat berkumpulnya sebagian besar uap air dan tempat berlangsungnya seluruh peristiwa cuaca (awan, hujan, petir, dan angin) adalah ....

**Pilihan Jawaban:**  
- `A`. Troposfer **<== (Kunci Jawaban)**
- `B`. Stratosfer
- `C`. Mesosfer
- `D`. Termosfer

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Troposfer membentang dari permukaan tanah hingga ketinggian 12 km dan memuat sekitar 80% total massa atmosfer serta hampir seluruh uap air bumi.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMP-IPA-15-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 6886)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menganalisis fenomena matahari tengah malam (midnight sun) di wilayah kutub.*  
- **Tag Konsep:** `kemiringan_sumbu_bumi, midnight_sun_kutub`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) mengapa kutub utara mengalami siang hari 24 jam terus-menerus pada bulan Juni.  

**Soal:**  
Pada sekitar tanggal 21 Juni, wilayah di lingkaran Kutub Utara (seperti Norwegia utara) mengalami fenomena 'Matahari Tengah Malam' di mana matahari tidak pernah terbenam selama 24 jam penuh. Penyebab astronomis dari fenomena tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Bumi berhenti berputar pada porosnya selama bulan Juni
- `B`. Poros rotasi Bumi miring 23,5° dan belahan bumi utara sedang condong menghadap langsung ke arah Matahari **<== (Kunci Jawaban)**
- `C`. Gravitasi bulan menahan pancaran cahaya matahari di langit utara
- `D`. Jarak orbit Bumi ke Matahari sedang berada pada titik paling dekat (perihelium)

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Kemiringan poros 23,5° membuat kutub utara terus terpapar sinar matahari sepanjang rotasi 24 jam saat musim panas belahan utara (solstis Juni).

**Catatan Kurasi:** *Kunci B. HOTS astronomi posisi bumi.*  

---

### CUR-SMP-IPA-15-12 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 6891)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Menganalisis penyebab kenampakan sisi Bulan yang selalu sama dari Bumi.*  
- **Tag Konsep:** `rotasi_bulan, synchronous_rotation`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) konsep rotasi sinkron (synchronous rotation) antara Bulan dan Bumi.  

**Soal:**  
Dari permukaan Bumi, manusia selalu melihat permukaan Bulan dengan pola kawah dan bentang muka yang sama persis (sisi jauh bulan tidak pernah tampak langsung dari bumi). Penjelasan ilmiah yang tepat mengenai fenomena ini adalah ....

**Pilihan Jawaban:**  
- `A`. Bulan sama sekali tidak berputar pada porosnya
- `B`. Sisi belakang Bulan tertutup oleh debu kosmis yang gelap gulita
- `C`. Periode rotasi Bulan pada porosnya sama persis dengan periode revolusi Bulan mengelilingi Bumi (rotasi sinkron) **<== (Kunci Jawaban)**
- `D`. Kecepatan orbit Bulan mengitari bumi selalu 2 kali lebih cepat dari rotasi bumi

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Penguncian gravitasi pasang surut (tidal locking) membuat kala rotasi Bulan sama dengan kala revolusinya (~27,3 hari), sehingga sisi yang sama selalu menghadap Bumi.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMP-IPA-15-13 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 6902)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Mengevaluasi perbedaan efek rumah kaca alami dan pemanasan global antropogenik.*  
- **Tag Konsep:** `efek_rumah_kaca, evaluasi_pemanasan_global`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) fungsi esensial efek rumah kaca alami vs bahaya peningkatan CO2 industri berlebih.  

**Soal:**  
Gas rumah kaca (seperti uap air, karbon dioksida, dan metana) sering dianggap berbahaya. Namun para ilmuwan atmosfer menyatakan bahwa tanpa efek rumah kaca alami, suhu rata-rata permukaan Bumi akan anjlok menjadi sekitar -18°C (beku permanen). Evaluasi ilmiah yang PALING TEPAT mengenai masalah iklim saat ini adalah ....

**Pilihan Jawaban:**  
- `A`. Efek rumah kaca alami mutlak diperlukan untuk menjaga bumi tetap hangat dan ramah bagi kehidupan; yang berbahaya adalah lonjakan emisi gas rumah kaca berlebih akibat aktivitas manusia yang memicu pemanasan global ekstrem **<== (Kunci Jawaban)**
- `B`. Semua gas karbon dioksida di atmosfer harus dimusnahkan hingga 0% agar bumi menjadi dingin sempurna
- `C`. Efek rumah kaca tidak ada hubungannya sama sekali dengan gas buang industri dan kendaraan
- `D`. Pemanasan global menguntungkan semua negara karena tanaman gurun akan tumbuh subur

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Efek rumah kaca alami menjaga suhu bumi rata-rata pada +15°C yang memungkinkan air berwujud cair. Peningkatan gas antropogeniklah yang merusak kesetimbangan termal.

**Catatan Kurasi:** *Kunci A. Evaluasi pemanasan global sains atmosfer.*  

---

### CUR-SMP-IPA-15-14 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 6908)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Membandingkan kelayakan planet Mars dan Bumi dalam mendukung kehidupan.*  
- **Tag Konsep:** `atmosfer_planet, analisis_mars_vs_bumi`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) kendala utama kehidupan di Mars berdasarkan tekanan atmosfer dan ketiadaan medan magnet.  

**Soal:**  
Planet Mars sering dianggap sebagai kandidat terbaik untuk kolonisasi manusia di masa depan. Namun, astronot tidak dapat bertahan hidup di permukaan Mars tanpa baju pelindung bertekanan khusus karena kondisi atmosfer Mars yang ....

**Pilihan Jawaban:**  
- `A`. Sangat tebal dan dipenuhi oleh gas belerang asam sulfat cair
- `B`. Sangat tipis (tekanan kurang dari 1% tekanan atmosfer bumi), didominasi gas CO2, dan tanpa medan magnet pelindung radiasi kosmis **<== (Kunci Jawaban)**
- `C`. Suhunya selalu di atas 450°C siang dan malam
- `D`. Memiliki kadar oksigen 90% yang dapat meledak seketika

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Atmosfer Mars sangat tipis (tekanan ~6 mbar vs Bumi 1013 mbar) dan >95% CO2 tanpa lapisan ozon maupun medan magnet pelindung, menyebabkan air mendidih pada suhu tubuh dan radiasi kosmis mematikan.

**Catatan Kurasi:** *Kunci B. HOTS perbandingan planet.*  

---

### CUR-SMP-IPA-15-15 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 6912)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman IPA Fase D: Mengevaluasi dampak badai matahari (solar flare / CME) terhadap teknologi di bumi.*  
- **Tag Konsep:** `aktivitas_matahari, solar_flare_cme_evaluasi`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) ancaman partikel bermuatan matahari terhadap satelit komunikasi dan jaringan listrik.  

**Soal:**  
Ketika terjadi letupan lidah api matahari raksasa (*solar flare*) yang melepaskan Lontaran Massa Korona (CME) ke arah Bumi, medan magnet Bumi (magnetosfer) bergetar hebat menghasilkan badai geomagnetik. Evaluasi dampak paling nyata dari badai geomagnetik tersebut terhadap teknologi modern manusia adalah ....

**Pilihan Jawaban:**  
- `A`. Permukaan air laut di seluruh dunia mengering seketika dalam hitungan detik
- `B`. Gangguan sinyal radio frekuensi tinggi, kerusakan chip satelit navigasi GPS, dan induksi arus berlebih yang dapat merusak transformator jaringan listrik darat **<== (Kunci Jawaban)**
- `C`. Gravitasi bumi melemah sehingga mobil dan gedung melayang ke angkasa
- `D`. Layar handphone berubah warna menjadi merah tanpa sebab

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Partikel bermuatan badai matahari menginduksi medan elektromagnetik pada kawat listrik panjang (bisa membakar trafo) dan mengionisasi termosfer/ionosfer sehingga sinyal satelit GPS terbiaskan.

**Catatan Kurasi:** *Kunci B.*  

---

## Topik `SMA-BIO-01`: Keanekaragaman Hayati (SMA — Biologi)

### CUR-SMA-BIO-01-01 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2659)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E (Kelas 10): Mengidentifikasi tingkatan keanekaragaman hayati (gen, jenis, ekosistem).*  
- **Tag Konsep:** `tingkat_keanekaragaman, keanekaragaman_gen`  
- **Rubrik Kesulitan:** Mengenali (C1) contoh keanekaragaman hayati pada tingkat gen dalam satu spesies.  

**Soal:**  
Kelompok tumbuhan berikut yang menunjukkan contoh keanekaragaman hayati pada tingkat GEN adalah ....

**Pilihan Jawaban:**  
- `A`. Mangga gadung, mangga manalagi, dan mangga harum manis **<== (Kunci Jawaban)**
- `B`. Pohon kelapa, pohon pinang, dan pohon palem raja
- `C`. Kucing anggora, harimau sumatera, dan macan tutul
- `D`. Kacang tanah, kacang kedelai, dan kacang kapri
- `E`. Kuda liar, keledai jinak, dan zebra afrika

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Keanekaragaman gen terjadi di dalam satu spesies yang sama (Mangifera indica) dengan variasi sifat, aroma, dan bentuk buah.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMA-BIO-01-02 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2668)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Membedakan metode konservasi in situ dan ex situ.*  
- **Tag Konsep:** `konservasi, in_situ`  
- **Rubrik Kesulitan:** Mengingat (C1) definisi pelestarian di habitat alami.  

**Soal:**  
Pemerintah menetapkan kawasan Taman Nasional Ujung Kulon untuk melindungi populasi badak bercula satu (*Rhinoceros sondaicus*) di habitat aslinya. Bentuk pelestarian ini tergolong konservasi ....

**Pilihan Jawaban:**  
- `A`. Ex situ
- `B`. In situ **<== (Kunci Jawaban)**
- `C`. Domestikasi
- `D`. Reintroduksi buatan
- `E`. Koleksi museum

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Konservasi in situ adalah perlindungan keanekaragaman hayati yang dilakukan di dalam habitat aslinya langsung (seperti taman nasional dan cagar alam).

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMA-BIO-01-03 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2666)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menjelaskan karakteristik bioma darat dengan keanekaragaman spesies tertinggi.*  
- **Tag Konsep:** `keanekaragaman_ekosistem, hutan_hujan_tropis`  
- **Rubrik Kesulitan:** Mengingat (C1) bioma terkaya spesies di dunia.  

**Soal:**  
Di antara ekosistem-ekosistem darat berikut, bioma yang memiliki tingkat keanekaragaman hayati spesies tertinggi di dunia adalah ....

**Pilihan Jawaban:**  
- `A`. Padang rumput stepa
- `B`. Hutan lumut tundra
- `C`. Hutan hujan tropis **<== (Kunci Jawaban)**
- `D`. Sabana akasia
- `E`. Gurun pasir kering

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Hutan hujan tropis memiliki struktur kanopi bertingkat, kelembapan tinggi, dan curah hujan merata sepanjang tahun yang menopang lebih dari 50% spesies makhluk hidup di bumi.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMA-BIO-01-04 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2780)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengidentifikasi posisi biogeografi flora kepulauan Indonesia.*  
- **Tag Konsep:** `biogeografi, kawasan_malesiana`  
- **Rubrik Kesulitan:** Mengingat (C1) zona biogeografi floristik wilayah Indonesia.  

**Soal:**  
Kekayaan flora Indonesia sangat khas dan termasuk ke dalam kelompok kawasan fitogeografi (kawasan floristik) ....

**Pilihan Jawaban:**  
- `A`. Neotropik
- `B`. Palearktik
- `C`. Nearktik
- `D`. Malesiana **<== (Kunci Jawaban)**
- `E`. Ethiopian

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Flora Malesiana mencakup Indonesia, Malaysia, Filipina, dan Papua Nugini yang dicirikan oleh dominasi pepohonan meranti keluarga Dipterocarpaceae.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMA-BIO-01-05 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 2774)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menjelaskan interaksi genetik dan lingkungan dalam membentuk fenotipe.*  
- **Tag Konsep:** `fenotipe, genotipe_dan_lingkungan`  
- **Rubrik Kesulitan:** Memahami (C2) rumus biologi fenotipe = genotipe + lingkungan.  

**Soal:**  
Perbedaan kenampakan fisik (fenotipe) yang muncul pada individu-individu dalam satu spesies ditentukan oleh perpaduan antara ....

**Pilihan Jawaban:**  
- `A`. Umur dan luas wilayah perburuan semata
- `B`. Jumlah sel tubuh dan kadar air jaringan
- `C`. Faktor iklim dan waktu tidur harian
- `D`. Tekanan udara dan kelembapan ruangan
- `E`. Susunan materi genetik (genotipe) dan faktor pengaruh lingkungan **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Ekspresi fenotipe suatu organisme merupakan hasil interaksi dinamis antara kode genetik yang diwariskan (genotipe) dengan faktor lingkungan tempat organisme hidup.

**Catatan Kurasi:** *Kunci E.*  

---

### CUR-SMA-BIO-01-06 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 2785)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Membedakan pembagian wilayah fauna Indonesia menurut garis Wallace dan Weber.*  
- **Tag Konsep:** `garis_wallace_weber, biogeografi_fauna`  
- **Rubrik Kesulitan:** Membedakan (C2) batas zona Wallacea dengan zona Australis.  

**Soal:**  
Garis khayal yang membatasi wilayah persebaran fauna daerah peralihan (Sulawesi dan Kepulauan Nusa Tenggara) dengan wilayah fauna daerah Australis (Papua dan Kepulauan Maluku) adalah ....

**Pilihan Jawaban:**  
- `A`. Garis Wallace
- `B`. Garis Weber **<== (Kunci Jawaban)**
- `C`. Garis Khatulistiwa
- `D`. Garis Lydekker
- `E`. Garis Greenwich

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Garis Wallace memisahkan Asiatis dengan Peralihan (sebelah barat), sedangkan Garis Weber memisahkan zona Peralihan dengan Australis (sebelah timur).

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMA-BIO-01-07 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 2682)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E–F: Menjelaskan dasar molekuler variasi genetik antar individu sejenis.*  
- **Tag Konsep:** `variasi_genetik, dasar_molekuler_dna`  
- **Rubrik Kesulitan:** Memahami (C2) variasi genetik pada level urutan basa nukleotida DNA.  

**Soal:**  
Penyebab mendasar adanya keanekaragaman sifat genetik di antara individu-individu dalam satu spesies yang sama secara biologi molekuler adalah ....

**Pilihan Jawaban:**  
- `A`. Perbedaan jenis makanan yang dikonsumsi secara musiman
- `B`. Perbedaan jumlah total kromosom tubuh secara acak
- `C`. Perbedaan variasi kombinasi dan urutan susunan basa nitrogen pada molekul DNA **<== (Kunci Jawaban)**
- `D`. Perbedaan organ pernapasan internal
- `E`. Perbedaan letak sel punca embrionik

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Meskipun spesiesnya sama (jumlah kromosom sama), urutan nukleotida pada gen-gen penyusun alel memiliki variasi (polimorfisme) yang menghasilkan sifat fisik beraneka ragam.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMA-BIO-01-08 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 2667)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menjelaskan bentuk adaptasi tumbuhan khas ekosistem hutan bakau.*  
- **Tag Konsep:** `adaptasi_mangrove, pneumatofora`  
- **Rubrik Kesulitan:** Menghubungkan (C3) habitat berlumpur anaerob dengan struktur akar napas bakau.  

**Soal:**  
Tumbuhan bakau genus *Avicennia* dan *Sonneratia* yang hidup di zona pasang surut berlumpur miskin oksigen memiliki adaptasi morfologi berupa ....

**Pilihan Jawaban:**  
- `A`. Daun berbentuk duri tebal berlilin
- `B`. Batang berongga terapung tanpa akar
- `C`. Biji yang tidak memiliki kulit pelindung
- `D`. Akar napas (pneumatofora) yang mencuat vertikal ke atas permukaan lumpur **<== (Kunci Jawaban)**
- `E`. Akar hisap yang menembus pohon inang

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Pneumatofora adalah akar bernapas dengan lentisel yang menjulang ke udara untuk menyerap oksigen langsung dari atmosfer saat air surut.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMA-BIO-01-09 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 2790)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengidentifikasi hewan endemik khas kawasan Wallacea.*  
- **Tag Konsep:** `fauna_endemik, zona_wallacea`  
- **Rubrik Kesulitan:** Mengelompokkan (C2) mamalia dan burung khas endemik Sulawesi.  

**Soal:**  
Kelompok satwa liar berikut yang merupakan fauna endemik asli zona peralihan (Wallacea) kepulauan Sulawesi adalah ....

**Pilihan Jawaban:**  
- `A`. Badak bercula satu, orangutan, dan harimau sumatera
- `B`. Burung cenderawasih, kanguru pohon, dan kasuari gelambir
- `C`. Gajah asia, tapir melayu, dan bekantan kalimantan
- `D`. Kuskus tutul papua, walabi, dan burung mambruk
- `E`. Anoa darat, babirusa, dan burung maleo senkawor **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Anoa, babirusa, dan burung maleo adalah satwa purba endemik yang berevolusi terisolasi di kepulauan Wallacea (Sulawesi).

**Catatan Kurasi:** *Kunci E.*  

---

### CUR-SMA-BIO-01-10 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 2795)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menjelaskan peranan keanekaragaman hayati sebagai sumber plasma nutfah dan obat-obatan.*  
- **Tag Konsep:** `manfaat_biodiversitas, sumber_farmakologi`  
- **Rubrik Kesulitan:** Menerapkan (C3) manfaat senyawa bioaktif tanaman hutan tropis Indonesia.  

**Soal:**  
Pohon kina (*Cinchona calisaya*) dibudidayakan secara luas di dataran tinggi Indonesia karena menghasilkan senyawa metabolit sekunder alkaloid yang berkhasiat sebagai obat ....

**Pilihan Jawaban:**  
- `A`. Antimalaria (kinina) **<== (Kunci Jawaban)**
- `B`. Antibiotik penisilin
- `C`. Penurun kolesterol darah
- `D`. Suplemen vitamin C murni
- `E`. Vaksin polio oral

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Kulit batang pohon kina menghasilkan alkaloid kinina (*quinine*) yang secara historis menjadi obat utama penumpas parasit malaria.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMA-BIO-01-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 2902)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menganalisis dampak negatif penanaman monokultur bibit unggul terhadap biodiversitas.*  
- **Tag Konsep:** `erosi_plasma_nutfah, monokultur_transgenik_analisis`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) keterancaman plasma nutfah lokal akibat dominasi satu varietas tanaman seragam.  

**Soal:**  
Pengembangan benih padi transgenik unggul tahan hama secara monokultur besar-besaran di berbagai provinsi berhasil meningkatkan produksi beras jangka pendek. Namun, para ahli biologi konservasi memperingatkan ancaman bahaya ekologis jangka panjangnya, yaitu ....

**Pilihan Jawaban:**  
- `A`. Siklus fotosintesis padi akan menghasilkan gas metana murni
- `B`. Tanaman padi transgenik akan berubah menjadi tanaman gulma parasit
- `C`. Terjadinya erosi plasma nutfah lokal (hilangnya gen-gen unggul varietas padi tradisional) sehingga populasi sangat rentan hancur bila diserang patogen baru di masa depan **<== (Kunci Jawaban)**
- `D`. Tanaman padi transgenik tidak dapat berkembang biak dengan bantuan angin
- `E`. Kadar oksigen di atmosfer bumi akan menurun tajam

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Keseragaman genetik monokultur melenyapkan keragaman genetik liar. Tanpa variasi alel pertahanan di plasma nutfah, satu strain patogen baru bisa memusnahkan seluruh tanaman serentak.

**Catatan Kurasi:** *Kunci C. Soal HOTS erosi genetik.*  

---

### CUR-SMA-BIO-01-12 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 2905)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengevaluasi dampak introduksi spesies asing invasif terhadap ekosistem perairan darat.*  
- **Tag Konsep:** `spesies_invasif, evaluasi_dampak_introduksi`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) ancaman kepunahan ikan endemik akibat ikan predator asing invasif.  

**Soal:**  
Pelepasan ikan pemangsa asing non-asli seperti ikan aligator gar (*Atractosteus spatula*) dan ikan arapaima ke waduk atau danau alami di Indonesia sangat dilarang keras oleh undang-undang perikanan. Evaluasi ekologis yang PALING TEPAT menjelaskan dasar pelarangan tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Ikan aligator akan mengubah warna air danau menjadi merah keruh
- `B`. Daging ikan aligator mengeluarkan racun yang mencemari udara sekitar waduk
- `C`. Ikan tersebut menyerap seluruh mineral garam danau hingga airnya kering
- `D`. Ikan pemangsa asing memiliki sifat invasif yang memangsa habis ikan-ikan endemik lokal tanpa memiliki predator pengendali alami di habitat barunya **<== (Kunci Jawaban)**
- `E`. Ikan aligator dapat berjalan di daratan dan memangsa ternak warga desa

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Spesies invasif asing (Invasive Alien Species) mendisrupsi relung ekologi, mengalahkan spesies lokal dalam kompetisi pakan, dan memicu kepunahan fauna endemik setempat.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMA-BIO-01-13 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 2908)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menganalisis dampak kepunahan spesies kunci (keystone species) terhadap integritas ekosistem.*  
- **Tag Konsep:** `spesies_kunci, keystone_species_analisis`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) keruntuhan kaskade trofik bila keystone species hilang.  

**Soal:**  
Dalam ekosistem terumbu karang laut tropis, bintang laut pemakan karang dikendalikan oleh siput laut Triton terompet (*Charonia tritonis*). Bila cangkang siput Triton diburu secara masif untuk cinderamata, ledakan populasi bintang laut berduri (*Acanthaster planci*) memakan karang hidup hingga hamparan karang mati memutih (*bleaching*). Dalam konteks ini, siput Triton berperan sebagai ....

**Pilihan Jawaban:**  
- `A`. Produsen primer ekosistem
- `B`. Spesies perintis suksesi primer
- `C`. Parasit obligat intraseluler
- `D`. Dekomposer pembusuk limbah
- `E`. Spesies kunci (keystone species) yang keberadaannya krusial mempertahankan struktur dan keanekaragaman seluruh komunitas ekosistem **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Keystone species memiliki dampak ekologis yang jauh lebih besar daripada proporsi kelimpahannya. Hilangnya spesies kunci memicu efek domino runtuhnya ekosistem.

**Catatan Kurasi:** *Kunci E. Analisis peranan keystone species.*  

---

### CUR-SMA-BIO-01-14 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 2912)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengevaluasi dampak fragmentasi hutan dan efek tepi (edge effect) terhadap satwa pedalaman.*  
- **Tag Konsep:** `fragmentasi_habitat, efek_tepi_edge_effect`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) mengapa pemecahan hutan menjadi petak-petak kecil lebih merusak dibanding satu kawasan utuh.  

**Soal:**  
Dua rancangan kawasan konservasi diusulkan untuk melindungi hutan hujan tropis seluas total 100.000 hektar:
• Rancangan 1: Satu hamparan kawasan hutan lindung tunggal berbentuk bulat masif seluas 100.000 hektar
• Rancangan 2: Sepuluh petak hutan terpisah masing-masing seluas 10.000 hektar yang diselingi perkebunan sawit
Berdasarkan teori Biogeografi Pulau dan konservasi koridor satwa, evaluasi rancangan yang PALING UNGGUL dalam mempertahankan keanekaragaman hayati spesies hutan pedalaman adalah ....

**Pilihan Jawaban:**  
- `A`. Rancangan 1, karena meminimalkan efek tepi (edge effect), mempertahankan area inti (core area) yang luas, dan mencegah isolasi genetik satwa pedalaman **<== (Kunci Jawaban)**
- `B`. Rancangan 2, karena hewan lebih menyukai berpindah-pindah melintasi kebun sawit
- `C`. Rancangan 2, karena petak kecil mempermudah perburuan liar terkendali
- `D`. Kedua rancangan memiliki efektivitas yang identik persis karena total luas lahannya sama
- `E`. Rancangan 1 kurang baik karena luasnya hutan membuat hewan kesulitan mencari jalan keluar

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Desain SLOSS (Single Large or Several Small): kawasan tunggal yang besar memiliki rasio keliling/luas kecil sehingga mengurangi gangguan iklim mikro tepi hutan dan memungkinkan home range satwa besar utuh.

**Catatan Kurasi:** *Kunci A. Evaluasi desain konservasi SLOSS.*  

---

### CUR-SMA-BIO-01-15 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 2918)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menganalisis pohon filogenetik sederhana dalam menentukan kedekatan kekerabatan spesies.*  
- **Tag Konsep:** `kladogram, filogeni_keanekaragaman`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) hubungan kekerabatan filogenetik berdasarkan keberadaan karakter sinapomorfi.  

**Soal:**  
Berdasarkan analisis pohon filogenetik (kladogram) vertebrata, kelompok burung (Aves) berbagi nenek moyang bersama paling dekat dengan kelompok reptil buaya (Archosauria) karena sama-sama memiliki karakter jantung bersekat empat sempurna dan struktur telur amniotik bercangkang kapur. Kesimpulan hubungan kekerabatan yang BENAR adalah ....

**Pilihan Jawaban:**  
- `A`. Burung berkerabat lebih dekat dengan mamalia berbulu daripada dengan reptil
- `B`. Secara filogenetik evolusioner, burung memiliki nenek moyang bersama yang lebih baru dengan kelompok Archosauria (buaya dan dinosaurus) dibandingkan dengan kadal/ular **<== (Kunci Jawaban)**
- `C`. Burung tidak memiliki hubungan kekerabatan sama sekali dengan hewan vertebrata lainnya
- `D`. Telur burung berevolusi secara terpisah dari air laut tanpa kaitan dengan reptil
- `E`. Kladogram tidak dapat digunakan untuk menentukan taksonomi keanekaragaman hayati

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Kladistika modern menempatkan Aves di dalam klad Dinosauria/Archosauria, menunjukkan leluhur bersama terdekat dengan Crocodylia dibandingkan garis Lepidosauria (kadal).

**Catatan Kurasi:** *Kunci B. HOTS filogeni dan kladogram.*  

---

## Topik `SMA-BIO-03`: Virus, Bakteri, dan Protista (SMA — Biologi)

### CUR-SMA-BIO-03-01 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2840)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menjelaskan karakteristik virus sebagai partikel aseluler.*  
- **Tag Konsep:** `karakteristik_virus, partikel_aseluler`  
- **Rubrik Kesulitan:** Mengingat (C1) struktur organel sel yang tidak dimiliki oleh virus.  

**Soal:**  
Virus digolongkan sebagai partikel aseluler (bukan berupa sel hidup sejati) karena tubuhnya sama sekali tidak memiliki ....

**Pilihan Jawaban:**  
- `A`. Asam nukleat DNA atau RNA
- `B`. Kapsid pelindung protein
- `C`. Sitoplasma, membran plasma sel, dan organel metabolik (ribosom/mitokondria) **<== (Kunci Jawaban)**
- `D`. Kemampuan menginfeksi sel inang
- `E`. Glikoprotein pada permukaan luar kapsid

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Virus tidak memiliki protoplasma, sitoplasma, membran sel, maupun organel metabolisme sintesis protein, sehingga tidak memenuhi definisi selular.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMA-BIO-03-02 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2845)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Membedakan organisasi sel prokariotik dan eukariotik.*  
- **Tag Konsep:** `prokariotik, karakteristik_bakteri`  
- **Rubrik Kesulitan:** Mengingat (C1) definisi sel prokariotik tanpa membran inti sel.  

**Soal:**  
Bakteri (Domain Bacteria) dikelompokkan ke dalam organisme prokariotik karena memiliki ciri utama berupa ....

**Pilihan Jawaban:**  
- `A`. Tidak memiliki molekul DNA pembawa sifat
- `B`. Tidak memiliki dinding sel penahan tekanan osmotik
- `C`. Selalu hidup berkoloni membentuk jaringan organ sejati
- `D`. Tidak memiliki membran inti sel (karioteka) yang membungkus materi genetiknya **<== (Kunci Jawaban)**
- `E`. Hanya dapat bereplikasi di dalam sel hidup lain

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Ciri khas prokariota adalah materi genetik (DNA sirkuler) berada telanjang di daerah nukleoid sitoplasma tanpa diselubungi membran inti sel.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMA-BIO-03-03 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2915)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengidentifikasi bakteri patogen penyebab penyakit pada manusia.*  
- **Tag Konsep:** `patogen, mycobacterium_tuberculosis`  
- **Rubrik Kesulitan:** Mengingat (C1) spesies bakteri penyebab penyakit TBC paru.  

**Soal:**  
Penyakit tuberkulosis (TBC) yang menyerang saluran pernapasan dan merusak alveolus paru-paru disebabkan oleh infeksi bakteri ....

**Pilihan Jawaban:**  
- `A`. Salmonella typhi
- `B`. Vibrio cholerae
- `C`. Clostridium tetani
- `D`. Escherichia coli patogenik
- `E`. Mycobacterium tuberculosis **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Mycobacterium tuberculosis adalah bakteri basil tahan asam yang merusak jaringan parenkim paru-paru menghasilkan tuberkel.

**Catatan Kurasi:** *Kunci E.*  

---

### CUR-SMA-BIO-03-04 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2860)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengelompokkan protozoa berdasarkan alat geraknya.*  
- **Tag Konsep:** `protozoa, rhizopoda_pseudopodia`  
- **Rubrik Kesulitan:** Mengenali (C1) kelompok protozoa berkaki semu (Rhizopoda).  

**Soal:**  
Protozoa mirip hewan yang bergerak aktif dan menangkap makanan menggunakan penjuluran kaki semu (pseudopodia) seperti *Amoeba proteus* diklasifikasikan ke dalam filum/kelas ....

**Pilihan Jawaban:**  
- `A`. Rhizopoda (Sarcodina) **<== (Kunci Jawaban)**
- `B`. Ciliata (Ciliophora)
- `C`. Flagellata (Mastigophora)
- `D`. Sporozoa (Apicomplexa)
- `E`. Oomycota (Jamur air)

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Rhizopoda bergerak dengan aliran sitoplasma menjulur membentuk kaki semu (pseudopodia) untuk lokomosi dan fagositosis makanan.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMA-BIO-03-05 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2874)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengidentifikasi peranan protista mirip tumbuhan dalam perekonomian.*  
- **Tag Konsep:** `protista_mirip_tumbuhan, rhodophyta_agar_agar`  
- **Rubrik Kesulitan:** Mengingat (C1) produk bernilai ekonomi alga merah *Eucheuma spinosum*.  

**Soal:**  
Spesies alga merah (Rhodophyta) seperti *Eucheuma spinosum* dan *Gracilaria* banyak dibudidayakan nelayan pesisir Indonesia karena menghasilkan produk bernilai ekonomi tinggi berupa ....

**Pilihan Jawaban:**  
- `A`. Bahan bakar gas metana murni
- `B`. Agar-agar dan karagenan untuk industri makanan dan farmasi **<== (Kunci Jawaban)**
- `C`. Antibiotik penisilin alami
- `D`. Kertas selulosa industri
- `E`. Minyak pelumas mesin turbin

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Dinding sel Rhodophyta kaya fikosokoloid (agar-agar dan karagenan) yang digunakan sebagai bahan pembentuk gel, pengental, dan media biakan mikrobiologi.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMA-BIO-03-06 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 2848)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Membedakan daur litik dan daur lisogenik pada replikasi bakteriofag.*  
- **Tag Konsep:** `replikasi_virus, litik_vs_lisogenik`  
- **Rubrik Kesulitan:** Membandingkan (C2) integrasi profag pada daur lisogenik vs lisis sel inang pada daur litik.  

**Soal:**  
Perbedaan mendasar antara daur litik dan daur lisogenik pada proses replikasi bakteriofag adalah ....

**Pilihan Jawaban:**  
- `A`. Daur litik hanya berlangsung pada virus tumbuhan, sedangkan daur lisogenik pada virus hewan
- `B`. Daur lisogenik langsung melarutkan dinding sel inang dalam waktu 15 menit
- `C`. Daur litik tidak membutuhkan asam nukleat virus
- `D`. Pada daur litik sel inang segera lisis (pecah) melepaskan virion baru, sedangkan pada lisogenik DNA virus menyisip ke DNA inang membentuk profag tanpa langsung merusak sel inang **<== (Kunci Jawaban)**
- `E`. Daur lisogenik menghasilkan partikel virus baru tanpa melalui sintesis protein

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Pada fase lisogenik asam nukleat virus berintegrasi dorman sebagai profag di kromosom inang dan ikut membelah bersama pembelahan sel inang.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMA-BIO-03-07 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 2852)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menjelaskan prinsip dasar pewarnaan Gram bakteri.*  
- **Tag Konsep:** `dinding_sel_bakteri, pewarnaan_gram_peptidoglikan`  
- **Rubrik Kesulitan:** Memahami (C2) hubungan ketebalan lapisan peptidoglikan dengan retensi zat warna kristal violet.  

**Soal:**  
Bakteri Gram-positif mempertahankan warna ungu kristal violet saat dicuci alkohol pada prosedur pewarnaan Gram, sedangkan bakteri Gram-negatif terwarnai merah safranin. Dasar perbedaan pewarnaan tersebut terletak pada ....

**Pilihan Jawaban:**  
- `A`. Perbedaan jenis materi genetik DNA sirkuler dan RNA plasmid
- `B`. Ada tidaknya kapsul lendir polisakarida di luar dinding sel
- `C`. Jumlah flagela peritrik pada membran plasma
- `D`. Bentuk ribosom 70S di dalam sitoplasma
- `E`. Ketebalan lapisan peptidoglikan dinding sel (Gram-positif memiliki peptidoglikan tebal berlapis-lapis, sedangkan Gram-negatif tipis dan memiliki membran luar lipid) **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Lapisan peptidoglikan tebal Gram-positif menyusut saat dehidrasi alkohol, mengunci kompleks kristal violet-iodin sehingga tetap berwarna ungu.

**Catatan Kurasi:** *Kunci E.*  

---

### CUR-SMA-BIO-03-08 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 2856)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menjelaskan peranan bakteri menguntungkan dalam siklus biogeokimia.*  
- **Tag Konsep:** `simbiosis_rhizobium, fiksasi_nitrogen_bebas`  
- **Rubrik Kesulitan:** Menghubungkan (C3) enzim nitrogenase Rhizobium dengan penyuburan tanaman leguminosa.  

**Soal:**  
Bakteri *Rhizobium leguminosarum* membentuk bintil akar pada tanaman kacang-kacangan (Leguminosae) melalui simbiosis mutualisme. Peran ekologis utama dari bakteri ini adalah ....

**Pilihan Jawaban:**  
- `A`. Mengikat (memfiksasi) gas nitrogen bebas (N2) dari atmosfer menjadi amonia/ion nitrat yang dapat diserap tanaman **<== (Kunci Jawaban)**
- `B`. Menghasilkan senyawa racun insektisida pembasmi ulat daun
- `C`. Menguraikan dinding selulosa kayu mati menjadi kompos gambut
- `D`. Menyerap cadangan air tanah dalam jumlah dua kali lipat
- `E`. Mempercepat penguapan air melalui stomata akar

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Rhizobium memiliki kompleks enzim nitrogenase yang mampu mereduksi ikatan rangkap tiga gas N2 atmosfer menjadi bentuk senyawa nitrogen yang bioavailable.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMA-BIO-03-09 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 2865)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menjelaskan mengapa antibiotik tidak efektif melawan infeksi virus.*  
- **Tag Konsep:** `mekanisme_antibiotik, target_seluler_vs_virus`  
- **Rubrik Kesulitan:** Memahami (C2) ketiadaan struktur target farmakologi antibiotik pada partikel virus.  

**Soal:**  
Pemberian obat antibiotik (seperti amoksisilin atau penisilin) tidak efektif untuk menyembuhkan penyakit flu biasa, cacar air, atau COVID-19. Alasan ilmiah biologisnya adalah ....

**Pilihan Jawaban:**  
- `A`. Virus langsung mencerna molekul antibiotik menjadi energi
- `B`. Antibiotik bekerja dengan merusak struktur atau enzim seluler bakteri (seperti dinding peptidoglikan atau ribosom 70S) yang sama sekali tidak dimiliki oleh virus **<== (Kunci Jawaban)**
- `C`. Dinding sel virus terlalu tebal untuk ditembus oleh molekul obat apapun
- `D`. Antibiotik hanya dapat membunuh mikroorganisme yang hidup di darah mamalia
- `E`. Virus berkembang biak dengan spora berflagela yang kebal terhadap bahan kimia

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Antibiotik menargetkan biosintesis dinding sel, membran plasma, atau translasi ribosom bakteri. Virus tidak bermetabolisme mandiri dan tidak memiliki target-target tersebut.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMA-BIO-03-10 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 2870)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menjelaskan siklus reproduksi protozoa parasit Plasmodium.*  
- **Tag Konsep:** `plasmodium_malaria, daur_hidup_sporogoni`  
- **Rubrik Kesulitan:** Menerapkan (C3) lokasi terjadinya fase generatif (seksual) pada nyamuk Anopheles.  

**Soal:**  
Protozoa *Plasmodium* penyebab penyakit malaria memiliki dua inang dalam siklus hidupnya. Tahap reproduksi seksual (peleburan mikrogamet dan makrogamet menghasilkan ookinet hingga sporozoit) berlangsung di dalam ....

**Pilihan Jawaban:**  
- `A`. Sel-sel parenkim hati (hepatosit) manusia
- `B`. Sel darah merah (eritrosit) manusia
- `C`. Saluran pencernaan (usus) nyamuk *Anopheles* betina **<== (Kunci Jawaban)**
- `D`. Kelenjar ludah nyamuk *Aedes aegypti*
- `E`. Cairan sumsum tulang belakang manusia

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Siklus seksual (sporogoni) berlangsung di dinding usus nyamuk Anopheles betina (inang definitif), sedangkan reproduksi aseksual (skizogoni) terjadi pada manusia.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMA-BIO-03-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 2876)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menganalisis mengapa virus genom RNA bermutasi lebih cepat memunculkan varian baru dibanding virus DNA.*  
- **Tag Konsep:** `mutasi_virus_rna, laju_mutasi_rdp_analisis`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) ketiadaan aktivitas proofreading pada enzim RNA polimerase / reverse transcriptase virus.  

**Soal:**  
Vaksin influenza harus diperbarui formulanya hampir setiap tahun, dan virus RNA (seperti HIV dan SARS-CoV-2) sangat cepat memunculkan varian mutan baru dibandingkan dengan virus genom DNA (seperti virus cacar). Analisis biokimia yang tepat menerangkan tingginya laju mutasi pada virus genom RNA adalah ....

**Pilihan Jawaban:**  
- `A`. Enzim RNA polimerase virus tidak memiliki kemampuan proofreading (pembacaan ulang perbaikan kesalahan replikasi), sehingga kesalahan urutan nukleotida langsung diwariskan ke virion anak **<== (Kunci Jawaban)**
- `B`. Molekul RNA memiliki ikatan hidrogen ganda yang tidak dapat terurai
- `C`. Virus RNA tidak diselubungi kapsid sehingga materi genetiknya teroksidasi bebas
- `D`. Suhu tubuh inang yang hangat memicu penggandaan kromosom virus RNA secara tak terbatas
- `E`. Virus RNA selalu bertukar materi genetik dengan mitokondria inang

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
RNA-dependent RNA polymerase (RdRp) tidak memiliki aktivitas eksonuklease 3'->5' proofreading layaknya DNA polimerase seluler, memicu tingkat mutasi 100.000 kali lebih tinggi.

**Catatan Kurasi:** *Kunci A. Analisis biologi molekuler evolusi virus.*  

---

### CUR-SMA-BIO-03-12 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 2880)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengevaluasi dampak konsumsi antibiotik yang tidak tuntas terhadap resistensi bakteri.*  
- **Tag Konsep:** `resistensi_antibiotik, superbug_evaluasi`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) seleksi alam buatan yang memicu kemunculan bakteri superbug resisten antibiotik.  

**Soal:**  
Seorang pasien yang menderita radang tenggorokan akibat bakteri diberi resep antibiotik untuk dihabiskan selama 5 hari. Karena pada hari ke-3 ia sudah merasa sehat, pasien tersebut menghentikan minum obat. Dua minggu kemudian, radang tenggorokannya kambuh kembali dan antibiotik yang sama sudah tidak manjur lagi. Evaluasi seleksi biologis yang PALING TEPAT menjelaskan fenomena tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Tubuh pasien membentuk alergi permanen terhadap zat kimia antibiotik
- `B`. Sistem imun tubuh pasien menjadi malas memproduksi antibodi selamanya
- `C`. Bakteri bermutasi menjadi virus yang berselaput tebal
- `D`. Antibiotik berubah menjadi makanan nutrisi bagi bakteri yang tersisa
- `E`. Penghentian antibiotik sebelum tuntas hanya mematikan bakteri lemah, sedangkan bakteri mutan yang memiliki gen resistensi plasmid bertahan hidup, berkembang biak, dan membentuk populasi baru yang kebal obat **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Underdosing antibiotik adalah seleksi alam buatan. Bakteri dengan toleransi parsial lolos eliminasi, memperbanyak diri, dan mentransfer plasmid resistensi (R-plasmid) via konjugasi.

**Catatan Kurasi:** *Kunci E.*  

---

### CUR-SMA-BIO-03-13 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 2884)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menganalisis fenomena blooming dinoflagellata (red tide) dan dampaknya bagi biota laut.*  
- **Tag Konsep:** `red_tide, blooming_dinoflagellata`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) kaitan limbah fosfat/nitrat dengan pelepasan toksin saxitoxin oleh Dinoflagellata.  

**Soal:**  
Limpasan limbah pupuk pertanian dan detergen rumah tangga kaya fosfat ke perairan teluk menyebabkan fenomena pasang merah (*red tide*) akibat ledakan populasi (*blooming*) alga api (Dinoflagellata) seperti *Gymnodinium*. Bahaya ekologis terbesar dari peristiwa *red tide* ini bagi manusia dan biota laut adalah ....

**Pilihan Jawaban:**  
- `A`. Suhu air laut mendidih hingga 80°C akibat respirasi alga
- `B`. Kadar garam laut menurun drastis menjadi tawar
- `C`. Dinoflagellata melepaskan neurotoksin mematikan (seperti saksitoksin) yang terakumulasi pada kerang dan ikan, serta pembusukan massal alga menguras oksigen terlarut (anoksia) hingga memicu kematian massal ikan **<== (Kunci Jawaban)**
- `D`. Alga api memancarkan radiasi elektromagnetik yang merusak mesin perahu nelayan
- `E`. Air laut membeku menjadi es merah

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Harmful Algal Blooms (HABs) menghasilkan toksin paralitik (PSP) yang terbioakumulasi di rantai makanan dan degradasi biomassa alga oleh dekomposer memicu zona hipoksia/mati.

**Catatan Kurasi:** *Kunci C. Analisis toksisitas ekosistem perairan.*  

---

### CUR-SMA-BIO-03-14 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 2889)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengevaluasi pemanfaatan bioteknologi mikroorganisme dalam industri penambangan ramah lingkungan.*  
- **Tag Konsep:** `bioteknologi_bakteri, bioleaching_thiobacillus`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) efektivitas bioleaching menggunakan bakteri kemoautotrof pengoksidasi besi/belerang.  

**Soal:**  
Bakteri kemolitotrof *Thiobacillus ferrooxidans* dimanfaatkan dalam bioteknologi penambangan modern melalui metode biooksidasi (bioleaching). Evaluasi keunggulan utama teknologi pemisahan logam menggunakan bakteri ini dibandingkan metode peleburan termal konvensional adalah ....

**Pilihan Jawaban:**  
- `A`. Bakteri dapat mengubah logam besi secara langsung menjadi emas murni 24 karat
- `B`. Proses bioleaching tidak membutuhkan air sama sekali
- `C`. Bakteri bekerja lebih cepat dalam hitungan detik dibandingkan peleburan tungku api
- `D`. Mampu mengekstraksi logam bernilai tinggi dari bijih tambang kadar rendah secara efisien tanpa memerlukan suhu tinggi dan meminimalkan polusi gas belerang dioksida ke udara **<== (Kunci Jawaban)**
- `E`. Bakteri dapat hidup mandiri tanpa memerlukan unsur belerang atau besi

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Bioleaching mengekstraksi tembaga/emas dari batuan waste tambang kadar rendah yang tidak ekonomis dilebur, menghemat energi termal masif dan mengurangi emisi gas SO2.

**Catatan Kurasi:** *Kunci D. Evaluasi bioteknologi lingkungan industri.*  

---

### CUR-SMA-BIO-03-15 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 2895)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menganalisis spesifisitas infeksi virus terhadap reseptor membran sel inang.*  
- **Tag Konsep:** `reseptor_virus, tropisme_spesifisitas_inang`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) mengapa virus rabies hanya menginfeksi jaringan saraf mamalia atau SARS-CoV-2 menargetkan reseptor ACE2.  

**Soal:**  
Suatu jenis virus memiliki sifat tropisme jaringan yang sangat spesifik, contohnya virus hepatitis hanya menginfeksi sel hati dan virus HIV hanya menginfeksi sel limfosit T CD4+. Mekanisme biologis yang menentukan spesifisitas inang yang sangat ketat tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Perbedaan ukuran mikroskopis sel inang di dalam tubuh
- `B`. Kecocokan struktural antara glikoprotein pengikat (*spike protein*) pada selubung virus dengan molekul reseptor spesifik pada permukaan membran sel inang seperti kunci dan gembok **<== (Kunci Jawaban)**
- `C`. Jumlah mitokondria yang terdapat pada sel inang
- `D`. Kadar oksigen di dalam plasma darah yang membawa virus
- `E`. Kemampuan sel inang membelah secara meiosis

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Adsorpsi virus menuntut pengikatan spesifik ligan glikoprotein virus ke protein reseptor membran inang (misal gp120 HIV dengan CD4, Spike SARS-CoV-2 dengan ACE2).

**Catatan Kurasi:** *Kunci B. Analisis interaksi reseptor molekuler seluler.*  

---

## Topik `SMA-BIO-05`: Tumbuhan (Plantae) (SMA — Biologi)

### CUR-SMA-BIO-05-01 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2695)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengidentifikasi karakteristik tumbuhan lumut (Bryophyta).*  
- **Tag Konsep:** `bryophyta, atrakheofita`  
- **Rubrik Kesulitan:** Mengingat (C1) alasan lumut digolongkan ke tumbuhan non-vaskuler.  

**Soal:**  
Tumbuhan lumut (Bryophyta) diklasifikasikan ke dalam kelompok tumbuhan non-vaskuler (atrakheofita) karena ....

**Pilihan Jawaban:**  
- `A`. Tidak memiliki klorofil a dan b untuk fotosintesis
- `B`. Belum memiliki jaringan pembuluh angkut sejati (xilem dan floem) **<== (Kunci Jawaban)**
- `C`. Berkembang biak secara eksklusif menggunakan biji berkeping
- `D`. Tidak memiliki dinding sel selulosa
- `E`. Memiliki akar tunggang yang berkambium gabus

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Lumut belum memiliki pembuluh angkut sejati (xilem & floem); translokasi air dan nutrisi berlangsung secara difusi antarsel melalui rhizoid dan talus.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMA-BIO-05-02 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2701)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengidentifikasi ciri morfologi khas tumbuhan paku (Pteridophyta).*  
- **Tag Konsep:** `pteridophyta, circinate_vernation`  
- **Rubrik Kesulitan:** Mengenali (C1) ciri daun muda menggulung pada tumbuhan paku.  

**Soal:**  
Ciri morfologi yang khas dan paling mudah diamati pada daun muda tumbuhan paku (Pteridophyta) adalah ....

**Pilihan Jawaban:**  
- `A`. Daun berbentuk jarum kaku dan tebal
- `B`. Permukaan daun ditumbuhi duri racun berlendir
- `C`. Ujung daun mudanya menggulung melingkar (*circinate vernation*) **<== (Kunci Jawaban)**
- `D`. Daunnya langsung gugur begitu bertunas
- `E`. Tulang daunnya berbentuk jala melingkar

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Circinate vernation (daun muda menggulung seperti spiral) adalah adaptasi pertumbuhan khas kelompok Pteridophyta saat organ daun memanjang.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMA-BIO-05-03 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2708)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Membedakan Gymnospermae dan Angiospermae.*  
- **Tag Konsep:** `gymnospermae, biji_terbuka_strobilus`  
- **Rubrik Kesulitan:** Mengingat (C1) karakteristik letak biji Gymnospermae pada strobilus.  

**Soal:**  
Tumbuhan berbiji terbuka (Gymnospermae) berbeda dengan tumbuhan berbiji tertutup (Angiospermae) karena biji Gymnospermae ....

**Pilihan Jawaban:**  
- `A`. Terbentuk di dalam daging buah yang manis
- `B`. Hanya dihasilkan melalui perbanyakan tunas vegetatif
- `C`. Tidak memiliki cadangan makanan kotiledon
- `D`. Terbuka langsung pada permukaan daun buah/sisik runjung (strobilus) tanpa dibungkus bakal buah sejati **<== (Kunci Jawaban)**
- `E`. Memerlukan pembuahan ganda untuk dapat berkecambah

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Pada Gymnospermae (contoh: pinus dan melinjo), megasporofil tersusun dalam strobilus betina di mana bakal biji telanjang tanpa ovarium pembungkus buah.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMA-BIO-05-04 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 2724)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengelompokkan spesies tumbuhan berbiji terbuka.*  
- **Tag Konsep:** `gymnospermae, contoh_spesies`  
- **Rubrik Kesulitan:** Mengenali (C1) contoh spesies anggota divisi Gymnospermae.  

**Soal:**  
Kelompok tumbuhan berikut yang seluruh anggotanya tergolong ke dalam tumbuhan berbiji terbuka (Gymnospermae) adalah ....

**Pilihan Jawaban:**  
- `A`. Padi, jagung, dan tebu
- `B`. Mangga, durian, dan rambutan
- `C`. Kelapa sawit, salak, dan kurma
- `D`. Suplir, paku tanduk rusa, dan semanggi
- `E`. Pinus (*Pinus merkusii*), melinjo (*Gnetum gnemon*), dan pakis haji (*Cycas rumphii*) **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Pinus (Coniferophyta), melinjo (Gnetophyta), dan pakis haji (Cycadophyta) adalah perwakilan divisi-divisi utama Gymnospermae di Indonesia.

**Catatan Kurasi:** *Kunci E.*  

---

### CUR-SMA-BIO-05-05 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 2740)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E–F: Membedakan fungsi jaringan pengangkut xilem dan floem.*  
- **Tag Konsep:** `jaringan_pengangkut, floem_vs_xilem`  
- **Rubrik Kesulitan:** Memahami (C2) fungsi jaringan floem mentranslokasikan hasil fotosintesis.  

**Soal:**  
Jaringan pembuluh angkut pada tumbuhan vaskuler yang berfungsi mengangkut zat makanan hasil fotosintesis (sukrosa/glukosa) dari daun ke seluruh bagian tubuh tumbuhan adalah ....

**Pilihan Jawaban:**  
- `A`. Floem (pembuluh tapis) **<== (Kunci Jawaban)**
- `B`. Xilem (pembuluh kayu)
- `C`. Kambium gabus (felogen)
- `D`. Epidermis kutikula
- `E`. Kolenkim sudut

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Floem tersusun atas sel buluh tapis dan sel pengiring yang mentranslokasikan asimilat fotosintesis. Xilem berfungsi mentranspor air dan garam mineral tanah ke daun.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMA-BIO-05-06 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 2712)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menjelaskan pergiliran keturunan (metagenesis) tumbuhan lumut.*  
- **Tag Konsep:** `metagenesis_lumut, gametofit_dominan`  
- **Rubrik Kesulitan:** Memahami (C2) generasi dominan haploid (n) pada lumut.  

**Soal:**  
Pada daur pergiliran keturunan (metagenesis) tumbuhan lumut (Bryophyta), generasi yang dominan, berumur panjang, dan membentuk hamparan hijau fotosintetik adalah generasi ....

**Pilihan Jawaban:**  
- `A`. Sporofit (diploid / 2n)
- `B`. Sporangium kotak spora
- `C`. Gametofit (haploid / n) **<== (Kunci Jawaban)**
- `D`. Protonema sekunder tanpa klorofil
- `E`. Strobilus betina

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Lumut unik karena fase dominannya adalah generasi gametofit (n) yang menghasilkan arkegonium/anteridium. Sporofitnya (2n) bergantung nutrisi menumpang pada gametofit.

**Catatan Kurasi:** *Kunci C.*  

---

### CUR-SMA-BIO-05-07 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 2716)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Membandingkan metagenesis tumbuhan lumut dan paku.*  
- **Tag Konsep:** `metagenesis_paku, sporofit_dominan`  
- **Rubrik Kesulitan:** Memahami (C2) bahwa pada tumbuhan paku, fase sporofit diploidlah yang dominan.  

**Soal:**  
Berbeda dengan tumbuhan lumut, pada metagenesis tumbuhan paku (Pteridophyta), generasi yang dominan, berumur panjang, dan memiliki kormus sejati adalah fase ....

**Pilihan Jawaban:**  
- `A`. Gametofit berupa protalium kecil
- `B`. Anteridium penghasil sperma
- `C`. Arkegonium penghasil ovum
- `D`. Sporofit (tumbuhan paku dewasa berdaun rimbun / 2n) **<== (Kunci Jawaban)**
- `E`. Zigospora dorman

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Pada tumbuhan paku, generasi sporofit (2n) merupakan tumbuhan paku berdaun hijau yang hidup mandiri, sedangkan gametofitnya berupa protalium berukuran milimeter yang berumur singkat.

**Catatan Kurasi:** *Kunci D.*  

---

### CUR-SMA-BIO-05-08 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 2720)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Membedakan karakteristik tumbuhan dikotil dan monokotil.*  
- **Tag Konsep:** `dikotil_vs_monokotil, anatomi_morfologi`  
- **Rubrik Kesulitan:** Menerapkan (C3) kombinasi ciri anatomi dan morfologi tumbuhan dikotil.  

**Soal:**  
Perhatikan karakteristik tumbuhan berkeping berikut:
1. Memiliki perakaran tunggang dengan kambium vaskuler aktif
2. Pertulangan daun sejajar atau melengkung
3. Berkas pembuluh batang tersusun rapi melingkar
4. Mahkota bunga kelipatan 4 atau 5
5. Biji hanya memiliki satu kotiledon
Karakteristik khas yang dimiliki oleh tumbuhan dikotil (Magnoliopsida) ditunjukkan oleh nomor ....

**Pilihan Jawaban:**  
- `A`. 1, 2, dan 5
- `B`. 2, 3, dan 5
- `C`. 2, 4, dan 5
- `D`. 1, 2, dan 4
- `E`. 1, 3, dan 4 **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Ciri khas dikotil: akar tunggang berkambium, ikatan pembuluh melingkar teratur, daun menyirip/menjari, perhiasan bunga kelipatan 4 atau 5, dan 2 kotiledon. Nomor 2 dan 5 adalah ciri monokotil.

**Catatan Kurasi:** *Kunci E.*  

---

### CUR-SMA-BIO-05-09 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 2730)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E–F: Menjelaskan peristiwa pembuahan ganda pada Angiospermae.*  
- **Tag Konsep:** `pembuahan_ganda, endosperma_triploid`  
- **Rubrik Kesulitan:** Menerapkan (C3) peleburan inti generatif 2 dengan IKLS menghasilkan endosperma 3n.  

**Soal:**  
Pada proses pembuahan ganda (*double fertilization*) pada tumbuhan berbunga (Angiospermae), peleburan antara inti sperma 2 (haploid/n) dengan inti kandung lembaga sekunder / IKLS (diploid/2n) akan menghasilkan ....

**Pilihan Jawaban:**  
- `A`. Endosperma berkromosom triploid (3n) yang berfungsi sebagai cadangan makanan kecambah **<== (Kunci Jawaban)**
- `B`. Zigot berkromosom diploid (2n)
- `C`. Embrio berkromosom haploid (n)
- `D`. Kulit biji keras pelindung (testa)
- `E`. Sel sinergid penuntun serbuk sari

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Pembuahan ganda: (1) Sperma 1 (n) + Ovum (n) -> Zigot (2n). (2) Sperma 2 (n) + IKLS (2n) -> Endosperma (3n) sebagai jaringan penyedia nutrisi embrio.

**Catatan Kurasi:** *Kunci A.*  

---

### CUR-SMA-BIO-05-10 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 2735)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengidentifikasi organ penghasil spora pada tumbuhan paku.*  
- **Tag Konsep:** `sorus_sporangium, sporofil_paku`  
- **Rubrik Kesulitan:** Memahami (C2) struktur sorus pada permukaan bawah daun fertil paku.  

**Soal:**  
Bintik-bintik cokelat keemasan yang berjejer rapi di permukaan bawah daun fertil (sporofil) tumbuhan paku yang di dalamnya memuat kumpulan kotak spora (sporangium) dinamakan ....

**Pilihan Jawaban:**  
- `A`. Strobila
- `B`. Sorus **<== (Kunci Jawaban)**
- `C`. Rhizoma
- `D`. Indusium semu
- `E`. Protalium

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Sorus (jamak: sori) adalah klaster kumpulan sporangia di permukaan abaksial sporofil paku, sering dilindungi selaput tipis indusium.

**Catatan Kurasi:** *Kunci B.*  

---

### CUR-SMA-BIO-05-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 2745)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menganalisis inovasi evolusioner yang memungkinkan tumbuhan berpindah dari perairan ke daratan.*  
- **Tag Konsep:** `adaptasi_darat_tumbuhan, lignin_kutikula_xilem`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) peran kutikula, stomata, dan dinding berlignin dalam kolonisasi daratan.  

**Soal:**  
Transisi evolusi tumbuhan dari nenek moyang alga hijau (*Charophyta*) di air tawar menuju daratan kering jutaan tahun lalu diiringi oleh inovasi struktural yang krusial. Dua adaptasi utama yang PALING KRUSIAL mencegah dehidrasi sekaligus memungkinkan tumbuhan berdiri tegak di darat adalah ....

**Pilihan Jawaban:**  
- `A`. Penggantian klorofil dengan pigmen karotenoid dan ketiadaan vakuola
- `B`. Hilangnya dinding sel dan pembentukan silia lokomosi
- `C`. Pembentukan spora berflagela aktif dan daun berduri
- `D`. Lapisan kutikula lilin kedap air dengan stomata terkontrol, serta sintesis lignin pada dinding xilem sebagai penopang mekanis gravitasi **<== (Kunci Jawaban)**
- `E`. Pelebaran permukaan sel secara masif untuk menyerap embun

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Kutikula mencegah desikasi udara kering, stomata mengatur pertukaran gas, dan lignin memberikan kekuatan tensil menentang gravitasi bumi.

**Catatan Kurasi:** *Kunci D. Analisis evolusi kolonisasi darat.*  

---

### CUR-SMA-BIO-05-12 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 2750)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengevaluasi keberhasilan radiasi adaptif Angiospermae melalui koevolusi dengan serangga penyerbuk.*  
- **Tag Konsep:** `koevolusi_angiospermae, penyerbukan_zoofili_evaluasi`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) keunggulan efisiensi penyerbukan biotik (hewan) dibanding anemofili (angin) Gymnospermae.  

**Soal:**  
Pada era Kenozoikum, Angiospermae (tumbuhan berbunga) mendominasi flora darat bumi menyingkirkan Gymnospermae. Para ahli evolusi menilai faktor kunci keberhasilan radiasi adaptif Angiospermae adalah koevolusi dengan serangga penyerbuk. Evaluasi keunggulan efisiensi reproduksi Angiospermae dibanding Gymnospermae adalah ....

**Pilihan Jawaban:**  
- `A`. Gymnospermae tidak menghasilkan serbuk sari sama sekali
- `B`. Angiospermae tidak memerlukan air tanah untuk proses fotosintesis
- `C`. Semua serangga penyerbuk memakan habis runjung strobilus Gymnospermae
- `D`. Bunga Angiospermae dapat mengubah serbuk sari menjadi madu cair tanpa pembuahan
- `E`. Penyerbukan berbantu hewan (zoofili) dengan nektar dan mahkota mencolok jauh lebih efisien mengantarkan polen secara tepat sasaran antar individu sejenis yang berjauhan, dibandingkan penyerbukan acak angin (anemofili) Gymnospermae yang memboroskan miliaran polen **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Polinasi biotik terarah menghemat energi metabolik produksi polen dan memungkinkan isolasi reproduktif cepat memicu spesiasi masif Angiospermae.

**Catatan Kurasi:** *Kunci E. Evaluasi koevolusi tumbuhan-serangga.*  

---

### CUR-SMA-BIO-05-13 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 2755)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Keterampilan Proses Biologi Fase E–F: Menganalisis percobaan pencangkokan/pengelupasan kulit batang (girdling/ring barking).*  
- **Tag Konsep:** `percobaan_translokasi, ring_barking_analisis`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) terjadinya pembengkakan jaringan di atas cincin pengelupasan kulit batang.  

**Soal:**  
Dalam teknik mencangkok, petani mengupas kulit batang tanaman dikotil melingkar selebar 5 cm hingga lapisan kayunya tampak bersih, lalu dibiarkan beberapa minggu. Pengamatan menunjukkan terjadi pembengkakan jaringan di bagian tepi atas irisan kulit, sedangkan bagian bawah irisan tidak membengkak. Analisis fisiologis yang BENAR dari fenomena tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Pengupasan membuang jaringan floem; translokasi gula hasil fotosintesis dari daun ke arah akar terhenti dan menumpuk di tepi atas irisan memicu pembelahan sel kalus (bengkak) **<== (Kunci Jawaban)**
- `B`. Air dari dalam tanah menumpuk di tepi atas karena pembuluh xilem ikut terpotong habis
- `C`. Bakteri pembusuk menginfeksi batang bagian bawah sehingga batangnya menyusut
- `D`. Daun berhenti melakukan fotosintesis seketika saat kulit batang dikupas
- `E`. Kambium gabus menyerap udara luar secara berlebihan di bagian bawah

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Kulit luar memuat floem. Saat floem diputus melingkar (girdling), translokasi asimilat dari tajuk tertahan di atas luka, memicu akumulasi sukrosa dan auksin yang membentuk kalus perakaran.

**Catatan Kurasi:** *Kunci A. Analisis eksperimen fisiologi vaskuler.*  

---

### CUR-SMA-BIO-05-14 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 2760)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Menganalisis diferensiasi spora (heterospora) menuju pembentukan organ biji.*  
- **Tag Konsep:** `heterospora, selaginella_evolusi_biji`  
- **Rubrik Kesulitan:** Menganalisis (C4 HOTS) transisi homospora ke heterospora (mikrospora & megaspora) pada paku rane *Selaginella*.  

**Soal:**  
Tumbuhan paku rane (*Selaginella*) tergolong paku heterospora yang menghasilkan dua jenis spora dengan ukuran berbeda: mikrospora (kecil) dan megaspora (besar). Signifikansi evolusioner dari kondisi heterospora ini terhadap sejarah evolusi tumbuhan darat adalah ....

**Pilihan Jawaban:**  
- `A`. Membuat tumbuhan paku kebal terhadap kekeringan gurun secara mutlak
- `B`. Merupakan tahap peralihan evolusi penting menuju pembentukan bakal biji pada tumbuhan spermatophyta, di mana megaspora berkembang menjadi gametofit betina terlindung di dalam jaringan induk **<== (Kunci Jawaban)**
- `C`. Menghilangkan kebutuhan akan sel sperma berflagela
- `D`. Mengubah tumbuhan paku menjadi tumbuhan non-fotosintetik saprofit
- `E`. Mempercepat metagenesis lumut di sekitarnya

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Heterospori adalah prasyarat evolusi ovul/biji: megaspora tereduksi jumlahnya dan menetap di megasporangium (ovul) menerima nutrisi induk, bukan disebar bebas.

**Catatan Kurasi:** *Kunci B. Analisis evolusi organ reproduksi spermatophyta.*  

---

### CUR-SMA-BIO-05-15 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 2765)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Pemahaman Biologi Fase E: Mengevaluasi peranan struktur morfologi tumbuhan mangrove dalam mitigasi bencana pesisir.*  
- **Tag Konsep:** `konservasi_mangrove, evaluasi_abrasi_tsunami`  
- **Rubrik Kesulitan:** Mengevaluasi (C5 HOTS) efektivitas sistem perakaran tunjang dan cakar ayam mangrove terhadap peredaman energi gelombang tsunami.  

**Soal:**  
Alih fungsi hutan mangrove menjadi tambak udang intensif di sepanjang pesisir utara Jawa menyebabkan abrasi pantai parah dan hilangnya pelindung alami dari badai gelombang pasang. Evaluasi bio-mekanis yang PALING TEPAT menerangkan keunggulan vegetasi mangrove (*Rhizophora* sp.) dalam meredam ancaman bencana pesisir adalah ....

**Pilihan Jawaban:**  
- `A`. Daun mangrove yang lebat menyerap seluruh air laut sebelum mencapai pemukiman
- `B`. Akar mangrove mengeluarkan zat kimia penetral garam laut
- `C`. Sistem perakaran tunjang (*stilt roots*) yang rapat dan kokoh membentuk jaring bio-mekanis peredam yang memecah dan mereduksi energi gelombang laut hingga lebih dari 60% serta mengikat sedimen lumpur pantai dari ancaman abrasi **<== (Kunci Jawaban)**
- `D`. Pohon mangrove memancarkan gelombang ultrasonik penolak badai siklon
- `E`. Hutan mangrove menaikkan suhu pantai sehingga gelombang air laut menguap seketika

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Matriks akar tunjang Rhizophora bertindak sebagai breakwater alami elastis yang memecah energi kinetik ombak/tsunami dan menjebak partikel sedimen tanah.

**Catatan Kurasi:** *Kunci C. Evaluasi mitigasi bencana ekosistem pesisir.*  

---

---

# Bagian 2 — Bahasa Indonesia (Wave-2, 45 Butir)

## Topik `SD-BIN-01`: Ide Pokok dan Gagasan Utama Paragraf (SD — Bahasa Indonesia)

### CUR-SD-BIN-01-01 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 10029)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `kalimat_penjelas, struktur_paragraf`  
- **Rubrik Kesulitan:** Memahami (C2) istilah kalimat penjelas dan membedakannya dari kalimat utama.  

**Soal:**  
Kalimat yang menjelaskan kalimat utama disebut ....

**Pilihan Jawaban:**  
- `A`. Kalimat perintah
- `B`. Kalimat penjelas **<== (Kunci Jawaban)**
- `C`. Kalimat utama
- `D`. Kalimat langsung

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Kalimat penjelas berfungsi menguraikan, memperjelas, atau mendukung kalimat utama dalam sebuah paragraf.

**Catatan Kurasi:** *Kunci B. Istilah dasar struktur paragraf.*  

---

### CUR-SD-BIN-01-02 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 10030)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `ide_pokok, pengertian`  
- **Rubrik Kesulitan:** Mengingat (C1) definisi ide pokok paragraf.  

**Soal:**  
Pengertian ide pokok adalah ....

**Pilihan Jawaban:**  
- `A`. Kalimat yang berisi nasihat
- `B`. Kalimat yang berisi perintah
- `C`. Masalah utama yang dibahas dalam suatu paragraf **<== (Kunci Jawaban)**
- `D`. Kalimat yang menjelaskan kalimat utama

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Ide pokok adalah inti atau masalah utama yang menjadi dasar pengembangan sebuah paragraf.

**Catatan Kurasi:** *Kunci C. Typo 'Pengetian' pada dataset mentah diperbaiki menjadi 'Pengertian'.*  

---

### CUR-SD-BIN-01-03 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 10069)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `letak_kalimat_utama, paragraf`  
- **Rubrik Kesulitan:** Mengingat (C1) letak kalimat utama dalam paragraf.  

**Soal:**  
Kalimat utama umumnya terletak di setiap awal atau akhir ....

**Pilihan Jawaban:**  
- `A`. Frasa
- `B`. Klausa
- `C`. Kalimat
- `D`. Paragraf **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Kalimat utama berada dalam sebuah paragraf, umumnya pada awal (deduktif), akhir (induktif), atau keduanya (campuran).

**Catatan Kurasi:** *Kunci D. Konsep dasar paragraf.*  

---

### CUR-SD-BIN-01-04 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 12512)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `ciri_kalimat_utama, gagasan_utama`  
- **Rubrik Kesulitan:** Mengingat (C1) ciri kalimat utama.  

**Soal:**  
Salah satu ciri kalimat utama adalah ....

**Pilihan Jawaban:**  
- `A`. Jumlahnya lebih dari satu dalam satu paragraf
- `B`. Berisi gagasan utama **<== (Kunci Jawaban)**
- `C`. Kalimat tidak dapat berdiri sendiri, harus dengan kalimat lain
- `D`. Kalimat berisi contoh, data, dan detail

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Kalimat utama memuat gagasan utama paragraf, sedangkan kalimat lain berfungsi sebagai penjelas.

**Catatan Kurasi:** *Kunci B. Membedakan kalimat utama dari kalimat penjelas.*  

---

### CUR-SD-BIN-01-05 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 12663)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `paragraf, ide_pokok`  
- **Rubrik Kesulitan:** Mengingat (C1) pengertian paragraf.  

**Soal:**  
Bagian karangan yang mengandung satu ide pokok disebut ....

**Pilihan Jawaban:**  
- `A`. Larik
- `B`. Bait
- `C`. Baris
- `D`. Paragraf **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Paragraf adalah bagian karangan yang terdiri atas satu kalimat utama dan beberapa kalimat penjelas yang mengembangkan satu ide pokok.

**Catatan Kurasi:** *Kunci D. Konsep dasar paragraf.*  

---

### CUR-SD-BIN-01-06 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 9980)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `kalimat_utama, paragraf_eksposisi`  
- **Rubrik Kesulitan:** Menerapkan (C3) cara menemukan kalimat utama pada paragraf singkat.  

**Soal:**  
Matahari merupakan pusat sistem tata surya. Planet-planet dan benda-benda kecil lainnya yang tak terhitung jumlahnya mengelilingi matahari. Masing-masing berada pada garis edar berbentuk elips yang disebut orbit. Planet-planet tersebut tidak akan saling bertabrakan selama tetap berada di orbitnya.  
  
Kalimat utama paragraf tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Planet-planet tersebut tidak akan saling bertabrakan selama tetap berada di orbitnya.
- `B`. Matahari merupakan pusat sistem tata surya. **<== (Kunci Jawaban)**
- `C`. Planet-planet dan benda-benda kecil lainnya yang tak terhitung jumlahnya mengelilingi matahari.
- `D`. Masing-masing berada pada garis edar berbentuk elips yang disebut orbit.

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Kalimat utama adalah 'Matahari merupakan pusat sistem tata surya'. Kalimat lain menjelaskan orbit dan pergerakan planet sebagai penjelas.

**Catatan Kurasi:** *Kunci B. Soal aplikasi menemukan kalimat utama.*  

---

### CUR-SD-BIN-01-07 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 9981)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `kalimat_utama, paragraf`  
- **Rubrik Kesulitan:** Menerapkan (C3) cara menemukan kalimat utama pada paragraf yang kalimat utamanya di tengah.  

**Soal:**  
Dagingnya sangat baik untuk meningkatkan gizi. Kulitnya dibutuhkan untuk aneka kerajinan. Beternak sapi itu sangat menguntungkan. Pada zaman dulu tenaganya digunakan untuk membajak sawah.  
  
Kalimat utama paragraf di atas adalah ....

**Pilihan Jawaban:**  
- `A`. Dagingnya sangat baik untuk meningkatkan gizi.
- `B`. Kulitnya dibutuhkan untuk aneka kerajinan.
- `C`. Beternak sapi itu sangat menguntungkan. **<== (Kunci Jawaban)**
- `D`. Pada zaman dulu, tenaganya digunakan untuk membajak sawah.

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Kalimat utama 'Beternak sapi itu sangat menguntungkan' berada di tengah paragraf; kalimat lain merinci manfaat sapi sebagai penjelas.

**Catatan Kurasi:** *Kunci C. Kalimat utama tidak selalu di awal/akhir.*  

---

### CUR-SD-BIN-01-08 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 10005)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `gagasan_utama, paragraf`  
- **Rubrik Kesulitan:** Menerapkan (C3) merumuskan gagasan utama dari paragraf sebab-akibat.  

**Soal:**  
Longsornya timbunan sampah di Batujajar menyebabkan bencana alam. Peristiwa ini telah menelan banyak korban jiwa dan harta benda. Sebagian penduduk mengungsi ke tempat yang lebih aman.  
  
Gagasan utama pada paragraf di atas adalah ....

**Pilihan Jawaban:**  
- `A`. Longsornya timbunan sampah **<== (Kunci Jawaban)**
- `B`. Bencana alam
- `C`. Korban bencana banyak
- `D`. Penduduk mengungsi ke tempat aman

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Gagasan utama adalah peristiwa longsornya timbunan sampah; kalimat lain menjelaskan akibat yang ditimbulkannya.

**Catatan Kurasi:** *Kunci A. Gagasan utama berupa inti peristiwa.*  

---

### CUR-SD-BIN-01-09 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 10221)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `ide_pokok, tahapan`  
- **Rubrik Kesulitan:** Menerapkan (C3) merumuskan ide pokok paragraf proses.  

**Soal:**  
Bertani jagung dimulai dengan menanam bijinya. Setelah tiga sampai empat hari bakal tanaman akan muncul di permukaan tanah. Petani dapat memanen jagung setelah tanaman berusia tiga setengah bulan. Itulah tahapan petani dalam menanam jagung.  
  
Ide pokok paragraf tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Teknik bertani jagung
- `B`. Awal mula bertani jagung
- `C`. Tahapan bertani jagung **<== (Kunci Jawaban)**
- `D`. Usia jagung dipanen

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Paragraf menguraikan urutan tahapan bertani jagung dari menanam biji hingga memanen.

**Catatan Kurasi:** *Kunci C. Typo 'jangung' pada opsi diperbaiki.*  

---

### CUR-SD-BIN-01-10 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 10277)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `ide_pokok, paragraf_manfaat`  
- **Rubrik Kesulitan:** Menerapkan (C3) membedakan gagasan utama dari rincian manfaat.  

**Soal:**  
Wortel adalah salah satu jenis sayuran yang memiliki banyak manfaat. Sayuran tersebut mengandung serat yang berfungsi untuk melancarkan pencernaan. Selain itu, kandungan vitamin A dalam wortel sangat baik untuk kesehatan mata. Tidak hanya itu, wortel juga bisa dimanfaatkan sebagai pewarna alami.  
  
Ide pokok dari paragraf di atas yaitu ....

**Pilihan Jawaban:**  
- `A`. Wortel adalah sayuran yang memiliki banyak manfaat **<== (Kunci Jawaban)**
- `B`. Sayuran tersebut mengandung serat untuk melancarkan pencernaan
- `C`. Kandungan vitamin A dalam wortel sangat baik untuk kesehatan mata
- `D`. Wortel juga bisa dimanfaatkan sebagai pewarna alami

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Kalimat pertama menjadi kalimat utama; kalimat lain merinci manfaat wortel sebagai penjelas.

**Catatan Kurasi:** *Kunci A. Typo 'adala' diperbaiki.*  

---

### CUR-SD-BIN-01-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 10158)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `kalimat_utama, paragraf_bernomor`  
- **Rubrik Kesulitan:** Menganalisis (C4) posisi kalimat utama pada paragraf bernomor.  

**Soal:**  
(1) Manusia lebih kuat menahan rasa lapar dibandingkan haus. (2) Manusia masih dapat bertahan hidup meski kehilangan separuh atau semua persediaan hidrat arang dan lemak. (3) Akan tetapi, jika ia kekurangan air 10% saja, tubuhnya akan terancam bahaya. (4) Jika kekurangan itu sampai 25%, ia berhadapan dengan maut.  
  
Kalimat utama dalam paragraf di atas adalah ....

**Pilihan Jawaban:**  
- `A`. 1 **<== (Kunci Jawaban)**
- `B`. 2
- `C`. 3
- `D`. 4

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Kalimat (1) memuat gagasan utama bahwa manusia lebih tahan lapar daripada haus; kalimat (2)-(4) merupakan penjelas.

**Catatan Kurasi:** *Kunci A. Analisis paragraf bernomor.*  

---

### CUR-SD-BIN-01-12 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 10163)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `kalimat_utama, paragraf_bernomor`  
- **Rubrik Kesulitan:** Menganalisis (C4) posisi kalimat utama pada paragraf bernomor.  

**Soal:**  
(1) Setiap perusahaan bisnis yang berhasil harus memiliki kepercayaan dari penyokongnya. (2) Wiraniaga adalah perantara yang melaluinya kepercayaan ini diperoleh. (3) Wiraniaga ahli setelah mengetahui bahwa ia melakukan hal penting untuk memperoleh dan mempertahankan kepercayaan dari para pembelinya. (4) Ia melakukan tawar-menawar dengan mereka seolah-olah ia adalah pemilik bisnis yang ia wakili.  
  
Kalimat utama dalam paragraf di atas ditunjukkan oleh nomor ....

**Pilihan Jawaban:**  
- `A`. 1 **<== (Kunci Jawaban)**
- `B`. 2
- `C`. 3
- `D`. 4

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Kalimat (1) adalah kalimat utama; kalimat berikutnya menjelaskan peran wiraniaga dalam memperoleh kepercayaan.

**Catatan Kurasi:** *Kunci A. Analisis paragraf bernomor.*  

---

### CUR-SD-BIN-01-13 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 10271)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `ide_pokok, teks_narasi`  
- **Rubrik Kesulitan:** Menganalisis (C4) ide pokok paragraf pertama pada teks narasi.  

**Soal:**  
Induk ayam dan anaknya hidup di dalam sebuah hutan yang sangat lebat. Mereka tinggal bersandingan dengan keluarga bebek. Pada suatu hari sang induk bebek hendak pergi ke suatu lembah. Beliau berpesan kepada anaknya untuk tidak membuka pintu, kecuali hanya untuk ibunya.  
  
Ide pokok paragraf pertama pada teks cerita di atas adalah ....

**Pilihan Jawaban:**  
- `A`. Ayam dan bebek hidup berdampingan **<== (Kunci Jawaban)**
- `B`. Ayam meninggalkan anak-anaknya
- `C`. Serigala datang ke rumah bebek
- `D`. Induk ayam mengusir serigala

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Paragraf pertama mengisahkan induk ayam dan anaknya yang hidup berdampingan dengan keluarga bebek; pilihan lain tidak terdapat pada paragraf pertama.

**Catatan Kurasi:** *Kunci A. Teks asli dipangkas menjadi paragraf pertama agar soal mandiri; typo diperbaiki.*  

---

### CUR-SD-BIN-01-14 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 10167)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `gagasan_utama, simpulan_paragraf`  
- **Rubrik Kesulitan:** Menganalisis (C4) gagasan utama yang tersirat pada kalimat simpulan.  

**Soal:**  
Lidah buaya adalah salah satu tanaman hias yang bisa dipelihara pada ruangan tertutup. Ada juga tanaman Monstera dan Anthurium yang tetap indah meski dibudidayakan dalam ruangan. Meski mendapatkan sedikit cahaya matahari, tanaman-tanaman hias ini tetap bisa tumbuh subur tanpa mengurangi keindahan tampilannya. Ini menjadi bukti bahwa tidak semua tanaman hias yang indah dan kaya manfaat sulit dibudidayakan di dalam ruangan.  
  
Gagasan utama dari paragraf di atas adalah ....

**Pilihan Jawaban:**  
- `A`. Lidah buaya adalah tanaman yang dapat dipelihara di ruangan tertutup
- `B`. Tanaman hias dapat tumbuh subur walaupun tidak terkena sinar matahari
- `C`. Monstera dan Anthurium menjadi salah satu tanaman yang dapat dibudidayakan di dalam ruangan
- `D`. Tidak semua tanaman hias sulit dibudidayakan di dalam ruangan **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Kalimat terakhir merupakan simpulan/gagasan utama yang mencakup contoh-contoh sebelumnya.

**Catatan Kurasi:** *Kunci D. Typo 'Lidah budaya' diperbaiki menjadi 'Lidah buaya'.*  

---

### CUR-SD-BIN-01-15 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 10168)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase B/C: Menemukan ide pokok, gagasan utama, dan kalimat utama dalam paragraf.*  
- **Tag Konsep:** `gagasan_utama, simpulan_paragraf`  
- **Rubrik Kesulitan:** Menganalisis (C4) gagasan utama yang tersirat pada kalimat simpulan.  

**Soal:**  
Kucing merupakan salah satu hewan karnivora yang dapat dipelihara. Selain itu, anjing juga hewan yang dapat dipelihara. Keduanya sama-sama memakan daging dan memiliki taring serta kuku tajam. Hal ini membuktikan bahwa tidak semua hewan karnivora itu buas dan berbahaya bagi kehidupan manusia.  
  
Gagasan utama pada paragraf di atas adalah ....

**Pilihan Jawaban:**  
- `A`. Kucing dan anjing memakan daging
- `B`. Kucing dan anjing adalah jenis hewan
- `C`. Kucing adalah hewan karnivora yang dapat dipelihara
- `D`. Tidak semua hewan karnivora berbahaya bagi kehidupan manusia **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Kalimat terakhir menjadi simpulan/gagasan utama; contoh kucing dan anjing hanya penjelas.

**Catatan Kurasi:** *Kunci D. Typo 'salah hewan' dan 'dagang' diperbaiki.*  

---

## Topik `SMP-BIN-01`: Teks Laporan Hasil Observasi dan Teks Deskripsi (SMP — Bahasa Indonesia)

### CUR-SMP-BIN-01-01 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 10519)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `tujuan_laporan_observasi`  
- **Rubrik Kesulitan:** Memahami (C2) tujuan teks laporan hasil observasi.  

**Soal:**  
Tujuan ditulisnya teks laporan hasil observasi adalah ....

**Pilihan Jawaban:**  
- `A`. Sebagai media untuk mengatasi suatu permasalahan yang ada
- `B`. Sebagai media untuk mencari keuntungan
- `C`. Untuk mendapatkan informasi dan penjelasan rinci suatu hal dari sudut keilmuan **<== (Kunci Jawaban)**
- `D`. Sebagai media untuk mengadakan pengawasan dan perbaikan secara terukur terhadap suatu hal

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Teks laporan hasil observasi bertujuan menyajikan informasi dan penjelasan rinci suatu objek berdasarkan pengamatan ilmiah.

**Catatan Kurasi:** *Kunci C. Konsep dasar teks LHO.*  

---

### CUR-SMP-BIN-01-02 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 10523)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `pengertian_teks_deskripsi`  
- **Rubrik Kesulitan:** Mengingat (C1) pengertian teks deskripsi.  

**Soal:**  
Pengertian yang tepat mengenai teks deskripsi adalah ....

**Pilihan Jawaban:**  
- `A`. Teks yang bertujuan untuk menyampaikan pendapat
- `B`. Teks yang bertujuan untuk menggambarkan atau melukiskan suatu hal **<== (Kunci Jawaban)**
- `C`. Teks yang bertujuan untuk mengajak orang lain
- `D`. Teks yang berisi langkah-langkah membuat sesuatu

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Teks deskripsi bertujuan menggambarkan atau melukiskan objek secara detail sehingga pembaca dapat membayangkannya.

**Catatan Kurasi:** *Kunci B. Definisi dasar teks deskripsi.*  

---

### CUR-SMP-BIN-01-03 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 10475)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `ciri_teks_deskripsi, pancaindra`  
- **Rubrik Kesulitan:** Memahami (C2) ciri teks deskripsi.  

**Soal:**  
Pernyataan berikut yang termasuk ciri-ciri teks deskripsi adalah ....

**Pilihan Jawaban:**  
- `A`. Mengandung bukti dan kebenaran
- `B`. Bersifat menceritakan
- `C`. Menggunakan contoh, fakta, gambar peta, dan angka
- `D`. Menggambarkan objek sejelas-jelasnya dengan melibatkan kesan indra **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Ciri utama teks deskripsi adalah penggambaran objek secara detail dengan melibatkan pengalaman pancaindra.

**Catatan Kurasi:** *Kunci D. Membedakan deskripsi dari teks lain.*  

---

### CUR-SMP-BIN-01-04 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 10520)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `struktur_laporan_observasi`  
- **Rubrik Kesulitan:** Memahami (C2) isi bagian deskripsi bagian pada teks LHO.  

**Soal:**  
Deskripsi bagian pada teks laporan hasil observasi berisi ....

**Pilihan Jawaban:**  
- `A`. Keterangan umum tentang subjek yang dilaporkan
- `B`. Perincian hal-hal yang dilaporkan **<== (Kunci Jawaban)**
- `C`. Pendapat penulis tentang hal yang dilaporkan
- `D`. Ringkasan umum tentang bagian-bagian dari hal yang dilaporkan

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Deskripsi bagian memuat perincian objek yang diamati, sedangkan pernyataan umum memuat gambaran umum objek.

**Catatan Kurasi:** *Kunci B. Struktur teks LHO.*  

---

### CUR-SMP-BIN-01-05 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 10521)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `fakta, laporan_observasi`  
- **Rubrik Kesulitan:** Memahami (C2) makna fakta dalam teks laporan hasil observasi.  

**Soal:**  
Salah satu ciri teks laporan hasil observasi yaitu dibuat berdasarkan fakta. Maksud dari fakta dalam teks laporan hasil observasi adalah ....

**Pilihan Jawaban:**  
- `A`. Berbagai data bersumber dari pendapat orang lain yang belum terbukti kebenarannya
- `B`. Berbagai data bersumber dari teks fiksi
- `C`. Berbagai data bersumber dari cerita yang ada di masyarakat
- `D`. Berbagai data bersumber dari hal-hal yang benar-benar ada dan dapat dibuktikan kebenarannya **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Fakta adalah data yang bersumber dari kenyataan yang dapat diverifikasi, bukan opini atau fiksi.

**Catatan Kurasi:** *Kunci D. Konsep fakta vs opini.*  

---

### CUR-SMP-BIN-01-06 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 10531)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `struktur_deskripsi, deskripsi_bagian`  
- **Rubrik Kesulitan:** Menerapkan (C3) mengenali bagian struktur teks deskripsi pada kutipan.  

**Soal:**  
Kamar berukuran 4x5 m itu sangat nyaman ditempati. Dindingnya dicat warna biru muda. Sebuah sofa berwarna merah marun diletakkan di pojok ruangan, beserta lampu hias yang terdapat di kedua sisinya. Di sisi kanan kamar, terdapat TV 32 inci yang diletakkan di atas rak TV berbahan kayu. Bersebrangan dengan meja TV, di sisi kiri kamar, terdapat rak buku. Kamar ini juga dilengkapi dengan pendingin ruangan yang tentunya menambah nilai kenyamanan di dalamnya.  
  
Kutipan teks di atas merupakan salah satu bagian dari struktur teks deskripsi, yaitu ....

**Pilihan Jawaban:**  
- `A`. Identifikasi
- `B`. Deskripsi bagian **<== (Kunci Jawaban)**
- `C`. Deskripsi manfaat
- `D`. Penutup

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Kutipan merinci bagian-bagian kamar (dinding, sofa, TV, rak buku, pendingin) sehingga termasuk deskripsi bagian.

**Catatan Kurasi:** *Kunci B. Typo 'Bersebrangan' diperbaiki menjadi 'Berseberangan'.*  

---

### CUR-SMP-BIN-01-07 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 10534)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `struktur_laporan_observasi, pernyataan_umum`  
- **Rubrik Kesulitan:** Menerapkan (C3) mengenali pernyataan umum pada teks LHO.  

**Soal:**  
Kuda merupakan salah satu satwa mamalia yang telah banyak menolong pekerjaan manusia selama ribuan tahun. Tenaga kuda banyak dimanfaatkan oleh manusia, misalnya untuk mengangkat barang. Selain itu, kuda juga digunakan untuk kegiatan berolahraga, seperti pacuan kuda.  
  
Kutipan teks di atas merupakan bagian dari struktur teks hasil observasi bagian pernyataan umum karena ....

**Pilihan Jawaban:**  
- `A`. Berisi hal yang diketahui orang banyak tentang kuda **<== (Kunci Jawaban)**
- `B`. Berisi manfaat kuda untuk manusia
- `C`. Berisi pendapat penulis tentang kuda
- `D`. Berisi ringkasan umum tentang perincian dari kuda

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Pernyataan umum berisi gambaran umum objek yang sudah diketahui banyak orang sebelum diuraikan secara rinci.

**Catatan Kurasi:** *Kunci A. Struktur teks LHO.*  

---

### CUR-SMP-BIN-01-08 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 10476)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `identifikasi, struktur_deskripsi`  
- **Rubrik Kesulitan:** Menerapkan (C3) mengenali bagian identifikasi pada teks deskripsi.  

**Soal:**  
Pantai Batu Karas merupakan salah satu pantai untuk berselancar terbaik di Pulau Jawa, dan ombaknya cukup terkenal di kalangan para peselancar. Pantai Batu Karas terletak di Desa Batukaras, Kecamatan Cijulang, sekitar 34 km atau sekitar 1 jam perjalanan dari kawasan wisata Pangandaran. Pantai Batu Karas terletak di antara dua bukit yang mengurungnya, sehingga pantai tersebut berbentuk setengah lingkaran.  
  
Paragraf pertama kutipan teks di atas merupakan bagian identifikasi teks deskripsi karena ....

**Pilihan Jawaban:**  
- `A`. Berisi rincian dari pantai Batu Karas
- `B`. Berisi kesan penulis terhadap pantai Batu Karas
- `C`. Berisi gambaran umum dari pantai Batu Karas **<== (Kunci Jawaban)**
- `D`. Berisi tanggapan subjektif penulis tentang pantai Batu Karas

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Bagian identifikasi memuat gambaran umum objek (nama, lokasi, dan ciri umum) sebelum perincian.

**Catatan Kurasi:** *Kunci C. Struktur teks deskripsi.*  

---

### CUR-SMP-BIN-01-09 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 10405)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `deskripsi_umum, teks_reog`  
- **Rubrik Kesulitan:** Menerapkan (C3) mengenali pernyataan deskripsi umum pada teks budaya.  

**Soal:**  
Reog merupakan kesenian yang berasal dari Ponorogo, Jawa Timur. Oleh karena itu, kesenian tersebut dikenal dengan nama Reog Ponorogo. Gerbang Kota Ponorogo dihiasi oleh sosok warok dan gemblak. Reog adalah salah satu budaya daerah di Indonesia yang masih sangat kental dengan unsur-unsur mistik dan ilmu kebatinan. Ada lima versi cerita mengenai asal-usul Reog dan warok yang berkembang di masyarakat.  
  
Pernyataan yang mengandung unsur deskripsi umum adalah ....

**Pilihan Jawaban:**  
- `A`. Reog merupakan kesenian budaya berasal dari Provinsi Jawa Timur. Oleh karena itu, kesenian tersebut dikenal dengan nama Reog Ponorogo. **<== (Kunci Jawaban)**
- `B`. Ada lima versi cerita mengenai asal-usul Reog dan warok yang berkembang di masyarakat. Namun, salah satu cerita yang paling terkenal adalah cerita pemberontakan Ki Ageng Kutu.
- `C`. Pesan politis Ki Ageng Kutu disampaikan melalui pertunjukan seni Reog, yang merupakan sindiran kepada Raja Bhre Kertabhumi.
- `D`. Gerbang Kota Ponorogo dihiasi oleh sosok warok dan gemblak. Kedua tokoh ini sangat dikenal di Kota Ponorogo.

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Deskripsi umum memuat gambaran umum objek (nama, asal, dan pengenalan awal) tanpa rincian cerita.

**Catatan Kurasi:** *Kunci A. Teks asli dipangkas agar fokus; typo diperbaiki.*  

---

### CUR-SMP-BIN-01-10 — Tingkat: **Sedang** | Kognitif: **C4** (Sumber ID: 10406)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `deskripsi_umum, struktur_deskripsi`  
- **Rubrik Kesulitan:** Menganalisis (C4) paragraf yang mengandung deskripsi umum di antara paragraf rincian.  

**Soal:**  
Perhatikan empat paragraf berikut!  
  
(1) Di bagian belakang rumah makan Nyamleng terdapat kolam ikan nila. Warna merah yang mendominasi kolam tampak seperti kain indah yang sedang dimainkan seorang penari. Kolam itu tidak terlalu luas, tetapi asri.  
  
(2) Ketika memasuki rumah makan Nyamleng, kita disambut gapura bernuansa Jawa yang berdiri kukuh di pintu masuk. Begitu memasuki pintu utama, kita akan disambut ruangan sejuk berestetika tinggi. Lantai rumah makan ini terbuat dari kayu berwarna cokelat tua.  
  
(3) Di bagian tengah rumah makan Nyamleng diletakkan gamelan Jawa yang tertata rapi lengkap dengan niyaganya. Warna keemasan gamelan dengan kayu berwarna cokelat gelap sangat indah dipandang.  
  
(4) Rumah makan Nyamleng terletak di sebelah selatan alun-alun Kota Malang. Rumah makan ini terkenal dengan masakan tradisionalnya. Nama rumah makan ini berasal dari bahasa Jawa yang berarti enak sekali.  
  
Paragraf yang mengandung unsur deskripsi umum adalah ....

**Pilihan Jawaban:**  
- `A`. Paragraf (1)
- `B`. Paragraf (2)
- `C`. Paragraf (3)
- `D`. Paragraf (4) **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Paragraf (4) memuat gambaran umum objek (lokasi, nama, dan reputasi), sedangkan paragraf (1)-(3) merupakan deskripsi bagian yang merinci.

**Catatan Kurasi:** *Kunci D. Soal asli dipecah menjadi paragraf bernomor agar kunci lebih tegas.*  

---

### CUR-SMP-BIN-01-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 10487)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `melengkapi_paragraf, teks_deskripsi`  
- **Rubrik Kesulitan:** Menganalisis (C4) kalimat yang tepat untuk melengkapi paragraf deskripsi.  

**Soal:**  
Jam Gadang adalah menara jam yang terletak di pusat kota Bukittinggi, Sumatera Barat. Menara jam ini memiliki jam berukuran besar di empat sisinya. Jam Gadang dalam bahasa Minangkabau bermakna jam besar. Jam Gadang menjadi penanda pusat kota Bukittinggi.  
  
Jam Gadang memiliki denah dasar seluas 13 x 4 meter. Bagian dalam menara jam yang setinggi 26 meter terdiri dari beberapa tingkat, dengan tingkat teratas merupakan tempat penyimpanan bandul. Terdapat 4 jam dengan diameter masing-masing 80 cm pada Jam Gadang. [...]  
  
Kalimat deskripsi yang tepat untuk melengkapi paragraf deskripsi tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Dikenal sebagai kota pariwisata, Bukittinggi menyimpan sejumlah destinasi yang cukup dikenal baik wisatawan lokal maupun mancanegara.
- `B`. Bukittinggi merupakan kota terbesar kedua di Sumatera Barat, setelah Kota Padang, yang merupakan ibu kota provinsi.
- `C`. Selain Jam Gadang, di Bukittinggi juga terdapat tujuan wisata Air Terjun Lembah Anai.
- `D`. Mesin jam dan permukaan jam terletak pada satu tingkat di bawah tingkat paling atas. **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Kalimat D melanjutkan rincian bagian dalam menara jam sehingga koheren dengan paragraf deskripsi; pilihan lain membahas hal di luar objek.

**Catatan Kurasi:** *Kunci D. Typo 'Bukitinggi', 'terlatak', dan 'local' diperbaiki.*  

---

### CUR-SMP-BIN-01-12 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 10550)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `identifikasi, struktur_deskripsi`  
- **Rubrik Kesulitan:** Menganalisis (C4) ciri bagian identifikasi pada teks deskripsi.  

**Soal:**  
Tongkonan adalah rumah adat masyarakat Toraja. Tongkonan berasal dari kata tongkon yang artinya duduk bersama-sama. Suku Toraja yang memiliki rumah adat ini tinggal di pegunungan yang berbatasan dengan Kabupaten Enrekang, Sulawesi Selatan. Rumah adat ini merupakan salah satu ikon suku Toraja selain upacara pemakamannya.  
  
Ciri bagian identifikasi pada struktur teks deskripsi di atas adalah ....

**Pilihan Jawaban:**  
- `A`. Merinci bagian-bagian yang dilihat
- `B`. Pernyataan yang berisi tanggapan personal
- `C`. Nama objek yang dibahas, lokasi, dan sejarah **<== (Kunci Jawaban)**
- `D`. Simpulan umum atau tanggapan pribadi

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Bagian identifikasi memuat nama objek (Tongkonan), lokasi (pegunungan di Sulawesi Selatan), dan keterangan asal-usul.

**Catatan Kurasi:** *Kunci C. Teks asli dipangkas; typo 'termasyur' dan 'rumah adanya' diperbaiki.*  

---

### CUR-SMP-BIN-01-13 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 10880)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `ciri_teks_deskripsi, analisis_karakteristik`  
- **Rubrik Kesulitan:** Menganalisis (C4) karakteristik paragraf deskripsi di antara ciri teks lain.  

**Soal:**  
Perhatikan karakteristik paragraf berikut!  
(1) Sertakan pancaindra.  
(2) Memberikan data yang kuat dan jelas.  
(3) Banyak menggunakan kata sifat.  
(4) Jelaskan informasi dengan jelas.  
(5) Buat kesan bahwa pembaca merasakan atau mengalami apa yang sedang dibahas.  
(6) Ada kalimat yang meyakinkan.  
  
Karakteristik dari paragraf deskripsi adalah ....

**Pilihan Jawaban:**  
- `A`. 1, 3, 4, 5 **<== (Kunci Jawaban)**
- `B`. 1, 2, 3, 4
- `C`. 2, 3, 4, 6
- `D`. 2, 3, 5, 6

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Ciri deskripsi: melibatkan pancaindra (1), banyak kata sifat (3), jelas (4), dan membuat pembaca seolah mengalami (5). Nomor 2 dan 6 lebih dekat ke laporan/argumentasi.

**Catatan Kurasi:** *Kunci A. Analisis ciri antarteks.*  

---

### CUR-SMP-BIN-01-14 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 10978)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `urutan_langkah, teks_prosedur`  
- **Rubrik Kesulitan:** Menganalisis (C4) urutan langkah yang padu dalam teks prosedur/laporan.  

**Soal:**  
Perhatikan kalimat-kalimat berikut!  
(1) Tutup semua program atau aplikasi yang sedang aktif.  
(2) Klik menu "Turn Off Computer".  
(3) Klik tombol "Start".  
(4) Diamkan beberapa saat hingga komputer padam.  
(5) Pada kotak dialog "Turn Off Computer", pilih "Turn Off".  
(6) Cabut kabel listrik dari jala-jala listrik.  
(7) Tekan tombol OFF pada monitor untuk memadamkan monitor.  
(8) Tutup dengan penutup.  
  
Kalimat-kalimat tersebut dapat disusun menjadi teks yang padu dengan urutan nomor ....

**Pilihan Jawaban:**  
- `A`. 1-3-2-4-5-7-6-8
- `B`. 1-3-2-5-4-7-6-8 **<== (Kunci Jawaban)**
- `C`. 1-2-4-3-6-5-7-8
- `D`. 1-2-3-4-5-7-6-8

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Urutan logis: tutup program (1) -> klik Start (3) -> klik Turn Off Computer (2) -> pilih Turn Off (5) -> tunggu padam (4) -> matikan monitor (7) -> cabut kabel (6) -> tutup (8).

**Catatan Kurasi:** *Kunci B. Opsi dipangkas agar konsisten.*  

---

### CUR-SMP-BIN-01-15 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 11160)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase D: Mengidentifikasi struktur, ciri, dan tujuan teks deskripsi serta teks laporan hasil observasi.*  
- **Tag Konsep:** `judul_teks, laporan_percobaan`  
- **Rubrik Kesulitan:** Menganalisis (C4) judul yang tepat untuk teks laporan hasil percobaan.  

**Soal:**  
Pada saat kita tidur, baik siang maupun malam hari, selalu saja ada makhluk kecil bersayap bernama nyamuk. Hal ini mungkin hal yang sepele bagi sebagian orang dan dapat diatasi dengan menyemprotkan cairan pembasmi nyamuk yang banyak beredar di pasar. Namun, tahukah Anda jika cairan pembasmi tersebut mengandung berbagai bahan kimia yang dapat membahayakan kesehatan kita? Untuk mengatasi hal tersebut, kini terdapat cara alternatif yang lebih aman untuk menangkap dan memerangkap nyamuk. Cara membuatnya cukup sederhana dan bahan untuk membuatnya pun dapat kita temukan dalam kehidupan sehari-hari.  
  
Judul yang tepat untuk melengkapi kutipan teks laporan hasil percobaan di atas adalah ....

**Pilihan Jawaban:**  
- `A`. Cara Membuat Perangkap Alternatif dan Aman
- `B`. Cara Aman Membuat Cairan Pembasmi Nyamuk
- `C`. Cara Alternatif Membuat Nyamuk Terperangkap
- `D`. Cara Membuat Perangkap Nyamuk Sederhana **<== (Kunci Jawaban)**

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Teks membahas cara membuat perangkap nyamuk dengan bahan sederhana; judul D paling sesuai dengan isi dan tujuan teks.

**Catatan Kurasi:** *Kunci D. Judul harus mencerminkan isi teks.*  

---

## Topik `SMA-BIN-01`: Teks Eksposisi dan Teks Kritik (SMA — Bahasa Indonesia)

### CUR-SMA-BIN-01-01 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 8033)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `pengertian_eksposisi`  
- **Rubrik Kesulitan:** Mengingat (C1) pengertian teks eksposisi.  

**Soal:**  
Teks eksposisi adalah ....

**Pilihan Jawaban:**  
- `A`. Teks yang berisi cerita dan informasi terkini
- `B`. Teks yang menjelaskan atau memaparkan sesuatu secara runtut **<== (Kunci Jawaban)**
- `C`. Teks yang bertujuan memengaruhi pembaca
- `D`. Teks yang memberikan penjelasan akan suatu permasalahan secara subjektif
- `E`. Teks yang memaparkan informasi untuk menghibur pembaca

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Teks eksposisi memaparkan atau menjelaskan informasi secara runtut dan objektif agar pembaca memahami suatu hal.

**Catatan Kurasi:** *Kunci B. Definisi dasar teks eksposisi.*  

---

### CUR-SMA-BIN-01-02 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 8030)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `struktur_eksposisi`  
- **Rubrik Kesulitan:** Memahami (C2) struktur teks eksposisi.  

**Soal:**  
Berikut ini yang bukan termasuk struktur teks eksposisi adalah ....

**Pilihan Jawaban:**  
- `A`. Tesis
- `B`. Argumentasi
- `C`. Penegasan ulang
- `D`. Pendapat penulis
- `E`. Interpretasi **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Struktur teks eksposisi adalah tesis, argumentasi, dan penegasan ulang. Interpretasi bukan bagian struktur eksposisi.

**Catatan Kurasi:** *Kunci B. Struktur baku teks eksposisi.*  

---

### CUR-SMA-BIN-01-03 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 8042)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `tujuan_eksposisi`  
- **Rubrik Kesulitan:** Memahami (C2) tujuan teks eksposisi.  

**Soal:**  
Tujuan dari teks eksposisi adalah ....

**Pilihan Jawaban:**  
- `A`. Untuk memperhitungkan mengapa sesuatu menjadi seperti itu
- `B`. Untuk menanyakan mengapa sesuatu itu terjadi seperti itu
- `C`. Untuk menginformasikan sesuatu itu terjadi seperti itu **<== (Kunci Jawaban)**
- `D`. Untuk meratapi mengapa sesuatu itu terjadi seperti itu
- `E`. Untuk mendeskripsikan sesuatu

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Teks eksposisi bertujuan menginformasikan atau memaparkan sesuatu secara jelas kepada pembaca.

**Catatan Kurasi:** *Kunci C. Tujuan dasar teks eksposisi.*  

---

### CUR-SMA-BIN-01-04 — Tingkat: **Mudah** | Kognitif: **C1** (Sumber ID: 8166)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `contoh_eksposisi, media_massa`  
- **Rubrik Kesulitan:** Mengingat (C1) contoh teks eksposisi di media massa.  

**Soal:**  
Semua orang dapat menyusun berita baik media elektronik maupun media cetak. Salah satu contoh teks eksposisi dapat dilihat di ....

**Pilihan Jawaban:**  
- `A`. Telepon
- `B`. Diskusi
- `C`. Seminar
- `D`. Sidang
- `E`. Koran **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Koran memuat artikel/berita yang memaparkan informasi secara runtut, sehingga menjadi contoh teks eksposisi.

**Catatan Kurasi:** *Kunci B. Contoh konkret teks eksposisi.*  

---

### CUR-SMA-BIN-01-05 — Tingkat: **Mudah** | Kognitif: **C2** (Sumber ID: 8059)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `langkah_menulis_eksposisi`  
- **Rubrik Kesulitan:** Memahami (C2) langkah-langkah menulis teks eksposisi.  

**Soal:**  
(1) Menentukan tujuan karangan  
(2) Membuat kerangka karangan  
(3) Memilih data yang sesuai dengan tema  
(4) Menentukan tema  
(5) Mengembangkan kerangka menjadi karangan  
  
Langkah-langkah yang tepat dalam membuat teks eksposisi, yaitu ....

**Pilihan Jawaban:**  
- `A`. (5) - (2) - (1) - (4) - (3)
- `B`. (1) - (2) - (5) - (4) - (3)
- `C`. (4) - (3) - (1) - (2) - (5) **<== (Kunci Jawaban)**
- `D`. (3) - (4) - (1) - (2) - (5)
- `E`. (4) - (1) - (3) - (2) - (5)

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Urutan logis: menentukan tema (4) -> memilih data sesuai tema (3) -> menentukan tujuan (1) -> membuat kerangka (2) -> mengembangkan kerangka (5).

**Catatan Kurasi:** *Kunci C. Duplikasi baris pada stem mentah dibersihkan.*  

---

### CUR-SMA-BIN-01-06 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 8040)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `ciri_ilmiah, fakta`  
- **Rubrik Kesulitan:** Menerapkan (C3) mengenali ciri ilmiah teks eksposisi.  

**Soal:**  
Ciri dari sebuah teks eksposisi adalah sifatnya yang ilmiah. Cara mengetahui hal tersebut adalah ....

**Pilihan Jawaban:**  
- `A`. Dengan fakta-fakta yang bisa dibuktikan **<== (Kunci Jawaban)**
- `B`. Adanya data-data berupa angka
- `C`. Adanya istilah-istilah ilmiah
- `D`. Bersifat alami
- `E`. Menjelaskan masalah yang umum

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Sifat ilmiah teks eksposisi terutama ditandai oleh fakta yang dapat dibuktikan, bukan sekadar angka atau istilah.

**Catatan Kurasi:** *Kunci A. Fakta sebagai dasar eksposisi.*  

---

### CUR-SMA-BIN-01-07 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 8053)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `struktur_eksposisi, penegasan_ulang`  
- **Rubrik Kesulitan:** Menerapkan (C3) mengenali bagian struktur eksposisi pada kutipan.  

**Soal:**  
Semestinya hukum di Indonesia sebagaimana yang telah diatur pada undang-undang. Di dalamnya sudah secara tegas diatur hukuman untuk para pelaku tindak kejahatan. Akan tetapi, faktanya kerap kali terjadi ketidakadilan hukum yang dapat merugikan banyak orang. Hukum bisa saja tegas, tetapi menjadi mendadak tumpul ketika dihadapkan dengan koruptor. Itulah yang terjadi saat ini.  
  
Kutipan teks eksposisi tersebut merupakan bagian dari struktur ....

**Pilihan Jawaban:**  
- `A`. Tesis
- `B`. Argumentasi
- `C`. Deskripsi bagian
- `D`. Penegasan ulang **<== (Kunci Jawaban)**
- `E`. Simpulan

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Kutipan berisi penegasan kembali pendapat penulis di akhir, sehingga termasuk bagian penegasan ulang.

**Catatan Kurasi:** *Kunci C. Struktur eksposisi.*  

---

### CUR-SMA-BIN-01-08 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 8167)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `argumentasi, pengertian`  
- **Rubrik Kesulitan:** Memahami (C2) pengertian argumentasi dalam teks eksposisi.  

**Soal:**  
Alasan berupa bukti yang dapat mendukung tesis penulis. Berisi penjelasan secara lebih mendalam tentang pernyataan tesis (pendapat) yang diyakini kebenarannya melalui pengungkapan fakta-fakta sebagai penjelasan argumen penulis. Hal ini merupakan pengertian dari ....

**Pilihan Jawaban:**  
- `A`. Narasi
- `B`. Eksposisi
- `C`. Mediasi
- `D`. Argumentasi **<== (Kunci Jawaban)**
- `E`. Eksploitasi

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Argumentasi adalah bagian yang mendukung tesis dengan alasan dan bukti faktual.

**Catatan Kurasi:** *Kunci D. Istilah struktur eksposisi.*  

---

### CUR-SMA-BIN-01-09 — Tingkat: **Sedang** | Kognitif: **C2** (Sumber ID: 8169)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `klasifikasi, jenis_pengembangan`  
- **Rubrik Kesulitan:** Memahami (C2) jenis pengembangan teks eksposisi.  

**Soal:**  
Jenis pengembangan teks eksposisi yang rinciannya digolongkan dalam suatu objek ke dalam bagian-bagian disebut jenis pengembangan ....

**Pilihan Jawaban:**  
- `A`. Definisi
- `B`. Verifikasi
- `C`. Klasifikasi **<== (Kunci Jawaban)**
- `D`. Aktualisasi
- `E`. Analisis

**Kunci Jawaban:** `C`  
**Pembahasan Edukatif:**  
Pengembangan klasifikasi membagi objek menjadi bagian-bagian atau golongan berdasarkan ciri tertentu.

**Catatan Kurasi:** *Kunci C. Jenis pengembangan eksposisi.*  

---

### CUR-SMA-BIN-01-10 — Tingkat: **Sedang** | Kognitif: **C3** (Sumber ID: 8171)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `analisis_struktur, tesis_argumen_penutup`  
- **Rubrik Kesulitan:** Menerapkan (C3) menganalisis struktur teks eksposisi.  

**Soal:**  
Kegiatan menganalisis isi teks eksposisi dapat menggunakan struktur dan kaidah kebahasaan dalam penyusunan teks eksposisi. Analisis teks eksposisi ini dapat dilakukan mulai dari mengungkapkan pembukaan ....  
  
Jawaban yang tepat untuk titik-titik di atas adalah ....

**Pilihan Jawaban:**  
- `A`. tesis, vokal, dan penutup
- `B`. analisis, argumen, dan penutup
- `C`. tesis, isi, dan penutup
- `D`. tesis, rangkuman, dan penutup
- `E`. tesis, argumen, dan penutup **<== (Kunci Jawaban)**

**Kunci Jawaban:** `E`  
**Pembahasan Edukatif:**  
Struktur eksposisi adalah tesis (pembukaan), argumen (isi), dan penutup (penegasan ulang).

**Catatan Kurasi:** *Kunci E. Typo 'mengukapkan' diperbaiki menjadi 'mengungkapkan'.*  

---

### CUR-SMA-BIN-01-11 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 8610)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `pemahaman_isi, teks_pers`  
- **Rubrik Kesulitan:** Menganalisis (C4) pertanyaan yang sesuai dengan isi paragraf.  

**Soal:**  
Isu hidupnya lembaga bredel dalam legislasi pers nasional kembali menghantui insan pers Indonesia. Beberapa kalangan mengaku telah menerima draf perubahan UU Pers yang di dalamnya konon antara lain memuat pengaturan mengenai bredel. Ketakutan akan kembalinya rezim otoriter yang menaburkan kritik dan membudayakan sensor, pembungkaman, serta pembodohan warga kembali menyeruak. Tidak heran wacana yang hendak memunculkan kembali bredel dalam pembaruan hukum pers yang sebenarnya masih dalam tataran isu menimbulkan gelombang penolakan.  
  
Pertanyaan yang sesuai dengan isi paragraf pertama adalah ....

**Pilihan Jawaban:**  
- `A`. Mengapa pemerintah membuat undang-undang pers yang mengatur pembredelan?
- `B`. Bagaimana sikap insan pers terhadap rencana munculnya kembali lembaga bredel? **<== (Kunci Jawaban)**
- `C`. Sejak kapan pembaruan hukum pers yang meresahkan insan pers itu terjadi di Indonesia?
- `D`. Siapa sajakah yang diuntungkan secara konseptual dan finansial di era kebebasan pers?
- `E`. Pada media apa lembaga bredel berwenang mencabut hak untuk terbit dan siaran?

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Paragraf pertama membahas isu kembalinya lembaga bredel dan gelombang penolakan insan pers, sehingga pertanyaan B paling sesuai.

**Catatan Kurasi:** *Kunci B. Teks asli diperbaiki spasi dan tiponya.*  

---

### CUR-SMA-BIN-01-12 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 8611)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `inferensi, teks_pers`  
- **Rubrik Kesulitan:** Menganalisis (C4) alasan yang tersirat dalam teks.  

**Soal:**  
Isu hidupnya lembaga bredel dalam legislasi pers nasional kembali menghantui insan pers Indonesia. Beberapa kalangan mengaku telah menerima draf perubahan UU Pers yang di dalamnya konon antara lain memuat pengaturan mengenai bredel. Ketakutan akan kembalinya rezim otoriter yang menaburkan kritik dan membudayakan sensor, pembungkaman, serta pembodohan warga kembali menyeruak. Tidak heran wacana yang hendak memunculkan kembali bredel dalam pembaruan hukum pers yang sebenarnya masih dalam tataran isu menimbulkan gelombang penolakan.  
  
Mengapa insan pers dan pegiat hak atas kebebasan informasi menolak lembaga bredel dihidupkan kembali?  
  
Jawaban yang tepat adalah karena ....

**Pilihan Jawaban:**  
- `A`. lembaga bredel dikhawatirkan akan memasung kreativitas lembaga pers dan pegiat dalam pemberitaan **<== (Kunci Jawaban)**
- `B`. dengan hidupnya lembaga bredel dalam legislasi pers nasional akan menghantui insan pers
- `C`. insan pers dan pegiat merasa takut akan kembalinya rezim otoriter yang membudayakan sensor
- `D`. lembaga bredel dikhawatirkan memberi peluang lebar bagi kekuasaan untuk menghentikan operasi lembaga pers
- `E`. lembaga bredel akan menyensor berita-berita yang dimunculkan di media massa dengan ketat

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Kalimat terakhir teks menyatakan isu bredel ditolak karena akan menghambat kreativitas insan pers.

**Catatan Kurasi:** *Kunci C. Teks asli diperbaiki spasi dan tiponya.*  

---

### CUR-SMA-BIN-01-13 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 8692)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `kritik_sastra, esai`  
- **Rubrik Kesulitan:** Mengevaluasi (C5) kritik yang tepat terhadap sebuah esai.  

**Soal:**  
Membaca cerita-cerita yang ditulis oleh Hary B. Koriun, kita pasti akan menemukan gaya penulisan dan tema yang khas. Baik dalam cerita pendek maupun novel, tema kepenulisan Hary tidak jauh dari persoalan asmara yang dikerucutkan lagi kepada kesetiaan. Bukan tema perselingkuhan yang kini banyak disergap beberapa novelis terkemuka. Namun karena arus cerita mengalir dengan indah maka pembaca akan menemukan kekuatan narasi, sehingga pembaca akan terbuai dengan menjelajahi alinea demi alinea. Satu hal lagi yang akhir-akhir ini mewarnai cerita-cerita Hary adalah persoalan lingkungan, terutama hutan dan sungai.  
  
Kritik terhadap esai di atas adalah ....

**Pilihan Jawaban:**  
- `A`. Hal yang akhir-akhir ini mewarnai cerita-cerita Hary adalah persoalan lingkungan, terutama hutan dan sungai.
- `B`. Ulasan yang disampaikan terhadap karya Hary B. Koriun sudah baik, namun hendaknya tidak hanya mengomentari tentang tema saja. **<== (Kunci Jawaban)**
- `C`. Membaca cerita-cerita yang ditulis oleh Hary B. Koriun, kita pasti akan menemukan gaya penulisan dan tema yang khas.
- `D`. Baik dalam cerita pendek maupun novel, tema kepenulisan Hary tidak jauh dari persoalan asmara yang dikerucutkan lagi kepada kesetiaan.
- `E`. Arus cerita mengalir dengan indah maka pembaca akan menemukan kekuatan narasi, sehingga pembaca akan terbuai dengan menjelajahi alinea demi alinea.

**Kunci Jawaban:** `B`  
**Pembahasan Edukatif:**  
Kritik adalah penilaian yang disertai saran perbaikan. Pilihan B memberi apresiasi sekaligus saran agar ulasan tidak hanya menyoroti tema.

**Catatan Kurasi:** *Kunci B. Teks asli dirapikan; typo 'alinea' diperbaiki.*  

---

### CUR-SMA-BIN-01-14 — Tingkat: **Sukar** | Kognitif: **C5** (Sumber ID: 8703)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `kritik_prosa, latar`  
- **Rubrik Kesulitan:** Mengevaluasi (C5) kritik yang tepat terhadap kutipan prosa.  

**Soal:**  
Pagi itu Nonon berangkat ke tempatnya mengajar seperti biasa, hanya gerak langkahnya saja yang agak berbeda, kurang semangat. Nonon yang centil nyaris tak nampak lagi, sepeninggal emak ia memang agak berubah. Ia langkahkan kakinya dengan santai menyusuri jalan kecil berbatu dan menanjak yang di kanan kirinya masih hutan. Nonon selalu menikmati perjalanan ke sekolah, ia menghirup napas dalam-dalam, segar rasanya, ia benar-benar menikmati bau dedaunan di pagi hari. Ia memang cinta dengan desa ini karena kampung halamannya yang walaupun masih disebut kampung tapi sudah terjamah dengan teknologi yang menebarkan asap polusi. Kampungnya memang terletak di pinggiran kota sehingga sulit untuk terhindar dari dampak kemajuan kota.  
  
Kalimat kritik yang dapat disampaikan terhadap prosa di atas adalah ....

**Pilihan Jawaban:**  
- `A`. Penggambaran latar pada cerpen tersebut menggunakan terlalu banyak sisi sehingga membuat gambaran utuh yang sesungguhnya diharapkan malah tidak tampak dengan jelas. **<== (Kunci Jawaban)**
- `B`. Penggambaran latar yang sangat detail dari setiap sisi membuat pembaca dapat secara jelas membayangkan latar cerpen tersebut.
- `C`. Unsur intrinsik yang tampak dari cuplikan cerpen tersebut adalah latar tempat, ditunjukkan dengan penggunaan kata jalan yang menanjak, hutan, dan lain-lain.
- `D`. Latar merupakan gambaran terhadap suasana yang ada dalam cerpen. Latar bisa dilihat dari tempat, waktu, dan suasana.
- `E`. Suasana kampung yang masih asri dengan hutan yang rindang dapat terasa karena pengarang mengatakan sangat menyukai bau dedaunan.

**Kunci Jawaban:** `A`  
**Pembahasan Edukatif:**  
Kritik menuntut penilaian kelemahan. Pilihan A menyoroti latar yang terlalu banyak sisi sehingga gambaran utuh menjadi kabur; pilihan lain hanya deskripsi atau pujian.

**Catatan Kurasi:** *Kunci A. Teks asli dirapikan; typo 'kampong' dan 'intrinsic' diperbaiki.*  

---

### CUR-SMA-BIN-01-15 — Tingkat: **Sukar** | Kognitif: **C4** (Sumber ID: 8790)
- **Tipe Soal:** `multiple_choice`  
- **Target Kurikulum:** *Elemen Membaca dan Memirsa Fase E: Menganalisis struktur, ciri kebahasaan, dan kritik dalam teks eksposisi.*  
- **Tag Konsep:** `pokok_pikiran, kalimat_tidak_pendukung`  
- **Rubrik Kesulitan:** Menganalisis (C4) kalimat yang tidak mendukung pokok pikiran paragraf.  

**Soal:**  
Sebanyak 250 tentara Jerman dikerahkan ke negara bagian Mecklenburg-Vorpommern untuk membersihkan bangkai-bangkai burung. Dalam operasi tersebut, para tentara juga dibantu para pejabat militer di tingkat negara bagian. Dengan menggunakan pesawat-pesawat tempur Tornado, mereka mencari bangkai-bangkai burung sepanjang pesisir Baltik. Pengerahan militer ini dilakukan setelah media massa Jerman berhari-hari mengkritik kerja otoritas setempat yang lamban. Dalam operasi tersebut ditemukan bahwa jumlah burung yang mati karena terkena flu burung di wilayah tersebut meningkat menjadi 79 ekor.  
  
Salah satu kalimat dalam paragraf tersebut tidak mendukung pokok pikiran paragraf, yakni kalimat ....

**Pilihan Jawaban:**  
- `A`. pertama
- `B`. kedua
- `C`. ketiga
- `D`. keempat **<== (Kunci Jawaban)**
- `E`. kelima

**Kunci Jawaban:** `D`  
**Pembahasan Edukatif:**  
Pokok pikiran paragraf adalah pengerahan tentara untuk membersihkan bangkai burung. Kalimat keempat tentang kritik media massa tidak mendukung pokok pikiran tersebut.

**Catatan Kurasi:** *Kunci D. Analisis koherensi paragraf.*  

---
