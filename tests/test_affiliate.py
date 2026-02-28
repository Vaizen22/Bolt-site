from affiliate.injector import inject_affiliate_links


def test_affiliate_injection_contains_networks(sample_config):
    article = "Comparatif pour acheter le meilleur produit aujourd'hui."
    enriched = inject_affiliate_links(article, "machine cafe", sample_config)
    assert "amazon" in enriched.lower()
    assert "awin" in enriched.lower()
    assert "tradedoubler" in enriched.lower()
    assert "liens d'affiliation" in enriched.lower()
