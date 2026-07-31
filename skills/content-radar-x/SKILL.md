---
name: content-radar-x
description: Use when rebuilding or running {{BRAND}} X/Twitter research radars via x_search or cron.
version: 1.0.0
author: user
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [X, Twitter, x_search, radar, cron, {{BRAND}}, research]
    category: research
    related_skills: [research-sources]
---

# Content Radar X ({{BRAND}})

## Overview

Daily X/Twitter research pipeline for {{BRAND}} content ops. Uses Hermes `x_search` (prefer **xAI Grok OAuth** / `xai-oauth`) as a **research source only**. Never write copy for X and never publish to X (disabled 2026-04-24).

## When to Use

- Rebuild/recreate the X radar cron from chat history or after profile wipe
- Run or debug the 6-radar X panel
- Adjust queries, gates, deliver targets, or exclusion ledgers
- User mentions Hot Ideas X radar, Painel Editorial X, mentor-benchmark, us-agent-playbooks

Don't use for: publishing to X, Reddit digests alone (see `research-sources`), final carousel production (Opensquad/social skills).

## Prerequisites

1. `hermes auth list` shows `xai-oauth` (or working X search credentials).
2. If missing: enable `model-providers/xai` if needed, then `hermes auth add xai-oauth --no-browser` and complete device login (see `model-provider-hygiene`).
3. Durable paths under profile local (survive `hermes profile update`):
   - `/root/.hermes/profiles/natan/local/radares/`
   - Ledger: `local/radares/x-exclusion-ledger.json`
   - Spec notes: `local/radares/x-search-cron-reconstrucao.md`
4. Script of related general radars (not X-specific): `/root/.hermes/bin/criar-radares.sh`

## Canonical 6 radars

Coverage must close **6/6**:

1. `ai-real-estate`
2. `ads-imobiliario`
3. `us-housing-market`
4. `us-agent-playbooks`
5. `creator-tools`
6. `mentor-benchmark`

Full query templates and output schema: `references/canonical-queries-and-panel.md`.

## Operating sequence

1. Confirm `x_search` auth (`xai-oauth`).
2. Load exclusion ledger; skip already-reported status IDs/URLs.
3. For each radar: run `x_search` with `since:YYYY-MM-DD` (yesterday UTC by default).
4. Apply **3-question gate** per tweet (real-estate relevance, substance/mechanism/data, BR adaptability).
5. Emit `X Radar Parcial — <slug>` when there is material; declare empty radars explicitly.
6. Close with `📡 Painel Editorial Diário — Radares X` (fortes / apuração / watchlist / decisão).
7. Append new IDs to ledger; optional `mnemosyne_remember` with search terms/handles.
8. If all six empty after one window expand → respond only `[SILENT]`.

## Cron reconstruction checklist

- [ ] Job exists (`cronjob list` / `hermes cron list`)
- [ ] Schedule near historical ~07:10 BRT (`10 10 * * *` UTC is the reconstructed default)
- [ ] Prompt encodes 6 slugs + two known-good queries + gate + panel format
- [ ] Deliver target is Lobo HQ; prefer Hot Ideas thread id when known (`telegram:-1003897173723:<thread>`)
- [ ] Skill attachment includes research tooling if needed
- [ ] Spec saved under `local/radares/` (survives profile update)

## Common pitfalls

1. **Confusing `xai` API key with `xai-oauth`.** Device login is `hermes auth add xai-oauth`.
2. **Publishing or drafting X copy.** Research only.
3. **Inventing tweets when `x_search` fails.** Retry once; report error; do not fabricate.
4. **Missing thread id.** Group deliver without topic dumps to general chat; ask for Hot Ideas `message_thread_id` if needed.
5. **Empty jobs after profile/cron wipe.** Reconstruct from this skill + `references/` + local reconstrution md — do not claim “never existed” just because `jobs.json` is empty.
6. **Only two queries fully known from history.** mentor-benchmark + us-agent-playbooks are exact; the other four are intent-reconstructed — improve queries when new exact dumps appear.
7. **Gateway cannot restart itself from inside a gateway session.** Tell user or use external shell for `hermes gateway restart`.

## Cron-run execution notes

- Obtain the UTC date with `date -u`; use the previous UTC calendar date in `since:`. The report date should be rendered in Brazilian format (DD/MM/YYYY).
- Run all six `x_search` calls in parallel when independent. Record the exact query, effective/requested query type, returned-count estimate, window, and quality for each radar.
- Treat a radar with returned but ineligible posts as `0 sinais elegíveis; radar rodou`; only expand to a 3-day window when the initial search returns zero real posts. For a genuinely empty radar, retry once with `since:` three days earlier and explicitly disclose the expanded window.
- Grok may label a result as Latest even when the operational request says Top. Preserve this discrepancy in the metadata instead of claiming Top ranking was actually applied.
- x_search can inconsistently describe a valid `since:YYYY-MM-DD` query as a future date while another radar returns posts for the same date. Treat the actual result set as authoritative, record the tool warning, and perform the prescribed 3-day retry for a zero-result radar rather than concluding that the source is unavailable.
- Count `tweets retornados` from the tool output, but count only items passing all three gates as signals; returned-but-ineligible results should be reported as `0 sinais elegíveis; radar rodou`.
- The exclusion ledger may not exist on first run. Create the parent directory and a JSON array at `local/radares/x-exclusion-ledger.json`; append only newly reported/watchlisted IDs or URLs, and validate with `python3 -m json.tool`.
- In cron mode, prefer **write_file** for the ledger. `execute_code` may be blocked by cron approval policy; this is an execution detail, not a research failure.
- **Safe ledger update:** preserve the existing ledger before appending. When using `hermes_tools.read_file()` from `execute_code`, its returned `content` may include display line prefixes such as `1|`; strip only the leading `line-number|` prefix from each line before `json.loads`, or read the file directly with Python `open()`. If parsing fails, stop before writing—never fall back to a newly constructed list. After writing, assert that prior entries remain, validate with `python3 -m json.tool`, and assert uniqueness of both `status_id` and URL. See `references/ledger-safe-update.md`.
- Never promote a numerical housing claim without a named primary source. Put it in the apuração section and preserve the source URL for follow-up.
- A tool result containing a real post is not automatically a usable signal: apply all three gates and discard motivational, open-house-only, reply, generic, and unsupported autopromo content.

## Verification

- [ ] `hermes auth list` includes `xai-oauth`
- [ ] Cron job id present and next_run set
- [ ] Manual dry-run of one radar via `x_search` returns real posts or a clean empty
- [ ] Panel output names all 6 slugs in coverage line
- [ ] Ledger parses as valid JSON after append
- [ ] Ledger status IDs are unique and appended URLs are X status URLs

## Cron completion and reporting discipline

Write the exclusion ledger before composing the final report, then validate it with `python3 -m json.tool` plus a uniqueness assertion. Append only items actually cited in the report (promoted signals, apuração, or watchlist), never the entire raw result set. Keep the report grounded in tool output: distinguish `tweets retornados` from `sinais elegíveis`, and preserve discrepancies between requested ranking mode and the mode actually returned. A missing project `package.json` is not a research failure and does not justify invented npm checks; verify the JSON artifact directly and mention unrelated environment-check blockers only when relevant.
