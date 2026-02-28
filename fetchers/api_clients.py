"""Free API clients used by the pipeline."""
from __future__ import annotations

import logging
from typing import Any

import requests
from tenacity import retry, stop_after_attempt, wait_exponential

LOGGER = logging.getLogger(__name__)
HEADERS = {"User-Agent": "SEOAffiliateBot/1.0 (https://github.com/)"}


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=6))
def fetch_wikipedia_summary(topic: str, lang: str = "fr") -> dict[str, Any]:
    rest_url = f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{topic.replace(' ', '_')}"
    resp = requests.get(rest_url, timeout=25, headers=HEADERS)
    if resp.ok:
        data = resp.json()
        return {
            "title": data.get("title", topic),
            "extract": data.get("extract", ""),
            "url": data.get("content_urls", {}).get("desktop", {}).get("page", ""),
        }

    # Fallback to classic MediaWiki API (more permissive on some environments)
    api_url = f"https://{lang}.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "prop": "extracts|info",
        "inprop": "url",
        "titles": topic,
        "exintro": 1,
        "explaintext": 1,
        "format": "json",
    }
    fallback = requests.get(api_url, params=params, timeout=25, headers=HEADERS)
    fallback.raise_for_status()
    pages = fallback.json().get("query", {}).get("pages", {})
    first_page = next(iter(pages.values()), {})
    return {
        "title": first_page.get("title", topic),
        "extract": first_page.get("extract", f"Résumé indisponible pour {topic}"),
        "url": first_page.get("fullurl", ""),
    }


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=6))
def fetch_openfoodfacts_examples(query: str) -> list[dict[str, Any]]:
    url = "https://world.openfoodfacts.org/cgi/search.pl"
    params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1,
        "page_size": 5,
    }
    resp = requests.get(url, params=params, timeout=25, headers=HEADERS)
    resp.raise_for_status()
    products = resp.json().get("products", [])
    return [
        {
            "name": p.get("product_name", "Produit"),
            "brands": p.get("brands", ""),
            "url": p.get("url", ""),
        }
        for p in products
    ]


def fetch_news_headlines(query: str, api_key: str, lang: str = "fr") -> list[str]:
    if not api_key:
        LOGGER.warning("NEWS_API_KEY missing: skipping NewsAPI fetch")
        return []

    url = "https://newsapi.org/v2/everything"
    params = {"q": query, "language": lang, "pageSize": 5, "sortBy": "publishedAt", "apiKey": api_key}
    resp = requests.get(url, params=params, timeout=25, headers=HEADERS)
    resp.raise_for_status()
    return [item.get("title", "") for item in resp.json().get("articles", []) if item.get("title")]


def fetch_weather_angle(city: str, api_key: str) -> str:
    if not api_key:
        LOGGER.warning("OPENWEATHERMAP_API_KEY missing: skipping weather context")
        return ""

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"q": city, "appid": api_key, "units": "metric", "lang": "fr"}
    resp = requests.get(url, params=params, timeout=25, headers=HEADERS)
    resp.raise_for_status()
    data = resp.json()
    desc = data.get("weather", [{}])[0].get("description", "")
    temp = data.get("main", {}).get("temp", "?")
    return f"Contexte météo pour {city}: {desc}, {temp}°C"
