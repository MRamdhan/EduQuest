
import json
from pathlib import Path
from collections import Counter
import hashlib
import re

ROOT = Path("data_with_images")
SPLITS = ["train", "validation", "test"]


def normalize(text):
    text = str(text or "").lower().strip()
    return re.sub(r"\s+", " ", text)


def fingerprint(row):
    # Membandingkan soal beserta pilihan dan jawaban,
    # bukan hanya teks pertanyaannya.
    content = {
        "question": normalize(row.get("question")),
        "choices": [
            normalize(x) for x in (row.get("choices") or [])
        ],
        "answer": row.get("answer"),
        "image_path": row.get("image_path"),
    }
    raw = json.dumps(
        content, ensure_ascii=False, sort_keys=True
    )
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def main():
    for split in SPLITS:
        path = ROOT / split / f"scienceqa_{split}.jsonl"

        total = 0
        empty_question = 0
        empty_choices = 0
        invalid_answer = 0
        missing_solution = 0
        missing_image_file = 0
        duplicate_questions = Counter()
        duplicate_full_records = Counter()
        subjects = Counter()
        grades = Counter()
        examples = []

        with path.open(encoding="utf-8") as f:
            for line_no, line in enumerate(f, start=1):
                row = json.loads(line)
                total += 1

                question = row.get("question")
                choices = row.get("choices")
                answer = row.get("answer")

                if not normalize(question):
                    empty_question += 1

                if not isinstance(choices, list) or len(choices) < 2:
                    empty_choices += 1

                if (
                    not isinstance(choices, list)
                    or not isinstance(answer, int)
                    or isinstance(answer, bool)
                    or answer < 0
                    or answer >= len(choices)
                ):
                    invalid_answer += 1
                    if len(examples) < 5:
                        examples.append(
                            f"Jawaban/pilihan tidak valid, "
                            f"baris {line_no}: {question}"
                        )

                if not normalize(row.get("solution")):
                    missing_solution += 1

                image_path = row.get("image_path")
                if image_path:
                    full_path = path.parent / image_path
                    if not full_path.is_file():
                        missing_image_file += 1

                duplicate_questions[normalize(question)] += 1
                duplicate_full_records[fingerprint(row)] += 1

                subjects[str(row.get("subject") or "(kosong)")] += 1
                grades[str(row.get("grade") or "(kosong)")] += 1

        repeated_question_groups = sum(
            1 for q, count in duplicate_questions.items()
            if q and count > 1
        )
        repeated_question_extra = sum(
            count - 1 for q, count in duplicate_questions.items()
            if q and count > 1
        )
        repeated_full_extra = sum(
            count - 1 for count in duplicate_full_records.values()
            if count > 1
        )

        print("\n" + "=" * 55)
        print("SPLIT:", split.upper())
        print("=" * 55)
        print("Total soal:", total)
        print("Pertanyaan kosong:", empty_question)
        print("Pilihan tidak valid/kosong:", empty_choices)
        print("Indeks jawaban tidak valid:", invalid_answer)
        print("Solution kosong:", missing_solution)
        print("Referensi gambar tidak ditemukan:", missing_image_file)
        print("Grup pertanyaan berulang:", repeated_question_groups)
        print("Soal tambahan dengan pertanyaan berulang:",
              repeated_question_extra)
        print("Duplikat lengkap tambahan:", repeated_full_extra)

        print("\nDistribusi subject:")
        for name, count in subjects.most_common():
            print(f"  {name}: {count}")

        print("\nDistribusi grade:")
        for name, count in sorted(grades.items()):
            print(f"  {name}: {count}")

        if examples:
            print("\nContoh masalah:")
            for example in examples:
                print("-", example)


if __name__ == "__main__":
    main()
