"""Ganti rank placeholder dengan Bronze/Silver/Gold dan seed achievement.

Data ditulis ulang di sini (bukan mengimpor konstanta aplikasi) supaya migrasi
tetap stabil meskipun konstanta berubah di masa depan.
"""

from django.db import migrations


OLD_RANKS = [
    {
        "code": "ayam",
        "name": "Ayam",
        "order": 1,
        "min_xp": 0,
        "unlocked_difficulty": 1,
        "icon": "🐔",
        "description": "Rank terendah. Mulai perjalanan belajar dari sini.",
    },
    {
        "code": "rank-2",
        "name": "Rank 2",
        "order": 2,
        "min_xp": 100,
        "unlocked_difficulty": 2,
        "icon": "🥚",
        "description": "Nama sementara. Ubah nama rank di admin.",
    },
    {
        "code": "rank-3",
        "name": "Rank 3",
        "order": 3,
        "min_xp": 300,
        "unlocked_difficulty": 3,
        "icon": "🐣",
        "description": "Nama sementara. Ubah nama rank di admin.",
    },
    {
        "code": "rank-4",
        "name": "Rank 4",
        "order": 4,
        "min_xp": 600,
        "unlocked_difficulty": 3,
        "icon": "🐤",
        "description": "Nama sementara. Ubah nama rank di admin.",
    },
    {
        "code": "rank-5",
        "name": "Rank 5",
        "order": 5,
        "min_xp": 1000,
        "unlocked_difficulty": 3,
        "icon": "🐥",
        "description": "Nama sementara. Ubah nama rank di admin.",
    },
]

RANKS = [
    {
        "code": "bronze",
        "name": "Bronze",
        "order": 1,
        "min_xp": 0,
        "unlocked_difficulty": 1,
        "icon": "🥉",
        "description": "Rank awal. Mulai perjalanan belajar dari tingkat Dasar.",
    },
    {
        "code": "silver",
        "name": "Silver",
        "order": 2,
        "min_xp": 100,
        "unlocked_difficulty": 2,
        "icon": "🥈",
        "description": "Terbuka pada 100 XP. Tingkat Menengah terbuka.",
    },
    {
        "code": "gold",
        "name": "Gold",
        "order": 3,
        "min_xp": 300,
        "unlocked_difficulty": 3,
        "icon": "🥇",
        "description": "Terbuka pada 300 XP. Tingkat Lanjut terbuka.",
    },
]

ACHIEVEMENTS = [
    {
        "code": "first-quiz",
        "title": "Langkah Pertama",
        "description": "Menyelesaikan kuis pertamamu.",
        "xp_reward": 20,
        "is_active": True,
    },
    {
        "code": "perfect-score",
        "title": "Sempurna",
        "description": "Menjawab semua soal dengan benar dalam satu sesi.",
        "xp_reward": 50,
        "is_active": True,
    },
    {
        "code": "material-explorer",
        "title": "Penjelajah Materi",
        "description": "Menyelesaikan lima materi berbeda.",
        "xp_reward": 30,
        "is_active": True,
    },
]


def seed_ranks_and_achievements(apps, schema_editor):
    Rank = apps.get_model("progress", "Rank")
    Achievement = apps.get_model("progress", "Achievement")

    # Hapus placeholder lebih dulu agar kolom `order` yang unik tidak bentrok.
    Rank.objects.filter(code__in=[item["code"] for item in OLD_RANKS]).delete()
    for item in RANKS:
        Rank.objects.update_or_create(code=item["code"], defaults=item)
    for item in ACHIEVEMENTS:
        Achievement.objects.update_or_create(code=item["code"], defaults=item)


def restore_placeholders(apps, schema_editor):
    Rank = apps.get_model("progress", "Rank")
    Achievement = apps.get_model("progress", "Achievement")

    Rank.objects.filter(code__in=[item["code"] for item in RANKS]).delete()
    for item in OLD_RANKS:
        Rank.objects.update_or_create(code=item["code"], defaults=item)
    Achievement.objects.filter(
        code__in=[item["code"] for item in ACHIEVEMENTS]
    ).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("progress", "0003_seed_ranks"),
    ]

    operations = [
        migrations.RunPython(seed_ranks_and_achievements, restore_placeholders),
    ]
