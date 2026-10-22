
import json
from pathlib import Path
import pandas as pd

SOURCE = Path("reports/cross_split_same_image.csv")
OUT_DIR = Path("reports")

def parse_choices(value):
    try:
        result = json.loads(value)
        return result if isinstance(result, list) else []
    except (json.JSONDecodeError, TypeError):
        return []

def get_correct_answer(row):
    choices = parse_choices(row["choices_json"])

    try:
        index = int(row["answer_index"])
    except (ValueError, TypeError):
        return ""

    if 0 <= index < len(choices):
        return str(choices[index]).strip().lower()

    return ""

def main():
    df = pd.read_csv(SOURCE, dtype=str).fillna("")

    required = {
        "question", "split", "choices_json",
        "answer_index", "image_hash"
    }
    missing = required - set(df.columns)

    if missing:
        raise ValueError(
            f"Kolom tidak ditemukan dalam CSV: {sorted(missing)}"
        )

    df["correct_answer_text"] = df.apply(get_correct_answer, axis=1)
    df["choices_normalized"] = df["choices_json"].apply(
        lambda x: json.dumps(
            parse_choices(x),
            ensure_ascii=False,
            sort_keys=True
        )
    )

    keys = ["question", "image_hash"]
    summaries = []

    for (question, image_hash), group in df.groupby(keys, dropna=False):
        splits = sorted(group["split"].unique())
        answers = sorted(set(group["correct_answer_text"]) - {""})
        choice_sets = group["choices_normalized"].nunique()

        summaries.append({
            "question": question,
            "image_hash": image_hash,
            "splits": ", ".join(splits),
            "split_count": len(splits),
            "rows": len(group),
            "distinct_choice_sets": choice_sets,
            "distinct_correct_answer_texts": len(answers),
            "correct_answer_texts": " | ".join(answers),
            "needs_review": (
                len(answers) > 1 or choice_sets > 1
            ),
        })

    summary = pd.DataFrame(summaries)
    summary = summary.sort_values(
        ["needs_review", "split_count", "rows"],
        ascending=[False, False, False]
    )

    summary_path = OUT_DIR / "cross_split_summary.csv"
    review_path = OUT_DIR / "cross_split_needs_review.csv"

    summary.to_csv(
        summary_path, index=False, encoding="utf-8-sig"
    )

    summary[summary["needs_review"]].to_csv(
        review_path, index=False, encoding="utf-8-sig"
    )

    print("Jumlah grup pertanyaan + gambar:", len(summary))
    print(
        "Grup dengan pilihan atau jawaban benar berbeda:",
        int(summary["needs_review"].sum())
    )
    print(
        "Grup dengan teks jawaban benar berbeda:",
        int((summary["distinct_correct_answer_texts"] > 1).sum())
    )
    print("Ringkasan lengkap:", summary_path.resolve())
    print("Grup prioritas ditinjau:", review_path.resolve())
    print("Tidak ada data sumber yang diubah.")

if __name__ == "__main__":
    main()
