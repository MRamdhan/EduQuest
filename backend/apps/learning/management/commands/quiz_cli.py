"""Kuis interaktif di terminal untuk mencoba alur backend.

Jawaban dinilai oleh service yang sama dengan API, sehingga XP, nyawa per
mata pelajaran, hint, dan keputusan adaptasi benar-benar tersimpan.
"""

from __future__ import annotations

import sys

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from apps.core.errors import DomainError, InvalidAnswerPayload
from apps.learning.constants import QUIZ_LEVEL_LABELS
from apps.learning.models import Material
from apps.learning.services import quiz_service
from apps.progress.services import get_or_create_progress


def clean(text: str) -> str:
    return (text or "").replace("\ufffd", "…")


class Command(BaseCommand):
    help = "Ikuti kuis 5 soal langsung di terminal dengan hint dan nyawa per mapel."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="siswa", help="Username akun (default: siswa).")
        parser.add_argument("--material", type=int, help="ID materi. Jika kosong, pilih dari daftar.")
        parser.add_argument(
            "--difficulty",
            type=int,
            choices=[1, 2, 3],
            help="Pilih tingkat kuis (1=Dasar, 2=Menengah, 3=Lanjut).",
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

        try:
            result = quiz_service.start_quiz(
                user,
                material,
                requested_difficulty=options.get("difficulty"),
            )
        except DomainError as exc:
            raise CommandError(str(exc)) from exc

        attempt = result["attempt"]
        attempt_id = attempt["id"]
        questions_by_id = {question["id"]: question for question in attempt["questions"]}
        total_questions = len(attempt["questions"])

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("=" * 66))
        self.stdout.write(self.style.SUCCESS("  KUIS EDUQUEST"))
        self.stdout.write(self.style.SUCCESS("=" * 66))
        self.stdout.write(f"Materi      : {material.title}")
        self.stdout.write(f"Jenjang     : {material.subject.level.name} — {material.subject.name}")
        self.stdout.write(
            f"Tingkat     : {attempt['target_difficulty']} "
            f"({QUIZ_LEVEL_LABELS.get(attempt['target_difficulty'], '-')})"
        )
        self.stdout.write(f"Nyawa       : {result['lives']}/{result['max_lives']}")
        self.stdout.write(f"Total XP    : {result['total_xp']}")
        if result.get("rank"):
            self.stdout.write(
                f"Rank        : {result['rank']['name']} "
                f"(maks. tingkat {result['unlocked_difficulty']})"
            )
        if result.get("next_rank"):
            self.stdout.write(
                f"Rank berikut: {result['next_rank']['name']} "
                f"({result['xp_to_next_rank']} XP lagi)"
            )
        if result.get("reused"):
            self.stdout.write(self.style.WARNING("Melanjutkan sesi kuis yang masih berjalan."))
        if attempt.get("selection_notes"):
            for note in attempt["selection_notes"]:
                self.stdout.write(self.style.WARNING(f"Catatan: {note}"))
        self.stdout.write("")
        self.stdout.write("Jawab dengan A, B, C, atau D.")
        self.stdout.write("Jika salah, kamu akan mendapat satu hint dan boleh mencoba lagi.")
        self.stdout.write("")

        current = next(
            (question for question in attempt["questions"] if not question["is_resolved"]),
            None,
        )
        answered_count = 0
        while current is not None:
            self._print_question(current, total_questions)
            keys = {option["key"].upper() for option in current["options"]}
            raw = self._ask_answer(keys)
            if raw is None:
                self.stdout.write(
                    self.style.WARNING(
                        "Kuis dihentikan. Sesi tetap tersimpan dan bisa dilanjutkan nanti."
                    )
                )
                return

            try:
                answer = quiz_service.answer_question(
                    user,
                    attempt_id,
                    current["id"],
                    raw,
                )
            except InvalidAnswerPayload as exc:
                self.stdout.write(self.style.ERROR(str(exc)))
                continue
            except DomainError as exc:
                raise CommandError(str(exc)) from exc

            answered_count += 1
            self.stdout.write("")
            self.stdout.write(
                f"Nyawa {material.subject.name}: "
                f"{answer['lives']}/{answer['max_lives']}"
            )

            if answer["retry"]:
                self.stdout.write(self.style.WARNING("Belum tepat. Nyawa berkurang 1."))
                self.stdout.write(self.style.SUCCESS(f"Hint: {clean(answer['hint'])}"))
                current = answer.get("next_question")
                continue

            if answer["correct"]:
                self.stdout.write(
                    self.style.SUCCESS(f"Benar! +{answer['xp_gained']} XP")
                )
            elif answer["revealed"]:
                self.stdout.write(self.style.ERROR("Belum tepat. Nyawa berkurang 1."))
                self.stdout.write(
                    f"Kunci jawaban: {answer.get('correct_option') or '-'}"
                )
                if answer.get("explanation"):
                    self.stdout.write(f"Penjelasan: {clean(answer['explanation'])}")

            if answer.get("summary"):
                self._print_result(answer["summary"], questions_by_id, user)
                return

            current = answer.get("next_question")

        self.stdout.write("")
        self.stdout.write(self.style.WARNING("Tidak ada soal yang bisa dikerjakan."))
        self.stdout.write(f"Jawaban diproses: {answered_count}")

    def _ask_answer(self, keys: set[str]) -> str | None:
        while True:
            try:
                raw = input("\nJawabanmu (q untuk keluar): ").strip().upper()
            except (EOFError, KeyboardInterrupt):
                self.stdout.write("")
                return None
            if raw == "Q":
                return None
            if raw in keys:
                return raw
            self.stdout.write(
                self.style.ERROR(
                    f"Pilihan tidak valid. Gunakan salah satu: {', '.join(sorted(keys))}."
                )
            )

    def _print_question(self, question: dict, total: int):
        self.stdout.write("-" * 66)
        status = "kesempatan kedua" if question.get("attempts", 0) > 0 else "soal baru"
        self.stdout.write(f"Soal {question['order']} dari {total} — {status}")
        self.stdout.write(clean(question["question_text"]))
        if question.get("hint"):
            self.stdout.write("")
            self.stdout.write(self.style.SUCCESS(f"Hint: {clean(question['hint'])}"))
        self.stdout.write("")
        for option in question["options"]:
            self.stdout.write(f"  {option['key']}. {clean(option['text'])}")

    def _print_result(self, summary: dict, questions_by_id: dict, user):
        score = summary["score"]
        reward = summary["reward"]
        adaptation = summary["adaptation"]
        progress = get_or_create_progress(user)

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("=" * 66))
        self.stdout.write(self.style.SUCCESS("  HASIL KUIS"))
        self.stdout.write(self.style.SUCCESS("=" * 66))
        self.stdout.write(
            f"Skor        : {score['correct']}/{score['total']} benar "
            f"({score['percent']}%)"
        )
        self.stdout.write(f"XP didapat  : +{reward['xp_gained']} XP")
        self.stdout.write(f"Nyawa       : {reward['lives']}/3")
        self.stdout.write(
            f"Level       : {reward['level_before']} → {reward['level_after']}"
            + ("  (NAIK LEVEL!)" if reward["leveled_up"] else "")
        )
        rank = progress.rank
        if rank:
            self.stdout.write(f"Rank        : {rank.name}")
        if reward["ended_early"]:
            self.stdout.write(self.style.WARNING("Sesi berhenti lebih awal karena nyawa habis."))
        if score["unanswered"]:
            self.stdout.write(self.style.WARNING(f"{score['unanswered']} soal tidak dijawab."))

        if adaptation:
            self.stdout.write("")
            self.stdout.write(self.style.SUCCESS("Keputusan adaptasi:"))
            self.stdout.write(f"  Tindakan  : {adaptation['action']}")
            self.stdout.write(
                f"  Tingkat   : {adaptation['previous_difficulty']} → "
                f"{adaptation['next_difficulty']}"
            )
            self.stdout.write(f"  Alasan    : {adaptation['reason']}")

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("Pembahasan:"))
        for answer in summary["answers"]:
            question = questions_by_id.get(answer["question_id"], {})
            if answer["is_correct"] is True:
                status = self.style.SUCCESS("BENAR")
            elif answer["is_correct"] is False:
                status = self.style.ERROR("SALAH")
            else:
                status = self.style.WARNING("TIDAK DIJAWAB")

            chosen = answer["selected_option"] or "-"
            self.stdout.write("")
            self.stdout.write(
                f"{answer['order']}. [{status}] Jawabanmu: {chosen} | "
                f"Kunci: {answer['correct_option']}"
            )
            if question.get("question_text"):
                self.stdout.write(f"   {clean(question['question_text'])}")
            if answer.get("explanation"):
                self.stdout.write(f"   Penjelasan: {clean(answer['explanation'])}")

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("Selesai! XP dan progres sudah tersimpan."))

    def _choose_material(self, material_id: int | None) -> Material:
        if material_id:
            try:
                return Material.objects.select_related("subject__level").get(
                    pk=material_id,
                    status=Material.Status.PUBLISHED,
                )
            except Material.DoesNotExist as exc:
                raise CommandError(f"Materi dengan ID {material_id} tidak ditemukan.") from exc

        materials = list(
            Material.objects.filter(status=Material.Status.PUBLISHED)
            .select_related("subject__level")
            .order_by("subject__level__order", "subject__name", "order")
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
            raw = input("\nPilih ID materi: ").strip()
            if raw.isdigit() and any(m.pk == int(raw) for m in materials):
                return next(m for m in materials if m.pk == int(raw))
            self.stdout.write(self.style.ERROR("ID tidak valid. Coba lagi."))
