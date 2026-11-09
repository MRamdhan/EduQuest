"""Token authentication yang kedaluwarsa setelah TOKEN_TTL.

Modul ini menggantikan TokenAuthentication bawaan DRF agar token
yang berusia lebih dari TOKEN_TTL (default 1 jam) ditolak dengan
401 Unauthorized, selaras dengan logika expiry yang sudah ada
di sisi frontend.
"""

from __future__ import annotations

import os
from datetime import timedelta

from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

# Masa berlaku token: default 1 jam, bisa di-override via env TOKEN_TTL_HOURS.
TOKEN_TTL = timedelta(hours=float(os.getenv("TOKEN_TTL_HOURS", "1")))


class ExpiringTokenAuthentication(TokenAuthentication):
    """TokenAuthentication + pengecekan masa berlaku.

    Token yang berusia lebih dari ``TOKEN_TTL`` secara otomatis dihapus
    dari database dan mengembalikan 401 sehingga klien harus login ulang.
    """

    def authenticate_credentials(self, key: str):
        user, token = super().authenticate_credentials(key)

        elapsed = timezone.now() - token.created
        if elapsed > TOKEN_TTL:
            token.delete()
            raise AuthenticationFailed(
                "Token kedaluwarsa. Silakan login kembali.",
                code="token_expired",
            )

        return user, token

