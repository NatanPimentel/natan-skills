---
name: research-freshness-validation
description: Use when a research radar has a strict recency window. Verify publication dates before reporting.
version: "1.0.0"
categories: [research, scraping, content-discovery]
---

# Research Freshness Validation

Use this class-level workflow whenever a research task asks for "últimas 24h", "esta semana", or another bounded freshness window.

## Workflow

1. **Discover broadly.** Search multiple sources to find candidates, but treat result snippets and relative labels such as “today”, “2 days ago”, or “1 month ago” as discovery hints only.
2. **Fetch candidates.** Retrieve the page with the approved fetcher and inspect structured metadata: `published_time`, `modified_time`, canonical URL, and fetch timestamp.
3. **Apply the cutoff.** Compare the verified publication/modification timestamp to the requested window. If neither timestamp is available or the date is only inferred from a snippet, mark the item unverified and exclude it from a strict-window report.
4. **Prefer primary evidence.** Official platform changelogs, newsroom posts, help-center announcements, and product release notes outrank secondary roundups. Use secondary sources for discovery/context, not unsupported claims.
5. **Deduplicate before reporting.** Normalize canonical URLs and platform IDs. Also collapse reposts and roundup duplicates around the same announcement.
6. **Check audience relevance.** For {{BRAND}}, retain only changes that can affect real-estate marketing, paid traffic, creative production, lead generation, measurement, or creator workflows. Add a concise “POR QUE IMPORTA” line.
7. **Silence is valid.** If no candidate is both new and relevant, return the job’s exact silence marker rather than padding the report with stale items.

## Reporting discipline

- State when a source is secondary or its date is unverified.
- Never present an old article surfaced by a fresh search as a new development.
- Do not copy social-platform language; synthesize the operational implication.
- Preserve the job’s required output format and platform restrictions.

## Reference

See `references/strict-window-checklist.md` for the compact checklist used during radar runs.
