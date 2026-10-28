"""Orkestrasi sesi kuis.

Modul ini menjadi batas antara Django/ORM dan logika murni di
`eduquest_logic`. Kunci jawaban hanya dipakai di server.
"""

from __future__ import annotations

import random
from dataclasses import replace

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from eduquest_logic.adaptive_engine import DEFAULT_CONFIG as ADAPTIVE_CONFIG
from eduquest_logic.adaptive_engine import Attempt, decide
from eduquest_logic.gamification import DEFAULT as GAMIFICATION, level_from_xp
from eduquest_logic.question_selector import ALLOWED_STATUS, public_view, select_questions
from eduquest_logic.relevance import build_idf_from_terms, keywords, score_terms

from apps.core.errors import (
    InvalidAnswerPayload,
    LevelLocked,
    NoLivesAvailable,
    NoQuestionsAvailable,
    NotFoundError,
    QuestionAlreadyResolved,
    QuizAlreadySubmitted,
    QuizNotInProgress,
)
from apps.learning.constants import QUIZ_LEVEL_LABELS
from apps.learning.models import (
    Material,
    Question,
    QuestionReport,
    QuizAttempt,
    QuizQuestion,
)
from apps.progress.constants import MAX_LIVES
from apps.progress.services import (
    award_xp,
    current_difficulty,
    get_or_create_progress,
    get_subject_progress,
    mark_material_in_progress,
    rank_context,
    record_adaptation,
)
from apps.progress.models import XPTransaction
from apps.tutor.services.hint_service import generate_hint

RECENT_HISTORY_WINDOW = 30


def _recent_question_ids(user, limit: int | None = None) -> set[int]:
    limit = limit or settings.QUIZ_RECENT_QUESTION_WINDOW
    ids = (
        QuizQuestion.objects.filter(attempt__user=user)
        .order_by("-attempt__started_at", "-order")
        .values_list("question_id", flat=True)[:limit]
    )
    return set(ids)


def question_dto(quiz_question: QuizQuestion, *, include_review: bool = False) -> dict:
    """DTO soal yang aman dikirim ke browser.

    Kunci jawaban hanya muncul setelah soal diselesaikan atau sesi selesai.
    """
    question = quiz_question.question
    payload = public_view(question.selection_dict())
    payload["id"] = question.pk
    payload["difficulty"] = quiz_question.difficulty
    payload["order"] = quiz_question.order
    payload["attempts"] = quiz_question.attempts
    payload["is_resolved"] = quiz_question.is_resolved
    payload["hint_used"] = quiz_question.hint_used

    if quiz_question.hint_used:
        payload["hint"] = quiz_question.hint_text
        payload["hint_source"] = quiz_question.hint_source

    if include_review or quiz_question.is_resolved:
        payload["selected_option"] = quiz_question.selected_option
        payload["is_correct"] = quiz_question.is_correct
        payload["correct_option"] = question.correct_option
        payload["explanation"] = question.explanation

    return payload


def attempt_dto(attempt: QuizAttempt, *, include_review: bool = False) -> dict:
    questions = list(
        attempt.quiz_questions.select_related("question").order_by("order")
    )
    review = include_review or attempt.status == QuizAttempt.Status.SUBMITTED
    return {
        "id": attempt.pk,
        "material": (
            {"id": attempt.material_id, "title": attempt.material.title}
            if attempt.material_id
            else None
        ),
        "status": attempt.status,
        "target_difficulty": attempt.target_difficulty,
        "selection_fallback": attempt.selection_fallback,
        "selection_notes": attempt.selection_notes,
        "total_questions": attempt.total_questions or len(questions),
        "correct_count": attempt.correct_count,
        "wrong_count": attempt.wrong_count,
        "unanswered_count": attempt.unanswered_count,
        "percent": attempt.percent,
        "xp_gained": attempt.xp_gained,
        "lives_lost": attempt.lives_lost,
        "ended_early": attempt.ended_early,
        "started_at": attempt.started_at,
        "submitted_at": attempt.submitted_at,
        "questions": [
            question_dto(quiz_question, include_review=review)
            for quiz_question in questions
        ],
    }


def _level_options(target: int, unlocked: int) -> list[dict]:
    return [
        {
            "difficulty": difficulty,
            "label": QUIZ_LEVEL_LABELS[difficulty],
            "locked": difficulty > unlocked,
            "selected": difficulty == target,
        }
        for difficulty in (1, 2, 3)
    ]


