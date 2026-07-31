#!/usr/bin/env python3
"""Validate persisted research-radar artifacts without external dependencies.

Checks JSON syntax plus the invariants that matter after a radar run:
- the ledger is a list with unique IDs;
- every reported source ID exists in the ledger;
- canonical and secondary URLs are not duplicated in the ledger;
- every token in ``dedup_added`` is represented by an ID or URL in the ledger;
- optional strict mode requires every source to carry ``freshness_verified: true``.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"ERROR missing file: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"ERROR invalid JSON in {path}: {exc}") from exc


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ledger", type=Path, required=True)
    parser.add_argument("--sources", type=Path, required=True)
    parser.add_argument(
        "--strict-freshness",
        action="store_true",
        help="require freshness_verified=true on every reported source",
    )
    args = parser.parse_args()

    ledger = load_json(args.ledger)
    source_doc = load_json(args.sources)

    if not isinstance(ledger, list):
        raise SystemExit("ERROR ledger must be a JSON list")
    if not isinstance(source_doc, dict) or not isinstance(source_doc.get("sources"), list):
        raise SystemExit("ERROR sources document must contain a JSON list at 'sources'")

    ledger_ids = [item.get("id") for item in ledger if isinstance(item, dict)]
    if len(ledger_ids) != len(ledger) or any(not item_id for item_id in ledger_ids):
        raise SystemExit("ERROR every ledger entry must be an object with a non-empty id")
    if len(set(ledger_ids)) != len(ledger_ids):
        raise SystemExit("ERROR duplicate ledger IDs")

    ledger_urls: set[str] = set()
    for item in ledger:
        for field in ("url", "secondary_url"):
            value = item.get(field)
            if value:
                if value in ledger_urls:
                    raise SystemExit(f"ERROR duplicate ledger URL: {value}")
                ledger_urls.add(value)

    sources = source_doc["sources"]
    source_ids: list[str] = []
    for item in sources:
        if not isinstance(item, dict) or not item.get("id") or not item.get("url"):
            raise SystemExit("ERROR every source must have non-empty id and url")
        source_ids.append(item["id"])
        if item["id"] not in ledger_ids:
            raise SystemExit(f"ERROR source ID missing from ledger: {item['id']}")
        if args.strict_freshness and item.get("freshness_verified") is not True:
            raise SystemExit(f"ERROR source is not freshness-verified: {item['id']}")

    known_tokens = set(ledger_ids) | ledger_urls
    for token in source_doc.get("dedup_added", []):
        if token not in known_tokens:
            raise SystemExit(f"ERROR dedup_added token missing from ledger: {token}")

    print(
        "VALIDATION_OK "
        f"sources={len(sources)} "
        f"ledger_entries={len(ledger)} "
        f"unique_ids={len(set(ledger_ids))} "
        f"dedup_tokens={len(source_doc.get('dedup_added', []))}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
