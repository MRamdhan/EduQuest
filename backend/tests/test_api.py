from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient

from apps.learning.models import EducationLevel, Material, Question, Subject
from apps.progress.constants import RANKS
from apps.progress.models import Rank, SubjectProgress, UserProgress
from apps.tutor.services.hint_service import generate_hint

User = get_user_model()

PASSWORD = "SiswaKuat2026!"


@pytest.fixture(autouse=True)
def seeded_ranks(db):
    for item in RANKS:
        Rank.objects.update_or_create(code=item["code"], defaults=item)


@pytest.fixture
def api():
    return APIClient()


@pytest.fixture
def student(db):
    user = User.objects.create_user(username="siswa-test", password=PASSWORD)
    return user


@pytest.fixture
def material(db):
    level = EducationLevel.objects.create(code="SMP", name="SMP", order=2)
    subject = Subject.objects.create(level=level, name="IPA", slug="ipa")
    return Material.objects.create(
        subject=subject,
        title="Gerak dan Gaya",
        slug="smp-ipa-gerak-dan-gaya",
        topic="Gerak dan Gaya",
        topic_code="SMP-IPA-04",
        summary="Materi uji.",
        content="# Gerak dan Gaya\n\n## Konsep Gaya\n\nIsi materi uji.",
        status=Material.Status.PUBLISHED,
    )


@pytest.fixture
def questions(material):
    level = material.subject.level
    items = []
    for index in range(1, 9):
        items.append(
            Question.objects.create(
                source_id=f"test-{index}",
                level=level,
                subject=material.subject,
                difficulty=1,
                question_text=f"Soal nomor {index}?",
                options=[
                    {"key": "A", "text": "Jawaban benar"},
                    {"key": "B", "text": "Jawaban salah"},
                    {"key": "C", "text": "Jawaban salah 2"},
                    {"key": "D", "text": "Jawaban salah 3"},
                ],
                correct_option="A",
                explanation="Karena A benar.",
                review_status=Question.ReviewStatus.VALIDATED,
            )
        )
    return items


def start_quiz(api, material, difficulty=None):
    payload = {"material_id": material.pk}
    if difficulty is not None:
        payload["difficulty"] = difficulty
    return api.post("/api/quizzes/", payload, format="json")


def answer(api, attempt_id, question_id, option):
    return api.post(
        f"/api/quizzes/{attempt_id}/answer/",
        {"question_id": question_id, "option": option},
        format="json",
    )


@pytest.mark.django_db
def test_register_login_and_me(api):
    response = api.post(
        "/api/auth/register/",
        {
            "username": "baru",
            "password": PASSWORD,
            "password_confirm": PASSWORD,
            "email": "baru@example.com",
        },
        format="json",
    )
    assert response.status_code == 201
    assert response.data["token"]
    assert UserProgress.objects.filter(user__username="baru").exists()

    api.credentials(HTTP_AUTHORIZATION=f"Token {response.data['token']}")
    me = api.get("/api/auth/me/")
    assert me.status_code == 200
    assert me.data["username"] == "baru"

    api.credentials()
    login = api.post(
        "/api/auth/login/",
        {"username": "baru", "password": PASSWORD},
        format="json",
    )
    assert login.status_code == 200
    assert login.data["token"]


@pytest.mark.django_db
def test_start_quiz_returns_lives_and_rank(api, student, material, questions):
    api.force_authenticate(student)
    response = start_quiz(api, material)
    assert response.status_code == 201

    data = response.data
    assert data["lives"] == 3
    assert data["max_lives"] == 3
    assert data["rank"]["name"] == "Ayam"
    assert data["unlocked_difficulty"] == 1
    assert data["levels"][0]["locked"] is False
    assert data["levels"][1]["locked"] is True
    assert data["levels"][2]["locked"] is True
    assert data["attempt"]["target_difficulty"] == 1
    assert len(data["attempt"]["questions"]) == 5
    assert data["next_life_at"] is None

    payload = response.content.decode("utf-8")
    assert "correct_option" not in payload
    assert "explanation" not in payload

    detail = api.get(f"/api/quizzes/{data['attempt']['id']}/")
    assert detail.status_code == 200
    assert detail.data["lives"] == 3
    assert detail.data["next_question"]["id"] == data["attempt"]["questions"][0]["id"]
    assert "correct_option" not in detail.content.decode("utf-8")


