
import json
from pathlib import Path
from collections import Counter

DATA_DIR = Path("data_fixed")
SPLITS = ["train", "validation", "test"]

def main():
    for split in SPLITS:
        path = DATA_DIR / f"scienceqa_{split}.jsonl"

        print("\n" + "=" * 55)
        print(f"PEMERIKSAAN {split.upper()}")
        print("=" * 55)

        if not path.exists():
            print(f"File tidak ditemukan: {path}")
            continue

        total = 0
        image_present = 0
        image_missing = 0
        solution_present = 0
        context_present = 0
        choices_count = Counter()
        subjects = Counter()
        grades = Counter()
        samples = []

        with path.open("r", encoding="utf-8") as f:
            for line in f:
                row = json.loads(line)
                total += 1

                image = row.get("image")
                if image:
                    image_present += 1
                else:
                    image_missing += 1

                if str(row.get("solution") or "").strip():
                    solution_present += 1

                if str(row.get("hint") or "").strip() or \
                   str(row.get("lecture") or "").strip():
                    context_present += 1

                choices = row.get("choices")
                if isinstance(choices, list):
                    choices_count[len(choices)] += 1
                else:
                    choices_count["bukan list"] += 1

                subjects[str(row.get("subject") or "kosong")] += 1
                grades[str(row.get("grade") or "kosong")] += 1

                if len(samples) < 2:
                    samples.append({
                        "question": row.get("question"),
                        "image": image,
                        "choices": choices,
                        "answer": row.get("answer"),
                        "solution": row.get("solution"),
                        "hint": row.get("hint"),
                        "lecture": row.get("lecture"),
                    })

        print("Total data:", total)
        print("Data dengan image:", image_present)
        print("Data tanpa image:", image_missing)
        print("Data dengan solution:", solution_present)
        print("Data dengan hint/lecture:", context_present)
        print("Jumlah pilihan per soal:", dict(choices_count))
        print("Mata pelajaran:", dict(subjects))
        print("Kelas:", dict(grades))
        print("Contoh data:")
        for sample in samples:
            print(json.dumps(sample, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
