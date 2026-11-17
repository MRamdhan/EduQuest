"""Pembuatan soal dari baris CSV (dipakai impor massal di Django Admin).

Semua baris divalidasi lebih dulu; jika ada satu saja yang salah, tidak ada
soal yang disimpan, sehingga admin dapat memperbaiki file lalu mengunggah ulang.
"""

from __future__ import annotations

import csv
import io
import uuid
from dataclasses import dataclass, field

from django.core.exceptions import ValidationError
from django.db import transaction

from apps.learning.models import Question, Subject

OPTION_KEYS = ["A", "B", "C", "D", "E"]
MAX_ROWS = 500
MAX_BYTES = 1_000_000

CSV_COLUMNS = [
    "jenjang",
    "mapel",
    "kelas",
    "topic_code",
    "topic",
    "difficulty",
    "question_text",
    "option_a",
    "option_b",
    "option_c",
    "option_d",
    "option_e",
    "correct",
    "explanation",
    "hint",
]

SAMPLE_ROW = {
    "jenjang": "SMA",
    "mapel": "Biologi",
    "kelas": "11",
    "topic_code": "SMA-BIO-09",
    "topic": "Sistem Gerak dan Pernapasan Manusia",
    "difficulty": "1",
    "question_text": "Nutrien yang sangat penting dalam pembentukan tulang adalah ....",
    "option_a": "karbohidrat dan lemak",
    "option_b": "kalsium dan vitamin D",
    "option_c": "protein dan vitamin C",
    "option_d": "besi dan vitamin A",
    "option_e": "",
    "correct": "B",
    "explanation": "Kalsium dan vitamin D dibutuhkan untuk pembentukan tulang.",
    "hint": "",
}


def csv_template(material=None) -> str:
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=CSV_COLUMNS)
    writer.writeheader()
    row = dict(SAMPLE_ROW)
    if material is not None:
        # Kolom konteks dikosongkan supaya diisi otomatis dari materi.
        for column in ("jenjang", "mapel", "kelas", "topic_code", "topic"):
            row[column] = ""
    writer.writerow(row)
    return buffer.getvalue()


def new_source_id() -> str:
    return f"admin-{uuid.uuid4().hex[:12]}"


def build_options(texts: dict[str, str]) -> list[dict]:
    """Ubah {"A": "...", "B": "..."} menjadi daftar opsi tanpa opsi kosong."""
    return [
        {"key": key, "text": texts[key].strip()}
        for key in OPTION_KEYS
        if (texts.get(key) or "").strip()
    ]


@dataclass
class ImportResult:
    created: int = 0
    errors: list[str] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.errors


def _parse_int(value: str, label: str, errors: list[str]) -> int | None:
    value = (value or "").strip()
    if not value:
        return None
    try:
        return int(value)
    except ValueError:
        errors.append(f"{label} harus berupa angka (isi: '{value}').")
        return None


def _row_to_question(
    row: dict,
    default_status: str,
    material=None,
) -> tuple[Question | None, list[str]]:
    errors: list[str] = []
    level_code = (row.get("jenjang") or "").strip().upper()
    subject_name = (row.get("mapel") or "").strip()

    if material is not None:
        # Impor dari halaman materi: mapel & jenjang selalu mengikuti materi
        # agar soal pasti masuk ke kuis materi tersebut.
        subject = material.subject
    else:
        subject = (
            Subject.objects.select_related("level")
            .filter(level__code=level_code, name__iexact=subject_name)
            .first()
        )
        if subject is None:
            errors.append(
                f"Mapel '{subject_name}' pada jenjang '{level_code}' tidak ditemukan."
            )
            return None, errors

    kelas_raw = (row.get("kelas") or "").strip()
    if not kelas_raw and material is not None:
        kelas = material.kelas
    else:
        kelas = _parse_int(kelas_raw, "kelas", errors)
    difficulty = _parse_int(row.get("difficulty", ""), "difficulty", errors)
    if difficulty is not None and difficulty not in (1, 2, 3):
        errors.append("difficulty harus 1, 2, atau 3 (atau kosong).")

    texts = {key: row.get(f"option_{key.lower()}", "") or "" for key in OPTION_KEYS}
    topic = (row.get("topic") or "").strip()[:160]
    topic_code = (row.get("topic_code") or "").strip()[:40]
    if material is not None:
        topic = topic or (material.topic or "")[:160]
        if material.topic_code:
            topic_code = material.topic_code[:40]

    question = Question(
        source_id=new_source_id(),
        source_dataset="admin-csv",
        level=subject.level,
        subject=subject,
        kelas=kelas,
        topic=topic,
        topic_code=topic_code,
        difficulty=difficulty,
        difficulty_source="admin" if difficulty else "",
        question_text=(row.get("question_text") or "").strip(),
        options=build_options(texts),
        correct_option=(row.get("correct") or "").strip().upper(),
        explanation=(row.get("explanation") or "").strip(),
        hint=(row.get("hint") or "").strip(),
        review_status=default_status,
    )
    if not question.question_text:
        errors.append("question_text tidak boleh kosong.")

    if not errors:
        try:
            question.full_clean(exclude=["source_id"])
        except ValidationError as exc:
            for key, messages in exc.message_dict.items():
                errors.append(f"{key}: {' '.join(messages)}")
    return (question if not errors else None), errors


def import_questions_csv(
    raw: bytes,
    default_status: str = Question.ReviewStatus.REVIEWED,
    material=None,
) -> ImportResult:
    """Impor soal dari CSV.

    Bila ``material`` diberikan (mis. dari tombol "Buat soal" pada halaman
    materi), kolom jenjang/mapel/kelas/topic_code boleh kosong dan akan diisi
    dari materi tersebut. Ini memudahkan admin membuat kuis untuk satu materi.
    """
    result = ImportResult()
    if len(raw) > MAX_BYTES:
        result.errors.append("File terlalu besar (maksimal 1 MB).")
        return result
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        result.errors.append("File harus berkode UTF-8.")
        return result

    reader = csv.DictReader(io.StringIO(text))
    required = ["question_text", "correct", "option_a", "option_b"]
    if material is None:
        required = ["jenjang", "mapel", *required]
    missing = [c for c in required if c not in (reader.fieldnames or [])]
    if missing:
        result.errors.append(f"Kolom wajib tidak ada: {', '.join(missing)}.")
        return result

    questions: list[Question] = []
    for index, row in enumerate(reader, start=2):  # baris 1 = header
        if index - 1 > MAX_ROWS:
            result.errors.append(f"Maksimal {MAX_ROWS} soal per file.")
            break
        question, errors = _row_to_question(row, default_status, material=material)
        for message in errors:
            result.errors.append(f"Baris {index}: {message}")
        if question is not None:
            questions.append(question)

    if not result.errors and not questions:
        result.errors.append("File tidak berisi soal.")
    if result.errors:
        return result

    with transaction.atomic():
        Question.objects.bulk_create(questions)
    result.created = len(questions)
    return result
