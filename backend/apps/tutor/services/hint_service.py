"""Pembuatan satu hint saat siswa menjawab salah.

Urutan sumber:
1. Hint manual pada soal (jika diisi).
2. AI Tutor (jika provider dikonfigurasi).
3. Hint aturan yang diambil dari judul/topik materi.

Hint tidak boleh membocorkan kunci jawaban.
"""

from __future__ import annotations

import logging
import re

from django.conf import settings

from apps.core.errors import ProviderUnavailable
from apps.tutor.services.provider import get_provider
from eduquest_logic.relevance import STOPWORDS, keywords as _all_keywords

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Kamu adalah tutor EduQuest untuk siswa Indonesia.
Tugasmu memberi SATU petunjuk (hint) berpikir yang SPESIFIK untuk membantu siswa memahami cara menjawab soal yang baru saja dijawab salah.

Aturan:
1. SPESIFIK KE SOAL: Bedah langsung petunjuk, kata kunci, atau ciri-ciri yang ada di dalam teks pertanyaan.
2. DILARANG KLISE: Jangan gunakan kalimat umum seperti "Coba baca kembali materi...", "Perhatikan bagian materi...", atau "Pelajari kembali bab...". Langsung bimbing cara menganalisis soalnya.
3. BANTU CARA BERPIKIR: Beri arahan logika penalaran cara mengeliminasi opsi yang salah atau menyimpulkan jawaban yang dicari.
4. JANGAN BOCORKAN KUNCI: Jangan sebutkan jawaban benar, kunci, huruf opsi yang benar (A/B/C/D), atau mengutip teks opsi secara persis.
5. Maksimal dua kalimat, bahasa Indonesia yang ramah, jelas, dan sesuai jenjang siswa.
"""

QUESTION_STOPWORDS = {
    "bawah", "berikut", "pernyataan", "gambar", "merupakan", "disebut",
    "antara", "manakah", "adalah", "tersebut", "yaitu", "contoh",
    "salah", "benar", "sesuai", "bukan", "kecuali", "tabel", "nomor",
}


def _headings(content: str, limit: int = 8) -> list[str]:
    headings = re.findall(r"^#{2,3}\s+(.+)$", content or "", flags=re.MULTILINE)
    return [heading.strip() for heading in headings[:limit]]


def _words(text: str) -> set[str]:
    return {word.lower() for word in re.findall(r"[A-Za-zÀ-ÿ0-9]{4,}", text or "")}


def _keywords(text: str, limit: int = 4) -> list[str]:
    """Ambil kata kunci soal tanpa kata sambung dan kata template soal."""
    raw = _all_keywords(text)
    filtered = [w for w in raw if w.lower() not in QUESTION_STOPWORDS]
    return (filtered or raw)[:limit]


def _best_heading(question, material) -> str | None:
    """Mengembalikan judul bagian materi yang paling relevan dengan soal,
    atau None jika tidak ada yang cocok secara signifikan."""
    headings = _headings(material.content)
    if not headings:
        return None

    question_words = _words(f"{question.question_text} {question.topic}")
    scored = []
    for index, heading in enumerate(headings):
        overlap = len(question_words & _words(heading))
        scored.append((overlap, -index, heading))
    scored.sort(reverse=True)
    if scored and scored[0][0] >= 2:
        return scored[0][2]

    topic_words = _words(material.topic)
    if topic_words:
        topic_scored = []
        for index, heading in enumerate(headings):
            overlap = len(topic_words & _words(heading))
            topic_scored.append((overlap, -index, heading))
        topic_scored.sort(reverse=True)
        if topic_scored and topic_scored[0][0] >= 2:
            return topic_scored[0][2]

    return None


def _rule_hint(question, material) -> str:
    """Hint aturan yang menyesuaikan soal, bukan hanya materi secara umum."""
    keywords = _keywords(f"{question.question_text} {question.topic or ''}")
    parts: list[str] = []

    if keywords:
        parts.append(
            f"Petunjuk: fokus pada ciri atau kata kunci {', '.join(keywords)}."
        )
    else:
        parts.append("Petunjuk: cermati kembali ciri atau kondisi khusus yang diminta pada pertanyaan.")

    heading = _best_heading(question, material) if material is not None else None
    if heading:
        parts.append(f'Kaitkan dengan konsep "{heading}".')

    parts.append(
        "Bandingkan setiap pilihan jawaban dengan petunjuk tersebut, lalu eliminasi opsi yang tidak sesuai."
    )
    return " ".join(parts)


def _normalize_text(text: str) -> str:
    return re.sub(r"[^a-z0-9 ]+", " ", (text or "").lower()).strip()


def _looks_like_answer(hint: str, question) -> bool:
    """Pengaman agar AI tidak membocorkan kunci, termasuk saat hanya memparafrase opsi."""
    text = (hint or "").lower()
    correct_key = (question.correct_option or "").strip().upper()
    if not correct_key:
        return False

    correct_text = ""
    for option in question.options or []:
        if str(option.get("key", "")).strip().upper() == correct_key:
            correct_text = str(option.get("text", "")).strip()
            break

    normalized_text = f" {_normalize_text(text)} "
    normalized_correct = _normalize_text(correct_text)

    # 1. Bocor persis (seluruh teks opsi benar muncul utuh di dalam hint)
    if len(normalized_correct) >= 8 and f" {normalized_correct} " in normalized_text:
        return True

    # 2. Bocor huruf kunci secara eksplisit: "jawabannya A" atau "kunci: B"
    pattern = (
        rf"\b(?:jawaban(?:nya)?|kunci|opsi|pilihan)\s*"
        rf"(?:adalah|:)?\s*{re.escape(correct_key.lower())}\b"
    )
    if re.search(pattern, text):
        return True

    # 3. Kata distingtif opsi benar (yang belum muncul di kalimat soal)
    question_words = set(_normalize_text(question.question_text).split())
    significant = [
        word
        for word in normalized_correct.split()
        if len(word) > 3 and word not in STOPWORDS and word not in question_words
    ]
    if len(significant) >= 3:
        hits = sum(1 for word in significant if f" {word} " in normalized_text)
        if hits / len(significant) >= 0.7:
            return True
    elif len(significant) == 2:
        if all(f" {word} " in normalized_text for word in significant):
            return True
    elif len(significant) == 1:
        if f" {significant[0]} " in normalized_text:
            return True

    return False


def _ai_hint(question, material) -> str:
    context = (material.content or "")[: settings.AI_HINT_MAX_CONTEXT_CHARS]
    headings = ", ".join(_headings(material.content)) or "-"
    options_text = "\n".join(
        f"{option.get('key')}. {option.get('text')}"
        for option in question.options or []
    )
    user_prompt = f"""Konteks pembelajaran:
