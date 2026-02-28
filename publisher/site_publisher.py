"""Write markdown/html posts and maintain static indexes."""
from __future__ import annotations

import json
from pathlib import Path


def ensure_dirs(*paths: str) -> None:
    for path in paths:
        Path(path).mkdir(parents=True, exist_ok=True)


def write_post(markdown_dir: str, html_dir: str, slug: str, markdown_text: str, html_text: str) -> tuple[Path, Path]:
    ensure_dirs(markdown_dir, html_dir)
    md_path = Path(markdown_dir) / f"{slug}.md"
    html_path = Path(html_dir) / f"{slug}.html"
    md_path.write_text(markdown_text, encoding="utf-8")
    html_path.write_text(html_text, encoding="utf-8")
    return md_path, html_path


def update_index(base_url: str, html_dir: str) -> None:
    html_path = Path(html_dir)
    posts = sorted(html_path.glob("*.html"), reverse=True)
    data = [{"slug": p.stem, "url": f"{base_url.rstrip('/')}/posts/{p.name}"} for p in posts]
    (Path("docs") / "index.json").write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def update_sitemap(base_url: str, html_dir: str) -> None:
    html_path = Path(html_dir)
    urls = [f"{base_url.rstrip('/')}/posts/{p.name}" for p in sorted(html_path.glob("*.html"), reverse=True)]
    xml = ["<?xml version=\"1.0\" encoding=\"UTF-8\"?>", '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    xml.extend([f"  <url><loc>{url}</loc></url>" for url in urls])
    xml.append("</urlset>")
    (Path("docs") / "sitemap.xml").write_text("\n".join(xml), encoding="utf-8")


def update_docs_home(site_name: str) -> None:
    html = f"""<!DOCTYPE html>
<html lang=\"fr\"><head><meta charset=\"UTF-8\"><title>{site_name}</title></head>
<body>
  <h1>{site_name}</h1>
  <p>Blog automatisé SEO + affiliation.</p>
  <p>Consultez <a href=\"./index.json\">l'index JSON</a> ou le <a href=\"./sitemap.xml\">sitemap</a>.</p>
</body></html>"""
    Path("docs").mkdir(exist_ok=True)
    (Path("docs") / "index.html").write_text(html, encoding="utf-8")
