from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Mapping, Optional, Sequence

from .adaptive_engine import Attempt


class AlreadySubmitted(Exception):
    pass


@dataclass(frozen=True)
class AnswerResult:
    question_id: object
    user_answer: Optional[str]
    correct_option: str
    is_correct: Optional[bool]   # None = kosong / tidak valid
    valid_answer: bool


@dataclass(frozen=True)
class ScoreSummary:
    total: int
    correct: int
    wrong: int
    unanswered: int
    percent: float               # benar / total soal disajikan (0-100)


def grade_quiz(served: Sequence[dict], submitted: Mapping[object, Optional[str]],
               already_submitted: bool = False):
    """served: soal LENGKAP (dengan correct_option) sesuai urutan disajikan."""
    if already_submitted:
        raise AlreadySubmitted("Sesi kuis ini sudah dikirim.")
    results: List[AnswerResult] = []
    for q in served:
        keys = {o["key"] for o in q["options"]}
        raw = submitted.get(q["source_id"])
        ans = str(raw).strip().upper() if raw is not None and str(raw).strip() else None
        valid = ans in keys if ans is not None else False
        if ans is None or not valid:
            results.append(AnswerResult(q["source_id"], ans if valid else None,
                                        q["correct_option"], None, valid))
        else:
            results.append(AnswerResult(q["source_id"], ans, q["correct_option"],
                                        ans == q["correct_option"], True))
    total = len(results)
    correct = sum(1 for r in results if r.is_correct is True)
    wrong = sum(1 for r in results if r.is_correct is False)
    unanswered = total - correct - wrong
    percent = round(100 * correct / total, 1) if total else 0.0
    return results, ScoreSummary(total, correct, wrong, unanswered, percent)


def to_adaptive_attempts(results: Sequence[AnswerResult],
                        difficulty_by_id: Mapping[object, Optional[int]],
                        excluded_ids=()) -> List[Attempt]:
    excluded = set(excluded_ids)
    return [Attempt(difficulty_by_id.get(r.question_id), r.is_correct,
                    r.question_id in excluded) for r in results]