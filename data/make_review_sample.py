import argparse
import csv
import json
import random
import re
from collections import defaultdict
from pathlib import Path

IN = Path("indommlu/processed/indommlu_eligible.jsonl")
OUT = IN.parent
WEAK_VISUAL = re.compile(r"\b(gambar|tabel|grafik|diagram|peta|skema|bagan|denah|ilustrasi)\b", re.I)

ap = argparse.ArgumentParser()
ap.add_argument("--per-stratum", type=int, default=2)
ap.add_argument("--weak-visual", type=int, default=15)
ap.add_argument("--seed", type=int, default=42)
a = ap.parse_args()
rng = random.Random(a.seed)

rows = [json.loads(l) for l in IN.open(encoding="utf-8") if l.strip()]
by = defaultdict(list)
for r in rows:
    by[(r["jenjang"], r["mapel"])].append(r)

picked, seen = [], set()
for k in sorted(by):
    for r in rng.sample(by[k], min(a.per_stratum, len(by[k]))):
        picked.append(("strata", r)); seen.add(r["source_id"])

weak = [r for r in rows if r["source_id"] not in seen and WEAK_VISUAL.search(r["question_text"])]
for r in rng.sample(weak, min(a.weak_visual, len(weak))):
    picked.append(("kata_visual_tidak_ditandai", r))

fields = ["no", "alasan_sampel", "source_id", "jenjang", "kelas", "mapel", "source_risk",
          "question_text", "options", "kunci_dataset", "verdict", "kunci_menurut_reviewer", "catatan"]
with (OUT / "review_sample.csv").open("w", newline="", encoding="utf-8-sig") as fc, \
     (OUT / "review_sample.txt").open("w", encoding="utf-8") as ft:
    w = csv.DictWriter(fc, fieldnames=fields)
    w.writeheader()
    for i, (why, r) in enumerate(picked, 1):
        opts = "\n".join(f"{o['key']}. {o['text']}" for o in r["options"])
        w.writerow({"no": i, "alasan_sampel": why, "source_id": r["source_id"],
                    "jenjang": r["jenjang"], "kelas": r["kelas"], "mapel": r["mapel"],
                    "source_risk": r["source_risk"], "question_text": r["question_text"],
                    "options": opts, "kunci_dataset": r["correct_option"],
                    "verdict": "", "kunci_menurut_reviewer": "", "catatan": ""})
        ft.write(f"\n#{i} [{why}] {r['jenjang']} kelas={r['kelas']} {r['mapel']} (id {r['source_id']})\n")
        ft.write(r["question_text"] + "\n" + opts + f"\nKunci dataset: {r['correct_option']}\n")
print(f"Sampel: {len(picked)} soal -> {OUT / 'review_sample.csv'}")