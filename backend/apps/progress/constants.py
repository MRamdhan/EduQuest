"""Konstanta domain progres, rank, dan nyawa."""

from __future__ import annotations

from datetime import timedelta

from eduquest_logic.gamification import DEFAULT

MAX_LIVES = DEFAULT.max_lives
LIFE_REGEN_INTERVAL = timedelta(hours=2)

# Nama rank di atas "Ayam" masih sementara dan bisa diubah lewat admin.
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
