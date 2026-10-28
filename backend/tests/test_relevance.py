"""Tes modul relevansi soal–materi (logika murni)."""

from eduquest_logic.relevance import build_idf, keywords, score


def test_keywords_remove_stopwords_and_duplicates():
    assert keywords("Perhatikan kegiatan berikut: hewan dengan kaki beruas-ruas") == [
        "hewan",
        "kaki",
        "beruas",
        "ruas",
    ]


def test_score_rewards_shared_terms():
    idf = build_idf(
        [
            "gaya gesek benda bergerak",
            "fotosintesis tumbuhan daun klorofil",
            "gunung berapi mengeluarkan lava",
        ]
    )
    material = "Materi gaya: gaya mempengaruhi gerak benda sehari-hari."

    related = score("Apa hubungan gaya dengan gerak benda?", material, idf)
    unrelated = score("Apa yang dikeluarkan gunung berapi?", material, idf)

    assert related > 0.6
    assert unrelated == 0.0


def test_rare_terms_weigh_more_than_common_terms():
    idf = build_idf(
        [
            "benda bergerak karena gaya",
            "benda diam",
            "benda jatuh",
            "benda terapung",
            "fotosintesis klorofil",
        ]
    )
    material = "Penjelasan fotosintesis dan klorofil pada tumbuhan."

    rare_hit = score("Jelaskan fotosintesis!", material, idf)
    common_hit = score("Jelaskan benda!", "benda bergerak karena gaya", idf)

    assert rare_hit > common_hit


def test_score_zero_for_empty_text():
    assert score("", "materi apa saja", {}) == 0.0
    assert score("pertanyaan", "", {}) == 0.0
