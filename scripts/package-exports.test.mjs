import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Build first: these checks verify exported artifacts, not CSS consumption or React compatibility.
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = (name) => JSON.parse(readFileSync(resolve(root, `packages/${name}/package.json`), 'utf8'));
const ui = manifest('ui');
const tokens = manifest('tokens');
function artifact(name, target) {
  assert.equal(typeof target, 'string', `${name} export must have a file target`);
  assert.ok(target.startsWith('./'), `${name} export must be package-relative`);
  const path = resolve(root, `packages/${name}`, target);
  assert.ok(existsSync(path), `Missing exported artifact: ${path}. Run pnpm build before this test.`);
  assert.ok(statSync(path).isFile() && statSync(path).size > 0, `Export must be a nonempty file: ${path}`);
  return path;
}

test('UI publishes its stable declaration entry and reachable internal declarations', (context) => {
  assert.equal(ui.exports['.'].types, './dist/index.d.ts');
  assert.equal(ui.types, ui.exports['.'].types);
  const entry = artifact('ui', ui.exports['.'].types);
  const dist = dirname(entry);
  assert.ok(!existsSync(resolve(dist, 'src/index.d.ts')), 'Fresh build must not retain the mis-rooted entry');
  const pending = [entry];
  const visited = new Set();
  while (pending.length) {
    const file = pending.pop();
    if (visited.has(file)) {
      continue;
    }
    visited.add(file);
    const source = readFileSync(file, 'utf8');
    assert.ok(source.trim(), `Empty declaration: ${file}`);
    const info = ts.preProcessFile(source, true);
    for (const reference of [...info.importedFiles, ...info.referencedFiles]) {
      const specifier = reference.fileName;
      if (!specifier.startsWith('.')) {
        continue;
      }
      const base = resolve(dirname(file), specifier.replace(/\.js$/, ''));
      const dependency = [base, `${base}.d.ts`, resolve(base, 'index.d.ts')].find(
        (candidate) => candidate.endsWith('.d.ts') && existsSync(candidate) && statSync(candidate).isFile()
      );
      assert.ok(dependency, `Unresolved internal declaration: ${file} -> ${specifier}`);
      assert.ok(!relative(dist, dependency).startsWith('..'), `Declaration escapes dist: ${dependency}`);
      pending.push(dependency);
    }
  }
  assert.ok(visited.size > 1, 'Public entry must link to component declarations');
  context.diagnostic(`Checked ${visited.size} reachable declaration files`);
});

test('UI publishes its stable JavaScript entry', () => {
  assert.equal(ui.exports['.'].import, './dist/index.js');
  assert.equal(ui.main, ui.exports['.'].import);
  artifact('ui', ui.exports['.'].import);
});

test('UI CSS export resolves to a compiled artifact under dist', () => {
  assert.equal(ui.exports['./styles.css'], './dist/styles.css');
  artifact('ui', ui.exports['./styles.css']);
});

test('UI ships plain layered CSS without token definitions or scanned utilities', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  assert.doesNotMatch(css, /@(import|reference|source|tailwind|theme|custom-variant|apply)\b/);
  assert.match(css, /@layer theme, base, components, utilities\s*;/);
  assert.match(css, /@layer components\s*\{/);
  for (const selector of ['.eg-surface', '.eg-icon-btn--square', '.eg-tabs__item']) {
    assert.ok(css.includes(selector), `Missing shipped selector ${selector}`);
  }
  for (const token of ['--color-surface-1', '--radius-md', '--shadow-edge']) {
    assert.ok(css.includes(`var(${token})`), `UI must consume ${token}`);
    assert.ok(!css.includes(`${token}:`), `UI must not redefine ${token}`);
  }
  assert.match(css, /prefers-reduced-transparency:\s*reduce/);
  assert.doesNotMatch(css, /\.(flex|p-4|gap-4|bg-red-500)\s*[,{]/);
});

test('UI JavaScript remains importable without a CSS loader', async () => {
  const entry = artifact('ui', ui.exports['.'].import);
  const imports = ts.preProcessFile(readFileSync(entry, 'utf8'), true).importedFiles;
  assert.ok(!imports.some(({ fileName }) => fileName.endsWith('.css')), 'Styles must remain an explicit import');
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { Surface } = await import(entry);
  assert.match(renderToString(createElement(Surface, null, 'CSS consumer')), /eg-surface/);
});

for (const subpath of ['./tokens.css', './theme.css', './native.css']) {
  test(`Tokens ${subpath} export resolves to a nonempty file`, () => {
    artifact('tokens', tokens.exports[subpath]);
  });
}

test('Tokens ships a compiled native artifact under dist without @theme', () => {
  assert.equal(tokens.exports['./tokens.css'], './dist/tokens.css', 'native import must be the compiled artifact');
  const entry = artifact('tokens', tokens.exports['./tokens.css']);
  assert.doesNotMatch(readFileSync(entry, 'utf8'), /@theme/, 'compiled artifact must not keep the @theme at-rule');
});

test('Tokens retires the JSON export and its source file', () => {
  assert.equal(tokens.exports['./tokens.json'], undefined, 'tokens.json export must be retired');
  assert.equal(
    existsSync(resolve(root, 'packages/tokens/src/tokens.json')),
    false,
    'tokens.json source must be removed, not just unexported'
  );
});
