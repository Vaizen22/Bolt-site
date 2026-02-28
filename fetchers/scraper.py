"""Public-page scraping helpers using requests + BeautifulSoup."""
from __future__ import annotations

import logging

import requests
from bs4 import BeautifulSoup
from tenacity import retry, stop_after_attempt, wait_fixed

LOGGER = logging.getLogger(__name__)


@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def scrape_key_points(url: str, max_points: int = 5) -> list[str]:
    response = requests.get(url, timeout=25, headers={"User-Agent": "SEOAffiliateBot/1.0"})
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    paragraphs = [p.get_text(" ", strip=True) for p in soup.select("p")]

    cleaned: list[str] = []
    seen: set[str] = set()
    for paragraph in paragraphs:
        if len(paragraph) < 80:
            continue
        normalized = paragraph.lower()
        if normalized in seen:
            continue
        seen.add(normalized)
        cleaned.append(paragraph)
        if len(cleaned) >= max_points:
            break

    if not cleaned:
        LOGGER.warning("No rich key points extracted from %s", url)
    return cleaned
