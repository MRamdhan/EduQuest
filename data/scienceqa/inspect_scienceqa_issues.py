
import json
from pathlib import Path
from collections import defaultdict

DATA_FILE = Path("data_fixed/scienceqa_train.jsonl")


def normalize_question(value):
    return " ".join(str(value or "").lower().split())


def main():
    groups = defaultdict(list)
    invalid_rows = []

    with DATA_FILE.open(encoding="utf-8") as file:
        for line_no, line in enumerate(file, start=1):
            row = json.loads(line)

            question = row.get("question", "")
            choices = row.get("choices")
            answer = row.get("answer")

            groups[normalize_question(question)].append({
                "line": line_no,
                "question": question,
                "choices": choices,
                "answer": answer,
                "grade": row.get("grade"),
                "subject": row.get("subject"),
                "topic": row.get("topic"),
                "solution": row.get("solution"),
            })

            valid_choices = (
                isinstance(choices, list)
                and len(choices) > 0
                and all(
                    isinstance(c, str) and c.strip()
                    for c in choices
                )
            )

            valid_answer = (
                isinstance(answer, int)
                and not isinstance(answer, bool)
                and isinstance(choices, list)
                and 0 <= answer < len(choices)
            )

            if not valid_choices or not valid_answer:
                invalid_rows.append({
                    "line": line_no,
                    "question": question,
                    "choices": choices,
                    "answer": answer,
                })

    print("=" * 55)
    print("SOAL DENGAN PILIHAN/JAWABAN TIDAK VALID")
    print("=" * 55)

    if not invalid_rows:
        print("Tidak ditemukan.")
    else:
        for row in invalid_rows[:10]:
            print(json.dumps(row, ensure_ascii=False, indent=2))

    duplicate_groups = [
        items for question, items in groups.items()
        if question and len(items) > 1
    ]

    duplicate_groups.sort(key=len, reverse=True)

    print("\n" + "=" * 55)
    print("CONTOH KELOMPOK PERTANYAAN DUPLIKAT")
    print("=" * 55)
    print("Jumlah kelompok pertanyaan berulang:", len(duplicate_groups))

    for index, items in enumerate(duplicate_groups[:10], start=1):
        print(f"\nKelompok {index}: muncul {len(items)} kali")

        for row in items[:4]:
            print(json.dumps({
                "baris": row["line"],
                "question": row["question"],
                "choices": row["choices"],
                "answer": row["answer"],
                "grade": row["grade"],
                "subject": row["subject"],
                "topic": row["topic"],
            }, ensure_ascii=False))

    print("\nPemeriksaan selesai. File sumber tidak diubah.")


if __name__ == "__main__":
    main()
