"""LLM-backed article generator."""
from __future__ import annotations

import logging
from typing import Any

LOGGER = logging.getLogger(__name__)


def _build_prompt(topic: str, context_points: list[str], secondary_keywords: list[str]) -> str:
    joined_context = "\n- ".join(context_points[:8])
    joined_keywords = ", ".join(secondary_keywords)
    return (
        f"Rédige un article SEO en français sur '{topic}'.\\n"
        f"Contraintes: titre accrocheur, introduction courte, sections H2/H3, conclusion CTA.\\n"
        f"Inclure naturellement ces mots-clés: {joined_keywords}.\\n"
        f"Données utiles:\\n- {joined_context}\\n"
        "Termine avec une recommandation produit et un appel à l'action."
    )


def generate_article(topic: str, context_points: list[str], cfg: dict[str, Any]) -> str:
    prompt = _build_prompt(topic, context_points, cfg["content"].get("secondary_keywords", []))

    try:
        from transformers import pipeline  # imported lazily to keep tests fast

        model_name = cfg["llm"].get("model_name", "distilgpt2")
        generator = pipeline("text-generation", model=model_name)
        result = generator(
            prompt,
            max_new_tokens=int(cfg["llm"].get("max_new_tokens", 320)),
            temperature=float(cfg["llm"].get("temperature", 0.85)),
            do_sample=True,
        )
        generated = result[0]["generated_text"]
    except Exception as error:  # noqa: BLE001
        LOGGER.warning("Transformers generation failed (%s), using deterministic fallback", error)
        generated = (
            f"# {topic.title()} : guide d'achat 2026\n\n"
            f"{context_points[0] if context_points else 'Voici un guide pratique pour acheter malin.'}\n\n"
            "## Pourquoi cette sous-niche explose\n"
            "La demande progresse car les utilisateurs recherchent des solutions pratiques et rentables.\n\n"
            "## Les critères essentiels avant d'acheter\n"
            "- Fiabilité\n- Rapport qualité/prix\n- Disponibilité\n\n"
            "## Produits recommandés\n"
            "Comparez plusieurs options pour maximiser la valeur et éviter les achats impulsifs.\n\n"
            "## Conclusion\n"
            "Passez à l'action: choisissez un produit adapté et vérifiez les offres actuelles."
        )

    return generated
