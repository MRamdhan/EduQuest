from __future__ import annotations

from django.conf import settings
from django.db import models
from django.utils import timezone

from apps.progress.constants import LIFE_REGEN_INTERVAL, MAX_LIVES
from eduquest_logic.gamification import level_from_xp, xp_to_reach_level


class Rank(models.Model):
    """Peringkat pemain. Fleksibel dan dapat diubah lewat admin."""

    code = models.SlugField(max_length=40, unique=True)
    name = models.CharField(max_length=60)
    order = models.PositiveSmallIntegerField(unique=True)
    min_xp = models.PositiveIntegerField(default=0)
    unlocked_difficulty = models.PositiveSmallIntegerField(
        default=1,
        choices=[(1, "Dasar"), (2, "Menengah"), (3, "Lanjut")],
        help_text="Tingkat kuis tertinggi yang terbuka pada rank ini.",
    )
    icon = models.CharField(max_length=20, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Rank"
        verbose_name_plural = "Rank"

    def __str__(self) -> str:
        return self.name

    @classmethod
    def for_xp(cls, xp: int) -> "Rank | None":
        """Rank aktif tertinggi yang sudah dicapai pada jumlah XP tertentu."""
        return (
            cls.objects.filter(is_active=True, min_xp__lte=xp)
            .order_by("-min_xp", "-order")
            .first()
            or cls.objects.filter(is_active=True).order_by("min_xp", "order").first()
        )

    @property
    def next_rank(self) -> "Rank | None":
        return (
            type(self)
            .objects.filter(is_active=True, order__gt=self.order)
            .order_by("order")
            .first()
        )

    def to_payload(self) -> dict:
        return {
            "code": self.code,
            "name": self.name,
            "order": self.order,
            "min_xp": self.min_xp,
            "unlocked_difficulty": self.unlocked_difficulty,
            "icon": self.icon,
            "description": self.description,
        }


class UserProgress(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="progress")
    xp = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Progres pengguna"
        verbose_name_plural = "Progres pengguna"

    def __str__(self) -> str:
        return f"{self.user} — {self.xp} XP"

    @property
    def level(self) -> int:
        return level_from_xp(self.xp)

    @property
    def xp_into_level(self) -> int:
        return self.xp - xp_to_reach_level(self.level)

    @property
    def xp_for_next_level(self) -> int:
        return xp_to_reach_level(self.level + 1) - xp_to_reach_level(self.level)

    @property
    def xp_to_next_level(self) -> int:
        return max(0, xp_to_reach_level(self.level + 1) - self.xp)

    @property
    def rank(self) -> Rank | None:
        return Rank.for_xp(self.xp)

    @property
    def next_rank(self) -> Rank | None:
        current = self.rank
        return current.next_rank if current else None

    @property
    def xp_to_next_rank(self) -> int | None:
        next_rank = self.next_rank
        return max(0, next_rank.min_xp - self.xp) if next_rank else None


class SubjectProgress(models.Model):
    """Nyawa per mata pelajaran, dengan regenerasi satu nyawa per 2 jam."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subject_progress",
    )
    subject = models.ForeignKey(
        "learning.Subject",
        on_delete=models.CASCADE,
        related_name="user_progress",
    )
    lives = models.PositiveSmallIntegerField(default=MAX_LIVES)
    life_regen_started_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Awal interval regenerasi nyawa berikutnya.",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "subject"], name="unique_user_subject_progress"),
        ]
        ordering = ["subject__level__order", "subject__name"]
        indexes = [models.Index(fields=["user", "subject"])]
        verbose_name = "Nyawa mata pelajaran"
        verbose_name_plural = "Nyawa mata pelajaran"

    def __str__(self) -> str:
        return f"{self.user} — {self.subject} — {self.lives}/{MAX_LIVES} nyawa"

    def refresh_lives(self, *, now=None) -> "SubjectProgress":
        """Menambahkan nyawa yang sudah waktunya pulih dan menyimpannya."""
        now = now or timezone.now()
        changed_fields: list[str] = []

        if self.lives >= MAX_LIVES:
            if self.life_regen_started_at is not None:
                self.life_regen_started_at = None
                changed_fields.append("life_regen_started_at")
        elif self.life_regen_started_at is None:
            self.life_regen_started_at = now
            changed_fields.append("life_regen_started_at")
        else:
            elapsed = now - self.life_regen_started_at
            intervals = int(elapsed.total_seconds() // LIFE_REGEN_INTERVAL.total_seconds())
            if intervals > 0:
                self.lives = min(MAX_LIVES, self.lives + intervals)
                if self.lives >= MAX_LIVES:
                    self.life_regen_started_at = None
                else:
                    self.life_regen_started_at = (
                        self.life_regen_started_at + intervals * LIFE_REGEN_INTERVAL
                    )
                changed_fields.extend(["lives", "life_regen_started_at"])

        if changed_fields:
            changed_fields.append("updated_at")
            self.save(update_fields=changed_fields)
        return self

    def lose_life(self, *, now=None, amount: int = 1) -> int:
        """Mengurangi nyawa. Timer tidak di-reset jika regenerasi sudah berjalan."""
        now = now or timezone.now()
        self.refresh_lives(now=now)
        if self.lives <= 0 or amount <= 0:
            return 0

        lost = min(amount, self.lives)
        was_full = self.lives >= MAX_LIVES
        self.lives -= lost
        if was_full or self.life_regen_started_at is None:
            self.life_regen_started_at = now
        self.save(update_fields=["lives", "life_regen_started_at", "updated_at"])
        return lost

    @property
    def next_life_at(self):
        if self.lives >= MAX_LIVES or self.life_regen_started_at is None:
            return None
        return self.life_regen_started_at + LIFE_REGEN_INTERVAL

    @property
    def seconds_to_next_life(self) -> int | None:
        next_life = self.next_life_at
        if next_life is None:
            return None
        return max(0, int((next_life - timezone.now()).total_seconds()))

    def to_payload(self) -> dict:
        return {
            "subject_id": self.subject_id,
            "subject": self.subject.name,
            "subject_slug": self.subject.slug,
            "lives": self.lives,
            "max_lives": MAX_LIVES,
            "life_regen_started_at": self.life_regen_started_at,
            "next_life_at": self.next_life_at,
            "seconds_to_next_life": self.seconds_to_next_life,
        }


class XPTransaction(models.Model):
    class Reason(models.TextChoices):
        CORRECT_ANSWER = "correct_answer", "Jawaban benar"
        MATERIAL_COMPLETE = "material_complete", "Materi selesai"
        ACHIEVEMENT = "achievement", "Pencapaian"
        BONUS = "bonus", "Bonus"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="xp_transactions")
    amount = models.IntegerField()
    reason = models.CharField(max_length=32, choices=Reason.choices)
    reference = models.CharField(max_length=120, blank=True)
    idempotency_key = models.CharField(max_length=120, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Transaksi XP"
        verbose_name_plural = "Transaksi XP"

    def __str__(self) -> str:
        return f"{self.user} {self.amount:+d} XP ({self.reason})"


class UserMaterialProgress(models.Model):
    class Status(models.TextChoices):
        IN_PROGRESS = "in_progress", "Sedang dipelajari"
        COMPLETED = "completed", "Selesai"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="material_progress")
    material = models.ForeignKey("learning.Material", on_delete=models.CASCADE, related_name="user_progress")
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.IN_PROGRESS)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "material"], name="unique_user_material_progress"),
        ]
        ordering = ["-updated_at"]
        verbose_name = "Progres materi"
        verbose_name_plural = "Progres materi"

    def __str__(self) -> str:
        return f"{self.user} — {self.material} — {self.get_status_display()}"


class Achievement(models.Model):
    code = models.SlugField(max_length=80, unique=True)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    xp_reward = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["code"]
        verbose_name = "Pencapaian"
        verbose_name_plural = "Pencapaian"

    def __str__(self) -> str:
        return self.title


class UserAchievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="achievements")
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name="unlocked_by")
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "achievement"], name="unique_user_achievement"),
        ]
        ordering = ["-unlocked_at"]
        verbose_name = "Pencapaian pengguna"
        verbose_name_plural = "Pencapaian pengguna"

    def __str__(self) -> str:
        return f"{self.user} — {self.achievement}"


class AdaptationEvent(models.Model):
    """Jejak keputusan mesin adaptasi agar dapat diaudit."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="adaptation_events")
    material = models.ForeignKey(
        "learning.Material",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="adaptation_events",
    )
    attempt = models.ForeignKey(
        "learning.QuizAttempt",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="adaptation_events",
    )
    previous_difficulty = models.PositiveSmallIntegerField(null=True, blank=True)
    next_difficulty = models.PositiveSmallIntegerField()
    action = models.CharField(max_length=20)
    rule_name = models.CharField(max_length=80)
    reason = models.TextField()
    accuracy = models.FloatField(null=True, blank=True)
    n_used = models.PositiveSmallIntegerField(default=0)
    config = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "material", "-created_at"])]
        verbose_name = "Keputusan adaptasi"
        verbose_name_plural = "Keputusan adaptasi"

    def __str__(self) -> str:
        return f"{self.user} — {self.action} → tingkat {self.next_difficulty}"