def _context_payload(user, attempt: QuizAttempt, subject_progress, rank_info: dict) -> dict:
    return {
        "attempt_id": attempt.pk,
        "lives": subject_progress.lives,
        "max_lives": MAX_LIVES,
        "next_life_at": subject_progress.next_life_at,
        "seconds_to_next_life": subject_progress.seconds_to_next_life,
        "subject": {
            "id": subject_progress.subject_id,
            "name": subject_progress.subject.name,
        },
        "total_xp": rank_info["xp"],
        "level": rank_info["level"],
        "rank": rank_info["rank"],
        "next_rank": rank_info["next_rank"],
        "xp_to_next_rank": rank_info["xp_to_next_rank"],
        "unlocked_difficulty": rank_info["unlocked_difficulty"],
        "levels": _level_options(attempt.target_difficulty, rank_info["unlocked_difficulty"]),
    }


@transaction.atomic
def _question_document(question) -> str:
    options = " ".join(
        str(option.get("text", "")) for option in question.options or []
    )
    return f"{question.question_text} {options}".strip()


def _material_text(material) -> str:
    return " ".join(
        part
        for part in (material.title, material.topic or "", material.content or "")
        if part
    )


def _material_relevance(pool, material) -> dict[int, float]:
    """Skor kecocokan tiap soal dengan materi (0..1) memakai IDF bank soal.

    Soal yang ternyata lebih cocok dengan materi lain pada mapel yang sama
    diberi skor negatif, agar tidak muncul di kuis materi ini.
    """
    questions = list(pool)
    documents = [_question_document(question) for question in questions]
    document_terms = [keywords(document) for document in documents]
    idf = build_idf_from_terms(document_terms)
    own_terms = set(keywords(_material_text(material)))

    siblings = list(
        Material.objects.filter(
            subject=material.subject,
            status=Material.Status.PUBLISHED,
        ).exclude(pk=material.pk)
    )
    sibling_terms = [set(keywords(_material_text(sibling))) for sibling in siblings]

    relevance: dict[int, float] = {}
    for question, terms in zip(questions, document_terms):
        own = score_terms(terms, own_terms, idf)
        best_other = max(
            (score_terms(terms, terms_other, idf) for terms_other in sibling_terms),
            default=0.0,
        )
        relevance[question.pk] = own if own >= best_other else own - best_other
    return relevance


def start_quiz(user, material: Material, *, requested_difficulty: int | None = None) -> dict:
    """Membuat (atau melanjutkan) sesi kuis 5 soal untuk satu materi."""
    if material.status != Material.Status.PUBLISHED:
        raise NotFoundError("Materi tidak tersedia.", code="material_not_published")

    rank_info = rank_context(user)
    unlocked = rank_info["unlocked_difficulty"]

    if requested_difficulty is not None and int(requested_difficulty) > unlocked:
        label = QUIZ_LEVEL_LABELS.get(int(requested_difficulty), str(requested_difficulty))
        raise LevelLocked(
            f"Tingkat {label} masih terkunci. Kumpulkan XP dan capai rank berikutnya "
            "untuk membukanya."
        )

    subject_progress = get_subject_progress(user, material.subject)
    if subject_progress.lives <= 0:
        seconds = subject_progress.seconds_to_next_life
        raise NoLivesAvailable(
            f"Nyawa {material.subject.name} habis. "
            f"Nyawa berikutnya pulih dalam {seconds // 60 if seconds else 0} menit."
        )

    existing = (
        QuizAttempt.objects.filter(
            user=user,
            material=material,
            status=QuizAttempt.Status.IN_PROGRESS,
        )
        .prefetch_related("quiz_questions__question")
        .first()
    )
    if existing and existing.quiz_questions.exists():
        mark_material_in_progress(user, material)
        return {
            "attempt": attempt_dto(existing),
            "reused": True,
            **_context_payload(user, existing, subject_progress, rank_info),
        }

    target = requested_difficulty or current_difficulty(user, material)
    target = max(ADAPTIVE_CONFIG.min_level, min(ADAPTIVE_CONFIG.max_level, int(target)))
    target = min(target, unlocked)
    target = max(1, target)

    pool = Question.objects.filter(
        subject=material.subject,
        level=material.subject.level,
        is_active=True,
        review_status__in=ALLOWED_STATUS,
    )
    bank = [question.selection_dict() for question in pool]

    selection = select_questions(
        bank,
        jenjang=material.subject.level.code,
        mapel=material.subject.name,
        target_difficulty=target,
        n=settings.QUIZ_QUESTIONS_PER_SESSION,
        recent_ids=_recent_question_ids(user),
        rng=random.Random(),
        relevance=_material_relevance(pool, material),
        min_relevance=settings.QUIZ_MIN_RELEVANCE,
    )

    if not selection.questions:
        raise NoQuestionsAvailable(
            "Belum ada soal yang cocok untuk materi ini. Materi tetap dapat dibaca."
        )

    attempt = QuizAttempt.objects.create(
        user=user,
        material=material,
        target_difficulty=target,
        total_questions=len(selection.questions),
        selection_fallback=selection.fallback,
        selection_notes=selection.notes,
    )

    chosen_ids = [q["source_id"] for q in selection.questions]
    question_map = {q.pk: q for q in pool.filter(pk__in=chosen_ids)}
    QuizQuestion.objects.bulk_create(
        [
            QuizQuestion(
                attempt=attempt,
                question=question_map[question_id],
                order=index,
                difficulty=question_map[question_id].difficulty,
            )
            for index, question_id in enumerate(chosen_ids, start=1)
        ]
    )

    mark_material_in_progress(user, material)
    attempt.refresh_from_db()

    return {
        "attempt": attempt_dto(attempt),
        "reused": False,
        **_context_payload(user, attempt, subject_progress, rank_info),
    }


