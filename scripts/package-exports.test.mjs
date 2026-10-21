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
    '.min-w-0',
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
    ['.min-w-0', /min-width:\s*(?:0|0px|var\(--space-0\))\s*;/],
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

test('UI ships the approved static Skeleton silhouette utilities without animations', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  for (const [selector, property, token] of [
    ['.h-3', 'height', 'space-3'],
    ['.h-4', 'height', 'space-4'],
    ['.h-5', 'height', 'space-5'],
    ['.h-12', 'height', 'space-12'],
    ['.h-20', 'height', 'space-20'],
    ['.h-24', 'height', 'space-24'],
    ['.size-8', 'width', 'space-8'],
    ['.size-12', 'width', 'space-12'],
    ['.size-16', 'width', 'space-16']
  ]) {
    const body = rule(selector);
    assert.match(body, new RegExp(`${property}:\\s*var\\(--${token}\\)\\s*;`));
    if (property === 'width') {
      assert.match(body, new RegExp(`height:\\s*var\\(--${token}\\)\\s*;`), `${selector} must size both axes`);
    }
  }
  for (const [selector, token, fallback] of [
    ['.rounded-sm', 'radius-sm', '4px'],
    ['.rounded-md', 'radius-md', '12px'],
    ['.rounded-full', 'radius-full', '9999px']
  ]) {
    assert.match(rule(selector), new RegExp(`border-radius:\\s*var\\(--${token},\\s*${fallback}\\)\\s*;`));
  }
  assert.match(rule('.w-full'), /width:\s*100%\s*;/);
  assert.match(
    rule('.bg-border-default'),
    /background-color:\s*var\(--color-border-default,\s*var\(--color-primitive-graphite-800\)\)\s*;/
  );
  assert.match(rule('.block'), /display:\s*block\s*;/);
  const utilityLayer = cssBlock(css, /@layer utilities\s*\{/);
  assert.doesNotMatch(utilityLayer, /animate-|@keyframes/, 'Skeleton utilities must stay static without animations');
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
  const { Gauge, VisuallyHidden } = await import(entry);
  assert.match(renderToString(createElement(Gauge, { label: 'CSS consumer', value: 42 })), /role="meter"/);
  const hidden = renderToString(createElement(VisuallyHidden, null, 'Hidden note'));
  assert.match(hidden, /<span class="eg-visually-hidden"[^>]*clip:rect\(0, 0, 0, 0\)[^>]*>Hidden note<\/span>/);
});

