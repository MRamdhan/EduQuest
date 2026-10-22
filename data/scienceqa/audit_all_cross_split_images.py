
import json
import hashlib
import pandas as pd
from pathlib import Path
from collections import defaultdict

ROOT = Path(
    r"C:\Users\ALDI\Documents\EduQuest\dataset\scienceqa\data_with_images"
)
REPORTS = ROOT.parent / "reports"
REPORTS.mkdir(parents=True, exist_ok=True)

groups = defaultdict(list)

for split in ["train", "validation", "test"]:
    jsonl_path = ROOT / split / f"scienceqa_{split}.jsonl"

    with jsonl_path.open("r", encoding="utf-8") as f:
        for line_number, line in enumerate(f, start=1):
            row = json.loads(line)
            image_path = row.get("image_path")

            if not image_path:
                continue

            full_path = ROOT / split / image_path
            if not full_path.is_file():
                continue

            image_hash = hashlib.sha256(
                full_path.read_bytes()
            ).hexdigest()

            question = " ".join(
                row.get("question", "").casefold().split()
            )

            choices = row.get("choices", [])
            answer = row.get("answer")
            correct_text = None

            if isinstance(choices, list) and isinstance(answer, int):
                if 0 <= answer < len(choices):
                    correct_text = choices[answer]

            key = (question, image_hash)
            groups[key].append({
                "split": split,
                "line": line_number,
                "question": row.get("question"),
                "image_hash": image_hash,
                "image_path": image_path,
                "choices": json.dumps(choices, ensure_ascii=False),
                "answer_index": answer,
                "correct_answer": correct_text,
            })

results = []

for (question_norm, image_hash), rows in groups.items():
    splits = sorted({r["split"] for r in rows})

    if len(splits) < 2:
        continue

    answer_texts = {
        r["correct_answer"] for r in rows
        if r["correct_answer"] is not None
    }
    choice_sets = {r["choices"] for r in rows}

    for r in rows:
        results.append({
            **r,
            "splits": ", ".join(splits),
            "split_count": len(splits),
            "entry_count": len(rows),
            "distinct_choice_sets": len(choice_sets),
            "distinct_correct_answers": len(answer_texts),
            "answer_conflict": len(answer_texts) > 1,
        })

out = REPORTS / "cross_split_image_details.csv"
pd.DataFrame(results).to_csv(out, index=False, encoding="utf-8-sig")

print("Jumlah grup lintas-split:", sum(
    1 for rows in groups.values()
    if len({r["split"] for r in rows}) > 1
))
print("Jumlah entri untuk ditinjau:", len(results))
print("Entri dengan variasi jawaban benar:", sum(
    1 for r in results if r["answer_conflict"]
))
print("Laporan tersimpan:", out)
print("Dataset asli tidak diubah.")
