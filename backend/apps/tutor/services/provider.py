"""Adapter penyedia AI.

Kontrak `TutorProvider.complete()` memungkinkan penggantian provider tanpa
mengubah service atau view. Hanya provider yang dikonfigurasi lewat
environment yang dipakai.
"""

from __future__ import annotations

import json
import logging
import re
import time
import urllib.error
import urllib.request

from django.conf import settings

from apps.core.errors import ProviderUnavailable

logger = logging.getLogger(__name__)


class TutorProvider:
    name = "base"
    model = ""

    def complete(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        max_tokens: int | None = None,
    ) -> str:
        raise NotImplementedError


def _normalize(text: str) -> str:
    """Rapikan karakter yang sering keluar dari model tetapi mengganggu tampilan."""
    # Zero-width di antara dua huruf/angka kemungkinan menggantikan spasi.
    text = re.sub(
        r"(?<=[0-9A-Za-zÀ-ÿ])([\u200b-\u200f\ufeff]+)(?=[0-9A-Za-zÀ-ÿ])",
        " ",
        text,
    )
    text = re.sub(r"[\u200b-\u200f\ufeff]", "", text)
    text = re.sub(r"[\u00a0\u2000-\u200a\u202f\u205f\u3000]", " ", text)
    return text.replace("\u2011", "-").strip()


def _trim_incomplete(text: str) -> str:
    """Potong jawaban yang terhenti di tengah kalimat agar tidak tampil menggantung."""
    text = (text or "").strip()
    if not text:
        return ""
    if text[-1] in ".!?\"'":
        return text
    match = None
    for match in re.finditer(r"[.!?](?=\s|$)", text):
        pass
    if match and match.end() >= len(text) * 0.5:
        return text[: match.end()].strip()
    return text


def _retry_delay(exc: urllib.error.HTTPError, attempt: int) -> float:
    """Jeda sebelum mencoba ulang; patuhi Retry-After bila provider mengirimnya."""
    headers = getattr(exc, "headers", None)
    retry_after = headers.get("Retry-After") if headers else None
    if retry_after:
        try:
            return max(0.0, min(float(retry_after), 5.0))
        except (TypeError, ValueError):
            pass
    return min(0.5 * (2**attempt), 3.0)


class NullProvider(TutorProvider):
    name = "none"

    def complete(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        max_tokens: int | None = None,
    ) -> str:
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

    def _payload(self, system_prompt: str, user_prompt: str, max_tokens: int | None) -> dict:
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.2,
            "max_tokens": max_tokens or settings.AI_MAX_OUTPUT_TOKENS,
        }
        # Hanya dikirim bila dikonfigurasi; sebagian provider menolak parameter ini.
        if settings.AI_REASONING_EFFORT:
            payload["reasoning_effort"] = settings.AI_REASONING_EFFORT
        return payload

    def complete(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        max_tokens: int | None = None,
    ) -> str:
        body = json.dumps(self._payload(system_prompt, user_prompt, max_tokens)).encode(
            "utf-8"
        )

        request = urllib.request.Request(
            f"{self.base_url}/chat/completions",
            data=body,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "User-Agent": "EduQuest/1.0",
            },
            method="POST",
        )

        payload = self._send(request)

        try:
            choice = payload["choices"][0]
            content = _normalize(choice["message"].get("content") or "")
        except (KeyError, IndexError, AttributeError) as exc:
            raise ProviderUnavailable("Format respons provider AI tidak dikenali.") from exc

        finish_reason = choice.get("finish_reason") or ""
        if finish_reason == "length":
            logger.warning("Jawaban AI terpotong karena batas token tercapai.")
            content = _trim_incomplete(content)

        if not content:
            raise ProviderUnavailable(
                "Provider AI mengembalikan jawaban kosong"
                + (f" (finish_reason: {finish_reason})." if finish_reason else ".")
            )
        return content

    def _send(self, request: urllib.request.Request) -> dict:
        """Kirim permintaan dengan retry terbatas untuk 429/5xx."""
        attempts = max(1, settings.AI_MAX_RETRIES + 1)
        for attempt in range(attempts):
            try:
                with urllib.request.urlopen(
                    request, timeout=settings.AI_TIMEOUT_SECONDS
                ) as response:
                    return json.loads(response.read().decode("utf-8"))
            except urllib.error.HTTPError as exc:
                detail = ""
                try:
                    detail = exc.read().decode("utf-8", "replace")[:300]
                except Exception:  # body error hanya untuk log, jangan gagalkan alur
                    pass
                logger.warning("Provider AI HTTP %s: %s", exc.code, detail)

                if exc.code in (429, 500, 502, 503, 504) and attempt < attempts - 1:
                    delay = _retry_delay(exc, attempt)
                    logger.info(
                        "Mencoba ulang provider AI dalam %.1fs (percobaan %s/%s).",
                        delay,
                        attempt + 2,
                        attempts,
                    )
                    time.sleep(delay)
                    continue

                if exc.code in (401, 403):
                    message = "Kunci API provider AI tidak valid."
                elif exc.code == 429:
                    message = "Kuota permintaan provider AI sedang penuh."
                elif exc.code >= 500:
                    message = "Layanan provider AI sedang bermasalah."
                else:
                    message = f"Provider AI menolak permintaan (HTTP {exc.code})."
                raise ProviderUnavailable(message) from exc
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
                raise ProviderUnavailable("Provider AI tidak dapat dihubungi.") from exc
        raise ProviderUnavailable("Provider AI tidak dapat dihubungi.")


def get_provider() -> TutorProvider:
    provider = settings.AI_PROVIDER.strip().lower()
    if provider in {"openai-compatible", "openai", "compatible"}:
        return OpenAICompatibleProvider()
    return NullProvider()
