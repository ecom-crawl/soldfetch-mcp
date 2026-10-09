import assert from "node:assert/strict";

const url = "https://soldfetch.com/api/mcp";
const expectedTools = ["get_ebay_item", "search_ebay_sold", "search_ebay_category"].sort();

const body = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list",
  params: {
    _meta: {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {
        name: "soldfetch-mcp-repository-check",
        version: "1.0.0",
      },
      "io.modelcontextprotocol/clientCapabilities": {},
    },
  },
};

function request(headers = {}) {
  return fetch(url, {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(30000),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "MCP-Protocol-Version": "2026-07-28",
      "MCP-Method": "tools/list",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

if (!process.argv.includes("--authenticated")) {
  const response = await request();
  assert.equal(response.status, 401, "MCP must reject a missing credential");
  console.log("Live MCP authentication check passed.");
  process.exit(0);
}

const key = process.env.SOLDFETCH_API_KEY?.trim();
assert.ok(key, "Set SOLDFETCH_API_KEY before using --authenticated");
const response = await request({ "API-KEY": key });
const text = await response.text();
assert.equal(response.status, 200, `MCP tools/list failed: ${text.slice(0, 1000)}`);
const payload = JSON.parse(text);
assert.equal(payload.jsonrpc, "2.0");
assert.deepEqual(
  payload.result.tools.map((tool) => tool.name).sort(),
  expectedTools,
);
console.log("Live MCP tools/list returned all 3 expected tools.");
