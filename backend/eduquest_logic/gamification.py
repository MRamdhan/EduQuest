from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Optional, Sequence


@dataclass(frozen=True)
class GamificationConfig:
    xp_per_correct: int = 10
    xp_material_complete: int = 15
    xp_level_base: int = 100      # XP dari level L ke L+1 = base * L
    max_lives: int = 3
    life_loss_per_wrong: int = 1
    quiz_questions: int = 5


DEFAULT = GamificationConfig()


@dataclass(frozen=True)
class UserState:
    xp: int = 0
    lives: int = 3


@dataclass(frozen=True)
class QuizOutcome:
    state: UserState
    xp_gained: int
    lives_lost: int
    processed_count: int          # jawaban yang diproses sebelum nyawa habis
    ended_early: bool
    level_before: int
    level_after: int
    leveled_up: bool


def xp_to_reach_level(level: int, cfg: GamificationConfig = DEFAULT) -> int:
    """Total XP kumulatif agar mencapai `level` (level 1 = 0 XP)."""
    return cfg.xp_level_base * level * (level - 1) // 2


def level_from_xp(xp: int, cfg: GamificationConfig = DEFAULT) -> int:
    level = 1
    while xp >= xp_to_reach_level(level + 1, cfg):
        level += 1
    return level


def can_start_quiz(state: UserState) -> bool:
    return state.lives > 0


def apply_quiz_result(state: UserState, results: Sequence[Optional[bool]],
                      cfg: GamificationConfig = DEFAULT) -> QuizOutcome:
    """results berurutan: True benar, False salah, None kosong (tidak ada efek)."""
    xp, lives, lost, processed = state.xp, state.lives, 0, 0
    gained = 0
    ended = False
    for r in results:
        if lives <= 0:
            ended = True
            break
        processed += 1
        if r is True:
            gained += cfg.xp_per_correct
        elif r is False:
            lives = max(0, lives - cfg.life_loss_per_wrong)
            lost += cfg.life_loss_per_wrong
            if lives == 0:
                ended = processed < len(results)
                break
    lb = level_from_xp(state.xp, cfg)
    new = UserState(xp=state.xp + gained, lives=lives)
    la = level_from_xp(new.xp, cfg)
    return QuizOutcome(new, gained, min(lost, state.lives), processed, ended, lb, la, la > lb)


def complete_material(state: UserState, already_completed: bool,
                      cfg: GamificationConfig = DEFAULT):
    """XP materi hanya sekali per materi (anti-farming). Mengembalikan (state, xp_gained)."""
    if already_completed:
        return state, 0
    return replace(state, xp=state.xp + cfg.xp_material_complete), cfg.xp_material_complete


def restore_lives(state: UserState, amount: int,
                  cfg: GamificationConfig = DEFAULT) -> UserState:
    return replace(state, lives=min(cfg.max_lives, state.lives + max(0, amount)))