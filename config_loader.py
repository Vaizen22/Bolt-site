"""Configuration loader for the SEO affiliate pipeline."""
from __future__ import annotations

import os
import re
from pathlib import Path
from typing import Any

import yaml
from dotenv import load_dotenv


ENV_PATTERN = re.compile(r"\$\{([A-Z0-9_]+)\}")


def _expand_env(value: Any) -> Any:
    if isinstance(value, dict):
        return {k: _expand_env(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_expand_env(v) for v in value]
    if isinstance(value, str):
        def replace(match: re.Match[str]) -> str:
            env_name = match.group(1)
            return os.getenv(env_name, "")

        return ENV_PATTERN.sub(replace, value)
    return value


def load_config(path: str = "config.yaml") -> dict[str, Any]:
    load_dotenv()
    config_path = Path(path)
    if not config_path.exists():
        raise FileNotFoundError(f"Missing config file: {path}")

    raw = yaml.safe_load(config_path.read_text(encoding="utf-8"))
    config = _expand_env(raw)

    config.setdefault("api_keys", {})
    config["api_keys"]["newsapi"] = os.getenv("NEWS_API_KEY", "")
    config["api_keys"]["openweathermap"] = os.getenv("OPENWEATHERMAP_API_KEY", "")

    config.setdefault("affiliate_runtime", {})
    config["affiliate_runtime"]["amazon_tag"] = os.getenv("AMAZON_TAG", "")
    config["affiliate_runtime"]["awin_id"] = os.getenv("AWIN_ID", "")
    config["affiliate_runtime"]["tradedoubler_id"] = os.getenv("TRADEDOUBLER_ID", "")
    config["affiliate_runtime"]["subid"] = os.getenv("AFFILIATE_SUBID", "codex-bot")
    return config
