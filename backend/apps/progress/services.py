from __future__ import annotations

from django.db import transaction
from django.utils import timezone

from eduquest_logic.gamification import DEFAULT

from apps.learning.models import Subject
from apps.progress.constants import MAX_LIVES
from apps.progress.models import (
    Achievement,
    AdaptationEvent,
    Rank,
    SubjectProgress,
    UserAchievement,
    UserMaterialProgress,
    UserProgress,
    XPTransaction,
)


def get_or_create_progress(user) -> UserProgress:
    progress, _ = UserProgress.objects.get_or_create(user=user, defaults={"xp": 0})
    return progress


@transaction.atomic
def award_xp(
    user,
    amount: int,
    *,
    reason: str,
    reference: str,
    idempotency_key: str,
) -> tuple[int, int]:
    """Memberi XP sekali untuk satu kunci idempotensi.

    Mengembalikan ``(xp_diberikan, total_xp)``.
    """
    progress, _ = UserProgress.objects.select_for_update().get_or_create(
        user=user,
        defaults={"xp": 0},
    )
    if XPTransaction.objects.filter(idempotency_key=idempotency_key).exists():
        return 0, progress.xp
    if amount <= 0:
        return 0, progress.xp

    progress.xp += amount
    progress.save(update_fields=["xp", "updated_at"])
    XPTransaction.objects.create(
        user=user,
        amount=amount,
        reason=reason,
        reference=reference,
        idempotency_key=idempotency_key,
    )
    return amount, progress.xp


def get_subject_progress(user, subject, *, lock: bool = False) -> SubjectProgress:
    """Mengambil (atau membuat) nyawa untuk satu mata pelajaran."""
    manager = SubjectProgress.objects.select_for_update() if lock else SubjectProgress.objects
    try:
        progress = manager.get(user=user, subject=subject)
    except SubjectProgress.DoesNotExist:
        progress, _ = SubjectProgress.objects.get_or_create(
            user=user,
            subject=subject,
            defaults={"lives": MAX_LIVES},
        )
        if lock:
            progress = SubjectProgress.objects.select_for_update().get(pk=progress.pk)
    return progress.refresh_lives()


def default_subject_lives_payload(subject) -> dict:
    return {
        "subject_id": subject.pk,
        "subject": subject.name,
        "subject_slug": subject.slug,
        "lives": MAX_LIVES,
        "max_lives": MAX_LIVES,
        "life_regen_started_at": None,
        "next_life_at": None,
        "seconds_to_next_life": None,
    }


def subject_lives_map(user, subjects) -> dict[int, dict]:
    """Payload nyawa untuk daftar mapel, tanpa membuat baris untuk mapel baru."""
    subject_list = list(subjects)
    if not subject_list:
        return {}

    saved = {
        item.subject_id: item
        for item in SubjectProgress.objects.filter(
            user=user,
            subject_id__in=[subject.pk for subject in subject_list],
        ).select_related("subject")
    }
    payload: dict[int, dict] = {}
    for subject in subject_list:
        progress = saved.get(subject.pk)
        if progress is None:
            payload[subject.pk] = default_subject_lives_payload(subject)
        else:
            payload[subject.pk] = progress.refresh_lives().to_payload()
    return payload


def rank_context(user, *, progress: UserProgress | None = None) -> dict:
    progress = progress or get_or_create_progress(user)
    current = Rank.for_xp(progress.xp)
    next_rank = current.next_rank if current else None
    return {
        "xp": progress.xp,
        "level": progress.level,
        "rank": current.to_payload() if current else None,
        "next_rank": next_rank.to_payload() if next_rank else None,
        "xp_to_next_rank": max(0, next_rank.min_xp - progress.xp) if next_rank else None,
        "unlocked_difficulty": current.unlocked_difficulty if current else 1,
    }


@transaction.atomic
def complete_material(user, material):
    """Menandai materi selesai dan memberi XP sekali per materi."""
    progress, _ = UserProgress.objects.select_for_update().get_or_create(
        user=user,
        defaults={"xp": 0},
    )
    material_progress, _ = UserMaterialProgress.objects.select_for_update().get_or_create(
        user=user,
        material=material,
        defaults={"status": UserMaterialProgress.Status.IN_PROGRESS},
    )

    if material_progress.status == UserMaterialProgress.Status.COMPLETED:
        return {
            "already_completed": True,
            "xp_gained": 0,
            "progress": progress,
        }

    material_progress.status = UserMaterialProgress.Status.COMPLETED
    material_progress.completed_at = timezone.now()
    material_progress.save(update_fields=["status", "completed_at", "updated_at"])

    gained = DEFAULT.xp_material_complete
    key = f"material:{material.pk}"
    already_awarded = XPTransaction.objects.filter(idempotency_key=key).exists()
    if not already_awarded:
        progress.xp += gained
        progress.save(update_fields=["xp", "updated_at"])
        XPTransaction.objects.create(
            user=user,
            amount=gained,
            reason=XPTransaction.Reason.MATERIAL_COMPLETE,
            reference=f"material:{material.pk}",
            idempotency_key=key,
        )
    else:
        gained = 0

    completed_count = UserMaterialProgress.objects.filter(
        user=user,
        status=UserMaterialProgress.Status.COMPLETED,
    ).count()
    if completed_count >= 5:
        award_achievement(user, "material-explorer")

    # XP achievement (jika baru terbuka) menambah saldo, jadi segarkan objek.
    progress.refresh_from_db(fields=["xp", "updated_at"])

    return {
        "already_completed": False,
        "xp_gained": gained,
        "progress": progress,
    }


