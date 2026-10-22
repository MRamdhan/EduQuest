import csv
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

IN = Path("indommlu/processed/indommlu_eduquest.jsonl")
OUT = IN.parent

VISUAL_RE = re.compile(
    r"\b(?:perhatikan|lihatlah|lihat|amati|cermati|berdasarkan|pada|dari|sesuai)\s+"
    r"(?:\w+\s+){0,2}?(?:gambar|tabel|grafik|diagram|peta|skema|denah|bagan)\b"
    r"|\b(?:gambar|tabel|grafik|diagram|peta|skema|bagan)\s+(?:di atas|di bawah|berikut|tersebut|ini)\b",
    re.I)
PASSAGE_RE = re.compile(
    r"\b(?:teks berikut|bacalah|baca teks|wacana|kutipan|paragraf berikut|"
    r"puisi berikut|cerita berikut|bacaan)\b", re.I)


def source_domain_and_risk(title):
    t = str(title).strip()
    low = t.lower()
    domain = urlparse(t).netloc.lower() if low.startswith("http") else ""
    probe = domain or low
    if "kemdikbud" in probe or "kemendikbud" in probe:
        return (domain or "kemdikbud"), "rendah_sumber_pemerintah"
    if "simak.ui.ac.id" in probe:
        return domain or "simak.ui.ac.id", "tinggi_ujian_ptn"
    if "scribd" in probe or "academia.edu" in probe:
        return domain or ("scribd" if "scribd" in probe else "academia.edu"), \
               "tinggi_unggahan_pihak_ketiga"
    for k in ("bospedia", "kherysuryawan", "majalahpendidikan"):
        if k in probe:
            return domain or k, "sedang_blog_soal"
    return (domain or "lainnya"), "sedang_blog_soal"


def norm(s):
    return re.sub(r"\W+", " ", str(s).lower()).strip()


rows = [json.loads(l) for l in IN.open(encoding="utf-8") if l.strip()]
seen, flags, eligible = {}, [], []

for r in rows:
    q = r["question_text"]
    key = norm(q) + "|" + "|".join(sorted(norm(o["text"]) for o in r["options"]))
    dup_of = seen.get(key)
    if dup_of is None:
        seen[key] = r["source_id"]

    mapel = r["mapel"]
    if r["jenjang"] == "SMP" and mapel == "Fisika":
        mapel_norm = "IPA"
    else:
        mapel_norm = mapel

    domain, risk = source_domain_and_risk(r["source_title"])
    f = {
        "source_id": r["source_id"],
        "jenjang": r["jenjang"],
        "kelas": r["kelas"],
        "mapel": mapel,
        "mapel_norm": mapel_norm,
        "n_options": len(r["options"]),
        "is_ptn": r["jenjang"] == "PTN",
        "needs_visual": bool(VISUAL_RE.search(q)),
        "needs_passage": bool(PASSAGE_RE.search(q)) and len(q) < 300,
        "duplicate_of": dup_of if dup_of is not None else "",
        "source_domain": domain,
        "source_risk": risk,
        "question_preview": q[:100].replace("\n", " "),
    }
    flags.append(f)

    ok = (r["jenjang"] in ("SD", "SMP", "SMA", "PTN")
          and not f["needs_visual"] and f["duplicate_of"] == "")
    if ok:
        r2 = dict(r)
        r2["mapel"] = mapel_norm
        r2["mapel_asli"] = mapel
        r2["source_domain"] = domain
        r2["source_risk"] = risk
        r2["needs_passage_flag"] = f["needs_passage"]
        eligible.append(r2)

with (OUT / "quality_flags.csv").open("w", newline="", encoding="utf-8-sig") as fc:
    w = csv.DictWriter(fc, fieldnames=list(flags[0].keys()))
    w.writeheader()
    w.writerows(flags)
with (OUT / "indommlu_eligible.jsonl").open("w", encoding="utf-8") as fe:
    for r in eligible:
        fe.write(json.dumps(r, ensure_ascii=False) + "\n")

L = [f"Total input: {len(rows)}", f"Lolos aturan dasar (SD/SMP/SMA, tanpa rujukan visual, tanpa duplikat): {len(eligible)}", ""]
L.append("Flag:")
L.append(f"  PTN            : {sum(f['is_ptn'] for f in flags)}")
L.append(f"  needs_visual   : {sum(f['needs_visual'] for f in flags)}")
L.append(f"  needs_passage  : {sum(f['needs_passage'] for f in flags)} (tetap di eligible, hanya ditandai)")
L.append(f"  duplikat       : {sum(1 for f in flags if f['duplicate_of'] != '')}")
L.append("\nRisiko sumber (seluruh input):")
for k, n in Counter(f["source_risk"] for f in flags).most_common():
    L.append(f"  {k}: {n}")
L.append("\nRisiko sumber (eligible):")
for k, n in Counter(r["source_risk"] for r in eligible).most_common():
    L.append(f"  {k}: {n}")
L.append("\nEligible per jenjang x mapel:")
for (j, m), n in sorted(Counter((r["jenjang"], r["mapel"]) for r in eligible).items()):
    L.append(f"  {j:5s} {m:18s} {n}")
L.append("\nJumlah opsi per jenjang (eligible):")
for (j, n_opt), n in sorted(Counter((r["jenjang"], len(r["options"])) for r in eligible).items()):
    L.append(f"  {j:5s} {n_opt} opsi: {n}")
text = "\n".join(L)
(OUT / "quality_summary.txt").write_text(text, encoding="utf-8")
print(text)