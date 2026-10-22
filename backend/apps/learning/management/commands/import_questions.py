"""Impor bank soal JSONL ke database."""

from __future__ import annotations

import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.learning.models import Question
from apps.learning.services.content_service import ensure_levels, get_or_create_subject

REVIEW_STATUSES = {choice.value for choice in Question.ReviewStatus}


class Command(BaseCommand):
    help = "Impor bank soal JSONL (default: data/indommlu/core/bank_inti.jsonl)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            type=str,
            default=str(settings.BASE_DIR.parent / "data" / "indommlu" / "core" / "bank_inti.jsonl"),
            help="Lokasi file JSONL.",
        )
        parser.add_argument("--limit", type=int, default=0, help="Batasi jumlah baris (0 = semua).")
        parser.add_argument(
            "--status",
            type=str,
            default=Question.ReviewStatus.VALIDATED.value,
            help="Status tinjauan fallback jika data tidak menyertakannya.",
        )

    def handle(self, *args, **options):
        path = Path(options["path"])
        if not path.exists():
            raise CommandError(f"File bank soal tidak ditemukan: {path}")
        if options["status"] not in REVIEW_STATUSES:
            raise CommandError(f"Status tidak valid: {options['status']}")

        levels = ensure_levels()
        created = updated = skipped = processed = 0

        with path.open(encoding="utf-8") as handle, transaction.atomic():
            for line_number, line in enumerate(handle, start=1):
                if not line.strip():
                    continue
                if options["limit"] and processed >= options["limit"]:
                    break

                try:
                    item = json.loads(line)
                except json.JSONDecodeError:
                    skipped += 1
                    continue

                source_id = item.get("source_id")
                level_code = str(item.get("jenjang", "")).upper()
                subject_name = str(item.get("mapel", "")).strip()
                question_text = str(item.get("question_text", "")).strip()
                options_list = item.get("options") or []
                correct_option = str(item.get("correct_option", "")).strip().upper()

                keys = [
                    str(option.get("key", "")).strip().upper()
                    for option in options_list
                    if isinstance(option, dict)
                ]
                valid = (
                    source_id is not None
                    and level_code in levels
                    and subject_name
                    and question_text
                    and isinstance(options_list, list)
                    and len(options_list) >= 2
                    and len(keys) == len(set(keys))
                    and correct_option in keys
                )
                if not valid:
                    skipped += 1
                    continue

                subject = get_or_create_subject(levels[level_code], subject_name)
                difficulty = item.get("difficulty")
                if difficulty not in (1, 2, 3):
                    difficulty = None
                review_status = item.get("review_status")
                if review_status not in REVIEW_STATUSES:
                    review_status = options["status"]

                defaults = {
                    "source_dataset": str(item.get("source_dataset", ""))[:80],
                    "source_title": str(item.get("source_title", ""))[:255],
                    "license": str(item.get("license", ""))[:80],
                    "level": levels[level_code],
                    "subject": subject,
                    "kelas": item.get("kelas") if isinstance(item.get("kelas"), int) else None,
                    "mapel_asli": str(item.get("mapel_asli", ""))[:80],
                    "topic": str(item.get("topic") or "")[:160],
                    "concept_tags": item.get("concept_tags") or [],
                    "difficulty": difficulty,
                    "difficulty_source": str(item.get("difficulty_source", ""))[:80],
                    "question_type": str(item.get("question_type", "multiple_choice"))[:40],
                    "question_text": question_text,
                    "options": options_list,
                    "correct_option": correct_option,
                    "explanation": str(item.get("explanation") or ""),
                    "needs_passage_flag": bool(item.get("needs_passage_flag", False)),
                    "source_domain": str(item.get("source_domain", ""))[:120],
                    "source_risk": str(item.get("source_risk", ""))[:80],
                    "review_status": review_status,
                }

                _, was_created = Question.objects.update_or_create(
                    source_id=str(source_id),
                    defaults=defaults,
                )
                processed += 1
                created += int(was_created)
                updated += int(not was_created)

                if processed % 500 == 0:
                    self.stdout.write(f"  ... {processed} soal diproses")

        self.stdout.write(
            self.style.SUCCESS(
                f"Selesai: {created} soal baru, {updated} diperbarui, {skipped} dilewati."
            )
        )
