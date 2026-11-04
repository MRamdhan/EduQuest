"""Model profil akun siswa."""

from __future__ import annotations

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from apps.learning.constants import is_valid_kelas


class StudentProfile(models.Model):
    """Data tambahan akun siswa, terpisah dari tabel User bawaan Django.

    Jenjang dipakai untuk menyesuaikan materi yang ditampilkan dan sebagai
    konteks awal AI Tutor. Profil dibuat otomatis lewat signal saat user baru
    dibuat, sehingga kode lama yang hanya membuat User tetap berjalan.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    education_level = models.ForeignKey(
        "learning.EducationLevel",
        on_delete=models.SET_NULL,
        related_name="students",
        null=True,
        blank=True,
        verbose_name="Jenjang",
    )
    kelas = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        verbose_name="Kelas",
        help_text="Kelas 1-12 sesuai jenjang siswa.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profil siswa"
        verbose_name_plural = "Profil siswa"

    def __str__(self) -> str:
        jenjang = self.education_level.code if self.education_level else "-"
        kelas = f" kelas {self.kelas}" if self.kelas else ""
        return f"Profil {self.user.username} ({jenjang}{kelas})"

    def clean(self):
        super().clean()
        if self.kelas is None:
            return
        if not 1 <= self.kelas <= 12:
            raise ValidationError({"kelas": "Kelas harus berada di antara 1 dan 12."})
        if self.education_level_id is None:
            raise ValidationError({"kelas": "Pilih jenjang sebelum memilih kelas."})
        if not is_valid_kelas(
            self.education_level.code,
            self.kelas,
        ):
            raise ValidationError(
                {
                    "kelas": (
                        f"Kelas {self.kelas} tidak sesuai untuk jenjang "
                        f"{self.education_level.name}."
                    )
                }
            )