def get_attempt(user, attempt_id: int) -> QuizAttempt:
    try:
        return (
            QuizAttempt.objects.select_related("material__subject__level")
            .prefetch_related("quiz_questions__question")
            .get(pk=attempt_id, user=user)
        )
    except QuizAttempt.DoesNotExist as exc:
        raise NotFoundError("Sesi kuis tidak ditemukan.") from exc


def _next_question(attempt: QuizAttempt) -> QuizQuestion | None:
    return (
        attempt.quiz_questions.select_related("question")
        .filter(is_resolved=False)
        .order_by("order")
        .first()
    )


def attempt_payload(user, attempt_id: int) -> dict:
    attempt = get_attempt(user, attempt_id)
    rank_info = rank_context(user)
    subject_progress = get_subject_progress(user, attempt.material.subject)
    payload = {
        "attempt": attempt_dto(
            attempt,
            include_review=attempt.status == QuizAttempt.Status.SUBMITTED,
        ),
        **_context_payload(user, attempt, subject_progress, rank_info),
    }
    if attempt.status == QuizAttempt.Status.SUBMITTED:
        payload["summary"] = _summary_payload(user, attempt)
    else:
        next_question = _next_question(attempt)
        payload["next_question"] = question_dto(next_question) if next_question else None
    return payload


def _summary_payload(user, attempt: QuizAttempt) -> dict:
    quiz_questions = list(
        attempt.quiz_questions.select_related("question").order_by("order")
    )
    total = len(quiz_questions)
    correct = sum(
        1 for qq in quiz_questions if qq.is_resolved and qq.is_correct is True
    )
    wrong = sum(
        1 for qq in quiz_questions if qq.is_resolved and qq.is_correct is False
    )
    unanswered = sum(1 for qq in quiz_questions if not qq.is_resolved)
    percent = round(correct / total * 100, 2) if total else 0.0

    progress = get_or_create_progress(user)
    subject_progress = get_subject_progress(user, attempt.material.subject)
    level_after = level_from_xp(progress.xp)
    level_before = level_from_xp(max(0, progress.xp - attempt.xp_gained))
    adaptation = (
        attempt.adaptation_events.order_by("-created_at", "-id").first()
        if attempt.pk
        else None
    )

    return {
        "score": {
            "total": total,
            "correct": correct,
            "wrong": wrong,
            "unanswered": unanswered,
            "percent": percent,
        },
        "reward": {
            "xp_gained": attempt.xp_gained,
            "lives": subject_progress.lives,
            "lives_lost": attempt.lives_lost,
            "level_before": level_before,
            "level_after": level_after,
            "leveled_up": level_after > level_before,
            "ended_early": attempt.ended_early,
        },
        "adaptation": (
            {
                "action": adaptation.action,
                "previous_difficulty": adaptation.previous_difficulty,
                "next_difficulty": adaptation.next_difficulty,
                "rule_name": adaptation.rule_name,
                "reason": adaptation.reason,
                "accuracy": adaptation.accuracy,
                "n_used": adaptation.n_used,
            }
            if adaptation
            else None
        ),
        "answers": [
            {
                "question_id": qq.question_id,
                "order": qq.order,
                "selected_option": qq.selected_option,
                "correct_option": qq.question.correct_option,
                "is_correct": qq.is_correct,
                "is_resolved": qq.is_resolved,
                "explanation": qq.question.explanation,
            }
            for qq in quiz_questions
        ],
    }


