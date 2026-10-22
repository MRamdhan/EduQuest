from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Optional, Sequence


@dataclass(frozen=True)
class AdaptiveConfig:
    min_level: int = 1
    max_level: int = 3
    start_level: int = 1
    window: int = 10
    min_attempts: int = 5
    up_threshold: float = 0.80
    down_threshold: float = 0.50


@dataclass(frozen=True)
class Attempt:
    difficulty: Optional[int]
    is_correct: Optional[bool]  # None = jawaban kosong / percobaan dibatalkan
    excluded: bool = False      # soal dilaporkan salah / sedang ditinjau


@dataclass(frozen=True)
class Decision:
    action: str                 # default | tahan | naik | turun | remedial
    previous_difficulty: Optional[int]
    next_difficulty: int
    rule_name: str
    reason: str
    accuracy: Optional[float]
    n_used: int
    config: dict


DEFAULT_CONFIG = AdaptiveConfig()


def decide(attempts: Sequence[Attempt], current_difficulty: Optional[int],
           config: AdaptiveConfig = DEFAULT_CONFIG) -> Decision:
    cfg = asdict(config)

    if current_difficulty is None:
        return Decision("default", None, config.start_level, "default_start",
                        "Belum ada tingkat/riwayat; mulai dari tingkat dasar.",
                        None, 0, cfg)

    cur = max(config.min_level, min(config.max_level, current_difficulty))
    usable = [a for a in attempts
              if a.difficulty == cur and a.is_correct is not None and not a.excluded]
    used = usable[-config.window:]
    n = len(used)

    if n < config.min_attempts:
        return Decision("tahan", cur, cur, "sampel_kurang",
                        f"Baru {n} percobaan valid di tingkat {cur}; "
                        f"minimal {config.min_attempts}.", None, n, cfg)

    acc = round(sum(1 for a in used if a.is_correct) / n, 10)

    if acc >= config.up_threshold:
        if cur < config.max_level:
            return Decision("naik", cur, cur + 1, "akurasi_tinggi",
                            f"Akurasi {acc:.0%} dari {n} soal (>= {config.up_threshold:.0%}).",
                            acc, n, cfg)
        return Decision("tahan", cur, cur, "tingkat_tertinggi",
                        f"Akurasi {acc:.0%}, sudah di tingkat tertinggi.", acc, n, cfg)

    if acc < config.down_threshold:
        if cur > config.min_level:
            return Decision("turun", cur, cur - 1, "akurasi_rendah",
                            f"Akurasi {acc:.0%} dari {n} soal (< {config.down_threshold:.0%}).",
                            acc, n, cfg)
        return Decision("remedial", cur, cur, "remedial_tingkat_terendah",
                        f"Akurasi {acc:.0%} di tingkat terendah; sarankan materi/prasyarat.",
                        acc, n, cfg)

    return Decision("tahan", cur, cur, "akurasi_menengah",
                    f"Akurasi {acc:.0%} dari {n} soal; pertahankan tingkat.", acc, n, cfg)