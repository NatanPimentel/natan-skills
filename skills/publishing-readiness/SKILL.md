---
name: imobiturbo-publishing-readiness
description: >
  Use after {{BRAND}} carousel approval to prepare captions, validate release
  packages, distinguish calendar proposals from real schedules, and hand off
  safely to the Natan publisher.
type: workflow
version: "1.0.0"
categories: [social-media, publishing, editorial, imobiturbo]
---

# {{BRAND}} Publishing Readiness

Use this skill after a visual carousel batch is approved, or when Natan asks
whether captions are ready or how the posting calendar stands. It closes the
operational gap between rendered assets and a safe, publish-ready handoff.

This skill **complements** `blotato-natan-publisher`; it does not replace the
canonical Natan publisher wrapper or its account/platform rules.

## Non-negotiables

- Never create X/Twitter copy, schedules, or posts.
- Use the Natan publisher wrapper for actual scheduling/publication. Never call
  raw Blotato publishing endpoints.
- Threads is no-CTA: no CTA, links, hashtags, own @mention, markdown, or
  em-dash; each post is at most 500 characters.
- LinkedIn is dual destination: Natan's personal profile and {{BRAND}} Page.
- A proposed calendar is not a scheduled calendar. Do not report a proposal as
  an external effect.
- Never publish or schedule merely because captions are ready. Require an
  explicit user instruction for the side effect.

## Inputs to inspect

1. The final review package and each post's final 10 slides.
2. The batch state file, which can be stale after CTA changes.
3. `cta-selection.json` for every post when slide 10 uses the CTA bank.
4. Existing real schedules from the publishing service.

If a CTA was retired, synchronize state with its replacement before preparing
release files. The CTA count is the active manifest count, not a hardcoded
number; never revive a retired asset from staging, backup, or an old selection.

## Build a release package per carousel

For each `post-NN/v1/`, produce:

- `agenda.json` containing 10 **absolute** final slide paths;
- non-empty captions for `instagram`, `facebook`, `linkedin`, and `tiktok`;
- `thread-content-threads.md` in valid Mode A or Mode B format;
- concise source/scope qualification for factual or geographically limited
  claims.

Use the platform-specific captions rather than a generic one when the topic,
voice, or CTA needs adaptation. The LinkedIn copy should be professional,
scannable, and focused on one idea. Threads is a separate no-CTA text, not a
caption with a CTA removed mechanically.

## Validate before any schedule action

1. Confirm all 10 slides physically exist for each agenda.
2. Verify the four required captions are non-empty and contain no em-dash.
3. Parse and validate Threads restrictions and character limits.
4. Dry-run the canonical publisher once per carousel with an ISO future time.
   A valid carousel release completes with 6 destination payloads: Instagram,
   Facebook, LinkedIn personal, LinkedIn {{BRAND}}, TikTok, and Threads.
5. Query the real schedule list immediately before reporting calendar status.
6. Update the batch state to `awaiting_schedule_confirmation` after a passing
   preflight, retaining the current CTA IDs and final-review path.

See `references/release-package-and-calendar.md` for a schema, validation
matrix, and status vocabulary.

## Calendar report format

Report separately:

- **Scheduled now:** externally confirmed schedules and their actual times.
- **Proposed:** optional recommended slots, clearly marked unscheduled.
- **Ready:** whether the 3 release packages and dry-runs passed.
- **Next explicit action:** confirmation of dates/hours before scheduling.

Natan expects the final handoff to include more than the slides: publish-ready
captions plus an explicit current or proposed posting calendar.

## Delivery

Do not resend all artwork when the request is only about captions/calendar.
State readiness, real schedule count, suggested cadence if relevant, and the
absence of publication until the user explicitly requests it.
