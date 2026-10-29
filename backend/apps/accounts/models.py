"""Model profil akun siswa."""

from __future__ import annotations

from django.conf import settings
from django.db import models


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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profil siswa"
        verbose_name_plural = "Profil siswa"

    def __str__(self) -> str:
        jenjang = self.education_level.code if self.education_level else "-"
        return f"Profil {self.user.username} ({jenjang})"
