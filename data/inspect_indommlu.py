from pathlib import Path
import io
import urllib.request

import pandas as pd

URL = "https://huggingface.co/datasets/indolem/IndoMMLU/resolve/main/IndoMMLU.csv"
OUT = Path("indommlu")
(OUT / "reports").mkdir(parents=True, exist_ok=True)
raw = OUT / "IndoMMLU.csv"

if not raw.exists():
    print("[+] Mengunduh...")
    with urllib.request.urlopen(URL) as r:
        raw.write_bytes(r.read())

df = pd.read_csv(raw)
lines = []
def log(s=""):
    print(s)
    lines.append(str(s))

log(f"Baris: {len(df)}")
log(f"Kolom: {list(df.columns)}")
log("\nContoh 3 baris:")
log(df.head(3).to_string())

log("\nNilai kosong per kolom:")
log(df.isna().sum().to_string())

for c in df.columns:
    n = df[c].nunique(dropna=True)
    if n <= 80:
        log(f"\nDistribusi '{c}' ({n} nilai):")
        log(df[c].value_counts().to_string())

dup = df.duplicated().sum()
log(f"\nBaris duplikat persis: {dup}")

(OUT / "reports" / "indommlu_summary.txt").write_text("\n".join(lines), encoding="utf-8")
print("\n[✓] indommlu/reports/indommlu_summary.txt")