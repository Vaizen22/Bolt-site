import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


@pytest.fixture
def sample_config():
    return {
        "affiliate": {
            "legal_disclosure": "Cet article contient des liens d'affiliation.",
            "templates": {
                "amazon": "https://www.amazon.fr/s?k={query}&tag={tag}&linkCode=ll2",
                "awin": "https://www.awin1.com/cread.php?awinmid={awin_id}&awinaffid={subid}&ued={encoded_url}",
                "tradedoubler": "https://clk.tradedoubler.com/click?p={td_id}&a={subid}&url={encoded_url}",
            },
        },
        "affiliate_runtime": {
            "amazon_tag": "demo-21",
            "awin_id": "123",
            "tradedoubler_id": "456",
            "subid": "test-subid",
        },
    }
