import pytest

from eduquest_logic.scoring import AlreadySubmitted, grade_quiz, to_adaptive_attempts


def q(i, key="B"):
    return {"source_id": i, "correct_option": key, "difficulty": 2,
            "options": [{"key": k, "text": k} for k in "ABCD"]}


def test_penilaian_benar_salah_dan_ringkasan():
    served = [q(1), q(2), q(3)]
    res, s = grade_quiz(served, {1: "B", 2: "A", 3: "b"})
    assert [r.is_correct for r in res] == [True, False, True]
    assert (s.correct, s.wrong, s.unanswered, s.total, s.percent) == (2, 1, 0, 3, 66.7)


def test_jawaban_kosong_bukan_salah():
    res, s = grade_quiz([q(1), q(2)], {1: "B"})
    assert res[1].is_correct is None and s.unanswered == 1 and s.wrong == 0


def test_key_tidak_valid_dianggap_kosong_bukan_salah():
    res, s = grade_quiz([q(1)], {1: "Z"})
    assert res[0].is_correct is None and not res[0].valid_answer and s.wrong == 0


def test_id_soal_yang_tidak_disajikan_diabaikan():
    res, s = grade_quiz([q(1)], {1: "B", 99: "B"})
    assert len(res) == 1 and s.total == 1


def test_pengiriman_ganda_ditolak():
    with pytest.raises(AlreadySubmitted):
        grade_quiz([q(1)], {1: "B"}, already_submitted=True)


def test_konversi_ke_percobaan_adaptif():
    served = [q(1), q(2)]
    res, _ = grade_quiz(served, {1: "B", 2: "A"})
    att = to_adaptive_attempts(res, {1: 2, 2: 2}, excluded_ids=[2])
    assert att[0].is_correct is True and att[1].excluded is True and att[0].difficulty == 2
