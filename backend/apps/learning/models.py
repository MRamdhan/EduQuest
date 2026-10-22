from __future__ import annotations

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify

import markdown

from eduquest_logic.question_selector import ALLOWED_STATUS


class EducationLevel(models.Model):
    """Jenjang pendidikan: SD, SMP, SMA/SMK."""

    code = models.CharField(max_length=8, unique=True)
    name = models.CharField(max_length=32)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "code"]
        verbose_name = "Jenjang"
        verbose_name_plural = "Jenjang"

    def __str__(self) -> str:
        return self.name


class Subject(models.Model):
    """Mata pelajaran pada satu jenjang."""

    level = models.ForeignKey(EducationLevel, on_delete=models.CASCADE, related_name="subjects")
    name = models.CharField(max_length=80)
    slug = models.SlugField(max_length=100)
    icon = models.CharField(max_length=40, blank=True)

    class Meta:
        ordering = ["level__order", "name"]
        constraints = [
            models.UniqueConstraint(fields=["level", "slug"], name="unique_subject_per_level"),
        ]
        verbose_name = "Mata pelajaran"
        verbose_name_plural = "Mata pelajaran"

    def __str__(self) -> str:
        return f"{self.name} ({self.level.code})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Material(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draf"
        PUBLISHED = "published", "Terbit"
        ARCHIVED = "archived", "Diarsipkan"

    subject = models.ForeignKey(Subject, on_delete=models.PROTECT, related_name="materials")
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    topic = models.CharField(max_length=160, blank=True)
    topic_code = models.CharField(max_length=40, blank=True, db_index=True)
    summary = models.TextField(blank=True)
    content = models.TextField(help_text="Isi materi dalam format Markdown.")
    source = models.CharField(max_length=255, blank=True)
    estimated_minutes = models.PositiveSmallIntegerField(default=10)
    order = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PUBLISHED)
    prerequisites = models.ManyToManyField(
        "self",
        through="MaterialPrerequisite",
        symmetrical=False,
        related_name="required_by",
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["subject__level__order", "subject__name", "order", "title"]
        indexes = [models.Index(fields=["subject", "status"])]
        verbose_name = "Materi"
        verbose_name_plural = "Materi"

    def __str__(self) -> str:
        return self.title

    @property
    def level(self) -> EducationLevel:
        return self.subject.level

    @property
    def content_html(self) -> str:
        return markdown.markdown(
            self.content,
            extensions=["tables", "fenced_code", "sane_lists"],
            output_format="html",
        )

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(f"{self.subject.level.code}-{self.subject.name}-{self.title}")
            self.slug = base[:200]
        super().save(*args, **kwargs)


class MaterialPrerequisite(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name="prerequisite_links")
    prerequisite = models.ForeignKey(Material, on_delete=models.CASCADE, related_name="dependent_links")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["material", "prerequisite"], name="unique_material_prerequisite"),
        ]
        verbose_name = "Prasyarat materi"
        verbose_name_plural = "Prasyarat materi"

    def clean(self):
        if self.material_id == self.prerequisite_id:
            raise ValidationError("Materi tidak boleh menjadi prasyarat dirinya sendiri.")

    def __str__(self) -> str:
        return f"{self.material} ← {self.prerequisite}"


class Question(models.Model):
    """Soal pilihan ganda. Kunci jawaban tidak boleh keluar sebelum soal selesai."""

    class ReviewStatus(models.TextChoices):
        IMPORTED = "imported", "Diimpor"
        VALIDATED = "validated", "Tervalidasi"
        REVIEWED = "reviewed", "Ditinjau"
        PUBLISHED = "published", "Terbit"
        REJECTED = "rejected", "Ditolak"

    source_id = models.CharField(max_length=64, unique=True)
    source_dataset = models.CharField(max_length=80, blank=True)
    source_title = models.CharField(max_length=255, blank=True)
    license = models.CharField(max_length=80, blank=True)

    level = models.ForeignKey(EducationLevel, on_delete=models.PROTECT, related_name="questions")
    subject = models.ForeignKey(Subject, on_delete=models.PROTECT, related_name="questions")
    kelas = models.PositiveSmallIntegerField(null=True, blank=True)
    mapel_asli = models.CharField(max_length=80, blank=True)
    topic = models.CharField(max_length=160, blank=True)
    concept_tags = models.JSONField(default=list, blank=True)

    difficulty = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        choices=[(1, "Dasar"), (2, "Menengah"), (3, "Lanjut")],
    )
    difficulty_source = models.CharField(max_length=80, blank=True)
    question_type = models.CharField(max_length=40, default="multiple_choice")
    question_text = models.TextField()
    options = models.JSONField(default=list, help_text='[{"key": "A", "text": "..."}]')
    correct_option = models.CharField(max_length=4)
    explanation = models.TextField(blank=True)
    hint = models.TextField(
        blank=True,
        help_text="Petunjuk manual opsional. Jika kosong, sistem memakai AI/aturan.",
    )
    needs_passage_flag = models.BooleanField(default=False)

    source_domain = models.CharField(max_length=120, blank=True)
    source_risk = models.CharField(max_length=80, blank=True)
    review_status = models.CharField(
        max_length=16,
        choices=ReviewStatus.choices,
        default=ReviewStatus.IMPORTED,
        db_index=True,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]
        indexes = [
            models.Index(fields=["subject", "difficulty", "review_status"]),
        ]
        verbose_name = "Soal"
        verbose_name_plural = "Soal"

    def __str__(self) -> str:
        return f"[{self.pk}] {self.question_text[:60]}"

    @property
    def is_selectable(self) -> bool:
        return self.is_active and self.review_status in ALLOWED_STATUS

    def clean(self):
        if not isinstance(self.options, list) or len(self.options) < 2:
            raise ValidationError({"options": "Soal membutuhkan minimal dua opsi."})
        keys = [str(option.get("key", "")).strip().upper() for option in self.options]
        if len(keys) != len(set(keys)):
            raise ValidationError({"options": "Kunci opsi tidak boleh duplikat."})
        if self.correct_option.strip().upper() not in keys:
            raise ValidationError({"correct_option": "Kunci jawaban harus salah satu opsi."})

    def selection_dict(self) -> dict:
        """Format yang dipakai modul logika murni (eduquest_logic)."""
        return {
            "source_id": self.pk,
            "jenjang": self.level.code,
            "mapel": self.subject.name,
            "difficulty": self.difficulty,
            "review_status": self.review_status,
            "question_text": self.question_text,
            "options": self.options,
            "correct_option": self.correct_option,
            "explanation": self.explanation,
        }


