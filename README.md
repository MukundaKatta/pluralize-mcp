# pluralize-mcp

[![npm](https://img.shields.io/npm/v/@mukundakatta/pluralize-mcp.svg)](https://www.npmjs.com/package/@mukundakatta/pluralize-mcp)
[![mcp](https://img.shields.io/badge/protocol-MCP-blue.svg)](https://modelcontextprotocol.io)

MCP server: convert English words between singular and plural. Handles
common irregulars like `mouse ↔ mice` and `child ↔ children`.

## Tools

- `pluralize` — `{ word: "cat", count: 1, inclusive: true }` → `"1 cat"`
- `singularize` — `{ word: "mice" }` → `"mouse"`
- `is_plural` — `{ word: "cats" }` → `true`

## Configure

```json
{ "mcpServers": { "pluralize": { "command": "npx", "args": ["-y", "@mukundakatta/pluralize-mcp"] } } }
```

## License

MIT.
