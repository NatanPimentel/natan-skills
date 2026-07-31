---
name: audio-video-transcription
description: Use when the user wants to transcribe audio or video, including large Telegram uploads, with speaker labels, summaries, or VSL analysis.
version: 1.1.0
author: Hermes Agent + {{NAME}}
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [transcription, audio, video, speech-to-text, assemblyai, telegram, vsl]
    category: media
---

# Audio/video transcription

## When to use

Use this skill when the user asks to transcribe a video, audio, VSL, interview, meeting, podcast, voice note, or competitor material. It also applies when a media attachment exceeds the messaging platform's upload/download limit.

## Standard workflow

1. Confirm that a media file or accessible URL actually arrived. If the platform skipped the attachment, do not claim it was received.
2. Inspect the media and extract audio when the task is transcription-only. Prefer a compressed, speech-preserving format (MP3/M4A/WAV) over sending a large video to the transcription API.
3. Use the configured speech-to-text provider when available. For AssemblyAI, load the credential from the profile's private `.env` and pass it through the SDK; never print, quote, or save the key in a transcript or report.
4. For long media, preserve timestamps and process in chunks only when necessary. Reassemble chunks in chronological order and mark any uncertain segment.
5. Return the requested artifact: full transcript, timestamped transcript, speaker-separated transcript, summary, or editorial analysis. Do not silently turn a transcription request into copywriting.
6. Verify the result by checking that the transcript is non-empty, has plausible duration/ordering, and reports any provider or media errors honestly.

## Telegram size boundary

The standard cloud Telegram Bot API limits bots to downloading files up to 20 MB. This is not increased by Telegram Premium on the user's account. For larger media, recommend (in order): audio-only export, compression, splitting into files below the limit, or a public/direct download URL. A self-hosted Telegram Local Bot API Server can support larger downloads, but it is an infrastructure change and must be treated separately from simple Telegram settings. Before attempting it, check whether Docker is available, obtain Telegram `api_id` and `api_hash` from `my.telegram.org` (the bot token alone is insufficient), persist the Bot API data directory, bind the service to localhost, and verify health/getMe before changing the live Hermes gateway. Do not switch the active bot endpoint until the local service is healthy; keep a rollback path to the cloud endpoint.

## AssemblyAI integration

The official Python SDK is the normal path for actual transcription. The AssemblyAI documentation MCP is useful for API/model guidance, but it is not itself a transcription engine. Keep the API key in a secret environment file and configure the SDK explicitly from the environment in scripts. Test the import and then exercise a real, authorized request only when the user has supplied permission and a reachable media source.

## Large-video handling

For a video larger than the messaging limit:

- Ask for an audio-only export or a smaller/split upload.
- If a direct URL is provided, download it to a private temporary path, inspect size/type, extract audio, and clean up temporary files after completion.
- Do not infer the video's spoken content from metadata or a failed attachment.
- If only the visual content matters, route to video/vision analysis instead of claiming transcription covers it.

### Local Bot API Server — critical setup details

When the user explicitly asks to install a Local Bot API Server to receive files >20 MB:

1. **Both `local_mode: true` AND a host-mounted data volume are required.** Without `local_mode`, PTB (python-telegram-bot) tries HTTP download from the local server, which returns `InvalidToken`/`Not Found` because the local server stores files on disk, not via HTTP. Without the volume mount, the Hermes process cannot read the container's files.
2. **Container data directory ownership**: files are created by `messagebus:messagebus` (container user). Run `chmod -R a+rX` on the mounted data dir so the Hermes process (running as root) can read them.
3. **Path contains glob characters**: the bot's data directory includes the bot token (with `:` and alphanumerics). Shell globs like `8758595395:***` fail. Use `find <dir> -name "file_0.mp4" -print -quit` to locate files, not shell expansion.
4. **Copy the file to a clean path** before processing (e.g. `cache/media/`) to avoid permission/glob issues downstream.
5. **Gateway restart from inside the gateway is blocked.** Use `systemd-run --on-active=5s --collect systemctl restart hermes-gateway-<profile>.service` to schedule an external restart.
6. **`logOut` from the public API is a one-time migration step** — run `curl https://api.telegram.org/bot<TOKEN>/logOut` before pointing Hermes at the local server. Do not repeat it.

### AssemblyAI API quirks

- **`auto_chapters` is not available for Portuguese (`pt`)**. The API returns `{"error": "The following models are not available in this language: auto_chapters"}`. Omit `auto_chapters` when `language_code` is `pt`.
- **Direct REST API via curl works reliably**: upload with `--data-binary @file.mp3` to `/v2/upload`, then POST to `/v2/transcript` with `{"audio_url":"<upload_url>","language_code":"pt","speaker_labels":true,"punctuate":true,"format_text":true}`, then poll `/v2/transcript/<id>` every 10s until `status` is `completed` or `error`.
- **Audio extraction**: `ffmpeg -i input.mp4 -vn -ac 1 -ar 16000 -b:a 64k -y output.mp3` produces a compact MP3 suitable for upload. A 10-minute VSL yields ~5 MB.

## Security and rights

Treat API keys and competitor media as private. Do not reproduce credentials in responses or durable memory. Transcribing a competitor VSL is research/analysis; do not automatically copy or publish it. Preserve attribution and distinguish verbatim transcript from derivative strategic analysis.

## Compatibility pitfall

Hermes' native HTTP MCP client may expect the legacy `streamablehttp_client` import. If a newly installed MCP package exposes only the renamed `streamable_http_client`, use a compatible MCP 1.x release (for example, `mcp<2`) rather than editing Hermes core for a local setup mismatch. Verify with `hermes mcp test <server>` after configuring the server.

## References

- Telegram/AssemblyAI integration notes: `references/telegram-assemblyai.md`
