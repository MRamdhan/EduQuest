import argparse
import csv
import hashlib
import json
from collections import defaultdict
from pathlib import Path

SPLIT_KEYS = {
    "train": ("train",),
    "validation": ("validation", "valid", "val"),
    "test": ("test",),
}


def norm(text):
    return " ".join(str(text or "").lower().split())


def find_jsonl(data_dir, split):
    for p in sorted(data_dir.rglob("*.jsonl")):
        if any(k in p.stem.lower() for k in SPLIT_KEYS[split]):
            return p
    return None


_hash_cache = {}


def image_sha256(data_dir, jsonl_path, image_path):
    if not image_path:
        return ""
    candidates = [
        data_dir / image_path,
        jsonl_path.parent / image_path,
        Path(image_path),
    ]
    for c in candidates:
        if c.is_file():
            key = str(c.resolve())
            if key not in _hash_cache:
                _hash_cache[key] = hashlib.sha256(c.read_bytes()).hexdigest()
            return _hash_cache[key]
    return ""


def answer_text(row):
    choices = row.get("choices") or row.get("options") or []
    ans = row.get("answer")
    if isinstance(ans, int) and isinstance(choices, list) and 0 <= ans < len(choices):
        return str(choices[ans])
    return str(ans) if ans is not None else ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data-dir", default="data_with_images",
                    help="folder berisi JSONL + gambar (default: data_with_images)")
    ap.add_argument("--top", type=int, default=20)
    ap.add_argument("--out-dir", default="reports")
    args = ap.parse_args()

    data_dir = Path(args.data_dir)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(exist_ok=True)

    groups = defaultdict(list)
    for split in SPLIT_KEYS:
        path = find_jsonl(data_dir, split)
        if path is None:
            print(f"[!] JSONL untuk split '{split}' tidak ditemukan di {data_dir}")
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
                    continue  # kelompok hanya untuk baris yang punya gambar
                key = (norm(row.get("question")), sha)
                groups[key].append({"split": split, "line_no": i, "row": row, "sha": sha})

    cross = {k: v for k, v in groups.items() if len({m["split"] for m in v}) > 1}
    print(f"[=] Kelompok lintas split: {len(cross)}")

    def priority(item):
        _, members = item
        n_splits = len({m["split"] for m in members})
        n_answers = len({norm(answer_text(m["row"])) for m in members})
        return (-n_splits, -(n_answers > 1), -len(members))

    ranked = sorted(cross.items(), key=priority)[: args.top]

    fields = ["rank", "group_id", "n_splits", "n_rows", "n_distinct_answer_text",
              "split", "line_no", "grade", "subject", "topic", "skill",
              "question", "choices", "answer_idx", "answer_text",
              "hint", "solution", "image_path", "image_sha256"]

    csv_path = out_dir / "priority_groups_detail.csv"
    txt_path = out_dir / "priority_groups_detail.txt"

    with csv_path.open("w", newline="", encoding="utf-8-sig") as fc, \
         txt_path.open("w", encoding="utf-8") as ft:
        w = csv.DictWriter(fc, fieldnames=fields)
        w.writeheader()
        for rank, ((q, sha), members) in enumerate(ranked, start=1):
            gid = f"{sha[:8]}_{hashlib.md5(q.encode()).hexdigest()[:6]}"
            n_splits = len({m["split"] for m in members})
            n_ans = len({norm(answer_text(m["row"])) for m in members})
            ft.write(f"\n=== #{rank} group {gid} | splits={n_splits} rows={len(members)} "
                     f"jawaban_berbeda={n_ans} ===\n")
            ft.write(f"Q: {q}\n")
            for m in members:
                r = m["row"]
                choices = r.get("choices") or r.get("options") or []
                ft.write(f"  - [{m['split']} baris {m['line_no']}] "
                         f"pilihan={choices} | jawaban={answer_text(r)!r} | "
                         f"topik={r.get('topic')} | kelas={r.get('grade')}\n")
                w.writerow({
                    "rank": rank, "group_id": gid, "n_splits": n_splits,
                    "n_rows": len(members), "n_distinct_answer_text": n_ans,
                    "split": m["split"], "line_no": m["line_no"],
                    "grade": r.get("grade"), "subject": r.get("subject"),
                    "topic": r.get("topic"), "skill": r.get("skill"),
                    "question": r.get("question"),
                    "choices": json.dumps(choices, ensure_ascii=False),
                    "answer_idx": r.get("answer"),
                    "answer_text": answer_text(r),
                    "hint": r.get("hint"), "solution": r.get("solution"),
                    "image_path": r.get("image_path") or r.get("image"),
                    "image_sha256": m["sha"],
                })

    print(f"[✓] {csv_path}")
    print(f"[✓] {txt_path}")


if __name__ == "__main__":
    main()