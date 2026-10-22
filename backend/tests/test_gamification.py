from eduquest_logic.gamification import (UserState, apply_quiz_result, can_start_quiz,
                                         complete_material, level_from_xp,
                                         restore_lives, xp_to_reach_level)


def test_ambang_level_100_kali_level():
    assert [xp_to_reach_level(l) for l in (1, 2, 3, 4, 5)] == [0, 100, 300, 600, 1000]
    assert level_from_xp(0) == 1 and level_from_xp(99) == 1
    assert level_from_xp(100) == 2 and level_from_xp(299) == 2 and level_from_xp(300) == 3


def test_xp_10_per_benar():
    o = apply_quiz_result(UserState(0, 3), [True, True, True, True, True])
    assert o.xp_gained == 50 and o.state.xp == 50 and o.lives_lost == 0 and not o.ended_early


def test_salah_mengurangi_nyawa_kosong_tidak():
    o = apply_quiz_result(UserState(0, 3), [False, None, True, None, None])
    assert o.lives_lost == 1 and o.state.lives == 2 and o.xp_gained == 10


def test_nyawa_habis_mengakhiri_sesi_lebih_awal():
    o = apply_quiz_result(UserState(0, 3), [False, False, False, True, True])
    assert o.state.lives == 0 and o.ended_early and o.processed_count == 3
    assert o.xp_gained == 0 and o.lives_lost == 3


def test_nyawa_habis_di_soal_terakhir_bukan_berakhir_lebih_awal():
    o = apply_quiz_result(UserState(0, 1), [True, True, True, True, False])
    assert o.state.lives == 0 and not o.ended_early and o.xp_gained == 40


def test_tanpa_nyawa_tidak_bisa_mulai_kuis_dan_tidak_ada_reward():
    s = UserState(10, 0)
    assert not can_start_quiz(s)
    o = apply_quiz_result(s, [True, True])
    assert o.xp_gained == 0 and o.state == s


def test_naik_level_terdeteksi():
    o = apply_quiz_result(UserState(80, 3), [True, True, True])
    assert o.leveled_up and o.level_before == 1 and o.level_after == 2


def test_xp_materi_15_hanya_sekali():
    s, g = complete_material(UserState(0, 3), already_completed=False)
    assert g == 15 and s.xp == 15
    s2, g2 = complete_material(s, already_completed=True)
    assert g2 == 0 and s2.xp == 15


def test_pemulihan_nyawa_tidak_melebihi_maksimal():
    assert restore_lives(UserState(0, 1), 5).lives == 3
    assert restore_lives(UserState(0, 1), -2).lives == 1


def test_state_awal_tidak_berubah():
    s = UserState(0, 3)
    apply_quiz_result(s, [False])
    assert s == UserState(0, 3)