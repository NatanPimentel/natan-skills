# Apify freshness and abort runbook

## Known schema

For `apify/google-trends-scraper`, the accepted `timeRange` values are `now 1-H`, `now 4-H`, `now 1-d`, `now 7-d`, `today 1-m`, `today 3-m`, `today 5-y`, and `all`. A 24-hour radar should use `now 1-d`.

## Verification sequence

1. Start the Actor with a conservative term list (maximum five comparison terms).
2. Capture the returned `runId` and `defaultDatasetId`.
3. Poll `GET /v2/actor-runs/{runId}` until a terminal status or until the run is clearly stalled.
4. Read `GET /v2/datasets/{datasetId}/items` and verify non-empty records before using any metric.
5. If the status message remains in crawling with zero pages/items, stop the run with `POST /v2/actor-runs/{runId}/abort`.
6. Re-read the run to record terminal status and `usageTotalUsd`; leave the dataset as evidence, even when empty.

## Reporting rule

A failed or aborted trend Actor is a collection limitation, not a trend result. State the exact terms, geo, window, run ID, dataset ID, terminal status, and cost. Continue with qualitative web research only, clearly separating it from quantitative trend evidence.

## Evidence quality

A blocked Product Hunt or social page can still be a lead, but its confidence is medium until corroborated by a secondary source. A search snippet alone does not establish an official launch or a claim's numeric accuracy. Label older tools as “applicable tool” instead of “new finding.”
