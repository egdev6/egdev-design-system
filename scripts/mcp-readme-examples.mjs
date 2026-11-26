// Regenerates the usage examples in packages/mcp/README.md from the real stdio server, so refreshing them for a
// release is mechanical instead of hand-edited: the version sentence, every complete response, the
// get_design_system_md excerpt and the sha256 digests. Requests, prose and the error example stay as authored.
//   pnpm mcp:readme                              builds the server, then rewrites the README
//   node scripts/mcp-readme-examples.mjs --check  fails when the README is stale, writes nothing
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = fileURLToPath(new URL('../', import.meta.url));
const usage = 'Usage: node scripts/mcp-readme-examples.mjs --write|--check';
// The same markers packages/mcp/tests/readme-examples.test.mjs parses.
const exampleBlock = /<!-- mcp-example:([a-z_]+) -->\n([\s\S]*?)\n<!-- \/mcp-example:\1 -->/g;
const requestFence = /```json mcp-request\n([\s\S]*?)\n```/;
const responseFence = /```json mcp-response(-excerpt)?\n([\s\S]*?)\n```/;
const digestComment = /<!-- mcp-response-sha256: [a-f0-9]{64} -->/;
const versionSentence = /These examples use `@egdev\/mcp` \S+ and `@egdev\/system` \S+ from the same release\./;
const systemMdKey = '"systemMd":"';
// How many characters of the serialized systemMd string the excerpt example shows after the identity prefix.
export const excerptCharacters = 62;

const sha256 = (text) => createHash('sha256').update(text, 'utf8').digest('hex');

/**
 * Returns the README with every digest-bearing example regenerated through `call`. An example without a digest
 * (the unknown-component error) is a fixed response and is left untouched. Throws, writing nothing, when an
 * example cannot be reproduced faithfully.
 */
export async function refreshReadme(markdown, { versions, call }) {
  if (!versionSentence.test(markdown)) {
    throw new Error('The README has no example version sentence ("These examples use `@egdev/mcp` ...").');
  }
  const results = new Map();
  for (const [, id, body] of markdown.matchAll(exampleBlock)) {
    if (!digestComment.test(body)) {
      continue;
    }
    const request = requestFence.exec(body)?.[1];
    if (!request || !responseFence.test(body)) {
      throw new Error(`${id}: the example needs one mcp-request block and one mcp-response block.`);
    }
    const result = await call(JSON.parse(request));
    if (result.isError) {
      throw new Error(`${id}: the server answered with an error: ${result.content?.[0]?.text}`);
    }
    results.set(id, result);
  }
  return markdown
    .replace(
      versionSentence,
      () =>
        `These examples use \`@egdev/mcp\` ${versions.mcp} and \`@egdev/system\` ${versions.system} from the same release.`
    )
    .replace(exampleBlock, (block, id, body) => {
      const result = results.get(id);
      if (!result) {
        return block;
      }
      const text = result.content[0].text;
      const excerpt = responseFence.exec(body)[1];
      let shown = result;
      if (excerpt) {
        const start = text.indexOf(systemMdKey);
        const end = start + systemMdKey.length + excerptCharacters;
        if (start < 0 || end >= text.length) {
          throw new Error(`${id}: the response has no systemMd longer than its excerpt.`);
        }
        shown = { content: [{ type: 'text', text: text.slice(0, end) }] };
      }
      const refreshed = body
        .replace(
          responseFence,
          (_match, suffix = '') => `\`\`\`json mcp-response${suffix}\n${JSON.stringify(shown, null, 2)}\n\`\`\``
        )
        .replace(digestComment, () => `<!-- mcp-response-sha256: ${sha256(text)} -->`);
      return block.replace(body, () => refreshed);
    });
}

// The versions the README documents are the ones the test reads: this package and the installed @egdev/system.
function installedVersions(root) {
  const require = createRequire(resolve(root, 'packages/mcp/package.json'));
  const version = (path) => JSON.parse(readFileSync(path, 'utf8')).version;
  return {
    mcp: version(resolve(root, 'packages/mcp/package.json')),
    system: version(resolve(dirname(require.resolve('@egdev/system/design-system.json')), 'package.json'))
  };
}

// Connects an SDK client to the built server, like the README test does; the SDK is a dependency of @egdev/mcp.
async function connectServer(root) {
  const executable = resolve(root, 'packages/mcp/dist/index.js');
  if (!existsSync(executable)) {
    throw new Error('packages/mcp/dist/index.js is missing; run pnpm --filter @egdev/mcp run build first.');
  }
  const require = createRequire(resolve(root, 'packages/mcp/package.json'));
  const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
  const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
  const client = new Client({ name: 'mcp-readme-examples', version: '1.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [executable] }));
  return { call: (request) => client.callTool(request), close: () => client.close() };
}

// Injectable root, README path and logger keep tests off the committed README; the CLI writes only that file.
export async function runCli(
  args,
  {
    root = defaultRoot,
    readmePath = resolve(root, 'packages/mcp/README.md'),
    log = (message) => console.error(message)
  } = {}
) {
  try {
    if (args.length !== 1 || !['--write', '--check'].includes(args[0])) {
      throw new Error(usage);
    }
    const current = readFileSync(readmePath, 'utf8');
    const server = await connectServer(root);
    let refreshed;
    try {
      refreshed = await refreshReadme(current, { versions: installedVersions(root), call: server.call });
    } finally {
      await server.close();
    }
    if (args[0] === '--check') {
      if (refreshed !== current) {
        throw new Error('MCP README examples are stale; run pnpm mcp:readme.');
      }
      log('MCP README examples are up to date.');
    } else if (refreshed === current) {
      log('MCP README examples are already up to date.');
    } else {
      writeFileSync(readmePath, refreshed);
      log('MCP README examples regenerated.');
    }
    return 0;
  } catch (error) {
    log(String(error.message).replaceAll('\n', ' '));
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await runCli(process.argv.slice(2));
}
