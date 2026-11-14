"""Service rekomendasi belajar cerdas untuk profil siswa.

Menganalisis riwayat kuis, materi yang belum tuntas, dan menghasilkan
saran belajar yang memotivasi dari AI Tutor Gemini.
"""

from __future__ import annotations

import logging

from apps.learning.models import Material
from apps.progress.models import UserMaterialProgress
from apps.tutor.services.provider import NullProvider, get_provider

logger = logging.getLogger(__name__)


def generate_learning_recommendation(user) -> dict:
    """Menghasilkan rekomendasi materi belajar terpersonalisasi untuk siswa."""
    profile = getattr(user, "student_profile", None)
    nama = user.first_name or user.username
    jenjang = profile.education_level.name if profile and profile.education_level else "Umum"
    kelas = profile.kelas if profile and profile.kelas else None

    # 1. Analisis topik lemah: kuis dengan skor < 70% atau gugur awal.
    #    Urutkan dari pengumpulan terbaru lalu hanya nilai attempt TERAKHIR
    #    per materi yang dipakai, sehingga skor lama yang sudah diperbaiki
    #    lewat kuis ulang tidak terus dianggap lemah.
    recent_attempts = (
        user.quiz_attempts.filter(status="submitted")
        .select_related("material__subject")
        .order_by("-submitted_at", "-started_at")[:10]
    )

    weak_topics_dict = {}
    seen_materials = set()
    for att in recent_attempts:
        if not att.material:
            continue
        m_id = att.material.pk
        if m_id in seen_materials:
            continue
        seen_materials.add(m_id)

        if att.percent < 70.0 or att.ended_early:
            weak_topics_dict[m_id] = {
                "material_id": m_id,
                "title": att.material.title,
                "subject": att.material.subject.name if att.material.subject else "-",
                "last_score": att.percent,
                "reason": "Perlu penguatan konsep (skor kuis terakhir di bawah 70%)"
                if att.percent < 70.0
                else "Kuis gugur lebih awal",
            }

    weak_topics = list(weak_topics_dict.values())[:3]

    # 2. Rekomendasi materi berikutnya sesuai jenjang & kelas murid
    completed_ids = UserMaterialProgress.objects.filter(
        user=user,
        status=UserMaterialProgress.Status.COMPLETED,
    ).values_list("material_id", flat=True)

    materials_query = Material.objects.filter(status=Material.Status.PUBLISHED).exclude(
        id__in=completed_ids
    ).select_related("subject__level")

    if profile and profile.education_level:
        materials_query = materials_query.filter(subject__level=profile.education_level)
    if kelas:
        materials_query = materials_query.filter(kelas=kelas)

    next_candidates = list(materials_query[:3])
    # Jika tidak ada yang cocok tepat dengan kelas, ambil yang satu jenjang
    if not next_candidates and profile and profile.education_level:
        next_candidates = list(
            Material.objects.filter(
                status=Material.Status.PUBLISHED,
                subject__level=profile.education_level,
            )
            .exclude(id__in=completed_ids)
            .select_related("subject__level")[:3]
        )

    next_topics = [
        {
            "material_id": m.pk,
            "title": m.title,
            "subject": m.subject.name if m.subject else "-",
            "kelas": m.kelas,
            "reason": "Materi kurikulum berikutnya yang belum kamu pelajari",
        }
        for m in next_candidates
    ]

    # 3. Buat narasi personal menggunakan AI Tutor Gemini (dengan fallback)
    personalized_message = _generate_ai_message(
        nama=nama,
        jenjang=jenjang,
        kelas=kelas,
        weak_topics=weak_topics,
        next_topics=next_topics,
    )

    return {
        "personalized_message": personalized_message,
        "weak_topics": weak_topics,
        "next_topics": next_topics,
    }


def _generate_ai_message(
    nama: str,
    jenjang: str,
    kelas: int | None,
    weak_topics: list[dict],
    next_topics: list[dict],
) -> str:
    """Memanggil provider AI untuk membuat saran belajar ramah dan ringkas."""
    provider = get_provider()
    if isinstance(provider, NullProvider):
        return _fallback_message(nama, weak_topics, next_topics)

    weak_str = (
        ", ".join(f"{w['title']} ({w['subject']}, skor {w['last_score']}%)" for w in weak_topics)
        if weak_topics
        else "Tidak ada kuis bernilai rendah (performa bagus!)"
    )
    next_str = (
        ", ".join(f"{n['title']} ({n['subject']})" for n in next_topics)
        if next_topics
        else "Semua materi pada jenjang ini sudah pernah dibaca"
    )

    system_prompt = (
        "Kamu adalah AI Tutor EduQuest yang cerdas, ramah, dan memotivasi murid Indonesia. "
        "Tugasmu adalah memberikan evaluasi belajar yang singkat (2-3 kalimat santun), "
        "mengapresiasi usaha murid, dan memberi saran topik yang perlu diulang atau dipelajari berikutnya."
    )

    user_prompt = (
        f"Nama murid: {nama}\n"
        f"Jenjang: {jenjang}" + (f" Kelas {kelas}" if kelas else "") + "\n"
        f"Topik yang butuh review: {weak_str}\n"
        f"Topik baru berikutnya: {next_str}\n\n"
        "Tuliskan pesan rekomendasi belajar yang personal, ramah, dan penuh semangat!"
    )

    try:
        reply = provider.complete(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=300,
        )
        if reply and len(reply.strip()) > 10:
            return reply.strip()
    except Exception as exc:
        logger.warning("Gagal memanggil AI Provider untuk rekomendasi: %s", exc)

    return _fallback_message(nama, weak_topics, next_topics)


def _fallback_message(nama: str, weak_topics: list[dict], next_topics: list[dict]) -> str:
    """Pesan cadangan jika AI offline atau kuota terbatas."""
    if weak_topics:
        target = weak_topics[0]
        return (
            f"Halo {nama}! Tetap semangat belajar ya! Berdasarkan riwayat kuis terakhirmu, "
            f"kamu bisa coba mengulang materi '{target['title']}' ({target['subject']}) "
            "untuk memperkuat pemahaman konsep sebelum melanjutkan ke tantangan berikutnya."
        )
    if next_topics:
        target = next_topics[0]
        return (
            f"Halo {nama}! Perjalanan belajarmu berjalan sangat baik. "
            f"Yuk lanjut jelajahi materi '{target['title']}' ({target['subject']}) "
            "untuk terus mengumpulkan XP dan meningkatkan rank petualangmu!"
        )
    return (
        f"Halo {nama}! Kamu sudah menyelesaikan banyak materi pembelajaran dengan luar biasa. "
        "Pertahankan streak belajarmu dan asah kemampuanmu dengan mengulang kuis di tingkat kesulitan lebih tinggi!"
    )