Materi: {material.title} (Topik: {material.topic or "-"})
Jenjang: {material.subject.level.name} - Mata Pelajaran: {material.subject.name}
Isi materi terkait:
{context}

Soal yang dikerjakan siswa:
{question.question_text}

Pilihan Opsi:
{options_text}

Instruksi:
Siswa baru saja salah menjawab soal di atas. Berikan SATU petunjuk berpikir spesifik berdasarkan petunjuk/ciri yang ada pada soal.
Bimbing cara menganalisis ciri tersebut untuk memilih jawaban yang tepat.
DILARANG memberikan arahan klise seperti "baca kembali materi" atau "perhatikan bagian materi". Langsung jelaskan cara menalar soalnya tanpa membocorkan kunci jawaban."""

    provider = get_provider()
    return provider.complete(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=user_prompt,
        max_tokens=settings.AI_HINT_MAX_OUTPUT_TOKENS,
    )


def generate_hint(user, question, material) -> tuple[str, str]:
    """Mengembalikan ``(teks_hint, sumber)`` dengan sumber manual/ai/rule."""
    manual = (getattr(question, "hint", "") or "").strip()
    if manual:
        return manual, "manual"

    if material is not None:
        try:
            ai_hint = _ai_hint(question, material).strip()
            if ai_hint and not _looks_like_answer(ai_hint, question):
                return ai_hint, "ai"
            logger.info("Hint AI ditolak karena berpotensi membocorkan jawaban.")
        except ProviderUnavailable as exc:
            logger.info("Hint AI tidak tersedia: %s", exc)
        except Exception:
            logger.exception("Pembuatan hint AI gagal")
    else:
        logger.info("Hint AI dilewati karena materi tidak tersedia.")

    return _rule_hint(question, material), "rule"