def _finalize_attempt(user, attempt: QuizAttempt, *, ended_early: bool) -> dict:
    quiz_questions = list(
        attempt.quiz_questions.select_related("question").order_by("order")
    )
    total = len(quiz_questions)
    correct = sum(
        1 for qq in quiz_questions if qq.is_resolved and qq.is_correct is True
    )
    wrong = sum(
        1 for qq in quiz_questions if qq.is_resolved and qq.is_correct is False
    )
    unanswered = sum(1 for qq in quiz_questions if not qq.is_resolved)
    previous_difficulty = attempt.target_difficulty
    unlocked = rank_context(user)["unlocked_difficulty"]

    attempt.status = QuizAttempt.Status.SUBMITTED
    attempt.submitted_at = timezone.now()
    attempt.total_questions = total
    attempt.correct_count = correct
    attempt.wrong_count = wrong
    attempt.unanswered_count = unanswered
    attempt.percent = round(correct / total * 100, 2) if total else 0.0
    attempt.ended_early = ended_early
    attempt.save(
        update_fields=[
            "status",
            "submitted_at",
            "total_questions",
            "correct_count",
            "wrong_count",
            "unanswered_count",
            "percent",
            "ended_early",
        ]
    )

    decision = _decide_adaptation(
        user=user,
        attempt=attempt,
        current=previous_difficulty,
        quiz_questions=quiz_questions,
        max_level=unlocked,
    )
    record_adaptation(user, attempt.material, attempt, decision)
    return _summary_payload(user, attempt)


def _answer_context(
    user,
    attempt: QuizAttempt,
    subject_progress,
    *,
    correct: bool,
    retry: bool,
    revealed: bool,
    hint: str | None,
    hint_source: str,
    xp_gained: int,
    session_ended: bool,
    summary: dict | None,
    answered_question: QuizQuestion | None,
) -> dict:
    rank_info = rank_context(user)
    next_question = None if session_ended else _next_question(attempt)
    payload = {
        **_context_payload(user, attempt, subject_progress, rank_info),
        "correct": correct,
        "retry": retry,
        "revealed": revealed,
        "hint": hint,
        "hint_source": hint_source,
        "xp_gained": xp_gained,
        "session_ended": session_ended,
        "summary": summary,
        "answered_question_id": answered_question.question_id if answered_question else None,
        "selected_option": answered_question.selected_option if answered_question else None,
        "is_correct": answered_question.is_correct if answered_question else None,
        "correct_option": (
            answered_question.question.correct_option
            if revealed and answered_question
            else None
        ),
        "explanation": (
            answered_question.question.explanation
            if revealed and answered_question
            else None
        ),
        "next_question": question_dto(next_question) if next_question else None,
    }
    return payload


