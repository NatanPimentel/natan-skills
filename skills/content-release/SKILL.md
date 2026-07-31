---
name: imobiturbo-content-release
description: >
  Use when finalizing an approved {{BRAND}} carousel batch: verify final
  exports, prepare multi-platform captions, schedule safely, and record proof.
type: orchestrator
version: "1.0.0"
categories: [social-media, imobiturbo, publishing, qa]
---

# {{BRAND}} Content Release

Use this skill when an approved {{BRAND}} batch moves from rendered assets to
an actual release: final re-export, captions, scheduling and publish-state
verification. It covers the release layer, not ideation, research or image
generation.

## Non-negotiables

- **X/Twitter is disabled.** Never prepare, schedule or publish it.
- **Threads is no-CTA:** no `Comente SISTEMA`, links, hashtags, own @mention,
  raw markdown or funnel phrasing. Use one post up to 500 characters or a
  native two-post Mode B thread.
- **Slide 10 is immutable CTA art.** It must remain the complete JPG selected
  from `local/cta-bank/comente-sistema/`, with no crop, footer, template or
  text added during release.
- Use `blotato-natan-publisher` for every real schedule or publication. Do
  not call raw Blotato publishing endpoints directly.
- A calendar proposal is not a schedule. Do not create remote posts until the
  user explicitly supplies or approves the dates/times.

## 1. Preflight the final batch

1. Read the batch state, `final-review.json`, the three `agenda.json` files
   and each `cta-selection.json`.
2. Confirm all 30 final rasters are JPEG RGB at exactly `1080×1350`.
3. Confirm the 3 CTA IDs are distinct for a new batch and every Slide 10 hash
   matches the selected CTA file.
4. Confirm `agenda.json` has exactly 10 existing slide paths and non-empty
   `instagram`, `facebook`, `linkedin` and `tiktok` captions. Confirm the
   corresponding `thread-content-threads.md` exists.
5. Run the publisher with `--dry-run` for each agenda before a real release.
   This checks the Threads parser and all 6 target payloads without creating
   posts.

## 2. Full re-export after a prior visual review

Use this only when the user explicitly asks for the complete 30-slide refresh.

1. Re-render all three 10-slide carousels using `carousel-renderer`.
2. If a prior audited `review-final/final-review.json` exists, calculate a
   SHA-256 for every new JPG and compare it to the previous review manifest.
3. If a slide is byte-identical, retain the previous full-resolution visual
   review for that raster. If a slide differs, inspect that final physical JPG
   at full resolution before delivery.
4. A `30/30` byte-identical result plus contact-sheet/package inspection is
   sufficient to preserve an earlier slide-level QA. A contact sheet by itself
   never proves typography or body-copy legibility.
5. Rebuild the review report, three contact sheets and 30-slide ZIP after
   the hash comparison. For an explicit full delivery, send all 10 JPGs per
   carousel inline; ZIP is supplementary.

## 3. Build publish-ready captions

Create one `agenda.json` beside each post's `copy.json` with:

```json
{
  "run_id": "<run-id>",
  "post": "post-01",
  "title": "<title>",
  "slides": ["/absolute/path/slide-01.jpg", "...", "/absolute/path/slide-10.jpg"],
  "captions": {
    "instagram": "...",
    "facebook": "...",
    "linkedin": "...",
    "tiktok": "..."
  }
}
```

- Use absolute slide paths: the publisher resolves relative paths from the
  working directory, not from `agenda.json`.
- Preserve source scope in captions, including local-data qualifiers.
- LinkedIn is one post sent to both the personal profile and {{BRAND}} Page.
- Keep an em-dash out of all published copy.
- Normalize `thread-content-threads.md` to:

```text
mode: B
---
<first no-CTA post>
---
<second no-CTA post>
```

## 4. Schedule multiple posts safely

When the user gives slots such as `31/07 10h 17h 20h`:

1. Query the current `America/Sao_Paulo` time and convert every requested
   future BRT slot to UTC ISO 8601. Do not infer the current date or timezone.
2. Call `blotato_list_schedules` before scheduling. Check for conflicts and
   record the starting schedule count.
3. Assign an explicit post-to-slot order in the response. If no order is
   specified, preserve the current editorial calendar order rather than
   reshuffling finished posts.
4. Submit one carousel slot at a time using:

   ```bash
   node --env-file=.env skills/blotato-natan-publisher/scripts/publish.mjs \
     <post>/v1/agenda.json <utc-iso-time>
   ```

   A successful run must report `6 ok, 0 fail` (Instagram, Facebook,
   LinkedIn personal, LinkedIn {{BRAND}}, TikTok and Threads).
5. If a real submission is ambiguous or fails after any target may have been
   accepted, **do not blindly retry**. Inspect remote schedules and known
   submission statuses first to prevent duplicates.
6. After all slots, call `blotato_list_schedules` again. Verify exactly
   `6 × number_of_carousels` relevant remote schedules, correct UTC times and
   platform coverage.
7. Save a local manifest under
   `<run>/review-final/scheduling/scheduled-manifest.json` containing the
   BRT and UTC time plus both the remote `schedule_id` and returned
   `submission_id` for every target. Start from
   `templates/scheduled-manifest.json` and follow
   `references/scheduling-verification.md`.
8. Update `_batch-state.json` to `status: scheduled` and
   `publish: scheduled_not_yet_published`. Never describe scheduled content as
   published before its scheduled time and post-status confirmation.

## 5. Report only verified facts

Report the BRT slots, post titles, targets, remote schedule count and whether
content is **scheduled** or **published**. State isolated failures by
platform. Do not claim that all platforms are live based only on a local
command success; remote schedule verification is required.

## References

- `references/scheduling-verification.md` — validation logic and local
  manifest contract for multi-slot schedules.
- `templates/scheduled-manifest.json` — copyable local record for schedule
  and submission IDs.
