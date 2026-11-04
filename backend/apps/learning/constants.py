LEVELS = [
    ("SD", "SD", 1),
    ("SMP", "SMP", 2),
    ("SMA", "SMA/SMK", 3),
]

LEVEL_BY_CODE = {code: {"name": name, "order": order} for code, name, order in LEVELS}

# Rentang kelas yang valid untuk setiap jenjang. Dipakai untuk validasi profil,
# materi, dan pilihan kelas pada API.
LEVEL_KELAS = {
    "SD": (1, 6),
    "SMP": (7, 9),
    "SMA": (10, 12),
}


def kelas_range(level_code: str) -> range:
    """Kembalikan rentang kelas untuk kode jenjang, atau rentang kosong."""
    bounds = LEVEL_KELAS.get((level_code or "").strip().upper())
    if not bounds:
        return range(0)
    start, end = bounds
    return range(start, end + 1)


def kelas_options(level_code: str) -> list[int]:
    return list(kelas_range(level_code))


def is_valid_kelas(level_code: str, kelas: int | None) -> bool:
    if kelas is None:
        return False
    return int(kelas) in kelas_range(level_code)

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
        "xp_reward": 20,
    },
    {
        "code": "perfect-score",
        "title": "Sempurna",
        "description": "Menjawab semua soal dengan benar dalam satu sesi.",
        "xp_reward": 50,
    },
    {
        "code": "material-explorer",
        "title": "Penjelajah Materi",
        "description": "Menyelesaikan lima materi berbeda.",
        "xp_reward": 30,
    },
]
