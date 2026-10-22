
from datasets import load_dataset, Image
from pathlib import Path
import csv
import json

# ==========================================
# KONFIGURASI
# ==========================================

DATASET_NAME = "derek-thomas/ScienceQA"
OUTPUT_DIR = Path("data_fixed")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

COLUMNS = [
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


def convert_value(value):
    """Ubah nilai dataset menjadi tipe yang aman untuk JSON."""
    if hasattr(value, "tolist"):
        return value.tolist()

    if isinstance(value, tuple):
        return list(value)

    return value


def main():
    print("Memuat dataset ScienceQA...")

    # Memuat dataset dari cache atau Hugging Face Hub.
    dataset = load_dataset(DATASET_NAME)

    print("Dataset berhasil dimuat.")

    for split_name in dataset:
        split_data = dataset[split_name]

        # Matikan decoding gambar bila kolom image tersedia.
        # Kita hanya membutuhkan data teks untuk saat ini.
        if "image" in split_data.column_names:
            split_data = split_data.cast_column(
                "image",
                Image(decode=False)
            )

        available_columns = [
            column
            for column in COLUMNS
            if column in split_data.column_names
        ]

        if "question" not in available_columns:
            print(
                f"PERINGATAN: kolom question tidak ditemukan "
                f"pada split {split_name}. Split dilewati."
            )
            continue

        csv_path = OUTPUT_DIR / f"scienceqa_{split_name}.csv"
        jsonl_path = OUTPUT_DIR / f"scienceqa_{split_name}.jsonl"

        print(f"\nMengekspor split: {split_name}")
        print(f"Jumlah data: {len(split_data)}")

        with open(
            csv_path,
            "w",
            encoding="utf-8-sig",
            newline=""
        ) as csv_file, open(
            jsonl_path,
            "w",
            encoding="utf-8"
        ) as jsonl_file:

            writer = csv.DictWriter(
                csv_file,
                fieldnames=available_columns
            )
            writer.writeheader()

            # Akses kolom teks saja untuk menghindari decoding gambar.
            text_data = split_data.select_columns(
                available_columns
            )

            for row in text_data:
                record = {}

                for column in available_columns:
                    value = convert_value(row[column])

                    if column == "choices" and value is not None:
                        # Pastikan pilihan jawaban berupa list,
                        # bukan string representasi list.
                        if isinstance(value, str):
                            try:
                                parsed = json.loads(value)
                                if isinstance(parsed, list):
                                    value = parsed
                            except json.JSONDecodeError:
                                pass

                        if not isinstance(value, list):
                            raise ValueError(
                                "Format choices bukan list pada "
                                f"split {split_name}. "
                                f"Nilai: {value!r}"
                            )

                    record[column] = value

                # CSV: choices disimpan sebagai JSON array string.
                csv_record = record.copy()

                if isinstance(csv_record.get("choices"), list):
                    csv_record["choices"] = json.dumps(
                        csv_record["choices"],
                        ensure_ascii=False
                    )

                writer.writerow(csv_record)

                # JSONL: choices tetap berupa array JSON.
                jsonl_file.write(
                    json.dumps(
                        record,
                        ensure_ascii=False,
                        default=str
                    ) + "\n"
                )

        print(f"CSV  : {csv_path}")
        print(f"JSONL: {jsonl_path}")

    print("\nEkspor selesai.")
    print(f"Lokasi hasil: {OUTPUT_DIR.resolve()}")


if __name__ == "__main__":
    main()
