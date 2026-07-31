# Safe X-exclusion-ledger update

Use this recipe for cron runs that append cited X status IDs to `local/radares/x-exclusion-ledger.json`.

## Why this matters

The Hermes `read_file` helper can return display-formatted text with a prefix such as `1|` on each line. Passing that string directly to `json.loads()` fails. The dangerous fallback is to treat the parse failure as an empty ledger and overwrite the history with only the current run.

## Procedure

1. Read the existing JSON before composing the new entries.
2. If using `hermes_tools.read_file()` inside `execute_code`, remove only the leading line-number/display prefix from each returned line before parsing. Prefer a direct filesystem read with Python `open(path).read()` when a raw JSON string is needed.
3. Abort before writing if parsing fails or if the existing structure is not a JSON array.
4. Append only items actually cited as `reported`, `apuração`, or `watchlist` in the final report. Do not append discarded search results.
5. Assert that the old entries are still present and that `status_id` and URL values are unique.
6. Write the complete preserved-plus-new array with `write_file`.
7. Verify the persisted file with `python3 -m json.tool` and a uniqueness assertion.

## Minimum validation

```python
import json

items = json.load(open(path))
assert isinstance(items, list)
assert len(items) == len({str(x["status_id"]) for x in items})
assert len(items) == len({x["url"] for x in items})
assert all(x.get("status_id") and x.get("url") and x.get("radar") for x in items)
```

Never reconstruct the ledger from memory or from the current search results after a read/parse error; recover the existing file first.
