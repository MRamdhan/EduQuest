
import json
import math
from pathlib import Path
from collections import Counter

DATA_DIR = Path("data_fixed")
SPLITS = ["train", "validation", "test"]


def is_missing(value):
    if value is None:
        return True
    if isinstance(value, float) and math.isnan(value):
        return True
    if isinstance(value, str) and value.strip().lower() in {
        "", "nan", "none", "null"
    }:
        return True
    return False


def main():
    for split in SPLITS:
        path = DATA_DIR / f"scienceqa_{split}.jsonl"

        if not path.exists():
            print(f"\nFile tidak ditemukan: {path}")
            continue

        total = 0
        empty_questions = 0
        invalid_choices = 0
        invalid_answers = 0
        missing_solutions = 0
        malformed_rows = 0

        question_counts = Counter()
        subject_counts = Counter()
        grade_counts = Counter()

        with path.open(encoding="utf-8") as file:
            for line_number, line in enumerate(file, start=1):
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    malformed_rows += 1
                    continue

                total += 1

                question = row.get("question")
                choices = row.get("choices")
                answer = row.get("answer")
                solution = row.get("solution")

                if is_missing(question):
                    empty_questions += 1
                else:
                    normalized = " ".join(str(question).lower().split())
                    question_counts[normalized] += 1

                if (
                    not isinstance(choices, list)
                    or len(choices) == 0
                    or any(is_missing(c) for c in choices)
                ):
                    invalid_choices += 1

                # Jawaban ScienceQA biasanya indeks numerik mulai dari 0.
                valid_answer = (
                    isinstance(answer, int)
                    and not isinstance(answer, bool)
                    and isinstance(choices, list)
                    and 0 <= answer < len(choices)
                )

                if not valid_answer:
                    invalid_answers += 1

                if is_missing(solution):
                    missing_solutions += 1

                if not is_missing(row.get("subject")):
                    subject_counts[str(row["subject"])] += 1

                if not is_missing(row.get("grade")):
                    grade_counts[str(row["grade"])] += 1

        duplicate_questions = sum(
            count - 1
            for count in question_counts.values()
            if count > 1
        )

        print(f"\n{'=' * 45}")
        print(f"SPLIT: {split.upper()}")
        print(f"{'=' * 45}")
        print(f"Total baris                 : {total}")
        print(f"Baris JSON rusak            : {malformed_rows}")
        print(f"Pertanyaan kosong           : {empty_questions}")
        print(f"Pilihan jawaban tidak valid : {invalid_choices}")
        print(f"Indeks jawaban tidak valid  : {invalid_answers}")
        print(f"Solusi kosong               : {missing_solutions}")
        print(f"Duplikasi pertanyaan        : {duplicate_questions}")
        print(f"Distribusi mata pelajaran   : {dict(subject_counts)}")
        print(f"Distribusi kelas             : {dict(grade_counts)}")

    print("\nPemeriksaan selesai. Tidak ada file dataset yang diubah.")


if __name__ == "__main__":
    main()
