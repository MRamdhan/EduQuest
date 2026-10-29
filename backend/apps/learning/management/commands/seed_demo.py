"""Menyiapkan data awal untuk demo lokal."""

from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import StudentProfile
from apps.learning.constants import ACHIEVEMENTS
from apps.learning.services.content_service import ensure_levels
from apps.progress.constants import RANKS
from apps.progress.models import Achievement, Rank
from apps.progress.services import get_or_create_progress

User = get_user_model()


class Command(BaseCommand):
    help = "Membuat jenjang, achievement, dan akun demo lokal."

    def add_arguments(self, parser):
        parser.add_argument("--no-users", action="store_true", help="Hanya siapkan data referensi.")
        parser.add_argument("--username", default="siswa")
        parser.add_argument("--password", default="siswa12345")
        parser.add_argument("--admin-username", default="admin")
        parser.add_argument("--admin-password", default="admin12345")

    @transaction.atomic
    def handle(self, *args, **options):
        levels = ensure_levels()

        for item in ACHIEVEMENTS:
            Achievement.objects.update_or_create(code=item["code"], defaults=item)

        for item in RANKS:
            Rank.objects.get_or_create(code=item["code"], defaults=item)

        self.stdout.write(self.style.SUCCESS("Jenjang, rank, dan achievement siap."))

        if options["no_users"]:
            return

        student, created = User.objects.get_or_create(
            username=options["username"],
            defaults={"first_name": "Siswa Demo"},
        )
        if created:
            student.set_password(options["password"])
            student.save()
        profile, _ = StudentProfile.objects.get_or_create(user=student)
        if profile.education_level_id is None:
            profile.education_level = levels.get("SMP")
            profile.save(update_fields=["education_level", "updated_at"])
        get_or_create_progress(student)

        admin, admin_created = User.objects.get_or_create(
            username=options["admin_username"],
            defaults={"is_staff": True, "is_superuser": True, "first_name": "Admin"},
        )
        if admin_created:
            admin.set_password(options["admin_password"])
            admin.is_staff = True
            admin.is_superuser = True
            admin.save()

        self.stdout.write(
            self.style.WARNING(
                "Akun demo (hanya untuk lokal):\n"
                f"  siswa: {options['username']} / {options['password']}\n"
                f"  admin: {options['admin_username']} / {options['admin_password']}\n"
                "Ganti kata sandi sebelum deployment."
            )
        )
