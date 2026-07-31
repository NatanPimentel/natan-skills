# Telegram + AssemblyAI operational notes

## Verified setup pattern

- Configure the official AssemblyAI Python SDK in the active Hermes profile's project environment.
- Keep `ASSEMBLYAI_API_KEY` in the profile `.env` with restrictive permissions; never expose it in tool output or user-facing text.
- Configure AssemblyAI documentation MCP as an HTTP server only for documentation lookup. Validate with `hermes mcp list` and `hermes mcp test assemblyai_docs`.
- Hermes' MCP HTTP compatibility may require the 1.x SDK line. If the runtime searches for `mcp.client.streamable_http.streamablehttp_client`, install a compatible release with `pip install 'mcp<2'` and retest.

## Telegram boundary

Telegram's cloud Bot API documents a 20 MB maximum for bot downloads. A 68.6 MB video therefore never reaches Hermes when sent as a normal attachment. The correct response is to request audio-only compression, split files with headroom below 20 MB, or accept a public/direct URL. Do not say that a Telegram account setting or Premium subscription raises the bot download limit.

## Self-hosted Local Bot API path

This is the path to consider when the user explicitly wants to receive media above 20 MB through Telegram:

1. Check Docker/Podman and available disk before changing the running gateway.
2. Obtain Telegram `api_id` and `api_hash` from `my.telegram.org`; the bot token is not enough for a Local Bot API Server.
3. Run a maintained Bot API Server image (e.g. `aiogram/telegram-bot-api:latest`) with `TELEGRAM_LOCAL=1` for the 2 GB limit, a persistent data volume mounted to the host, and localhost-only binding (`-p 127.0.0.1:8081:8081`).
4. **Mount the container's `/var/lib/telegram-bot-api` to a host path** (e.g. `local/telegram-bot-api/data`). Without this, Hermes cannot read downloaded files even with `local_mode` enabled.
5. Verify the local endpoint (`getMe`/health) using the bot token without printing it.
6. Configure Hermes `platforms.telegram.extra` with `base_url`, `base_file_url`, and `local_mode: true`. The `base_url` presence auto-lifts the internal 20 MB → 2 GB cap; `local_mode` tells PTB to read files from disk instead of HTTP.
7. **Run `logOut` on the public API** (`curl https://api.telegram.org/bot<TOKEN>/logOut`) as a one-time migration before switching. A bot can only be active on one Bot API server at a time.
8. Restart Hermes only after the local service is healthy, then test a real file larger than 20 MB and clean up temporary media.
9. **File permissions**: container files are owned by `messagebus:messagebus`. Run `chmod -R a+rX` on the mounted data dir so Hermes (running as root) can read them.
10. **Path glob issue**: the bot data directory includes the bot token with `:` characters. Use `find <dir> -name "file_0.mp4" -print -quit` instead of shell glob expansion.

Never expose the bot token, `api_id`, `api_hash`, or AssemblyAI key in logs, transcripts, or replies. A successful Docker install alone is not proof that Hermes is using the local server.

## AssemblyAI REST API (direct curl)

When the SDK is not convenient, the REST API works directly:

1. **Upload audio**: `curl -s https://api.assemblyai.com/v2/upload -H "authorization: $KEY" -H "Content-Type: application/octet-stream" --data-binary @file.mp3` → returns `{"upload_url": "..."}`.
2. **Submit transcript**: POST to `/v2/transcript` with `{"audio_url":"<upload_url>","language_code":"pt","speaker_labels":true,"punctuate":true,"format_text":true}`. **Do NOT include `auto_chapters` when `language_code` is `pt`** — it returns an error.
3. **Poll**: GET `/v2/transcript/<id>` every 10 seconds until `status` is `completed` or `error`.
4. **Audio extraction command**: `ffmpeg -i input.mp4 -vn -ac 1 -ar 16000 -b:a 64k -y output.mp3` — a 10-minute VSL yields ~5 MB MP3.

- verbatim transcript;
- structural analysis (hook, promise, mechanism, proof, objections, offer, CTA);
- original derivative strategy for {{BRAND}}.

Do not automatically copy a competitor's wording or publish anything without approval.
