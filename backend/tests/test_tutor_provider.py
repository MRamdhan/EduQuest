"""Tes adapter provider AI tanpa memanggil jaringan."""

import json
import urllib.error

import pytest

from apps.core.errors import ProviderUnavailable
from apps.tutor.services import provider as provider_module
from apps.tutor.services.provider import get_provider


class FakeResponse:
    def __init__(self, payload):
        self._body = json.dumps(payload).encode("utf-8")

    def read(self):
        return self._body

    def __enter__(self):
        return self

    def __exit__(self, *exc_info):
        return False

    def close(self):
        return None


def _completion(content, finish_reason="stop"):
    return {
        "choices": [
            {"message": {"role": "assistant", "content": content}, "finish_reason": finish_reason}
        ]
    }


@pytest.fixture
def ai_settings(settings):
    settings.AI_PROVIDER = "openai-compatible"
    settings.AI_API_KEY = "test-key"
    settings.AI_BASE_URL = "https://api.example.test/openai/v1"
    settings.AI_MODEL = "openai/gpt-oss-120b"
    settings.AI_MAX_OUTPUT_TOKENS = 1200
    settings.AI_REASONING_EFFORT = "low"
    settings.AI_MAX_RETRIES = 0
    return settings


def test_payload_sends_output_limit_and_reasoning_effort(ai_settings, monkeypatch):
    captured = {}

    def fake_urlopen(request, timeout):
        captured["body"] = json.loads(request.data.decode("utf-8"))
        captured["url"] = request.full_url
        captured["timeout"] = timeout
        captured["auth"] = request.get_header("Authorization")
        return FakeResponse(_completion("Halo!"))

    monkeypatch.setattr(provider_module.urllib.request, "urlopen", fake_urlopen)

    answer = get_provider().complete(system_prompt="sistem", user_prompt="halo")

    assert answer == "Halo!"
    assert captured["url"] == "https://api.example.test/openai/v1/chat/completions"
    assert captured["body"]["model"] == "openai/gpt-oss-120b"
    assert captured["body"]["max_tokens"] == 1200
    assert captured["body"]["reasoning_effort"] == "low"
    assert captured["auth"] == "Bearer test-key"


def test_reasoning_effort_omitted_when_not_configured(ai_settings, monkeypatch):
    ai_settings.AI_REASONING_EFFORT = ""
    captured = {}

    def fake_urlopen(request, timeout):
        captured["body"] = json.loads(request.data.decode("utf-8"))
        return FakeResponse(_completion("Halo!"))

    monkeypatch.setattr(provider_module.urllib.request, "urlopen", fake_urlopen)

    get_provider().complete(system_prompt="sistem", user_prompt="halo")

    assert "reasoning_effort" not in captured["body"]


def test_empty_content_raises_provider_unavailable(ai_settings, monkeypatch):
    monkeypatch.setattr(
        provider_module.urllib.request,
        "urlopen",
        lambda request, timeout: FakeResponse(_completion("", finish_reason="length")),
    )

    with pytest.raises(ProviderUnavailable) as excinfo:
        get_provider().complete(system_prompt="sistem", user_prompt="halo")
    assert "kosong" in str(excinfo.value)


def test_truncated_answer_is_cut_at_last_sentence(ai_settings, monkeypatch):
    text = "Gaya gesek melawan gerak. Gaya berat selalu ke bawah. Jadi kesimpulannya adal"
    monkeypatch.setattr(
        provider_module.urllib.request,
        "urlopen",
        lambda request, timeout: FakeResponse(_completion(text, finish_reason="length")),
    )

    answer = get_provider().complete(system_prompt="sistem", user_prompt="halo")
    assert answer == "Gaya gesek melawan gerak. Gaya berat selalu ke bawah."


