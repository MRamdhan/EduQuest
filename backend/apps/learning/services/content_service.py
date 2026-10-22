"""Utilitas konten yang dipakai perintah manajemen."""

from __future__ import annotations

from django.utils.text import slugify

from apps.learning.constants import LEVEL_BY_CODE
from apps.learning.models import EducationLevel, Subject


def ensure_levels() -> dict[str, EducationLevel]:
    levels: dict[str, EducationLevel] = {}
    for code, meta in LEVEL_BY_CODE.items():
        level, _ = EducationLevel.objects.update_or_create(
            code=code,
            defaults={"name": meta["name"], "order": meta["order"]},
        )
        levels[code] = level
    return levels


def get_or_create_subject(level: EducationLevel, name: str) -> Subject:
    subject, _ = Subject.objects.get_or_create(
        level=level,
        slug=slugify(name),
        defaults={"name": name},
    )
    return subject
