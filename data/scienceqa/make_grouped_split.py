import argparse
import csv
import hashlib
import json
import random
from collections import Counter, defaultdict
from pathlib import Path

SPLIT_KEYS = {
    "train": ("train",),
    "validation": ("validation", "valid", "val"),
    "test": ("test",),
}
SPLITS = ["train", "validation", "test"]


def norm(text):
    return " ".join(str(text or "").lower().split())


def md5(text, n=10):
    return hashlib.md5(text.encode("utf-8")).hexdigest()[:n]


def find_jsonl(data_dir, split):
    for p in sorted(data_dir.rglob("*.jsonl")):
        if any(k in p.stem.lower() for k in SPLIT_KEYS[split]):
            return p
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data-dir", default="data_with_images")
    ap.add_argument("--out-dir", default="data_grouped_split")
    ap.add_argument("--ratios", default="0.6,0.2,0.2", help="train,validation,test")
    ap.add_argument("--max-group", type=int, default=300,
                    help="grup lebih besar dari ini dipecah lagi per hint")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    ratios = [float(x) for x in args.ratios.split(",")]
    assert len(ratios) == 3 and abs(sum(ratios) - 1) < 1e-6, "rasio harus berjumlah 1"

    data_dir, out_dir = Path(args.data_dir), Path(args.out_dir)
    out_dir.mkdir(exist_ok=True)

    # 1) baca semua baris
    rows = []
    for split in SPLITS:
        path = find_jsonl(data_dir, split)
        if path is None:
            raise SystemExit(f"JSONL '{split}' tidak ditemukan di {data_dir}")
        with path.open(encoding="utf-8") as f:
            for i, line in enumerate(f, start=1):
                line = line.strip()
                if not line:
                    continue
                r = json.loads(line)
                rows.append({"orig_split": split, "orig_line": i, "row": r})
    print(f"[+] Total baris: {len(rows)}")

    # 2) kunci template, pecah grup raksasa per hint
    base_key = defaultdict(list)
    for item in rows:
        r = item["row"]
        base_key[(norm(r.get("question")), norm(r.get("topic")))].append(item)

    groups = {}
    n_split_big = 0
    for (q, topic), members in base_key.items():
        key = md5(q + "|" + topic)
        if len(members) > args.max_group:
            n_split_big += 1
            sub = defaultdict(list)
            for m in members:
                r_ = m["row"]
                ch_ = r_.get("choices") or r_.get("options") or []
                a_ = r_.get("answer")
                a_txt = ch_[a_] if isinstance(a_, int) and 0 <= a_ < len(ch_) else a_
                sig_ = "|".join([norm(r_.get("hint")),
                                ",".join(sorted(norm(c) for c in ch_)),
                                norm(a_txt)])
                sub[md5(sig_, 6)].append(m)
            for h, mm in sub.items():
                groups[(topic, f"{key}_{h}")] = mm
        else:
            groups[(topic, key)] = members
    print(f"[=] Template (grup): {len(groups)} | template raksasa dipecah per hint: {n_split_big}")

    # 3) alokasi grup ke split, distratifikasi per topik
    rng = random.Random(args.seed)
    by_topic = defaultdict(list)
    for (topic, key), members in groups.items():
        by_topic[topic].append((key, members))

    assignment = {}  # template_key -> split
    for topic, glist in sorted(by_topic.items()):
        total = sum(len(m) for _, m in glist)
        targets = [total * r for r in ratios]
        current = [0, 0, 0]
        glist.sort(key=lambda x: x[0])      # urutan deterministik
        rng.shuffle(glist)
        glist.sort(key=lambda x: -len(x[1]))  # grup besar dulu (stabil)
        for key, members in glist:
            deficits = [targets[i] - current[i] for i in range(3)]
            idx = max(range(3), key=lambda i: deficits[i])
            assignment[key] = SPLITS[idx]
            current[idx] += len(members)

    # 4) tulis output
    writers = {s: (out_dir / f"{s}.jsonl").open("w", encoding="utf-8") for s in SPLITS}
    counts = Counter()
    topic_counts = defaultdict(Counter)
    key_to_splits = defaultdict(set)
    with (out_dir / "split_assignment.csv").open("w", newline="", encoding="utf-8-sig") as fc:
        w = csv.writer(fc)
        w.writerow(["new_split", "orig_split", "orig_line", "template_key", "topic", "question"])
        for (topic, key), members in groups.items():
            new_split = assignment[key]
            for m in members:
                r = dict(m["row"])
                img = r.get("image_path") or r.get("image")
                r["orig_split"] = m["orig_split"]
                r["orig_line"] = m["orig_line"]
                r["template_key"] = key
                r["image_path_full"] = f"{m['orig_split']}/{img}" if img else None
                writers[new_split].write(json.dumps(r, ensure_ascii=False) + "\n")
                w.writerow([new_split, m["orig_split"], m["orig_line"], key, topic,
                            r.get("question")])
                counts[new_split] += 1
                topic_counts[topic][new_split] += 1
                key_to_splits[key].add(new_split)
    for f in writers.values():
        f.close()

    # 5) verifikasi
    leaked = [k for k, s in key_to_splits.items() if len(s) > 1]
    total = sum(counts.values())
    print("\n== Ukuran split ==")
    for s in SPLITS:
        print(f"{s}: {counts[s]} ({counts[s] / total:.1%})")
    print("\n== Per topik (train/val/test) ==")
    for t, c in sorted(topic_counts.items(), key=lambda x: -sum(x[1].values())):
        print(f"{t}: {c['train']}/{c['validation']}/{c['test']}")
    print(f"\n[CEK] template di >1 split: {len(leaked)} (harus 0)")
    print(f"[✓] Output: {out_dir.resolve()}")


if __name__ == "__main__":
    main()