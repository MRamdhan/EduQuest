# EduQuest Dataset Starter

Paket ini membantu mengunduh dataset soal AI2 ARC ke format CSV dan JSONL.

## Cara menjalankan
1. Pastikan Python 3.10+ sudah terpasang dan komputer terhubung ke internet.
2. Buka terminal/Command Prompt di folder ini.
3. Instal dependensi:
   `python -m pip install -U datasets pandas pyarrow`
4. Jalankan:
   `python download_ai2_arc.py`
5. Hasil akan dibuat di folder `data/`.

## Sumber resmi
- Dataset: https://huggingface.co/datasets/allenai/ai2_arc
- Lisensi yang tercantum pada halaman dataset: CC BY-SA 4.0

## Penting untuk EduQuest
Dataset ini berbahasa Inggris dan hanya mencakup soal sains. Gunakan untuk eksperimen struktur soal dan validasi pipeline. Materi utama EduQuest sebaiknya berasal dari buku/panduan pendidikan Indonesia yang sesuai dan digunakan mengikuti ketentuan lisensinya.

Untuk materi Indonesia, buka katalog resmi SIBI:
https://buku.kemendikdasmen.go.id/katalog/
