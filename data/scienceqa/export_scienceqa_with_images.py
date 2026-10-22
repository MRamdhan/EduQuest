
import json
from pathlib import Path
from datasets import load_dataset

OUTPUT_DIR = Path("data_with_images")
IMAGE_DIR_NAME = "images"
SPLITS = ["train", "validation", "test"]

def main():
    print("Memuat dataset ScienceQA dari Hugging Face...")
    dataset = load_dataset("derek-thomas/ScienceQA")

    for split in SPLITS:
        if split not in dataset:
            print(f"Split {split} tidak ditemukan, dilewati.")
            continue

        print(f"\nMemproses split: {split}")

        split_dir = OUTPUT_DIR / split
        image_dir = split_dir / IMAGE_DIR_NAME
        image_dir.mkdir(parents=True, exist_ok=True)

        output_jsonl = split_dir / f"scienceqa_{split}.jsonl"
        total_images = 0
        missing_images = 0

        with output_jsonl.open("w", encoding="utf-8") as out:
            for idx, row in enumerate(dataset[split]):
                image = row.get("image")
                image_path = None

                if image is not None:
                    image_path = image_dir / f"{idx:06d}.png"

                    try:
                        image.save(image_path, format="PNG")
                        image_path = str(
                            Path(IMAGE_DIR_NAME) / image_path.name
                        ).replace("\\", "/")
                        total_images += 1
                    except Exception as exc:
                        print(
                            f"Gagal menyimpan gambar baris {idx}: {exc}"
                        )
                        image_path = None
                        missing_images += 1
                else:
                    missing_images += 1

                record = {
                    "source": "ScienceQA",
                    "source_split": split,
                    "source_index": idx,
                    "image_path": image_path,
                    "question": row.get("question"),
                    "choices": row.get("choices"),
                    "answer": row.get("answer"),
                    "hint": row.get("hint"),
                    "lecture": row.get("lecture"),
                    "solution": row.get("solution"),
                    "task": row.get("task"),
                    "grade": row.get("grade"),
                    "subject": row.get("subject"),
                    "topic": row.get("topic"),
                    "category": row.get("category"),
                    "skill": row.get("skill"),
                }

                out.write(
                    json.dumps(record, ensure_ascii=False) + "\n"
                )

                if (idx + 1) % 1000 == 0:
                    print(f"  Diproses: {idx + 1} soal")

        print("Total soal:", len(dataset[split]))
        print("Gambar berhasil disimpan:", total_images)
        print("Gambar kosong/gagal:", missing_images)
        print("JSONL:", output_jsonl)

    print("\nEkspor selesai.")
    print(f"Semua hasil disimpan di folder: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
