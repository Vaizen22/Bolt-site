# Automated SEO Affiliate Blog (Python)

Projet complet pour générer et publier automatiquement des articles SEO monétisés par affiliation.

## Arborescence

```text
.
├── .env.example
├── .github/workflows/publish.yml
├── affiliate/
│   └── injector.py
├── config.yaml
├── config_loader.py
├── content/posts/
├── docs/
│   └── posts/
├── fetchers/
│   ├── api_clients.py
│   ├── scraper.py
│   └── trends.py
├── generator/
│   └── content_generator.py
├── main.py
├── publisher/
│   └── site_publisher.py
├── requirements.txt
├── seo/
│   └── meta.py
└── tests/
    ├── test_affiliate.py
    ├── test_seo_meta.py
    └── test_slug.py
```

## Fonctionnement pipeline

1. **Sélection niche + mots-clés** via Google Trends RSS + scoring intention d'achat + concurrence (Wikipedia search hits).
2. **Collecte de données publiques** via:
   - Wikipedia API
   - OpenFoodFacts API
   - NewsAPI (free tier)
   - OpenWeatherMap API
   - scraping requests + BeautifulSoup sur page Wikipedia publique
3. **Normalisation** (filtrage, déduplication, points clés)
4. **Génération article** via `transformers` (`distilgpt2` par défaut, fallback robuste)
5. **SEO on-page auto**:
   - slug propre
   - `<title>`, `<meta name="description">`, canonical
   - frontmatter markdown
   - génération `docs/sitemap.xml` et `docs/index.json`
6. **Monétisation affiliation**:
   - insertion auto de liens Amazon/Awin/TradeDoubler
   - divulgation légale en bas d'article
7. **Publication**:
   - sortie markdown dans `content/posts/`
   - sortie HTML statique dans `docs/posts/`
   - page d'aperçu visuelle `docs/index.html` (cartes + prévisualisation iframe)
   - workflow GitHub Actions planifié

## Installation locale

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```

## Tests

```bash
pytest
```

## Déploiement GitHub Pages (pas à pas)

1. Créer un dépôt GitHub et pousser ce code.
2. Ajouter les **secrets**: `NEWS_API_KEY`, `OPENWEATHERMAP_API_KEY`, `AMAZON_TAG`, `AWIN_ID`, `TRADEDOUBLER_ID`, `AFFILIATE_SUBID`, `SITE_BASE_URL`.
3. Vérifier `.github/workflows/publish.yml` (cron + manuel).
4. Dans **Settings > Pages**, choisir source `Deploy from a branch`, branche `main`, dossier `/docs`.
5. Lancer `Run workflow` pour vérifier la publication automatique.

## Variante Netlify

- Connecter le repo GitHub à Netlify.
- Build command: `python main.py` (ou exécuter via Action puis déployer dossier `docs`).
- Publish directory: `docs`.

## Ressources gratuites utilisées

- APIs: Wikipedia, OpenFoodFacts, NewsAPI free, OpenWeatherMap.
- Hébergement: GitHub Pages, Netlify.
- Affiliation: Amazon Associates, Awin, TradeDoubler.

## Monétisation

- Chaque article injecte automatiquement des liens affiliés contextualisés.
- Les clics/achats attribués aux paramètres d'affiliation génèrent des commissions.
- Setup sans capital initial (hors temps passé), exploitable en automatisation complète via GitHub Actions.
