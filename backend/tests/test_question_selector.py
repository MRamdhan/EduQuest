import random

from eduquest_logic.question_selector import public_view, select_questions


def q(i, diff, jenjang="SMP", mapel="IPA", status="validated"):
    return {"source_id": i, "jenjang": jenjang, "mapel": mapel, "difficulty": diff,
            "review_status": status, "question_text": f"soal {i}",
            "options": [{"key": "A", "text": "x"}, {"key": "B", "text": "y"}],
            "correct_option": "A", "explanation": "rahasia"}


def bank():
    return ([q(i, 1) for i in range(0, 10)] + [q(i, 2) for i in range(10, 20)]
            + [q(i, 3) for i in range(20, 23)])


def rng():
    return random.Random(1)


def test_hanya_jenjang_mapel_dan_status_yang_sesuai():
    b = bank() + [q(100, 2, jenjang="SD"), q(101, 2, mapel="IPS"), q(102, 2, status="imported")]
    sel = select_questions(b, "SMP", "IPA", 2, 5, rng=rng())
    ids = {x["source_id"] for x in sel.questions}
    assert not ids & {100, 101, 102} and len(ids) == 5


def test_soal_baru_dikerjakan_dihindari():
    recent = set(range(10, 18))
    sel = select_questions(bank(), "SMP", "IPA", 2, 2, recent_ids=recent, rng=rng())
    assert {x["source_id"] for x in sel.questions} <= {18, 19}
    assert not sel.relaxed_recency and not sel.fallback


def test_fallback_ke_tingkat_terdekat_dengan_catatan():
    sel = select_questions(bank(), "SMP", "IPA", 3, 6, rng=rng())
    assert len(sel.questions) == 6 and sel.fallback and 2 in sel.used_levels and sel.notes


def test_seri_jarak_memilih_tingkat_lebih_rendah_dulu():
    b = [q(1, 1), q(2, 3)]
    sel = select_questions(b, "SMP", "IPA", 2, 1, rng=rng(), allow_unrated=False)
    assert sel.questions[0]["difficulty"] == 1


def test_stok_kurang_melonggarkan_riwayat_dan_mencatat():
    b = [q(i, 2) for i in range(3)]
    sel = select_questions(b, "SMP", "IPA", 2, 3, recent_ids={0, 1, 2}, rng=rng())
    assert len(sel.questions) == 3 and sel.relaxed_recency


def test_bank_kosong_tidak_membuat_soal_dan_melaporkan_kekurangan():
    sel = select_questions([], "SMP", "IPA", 2, 5, rng=rng())
    assert sel.questions == [] and sel.shortage == 5 and sel.notes


def test_soal_tanpa_tingkat_hanya_cadangan_terakhir():
    b = [q(1, 2), q(2, None)]
    sel = select_questions(b, "SMP", "IPA", 2, 2, rng=rng())
    assert [x["source_id"] for x in sel.questions] == [1, 2]
    sel2 = select_questions(b, "SMP", "IPA", 2, 2, allow_unrated=False, rng=rng())
    assert len(sel2.questions) == 1


def test_tidak_ada_soal_ganda_dalam_satu_pemilihan():
    sel = select_questions(bank(), "SMP", "IPA", 2, 15, rng=rng())
    ids = [x["source_id"] for x in sel.questions]
    assert len(ids) == len(set(ids))


def test_public_view_tidak_membocorkan_kunci():
    v = public_view(q(1, 2))
    assert "correct_option" not in v and "explanation" not in v
    assert all(set(o) == {"key", "text"} for o in v["options"])


def test_hasil_deterministik_dengan_seed_sama():
    a = select_questions(bank(), "SMP", "IPA", 2, 5, rng=random.Random(7))
    b = select_questions(bank(), "SMP", "IPA", 2, 5, rng=random.Random(7))
    assert [x["source_id"] for x in a.questions] == [x["source_id"] for x in b.questions]