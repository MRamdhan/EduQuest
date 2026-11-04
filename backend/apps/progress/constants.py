"""Konstanta domain progres, rank, dan nyawa."""

from __future__ import annotations

from datetime import timedelta

from eduquest_logic.gamification import DEFAULT

MAX_LIVES = DEFAULT.max_lives
LIFE_REGEN_INTERVAL = timedelta(hours=1)

# Tiga tier rank: Bronze → Silver → Gold. Setiap tier membuka satu tingkat kuis.
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
