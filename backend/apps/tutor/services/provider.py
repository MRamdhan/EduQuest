"""Adapter penyedia AI.

Kontrak `TutorProvider.complete()` memungkinkan penggantian provider tanpa
mengubah service atau view. Hanya provider yang dikonfigurasi lewat
environment yang dipakai.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.request

from django.conf import settings

from apps.core.errors import ProviderUnavailable


class TutorProvider:
    name = "base"
    model = ""

    def complete(self, *, system_prompt: str, user_prompt: str) -> str:
        raise NotImplementedError


class NullProvider(TutorProvider):
    name = "none"

    def complete(self, *, system_prompt: str, user_prompt: str) -> str:
        raise ProviderUnavailable(
            "AI Tutor belum dikonfigurasi. Isi AI_PROVIDER, AI_API_KEY, dan AI_MODEL "
            "pada file .env untuk mengaktifkan."
        )


class OpenAICompatibleProvider(TutorProvider):
    """Adapter untuk endpoint gaya /chat/completions (OpenAI, Groq, dsb.)."""

    name = "openai-compatible"

    def __init__(self):
        self.api_key = settings.AI_API_KEY
        self.base_url = settings.AI_BASE_URL.rstrip("/")
        self.model = settings.AI_MODEL
        if not (self.api_key and self.base_url and self.model):
            raise ProviderUnavailable("Konfigurasi provider AI belum lengkap.")

    def complete(self, *, system_prompt: str, user_prompt: str) -> str:
        body = json.dumps(
            {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.2,
                "max_tokens": 500,
            }
        ).encode("utf-8")

        request = urllib.request.Request(
            f"{self.base_url}/chat/completions",
            data=body,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=settings.AI_TIMEOUT_SECONDS) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            raise ProviderUnavailable(f"Provider AI menolak permintaan (HTTP {exc.code}).") from exc
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise ProviderUnavailable("Provider AI tidak dapat dihubungi.") from exc

        try:
            content = payload["choices"][0]["message"]["content"].strip()
        except (KeyError, IndexError, AttributeError) as exc:
            raise ProviderUnavailable("Format respons provider AI tidak dikenali.") from exc

        if not content:
            raise ProviderUnavailable("Provider AI mengembalikan jawaban kosong.")
        return content


def get_provider() -> TutorProvider:
    provider = settings.AI_PROVIDER.strip().lower()
    if provider in {"openai-compatible", "openai", "compatible"}:
        return OpenAICompatibleProvider()
    return NullProvider()