def test_answer_characters_are_normalized(ai_settings, monkeypatch):
    text = "Langkah\u2011langkah\u202fberikut:\u00a0gaya\u200bgesek."
    monkeypatch.setattr(
        provider_module.urllib.request,
        "urlopen",
        lambda request, timeout: FakeResponse(_completion(text)),
    )

    answer = get_provider().complete(system_prompt="sistem", user_prompt="halo")
    assert answer == "Langkah-langkah berikut: gaya gesek."


def test_rate_limit_error_has_friendly_message(ai_settings, monkeypatch):
    def fake_urlopen(request, timeout):
        raise urllib.error.HTTPError(
            request.full_url,
            429,
            "Too Many Requests",
            {},
            FakeResponse({"error": {"message": "rate limit"}}),
        )

    monkeypatch.setattr(provider_module.urllib.request, "urlopen", fake_urlopen)

    with pytest.raises(ProviderUnavailable) as excinfo:
        get_provider().complete(system_prompt="sistem", user_prompt="halo")
    assert "Kuota" in str(excinfo.value)


def test_null_provider_when_not_configured(settings):
    settings.AI_PROVIDER = ""
    assert get_provider().name == "none"


def test_per_call_max_tokens_overrides_default(ai_settings, monkeypatch):
    captured = {}

    def fake_urlopen(request, timeout):
        captured["body"] = json.loads(request.data.decode("utf-8"))
        return FakeResponse(_completion("Petunjuk singkat."))

    monkeypatch.setattr(provider_module.urllib.request, "urlopen", fake_urlopen)

    get_provider().complete(system_prompt="sistem", user_prompt="soal", max_tokens=400)

    assert captured["body"]["max_tokens"] == 400


def test_rate_limit_is_retried(ai_settings, monkeypatch):
    ai_settings.AI_MAX_RETRIES = 1
    calls = {"count": 0}

    def fake_urlopen(request, timeout):
        calls["count"] += 1
        if calls["count"] == 1:
            raise urllib.error.HTTPError(
                request.full_url, 429, "Too Many Requests", {}, FakeResponse({})
            )
        return FakeResponse(_completion("Berhasil setelah retry."))

    monkeypatch.setattr(provider_module.urllib.request, "urlopen", fake_urlopen)
    monkeypatch.setattr(provider_module.time, "sleep", lambda seconds: None)

    assert get_provider().complete(system_prompt="sistem", user_prompt="halo") == (
        "Berhasil setelah retry."
    )
    assert calls["count"] == 2


def test_unauthorized_is_not_retried(ai_settings, monkeypatch):
    ai_settings.AI_MAX_RETRIES = 2
    calls = {"count": 0}

    def fake_urlopen(request, timeout):
        calls["count"] += 1
        raise urllib.error.HTTPError(
            request.full_url, 401, "Unauthorized", {}, FakeResponse({})
        )

    monkeypatch.setattr(provider_module.urllib.request, "urlopen", fake_urlopen)
    monkeypatch.setattr(provider_module.time, "sleep", lambda seconds: None)

    with pytest.raises(ProviderUnavailable) as excinfo:
        get_provider().complete(system_prompt="sistem", user_prompt="halo")
    assert "Kunci API" in str(excinfo.value)
    assert calls["count"] == 1


def test_hint_uses_smaller_token_budget(settings, monkeypatch):
    from apps.tutor.services import hint_service

    settings.AI_HINT_MAX_OUTPUT_TOKENS = 400
    settings.AI_HINT_MAX_CONTEXT_CHARS = 500
    captured = {}

    class FakeProvider:
        name = "fake"

        def complete(self, *, system_prompt, user_prompt, max_tokens=None):
            captured["max_tokens"] = max_tokens
            captured["prompt"] = user_prompt
            return "Petunjuk: ingat rumus gaya."

    monkeypatch.setattr(hint_service, "get_provider", lambda: FakeProvider())

    class FakeQuestion:
        question_text = "Apa rumus gaya?"
        topic = ""
        options = [{"key": "A", "text": "F = m x a"}, {"key": "B", "text": "F = m / a"}]
        correct_option = "A"
        hint = ""

    class FakeMaterial:
        title = "Gerak dan Gaya"
        topic = "Gerak dan Gaya"
        content = "x" * 1000
        subject = type("S", (), {"level": type("L", (), {"name": "SMP"}), "name": "IPA"})()

    hint, source = hint_service.generate_hint(None, FakeQuestion(), FakeMaterial())

    assert source == "ai"
    assert captured["max_tokens"] == 400
    assert "x" * 500 in captured["prompt"]
    assert "x" * 501 not in captured["prompt"]
    assert "F = m x a" not in hint


