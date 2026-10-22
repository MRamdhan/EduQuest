"""
EduQuest - pengunduh dataset soal AI2 ARC (ARC-Easy)
Jalankan di komputer yang terhubung ke internet.

Instalasi:
    python -m pip install -U datasets pandas pyarrow

Jalankan:
    python download_ai2_arc.py

Output:
    data/ai2_arc_easy_train.csv
    data/ai2_arc_easy_train.jsonl

Catatan:
- Dataset asli berbahasa Inggris dan berfokus pada sains tingkat sekolah.
- Gunakan sebagai data eksperimen/referensi, bukan pengganti materi kurikulum Indonesia.
- Lisensi dataset di Hugging Face tercantum CC BY-SA 4.0; periksa syarat atribusi dan berbagi serupa sebelum redistribusi.
"""
from pathlib import Path
import json
import pandas as pd
from datasets import load_dataset

OUT = Path("data")
OUT.mkdir(parents=True, exist_ok=True)

def main():
    print("Mengunduh AI2 ARC / ARC-Easy / train dari Hugging Face...")
    ds = load_dataset("allenai/ai2_arc", "ARC-Easy", split="train")

    rows = []
    for item in ds:
        choices = item.get("choices", {})
        labels = choices.get("label", [])
        texts = choices.get("text", [])
        options = {}
        for label, text in zip(labels, texts):
            options[str(label)] = str(text)

        rows.append({
            "source": "AI2 ARC",
            "source_id": item.get("id", ""),
            "language": "en",
            "subject": "Science",
            "question": item.get("question", ""),
            "options_json": json.dumps(options, ensure_ascii=False),
            "answer_key": item.get("answerKey", ""),
        })

    df = pd.DataFrame(rows)
    csv_path = OUT / "ai2_arc_easy_train.csv"
    jsonl_path = OUT / "ai2_arc_easy_train.jsonl"
    df.to_csv(csv_path, index=False, encoding="utf-8-sig")
    with jsonl_path.open("w", encoding="utf-8") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    print(f"Selesai. Jumlah baris: {len(df)}")
    print(f"CSV:   {csv_path.resolve()}")
    print(f"JSONL: {jsonl_path.resolve()}")

if __name__ == "__main__":
    main()
