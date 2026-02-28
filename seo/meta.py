"""SEO metadata and formatting utilities."""
from __future__ import annotations

import re
import unicodedata
from datetime import datetime, timezone


def slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    normalized = re.sub(r"[^a-zA-Z0-9\s-]", "", normalized).strip().lower()
    return re.sub(r"[-\s]+", "-", normalized).strip("-")


def build_seo_meta(title: str, article: str, base_url: str, slug: str) -> dict[str, str]:
    description = re.sub(r"\s+", " ", article.replace("\n", " ")).strip()[:155]
    return {
        "title": f"{title} | Guide & Comparatif",
        "description": description,
        "canonical": f"{base_url.rstrip('/')}/posts/{slug}.html",
        "published_at": datetime.now(timezone.utc).isoformat(),
    }


def markdown_with_frontmatter(title: str, meta: dict[str, str], body: str) -> str:
    return (
        "---\n"
        f"title: \"{title}\"\n"
        f"description: \"{meta['description']}\"\n"
        f"canonical: \"{meta['canonical']}\"\n"
        f"published_at: \"{meta['published_at']}\"\n"
        "---\n\n"
        f"{body.strip()}\n"
    )


def render_html(title: str, meta: dict[str, str], markdown_body: str) -> str:
    html_body = "".join(f"<p>{line}</p>" for line in markdown_body.splitlines() if line.strip())
    return f"""<!DOCTYPE html>
<html lang=\"fr\">
<head>
  <meta charset=\"UTF-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
  <title>{meta['title']}</title>
  <meta name=\"description\" content=\"{meta['description']}\" />
  <link rel=\"canonical\" href=\"{meta['canonical']}\" />
</head>
<body>
  <article>
    <h1>{title}</h1>
    {html_body}
  </article>
</body>
</html>
"""
