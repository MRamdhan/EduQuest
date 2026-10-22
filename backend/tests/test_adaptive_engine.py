from eduquest_logic.adaptive_engine import AdaptiveConfig, Attempt, decide


def make(level, results):
    return [Attempt(level, r) for r in results]


def test_tanpa_riwayat_mulai_dari_dasar():
    d = decide([], None)
    assert d.action == "default" and d.next_difficulty == 1


def test_sampel_kurang_tidak_berubah():
    d = decide(make(2, [True] * 4), 2)
    assert d.action == "tahan" and d.rule_name == "sampel_kurang" and d.next_difficulty == 2


def test_satu_jawaban_tidak_mengubah_tingkat():
    assert decide(make(2, [False]), 2).next_difficulty == 2


def test_akurasi_tepat_80_naik_satu_tingkat():
    d = decide(make(1, [True] * 4 + [False]), 1)
    assert d.action == "naik" and d.next_difficulty == 2


def test_akurasi_di_bawah_80_tahan():
    d = decide(make(1, [True] * 3 + [False] * 2), 1)  # 60%
    assert d.action == "tahan"


def test_akurasi_tepat_50_tahan_dan_di_bawah_50_turun():
    assert decide(make(2, [True] * 5 + [False] * 5), 2).action == "tahan"
    d = decide(make(2, [True] * 2 + [False] * 3), 2)  # 40%
    assert d.action == "turun" and d.next_difficulty == 1


def test_tingkat_tertinggi_tidak_naik_lagi():
    d = decide(make(3, [True] * 5), 3)
    assert d.action == "tahan" and d.next_difficulty == 3


def test_tingkat_terendah_akurasi_rendah_remedial():
    d = decide(make(1, [False] * 5), 1)
    assert d.action == "remedial" and d.next_difficulty == 1


def test_jawaban_kosong_dan_soal_dikecualikan_diabaikan():
    att = make(2, [True] * 4) + [Attempt(2, None), Attempt(2, False, excluded=True)]
    assert decide(att, 2).rule_name == "sampel_kurang"


def test_percobaan_tingkat_lain_tidak_dihitung():
    att = make(1, [True] * 5) + make(2, [False] * 2)
    assert decide(att, 2).rule_name == "sampel_kurang"


def test_perubahan_maksimal_satu_tingkat():
    d = decide(make(1, [True] * 10), 1)
    assert d.next_difficulty - d.previous_difficulty == 1


def test_jendela_hanya_memakai_percobaan_terbaru():
    cfg = AdaptiveConfig(window=5, min_attempts=5)
    att = make(2, [False] * 10 + [True] * 5)
    assert decide(att, 2, cfg).action == "naik"


def test_keputusan_deterministik_dan_menyimpan_alasan():
    att = make(2, [True] * 5)
    a, b = decide(att, 2), decide(att, 2)
    assert a == b and a.reason and a.config["up_threshold"] == 0.80