def test_rule_hint_skips_stopwords(settings):
    from apps.tutor.services import hint_service

    settings.AI_PROVIDER = ""
    settings.AI_HINT_MAX_OUTPUT_TOKENS = 400

    class FakeQuestion:
        question_text = "Perhatikan kegiatan berikut, hewan dengan kaki beruas-ruas tergolong kelas apa?"
        topic = ""
        options = []
        correct_option = "A"
        hint = ""

    class FakeMaterial:
        title = "Makhluk Hidup"
        topic = "Klasifikasi"
        content = "## Ciri Arthropoda\nTubuh beruas."
        subject = type("S", (), {"level": type("L", (), {"name": "SMP"}), "name": "IPA"})()

    hint, source = hint_service.generate_hint(None, FakeQuestion(), FakeMaterial())

    assert source == "rule"
    assert "beruas" in hint
    assert "perhatikan," not in hint
    assert "kegiatan" not in hint


class _OptionQuestion:
    question_text = "Diantara syarat sebuah satuan bisa menjadi satuan Internasional adalah ...."
    topic = ""
    options = [
        {"key": "A", "text": "Bersifat tetap dan berlaku dimana saja"},
        {"key": "B", "text": "Bersifat tetap dan berlaku di negara tertentu"},
        {"key": "C", "text": "Berubah-ubah sifatnya dan mudah diingat"},
        {"key": "D", "text": "Berlaku dimana saja dan bersifat mudah diubah-ubah nilainya"},
    ]
    correct_option = "A"
    hint = ""


def test_leak_guard_flags_paraphrased_correct_option():
    """Hint yang mengutip ulang opsi benar harus ditolak walau tidak identik."""
    from apps.tutor.services.hint_service import _looks_like_answer

    hint = (
        "Ingat bahwa satuan Internasional harus konsisten dan dapat dipakai secara "
        "universal. Bacalah tiap pilihan, cari yang menyebutkan sifat \u201ctetap\u201d "
        "dan \u201cberlaku di mana saja\u201d."
    )
    assert _looks_like_answer(hint, _OptionQuestion()) is True


def test_leak_guard_accepts_strategy_hint():
    from apps.tutor.services.hint_service import _looks_like_answer

    hint = (
        "Pikirkan ciri satuan yang dipakai di semua negara dan tidak berubah-ubah. "
        "Bandingkan tiap opsi dengan ciri tersebut."
    )
    assert _looks_like_answer(hint, _OptionQuestion()) is False


def test_rejected_leaky_hint_falls_back_to_rule(settings, monkeypatch):
    from apps.tutor.services import hint_service

    class FakeProvider:
        name = "fake"

        def complete(self, *, system_prompt, user_prompt, max_tokens=None):
            return "Jawabannya adalah A, bersifat tetap dan berlaku dimana saja."

    monkeypatch.setattr(hint_service, "get_provider", lambda: FakeProvider())

    class FakeMaterial:
        title = "Besaran dan Pengukuran"
        topic = "Besaran dan Pengukuran"
        content = "## Satuan Internasional\nSatuan baku berlaku di mana saja."
        subject = type("S", (), {"level": type("L", (), {"name": "SMP"}), "name": "IPA"})()

    hint, source = hint_service.generate_hint(None, _OptionQuestion(), FakeMaterial())

    assert source == "rule"
    assert "Jawabannya adalah A" not in hint


