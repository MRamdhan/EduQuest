import argparse
import json
import re
from collections import Counter
from pathlib import Path

import pandas as pd

OPT_RE = re.compile(r"^\s*([A-E])\s*[\.\)]\s*(.*\S)?\s*$")
ROMAN = {"I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6,
         "VII": 7, "VIII": 8, "IX": 9, "X": 10, "XI": 11, "XII": 12}
DEFAULT_SUBJECTS = ["IPA", "IPS", "PPKN", "Bahasa Indonesia", "Biologi", "Fisika",
                    "Kimia", "Geografi", "Sejarah", "Ekonomi", "Sosiologi"]


def parse_options(text):
    opts = []
    for line in str(text).replace("\r", "").split("\n"):
        m = OPT_RE.match(line)
        if m:
            opts.append({"key": m.group(1), "text": (m.group(2) or "").strip()})
        elif opts and line.strip():
            opts[-1]["text"] = (opts[-1]["text"] + " " + line.strip()).strip()
    return opts


def jenjang_of(level):
    s = str(level).strip().upper()
    if "PTN" in s:
        return "PTN"
    if s == "SD-SMP-SMA":
        return "CAMPURAN"
    if s == "SD-SMP":
        return "SD-SMP"
    for j in ("SMA", "SMP", "SD"):
        if re.search(r"\b" + j + r"\b", s):
            return j
    return "TIDAK_DIKETAHUI"


def kelas_of(raw, level):
    s = str(raw).strip()
    if s.upper() == "PTN":
        return None, "PTN"
    try:
        f = float(s)
        if f == int(f) and 1 <= int(f) <= 12:
            return int(f), ""
    except ValueError:
        pass
    m = re.search(r"\b(XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)\b", str(level).upper())
    if m:
        return ROMAN[m.group(1)], "dari_level"
    if re.fullmatch(r"\d+(,\d+)+", s):
        return None, "rentang:" + s
    return None, "tidak_jelas:" + s


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default="indommlu/IndoMMLU.csv")
    ap.add_argument("--out-dir", default="indommlu/processed")
    ap.add_argument("--subjects", nargs="*", default=DEFAULT_SUBJECTS)
    args = ap.parse_args()

    out = Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(args.input)
    df = df[df["subject"].isin(args.subjects)]
    print(f"[+] Baris setelah filter mapel: {len(df)}")

    valid, rejected = [], []
    for _, r in df.iterrows():
        reasons = []
        opts = parse_options(r["jawaban"])
        keys = [o["key"] for o in opts]
        kunci = str(r["kunci"]).strip().upper()
        if not str(r["soal"]).strip():
            reasons.append("soal_kosong")
        if len(opts) < 2:
            reasons.append("opsi_kurang_dari_2")
        if len(set(keys)) != len(keys):
            reasons.append("key_opsi_duplikat")
        if any(not o["text"] for o in opts):
            reasons.append("teks_opsi_kosong")
        if kunci not in keys:
            reasons.append("kunci_tidak_ada_di_opsi")
        if reasons:
            rejected.append({"id": r["id"], "subject": r["subject"],
                             "reason": ";".join(reasons)})
            continue
        kelas, note = kelas_of(r["kelas"], r["level"])
        valid.append({
            "source_dataset": "IndoMMLU",
            "source_id": int(r["id"]),
            "source_title": r["sumber"],
            "license": "CC BY-NC-SA 4.0",
            "jenjang": jenjang_of(r["level"]),
            "kelas": kelas,
            "kelas_note": note,
            "mapel": r["subject"],
            "question_type": "multiple_choice",
            "question_text": str(r["soal"]).strip(),
            "options": opts,
            "correct_option": kunci,
            "explanation": None,
            "difficulty": None,
            "topic": None,
            "concept_tags": [],
            "review_status": "imported",
            "is_for_fewshot": int(r["is_for_fewshot"]),
        })

    with (out / "indommlu_eduquest.jsonl").open("w", encoding="utf-8") as f:
        for v in valid:
            f.write(json.dumps(v, ensure_ascii=False) + "\n")
    pd.DataFrame(rejected).to_csv(out / "rejected.csv", index=False, encoding="utf-8-sig")

    lines = [f"Valid: {len(valid)} | Ditolak: {len(rejected)}", ""]
    lines.append("Per jenjang:")
    for k, n in Counter(v["jenjang"] for v in valid).most_common():
        lines.append(f"  {k}: {n}")
    lines.append("\nPer jenjang x mapel:")
    for (j, m), n in sorted(Counter((v["jenjang"], v["mapel"]) for v in valid).items()):
        lines.append(f"  {j:16s} {m:18s} {n}")
    lines.append("\nKelas tidak jelas/rentang:")
    for k, n in Counter(v["kelas_note"] for v in valid if v["kelas"] is None).most_common(10):
        lines.append(f"  {k}: {n}")
    lines.append("\nJumlah opsi:")
    for k, n in sorted(Counter(len(v["options"]) for v in valid).items()):
        lines.append(f"  {k} opsi: {n}")
    lines.append("\n15 sumber teratas:")
    for k, n in Counter(v["source_title"] for v in valid).most_common(15):
        lines.append(f"  {n:4d}  {k[:90]}")
    text = "\n".join(lines)
    (out / "summary.txt").write_text(text, encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()