@pytest.mark.django_db
def test_correct_answers_award_xp_and_finish_session(api, student, material, questions):
    api.force_authenticate(student)
    started = start_quiz(api, material)
    attempt_id = started.data["attempt"]["id"]
    quiz_questions = started.data["attempt"]["questions"]

    last = None
    for index, question in enumerate(quiz_questions):
        response = answer(api, attempt_id, question["id"], "A")
        assert response.status_code == 200
        assert response.data["correct"] is True
        assert response.data["xp_gained"] == 10
        assert response.data["lives"] == 3
        assert response.data["retry"] is False
        if index < len(quiz_questions) - 1:
            assert response.data["session_ended"] is False
            assert response.data["next_question"]["id"] == quiz_questions[index + 1]["id"]
        last = response

    assert last.data["session_ended"] is True
    assert last.data["summary"]["score"]["correct"] == 5
    assert last.data["summary"]["score"]["percent"] == 100
    assert last.data["summary"]["reward"]["xp_gained"] == 50
    assert last.data["summary"]["adaptation"]["next_difficulty"] == 1
    assert UserProgress.objects.get(user=student).xp == 50

    detail = api.get(f"/api/quizzes/{attempt_id}/")
    assert detail.status_code == 200
    assert detail.data["attempt"]["status"] == "submitted"
    assert detail.data["summary"]["score"]["correct"] == 5
    assert detail.data["attempt"]["questions"][0]["correct_option"] == "A"


@pytest.mark.django_db
def test_wrong_answer_gives_hint_and_does_not_advance(api, student, material, questions):
    api.force_authenticate(student)
    started = start_quiz(api, material)
    attempt_id = started.data["attempt"]["id"]
    first = started.data["attempt"]["questions"][0]
    second = started.data["attempt"]["questions"][1]

    response = answer(api, attempt_id, first["id"], "B")
    assert response.status_code == 200
    assert response.data["correct"] is False
    assert response.data["retry"] is True
    assert response.data["session_ended"] is False
    assert response.data["lives"] == 2
    assert response.data["hint"]
    assert response.data["hint_source"] in {"rule", "ai", "manual"}
    assert response.data["next_question"]["id"] == first["id"]
    assert response.data["next_question"]["attempts"] == 1
    assert response.data["next_question"]["hint"] == response.data["hint"]
    assert response.data["next_question"]["id"] != second["id"]
    assert response.data["xp_gained"] == 0

    subject_progress = SubjectProgress.objects.get(user=student, subject=material.subject)
    assert subject_progress.lives == 2
    assert subject_progress.next_life_at is not None

    retry = answer(api, attempt_id, first["id"], "A")
    assert retry.status_code == 200
    assert retry.data["correct"] is True
    assert retry.data["xp_gained"] == 10
    assert retry.data["lives"] == 2
    assert retry.data["next_question"]["id"] == second["id"]
    assert UserProgress.objects.get(user=student).xp == 10


@pytest.mark.django_db
def test_second_wrong_reveals_key_and_advances(api, student, material, questions):
    api.force_authenticate(student)
    started = start_quiz(api, material)
    attempt_id = started.data["attempt"]["id"]
    first = started.data["attempt"]["questions"][0]
    second = started.data["attempt"]["questions"][1]

    first_wrong = answer(api, attempt_id, first["id"], "B")
    assert first_wrong.data["retry"] is True

    second_wrong = answer(api, attempt_id, first["id"], "C")
    assert second_wrong.status_code == 200
    assert second_wrong.data["correct"] is False
    assert second_wrong.data["retry"] is False
    assert second_wrong.data["revealed"] is True
    assert second_wrong.data["correct_option"] == "A"
    assert second_wrong.data["explanation"] == "Karena A benar."
    assert second_wrong.data["lives"] == 1
    assert second_wrong.data["session_ended"] is False
    assert second_wrong.data["next_question"]["id"] == second["id"]
    assert second_wrong.data["summary"] is None


