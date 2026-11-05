import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { tarballName } from './lib/pack-packages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(new URL('../packages/mcp/package.json', import.meta.url));
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

test('offline packed install answers all tools with its installed artifact', { timeout: 900_000 }, async () => {
  const storeResult = spawnSync('pnpm', ['store', 'path'], { cwd: root, encoding: 'utf8', timeout: 30_000 });
  assert.equal(storeResult.status, 0, `${storeResult.stdout}\n${storeResult.stderr}`);
  const store = storeResult.stdout.trim();
  assert.ok(store, 'pnpm store path must not be empty');
  const clean = mkdtempSync(join(tmpdir(), 'egdev-mcp-consumer-'));
  try {
    const version = (name) => JSON.parse(readFileSync(resolve(root, `packages/${name}/package.json`), 'utf8')).version;
    const tarball = (name) => `file:${resolve(root, 'release', tarballName(`@egdev/${name}`, version(name)))}`;
    writeFileSync(
      join(clean, 'package.json'),
      JSON.stringify({
        private: true,
        dependencies: { '@egdev/mcp': tarball('mcp'), '@egdev/system': tarball('system') }
      })
    );
    writeFileSync(join(clean, 'pnpm-workspace.yaml'), `overrides:\n  '@egdev/system': '${tarball('system')}'\n`);
    const install = spawnSync(
      'pnpm',
      [
        'install',
        '--offline',
        '--ignore-scripts',
        '--no-frozen-lockfile',
        '--strict-peer-dependencies',
        '--store-dir',
        store,
        '--package-import-method',
        'copy'
      ],
      { cwd: clean, encoding: 'utf8', timeout: 240_000 }
    );
    assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`);
    const artifact = JSON.parse(readFileSync(join(clean, 'node_modules/@egdev/system/design-system.json'), 'utf8'));
    const designSystem = { name: artifact.name, schemaVersion: artifact.schemaVersion, packages: artifact.packages };
    const docs = readFileSync(resolve(root, 'packages/mcp/README.md'), 'utf8');
    const blocks = [...docs.matchAll(/```json\n([\s\S]*?)\n```/g)].map((match) => JSON.parse(match[1]));
    assert.equal(blocks.length, 2);
    assert.deepEqual(blocks[0], blocks[1]);
    const config = blocks[0].mcpServers.egdev;
    const command = config.command.replace('/absolute/path/to/consumer', clean);
    const client = new Client({ name: 'packed-test', version: '1.0.0' });
    await client.connect(new StdioClientTransport({ command, args: config.args }));
    try {
      const call = async (name, args = {}) =>
        JSON.parse((await client.callTool({ name, arguments: args })).content[0].text);
      const components = artifact.catalog.map(({ name, package: pkg, level, available }) => ({
        name,
        package: pkg,
        level,
        available
      }));
      assert.deepEqual(await call('list_components'), { designSystem, components, total: components.length });
      const component = artifact.components[0];
      assert.deepEqual(await call('get_component', { name: component.name }), {
        designSystem,
        component,
        catalog: artifact.catalog.find((item) => item.name === component.name)
      });
      assert.deepEqual(await call('get_tokens'), {
        designSystem,
        tokens: artifact.tokens,
        total: artifact.tokens.length
      });
      assert.deepEqual(await call('get_material_recipe'), { designSystem, recipes: artifact.materialRecipes });
      const systemMd = readFileSync(join(clean, 'node_modules/@egdev/system/system.md'), 'utf8');
      assert.deepEqual(await call('get_design_system_md'), { designSystem, systemMd });
    } finally {
      await client.close();
    }
  } finally {
    rmSync(clean, { recursive: true, force: true });
  }
});
