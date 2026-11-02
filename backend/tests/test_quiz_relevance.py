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


def test_selector_returns_fewer_questions_instead_of_padding():
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

    assert [q["source_id"] for q in selection.questions] == [1]
    assert selection.shortage == 2
    assert any("Hanya 1 dari 3 soal tersedia" in note for note in selection.notes)


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


@pytest.mark.django_db
def test_topic_mapping_overrides_keyword_similarity():
    level = EducationLevel.objects.create(code="SMP", name="SMP", order=2)
    subject = Subject.objects.create(level=level, name="IPA", slug="ipa")
    material = Material.objects.create(
        subject=subject,
        title="Tata Surya dan Bumi",
        slug="smp-ipa-tata-surya",
        topic="Tata Surya dan Bumi",
        topic_code="SMP-IPA-15",
        content="Materi tentang planet, matahari, rotasi, dan revolusi bumi.",
        status=Material.Status.PUBLISHED,
    )

    # Teksnya sangat mirip materi, tetapi kode topiknya lain (Gerak dan Gaya).
    for index in range(1, 6):
        Question.objects.create(
            source_id=f"topic-other-{index}",
            level=level,
            subject=subject,
            difficulty=1,
            topic="Gerak dan Gaya",
            topic_code="SMP-IPA-04",
            question_text=f"Planet dan matahari pada soal mirip materi nomor {index}?",
            options=[{"key": "A", "text": "A"}, {"key": "B", "text": "B"}],
            correct_option="A",
            review_status=Question.ReviewStatus.VALIDATED,
        )

    for index in range(1, 4):
        Question.objects.create(
            source_id=f"topic-match-{index}",
            level=level,
            subject=subject,
            difficulty=1,
            topic="Tata Surya dan Bumi",
            topic_code="SMP-IPA-15",
            question_text=f"Soal tata surya nomor {index}?",
            options=[{"key": "A", "text": "A"}, {"key": "B", "text": "B"}],
            correct_option="A",
            review_status=Question.ReviewStatus.VALIDATED,
        )

    user = User.objects.create_user(username="siswa-topic", password="SiswaKuat2026!")
    result = quiz_service.start_quiz(user, material)

    selected = result["attempt"]["questions"]
    assert len(selected) == 3
    assert all(question["question_text"].startswith("Soal tata surya") for question in selected)
    assert any("Hanya 3 dari 5 soal tersedia" in note for note in result["attempt"]["selection_notes"])


@pytest.mark.django_db
def test_material_relevance_uses_topic_codes():
    level = EducationLevel.objects.create(code="SMP", name="SMP", order=2)
    subject = Subject.objects.create(level=level, name="IPA", slug="ipa")
    material = Material.objects.create(
        subject=subject,
        title="Tata Surya",
        slug="smp-ipa-tata-surya-2",
        topic="Tata Surya dan Bumi",
        topic_code="SMP-IPA-15",
        content="Planet, matahari, rotasi, revolusi.",
        status=Material.Status.PUBLISHED,
    )

    def make(source_id, topic_code, text):
        return Question.objects.create(
            source_id=source_id,
            level=level,
            subject=subject,
            difficulty=1,
            topic=topic_code,
            topic_code=topic_code,
            question_text=text,
            options=[{"key": "A", "text": "A"}, {"key": "B", "text": "B"}],
            correct_option="A",
            review_status=Question.ReviewStatus.VALIDATED,
        )

    matching = make("rel-topic-1", "SMP-IPA-15", "Planet terdekat dari matahari?")
    other = make("rel-topic-2", "SMP-IPA-04", "Planet dan matahari pada gerak benda?")
    unmapped = make("rel-topic-3", "", "Planet dan matahari tanpa topik?")

    relevance = quiz_service._material_relevance(
        Question.objects.filter(subject=subject, level=level),
        material,
    )

    assert relevance[matching.pk] >= quiz_service.TOPIC_MATCH_BOOST
    assert relevance[other.pk] == quiz_service.TOPIC_MISMATCH_SCORE
    # Soal tanpa kode topik tetap dinilai dengan kemiripan kata kunci.
    assert relevance[unmapped.pk] > quiz_service.TOPIC_MISMATCH_SCORE
