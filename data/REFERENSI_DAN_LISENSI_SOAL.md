# 📝 Referensi Sumber dan Verifikasi Lisensi Bank Soal EduQuest

Dokumen ini mencatat sumber data, tautan resmi, dan status verifikasi lisensi untuk dataset soal kuis di EduQuest.

---

## 1. Bank Inti Produksi: IndoMMLU Dataset

Bank soal utama yang digunakan oleh sistem kuis EduQuest (berisi 7.023 soal tersaring) diimpor dari dataset **IndoMMLU**.

- **Repositori Resmi Hugging Face:**  
  🔗 [https://huggingface.co/datasets/fajri91/IndoMMLU](https://huggingface.co/datasets/fajri91/IndoMMLU)
- **Publikasi Ilmiah:**  
  *Koto et al., "IndoMMLU: Measuring Indo-Pacific Language Understanding"*
- **Lokasi File di Proyek:**  
  - Data mentah: `data/indommlu/IndoMMLU.csv`
  - Bank inti terfilter (7.023 soal): `data/indommlu/core/bank_inti.jsonl`
  - Perintah impor Django: `python manage.py import_questions`

### Verifikasi Lisensi IndoMMLU

| Parameter | Ketentuan Lisensi | Implikasi untuk EduQuest |
|---|---|---|
| **Jenis Lisensi** | **CC BY-NC-SA 4.0** (Creative Commons Attribution-NonCommercial-ShareAlike 4.0) | Sesuai untuk proyek akademik. |
| **Non-Commercial (NC)** | Hanya boleh digunakan untuk tujuan non-komersial. | ✅ **Sangat Terpenuhi:** EduQuest adalah capstone proyek kampus (non-komersial). |
| **Attribution (BY)** | Wajib mencantumkan atribusi kepada pembuat dataset asli (Fajri Koto dkk.). | ✅ **Terpenuhi:** Dicatat di dokumen, sistem database (`source_dataset="IndoMMLU"`), dan PRD. |
| **Share-Alike (SA)** | Jika mendistribusikan dataset hasil modifikasi/filter, harus memakai lisensi yang sama. | ✅ **Terpenuhi.** |

> ⚠️ **Catatan Hak Cipta Asal Soal (Audit Kualitas):**  
> Soal-soal dalam IndoMMLU dikumpulkan oleh penelitinya dari berbagai sumber publik di Indonesia (bank soal Kemdikbud, ujian sekolah, dan situs latihan soal seperti Bospedia). Dalam konteks capstone perkuliahan non-komersial, penggunaan dataset ini tergolong ke dalam **Fair Use / Penggunaan Wajar untuk Pendidikan**.

---

## 2. Dataset Lain yang Digunakan untuk Eksperimen

### A. ScienceQA (Dataset Eksperimen AI & Audit)
- **Tautan Hugging Face:** [https://huggingface.co/datasets/derek-thomas/ScienceQA](https://huggingface.co/datasets/derek-thomas/ScienceQA)
- **Status di EduQuest:** Hanya digunakan untuk riset audit data multimodal dan pengujian pipeline generator soal, **bukan** bank soal kuis siswa (karena berbahasa Inggris dan tidak sesuai kurikulum Indonesia).
- **Lokasi File:** `data/scienceqa/`

### B. AI2 ARC (ARC-Easy)
- **Tautan Hugging Face:** [https://huggingface.co/datasets/allenai/ai2_arc](https://huggingface.co/datasets/allenai/ai2_arc)
- **Lisensi:** CC BY-SA 4.0
- **Status di EduQuest:** Digunakan di awal proyek untuk menguji script download pipeline. File zip dan unduhannya sudah dibersihkan karena tidak lagi digunakan.

