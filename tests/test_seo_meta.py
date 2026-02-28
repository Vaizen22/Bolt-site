from seo.meta import build_seo_meta


def test_meta_render_has_title_description_and_canonical():
    meta = build_seo_meta("Titre", "Contenu très utile " * 20, "https://example.com", "mon-slug")
    assert meta["title"].startswith("Titre")
    assert meta["description"]
    assert meta["canonical"] == "https://example.com/posts/mon-slug.html"
