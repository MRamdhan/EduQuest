
import json
import hashlib
from pathlib import Path
from collections import defaultdict

ROOT = Path(
    r"C:\Users\ALDI\Documents\EduQuest\dataset\scienceqa\data_with_images"
)

TARGET = "Select the fish below."
groups = defaultdict(list)

for split in ["train", "validation", "test"]:
    jsonl_path = ROOT / split / f"scienceqa_{split}.jsonl"

    if not jsonl_path.exists():
        print(f"[TIDAK DITEMUKAN] {jsonl_path}")
        continue

    with jsonl_path.open("r", encoding="utf-8") as f:
        for line_number, line in enumerate(f, start=1):
            row = json.loads(line)

            if row.get("question", "").strip().casefold() != TARGET.casefold():
                continue

            image_path = row.get("image_path")
            image_hash = None

            if image_path:
                full_image_path = ROOT / split / image_path

                if full_image_path.is_file():
                    image_hash = hashlib.sha256(
                        full_image_path.read_bytes()
                    ).hexdigest()

            choices = row.get("choices", [])
            answer = row.get("answer")
            correct_text = None

            if isinstance(choices, list) and isinstance(answer, int):
                if 0 <= answer < len(choices):
                    correct_text = choices[answer]

            key = image_hash if image_hash else f"NO_IMAGE_{split}_{line_number}"

            groups[key].append({
                "split": split,
                "line": line_number,
                "image_path": image_path,
                "question": row.get("question"),
                "choices": choices,
                "answer_index": answer,
                "correct_text": correct_text,
            })

for image_hash, rows in groups.items():
    splits = {r["split"] for r in rows}

    if len(splits) < 2 or image_hash.startswith("NO_IMAGE_"):
        continue

    print("\n" + "=" * 65)
    print("HASH GAMBAR:", image_hash[:20])
    print("JUMLAH ENTRI:", len(rows))
    print("SPLIT:", ", ".join(sorted(splits)))

    for r in rows:
        print(f"\n[{r['split'].upper()} | baris {r['line']}]")
        print("Gambar:", r["image_path"])
        print("Pilihan:", json.dumps(r["choices"], ensure_ascii=False))
        print("Indeks jawaban:", r["answer_index"])
        print("Jawaban benar:", r["correct_text"])

print("\nPemeriksaan selesai. Dataset sumber tidak diubah.")
