"""Trend and niche selection utilities."""
from __future__ import annotations

import logging
import re
import warnings
from dataclasses import dataclass

import requests
from bs4 import BeautifulSoup, XMLParsedAsHTMLWarning
from tenacity import retry, stop_after_attempt, wait_fixed

LOGGER = logging.getLogger(__name__)
BUY_INTENT_HINTS = {"buy", "best", "review", "vs", "prix", "avis", "comparatif", "promo"}
HEADERS = {"User-Agent": "SEOAffiliateBot/1.0 (https://github.com/)"}


@dataclass
class NicheScore:
    keyword: str
    trend_score: float
    intent_score: float
    competition_score: float

    @property
    def final_score(self) -> float:
        return self.trend_score + self.intent_score - self.competition_score


@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def fetch_google_trends_keywords(geo: str = "FR") -> list[str]:
    url = f"https://trends.google.com/trending/rss?geo={geo}"
    response = requests.get(url, timeout=20, headers=HEADERS)
    response.raise_for_status()
    warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)
    soup = BeautifulSoup(response.text, "html.parser")
    return [item.title.text.strip().lower() for item in soup.find_all("item")[:20] if item.title]


@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def wiki_competition_score(keyword: str, lang: str = "fr") -> float:
    url = f"https://{lang}.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "list": "search",
        "srsearch": keyword,
        "format": "json",
    }
    response = requests.get(url, params=params, timeout=20, headers=HEADERS)
    response.raise_for_status()
    total_hits = response.json().get("query", {}).get("searchinfo", {}).get("totalhits", 100)
    return min(total_hits / 500.0, 10.0)


def compute_intent_score(keyword: str) -> float:
    tokens = set(re.findall(r"[a-zA-ZÀ-ÿ0-9]+", keyword.lower()))
    hit_count = len(tokens & BUY_INTENT_HINTS)
    length_bonus = min(len(tokens) / 6.0, 2.0)
    return 2.0 * hit_count + length_bonus


def select_best_niche(candidates: list[str], language: str = "fr") -> NicheScore:
    scored: list[NicheScore] = []
    for rank, keyword in enumerate(candidates, start=1):
        trend = max(0.0, 10 - (rank / 2))
        intent = compute_intent_score(keyword)
        try:
            competition = wiki_competition_score(keyword, language)
        except Exception as error:  # noqa: BLE001
            LOGGER.warning("Competition scoring failed for %s: %s", keyword, error)
            competition = 5.0
        scored.append(NicheScore(keyword=keyword, trend_score=trend, intent_score=intent, competition_score=competition))

    scored.sort(key=lambda item: item.final_score, reverse=True)
    return scored[0]