def mark_material_in_progress(user, material) -> UserMaterialProgress:
    obj, _ = UserMaterialProgress.objects.get_or_create(
        user=user,
        material=material,
        defaults={"status": UserMaterialProgress.Status.IN_PROGRESS},
    )
    return obj


def current_difficulty(user, material) -> int:
    last = (
        AdaptationEvent.objects.filter(user=user, material=material)
        .order_by("-created_at", "-id")
        .first()
    )
    return last.next_difficulty if last else 1


def record_adaptation(user, material, attempt, decision) -> AdaptationEvent:
    return AdaptationEvent.objects.create(
        user=user,
        material=material,
        attempt=attempt,
        previous_difficulty=decision.previous_difficulty,
        next_difficulty=decision.next_difficulty,
        action=decision.action,
        rule_name=decision.rule_name,
        reason=decision.reason,
        accuracy=decision.accuracy,
        n_used=decision.n_used,
        config=decision.config,
    )


def award_achievement(user, code: str) -> UserAchievement | None:
    """Membuka pencapaian berdasarkan kode dan memberi XP sekali."""
    try:
        achievement = Achievement.objects.get(code=code, is_active=True)
    except Achievement.DoesNotExist:
        return None

    unlocked, created = UserAchievement.objects.get_or_create(user=user, achievement=achievement)
    if not created:
        return unlocked

    if achievement.xp_reward > 0:
        award_xp(
            user,
            achievement.xp_reward,
            reason=XPTransaction.Reason.ACHIEVEMENT,
            reference=f"achievement:{achievement.pk}",
            idempotency_key=f"achievement:{user.pk}:{achievement.pk}",
        )

    return unlocked


def progress_payload(user, *, recent_limit: int = 5) -> dict:
    progress = get_or_create_progress(user)
    completed = UserMaterialProgress.objects.filter(
        user=user,
        status=UserMaterialProgress.Status.COMPLETED,
    ).count()
    attempts = user.quiz_attempts.select_related("material").all()[:recent_limit]

    subject_lives = list(
        subject_lives_map(
            user,
            Subject.objects.select_related("level").all(),
        ).values()
    )

    return {
        **rank_context(user, progress=progress),
        "xp_into_level": progress.xp_into_level,
        "xp_for_next_level": progress.xp_for_next_level,
        "xp_to_next_level": progress.xp_to_next_level,
        "subject_lives": subject_lives,
        "materials_completed": completed,
        "quizzes_submitted": user.quiz_attempts.filter(status="submitted").count(),
        "recent_attempts": attempts,
        "achievements": UserAchievement.objects.filter(user=user).select_related("achievement"),
    }


def calculate_learning_stats(user) -> dict:
    """Menghitung statistik pembelajaran analitis dan penguasaan per mapel."""
    attempts = user.quiz_attempts.filter(status="submitted")
    total_quizzes = attempts.count()
    completed_materials = UserMaterialProgress.objects.filter(
        user=user,
        status=UserMaterialProgress.Status.COMPLETED,
    ).count()

    if total_quizzes > 0:
        avg_score = round(sum(a.percent for a in attempts) / total_quizzes, 1)
        passed_count = sum(1 for a in attempts if a.percent >= 70.0)
        pass_rate = round((passed_count / total_quizzes) * 100, 1)
    else:
        avg_score = 0.0
        pass_rate = 0.0

    subject_stats = []
    subjects = Subject.objects.filter(materials__quiz_attempts__user=user).distinct()
    for sub in subjects:
        sub_attempts = attempts.filter(material__subject=sub)
        sub_count = sub_attempts.count()
        sub_avg = round(sum(a.percent for a in sub_attempts) / sub_count, 1) if sub_count > 0 else 0.0

        if sub_avg >= 80:
            mastery = "Mahir"
        elif sub_avg >= 60:
            mastery = "Berkembang"
        else:
            mastery = "Perlu Latihan"

        sub_materials_done = UserMaterialProgress.objects.filter(
            user=user,
            material__subject=sub,
            status=UserMaterialProgress.Status.COMPLETED,
        ).count()

        subject_stats.append({
            "subject_id": sub.pk,
            "subject_name": sub.name,
            "quizzes_taken": sub_count,
            "avg_score": sub_avg,
            "materials_completed": sub_materials_done,
            "mastery_level": mastery,
        })

    return {
        "total_quizzes": total_quizzes,
        "completed_materials": completed_materials,
        "average_accuracy": avg_score,
        "pass_rate": pass_rate,
        "subject_breakdown": subject_stats,
    }
