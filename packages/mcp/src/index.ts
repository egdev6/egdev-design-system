#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadArtifact } from './artifact.js';
import { createServer } from './server.js';

try {
  const path = fileURLToPath(import.meta.resolve('@egdev/system/design-system.json'));
  const data = loadArtifact(path);
  await createServer(data).connect(new StdioServerTransport());
} catch (error) {
  console.error((error instanceof Error ? error.message : String(error)).replace(/[\r\n]+/g, ' '));
  process.exitCode = 1;
}
