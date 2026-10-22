LEVELS = [
    ("SD", "SD", 1),
    ("SMP", "SMP", 2),
    ("SMA", "SMA/SMK", 3),
]

LEVEL_BY_CODE = {code: {"name": name, "order": order} for code, name, order in LEVELS}

QUIZ_LEVEL_LABELS = {
    1: "Dasar",
    2: "Menengah",
    3: "Lanjut",
}

ACHIEVEMENTS = [
    {
        "code": "first-quiz",
        "title": "Langkah Pertama",
        "description": "Menyelesaikan kuis pertamamu.",
        "xp_reward": 0,
    },
    {
        "code": "perfect-score",
        "title": "Sempurna",
        "description": "Menjawab semua soal dengan benar dalam satu sesi.",
        "xp_reward": 0,
    },
    {
        "code": "material-explorer",
        "title": "Penjelajah Materi",
        "description": "Menyelesaikan lima materi berbeda.",
        "xp_reward": 0,
    },
]