@transaction.atomic
def answer_question(user, attempt_id: int, question_id: int, option: str) -> dict:
    """Memproses satu jawaban dan langsung memberi umpan balik."""
    try:
        attempt = (
            QuizAttempt.objects.select_for_update()
            .select_related("material__subject__level")
            .get(pk=attempt_id, user=user)
        )
    except QuizAttempt.DoesNotExist as exc:
        raise NotFoundError("Sesi kuis tidak ditemukan.") from exc

    if attempt.status == QuizAttempt.Status.SUBMITTED:
        raise QuizAlreadySubmitted("Sesi kuis ini sudah selesai.")
    if attempt.status != QuizAttempt.Status.IN_PROGRESS:
        raise QuizNotInProgress("Sesi kuis ini tidak dapat dijawab.")
    if attempt.material is None:
        raise NotFoundError("Materi sesi ini tidak tersedia.")

    subject_progress = get_subject_progress(user, attempt.material.subject, lock=True)
    if subject_progress.lives <= 0:
        summary = _finalize_attempt(user, attempt, ended_early=True)
        return _answer_context(
            user,
            attempt,
            subject_progress,
            correct=False,
            retry=False,
            revealed=False,
            hint=None,
            hint_source="",
            xp_gained=0,
            session_ended=True,
            summary=summary,
            answered_question=None,
        )

    try:
        quiz_question = (
            attempt.quiz_questions.select_for_update()
            .select_related("question")
            .get(question_id=question_id)
        )
    except QuizQuestion.DoesNotExist as exc:
        raise InvalidAnswerPayload(
            f"Soal {question_id} bukan bagian dari sesi ini."
        ) from exc

    if quiz_question.is_resolved:
        raise QuestionAlreadyResolved("Soal ini sudah dijawab dan tidak bisa diulang.")

    expected_order = (
        attempt.quiz_questions.filter(is_resolved=False)
        .order_by("order")
        .values_list("order", flat=True)
        .first()
    )
    if expected_order is not None and quiz_question.order != expected_order:
        raise InvalidAnswerPayload(
            "Selesaikan soal sebelumnya terlebih dahulu. "
            "Jawaban salah tidak boleh dilewati."
        )

    normalised = (option or "").strip().upper()
    keys = {
        str(item.get("key", "")).strip().upper()
        for item in quiz_question.question.options or []
    }
    if normalised not in keys:
        raise InvalidAnswerPayload(
            f"Opsi {option!r} tidak valid. Pilih salah satu: {', '.join(sorted(keys))}."
        )

    now = timezone.now()
    is_correct = normalised == quiz_question.question.correct_option.strip().upper()
    quiz_question.attempts += 1
    quiz_question.selected_option = normalised
    xp_gained = 0
    retry = False
    revealed = False
    hint = None
    hint_source = ""
    ended_early = False

    if is_correct:
        quiz_question.is_correct = True
        quiz_question.is_resolved = True
        quiz_question.answered_at = now
        quiz_question.save()
        xp_gained, _ = award_xp(
            user,
            GAMIFICATION.xp_per_correct,
            reason=XPTransaction.Reason.CORRECT_ANSWER,
            reference=f"quiz:{attempt.pk}:question:{quiz_question.pk}",
            idempotency_key=f"quiz-question:{quiz_question.pk}",
        )
        attempt.xp_gained += xp_gained
        attempt.correct_count += 1
    else:
        lost = subject_progress.lose_life(now=now)
        attempt.lives_lost += lost

        if quiz_question.attempts >= 2 or subject_progress.lives <= 0:
            quiz_question.is_correct = False
            quiz_question.is_resolved = True
            quiz_question.answered_at = now
            quiz_question.save()
            attempt.wrong_count += 1
            revealed = True
            ended_early = subject_progress.lives <= 0
        else:
            hint, hint_source = generate_hint(
                user,
                quiz_question.question,
                attempt.material,
            )
            quiz_question.hint_used = True
            quiz_question.hint_text = hint
            quiz_question.hint_source = hint_source
            quiz_question.save()
            retry = True

    attempt.save(
        update_fields=[
            "xp_gained",
            "correct_count",
            "wrong_count",
            "lives_lost",
        ]
    )

    all_resolved = not attempt.quiz_questions.filter(is_resolved=False).exists()
    session_ended = ended_early or all_resolved
    summary = None
    if session_ended:
        summary = _finalize_attempt(user, attempt, ended_early=ended_early)

    return _answer_context(
        user,
        attempt,
        subject_progress,
        correct=is_correct,
        retry=retry,
        revealed=revealed,
        hint=hint,
        hint_source=hint_source,
        xp_gained=xp_gained,
        session_ended=session_ended,
        summary=summary,
        answered_question=quiz_question,
    )


def _decide_adaptation(
    user,
    attempt: QuizAttempt,
    current: int,
    quiz_questions: list[QuizQuestion],
    *,
    max_level: int,
):
    reported_ids = set(
        QuestionReport.objects.filter(
            user=user,
            question_id__in=[q.question_id for q in quiz_questions],
        ).values_list("question_id", flat=True)
    )

    history = list(
        QuizQuestion.objects.filter(
            attempt__user=user,
            attempt__material=attempt.material,
            attempt__status=QuizAttempt.Status.SUBMITTED,
        )
        .exclude(attempt_id=attempt.pk)
        .order_by("-attempt__submitted_at", "-order")
        .values_list("difficulty", "is_correct", "question_id")[:RECENT_HISTORY_WINDOW]
    )
    history.reverse()

    attempts = [
        Attempt(difficulty=difficulty, is_correct=is_correct, excluded=qid in reported_ids)
        for difficulty, is_correct, qid in history
    ]
    attempts.extend(
        Attempt(
            difficulty=qq.difficulty,
            is_correct=qq.is_correct if qq.is_resolved else None,
            excluded=qq.question_id in reported_ids,
        )
        for qq in quiz_questions
    )

    config = replace(
        ADAPTIVE_CONFIG,
        max_level=max(ADAPTIVE_CONFIG.min_level, min(ADAPTIVE_CONFIG.max_level, max_level)),
    )
    return decide(attempts, current, config)
