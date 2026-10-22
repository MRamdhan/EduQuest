import csv
from collections import Counter
from pathlib import Path

IN = Path("indommlu/processed/review_sample.csv")
OUT = Path("indommlu/processed/review_sample_prescreened.csv")

V = {n: "OK" for n in range(1, 64)}
V.update({n: "tidak_yakin" for n in (3, 13, 22, 35, 38, 42)})
V.update({n: "cek_teks_lengkap" for n in (15, 24, 50, 54, 59, 60, 63)})
V.update({n: "kunci_diragukan" for n in (9, 14, 28, 52)})
V.update({n: "kunci_salah" for n in (26, 40)})
V[36] = "ambigu"
V[46] = "soal_cacat"

KUNCI = {40: "D", 26: "E", 28: "D", 14: "B", 52: "E", 9: "D"}
NOTE = {
    40: "Time series, bukan cross section",
    26: "Sol-gel Amoeba terkait pembentukan kaki semu",
    9: "Opsi D (oksidator kuat) jelas salah untuk Al; E juga diragukan",
    28: "Jati diri koperasi: anggota = pemilik & pengguna jasa",
    14: "Teror/intimidasi = bentuk kontravensi",
    52: "Overlay pemukiman biasanya lereng, genangan, jalan",
    36: "B dan E hampir sama (kuasa usaha vs kuasa usaha tetap)",
    46: "Opsi D tampak salah ketik kenozoikum; semua opsi era valid",
    42: "Isi 3 jenis deskripsi tidak yakin",
    25: "Typo 'memtikan'", 34: "Typo opsi D: Pb(No3)2",
    22: "B dan D sama-sama masuk akal",
    13: "Semua pernyataan benar? tidak yakin", 35: "A dan E mirip",
    38: "Opsi B juga bisa fungsi tradisi lisan", 3: "Alasan dianggap salah, tidak yakin",
}
for n in (15, 24, 50, 54, 59, 60, 63):
    NOTE.setdefault(n, "Teks panjang; pastikan teks soal lengkap di CSV")

rows = list(csv.DictReader(IN.open(encoding="utf-8-sig")))
fields = list(rows[0].keys()) + ["reviewer"]
for r in rows:
    n = int(r["no"])
    r["verdict"] = V[n]
    r["kunci_menurut_reviewer"] = KUNCI.get(n, "")
    r["catatan"] = NOTE.get(n, "")
    r["reviewer"] = "AI-prescreen (belum diverifikasi manusia)"

with OUT.open("w", newline="", encoding="utf-8-sig") as f:
    w = csv.DictWriter(f, fieldnames=fields)
    w.writeheader()
    w.writerows(rows)

print("Verdict:", dict(Counter(r["verdict"] for r in rows)))
print("Per sumber (soal bermasalah):")
bad = [r for r in rows if r["verdict"] in ("kunci_salah", "kunci_diragukan", "ambigu", "soal_cacat")]
print(dict(Counter(r["source_risk"] for r in bad)))
print(f"[✓] {OUT}")