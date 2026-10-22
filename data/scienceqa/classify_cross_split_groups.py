"""
classify_cross_split_groups.py
Klasifikasi otomatis kelompok lintas split ScienceQA (read-only).

Aturan (berurutan):
1. kandidat_duplikat_lintas_split : ada soal identik (pertanyaan + himpunan pilihan
   + teks jawaban sama) yang muncul di >1 split.
2. perlu_tinjauan : himpunan pilihan sama tetapi teks jawaban berbeda (konflik kunci).
3. variasi_valid  : semua baris punya himpunan pilihan berbeda (variasi template).
Tambahan: flag gambar_template bila hash gambar dipakai >=5 baris dengan pilihan berbeda.
Output: reports/group_classification.csv
"""
import argparse
import csv
import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path

SPLIT_KEYS = {
    "train": ("train",),
    "validation": ("validation", "valid", "val"),
    "test": ("test",),
}
_hash_cache = {}


def norm(text):
    return " ".join(str(text or "").lower().split())


def find_jsonl(data_dir, split):
    for p in sorted(data_dir.rglob("*.jsonl")):
        if any(k in p.stem.lower() for k in SPLIT_KEYS[split]):
            return p
    return None


def image_sha256(data_dir, jsonl_path, image_path):
    if not image_path:
        return ""
    for c in (data_dir / image_path, jsonl_path.parent / image_path, Path(image_path)):
        if c.is_file():
            key = str(c.resolve())
            if key not in _hash_cache:
                _hash_cache[key] = hashlib.sha256(c.read_bytes()).hexdigest()
            return _hash_cache[key]
    return ""


def choices_of(row):
    return row.get("choices") or row.get("options") or []


def answer_text(row):
    ch = choices_of(row)
    a = row.get("answer")
    if isinstance(a, int) and 0 <= a < len(ch):
        return str(ch[a])
    return str(a) if a is not None else ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data-dir", default="data_with_images")
    ap.add_argument("--out-dir", default="reports")
    ap.add_argument("--template-min", type=int, default=5,
                    help="minimal baris yang berbagi hash gambar agar ditandai gambar_template")
    args = ap.parse_args()

    data_dir, out_dir = Path(args.data_dir), Path(args.out_dir)
    out_dir.mkdir(exist_ok=True)

    groups = defaultdict(list)
    img_use = Counter()
    for split in SPLIT_KEYS:
        path = find_jsonl(data_dir, split)
        if path is None:
            print(f"[!] JSONL '{split}' tidak ditemukan")
            continue
        print(f"[+] {split}: {path}")
        with path.open(encoding="utf-8") as f:
            for i, line in enumerate(f, start=1):
                line = line.strip()
                if not line:
                    continue
                row = json.loads(line)
                sha = image_sha256(data_dir, path, row.get("image_path") or row.get("image"))
                if not sha:
                    continue
                img_use[sha] += 1
                groups[(norm(row.get("question")), sha)].append(
                    {"split": split, "line_no": i, "row": row})

    cross = {k: v for k, v in groups.items() if len({m["split"] for m in v}) > 1}
    print(f"[=] Kelompok lintas split: {len(cross)}")

    results = []
    for (q, sha), members in cross.items():
        sig_splits = defaultdict(set)      # (pilihan, jawaban) -> split
        choice_answers = defaultdict(set)  # pilihan -> {jawaban}
        for m in members:
            r = m["row"]
            cs = (tuple(sorted(norm(c) for c in choices_of(r))), norm(r.get("hint")))
            ans = norm(answer_text(r))
            sig_splits[(cs, ans)].add(m["split"])
            choice_answers[cs].add(ans)

        dup_cross = any(len(s) > 1 for s in sig_splits.values())
        conflict = any(len(a) > 1 for a in choice_answers.values())
        n_choice_sets = len(choice_answers)

        if dup_cross:
            label, reason = "kandidat_duplikat_lintas_split", "soal identik muncul di >1 split"
        elif conflict:
            label, reason = "perlu_tinjauan", "pilihan sama tetapi jawaban berbeda"
        else:
            label, reason = "variasi_valid", "himpunan pilihan berbeda di semua baris"

        first = members[0]["row"]
        results.append({
            "group_id": f"{sha[:8]}_{hashlib.md5(q.encode()).hexdigest()[:6]}",
            "label": label,
            "reason": reason,
            "n_rows": len(members),
            "n_splits": len({m['split'] for m in members}),
            "n_distinct_choice_sets": n_choice_sets,
            "image_reuse_rows_total": img_use[sha],
            "gambar_template": img_use[sha] >= args.template_min and n_choice_sets > 1,
            "template_key": hashlib.md5(
                (q + "|" + norm(first.get("topic"))).encode()).hexdigest()[:10],
            "topic": first.get("topic"),
            "grade": first.get("grade"),
            "splits": "/".join(sorted({m["split"] for m in members})),
            "question": first.get("question"),
        })

    order = {"kandidat_duplikat_lintas_split": 0, "perlu_tinjauan": 1, "variasi_valid": 2}
    results.sort(key=lambda r: (order[r["label"]], -r["n_rows"]))

    out = out_dir / "group_classification.csv"
    with out.open("w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=list(results[0].keys()))
        w.writeheader()
        w.writerows(results)

    print("\n== Ringkasan ==")
    for k, v in Counter(r["label"] for r in results).items():
        print(f"{k}: {v}")
    print("gambar_template:", sum(r["gambar_template"] for r in results))
    print("topik:", dict(Counter(r["topic"] for r in results)))
    print(f"[✓] {out}")


if __name__ == "__main__":
    main()
