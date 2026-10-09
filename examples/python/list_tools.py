"""Initialize SoldFetch MCP and print its tool names.

Install: python3 -m pip install mcp
Run:     export SOLDFETCH_API_KEY=YOUR_SOLDFETCH_API_KEY
         python3 examples/python/list_tools.py
"""

import asyncio
import os

from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client


async def main():
    key = os.environ.get("SOLDFETCH_API_KEY", "").strip()
    if not key:
        raise RuntimeError("Set SOLDFETCH_API_KEY to a SoldFetch API key")
    url = "https://soldfetch.com/api/mcp"

    async with streamablehttp_client(
        url,
        headers={"API-KEY": key},
    ) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            for tool in tools.tools:
                print(tool.name)


if __name__ == "__main__":
    asyncio.run(main())
