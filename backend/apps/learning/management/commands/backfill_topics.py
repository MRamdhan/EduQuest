"""Isi kolom topik soal dari hasil pemetaan IndoMMLU.

Pemetaan topik tersedia di `data/indommlu/core/topic_mapping.jsonl` dengan
field `source_id`, `topic_id`, dan `topic`. Tanpa pemetaan ini, pemilihan soal
hanya mengandalkan kemiripan kata kunci sehingga soal mudah keluar topik.
"""

from __future__ import annotations

import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.learning.models import Question


class Command(BaseCommand):
    help = "Isi topic/topic_code soal dari file topic_mapping.jsonl."

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            type=str,
            default=str(
                settings.BASE_DIR.parent
                / "data"
                / "indommlu"
                / "core"
                / "topic_mapping.jsonl"
            ),
            help="Lokasi file pemetaan topik.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Hitung perubahan tanpa menyimpan.",
        )

    def handle(self, *args, **options):
        path = Path(options["path"])
        if not path.exists():
            raise CommandError(f"File pemetaan topik tidak ditemukan: {path}")

        mapping: dict[str, dict] = {}
        skipped = 0
        with path.open(encoding="utf-8") as handle:
            for line in handle:
                if not line.strip():
                    continue
                try:
                    item = json.loads(line)
                except json.JSONDecodeError:
                    skipped += 1
                    continue
                source_id = item.get("source_id")
                topic_code = str(item.get("topic_id") or "").strip()[:40]
                topic = str(item.get("topic") or "").strip()[:160]
                if source_id is None or not topic_code:
                    skipped += 1
                    continue
                mapping[str(source_id)] = {"topic_code": topic_code, "topic": topic}

        if not mapping:
            raise CommandError("Tidak ada baris pemetaan topik yang valid.")

        questions = {
            question.source_id: question
            for question in Question.objects.filter(source_id__in=mapping.keys())
        }

        updated = unchanged = missing = 0
        pending: list[Question] = []
        for source_id, data in mapping.items():
            question = questions.get(source_id)
            if question is None:
                missing += 1
                continue
            if question.topic_code == data["topic_code"] and question.topic == data["topic"]:
                unchanged += 1
                continue
            question.topic_code = data["topic_code"]
            question.topic = data["topic"]
            pending.append(question)

        if options["dry_run"]:
            self.stdout.write(
                f"[dry-run] {len(pending)} soal akan diperbarui, "
                f"{unchanged} sudah sesuai, {missing} tidak ada di DB, "
                f"{skipped} baris dilewati."
            )
            return

        with transaction.atomic():
            Question.objects.bulk_update(pending, ["topic", "topic_code"], batch_size=500)
        updated = len(pending)

        self.stdout.write(
            self.style.SUCCESS(
                f"Selesai: {updated} soal diperbarui, {unchanged} sudah sesuai, "
                f"{missing} tidak ada di DB, {skipped} baris dilewati."
            )
        )
