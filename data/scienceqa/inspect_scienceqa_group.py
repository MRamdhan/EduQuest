
import json
from pathlib import Path

ROOT = Path(r"C:\Users\ALDI\Documents\EduQuest\dataset\scienceqa\data_with_images")

TARGET_QUESTION = "Select the fish below."

for split in ["train", "validation", "test"]:
    path = ROOT / split / f"scienceqa_{split}.jsonl"

    if not path.exists():
        print(f"[FILE TIDAK DITEMUKAN] {path}")
        continue

    with path.open("r", encoding="utf-8") as f:
        for line_number, line in enumerate(f, start=1):
            row = json.loads(line)

            if row.get("question", "").strip() == TARGET_QUESTION:
                choices = row.get("choices", [])
                answer = row.get("answer")

                print(f"\n--- {split.upper()} | baris {line_number} ---")
                print("Pertanyaan:", row.get("question"))
                print("Gambar:", row.get("image_path"))
                print("Pilihan:", json.dumps(
                    choices, ensure_ascii=False
                ))
                print("Indeks jawaban:", answer)

                if isinstance(answer, int) and 0 <= answer < len(choices):
                    print("Jawaban benar:", choices[answer])
                else:
                    print("Jawaban benar: indeks tidak valid")
