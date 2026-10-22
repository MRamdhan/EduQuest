
import json
from pathlib import Path
from collections import Counter
from PIL import Image

ROOT = Path("data_with_images")
SPLITS = ["train", "validation", "test"]

def main():
    grand_total = 0
    grand_null = 0
    grand_missing = 0
    grand_valid = 0
    grand_corrupt = 0

    for split in SPLITS:
        folder = ROOT / split
        jsonl_path = folder / f"scienceqa_{split}.jsonl"

        total = 0
        null_image = 0
        missing_file = 0
        valid_image = 0
        corrupt_image = 0
        examples = []

        with jsonl_path.open(encoding="utf-8") as f:
            for line_no, line in enumerate(f, start=1):
                row = json.loads(line)
                total += 1
                relative_path = row.get("image_path")

                if not relative_path:
                    null_image += 1
                    continue

                image_path = folder / relative_path

                if not image_path.is_file():
                    missing_file += 1
                    if len(examples) < 5:
                        examples.append(
                            f"File tidak ditemukan: baris {line_no}: {image_path}"
                        )
                    continue

                try:
                    with Image.open(image_path) as img:
                        img.verify()
                    valid_image += 1
                except Exception as exc:
                    corrupt_image += 1
                    if len(examples) < 5:
                        examples.append(
                            f"Gambar rusak: baris {line_no}: {exc}"
                        )

        print("\n" + "=" * 45)
        print("SPLIT:", split.upper())
        print("=" * 45)
        print("Total soal:", total)
        print("image_path null:", null_image)
        print("File gambar tidak ditemukan:", missing_file)
        print("Gambar valid:", valid_image)
        print("Gambar rusak/tidak terbaca:", corrupt_image)

        for example in examples:
            print("-", example)

        grand_total += total
        grand_null += null_image
        grand_missing += missing_file
        grand_valid += valid_image
        grand_corrupt += corrupt_image

    print("\n" + "=" * 45)
    print("RINGKASAN TOTAL")
    print("=" * 45)
    print("Total soal:", grand_total)
    print("image_path null:", grand_null)
    print("File tidak ditemukan:", grand_missing)
    print("Gambar valid:", grand_valid)
    print("Gambar rusak:", grand_corrupt)

if __name__ == "__main__":
    main()
