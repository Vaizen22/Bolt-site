"""Affiliate link injection."""
from __future__ import annotations

from urllib.parse import quote_plus

PRODUCT_HINTS = ["acheter", "prix", "comparatif", "meilleur", "produit", "offre"]


def build_affiliate_links(keyword: str, cfg: dict) -> dict[str, str]:
    templates = cfg["affiliate"]["templates"]
    runtime = cfg["affiliate_runtime"]
    encoded_amazon_target = quote_plus(f"https://www.amazon.fr/s?k={keyword}")

    return {
        "amazon": templates["amazon"].format(query=quote_plus(keyword), tag=runtime.get("amazon_tag", "")),
        "awin": templates["awin"].format(
            awin_id=runtime.get("awin_id", ""),
            subid=runtime.get("subid", "bot"),
            encoded_url=encoded_amazon_target,
        ),
        "tradedoubler": templates["tradedoubler"].format(
            td_id=runtime.get("tradedoubler_id", ""),
            subid=runtime.get("subid", "bot"),
            encoded_url=encoded_amazon_target,
        ),
    }


def inject_affiliate_links(article: str, keyword: str, cfg: dict) -> str:
    links = build_affiliate_links(keyword, cfg)
    cta_block = (
        "\n\n## Bon plan du moment\n"
        f"- Amazon: [{keyword}]({links['amazon']})\n"
        f"- Awin: [Offres partenaires]({links['awin']})\n"
        f"- TradeDoubler: [Voir promotions]({links['tradedoubler']})\n"
    )

    lowered = article.lower()
    if any(hint in lowered for hint in PRODUCT_HINTS):
        article = article + cta_block
    else:
        article = article + "\n\n" + cta_block

    return article + f"\n\n> {cfg['affiliate']['legal_disclosure']}\n"
