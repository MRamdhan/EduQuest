from __future__ import annotations

import json
import random
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, List, Optional

ALLOWED_STATUS = ("validated", "reviewed", "published")


def load_bank(path) -> List[dict]:
    with Path(path).open(encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]


def public_view(q: dict) -> dict:
    """Versi soal yang aman dikirim ke browser: TANPA kunci dan penjelasan."""
    return {
        "id": q["source_id"],
        "jenjang": q["jenjang"],
        "mapel": q["mapel"],
        "difficulty": q.get("difficulty"),
        "question_text": q["question_text"],
        "options": [{"key": o["key"], "text": o["text"]} for o in q["options"]],
    }


@dataclass
class Selection:
    questions: List[dict]
    target: Optional[int]
    used_levels: List[Optional[int]]
    fallback: bool
    shortage: int
    relaxed_recency: bool
    notes: List[str] = field(default_factory=list)


def select_questions(bank: Iterable[dict], jenjang: str, mapel: str,
                     target_difficulty: Optional[int], n: int,
                     recent_ids: Iterable = (), allowed_status=ALLOWED_STATUS,
                     allow_unrated: bool = True, levels=(1, 2, 3),
                     rng: Optional[random.Random] = None,
                     relevance: Optional[dict] = None,
                     min_relevance: float = 0.30) -> Selection:
    rng = rng or random.Random()
    recent = set(recent_ids)
    pool = [q for q in bank
            if q["jenjang"] == jenjang and q["mapel"] == mapel
            and q.get("review_status") in allowed_status]

    if target_difficulty is None:
        order = sorted(levels)
    else:
        order = sorted(levels, key=lambda d: (abs(d - target_difficulty), d))

    def ordered(cands: List[dict]) -> List[dict]:
        """Acak, lalu dahulukan soal yang paling nyambung dengan materi."""
        rng.shuffle(cands)
        if relevance:
            cands.sort(key=lambda q: -relevance.get(q["source_id"], 0.0))
        return cands

    def run(relax: bool) -> List[dict]:
        chosen: List[dict] = []
        taken = set()
        steps = list(order) + ([None] if allow_unrated else [])

        def candidates(d):
            items = [q for q in pool
                     if q.get("difficulty") == d
                     and q["source_id"] not in taken
                     and (relax or q["source_id"] not in recent)]
            return ordered(items)

        # Pass 1: dahulukan soal yang relevan dengan materi, walau tingkatnya
        # bergeser satu-dua langkah, agar kuis tidak keluar topik.
        if relevance:
            for d in steps:
                if len(chosen) >= n:
                    break
                for q in candidates(d):
                    if len(chosen) >= n:
                        break
                    if relevance.get(q["source_id"], 0.0) >= min_relevance:
                        chosen.append(q)
                        taken.add(q["source_id"])

        # Pass 2: lengkapi sisa kuota dari tingkat terdekat.
        for d in steps:
            if len(chosen) >= n:
                break
            for q in candidates(d):
                if len(chosen) >= n:
                    break
                if q["source_id"] in taken:
                    continue
                chosen.append(q)
                taken.add(q["source_id"])
        return chosen

    chosen = run(relax=False)
    relaxed = False
    if len(chosen) < n:
        chosen = run(relax=True)
        relaxed = len(chosen) > 0 and any(q["source_id"] in recent for q in chosen)

    notes = []
    levels_used = sorted({q.get("difficulty") for q in chosen},
                        key=lambda x: (x is None, x))
    fallback = target_difficulty is not None and any(
        q.get("difficulty") != target_difficulty for q in chosen)
    if fallback:
        notes.append(f"Stok tingkat {target_difficulty} kurang; memakai tingkat {levels_used}.")
    if relaxed:
        notes.append("Soal yang baru dikerjakan terpaksa dipakai ulang (stok kurang).")
    if relevance:
        less_relevant = sum(
            1 for q in chosen
            if relevance.get(q["source_id"], 0) < min_relevance
        )
        if less_relevant:
            notes.append(
                f"{less_relevant} dari {len(chosen)} soal kurang nyambung dengan materi "
                "(stok soal yang relevan terbatas)."
            )
    if len(chosen) < n:
        notes.append(f"Hanya {len(chosen)} dari {n} soal tersedia.")
    return Selection(chosen, target_difficulty, levels_used, fallback,
                    max(0, n - len(chosen)), relaxed, notes)