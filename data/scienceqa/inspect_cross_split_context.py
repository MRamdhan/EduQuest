
import csv
import hashlib
import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(
    r"C:\Users\ALDI\Documents\EduQuest\dataset\scienceqa\data_with_images"
)
REPORT_DIR = ROOT.parent / "reports"
REPORT_DIR.mkdir(parents=True, exist_ok=True)

SPLITS = ["train", "validation", "test"]

FIELDS = [
    "group_id",
    "splits_in_group",
    "split",
    "source_index",
    "question",
    "choices",
    "answer_index",
    "correct_answer_text",
    "hint",
    "lecture",
    "solution",
    "task",
    "grade",
    "subject",
    "topic",
    "category",
    "skill",
    "image_path",
    "image_sha256",
]

def normalize_question(value):
    return re.sub(r"\s+", " ", str(value or "")).strip().casefold()

def read_jsonl(path, split):
    records = []

    with path.open("r", encoding="utf-8") as file:
        for line_number, line in enumerate(file, start=1):
            if not line.strip():
                continue

            try:
                item = json.loads(line)
            except json.JSONDecodeError as exc:
                print(f"[WARN] JSON rusak: {path}, baris {line_number}: {exc}")
                continue

            item["_split"] = split
            item["_line_number"] = line_number
            records.append(item)

    return records

def get_image_hash(split_dir, image_path):
    if not image_path:
        return ""

    image_file = Path(str(image_path))
    if not image_file.is_absolute():
        image_file = split_dir / image_file

    if not image_file.is_file():
        return ""

    digest = hashlib.sha256()
    with image_file.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)

    return digest.hexdigest()

def stringify(value):
    if value is None:
        return ""
    if isinstance(value, (list, dict)):
        return json.dumps(value, ensure_ascii=False)
    return str(value)

all_records = []
split_dirs = {}

for split in SPLITS:
    split_dir = ROOT / split
    jsonl_path = split_dir / f"scienceqa_{split}.jsonl"

    if not jsonl_path.is_file():
        print(f"[WARN] File tidak ditemukan: {jsonl_path}")
        continue

    split_dirs[split] = split_dir
    records = read_jsonl(jsonl_path, split)
    print(f"{split}: {len(records)} baris dibaca")

    for item in records:
        question = item.get("question", "")
        image_path = item.get("image_path", "")
        image_hash = get_image_hash(split_dir, image_path)

        # Hanya kelompok yang memiliki gambar dan pertanyaan.
        if not normalize_question(question) or not image_hash:
            continue

        item["_image_sha256"] = image_hash
        item["_group_key"] = (
            normalize_question(question),
            image_hash,
        )
        all_records.append(item)

groups = defaultdict(list)
for item in all_records:
    groups[item["_group_key"]].append(item)

cross_split_groups = {
    key: items
    for key, items in groups.items()
    if len({item["_split"] for item in items}) > 1
}

output_path = REPORT_DIR / "cross_split_context_review.csv"

rows_written = 0

with output_path.open("w", newline="", encoding="utf-8-sig") as file:
    writer = csv.DictWriter(file, fieldnames=FIELDS)
    writer.writeheader()

    for group_number, (key, items) in enumerate(
        sorted(cross_split_groups.items(), key=lambda pair: pair[0][0]),
        start=1,
    ):
        splits_in_group = sorted({item["_split"] for item in items})

        for item in sorted(
            items,
            key=lambda row: (row["_split"], row.get("source_index", 0)),
        ):
            choices = item.get("choices", [])
            answer = item.get("answer")
            correct_text = ""

            if isinstance(answer, int) and isinstance(choices, list):
                if 0 <= answer < len(choices):
                    correct_text = choices[answer]

            row = {
                "group_id": f"G{group_number:04d}",
                "splits_in_group": ", ".join(splits_in_group),
                "split": item["_split"],
                "source_index": item.get("source_index", ""),
                "question": item.get("question", ""),
                "choices": stringify(choices),
                "answer_index": answer,
                "correct_answer_text": stringify(correct_text),
                "hint": item.get("hint", ""),
                "lecture": item.get("lecture", ""),
                "solution": item.get("solution", ""),
                "task": item.get("task", ""),
                "grade": item.get("grade", ""),
                "subject": item.get("subject", ""),
                "topic": item.get("topic", ""),
                "category": item.get("category", ""),
                "skill": item.get("skill", ""),
                "image_path": item.get("image_path", ""),
                "image_sha256": item["_image_sha256"],
            }

            writer.writerow({
                field: stringify(row.get(field, ""))
                for field in FIELDS
            })
            rows_written += 1

print("\n=== HASIL AUDIT KONTEKS ===")
print(f"Jumlah kelompok lintas split: {len(cross_split_groups)}")
print(f"Jumlah baris dalam laporan: {rows_written}")
print(f"Laporan tersimpan di:\n{output_path}")
