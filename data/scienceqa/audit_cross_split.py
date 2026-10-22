
import pandas as pd
from pathlib import Path

SOURCE = Path("reports/repeated_questions_review.csv")
OUTPUT = Path("reports/cross_split_same_image.csv")

df = pd.read_csv(SOURCE, dtype=str).fillna("")

# Normalisasi teks pertanyaan.
df["question_norm"] = (
    df["question"]
    .str.lower()
    .str.strip()
    .str.replace(r"\s+", " ", regex=True)
)

# Hash kosong tidak bisa dipakai untuk membuktikan
# bahwa dua soal menggunakan gambar yang sama.
df = df[df["image_hash"].str.strip() != ""].copy()

# Cari kombinasi pertanyaan dan hash gambar yang muncul
# pada lebih dari satu split.
keys = ["question_norm", "image_hash"]
split_counts = df.groupby(keys)["split"].nunique()
shared_keys = split_counts[split_counts > 1].index

mask = pd.MultiIndex.from_frame(df[keys]).isin(shared_keys)
result = df.loc[mask].copy()

if not result.empty:
    result["cross_split_count"] = result.groupby(
        keys
    )["split"].transform("nunique")

    result = result.sort_values(
        ["cross_split_count", "question"],
        ascending=[False, True]
    )

    columns = [
        "question",
        "split",
        "line_no",
        "choices_json",
        "answer_index",
        "image_path",
        "image_hash",
        "subject",
        "grade",
        "topic",
        "skill",
        "cross_split_count",
    ]

    result[columns].to_csv(
        OUTPUT, index=False, encoding="utf-8-sig"
    )

print("Jumlah baris yang perlu ditinjau:", len(result))
print(
    "Jumlah kombinasi pertanyaan + gambar:",
    result[keys].drop_duplicates().shape[0]
)
print("File laporan:", OUTPUT.resolve())
print("Dataset asli tidak diubah.")
