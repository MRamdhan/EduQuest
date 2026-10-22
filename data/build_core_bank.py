import csv
import json
from collections import Counter
from pathlib import Path

ELIGIBLE = Path("indommlu/processed/indommlu_eligible.jsonl")
REVIEW = Path("indommlu/processed/review_sample_prescreened.csv")
OUT = Path("indommlu/core")
OUT.mkdir(parents=True, exist_ok=True)

LEVEL_MAP = {
    "SD":  {1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3},
    "SMP": {7: 1, 8: 2, 9: 3},
    "SMA": {10: 1, 11: 2, 12: 3},
}

LEVEL_MAP_MAPEL = {
    ("SD", "IPA"):  {1: 1, 3: 1, 4: 1, 5: 2, 6: 3},
    ("SD", "PPKN"): {1: 1, 3: 1, 4: 1, 5: 2, 6: 3},
}

def difficulty_of(jenjang, mapel, kelas):
    if kelas is None:
        return None
    try:
        k = int(kelas)
    except (TypeError, ValueError):
        return None
    table = LEVEL_MAP_MAPEL.get((jenjang, mapel)) or LEVEL_MAP.get(jenjang, {})
    return table.get(k)


def validate(r):
    """Validator teknis dasar. Mengembalikan daftar masalah."""
    p = []
    opts = r.get("options") or []
    keys = [o.get("key") for o in opts]
    if not (3 <= len(opts) <= 5):
        p.append("jumlah_opsi_tidak_3_5")
    if len(set(keys)) != len(keys):
        p.append("key_duplikat")
    if keys != list("ABCDE"[:len(keys)]):
        p.append("key_tidak_berurutan")
    if any(not str(o.get("text", "")).strip() for o in opts):
        p.append("teks_opsi_kosong")
    if r.get("correct_option") not in keys:
        p.append("kunci_tidak_ada_di_opsi")
    if not str(r.get("question_text", "")).strip():
        p.append("soal_kosong")
    texts = [str(o.get("text", "")).strip().lower() for o in opts]
    if len(set(texts)) != len(texts):
        p.append("opsi_identik")
    return p


# soal yang harus dikeluarkan karena hasil pra-penilaian bukan OK
review_excl = {}
if REVIEW.exists():
    for row in csv.DictReader(REVIEW.open(encoding="utf-8-sig")):
        if row["verdict"] != "OK":
            review_excl[int(row["source_id"])] = row["verdict"]
else:
    print("[!] review_sample_prescreened.csv tidak ditemukan; filter pra-penilaian dilewati")

rows = [json.loads(l) for l in ELIGIBLE.open(encoding="utf-8") if l.strip()]
core, excluded = [], []

for r in rows:
    reasons = []
    if r["jenjang"] not in LEVEL_MAP:
        reasons.append("bukan_SD_SMP_SMA:" + str(r["jenjang"]))
    if r["source_id"] in review_excl:
        reasons.append("prescreen:" + review_excl[r["source_id"]])
    if r.get("needs_passage_flag"):
        reasons.append("needs_passage_flag")
    reasons += validate(r)
    if reasons:
        excluded.append({"source_id": r["source_id"], "jenjang": r["jenjang"],
                        "mapel": r["mapel"], "reasons": ";".join(reasons)})
        continue
    r2 = dict(r)
    r2["difficulty"] = r2["difficulty"] = difficulty_of(r["jenjang"], r["mapel"], r["kelas"])
    r2["difficulty_source"] = "proxy_kelas" if r2["difficulty"] else None
    r2["review_status"] = "validated"
    core.append(r2)

with (OUT / "bank_inti.jsonl").open("w", encoding="utf-8") as f:
    for r in core:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")
with (OUT / "excluded.csv").open("w", newline="", encoding="utf-8-sig") as f:
    w = csv.DictWriter(f, fieldnames=["source_id", "jenjang", "mapel", "reasons"])
    w.writeheader()
    w.writerows(excluded)

L = [f"Bank inti: {len(core)} | Dikeluarkan: {len(excluded)}", ""]
L.append("Alasan dikeluarkan (teratas):")
rc = Counter(x for e in excluded for x in e["reasons"].split(";"))
for k, n in rc.most_common(10):
    L.append(f"  {n:5d}  {k}")
L.append("\nJenjang x mapel (total | tingkat 1/2/3/kosong):")
cnt = Counter((r["jenjang"], r["mapel"], r["difficulty"]) for r in core)
pairs = sorted({(r["jenjang"], r["mapel"]) for r in core})
for j, m in pairs:
    d = [cnt[(j, m, x)] for x in (1, 2, 3, None)]
    L.append(f"  {j:4s} {m:18s} {sum(d):5d} | {d[0]}/{d[1]}/{d[2]}/{d[3]}")
L.append("\nRisiko sumber di bank inti:")
for k, n in Counter(r["source_risk"] for r in core).most_common():
    L.append(f"  {k}: {n}")
text = "\n".join(L)
(OUT / "summary.txt").write_text(text, encoding="utf-8")
print(text)