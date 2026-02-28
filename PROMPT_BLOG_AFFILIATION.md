# Prompt prêt à copier-coller

Tu es un **ingénieur logiciel senior** spécialisé en automatisation de contenu SEO et monétisation par affiliation. 
Je veux que tu **codes un projet complet, exécutable et prêt à déployer** qui crée un blog automatisé monétisé.

## Objectif business
Construire un blog dans une niche rentable (par exemple `meilleurs gadgets tech`, `recettes santé`, `équipements sport maison`, etc.) qui :
1. publie automatiquement des articles SEO,
2. intègre des liens d’affiliation automatiquement,
3. fonctionne sans intervention humaine grâce à une exécution planifiée,
4. soit hébergeable gratuitement (GitHub Pages ou Netlify).

## Contraintes techniques obligatoires
- Langage principal : **Python 3.11+**.
- Scraping / collecte : **requests** + **BeautifulSoup4**.
- Génération de texte : **modèle open-source** via **transformers** (ex: GPT-Neo / GPT-J / distilgpt2 selon ressources).
- Publication statique : générer des fichiers Markdown/HTML + métadonnées SEO.
- Automatisation : **GitHub Actions** avec un workflow `.github/workflows/publish.yml` déclenché par `schedule` + `workflow_dispatch`.
- Déploiement : compatible **GitHub Pages** (et documenter variante Netlify).
- Le code doit être structuré, lisible, commenté, avec fichiers de config.

## Fonctionnement attendu (à coder)
Implémente un pipeline de bout en bout :
1. **Choix de niche et mots-clés** : fichier de config (`config.yaml` ou `.env`) contenant niche, langue, fréquence, sources et identifiants d’affiliation.
2. **Collecte de données publiques** :
   - APIs gratuites (au moins 2 parmi : Wikipedia API, OpenFoodFacts, NewsAPI free, OpenWeatherMap).
   - Scraping complémentaire de pages publiques autorisées.
3. **Normalisation des données** : nettoyage, déduplication, extraction des points clés.
4. **Génération d’article** avec un LLM open-source via `transformers` :
   - titre SEO optimisé,
   - chapô,
   - sections H2/H3,
   - conclusion avec CTA,
   - style naturel, informatif, original.
5. **SEO on-page automatique** :
   - balises `<title>`, `<meta name="description">`, slug propre,
   - structure Markdown avec `#`, `##`, paragraphes courts,
   - mots-clés secondaires intégrés naturellement,
   - fichier `sitemap.xml` et index mis à jour.
6. **Monétisation affiliation automatique** :
   - détecter des emplacements produits pertinents dans l’article,
   - injecter des liens affiliés (Amazon Associates + exemple Awin/TradeDoubler),
   - utiliser un template d’URL affiliée configurable (`tag`, `subid`, etc.),
   - ajouter divulgation légale affiliation en pied d’article.
7. **Publication** : écrire l’article dans le dossier du site (`content/posts/...`) puis commit/push automatique via GitHub Actions.

## Exigences de qualité du code
- Fournir une arborescence complète du projet.
- Générer **tout le code source** (pas un pseudo-code).
- Inclure :
  - `requirements.txt` (ou `pyproject.toml`),
  - `README.md` détaillé,
  - `.env.example`,
  - script principal `main.py`,
  - modules (`fetchers/`, `generator/`, `seo/`, `affiliate/`, `publisher/`),
  - workflow GitHub Actions complet.
- Ajouter des logs clairs, gestion d’erreurs robuste, retries réseau.
- Ajouter des tests unitaires de base (pytest) pour au moins : génération de slug, insertion de liens affiliés, rendu meta SEO.

## Ressources gratuites à lister et intégrer dans la doc
Tu dois inclure dans le README une section “Ressources gratuites” avec :
- APIs publiques gratuites : OpenWeatherMap, OpenFoodFacts, NewsAPI free, Wikipedia API.
- Hébergement gratuit : GitHub Pages, Netlify.
- Affiliation gratuite : Amazon Associates, Awin, TradeDoubler.

## Monétisation à expliquer dans la documentation
Dans le README, ajoute une section “Monétisation” expliquant clairement :
- comment les liens affiliés sont injectés automatiquement dans chaque article,
- comment cela génère des commissions sur les ventes,
- que l’affiliation peut être largement automatisée,
- qu’on peut démarrer sans capital initial (hors temps de setup).

## Déploiement à fournir pas à pas
Donne les étapes exactes :
1. créer un dépôt GitHub,
2. ajouter secrets GitHub (API keys, tag affiliation),
3. activer GitHub Actions (cron),
4. activer GitHub Pages,
5. vérifier la publication automatique.

## Format de ta réponse
- Commence par l’arborescence du projet.
- Ensuite donne chaque fichier avec son chemin puis son contenu complet.
- Termine par les commandes de lancement local (`python main.py`) et de test (`pytest`).
- Le résultat doit être **directement copiable** pour produire un site automatisé.
