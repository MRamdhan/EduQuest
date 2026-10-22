"""Baca materi di terminal dan tandai selesai.

Perintah ini memakai service yang sama dengan API, sehingga XP materi
(+15 XP, sekali per materi) benar-benar tersimpan di database.
"""

from __future__ import annotations

import re
import sys

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from apps.learning.models import Material
from apps.progress.models import UserMaterialProgress
from apps.progress.services import complete_material, get_or_create_progress

LEVEL_ORDER = {"SD": 1, "SMP": 2, "SMA": 3}


def clean_markdown(text: str) -> str:
    text = (text or "").replace("\ufffd", "…")
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"`(.+?)`", r"\1", text)
    return text


class Command(BaseCommand):
    help = "Baca satu materi di terminal, lihat prasyarat, dan tandai selesai (+15 XP)."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="siswa", help="Username akun (default: siswa).")
        parser.add_argument("--material", type=int, help="ID materi. Jika kosong, pilih dari daftar.")
        parser.add_argument("--list", action="store_true", help="Hanya tampilkan daftar materi.")

    def handle(self, *args, **options):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, OSError):
            pass

        materials = list(
            Material.objects.filter(status=Material.Status.PUBLISHED)
            .select_related("subject__level")
            .prefetch_related("prerequisites__subject__level")
            .order_by("subject__level__order", "subject__name", "order")
        )
        if not materials:
            raise CommandError(
                "Belum ada materi. Jalankan `python manage.py import_materials` terlebih dahulu."
            )

        if options["list"]:
            self._print_materials(materials)
            return

        user = get_user_model().objects.filter(username=options["username"]).first()
        if not user:
            raise CommandError(
                f"User '{options['username']}' tidak ditemukan. "
                "Jalankan `python manage.py seed_demo` terlebih dahulu."
            )

        material = self._choose_material(materials, options.get("material"))
        progress = get_or_create_progress(user)
        material_progress = UserMaterialProgress.objects.filter(
            user=user,
            material=material,
        ).first()
        is_completed = bool(
            material_progress and material_progress.status == UserMaterialProgress.Status.COMPLETED
        )

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("=" * 66))
        self.stdout.write(self.style.SUCCESS(f"  {material.title}"))
        self.stdout.write(self.style.SUCCESS("=" * 66))
        self.stdout.write(f"Jenjang       : {material.subject.level.name}")
        self.stdout.write(f"Mata pelajaran: {material.subject.name}")
        self.stdout.write(f"Topik         : {material.topic or '-'} ({material.topic_code or '-'})")
        self.stdout.write(f"Estimasi baca : {material.estimated_minutes} menit")
        self.stdout.write(f"Status        : {'SUDAH SELESAI' if is_completed else 'belum selesai'}")
        self.stdout.write(f"XP kamu       : {progress.xp} | Rank: {progress.rank.name if progress.rank else '-'}")
        if material.source:
            self.stdout.write(f"Sumber        : {material.source}")

        prerequisites = list(material.prerequisites.all())
        if prerequisites:
            self.stdout.write("")
            self.stdout.write("Prasyarat:")
            for prerequisite in prerequisites:
                self.stdout.write(
                    f"  - [{prerequisite.pk}] {prerequisite.title} "
                    f"({prerequisite.subject.level.code} {prerequisite.subject.name})"
                )
        else:
            self.stdout.write("Prasyarat     : tidak ada")

        self.stdout.write("")
        self.stdout.write("-" * 66)
        self.stdout.write(clean_markdown(material.content))
        self.stdout.write("-" * 66)

        if is_completed:
            self.stdout.write(
                self.style.WARNING(
                    "Materi ini sudah pernah diselesaikan. XP hanya diberikan sekali per materi."
                )
            )
            return

        try:
            confirm = input("Tandai materi ini selesai dan klaim +15 XP? [y/N]: ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            self.stdout.write("")
            self.stdout.write(self.style.WARNING("Dibatalkan. Materi belum ditandai selesai."))
            return

        if confirm not in {"y", "ya"}:
            self.stdout.write(self.style.WARNING("Dibatalkan. Materi belum ditandai selesai."))
            return

        result = complete_material(user, material)
        updated_progress = result["progress"]
        self.stdout.write("")
        if result["already_completed"]:
            self.stdout.write(self.style.WARNING("Materi sudah selesai sebelumnya. Tidak ada XP baru."))
        else:
            self.stdout.write(
                self.style.SUCCESS(f"Materi selesai! +{result['xp_gained']} XP")
            )
        self.stdout.write(
            f"Total XP: {updated_progress.xp} | Level: {updated_progress.level} "
            f"| Rank: {updated_progress.rank.name if updated_progress.rank else '-'}"
        )

    def _print_materials(self, materials: list[Material]):
        self.stdout.write("")
        self.stdout.write("Materi yang tersedia:")
        current_group = None
        for material in materials:
            group = f"{material.subject.level.code} — {material.subject.name}"
            if group != current_group:
                self.stdout.write("")
                self.stdout.write(self.style.SUCCESS(group))
                current_group = group
            self.stdout.write(f"  [{material.pk:>2}] {material.title} ({material.estimated_minutes} menit)")

    def _choose_material(self, materials: list[Material], material_id: int | None) -> Material:
        if material_id:
            for material in materials:
                if material.pk == material_id:
                    return material
            raise CommandError(f"Materi dengan ID {material_id} tidak ditemukan atau belum terbit.")

        self._print_materials(materials)
        while True:
            raw = input("\nPilih ID materi: ").strip()
            if raw.isdigit():
                for material in materials:
                    if material.pk == int(raw):
                        return material
            self.stdout.write(self.style.ERROR("ID tidak valid. Coba lagi."))
