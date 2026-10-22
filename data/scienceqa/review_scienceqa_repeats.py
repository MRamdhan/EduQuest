
import csv
import json
import re
import hashlib
from pathlib import Path
from collections import defaultdict

ROOT = Path("data_with_images")
SPLITS = ["train", "validation", "test"]
OUTPUT = Path("reports")
OUTPUT_FILE = OUTPUT / "repeated_questions_review.csv"


def normalize(value):
    return re.sub(r"\s+", " ", str(value or "").strip().lower())


def image_hash(folder, image_path):
    if not image_path:
        return ""

    path = folder / image_path
    if not path.is_file():
        return ""

    digest = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            digest.update(chunk)

    return digest.hexdigest()


def main():
    groups = defaultdict(list)

    for split in SPLITS:
        folder = ROOT / split
        jsonl_path = folder / f"scienceqa_{split}.jsonl"

        with jsonl_path.open(encoding="utf-8") as f:
            for line_no, line in enumerate(f, start=1):
                row = json.loads(line)
                question = normalize(row.get("question"))

                if not question:
                    continue

                choices = row.get("choices") or []
                normalized_choices = [normalize(x) for x in choices]

                groups[question].append({
                    "split": split,
                    "line_no": line_no,
                    "question": row.get("question", ""),
                    "choices": choices,
                    "normalized_choices": normalized_choices,
                    "answer": row.get("answer"),
                    "image_path": row.get("image_path") or "",
                    "image_hash": image_hash(
                        folder, row.get("image_path")
                    ),
                    "subject": row.get("subject", ""),
                    "grade": row.get("grade", ""),
                    "topic": row.get("topic", ""),
                    "skill": row.get("skill", ""),
                })

    OUTPUT.mkdir(parents=True, exist_ok=True)

    fields = [
        "question_group_size",
        "split",
        "line_no",
        "question",
        "choices_json",
        "answer_index",
        "image_path",
        "image_hash",
        "subject",
        "grade",
        "topic",
        "skill",
        "same_choices_and_answer",
        "same_image_hash",
        "cross_split_group",
    ]

    repeated_groups = {
        q: rows for q, rows in groups.items() if len(rows) > 1
    }

    with OUTPUT_FILE.open(
        "w", encoding="utf-8-sig", newline=""
    ) as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()

        for question, rows in sorted(
            repeated_groups.items(),
            key=lambda item: (-len(item[1]), item[0])
        ):
            for row in rows:
                same_choices_answer = any(
                    other["normalized_choices"]
                    == row["normalized_choices"]
                    and other["answer"] == row["answer"]
                    for other in rows
                    if other is not row
                )

                same_image = bool(row["image_hash"]) and any(
                    other["image_hash"] == row["image_hash"]
                    for other in rows
                    if other is not row
                )

                splits = {other["split"] for other in rows}

                writer.writerow({
                    "question_group_size": len(rows),
                    "split": row["split"],
                    "line_no": row["line_no"],
                    "question": row["question"],
                    "choices_json": json.dumps(
                        row["choices"], ensure_ascii=False
                    ),
                    "answer_index": row["answer"],
                    "image_path": row["image_path"],
                    "image_hash": row["image_hash"],
                    "subject": row["subject"],
                    "grade": row["grade"],
                    "topic": row["topic"],
                    "skill": row["skill"],
                    "same_choices_and_answer": same_choices_answer,
                    "same_image_hash": same_image,
                    "cross_split_group": len(splits) > 1,
                })

    cross_split = sum(
        1 for rows in repeated_groups.values()
        if len({row["split"] for row in rows}) > 1
    )

    print("Audit pengulangan selesai.")
    print("Jumlah grup pertanyaan berulang:", len(repeated_groups))
    print("Grup yang muncul di beberapa split:", cross_split)
    print("File laporan:", OUTPUT_FILE.resolve())
    print("Dataset asli tidak diubah.")


if __name__ == "__main__":
    main()
