#!/usr/bin/env python3
"""Bash-callable wrapper around the Hound MCP server (stdio).

Usage:
  hound_client.py <tool> '<json-args>'

Tools: mcp_smart_search | mcp_smart_fetch | mcp_smart_crawl | mcp_screenshot | version | cache_clear

Examples:
  hound_client.py mcp_smart_search '{"query": "taxa Selic mercado imobiliario 2026", "num_results": 5}'
  hound_client.py mcp_smart_fetch '{"url": "https://exame.com/"}'
"""
import asyncio
import json
import os
import sys

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# hound is a console_script installed in the same venv as this interpreter,
# so it lives next to sys.executable (venv/bin/hound) — not on the system PATH.
HOUND_BIN = os.path.join(os.path.dirname(sys.executable), "hound")


async def call_tool(tool: str, args: dict, timeout: float = 90.0) -> str:
    params = StdioServerParameters(command=HOUND_BIN, args=[], env=None)
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result = await asyncio.wait_for(session.call_tool(tool, args), timeout=timeout)
            return "".join(c.text for c in result.content if hasattr(c, "text"))


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__, file=sys.stderr)
        return 2
    tool = sys.argv[1]
    raw_args = sys.argv[2] if len(sys.argv) > 2 else "{}"
    try:
        args = json.loads(raw_args)
    except json.JSONDecodeError as e:
        print(f"invalid JSON args: {e}", file=sys.stderr)
        return 2

    try:
        text = asyncio.run(call_tool(tool, args))
    except Exception as e:
        print(json.dumps({"error": f"{type(e).__name__}: {e}"}))
        return 1

    print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
