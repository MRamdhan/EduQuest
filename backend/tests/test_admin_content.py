"""Tes alur admin: unggah materi dan buat soal untuk kuis."""

import pytest
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse

from apps.learning.models import EducationLevel, Material, Question, Subject

User = get_user_model()

PASSWORD = "AdminKuat2026!"
MATERIAL_MARKDOWN = """# Gaya dan Gerak

**ID Topik:** SMP-IPA-04
**Kelas:** 8
**Referensi:** Buku IPA SMP

---

## Gaya

Gaya adalah dorongan atau tarikan yang dapat mengubah gerak benda.

## Hukum Newton

Benda diam akan tetap diam jika tidak ada gaya yang bekerja.
"""


@pytest.fixture
def admin_client(client, db):
    user = User.objects.create_superuser(
        username="admin-test",
        email="admin@example.com",
        password=PASSWORD,
    )
    client.force_login(user)
    return client


@pytest.fixture
def subject(db):
    level = EducationLevel.objects.create(code="SMP", name="SMP", order=2)
    return Subject.objects.create(level=level, name="IPA", slug="ipa")


@pytest.fixture
def material(subject):
    return Material.objects.create(
        subject=subject,
        title="Gaya dan Gerak",
        slug="smp-ipa-gaya-dan-gerak",
        kelas=8,
        topic="Gaya dan Gerak",
        topic_code="SMP-IPA-04",
        summary="Materi uji.",
        content="# Gaya dan Gerak\n\nIsi materi uji.",
        status=Material.Status.PUBLISHED,
    )


def _inline_management(prefix="prerequisite_links"):
    return {
        f"{prefix}-TOTAL_FORMS": "0",
        f"{prefix}-INITIAL_FORMS": "0",
        f"{prefix}-MIN_NUM_FORMS": "0",
        f"{prefix}-MAX_NUM_FORMS": "1000",
    }


def test_admin_material_upload_parses_markdown(admin_client, subject):
    upload = SimpleUploadedFile(
        "gaya-dan-gerak.md",
        MATERIAL_MARKDOWN.encode("utf-8"),
        content_type="text/markdown",
    )
    response = admin_client.post(
        reverse("admin:learning_material_add"),
        {
            "subject": subject.pk,
            "title": "",
            "slug": "",
            "kelas": "",
            "topic": "",
            "topic_code": "",
            "status": Material.Status.PUBLISHED,
            "order": "0",
            "estimated_minutes": "10",
            "summary": "",
            "content": "",
            "source": "",
            "markdown_file": upload,
            **_inline_management(),
        },
    )

    assert response.status_code == 302, getattr(response, "context", None)
    material = Material.objects.get(topic_code="SMP-IPA-04")
    assert material.title == "Gaya dan Gerak"
    assert material.kelas == 8
    assert "Gaya adalah dorongan" in material.content
    assert material.status == Material.Status.PUBLISHED


def test_admin_question_changelist_renders(admin_client):
    response = admin_client.get(reverse("admin:learning_question_changelist"))
    assert response.status_code == 200
    assert "Impor soal dari CSV" in response.content.decode()


def test_admin_material_change_page_has_quiz_shortcuts(admin_client, material):
    response = admin_client.get(
        reverse("admin:learning_material_change", args=[material.pk])
    )
    assert response.status_code == 200
    body = response.content.decode()
    assert "Buat soal untuk materi ini" in body
    assert "Impor banyak soal (CSV)" in body


def test_admin_question_add_prefilled_from_material(admin_client, material):
    response = admin_client.get(
        reverse("admin:learning_question_add") + f"?material={material.pk}"
    )
    assert response.status_code == 200
    form = response.context["adminform"].form
    assert form.initial["subject"] == material.subject_id
    assert form.initial["kelas"] == material.kelas
    assert form.initial["topic_code"] == material.topic_code


def test_admin_question_add_creates_quiz_question(admin_client, material):
    response = admin_client.post(
        reverse("admin:learning_question_add"),
        {
            "from_material": material.pk,
            "subject": material.subject_id,
            "kelas": material.kelas,
            "topic": material.topic,
            "topic_code": material.topic_code,
            "difficulty": "2",
            "question_text": "Apa yang dimaksud dengan gaya?",
            "option_a": "Dorongan atau tarikan",
            "option_b": "Perpindahan benda",
            "option_c": "",
            "option_d": "",
            "option_e": "",
            "correct": "A",
            "explanation": "Gaya adalah dorongan atau tarikan.",
            "hint": "Ingat definisi dasar gaya.",
            "review_status": Question.ReviewStatus.REVIEWED,
            "is_active": "on",
        },
    )

    assert response.status_code == 302, getattr(response, "context", None)
    question = Question.objects.get(question_text="Apa yang dimaksud dengan gaya?")
    assert question.subject_id == material.subject_id
    assert question.level_id == material.subject.level_id
    assert question.topic_code == material.topic_code
    assert question.kelas == material.kelas
    assert question.options == [
        {"key": "A", "text": "Dorongan atau tarikan"},
        {"key": "B", "text": "Perpindahan benda"},
    ]
    assert question.correct_option == "A"
    assert question.review_status == Question.ReviewStatus.REVIEWED


def test_admin_csv_import_scoped_to_material(admin_client, material):
    csv_text = (
        "question_text,option_a,option_b,correct,explanation,difficulty\n"
        '"Gaya dapat mengubah apa?",gerak,warna,A,"Gaya mengubah gerak.",1\n'
        '"Satuan gaya adalah?",newton,meter,B,"Satuan gaya newton.",2\n'
    )
    upload = SimpleUploadedFile(
        "soal.csv",
        csv_text.encode("utf-8"),
        content_type="text/csv",
    )
    response = admin_client.post(
        reverse("admin:learning_question_import_csv") + f"?material={material.pk}",
        {
            "material": material.pk,
            "review_status": Question.ReviewStatus.REVIEWED,
            "csv_file": upload,
        },
    )

    assert response.status_code == 302
    imported = Question.objects.filter(source_dataset="admin-csv")
    assert imported.count() == 2
    for question in imported:
        assert question.subject_id == material.subject_id
        assert question.topic_code == material.topic_code
        assert question.kelas == material.kelas
        assert question.review_status == Question.ReviewStatus.REVIEWED


def test_admin_csv_template_download(admin_client):
    response = admin_client.get(
        reverse("admin:learning_question_import_csv") + "?template=1"
    )
    assert response.status_code == 200
    assert response["Content-Type"].startswith("text/csv")
    assert "question_text" in response.content.decode()
