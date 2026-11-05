import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const artifact = JSON.parse(readFileSync(new URL('../../system/design-system.json', import.meta.url), 'utf8'));
const golden = readFileSync(new URL('../../system/system.md', import.meta.url), 'utf8');

test('get_design_system_md returns the golden bytes and artifact version over stdio', async () => {
  const client = new Client({ name: 'system-md-test', version: '1.0.0' });
  const executable = fileURLToPath(new URL('../dist/index.js', import.meta.url));
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [executable] }));
  try {
    const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    assert.deepEqual(client.getServerVersion(), { name: '@egdev/mcp', version: manifest.version });
    const { tools } = await client.listTools();
    const tool = tools.find((entry) => entry.name === 'get_design_system_md');
    assert.ok(tool, 'get_design_system_md is listed');
    assert.equal(tool.inputSchema.type, 'object');
    const response = await client.callTool({ name: 'get_design_system_md', arguments: {} });
    assert.notEqual(response.isError, true);
    const result = JSON.parse(response.content[0].text);
    assert.deepEqual(result.designSystem, {
      name: artifact.name,
      schemaVersion: artifact.schemaVersion,
      packages: artifact.packages
    });
    assert.deepEqual(Buffer.from(result.systemMd), Buffer.from(golden));
  } finally {
    await client.close();
  }
});