@pytest.mark.django_db
def test_lives_run_out_and_regenerate_after_two_hours(api, student, material, questions):
    api.force_authenticate(student)
    started = start_quiz(api, material)
    attempt_id = started.data["attempt"]["id"]
    quiz_questions = started.data["attempt"]["questions"]

    answer(api, attempt_id, quiz_questions[0]["id"], "B")
    answer(api, attempt_id, quiz_questions[0]["id"], "C")
    ended = answer(api, attempt_id, quiz_questions[1]["id"], "B")

    assert ended.status_code == 200
    assert ended.data["lives"] == 0
    assert ended.data["session_ended"] is True
    assert ended.data["summary"]["reward"]["ended_early"] is True
    assert ended.data["summary"]["score"]["wrong"] == 2
    assert ended.data["summary"]["score"]["unanswered"] == 3

    blocked = start_quiz(api, material)
    assert blocked.status_code == 409
    assert blocked.data["code"] == "no_lives_available"

    subject_progress = SubjectProgress.objects.get(user=student, subject=material.subject)
    assert subject_progress.lives == 0
    subject_progress.life_regen_started_at = timezone.now() - timedelta(hours=2, seconds=1)
    subject_progress.save(update_fields=["life_regen_started_at"])

    subjects = api.get("/api/subjects/")
    assert subjects.status_code == 200
    assert subjects.data[0]["lives"] == 1
    assert subjects.data[0]["seconds_to_next_life"] is not None

    allowed = start_quiz(api, material)
    assert allowed.status_code == 201
    assert allowed.data["lives"] == 1


@pytest.mark.django_db
def test_rank_unlocks_quiz_level(api, student, material, questions):
    api.force_authenticate(student)

    locked = start_quiz(api, material, difficulty=2)
    assert locked.status_code == 403
    assert locked.data["code"] == "level_locked"

    UserProgress.objects.update_or_create(user=student, defaults={"xp": 100})
    unlocked = start_quiz(api, material, difficulty=2)
    assert unlocked.status_code == 201
    assert unlocked.data["rank"]["name"] == "Rank 2"
    assert unlocked.data["unlocked_difficulty"] == 2
    assert unlocked.data["attempt"]["target_difficulty"] == 2
    assert unlocked.data["levels"][1]["locked"] is False

    still_locked = start_quiz(api, material, difficulty=3)
    assert still_locked.status_code == 403
    assert still_locked.data["code"] == "level_locked"


@pytest.mark.django_db
def test_adaptation_is_capped_by_rank(api, student, material, questions):
    api.force_authenticate(student)
    UserProgress.objects.update_or_create(user=student, defaults={"xp": 100})
    started = start_quiz(api, material)
    attempt_id = started.data["attempt"]["id"]

    last = None
    for question in started.data["attempt"]["questions"]:
        last = answer(api, attempt_id, question["id"], "A")

    assert last.data["summary"]["adaptation"]["action"] == "naik"
    assert last.data["summary"]["adaptation"]["next_difficulty"] == 2


@pytest.mark.django_db
def test_answer_outside_attempt_and_duplicate_answer_are_rejected(api, student, material, questions):
    api.force_authenticate(student)
    started = start_quiz(api, material)
    attempt_id = started.data["attempt"]["id"]
    first = started.data["attempt"]["questions"][0]

    outside = answer(api, attempt_id, 999999, "A")
    assert outside.status_code == 400
    assert outside.data["code"] == "invalid_answer_payload"

    correct = answer(api, attempt_id, first["id"], "A")
    assert correct.status_code == 200

    duplicate = answer(api, attempt_id, first["id"], "A")
    assert duplicate.status_code == 409
    assert duplicate.data["code"] == "question_already_resolved"


