"""Tes command pengisian topik soal."""

import json

import pytest
from django.core.management import call_command

from apps.learning.models import EducationLevel, Question, Subject


def _question(source_id: str, level, subject):
    return Question.objects.create(
        source_id=source_id,
        level=level,
        subject=subject,
        difficulty=1,
        question_text="Soal uji?",
        options=[{"key": "A", "text": "A"}, {"key": "B", "text": "B"}],
        correct_option="A",
        review_status=Question.ReviewStatus.VALIDATED,
    )


@pytest.fixture
def subject(db):
    level = EducationLevel.objects.create(code="SMP", name="SMP", order=2)
    return Subject.objects.create(level=level, name="IPA", slug="ipa")


def _write_mapping(tmp_path, rows):
    path = tmp_path / "topic_mapping.jsonl"
    path.write_text(
        "\n".join(json.dumps(row) for row in rows) + "\n",
        encoding="utf-8",
    )
    return path


@pytest.mark.django_db
def test_backfill_topics_fills_topic_fields(tmp_path, subject):
    question = _question("101", subject.level, subject)
    path = _write_mapping(
        tmp_path,
        [
            {"source_id": 101, "topic_id": "SMP-IPA-15", "topic": "Tata Surya dan Bumi"},
            {"source_id": 999, "topic_id": "SMP-IPA-01", "topic": "Besaran"},
            {"source_id": 202, "topic_id": None, "topic": None},
        ],
    )

    call_command("backfill_topics", path=str(path))

    question.refresh_from_db()
    assert question.topic_code == "SMP-IPA-15"
    assert question.topic == "Tata Surya dan Bumi"


@pytest.mark.django_db
def test_backfill_topics_dry_run_does_not_save(tmp_path, subject):
    question = _question("102", subject.level, subject)
    path = _write_mapping(
        tmp_path,
        [{"source_id": 102, "topic_id": "SMP-IPA-15", "topic": "Tata Surya dan Bumi"}],
    )

    call_command("backfill_topics", path=str(path), dry_run=True)

    question.refresh_from_db()
    assert question.topic_code == ""
    assert question.topic == ""