test('UI root exports Gauge, AspectRatio, Portal, Slot and their public types with passive SSR semantics', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  assert.deepEqual(
    Object.keys(exported).sort(),
    ['AspectRatio', 'Gauge', 'Portal', 'Skeleton', 'Slot', 'Slottable', 'VisuallyHidden', 'cn'],
    'Only approved components and cn are public runtime exports'
  );
  assert.equal(typeof exported.Gauge, 'function', 'Gauge must be a named root export');
  // Radix forwardRef wraps AspectRatio in a React ref object; its callable contract is proven by SSR below.
  assert.equal(typeof exported.AspectRatio, 'object', 'AspectRatio must be a named forwardRef root export');
  assert.equal(typeof exported.Skeleton, 'function', 'Skeleton must be a named root export');
  assert.equal(
    exported.VisuallyHidden?.$$typeof,
    Symbol.for('react.forward_ref'),
    'VisuallyHidden must be a forwardRef component with a public ref'
  );
  assert.equal(typeof exported.VisuallyHidden.render, 'function', 'VisuallyHidden must expose its render function');
  assert.equal(exported.default, undefined, 'UI must not introduce a default export');
  const declaration = artifact('ui', ui.exports['.'].types);
  const program = ts.createProgram([declaration], { moduleResolution: ts.ModuleResolutionKind.Bundler });
  const checker = program.getTypeChecker();
  const symbol = checker.getSymbolAtLocation(program.getSourceFile(declaration));
  const names = new Set(checker.getExportsOfModule(symbol).map((item) => item.name));
  assert.deepEqual([...names].sort(), [
    'AspectRatio',
    'AspectRatioProps',
    'Gauge',
    'GaugeProps',
    'GaugeSize',
    'GaugeState',
    'Portal',
    'PortalProps',
    'Skeleton',
    'SkeletonProps',
    'SkeletonSize',
    'SkeletonVariant',
    'Slot',
    'SlotProps',
    'Slottable',
    'VisuallyHidden',
    'VisuallyHiddenProps',
    'cn'
  ]);
  for (const name of [
    'Gauge',
    'GaugeProps',
    'GaugeState',
    'GaugeSize',
    'AspectRatio',
    'AspectRatioProps',
    'Portal',
    'PortalProps',
    'Skeleton',
    'SkeletonProps',
    'SkeletonSize',
    'SkeletonVariant',
    'Slot',
    'SlotProps',
    'Slottable',
    'VisuallyHidden',
    'VisuallyHiddenProps'
  ]) {
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
  // AspectRatio reserves geometry with the Radix padding-bottom trick and no extra semantics.
  const wide = renderToString(createElement(exported.AspectRatio, { 'aria-label': 'Media', ratio: 16 / 9 }, 'Media'));
  assert.ok(
    wide.includes('eg-aspect-ratio') && wide.includes('min-w-0'),
    'AspectRatio must carry its marker and CVA base'
  );
  assert.ok(wide.includes('padding-bottom:56.25%'), 'AspectRatio 16/9 must derive its padding-bottom geometry');
  assert.ok(
    wide.includes('data-radix-aspect-ratio-wrapper'),
    'AspectRatio must render the inner generic div inside the Radix frame'
  );
  assert.ok(wide.includes('Media'), 'AspectRatio must render its children');
  assert.doesNotMatch(wide, /aria-live=|<button|<input|tabindex=|role=/);
  for (const ratio of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    const fallback = renderToString(createElement(exported.AspectRatio, { ratio }, 'Fallback'));
    assert.ok(fallback.includes('padding-bottom:100%'), `Invalid ratio ${ratio} must fall back to a square`);
  }
  const geometry = [
    ['line', 'sm', 'h-3', 'rounded-sm'],
    ['line', 'md', 'h-4', 'rounded-sm'],
    ['line', 'lg', 'h-5', 'rounded-sm'],
    ['block', 'sm', 'h-12', 'rounded-md'],
    ['block', 'md', 'h-20', 'rounded-md'],
    ['block', 'lg', 'h-24', 'rounded-md'],
    ['circle', 'sm', 'size-8', 'rounded-full'],
    ['circle', 'md', 'size-12', 'rounded-full'],
    ['circle', 'lg', 'size-16', 'rounded-full']
  ];
  for (const [variant, size, dimension, radius] of geometry) {
    const shape = renderToString(createElement(exported.Skeleton, { variant, size }));
    assert.match(
      shape,
      /^<span aria-hidden="true" class="eg-skeleton /,
      `Skeleton ${variant}/${size} must keep the stable root class`
    );
    assert.ok(shape.includes(dimension), `Skeleton ${variant}/${size} must render ${dimension}`);
    assert.ok(shape.includes(radius), `Skeleton ${variant}/${size} must render ${radius}`);
    assert.equal(shape.includes('w-full'), variant !== 'circle', `Skeleton ${variant}/${size} width ownership`);
    assert.ok(shape.endsWith('></span>'), `Skeleton ${variant}/${size} must stay an empty span`);
    assert.match(shape, /aria-hidden="true"/);
    assert.doesNotMatch(shape, /aria-live|aria-busy|role=|tabindex|data-state|animate-/);
  }
  const skeletonNative = renderToString(
    createElement(exported.Skeleton, {
      id: 'consumer-skeleton',
      title: 'Decorative placeholder',
      className: 'w-3/4 mt-2'
    })
  );
  assert.ok(skeletonNative.includes('id="consumer-skeleton"'), 'Native span id must survive');
  assert.ok(skeletonNative.includes('title="Decorative placeholder"'), 'Native span title must survive');
  assert.ok(
    skeletonNative.includes('w-3/4') && skeletonNative.includes('mt-2'),
    'Supported width override must survive'
  );
  assert.ok(!skeletonNative.includes('w-full'), 'Consumer width must replace the preset full width');
  assert.ok(skeletonNative.endsWith('></span>'), 'Native props must not add content');
});

test('UI VisuallyHidden renders non-visual content without shipped CSS or Tailwind', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { VisuallyHidden } = exported;
  const note = renderToString(createElement(VisuallyHidden, { id: 'hint', className: 'extra' }, 'Screen reader note'));
  // Radix applies the hiding geometry inline; the class is the stable public marker only.
  assert.match(note, /<span id="hint" class="eg-visually-hidden extra" style="[^"]*position:absolute/);
  assert.match(note, /clip:rect\(0, 0, 0, 0\)/);
  assert.match(note, />Screen reader note<\/span>/);
  const slotted = renderToString(
    createElement(VisuallyHidden, { asChild: true }, createElement('h2', { id: 'slotted' }, 'Hidden heading'))
  );
  assert.match(slotted, /^<h2 id="slotted" class="eg-visually-hidden" style="[^"]*position:absolute/);
  assert.match(slotted, /clip:rect\(0, 0, 0, 0\)[^"]*">Hidden heading<\/h2>$/);
  assert.doesNotMatch(slotted, /<span/, 'asChild must not keep a wrapping span');
  const styles = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  assert.ok(
    !styles.includes('.eg-visually-hidden'),
    'Hiding geometry is inline Radix behavior; shipped CSS must stay untouched'
  );
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