@pytest.mark.django_db
def test_lives_are_independent_per_subject(api, student, material, questions):
    other = Subject.objects.create(
        level=material.subject.level,
        name="Matematika",
        slug="matematika",
    )
    api.force_authenticate(student)
    started = start_quiz(api, material)
    first = started.data["attempt"]["questions"][0]
    answer(api, started.data["attempt"]["id"], first["id"], "B")

    subjects = {item["name"]: item for item in api.get("/api/subjects/").data}
    assert subjects["IPA"]["lives"] == 2
    assert subjects["Matematika"]["lives"] == 3
    assert other.pk in {item["id"] for item in subjects.values()}


@pytest.mark.django_db
def test_cannot_skip_unresolved_question(api, student, material, questions):
    api.force_authenticate(student)
    started = start_quiz(api, material)
    attempt_id = started.data["attempt"]["id"]
    first, second = started.data["attempt"]["questions"][:2]

    skipped = answer(api, attempt_id, second["id"], "A")
    assert skipped.status_code == 400
    assert skipped.data["code"] == "invalid_answer_payload"
    assert SubjectProgress.objects.get(user=student, subject=material.subject).lives == 3

    allowed = answer(api, attempt_id, first["id"], "A")
    assert allowed.status_code == 200


@pytest.mark.django_db
def test_progress_and_subject_lives_payload(api, student, material, questions):
    api.force_authenticate(student)
    started = start_quiz(api, material)
    assert started.status_code == 201

    progress = api.get("/api/progress/")
    assert progress.status_code == 200
    assert progress.data["xp"] == 0
    assert progress.data["level"] == 1
    assert progress.data["rank"]["name"] == "Ayam"
    assert "lives" not in progress.data
    assert progress.data["subject_lives"][0]["subject"] == "IPA"
    assert progress.data["subject_lives"][0]["lives"] == 3

    ranks = api.get("/api/ranks/")
    assert ranks.status_code == 200
    assert ranks.data[0]["name"] == "Ayam"
    assert ranks.data[1]["unlocked_difficulty"] == 2


@pytest.mark.django_db
def test_material_completion_awards_xp_once(api, student, material):
    api.force_authenticate(student)
    first = api.post(f"/api/materials/{material.pk}/complete/")
    second = api.post(f"/api/materials/{material.pk}/complete/")

    assert first.status_code == 200
    assert first.data["xp_gained"] == 15
    assert second.data["xp_gained"] == 0
    assert second.data["already_completed"] is True
    assert UserProgress.objects.get(user=student).xp == 15


@pytest.mark.django_db
def test_hint_service_manual_and_rule_fallback(student, material, questions, settings):
    question = questions[0]
    question.hint = "Manual: ingat rumus gaya."
    question.save(update_fields=["hint"])

    hint, source = generate_hint(student, question, material)
    assert source == "manual"
    assert hint == "Manual: ingat rumus gaya."

    question.hint = ""
    question.save(update_fields=["hint"])
    settings.AI_PROVIDER = ""
    hint, source = generate_hint(student, question, material)
    assert source == "rule"
    assert "Petunjuk" in hint
    assert "Jawaban benar" not in hint


@pytest.mark.django_db
def test_tutor_falls_back_without_provider(api, student, material, settings):
    settings.AI_PROVIDER = ""
    api.force_authenticate(student)
    response = api.post(
        "/api/tutor/ask/",
        {"material_id": material.pk, "question": "Apa itu gaya?"},
        format="json",
    )
    assert response.status_code == 200
    assert response.data["available"] is False
    assert response.data["degraded"] is True
    assert response.data["answer"]


@pytest.mark.django_db
def test_health_and_authentication_required(api):
    assert api.get("/api/health/").status_code == 200
    assert api.get("/api/progress/").status_code == 401
