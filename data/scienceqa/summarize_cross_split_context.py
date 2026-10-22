
import pandas as pd
from pathlib import Path

root = Path(
    r"C:\Users\ALDI\Documents\EduQuest\dataset\scienceqa"
)
source = root / "reports" / "cross_split_context_review.csv"
output = root / "reports" / "cross_split_group_summary.csv"

df = pd.read_csv(source).fillna("")
rows = []

for group_id, group in df.groupby("group_id", sort=True):
    def unique_values(column):
        values = [
            str(value).strip()
            for value in group[column]
            if str(value).strip()
        ]
        return list(dict.fromkeys(values))

    choices = unique_values("choices")
    answers = unique_values("correct_answer_text")
    hints = unique_values("hint")
    solutions = unique_values("solution")
    grades = unique_values("grade")
    splits = unique_values("split")

    rows.append({
        "group_id": group_id,
        "question": group["question"].iloc[0],
        "splits": ", ".join(splits),
        "jumlah_baris": len(group),
        "jumlah_variasi_pilihan": len(choices),
        "jumlah_variasi_jawaban": len(answers),
        "jumlah_variasi_hint": len(hints),
        "jumlah_variasi_solution": len(solutions),
        "jumlah_variasi_grade": len(grades),
        "pilihan": " || ".join(choices),
        "jawaban_benar": " || ".join(answers),
        "hint": " || ".join(hints),
        "solution": " || ".join(solutions),
        "grade": " || ".join(grades),
    })

summary = pd.DataFrame(rows)

# Prioritaskan kelompok yang muncul di ketiga split,
# lalu kelompok dengan variasi jawaban dan pilihan terbanyak.
summary["_jumlah_split"] = summary["splits"].apply(
    lambda value: len(value.split(", ")) if value else 0
)

summary = summary.sort_values(
    by=[
        "_jumlah_split",
        "jumlah_variasi_jawaban",
        "jumlah_variasi_pilihan",
    ],
    ascending=[False, False, False],
)

summary.drop(columns=["_jumlah_split"]).to_csv(
    output, index=False, encoding="utf-8-sig"
)

print(f"Total kelompok: {len(summary)}")
print(f"Laporan ringkasan: {output}")
print("Prioritas pemeriksaan: kelompok yang muncul di semua split.")
