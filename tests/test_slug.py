from seo.meta import slugify


def test_slugify_handles_accents_and_spaces():
    assert slugify("Meilleur Café à Prix Bas !") == "meilleur-cafe-a-prix-bas"
