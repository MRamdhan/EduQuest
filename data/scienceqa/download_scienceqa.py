
from datasets import load_dataset
from pathlib import Path
import pandas as pd
import json

OUTPUT_DIR = Path("data")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("Mengunduh dataset ScienceQA...")
dataset = load_dataset("derek-thomas/ScienceQA")

# Simpan setiap split secara terpisah.
# Kolom image tidak disertakan karena kita fokus pada data teks.
columns = [
    "question",
    "choices",
    "answer",
    "hint",
    "task",
    "grade",
    "subject",
    "topic",
    "category",
    "skill",
    "lecture",
    "solution",
]

for split_name, split_data in dataset.items():
    available = [
        col for col in columns
        if col in split_data.column_names
    ]

    df = split_data.select_columns(available).to_pandas()

    csv_path = OUTPUT_DIR / f"scienceqa_{split_name}.csv"
    jsonl_path = OUTPUT_DIR / f"scienceqa_{split_name}.jsonl"

    df.to_csv(csv_path, index=False, encoding="utf-8-sig")

    with open(jsonl_path, "w", encoding="utf-8") as f:
        for row in df.to_dict(orient="records"):
            f.write(
                json.dumps(row, ensure_ascii=False, default=str)
                + "\n"
            )

    print(f"\nSplit: {split_name}")
    print(f"Jumlah soal: {len(df)}")
    print(f"CSV: {csv_path}")
    print(f"JSONL: {jsonl_path}")

print("\nPengunduhan dan ekspor selesai.")