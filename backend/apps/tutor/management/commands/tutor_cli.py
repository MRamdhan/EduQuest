"""Tanya-jawab AI Tutor langsung di terminal.

Perintah ini memakai service yang sama dengan endpoint ``POST /api/tutor/ask/``,
termasuk fallback saat provider tidak tersedia, sehingga percobaan di terminal
mencerminkan perilaku aplikasi. Riwayat percakapan tetap tersimpan di
``TutorConversation`` seperti lewat API.
"""

from __future__ import annotations

import re
import sys
import time

from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.learning.models import Material
from apps.tutor.services.tutor_service import ask_tutor


def clean(text: str) -> str:
    """Rapikan Markdown agar nyaman dibaca di terminal."""
    text = (text or "").replace("\ufffd", "…")
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"(?m)^#{1,6}\s*", "", text)
    text = re.sub(r"(?m)^\s*[-*]\s+", "• ", text)
    return text.strip()


class Command(BaseCommand):
    help = "Tanya AI Tutor di terminal dan lihat jawaban sesuai materi."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="siswa", help="Username akun (default: siswa).")
        parser.add_argument("--material", type=int, help="ID materi. Jika kosong, pilih dari daftar.")
        parser.add_argument(
            "--question",
            help="Kirim satu pertanyaan lalu keluar (tanpa mode interaktif).",
        )

    def handle(self, *args, **options):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, OSError):
            pass

        user = get_user_model().objects.filter(username=options["username"]).first()
        if not user:
            raise CommandError(
                f"User '{options['username']}' tidak ditemukan. "
                "Jalankan `python manage.py seed_demo` terlebih dahulu."
            )

        material = self._choose_material(options.get("material"))

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("=" * 66))
        self.stdout.write(self.style.SUCCESS("  AI TUTOR EDUQUEST"))
        self.stdout.write(self.style.SUCCESS("=" * 66))
        self.stdout.write(f"Materi   : {material.title}")
        self.stdout.write(f"Jenjang  : {material.subject.level.name} — {material.subject.name}")
        self.stdout.write(f"Provider : {settings.AI_PROVIDER or '(tidak dikonfigurasi)'}")
        self.stdout.write(f"Model    : {settings.AI_MODEL or '-'}")
        self.stdout.write("")

        question = (options.get("question") or "").strip()
        if question:
            self._ask(user, material, question)
            return

        self.stdout.write("Ketik pertanyaanmu, lalu Enter. Ketik 'q' untuk keluar.")
        while True:
            try:
                question = input("\nPertanyaan: ").strip()
            except (EOFError, KeyboardInterrupt):
                self.stdout.write("")
                break
            if question.lower() in {"q", "quit", "keluar", "exit"}:
                break
            if not question:
                continue
            if len(question) > settings.AI_MAX_INPUT_CHARS:
                question = question[: settings.AI_MAX_INPUT_CHARS]
                self.stdout.write(
                    self.style.WARNING(
                        f"Pertanyaan dipotong menjadi {settings.AI_MAX_INPUT_CHARS} karakter."
                    )
                )
            self._ask(user, material, question)

        self.stdout.write("Selesai. Percakapan tersimpan di TutorConversation.")

    def _ask(self, user, material: Material, question: str):
        started = time.perf_counter()
        result = ask_tutor(user, material, question)
        elapsed = time.perf_counter() - started

        self.stdout.write("")
        if result["degraded"]:
            self.stdout.write(self.style.WARNING("Mode fallback (tanpa AI):"))
        else:
            self.stdout.write(
                self.style.SUCCESS(f"Tutor ({result['provider']}, {elapsed:.2f}s):")
            )
            self.stdout.write(clean(result["answer"]))

        if result["degraded"]:
            self.stdout.write(clean(result["answer"]))
            self.stdout.write("")
            self.stdout.write(
                self.style.WARNING(
                    "Periksa AI_PROVIDER/AI_API_KEY/AI_MODEL di backend/.env, "
                    "lalu jalankan ulang perintah ini."
                )
            )

        if result.get("suggestions"):
            self.stdout.write("")
            self.stdout.write("Bagian materi yang bisa dibaca ulang:")
            for heading in result["suggestions"]:
                self.stdout.write(f"  • {heading}")

    def _choose_material(self, material_id: int | None) -> Material:
        queryset = Material.objects.filter(status=Material.Status.PUBLISHED).select_related(
            "subject__level"
        )
        if material_id:
            try:
                return queryset.get(pk=material_id)
            except Material.DoesNotExist as exc:
                raise CommandError(f"Materi dengan ID {material_id} tidak ditemukan.") from exc

        materials = list(
            queryset.order_by("subject__level__order", "subject__name", "order")
        )
        if not materials:
            raise CommandError(
                "Belum ada materi. Jalankan `python manage.py import_materials` terlebih dahulu."
            )

        self.stdout.write("")
        self.stdout.write("Materi yang tersedia:")
        for material in materials:
            self.stdout.write(
                f"  [{material.pk:>2}] {material.subject.level.code} "
                f"{material.subject.name} — {material.title}"
            )

        while True:
            try:
                raw = input("\nPilih ID materi: ").strip()
            except (EOFError, KeyboardInterrupt):
                raise CommandError("Dibatalkan.") from None
            if raw.isdigit() and any(m.pk == int(raw) for m in materials):
                return next(m for m in materials if m.pk == int(raw))
            self.stdout.write(self.style.ERROR("ID tidak valid. Coba lagi."))
