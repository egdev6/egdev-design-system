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

// Read a complete emitted block, including nested supports/media rules and quoted values.
function cssBlock(css, opening) {
  const match = opening.exec(css);
  assert.ok(match, `Missing emitted CSS block ${opening}`);
  let depth = 1;
  let quote = '';
  for (let index = match.index + match[0].length; index < css.length; index++) {
    const char = css[index];
    if (char === '\\') {
      index++;
    } else if (quote) {
      if (char === quote) {
        quote = '';
      }
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '{') {
      depth++;
    } else if (char === '}' && --depth === 0) {
      return css.slice(match.index, index + 1);
    }
  }
  assert.fail(`Unclosed emitted CSS block ${opening}`);
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

test('UI ships plain layered CSS without canonical token definitions or unrelated utilities', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /@(import|reference|source|tailwind|theme|custom-variant|apply)\b/);
  assert.match(css, /@layer theme, base, components, utilities\s*;/);
  assert.match(css, /@layer components\s*\{/);
  for (const selector of [
    '.eg-gauge-arc',
    '.eg-gauge-center',
    '.bg-transparent',
    '.bg-none',
    String.raw`.\[box-shadow\:none\]`
  ]) {
    assert.ok(css.includes(selector), `Missing shipped selector ${selector}`);
  }
  for (const token of ['--color-surface-0', '--radius-full', '--shadow-well']) {
    assert.ok(css.includes(`var(${token})`), `UI must consume ${token}`);
    assert.ok(!css.includes(`${token}:`), `UI must not redefine ${token}`);
  }
  const theme = readFileSync(resolve(root, 'packages/tokens/src/theme.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const canonical = new Set([...theme.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
  for (const token of canonical) {
    assert.doesNotMatch(css, new RegExp(`${token}\\s*:`), `UI must not redefine ${token}`);
  }
  assert.match(css, /prefers-reduced-transparency:\s*reduce/);
  // Only Gauge's explicit CVA source is scanned, not stories, tests or the default palette.
  assert.doesNotMatch(css, /\.(flex|p-4|gap-4|bg-red-500)\s*[,{]/);
});

test('UI ships functional static Gauge utilities without an application Tailwind compiler', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}(?:\\[data-state=[^\\]]+\\])?\\s*\\{`));
  };
  for (const [selector, declaration] of [
    ['.bg-transparent', /background-color:\s*(?:transparent|#0000(?:0000)?)\s*;/],
    ['.bg-none', /background-image:\s*none\s*;/],
    [String.raw`.\[box-shadow\:none\]`, /box-shadow:\s*none\s*;/],
    [String.raw`.rounded-\[var\(--radius-full\)\]`, /border-radius:\s*var\(--radius-full\)\s*;/],
    ['.border-0', /border(?:-width)?:\s*(?:0|0px)\s*;/],
    ['.p-0', /padding:\s*(?:0|0px|var\(--space-0\)|calc\(var\(--(?:space-1|spacing)\)\s*\*\s*0\))\s*;/],
    ['.inline-flex', /display:\s*inline-flex\s*;/],
    ['.gap-2', /gap:\s*var\(--space-2\)\s*;/],
    ['.font-sans', /font-family:\s*var\(--font-sans(?:,\s*"Barlow",\s*system-ui,\s*sans-serif)?\)\s*;/],
    ['.text-fg-default', /color:\s*var\(--color-fg-default(?:,\s*var\(--color-primitive-white\))?\)\s*;/],
    ['.text-label-default', /font-size:\s*var\(--text-label-default(?:,\s*14px)?\)\s*;/],
    ['.transition-none', /transition-property:\s*none\s*;/],
    [String.raw`.hover\:shadow-none:hover`, /box-shadow:\s*[^;]+;/]
  ]) {
    assert.match(rule(selector), declaration);
  }
  for (const size of ['space-4', 'space-10', 'space-14', 'space-20', 'eg-gauge-size']) {
    for (const [prefix, property] of [
      ['w', 'width'],
      ['h', 'height']
    ]) {
      assert.match(rule(`.${prefix}-\\[var\\(--${size}\\)\\]`), new RegExp(`${property}:\\s*var\\(--${size}\\)\\s*;`));
    }
  }
  for (const stroke of ['3px', '4px', '6px']) {
    assert.ok(rule(`.\\[--eg-gauge-stroke\\:${stroke}\\]`).includes(`--eg-gauge-stroke: ${stroke};`));
  }
  assert.match(
    rule(String.raw`.\[--eg-gauge-stroke\:calc\(var\(--eg-gauge-size\)\/14\)\]`),
    /--eg-gauge-stroke:\s*calc\(var\(--eg-gauge-size\)\s*\/\s*14\)\s*;/
  );
  assert.match(
    rule(String.raw`.\[--eg-gauge-track\:--alpha\(var\(--color-fg-default\)\/10\%\)\]`),
    /--eg-gauge-track:\s*color-mix\(in oklab,\s*var\(--color-fg-default\)\s*10%,\s*transparent\)\s*;/
  );
  assert.doesNotMatch(css, /--alpha\s*\(/);
  assert.match(
    rule(String.raw`.\[--eg-gauge-fill\:var\(--color-fg-brand-default\)\]`),
    /--eg-gauge-fill:\s*var\(--color-fg-brand-default\)\s*;/
  );
  for (const [state, token] of [
    ['warning', 'status-warning'],
    ['critical', 'status-danger'],
    ['muted', 'fg-muted']
  ]) {
    const body = rule(`.data-\\[state\\=${state}\\]\\:\\[--eg-gauge-fill\\:var\\(--color-${token}\\)\\]`);
    assert.match(body, new RegExp(`\\[data-state=["']?${state}["']?\\]\\s*\\{`));
    assert.ok(body.includes(`--eg-gauge-fill: var(--color-${token});`));
  }
});

test('UI ships the approved Gauge geometry in the components layer', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const components = cssBlock(css, /@layer components\s*\{/);
  const arc = cssBlock(components, /\.eg-gauge-arc\s*\{/);
  const center = cssBlock(components, /\.eg-gauge-center\s*\{/);
  assert.match(
    arc,
    /background:\s*conic-gradient\(var\(--eg-gauge-fill\) calc\(var\(--eg-gauge-value\) \* 1%\), var\(--eg-gauge-track\) 0\)\s*;/
  );
  assert.match(arc, /mask:\s*radial-gradient\(/);
  assert.match(center, /inset:\s*30%\s*;/);
});

test('UI JavaScript remains importable without a CSS loader', async () => {
  const entry = artifact('ui', ui.exports['.'].import);
  const imports = ts.preProcessFile(readFileSync(entry, 'utf8'), true).importedFiles;
  assert.ok(!imports.some(({ fileName }) => fileName.endsWith('.css')), 'Styles must remain an explicit import');
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { Gauge } = await import(entry);
  assert.match(renderToString(createElement(Gauge, { label: 'CSS consumer', value: 42 })), /role="meter"/);
});

test('UI root exports implemented components and their public types with scoped SSR semantics', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  assert.deepEqual(
    Object.keys(exported).sort(),
    ['Gauge', 'Portal', 'cn'],
    'Only implemented components and cn are public runtime exports'
  );
  assert.equal(typeof exported.Gauge, 'function', 'Gauge must be a named root export');
  assert.equal(exported.default, undefined, 'UI must not introduce a default export');
  const declaration = artifact('ui', ui.exports['.'].types);
  const program = ts.createProgram([declaration], { moduleResolution: ts.ModuleResolutionKind.Bundler });
  const checker = program.getTypeChecker();
  const symbol = checker.getSymbolAtLocation(program.getSourceFile(declaration));
  const names = new Set(checker.getExportsOfModule(symbol).map((item) => item.name));
  assert.deepEqual([...names].sort(), [
    'Gauge',
    'GaugeProps',
    'GaugeSize',
    'GaugeState',
    'Portal',
    'PortalProps',
    'cn'
  ]);
  for (const name of ['Gauge', 'GaugeProps', 'GaugeState', 'GaugeSize', 'Portal', 'PortalProps']) {
    assert.ok(names.has(name), `Missing public declaration export ${name}`);
  }
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  assert.equal(renderToString(createElement(exported.Portal, { children: 'Server layer' })), '');
  const html = renderToString(createElement(exported.Gauge, { label: 'Capacity', value: 42.5 }));
  for (const text of [
    'eg-gauge',
    'role="meter"',
    'aria-label="Capacity"',
    'aria-valuenow="42.5"',
    'aria-valuetext="42.5 / 100"'
  ]) {
    assert.ok(html.includes(text), `Gauge SSR must render ${text}`);
  }
  const invalid = renderToString(createElement(exported.Gauge, { label: 'Capacity', value: NaN }));
  assert.match(invalid, /Data unavailable/);
  assert.doesNotMatch(invalid, /role="meter"|aria-value(?:now|min|max|text)=|eg-gauge-arc/);
  assert.doesNotMatch(html + invalid, /aria-live=|<button|<input|tabindex=/);
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
