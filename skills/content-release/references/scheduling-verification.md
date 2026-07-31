# Multi-slot schedule verification

Use this reference after scheduling one or more {{BRAND}} carousels through
`blotato-natan-publisher`.

## Expected remote shape

The publisher creates 6 remote schedule items per carousel:

1. Instagram
2. Facebook Page
3. LinkedIn personal profile
4. LinkedIn {{BRAND}} Page
5. TikTok carousel
6. Threads no-CTA post or native two-post thread

For `N` carousels, expect `6N` schedule items from `blotato_list_schedules`.
Do not count X/Twitter or a HeyGen reel.

## Proof chain

1. Local publisher output says `DONE — 6 ok, 0 fail` for every slot.
2. The remote schedule list contains all expected targets at the intended UTC
   timestamps.
3. The local schedule manifest records the remote schedule IDs and returned
   post-submission IDs separately. These are not interchangeable.
4. The batch state says `scheduled_not_yet_published` until status checks after
   the slot time show publication.

## Ambiguous-run recovery

If a real command exits nonzero or network output is incomplete after uploads
or some target submissions:

- Do not rerun the complete command automatically.
- Fetch remote schedules first and compare their texts, targets and times to
  the intended slot.
- Retrieve the status of known submission IDs where available.
- Retry only the missing target or create a revised schedule after confirming
  no duplicate exists.

## Time conversion

Always query the live `America/Sao_Paulo` clock first. A requested same-day
BRT time must be verified as future before converting it to ISO UTC. Store
both timestamps in the schedule manifest so later cancellation or rescheduling
is unambiguous.
