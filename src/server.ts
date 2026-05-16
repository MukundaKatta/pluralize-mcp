#!/usr/bin/env node
/**
 * pluralize MCP server. Three tools: `pluralize`, `singularize`, `is_plural`.
 *
 * Backed by the `pluralize` package, which handles common English
 * irregulars (`mouse` ↔ `mice`, `child` ↔ `children`).
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import pluralize from 'pluralize';

const VERSION = '0.1.0';

export function pluralizeWord(word: string, count?: number, inclusive: boolean = false): string {
  return pluralize(word, count, inclusive);
}

export function singularizeWord(word: string): string {
  return pluralize.singular(word);
}

export function isPlural(word: string): boolean {
  return pluralize.isPlural(word);
}

const server = new Server({ name: 'pluralize', version: VERSION }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'pluralize',
    description:
      'Pluralize a word. Optional `count`: returns singular when count=1, plural otherwise. `inclusive: true` prefixes the count.',
    inputSchema: {
      type: 'object',
      properties: {
        word: { type: 'string' },
        count: { type: 'integer' },
        inclusive: { type: 'boolean', default: false },
      },
      required: ['word'],
    },
  },
  {
    name: 'singularize',
    description: 'Return the singular form of an English word.',
    inputSchema: {
      type: 'object',
      properties: { word: { type: 'string' } },
      required: ['word'],
    },
  },
  {
    name: 'is_plural',
    description: 'Return true if the word is plural.',
    inputSchema: {
      type: 'object',
      properties: { word: { type: 'string' } },
      required: ['word'],
    },
  },
] as const;

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  try {
    if (name === 'pluralize') {
      const a = args as unknown as { word: string; count?: number; inclusive?: boolean };
      return jsonResult({ result: pluralizeWord(a.word, a.count, a.inclusive ?? false) });
    }
    if (name === 'singularize') {
      const a = args as unknown as { word: string };
      return jsonResult({ result: singularizeWord(a.word) });
    }
    if (name === 'is_plural') {
      const a = args as unknown as { word: string };
      return jsonResult({ is_plural: isPlural(a.word) });
    }
    return errorResult('unknown tool: ' + name);
  } catch (err) {
    return errorResult('pluralize failed: ' + (err as Error).message);
  }
});

function jsonResult(value: unknown) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] };
}
function errorResult(message: string) {
  return { isError: true, content: [{ type: 'text', text: message }] };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`pluralize MCP server v${VERSION} ready on stdio\n`);
}
