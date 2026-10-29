"""Signal untuk menjaga profil siswa tetap ada."""

from __future__ import annotations

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.accounts.models import StudentProfile


@receiver(post_save, sender=settings.AUTH_USER_MODEL, dispatch_uid="accounts.ensure_student_profile")
def ensure_student_profile(sender, instance, created, **kwargs) -> None:
    """Buat profil kosong setiap kali akun baru dibuat."""
    if created:
        StudentProfile.objects.get_or_create(user=instance)
