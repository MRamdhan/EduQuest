from __future__ import annotations

import logging
import re

from django.conf import settings

from apps.core.errors import ProviderUnavailable
from apps.tutor.models import TutorConversation
from apps.tutor.services.provider import get_provider

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Kamu adalah AI Tutor EduQuest untuk siswa Indonesia.
Tugasmu adalah menjawab pertanyaan belajar siswa dengan ramah, jelas, dan mendidik.

Aturan:
1. Jawab pertanyaan siswa secara langsung, informatif, dan mudah dipahami sesuai jenjang siswa (SD, SMP, atau SMA).
2. Jika pertanyaan berkaitan dengan materi yang sedang dipelajari, kaitkan penjelasannya dengan konsep materi tersebut.
3. Jika siswa menanyakan hal atau contoh edukatif yang tidak tertulis langsung di materi (seperti contoh hewan, bagian organ, atau fenomena sains), tetap jawab faktanya dengan benar, akurat, dan jelas menggunakan wawasan edukatifmu.
4. Jawab padat dan jelas (sekitar 100-180 kata), tanpa bertele-tele.
5. Langsung berikan penjelasan kepada siswa. Jangan menampilkan proses berpikir, catatan internal, atau mengulang prompt instruksi.
6. Tulis rumus atau simbol dengan teks biasa yang mudah dibaca (misalnya F = m x a, H2O, dsb. tanpa LaTeX rumit).
7. Tetap bersikap ramah, menyemangati, dan edukatif.
"""


def _headings(content: str, limit: int = 4) -> list[str]:
    headings = re.findall(r"^#{2,3}\s+(.+)$", content, flags=re.MULTILINE)
    return [heading.strip() for heading in headings[:limit]]


def _fallback_answer(material, reason: str) -> dict:
    headings = _headings(material.content)
    suggestion_text = (
        " Coba baca ulang bagian: " + ", ".join(headings) + "."
        if headings
        else ""
    )
    return {
        "available": False,
        "degraded": True,
        "answer": (
            f"AI Tutor sedang tidak dapat digunakan saat ini. {reason}"
            f" Kamu tetap bisa belajar dari materi \"{material.title}\" dan mengerjakan kuis.{suggestion_text}"
        ),
        "suggestions": headings,
        "provider": "",
    }


def ask_tutor(user, material, question: str) -> dict:
    question = (question or "").strip()
    if not question:
        return _fallback_answer(material, "Pertanyaan masih kosong.")

    question = question[: settings.AI_MAX_INPUT_CHARS]
    context = material.content[: settings.AI_MAX_CONTEXT_CHARS]

    user_prompt = f"""Konteks pembelajaran aktif:
Materi: {material.title} (Topik: {material.topic or "-"})
Jenjang: {material.subject.level.name} - Mata Pelajaran: {material.subject.name}

Isi materi terkait:
{context}

Pertanyaan siswa:
{question}

Tolong jawab pertanyaan siswa di atas dengan ramah, jelas, dan edukatif."""

    conversation = TutorConversation(
        user=user,
        material=material,
        question=question,
        provider=settings.AI_PROVIDER,
        model_name=settings.AI_MODEL,
    )

    try:
        provider = get_provider()
        answer = provider.complete(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )
    except ProviderUnavailable as exc:
        logger.info("Tutor fallback: %s", exc)
        payload = _fallback_answer(material, str(exc))
        conversation.answer = payload["answer"]
        conversation.is_degraded = True
        conversation.error_message = str(exc)[:1000]
        conversation.save()
        return payload
    except Exception as exc:  # jangan pernah memutus alur belajar karena provider
        logger.exception("Tutor provider gagal")
        payload = _fallback_answer(
            material,
            "Terjadi gangguan pada layanan AI.",
        )
        conversation.answer = payload["answer"]
        conversation.is_degraded = True
        conversation.error_message = str(exc)[:1000]
        conversation.save()
        return payload

    conversation.answer = answer
    conversation.save()
    return {
        "available": True,
        "degraded": False,
        "answer": answer,
        "suggestions": [],
        "provider": provider.name,
    }
