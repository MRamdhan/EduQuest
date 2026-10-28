"""Tes pemilihan soal yang diprioritaskan sesuai materi."""

import random

import pytest
from django.contrib.auth import get_user_model

from apps.learning.models import EducationLevel, Material, Question, Subject
from apps.learning.services import quiz_service
from eduquest_logic.question_selector import select_questions

User = get_user_model()


def _question_dict(source_id, difficulty=1, text="Soal?"):
    return {
        "source_id": source_id,
        "jenjang": "SMP",
        "mapel": "IPA",
        "difficulty": difficulty,
        "review_status": "validated",
        "question_text": text,
        "options": [{"key": "A", "text": "A"}, {"key": "B", "text": "B"}],
        "correct_option": "A",
        "explanation": "",
    }


def test_selector_prefers_material_relevance():
    bank = [_question_dict(index) for index in range(1, 9)]
    relevance = {
        1: 0.90,
        2: 0.80,
        3: 0.70,
        4: 0.10,
        5: 0.05,
        6: 0.0,
        7: 0.0,
        8: 0.0,
    }

    selection = select_questions(
        bank,
        jenjang="SMP",
        mapel="IPA",
        target_difficulty=1,
        n=3,
        rng=random.Random(1),
        relevance=relevance,
        min_relevance=0.30,
    )

    assert {q["source_id"] for q in selection.questions} == {1, 2, 3}
    assert not selection.notes


def test_selector_falls_back_and_reports_when_relevant_stock_is_short():
    bank = [_question_dict(index) for index in range(1, 9)]
    relevance = {1: 0.90, **{index: 0.05 for index in range(2, 9)}}

    selection = select_questions(
        bank,
        jenjang="SMP",
        mapel="IPA",
        target_difficulty=1,
        n=3,
        rng=random.Random(1),
        relevance=relevance,
        min_relevance=0.30,
    )

    ids = {q["source_id"] for q in selection.questions}
    assert 1 in ids
    assert len(ids) == 3
    assert any("kurang nyambung" in note for note in selection.notes)


def test_selector_still_works_without_relevance():
    bank = [_question_dict(index) for index in range(1, 5)]

    selection = select_questions(
        bank,
        jenjang="SMP",
        mapel="IPA",
        target_difficulty=1,
        n=2,
        rng=random.Random(1),
    )

    assert len(selection.questions) == 2
    assert not selection.notes


@pytest.mark.django_db
def test_start_quiz_chooses_questions_related_to_material(settings):
    settings.QUIZ_MIN_RELEVANCE = 0.30
    level = EducationLevel.objects.create(code="SMP", name="SMP", order=2)
    subject = Subject.objects.create(level=level, name="IPA", slug="ipa")
    material = Material.objects.create(
        subject=subject,
        title="Fotosintesis",
        slug="smp-ipa-fotosintesis",
        topic="Fotosintesis",
        summary="Proses tumbuhan membuat makanan.",
        content=(
            "# Fotosintesis\n\n"
            "## Proses Fotosintesis\n\n"
            "Fotosintesis adalah proses tumbuhan membuat makanan menggunakan "
            "klorofil pada daun, cahaya matahari, air, dan karbon dioksida. "
            "Hasilnya glukosa dan oksigen."
        ),
        status=Material.Status.PUBLISHED,
    )

    relevant_texts = [
        "Fotosintesis menghasilkan glukosa dan oksigen.",
        "Bagian daun yang mengandung klorofil untuk fotosintesis adalah ....",
        "Gas yang dibutuhkan tumbuhan untuk fotosintesis adalah ....",
        "Fotosintesis membutuhkan cahaya matahari dan air.",
        "Siapa yang melakukan fotosintesis?",
        "Zat hasil fotosintesis yang menjadi makanan tumbuhan adalah ....",
    ]
    unrelated_texts = [
        "Gunung berapi mengeluarkan lava panas ke permukaan.",
        "Lempeng tektonik bergerak menyebabkan gempa bumi.",
        "Magma berada di dalam perut bumi.",
        "Letusan gunung berapi dapat memicu tsunami.",
        "Batuan beku terbentuk dari lava yang mendingin.",
        "Kawah gunung berapi mengeluarkan asap dan abu.",
    ]

    for index, text in enumerate(relevant_texts + unrelated_texts, start=1):
        Question.objects.create(
            source_id=f"rel-{index}",
            level=level,
            subject=subject,
            difficulty=1,
            question_text=text,
            options=[
                {"key": "A", "text": "glukosa"},
                {"key": "B", "text": "lava"},
            ],
            correct_option="A",
            review_status=Question.ReviewStatus.VALIDATED,
        )

    user = User.objects.create_user(username="siswa-rel", password="SiswaKuat2026!")
    result = quiz_service.start_quiz(user, material)

    selected = [question["question_text"] for question in result["attempt"]["questions"]]
    assert len(selected) == 5
    assert all("fotosintesis" in text.lower() for text in selected)
    assert not any("kurang nyambung" in note for note in result["attempt"]["selection_notes"])
