"""End-to-end automated SEO affiliate blog pipeline."""
from __future__ import annotations

import logging

from affiliate.injector import inject_affiliate_links
from config_loader import load_config
from fetchers.api_clients import (
    fetch_news_headlines,
    fetch_openfoodfacts_examples,
    fetch_weather_angle,
    fetch_wikipedia_summary,
)
from fetchers.scraper import scrape_key_points
from fetchers.trends import fetch_google_trends_keywords, select_best_niche
from generator.content_generator import generate_article
from publisher.site_publisher import update_docs_home, update_index, update_sitemap, write_post
from seo.meta import build_seo_meta, markdown_with_frontmatter, render_html, slugify

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s - %(message)s")
LOGGER = logging.getLogger("pipeline")


def build_context(topic: str, cfg: dict) -> list[str]:
    points: list[str] = []

    try:
        wiki_data = fetch_wikipedia_summary(topic, cfg["site"].get("language", "fr"))
        points.append(wiki_data.get("extract", ""))
    except Exception as error:  # noqa: BLE001
        LOGGER.warning("Wikipedia summary fetch failed: %s", error)
        wiki_data = {"url": ""}

    if wiki_data.get("url") and cfg["sources"].get("scraping_enabled", True):
        try:
            points.extend(scrape_key_points(wiki_data["url"], max_points=4))
        except Exception as error:  # noqa: BLE001
            LOGGER.warning("Scraping failed for %s: %s", wiki_data['url'], error)

    try:
        points.extend([f"Produit OFF: {p['name']} ({p['brands']})" for p in fetch_openfoodfacts_examples(topic)])
    except Exception as error:  # noqa: BLE001
        LOGGER.warning("OpenFoodFacts fetch failed: %s", error)

    try:
        points.extend(fetch_news_headlines(topic, cfg["api_keys"].get("newsapi", ""), cfg["site"].get("language", "fr")))
    except Exception as error:  # noqa: BLE001
        LOGGER.warning("NewsAPI fetch failed: %s", error)

    try:
        weather = fetch_weather_angle("Paris", cfg["api_keys"].get("openweathermap", ""))
        if weather:
            points.append(weather)
    except Exception as error:  # noqa: BLE001
        LOGGER.warning("OpenWeather fetch failed: %s", error)

    deduplicated = [p.strip() for p in points if p and len(p.strip()) > 20]
    seen: set[str] = set()
    final_points: list[str] = []
    for point in deduplicated:
        marker = point.lower()
        if marker in seen:
            continue
        seen.add(marker)
        final_points.append(point)
    return final_points[:12]


def run() -> None:
    cfg = load_config()

    trend_keywords = fetch_google_trends_keywords("FR")
    candidates = trend_keywords[: cfg["pipeline"].get("max_candidates", 8)] + cfg["content"].get("candidate_niches", [])
    best = select_best_niche(candidates, cfg["site"].get("language", "fr"))
    topic = best.keyword
    LOGGER.info("Selected niche: %s (score=%.2f)", topic, best.final_score)

    context = build_context(topic, cfg)
    article = generate_article(topic, context, cfg)
    article = inject_affiliate_links(article, topic, cfg)

    slug = slugify(topic)
    meta = build_seo_meta(topic.title(), article, cfg["site"].get("base_url", ""), slug)
    markdown_text = markdown_with_frontmatter(topic.title(), meta, article)
    html_text = render_html(topic.title(), meta, article)

    md_path, html_path = write_post(
        cfg["pipeline"]["output_markdown_dir"],
        cfg["pipeline"]["output_html_dir"],
        slug,
        markdown_text,
        html_text,
    )
    update_index(cfg["site"].get("base_url", ""), cfg["pipeline"]["output_html_dir"])
    update_sitemap(cfg["site"].get("base_url", ""), cfg["pipeline"]["output_html_dir"])
    update_docs_home(cfg["site"].get("name", "Auto SEO Blog"))

    LOGGER.info("Published markdown: %s", md_path)
    LOGGER.info("Published html: %s", html_path)


if __name__ == "__main__":
    run()
