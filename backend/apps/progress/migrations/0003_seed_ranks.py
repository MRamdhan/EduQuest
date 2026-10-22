from django.db import migrations


RANKS = [
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


def seed_ranks(apps, schema_editor):
    Rank = apps.get_model("progress", "Rank")
    for item in RANKS:
        Rank.objects.get_or_create(code=item["code"], defaults=item)


def remove_ranks(apps, schema_editor):
    Rank = apps.get_model("progress", "Rank")
    Rank.objects.filter(code__in=[item["code"] for item in RANKS]).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("progress", "0002_rank_remove_userprogress_lives_subjectprogress"),
    ]

    operations = [
        migrations.RunPython(seed_ranks, remove_ranks),
    ]
