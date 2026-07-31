# Release package and calendar reference

## Agenda schema

Create `post-NN/v1/agenda.json` using absolute final slide paths because the
publisher resolves each path from its process working directory.

```json
{
  "run_id": "<run-id>",
  "post": "post-01",
  "title": "<editorial title>",
  "slides": [
    "/absolute/path/post-01/v1/slide-01.jpg",
    "/absolute/path/post-01/v1/slide-02.jpg"
  ],
  "captions": {
    "instagram": "<publish-ready caption>",
    "facebook": "<publish-ready caption>",
    "linkedin": "<professional scannable version>",
    "tiktok": "<short carousel caption>"
  },
  "source_note": "<source and scope qualification>"
}
```

The live schema needs all 10 slides, not the abbreviated two-item example.

## Threads file

Use this exact structural pattern:

```text
mode: B
---
<main post>
---
<second post>
```

Do not add Markdown headings such as `# Threads` or `## Post 1`; the parser
passes post body to a no-markdown validator. Validate each block independently:

- ≤500 chars
- no `Comente SISTEMA`
- no URLs
- no hashtags
- no own account mention
- no Markdown formatting
- no em-dash

## Dry-run command

```bash
node --env-file=.env skills/blotato-natan-publisher/scripts/publish.mjs \
  <post-dir>/agenda.json <future-ISO-8601> --dry-run
```

Treat `DONE — 6 ok, 0 fail` as publish-payload validation only. It must not be
reported as a scheduled or published post.

## Release validation matrix

| Check | Expected result |
|---|---|
| Final slides | 10 existing JPGs for each post |
| Agenda captions | IG, FB, LI and TikTok values are non-empty |
| CTA state | Current selection IDs match the final review and slide 10 files |
| Threads | Valid Mode A/B with no-CTA restrictions passed |
| Dry-run | 6 destination payloads, 0 failures per post |
| Real schedule query | Used as sole evidence of externally scheduled posts |
| Batch state | Current CTA IDs, release paths and explicit schedule status |

## Calendar status wording

Use one exact category per statement:

- **No schedule:** the remote schedule query returned zero items.
- **Proposed schedule:** dates/times saved locally for discussion only.
- **Awaiting schedule confirmation:** release package passed, but user has not
  authorized dates/times.
- **Scheduled:** remote response confirms time and ID.
- **Published:** remote response confirms final public URL.

A recommended cadence can be included under *Proposed schedule*, but never
implies an upload, schedule, or publication.

## CTA retirement reconciliation

When a slide-10 CTA is rejected:

1. Remove the asset from active manifest, selector state, staging, backup and
   reusable sources.
2. Select a replacement from remaining active, non-repeated IDs.
3. Render slide 10 as a byte-for-byte copy of the selected CTA.
4. Rebuild final review and ZIP.
5. Update the release package and batch state with replacement CTA IDs before
   any dry-run or schedule report.
