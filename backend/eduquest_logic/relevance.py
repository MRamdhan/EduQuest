"""Pencocokan soal dengan materi berbasis kata kunci (tanpa ML).

Modul murni: tidak bergantung pada Django maupun database, sehingga mudah
diuji. Dipakai untuk memprioritaskan soal yang topiknya bersinggungan dengan
materi yang sedang dibaca siswa.
"""

from __future__ import annotations

import math
import re
from typing import Iterable

STOPWORDS = {
    "adalah", "agar", "akan", "antara", "apa", "atau", "bagaimana", "bagian",
    "banyak", "berdasarkan", "berikut", "bisa", "bukan", "cara", "contoh",
    "dalam", "dapat", "dari", "dengan", "di", "diantara", "dimana", "disebut",
    "harus", "ini", "itu", "jika", "juga", "kapan", "karena", "ke", "kelas",
    "kegiatan", "kepada", "lebih", "maka", "mana", "masih", "menjadi",
    "mengapa", "merupakan", "oleh", "pada", "paling", "perhatikan", "saat",
    "salah", "sama", "satu", "secara", "sebagai", "sebuah", "seekor",
    "seperti", "siswa", "soal", "suatu", "telah", "terhadap", "tersebut",
    "tertentu", "tidak", "untuk", "yang",
}

_WORD_RE = re.compile(r"[A-Za-zÀ-ÿ0-9]{4,}")


def keywords(text: str) -> list[str]:
    """Kata kunci unik tanpa kata sambung, mempertahankan urutan kemunculan."""
    found: list[str] = []
    for word in _WORD_RE.findall(text or ""):
        lower = word.lower()
        if lower in STOPWORDS or lower in found:
            continue
        found.append(lower)
    return found


def build_idf(documents: Iterable[str]) -> dict[str, float]:
    """IDF sederhana: kata yang jarang muncul di bank soal diberi bobot lebih besar."""
    return build_idf_from_terms([set(keywords(document)) for document in documents])


def build_idf_from_terms(documents_terms: Iterable[Iterable[str]]) -> dict[str, float]:
    """Versi build_idf untuk dokumen yang sudah di-tokenisasi (lebih cepat)."""
    docs = [set(terms) for terms in documents_terms]
    total = len(docs) or 1
    frequency: dict[str, int] = {}
    for terms in docs:
        for term in terms:
            frequency[term] = frequency.get(term, 0) + 1
    return {
        term: math.log((1 + total) / (1 + count)) + 1.0
        for term, count in frequency.items()
    }


def score_terms(
    question_terms: Iterable[str],
    material_terms: set[str],
    idf: dict[str, float] | None = None,
) -> float:
    """Skor 0..1: porsi bobot kata kunci soal yang juga muncul di materi."""
    terms = list(question_terms)
    if not terms or not material_terms:
        return 0.0
    weights = idf or {}
    total = sum(weights.get(term, 1.0) for term in terms)
    if not total:
        return 0.0
    matched = sum(weights.get(term, 1.0) for term in terms if term in material_terms)
    return matched / total


def score(question_text: str, material_text: str, idf: dict[str, float] | None = None) -> float:
    """Skor kecocokan teks soal dengan teks materi."""
    return score_terms(keywords(question_text), set(keywords(material_text)), idf)
