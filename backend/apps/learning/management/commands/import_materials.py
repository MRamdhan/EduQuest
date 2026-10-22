"""Impor materi Markdown dari folder content/ ke database."""

from __future__ import annotations

import re
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify

from apps.learning.models import Material
from apps.learning.services.content_service import ensure_levels, get_or_create_subject


def _extract(pattern: str, text: str, default: str = "") -> str:
    match = re.search(pattern, text, flags=re.MULTILINE)
    return match.group(1).strip() if match else default


def parse_material(path: Path) -> dict:
    text = path.read_text(encoding="utf-8-sig")
    lines = text.splitlines()

    title = _extract(r"^#\s+(.+)$", text, default=path.stem.replace("_", " ").title())
    topic_code = _extract(r"\*\*ID Topik:\*\*\s*(.+)$", text)
    source = _extract(r"\*\*Referensi:\*\*\s*(.+)$", text)[:255]

    body_lines = lines[1:] if lines and lines[0].startswith("# ") else lines
    for index, line in enumerate(body_lines[:20]):
        if line.strip() == "---":
            body_lines = body_lines[index + 1 :]
            break
    content = "\n".join(body_lines).strip()

    plain = re.sub(r"^#{1,6}\s*", "", content, flags=re.MULTILINE)
    paragraphs = [
        block.strip()
        for block in plain.split("\n\n")
        if block.strip() and not block.lstrip().startswith(("|", "-", "*", ">"))
    ]
    summary = re.sub(r"\s+", " ", paragraphs[0])[:280] if paragraphs else ""
    word_count = len(re.findall(r"\w+", plain))
    estimated_minutes = max(5, round(word_count / 160))

    order_match = re.search(r"(\d+)$", topic_code)
    return {
        "title": title,
        "slug": slugify(path.stem)[:220],
        "topic": title[:160],
        "topic_code": topic_code[:40],
        "summary": summary,
        "content": content,
        "source": source,
        "estimated_minutes": estimated_minutes,
        "order": int(order_match.group(1)) if order_match else 0,
    }


class Command(BaseCommand):
    help = "Impor materi Markdown dari content/materi/<jenjang>/<mapel>/*.md."

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            type=str,
            default=str(settings.BASE_DIR.parent / "content" / "materi"),
            help="Folder akar materi Markdown.",
        )
        parser.add_argument("--dry-run", action="store_true", help="Tampilkan hasil tanpa menulis DB.")

    def handle(self, *args, **options):
        root = Path(options["path"])
        if not root.exists():
            raise CommandError(f"Folder materi tidak ditemukan: {root}")

        files = sorted(root.rglob("*.md"))
        if not files:
            raise CommandError(f"Tidak ada file .md di {root}")

        created = updated = 0
        levels = ensure_levels()

        for path in files:
            relative = path.relative_to(root)
            parts = relative.parts
            if len(parts) < 3:
                self.stderr.write(f"Lewati (struktur folder tidak dikenali): {relative}")
                continue

            level_code = parts[0].upper()
            if level_code not in levels:
                self.stderr.write(f"Lewati (jenjang tidak dikenal): {relative}")
                continue

            subject_name = parts[1]
            data = parse_material(path)
            if not data["content"]:
                self.stderr.write(f"Lewati (isi kosong): {relative}")
                continue

            if options["dry_run"]:
                self.stdout.write(f"[dry-run] {level_code}/{subject_name}: {data['title']}")
                continue

            with transaction.atomic():
                subject = get_or_create_subject(levels[level_code], subject_name)
                _, was_created = Material.objects.update_or_create(
                    slug=data["slug"],
                    defaults={
                        **{k: v for k, v in data.items() if k != "slug"},
                        "subject": subject,
                        "status": Material.Status.PUBLISHED,
                    },
                )
            if was_created:
                created += 1
            else:
                updated += 1

        if options["dry_run"]:
            self.stdout.write(self.style.SUCCESS(f"Selesai simulasi: {len(files)} file."))
            return

        self.stdout.write(
            self.style.SUCCESS(f"Selesai: {created} materi baru, {updated} diperbarui.")
        )