class QuestionReport(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "Terbuka"
        REVIEWED = "reviewed", "Ditinjau"
        RESOLVED = "resolved", "Selesai"

    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="reports")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="question_reports")
    reason = models.CharField(max_length=40, default="other")
    note = models.TextField(blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Laporan soal"
        verbose_name_plural = "Laporan soal"


class QuestionGeneration(models.Model):
    """Jejak audit generator soal AI (fitur fase berikutnya)."""

    material = models.ForeignKey(Material, null=True, blank=True, on_delete=models.SET_NULL, related_name="generations")
    provider = models.CharField(max_length=80, blank=True)
    model_name = models.CharField(max_length=120, blank=True)
    prompt_summary = models.TextField(blank=True)
    raw_output = models.TextField(blank=True)
    status = models.CharField(max_length=24, default="draft")
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Audit generator soal"
        verbose_name_plural = "Audit generator soal"


class QuizAttempt(models.Model):
    class Status(models.TextChoices):
        IN_PROGRESS = "in_progress", "Sedang berjalan"
        SUBMITTED = "submitted", "Sudah dikirim"
        EXPIRED = "expired", "Kedaluwarsa"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="quiz_attempts")
    material = models.ForeignKey(Material, null=True, blank=True, on_delete=models.SET_NULL, related_name="quiz_attempts")
    target_difficulty = models.PositiveSmallIntegerField(default=1)
    selection_fallback = models.BooleanField(default=False)
    selection_notes = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.IN_PROGRESS)

    total_questions = models.PositiveSmallIntegerField(default=0)
    correct_count = models.PositiveSmallIntegerField(default=0)
    wrong_count = models.PositiveSmallIntegerField(default=0)
    unanswered_count = models.PositiveSmallIntegerField(default=0)
    percent = models.FloatField(default=0)
    xp_gained = models.PositiveIntegerField(default=0)
    lives_lost = models.PositiveSmallIntegerField(default=0)
    ended_early = models.BooleanField(default=False)

    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["user", "material"]),
        ]
        verbose_name = "Percobaan kuis"
        verbose_name_plural = "Percobaan kuis"

    def __str__(self) -> str:
        return f"Kuis #{self.pk} — {self.user} — {self.get_status_display()}"


class QuizQuestion(models.Model):
    """Soal yang benar-benar disajikan pada satu percobaan kuis.

    Menyimpan snapshot tingkat kesulitan agar penilaian tidak berubah jika
    metadata soal diedit setelah kuis dimulai.
    """

    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name="quiz_questions")
    question = models.ForeignKey(Question, on_delete=models.PROTECT, related_name="quiz_questions")
    order = models.PositiveSmallIntegerField()
    difficulty = models.PositiveSmallIntegerField(null=True, blank=True)
    selected_option = models.CharField(max_length=4, blank=True)
    is_correct = models.BooleanField(null=True, blank=True)
    answered_at = models.DateTimeField(null=True, blank=True)

    attempts = models.PositiveSmallIntegerField(default=0)
    is_resolved = models.BooleanField(default=False)
    hint_used = models.BooleanField(default=False)
    hint_text = models.TextField(blank=True)
    hint_source = models.CharField(max_length=20, blank=True)

    class Meta:
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(fields=["attempt", "question"], name="unique_question_per_attempt"),
            models.UniqueConstraint(fields=["attempt", "order"], name="unique_order_per_attempt"),
        ]
        verbose_name = "Soal kuis"
        verbose_name_plural = "Soal kuis"

    def __str__(self) -> str:
        return f"{self.attempt_id}:{self.order}"
