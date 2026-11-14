"""Unit test untuk endpoint statistik pembelajaran & AI rekomendasi belajar."""

import pytest
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from apps.accounts.models import StudentProfile
from apps.learning.models import EducationLevel, Material, QuizAttempt, Subject

User = get_user_model()


@pytest.fixture
def student_user(db):
    level = EducationLevel.objects.create(code="SMP", name="SMP")
    user = User.objects.create_user(
        username="siswasmp",
        password="password123!",
        first_name="Budi",
    )
    profile, _ = StudentProfile.objects.get_or_create(user=user)
    profile.education_level = level
    profile.kelas = 8
    profile.save()

    token = Token.objects.create(user=user)
    return user, token, level


class TestLearningStatsAndRecommendations:
    def test_learning_stats_empty(self, student_user):
        """User baru tanpa riwayat kuis mengembalikan data kosong yang valid."""
        user, token, _ = student_user
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        response = client.get("/api/progress/stats/")
        assert response.status_code == 200
        data = response.data
        assert data["total_quizzes"] == 0
        assert data["completed_materials"] == 0
        assert data["average_accuracy"] == 0.0
        assert data["pass_rate"] == 0.0
        assert isinstance(data["subject_breakdown"], list)

    def test_learning_stats_with_attempts(self, student_user):
        """Menghitung akurasi dan breakdown mata pelajaran dengan benar."""
        user, token, level = student_user
        subject = Subject.objects.create(name="IPA", slug="ipa-smp", level=level)
        material = Material.objects.create(
            title="Sistem Pernapasan",
            slug="sistem-pernapasan",
            subject=subject,
            kelas=8,
            status=Material.Status.PUBLISHED,
        )

        QuizAttempt.objects.create(
            user=user,
            material=material,
            status=QuizAttempt.Status.SUBMITTED,
            total_questions=5,
            correct_count=4,
            percent=80.0,
        )

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        response = client.get("/api/progress/stats/")
        assert response.status_code == 200
        data = response.data
        assert data["total_quizzes"] == 1
        assert data["average_accuracy"] == 80.0
        assert data["pass_rate"] == 100.0
        assert len(data["subject_breakdown"]) == 1
        assert data["subject_breakdown"][0]["subject_name"] == "IPA"
        assert data["subject_breakdown"][0]["mastery_level"] == "Mahir"

    def test_tutor_recommendations_fallback(self, student_user):
        """Rekomendasi belajar menghasilkan saran ramah dan daftar materi."""
        user, token, level = student_user
        subject = Subject.objects.create(name="IPS", slug="ips-smp", level=level)
        material = Material.objects.create(
            title="Letak Geografis",
            slug="letak-geografis",
            subject=subject,
            kelas=8,
            status=Material.Status.PUBLISHED,
        )

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        response = client.get("/api/tutor/recommendations/")
        assert response.status_code == 200
        data = response.data
        assert "personalized_message" in data
        assert "weak_topics" in data
        assert "next_topics" in data
        assert len(data["next_topics"]) == 1
        assert data["next_topics"][0]["title"] == "Letak Geografis"
        assert "Budi" in data["personalized_message"]

    def test_weak_topic_cleared_after_better_retake(self, student_user):
        """Skor rendah lama tidak lagi dianggap lemah setelah kuis ulang lulus."""
        user, token, level = student_user
        subject = Subject.objects.create(name="IPA", slug="ipa-smp-retake", level=level)
        material = Material.objects.create(
            title="Hewan dan Pengelompokannya",
            slug="hewan-pengelompokan-retake",
            subject=subject,
            kelas=8,
            status=Material.Status.PUBLISHED,
        )

        low = QuizAttempt.objects.create(
            user=user,
            material=material,
            status=QuizAttempt.Status.SUBMITTED,
            total_questions=5,
            correct_count=2,
            percent=40.0,
            ended_early=True,
        )
        QuizAttempt.objects.filter(pk=low.pk).update(
            started_at=low.started_at.replace(year=low.started_at.year - 1),
            submitted_at=low.submitted_at.replace(year=low.submitted_at.year - 1)
            if low.submitted_at
            else None,
        )
        QuizAttempt.objects.create(
            user=user,
            material=material,
            status=QuizAttempt.Status.SUBMITTED,
            total_questions=5,
            correct_count=5,
            percent=100.0,
        )

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        response = client.get("/api/tutor/recommendations/")
        assert response.status_code == 200
        assert response.data["weak_topics"] == []

