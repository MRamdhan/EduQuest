"""Tests untuk ExpiringTokenAuthentication (token kedaluwarsa 1 jam)."""

from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def user_with_token(db):
    user = User.objects.create_user(username="tokentest", password="testpass123!")
    token = Token.objects.create(user=user)
    return user, token


class TestExpiringTokenAuthentication:
    """Token yang masih muda harus diterima, yang sudah tua harus ditolak."""

    def test_fresh_token_accepted(self, user_with_token):
        """Token yang baru dibuat (< 1 jam) harus bisa mengakses endpoint."""
        user, token = user_with_token
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
        response = client.get("/api/progress/")
        assert response.status_code == 200

    def test_expired_token_rejected(self, user_with_token):
        """Token > 1 jam harus mendapat 401 dan dihapus dari database."""
        user, token = user_with_token
        # Mundurkan waktu created agar token terlihat sudah berumur 2 jam
        Token.objects.filter(pk=token.pk).update(
            created=timezone.now() - timedelta(hours=2)
        )
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
        response = client.get("/api/progress/")
        assert response.status_code == 401
        assert "kedaluwarsa" in response.data["detail"].lower()
        # Token harus sudah dihapus dari database
        assert not Token.objects.filter(pk=token.pk).exists()

    def test_expired_token_can_relogin(self, user_with_token):
        """Setelah token kedaluwarsa, user bisa login lagi dan dapat token baru."""
        user, token = user_with_token
        old_key = token.key
        # Expire-kan token lama
        Token.objects.filter(pk=token.pk).update(
            created=timezone.now() - timedelta(hours=2)
        )
        client = APIClient()
        # Login ulang
        response = client.post(
            "/api/auth/login/",
            {"username": "tokentest", "password": "testpass123!"},
            format="json",
        )
        assert response.status_code == 200
        new_key = response.data["token"]
        # Token baru harus berbeda dari yang lama (lama sudah dihapus oleh auth)
        # atau sama jika get_or_create membuat ulang; yang penting bisa dipakai
        client.credentials(HTTP_AUTHORIZATION=f"Token {new_key}")
        response2 = client.get("/api/progress/")
        assert response2.status_code == 200

