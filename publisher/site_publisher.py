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
<html lang=\"fr\">
<head>
  <meta charset=\"UTF-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
  <title>{site_name}</title>
  <style>
    :root {{
      color-scheme: light dark;
      --bg: #0f172a;
      --card: #111827;
      --text: #e5e7eb;
      --muted: #9ca3af;
      --accent: #22c55e;
    }}
    body {{
      margin: 0;
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: radial-gradient(circle at top, #1f2937, var(--bg));
      color: var(--text);
    }}
    .container {{ max-width: 1000px; margin: 0 auto; padding: 2rem 1rem 3rem; }}
    h1 {{ margin-bottom: .25rem; }}
    .subtitle {{ color: var(--muted); margin-bottom: 1.25rem; }}
    .actions {{ display: flex; gap: .75rem; flex-wrap: wrap; margin-bottom: 1.5rem; }}
    .btn {{
      background: var(--accent);
      color: #052e16;
      border: 0;
      border-radius: .6rem;
      padding: .65rem .9rem;
      text-decoration: none;
      font-weight: 600;
    }}
    .btn.secondary {{ background: #374151; color: var(--text); }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }}
    .card {{
      background: color-mix(in srgb, var(--card) 92%, white 8%);
      border: 1px solid #374151;
      border-radius: .85rem;
      padding: 1rem;
    }}
    .card h3 {{ margin: 0 0 .35rem; font-size: 1rem; }}
    .card p {{ margin: 0 0 .75rem; color: var(--muted); font-size: .9rem; }}
    .preview {{ margin-top: 2rem; background: #ffffff; color: #111827; border-radius: .85rem; overflow: hidden; }}
    .preview iframe {{ width: 100%; min-height: 550px; border: 0; }}
  </style>
</head>
<body>
  <main class=\"container\">
    <h1>{site_name}</h1>
    <p class=\"subtitle\">Rendu visuel du blog SEO automatisé + affiliation.</p>

    <div class=\"actions\">
      <a class=\"btn\" href=\"./index.json\">Voir l'index JSON</a>
      <a class=\"btn secondary\" href=\"./sitemap.xml\">Voir le sitemap</a>
    </div>

    <section>
      <h2>Articles publiés</h2>
      <div id=\"posts\" class=\"grid\"></div>
    </section>

    <section class=\"preview\">
      <iframe id=\"preview-frame\" title=\"Aperçu article\"></iframe>
    </section>
  </main>

  <script>
    async function loadPosts() {{
      const response = await fetch('./index.json');
      const posts = await response.json();
      const container = document.getElementById('posts');
      const frame = document.getElementById('preview-frame');

      if (!posts.length) {{
        container.innerHTML = '<p>Aucun article publié pour le moment.</p>';
        return;
      }}

      frame.src = `./posts/${{posts[0].slug}}.html`;
      container.innerHTML = posts
        .map((post, index) => `
          <article class="card">
            <h3>${{post.slug.replace(/-/g, ' ')}}</h3>
            <p>Article SEO monétisé prêt à indexer.</p>
            <a class="btn secondary" href="./posts/${{post.slug}}.html" target="_blank">Ouvrir l'article</a>
            <button class="btn" style="margin-left:.5rem" onclick="document.getElementById('preview-frame').src='./posts/${{post.slug}}.html'">Prévisualiser</button>
          </article>
        `)
        .join('');
    }}

    loadPosts().catch((error) => {{
      document.getElementById('posts').innerHTML = `<p>Erreur de chargement: ${{error.message}}</p>`;
    }});
  </script>
</body>
</html>"""
    Path("docs").mkdir(exist_ok=True)
    (Path("docs") / "index.html").write_text(html, encoding="utf-8")
