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

// Match escaped emitted selectors, not unescaped CVA class names; allow only complete approved utilities.
const unapprovedTransitionUtility =
  /\.transition-(?!(?:none|opacity|transform|colors|\\\[background-color\\,border-color\\\]|\\\[border-color\\,box-shadow\\\]|\\\[translate\\,background-color\\\])(?=\s*\{))[\w\\]/;

test('transition utility guard accepts only the exact approved emitted selectors', () => {
  for (const selector of [
    '.transition-none',
    '.transition-opacity',
    '.transition-transform',
    '.transition-colors',
    String.raw`.transition-\[background-color\,border-color\]`,
    String.raw`.transition-\[border-color\,box-shadow\]`,
    String.raw`.transition-\[translate\,background-color\]`,
    String.raw`.motion-reduce\:transition-none`
  ]) {
    assert.doesNotMatch(`${selector} { transition-property: none; }`, unapprovedTransitionUtility, selector);
  }
});

test('transition utility guard rejects unrelated named and arbitrary transitions', () => {
  for (const selector of [
    '.transition-all',
    '.transition-width',
    '.transition-opacity-extra',
    '.transition-none-extra',
    '.transition-transform-extra',
    String.raw`.transition-\[all\]`,
    String.raw`.transition-\[width\]`,
    String.raw`.transition-\[background-color\,border-color\,opacity\]`,
    String.raw`.transition-\[border-color\,box-shadow\,opacity\]`,
    String.raw`.transition-\[translate\,background-color\,width\]`,
    String.raw`.transition-\[translate\,background-color\]extra`
  ]) {
    assert.throws(
      () => assert.doesNotMatch(`${selector} { transition-property: all; }`, unapprovedTransitionUtility),
      { code: 'ERR_ASSERTION' },
      selector
    );
  }
});

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

test('UI ships Dropzone token geometry, native resets and attribute-driven colors without preflight', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) =>
    cssBlock(utilities, new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{`));
  for (const [selector, declaration] of [
    ['.min-w-24', /min-width:\s*var\(--space-24\)/],
    ['.min-h-24', /min-height:\s*var\(--space-24\)/],
    ['.min-h-14', /min-height:\s*var\(--space-14\)/],
    [String.raw`.gap-1\.5`, /gap:\s*calc\(var\(--space-1\)\s*\*\s*1\.5\)/],
    [String.raw`.gap-2\.5`, /gap:\s*calc\(var\(--space-1\)\s*\*\s*2\.5\)/],
    ['.border-dashed', /border-style:\s*dashed/],
    ['.bg-none', /background-image:\s*none/],
    [String.raw`.\[box-shadow\:none\]`, /box-shadow:\s*none/],
    ['.transition-colors', /transition-property:[^;]*background-color[^;]*border-color[^;]*;/],
    [
      String.raw`.data-\[state\=over\]\:border-border-brand[data-state="over"]`,
      /\[data-state=["']?over["']?\][\s\S]*border-color:\s*var\(--color-border-brand/
    ],
    [
      String.raw`.data-\[state\=over\]\:bg-alpha-red-07[data-state="over"]`,
      /background-color:\s*var\(--color-alpha-red-07/
    ],
    [String.raw`.data-\[state\=over\]\:text-fg-default[data-state="over"]`, /color:\s*var\(--color-fg-default/],
    [
      String.raw`.focus-visible\:shadow-focus:focus-visible`,
      /--tw-shadow:\s*0 0 0 2px var\(--tw-shadow-color, #141518\), 0 0 0 4px var\(--tw-shadow-color, #FF0036\)/
    ],
    [String.raw`.disabled\:opacity-45:disabled`, /opacity:\s*(?:45%|0\.45)/],
    [String.raw`.motion-reduce\:transition-none`, /transition-property:\s*none/]
  ]) {
    assert.match(rule(selector), declaration, selector);
  }
  assert.ok(utilities.includes('.flex-row') && utilities.includes('.flex-col'));
  assert.ok(utilities.includes(String.raw`.disabled\:pointer-events-none`));
  assert.ok(utilities.includes(String.raw`.disabled\:cursor-not-allowed`));
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
  // Only approved component CVA sources are scanned, not stories, tests or the default palette.
  assert.doesNotMatch(css, /\.(p-4|bg-red-500)\s*[,\{]/);
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

test('UI ships the approved Skeleton silhouette utilities with the canonical v0.2 pulse', () => {
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
  // The v0.2 delta binds the decorative pulse to the canonical --animate-pulse token.
  assert.match(rule('.animate-pulse'), /animation:\s*var\(--animate-pulse[,)]/);
  const reducedMotion = cssBlock(utilityLayer, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(
    cssBlock(reducedMotion, /\.motion-reduce\\:animate-none\s*\{/),
    /animation:\s*none\s*;/,
    'Reduced-motion preferences must stop the pulse'
  );
  // Pulse (Skeleton) and spin (Spinner, #69) are the only approved animation utilities.
  // Transitions are limited to none, Tooltip opacity (#75 D10), ProgressBar transform (#65 AC-09),
  // Input/Textarea border-color and box-shadow, Switch track background-color and border-color,
  // Switch thumb translate and background-color, and Dropzone colors (#56).
  // None of the animated transitions reach the Skeleton.
  assert.doesNotMatch(
    utilityLayer,
    /\.animate-(?!pulse\b|spin\b|none\b)\w/,
    'Only the approved pulse and spin animation utilities may ship'
  );
  assert.doesNotMatch(
    utilityLayer,
    unapprovedTransitionUtility,
    'Only the exact approved component transition utilities may ship'
  );
  assert.doesNotMatch(utilityLayer, /@keyframes/, 'The utilities layer must not define keyframes');
});

test('UI ships the Spinner icon-scale, stroke and canonical spin utilities with their keyframes', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  for (const [selector, value] of [
    ['.size-4', 'var\\(--space-4\\)'],
    [String.raw`.size-\(--icon-size\)`, 'var\\(--icon-size\\)'],
    ['.size-7', 'var\\(--space-7\\)']
  ]) {
    const body = rule(selector);
    assert.match(body, new RegExp(`width:\\s*${value}\\s*;`), `${selector} width`);
    assert.match(body, new RegExp(`height:\\s*${value}\\s*;`), `${selector} height`);
  }
  assert.match(rule('.size-full'), /width:\s*100%\s*;/);
  assert.match(rule('.inline-flex'), /display:\s*inline-flex\s*;/);
  assert.match(rule('.fill-none'), /fill:\s*none\s*;/);
  assert.match(rule('.stroke-current'), /stroke:\s*currentcolor\s*;/i);
  assert.match(rule(String.raw`.stroke-\(length\:--icon-stroke\)`), /stroke-width:\s*var\(--icon-stroke\)\s*;/);
  // D3: one linear turn per second through the canonical token, with a native fallback.
  assert.match(rule('.animate-spin'), /animation:\s*var\(--animate-spin,\s*spin 1s linear infinite\)\s*;/);
  const reducedMotion = cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(cssBlock(reducedMotion, /\.motion-reduce\\:animate-none\s*\{/), /animation:\s*none\s*;/);
  // Keyframes ship outside the utilities layer so native consumers animate without Tailwind.
  assert.match(css, /@keyframes spin\s*\{\s*to\s*\{\s*transform:\s*rotate\(360deg\);\s*\}\s*\}/);
  assert.doesNotMatch(css, /\.eg-spinner[^{]*\{/, 'Spinner has no stylesheet: its marker carries no rule');
});

test('UI ships the Logo heights, token inks and link focus ring over the legacy marker', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // Heights are --spacing multiples: 28/32px bound steps and the 9 × 4px calculated step.
  assert.match(rule('.h-7'), /height:\s*var\(--space-7\)\s*;/);
  assert.match(rule('.h-8'), /height:\s*var\(--space-8\)\s*;/);
  assert.match(rule('.h-9'), /height:\s*calc\(var\(--space-1\) \* 9\)\s*;/);
  assert.match(rule('.h-full'), /height:\s*100%\s*;/);
  assert.match(rule('.w-auto'), /width:\s*auto\s*;/);
  assert.match(rule('.inline-block'), /display:\s*inline-block\s*;/);
  assert.match(rule('.leading-none'), /line-height:\s*1\s*;/);
  assert.match(rule('.rounded-sm'), /border-radius:\s*var\(--radius-sm[,)]/);
  // D3: the artwork is painted only by the logo tokens and the white primitive.
  assert.match(rule(String.raw`.fill-\(--logo-red\)`), /fill:\s*var\(--logo-red\)\s*;/);
  assert.match(rule(String.raw`.fill-\(--logo-red-shade\)`), /fill:\s*var\(--logo-red-shade\)\s*;/);
  assert.match(rule('.fill-primitive-white'), /fill:\s*var\(--color-primitive-white[,)]/);
  assert.match(rule(String.raw`.focus-visible\:outline-none:focus-visible`), /outline-style:\s*none\s*;/);
  assert.match(
    rule(String.raw`.focus-visible\:shadow-focus:focus-visible`),
    /--tw-shadow:\s*0 0 0 2px var\(--tw-shadow-color, #141518\), 0 0 0 4px var\(--tw-shadow-color, #FF0036\)\s*;/
  );
  // The legacy .eg-logo rule stays in the components layer, so the utilities above win.
  const components = cssBlock(css, /@layer components\s*\{/);
  assert.match(components, /\.eg-logo\s*\{[^}]*height:\s*32px/);
  assert.doesNotMatch(utilities, /\.eg-logo[^{]*\{/, 'Logo adds no marker rule of its own');
});

test('UI ships the StatusDot ring, glow and fill utilities with its motion-safe pulse keyframes', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // D4: 8px status dots and 10px signal dots on the spacing scale.
  assert.match(rule('.size-2'), /width:\s*var\(--space-2\)\s*;/);
  assert.match(rule(String.raw`.size-2\.5`), /width:\s*calc\(var\(--space-1\) \* 2\.5\)\s*;/);
  assert.match(rule('.inline-block'), /display:\s*inline-block\s*;/);
  assert.match(rule('.rounded-full'), /border-radius:\s*var\(--radius-full[,)]/);
  // D5/D6: a 2px ring that always uses the surface token.
  assert.match(rule('.ring-2'), /--tw-ring-shadow:[^;]*calc\(2px \+ var\(--tw-ring-offset-width\)\)/);
  assert.match(rule('.ring-bg-surface'), /--tw-ring-color:\s*var\(--color-bg-surface[,)]/);
  assert.match(rule('.shadow-glow-hot'), /--tw-shadow:[^;]*rgba\(255, 0, 54, 0\.75\)/);
  for (const [utility, token] of [
    ['.bg-status-success', '--color-status-success'],
    ['.bg-status-info', '--color-status-info'],
    ['.bg-status-warning', '--color-status-warning'],
    ['.bg-status-danger', '--color-status-danger'],
    ['.bg-primitive-neutral-600', '--color-primitive-neutral-600'],
    ['.bg-fg-brand-default', '--color-fg-brand-default'],
    ['.bg-primitive-white', '--color-primitive-white']
  ]) {
    assert.match(rule(utility), new RegExp(`background-color:\\s*var\\(${token}[,)]`), utility);
  }
  // D7/AC-04/AC-05: the pulse only runs without a reduced-motion preference.
  const motionSafe = cssBlock(utilities, /@media \(prefers-reduced-motion: no-preference\)\s*\{/);
  assert.match(
    cssBlock(
      motionSafe,
      /\.motion-safe\\:animate-\\\[eg-status-dot-pulse_2\\\.4s_var\\\(--ease-out\\\)_infinite\\\]\s*\{/
    ),
    /animation:\s*eg-status-dot-pulse 2\.4s var\(--ease-out\) infinite\s*;/
  );
  // status-dot.css ships only top-level keyframes, never a selector for the marker.
  assert.match(
    css,
    /@keyframes eg-status-dot-pulse\s*\{\s*0%, 100%\s*\{\s*transform:\s*scale\(1\);\s*opacity:\s*100%;\s*\}\s*50%\s*\{\s*transform:\s*scale\(0\.72\);\s*opacity:\s*75%;\s*\}\s*\}/
  );
  assert.doesNotMatch(utilities, /@keyframes eg-status-dot-pulse/);
});

test('UI ships the flat Kbd token utilities without a Kbd-specific stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  assert.match(rule('.inline-block'), /display:\s*inline-block\s*;/);
  assert.match(rule('.whitespace-nowrap'), /white-space:\s*nowrap\s*;/);
  assert.match(rule('.border'), /border-width:\s*1px\s*;/);
  assert.match(rule('.border-border-subtle'), /border-color:\s*var\(--color-border-subtle[,)]/);
  assert.match(rule(String.raw`.px-1\.5`), /padding-inline:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*1\.5\)\s*;/);
  assert.match(rule(String.raw`.py-0\.5`), /padding-block:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*0\.5\)\s*;/);
  // The hairline needs Tailwind's border-style initial value outside a Tailwind consumer.
  assert.match(css, /@property --tw-border-style\s*\{[^}]*initial-value:\s*solid/);
  // D6 no stylesheet: the only .eg-kbd rules are the retained legacy ones (components layer, below utilities).
  const legacy = readFileSync(resolve(root, 'packages/ui/src/styles/legacy/bundle.css'), 'utf8');
  const kbdRules = (text) => (text.replace(/\/\*[\s\S]*?\*\//g, '').match(/\.eg-kbd[^{]*\{/g) ?? []).length;
  assert.equal(kbdRules(css), kbdRules(legacy), 'Kbd has no stylesheet: its marker carries no new rule');
});

test('UI ships the Tooltip overlay recipe, fallbacks and fade as token utilities without a stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector, scope = utilities) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(scope, new RegExp(`${escaped}\\s*\\{`));
  };
  assert.match(rule('.bg-surface-overlay'), /background-color:\s*var\(--color-surface-overlay[,)]/);
  assert.match(
    rule(String.raw`.backdrop-blur-\[var\(--blur-overlay\)\]`),
    /--tw-backdrop-blur:\s*blur\(var\(--blur-overlay\)\)/
  );
  assert.match(rule('.backdrop-saturate-150'), /--tw-backdrop-saturate:\s*saturate\(150%\)/);
  assert.match(rule('.border-border-hairline-strong'), /border-color:\s*var\(--color-border-hairline-strong[,)]/);
  assert.match(
    rule(String.raw`.shadow-\[var\(--shadow-edge-strong\)\,var\(--shadow-elev-3\)\]`),
    /--tw-shadow:\s*var\(--shadow-edge-strong\),\s*var\(--shadow-elev-3\)/
  );
  assert.match(rule('.rounded-sm'), /border-radius:\s*var\(--radius-sm[,)]/);
  // D9: --space-1 x --space-2 through the token spacing scale.
  assert.match(rule('.px-2'), /padding-inline:\s*var\(--space-2\)\s*;/);
  assert.match(rule('.py-1'), /padding-block:\s*var\(--space-1\)\s*;/);
  assert.match(rule('.text-fg-default'), /color:\s*var\(--color-fg-default[,)]/);
  assert.match(
    rule(String.raw`.max-w-\[var\(--radix-tooltip-content-available-width\)\]`),
    /max-width:\s*var\(--radix-tooltip-content-available-width\)/
  );
  assert.match(rule('.transition-opacity'), /transition-property:\s*opacity/);
  assert.match(rule(String.raw`.duration-\[var\(--duration-fast\)\]`), /transition-duration:\s*var\(--duration-fast\)/);
  assert.match(rule(String.raw`.ease-\[var\(--ease-out\)\]`), /transition-timing-function:\s*var\(--ease-out\)/);
  // D10: the enter fade starts from transparent through @starting-style; reduced motion drops the transition.
  assert.match(
    rule(String.raw`.starting\:opacity-0`, cssBlock(utilities, /@starting-style\s*\{/)),
    /opacity:\s*0%?\s*;/
  );
  const reducedMotion = cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(rule(String.raw`.motion-reduce\:transition-none`, reducedMotion), /transition-property:\s*none/);
  // D8: solid surface-2 without blur or saturation under reduced transparency.
  const reduced = [...utilities.matchAll(/@media \(prefers-reduced-transparency:\s*reduce\)\s*\{/g)]
    .map((match) => cssBlock(utilities.slice(match.index), /@media[^{]*\{/))
    .join('\n');
  const fallback = (name) => rule(String.raw`.\[\@media\(prefers-reduced-transparency\:reduce\)\]\:` + name, reduced);
  assert.match(fallback('bg-surface-2'), /background-color:\s*var\(--color-surface-2[,)]/);
  assert.match(fallback('backdrop-blur-none'), /--tw-backdrop-blur:\s*;/);
  assert.match(fallback('backdrop-saturate-100'), /--tw-backdrop-saturate:\s*saturate\(100%\)/);
  // D12/D14: no z-index, no transform and no stylesheet rule for the public marker.
  assert.doesNotMatch(css, /\.eg-tooltip[^{]*\{/, 'Tooltip has no stylesheet: its marker carries no rule');
});

test('UI ships the Switch track, thumb and state utilities without a Switch stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // Track geometry: 36×20 border-box pill on the --spacing scale (AC-05).
  assert.match(rule('.w-9'), /width:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*9\)\s*;/);
  assert.match(rule('.h-5'), /height:\s*var\(--space-5\)\s*;/);
  assert.match(rule('.box-border'), /box-sizing:\s*border-box\s*;/);
  assert.match(rule('.border-border-control'), /border-color:\s*var\(--color-border-control[,)]/);
  assert.match(rule('.bg-surface-0'), /background-color:\s*var\(--color-surface-0[,)]/);
  assert.match(rule(String.raw`.shadow-\[var\(--shadow-well\)\]`), /--tw-shadow:\s*var\(--shadow-well\)\s*;/);
  // Checked: primary gradient, bevel/halo token and the black thumb moved 16px (D4).
  assert.match(
    rule(String.raw`.data-\[state\=checked\]\:bg-\[image\:var\(--gradient-btn-primary\)\][data-state="checked"]`),
    /background-image:\s*var\(--gradient-btn-primary\)\s*;/
  );
  assert.match(
    rule(String.raw`.data-\[state\=checked\]\:shadow-\[var\(--shadow-btn-primary\)\][data-state="checked"]`),
    /--tw-shadow:\s*var\(--shadow-btn-primary\)\s*;/
  );
  assert.match(
    rule(String.raw`.data-\[state\=checked\]\:translate-x-4[data-state="checked"]`),
    /--tw-translate-x:\s*var\(--(?:space-4|spacing-4)\)\s*;\s*translate:/
  );
  assert.match(
    rule(String.raw`.data-\[state\=checked\]\:bg-action-primary-solid-fg[data-state="checked"]`),
    /background-color:\s*var\(--color-action-primary-solid-fg[,)]/
  );
  assert.match(rule(String.raw`.size-3\.5`), /width:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*3\.5\)\s*;/);
  // Thumb travel animates the translate property; reduced motion removes every transition (D6).
  assert.match(
    rule(String.raw`.transition-\[translate\,background-color\]`),
    /transition-property:\s*translate,\s*background-color\s*;/
  );
  assert.match(css, /@property --tw-translate-y\s*\{[^}]*initial-value:\s*0/);
  const reducedMotion = cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(reducedMotion, /\.motion-reduce\\:transition-none\s*\{\s*transition-property:\s*none\s*;/);
  // Focus ring wins over the checked halo through the higher-specificity checked+focus rule (AC-06).
  assert.match(
    rule(
      String.raw`.data-\[state\=checked\]\:focus-visible\:shadow-\[var\(--shadow-focus\)\][data-state="checked"]:focus-visible`
    ),
    /--tw-shadow:\s*var\(--shadow-focus\)\s*;/
  );
  assert.match(rule(String.raw`.disabled\:opacity-45:disabled`), /opacity:\s*45%\s*;/);
  // D11 no stylesheet: the marker carries no rule; legacy .eg-check--switch stays untouched.
  assert.doesNotMatch(css, /\.eg-switch[^{]*\{/, 'Switch has no stylesheet: its marker carries no rule');
  assert.match(css, /\.eg-check--switch input\s*\{/, 'Legacy switch styles remain until an approved migration');
});

test('UI ships the ProgressBar track, fill geometry and motion utilities without a ProgressBar stylesheet', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // Tracks: sm hairline, lg Material well (D5) and the sm-only edge strip.
  assert.match(rule(String.raw`.h-0\.5`), /height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*0\.5\)\s*;/);
  assert.match(rule(String.raw`.h-2\.5`), /height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*2\.5\)\s*;/);
  assert.match(rule(String.raw`.rounded-\[var\(--radius-sm\)\]`), /border-radius:\s*var\(--radius-sm\)\s*;/);
  assert.match(rule('.bg-border-subtle'), /background-color:\s*var\(--color-border-subtle[,)]/);
  assert.match(rule('.bg-surface-0'), /background-color:\s*var\(--color-surface-0[,)]/);
  assert.match(rule('.shadow-well'), /--tw-shadow:\s*inset 0 1px 2px/);
  assert.match(rule('.bg-bg-glass'), /background-color:\s*var\(--color-bg-glass[,)]/);
  assert.match(rule('.inset-x-0'), /inset-inline:/);
  // Fills: brand, gradient with the token bevel instead of the source halo (D6) and the muted series.
  assert.match(rule('.bg-fg-brand-default'), /background-color:\s*var\(--color-fg-brand-default[,)]/);
  assert.match(rule('.bg-fg-muted'), /background-color:\s*var\(--color-fg-muted[,)]/);
  assert.match(
    rule(String.raw`.bg-\[image\:var\(--gradient-progress\)\]`),
    /background-image:\s*var\(--gradient-progress\)\s*;/
  );
  assert.match(rule('.shadow-edge-strong'), /--tw-shadow:\s*inset 0 1px 0/);
  assert.match(rule(String.raw`.rounded-\[inherit\]`), /border-radius:\s*inherit\s*;/);
  // D8 geometry: a static scale utility reading the numeric custom property, left origin and token motion.
  assert.match(
    rule(String.raw`.scale-x-\[var\(--eg-progress-value\)\]`),
    /--tw-scale-x:\s*var\(--eg-progress-value\)\s*;[^}]*scale:\s*var\(--tw-scale-x\)\s+var\(--tw-scale-y\)/
  );
  assert.match(css, /@property --tw-scale-y\s*\{[^}]*initial-value:\s*1/);
  assert.match(rule('.origin-left'), /transform-origin:/);
  assert.match(rule('.transition-transform'), /transition-property:[^;]*\bscale\b/);
  assert.match(rule(String.raw`.duration-\[var\(--duration-base\)\]`), /transition-duration:\s*var\(--duration-base\)/);
  assert.match(rule(String.raw`.ease-\[var\(--ease-out\)\]`), /transition-timing-function:\s*var\(--ease-out\)/);
  const reducedMotion = cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{/);
  assert.match(reducedMotion, /\.motion-reduce\\:transition-none\s*\{\s*transition-property:\s*none\s*;/);
  // D10 no stylesheet: the fill marker carries no rule and .eg-progress keeps only its legacy rules.
  assert.doesNotMatch(css, /\.eg-progress-fill[^{]*\{/);
  const legacy = readFileSync(resolve(root, 'packages/ui/src/styles/legacy/bundle.css'), 'utf8');
  const progressRules = (text) =>
    (text.replace(/\/\*[\s\S]*?\*\//g, '').match(/\.eg-progress(?![\w-])[^{]*\{/g) ?? []).length;
  assert.equal(progressRules(css), progressRules(legacy), 'ProgressBar has no stylesheet: no new eg-progress rule');
});

test('UI ships the Textarea well, sheet and state utilities without a Textarea-specific stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  assert.match(rule('.min-h-30'), /min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*30\)\s*;/);
  assert.match(rule('.min-h-70'), /min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*70\)\s*;/);
  assert.match(rule('.resize-y'), /resize:\s*vertical\s*;/);
  assert.match(rule('.bg-surface-0'), /background-color:\s*var\(--color-surface-0[,)]/);
  assert.match(rule('.bg-primitive-neutral-950'), /background-color:\s*var\(--color-primitive-neutral-950[,)]/);
  assert.match(
    rule(String.raw`.bg-\[image\:var\(--gradient-sheen\)\]`),
    /background-image:\s*var\(--gradient-sheen\)\s*;/
  );
  assert.match(rule(String.raw`.shadow-\[var\(--shadow-well\)\]`), /--tw-shadow:\s*var\(--shadow-well\)\s*;/);
  assert.match(rule('.text-code'), /font-size:\s*var\(--text-code[,)]/);
  assert.match(rule('.ease-out'), /transition-timing-function:\s*var\(--ease-out[,)]/);
  assert.match(
    rule(String.raw`.duration-\[var\(--duration-fast\)\]`),
    /transition-duration:\s*var\(--duration-fast\)\s*;/
  );
  assert.match(rule(String.raw`.disabled\:opacity-45:disabled`), /opacity:\s*45%\s*;/);
  assert.match(
    cssBlock(utilities, /@media \(prefers-reduced-motion: reduce\)\s*\{(?=[^@]*\.motion-reduce\\:transition-none)/),
    /\.motion-reduce\\:transition-none\s*\{\s*transition-property:\s*none\s*;/
  );
  // Invalid wins over the hover, read-only hover and focus border because it is emitted later (D7).
  const at = (selector) => {
    const index = utilities.indexOf(selector);
    assert.ok(index >= 0, `Missing Textarea utility ${selector}`);
    return index;
  };
  const invalid = at(String.raw`.aria-invalid\:border-status-danger[aria-invalid="true"]`);
  const invalidHover = at(String.raw`.aria-invalid\:hover\:border-status-danger[aria-invalid="true"]:hover`);
  const invalidFocus = at(
    String.raw`.aria-invalid\:focus-visible\:border-status-danger[aria-invalid="true"]:focus-visible`
  );
  const readOnlyHover = at(String.raw`.read-only\:hover\:border-border-control:read-only:hover`);
  for (const earlier of [
    at(String.raw`.hover\:border-fg-muted:hover`),
    at(String.raw`.focus-visible\:border-border-brand-strong:focus-visible`)
  ]) {
    assert.ok(earlier < invalid, 'Invalid border must follow hover and focus borders');
  }
  assert.ok(readOnlyHover < invalidHover, 'Invalid hover must follow the read-only hover reset');
  assert.ok(invalid < invalidFocus, 'Focused invalid keeps the danger border');
  // D11 no stylesheet: the marker carries no rule of its own.
  assert.doesNotMatch(css, /\.eg-textarea[^{]*\{/, 'Textarea has no stylesheet: its marker carries no rule');
});

test('UI ships the Input well, state and preset utilities without an Input-specific stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  assert.match(rule('.bg-surface-0'), /background-color:\s*var\(--color-surface-0[,)]/);
  assert.match(rule('.bg-primitive-neutral-950'), /background-color:\s*var\(--color-primitive-neutral-950[,)]/);
  assert.match(rule('.border-border-control'), /border-color:\s*var\(--color-border-control[,)]/);
  assert.match(rule(String.raw`.shadow-\[var\(--shadow-well\)\]`), /--tw-shadow:\s*var\(--shadow-well\)/);
  assert.match(rule('.min-h-11'), /min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*11\)/);
  assert.match(rule('.min-h-9'), /min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*9\)/);
  assert.match(rule('.pl-9'), /padding-left:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*9\)/);
  assert.match(rule('.text-code'), /font-size:\s*var\(--text-code[,)]/);
  assert.match(rule('.font-mono'), /font-family:\s*var\(--font-mono[,)]/);
  assert.match(rule(String.raw`.hover\:border-fg-muted:hover`), /border-color:\s*var\(--color-fg-muted[,)]/);
  assert.match(
    rule(String.raw`.focus-visible\:border-border-brand-strong:focus-visible`),
    /border-color:\s*var\(--color-border-brand-strong[,)]/
  );
  assert.match(
    rule(String.raw`.focus-visible\:shadow-\[var\(--shadow-well\)\,var\(--shadow-ring-brand\)\]:focus-visible`),
    /--tw-shadow:\s*var\(--shadow-well\),\s*var\(--shadow-ring-brand\)/
  );
  assert.match(
    rule(String.raw`.aria-invalid\:border-status-danger[aria-invalid="true"]`),
    /border-color:\s*var\(--color-status-danger[,)]/
  );
  assert.match(rule(String.raw`.has-\[\:disabled\]\:opacity-45:has(:is(:disabled))`), /opacity:\s*45%/);
  assert.match(rule('.ease-out'), /transition-timing-function:\s*var\(--ease-out[,)]/);
  assert.match(rule(String.raw`.duration-\[var\(--duration-fast\)\]`), /transition-duration:\s*var\(--duration-fast\)/);
  // Invalid wins over hover and focus at equal specificity because its rule is emitted later.
  const at = (selector) => utilities.indexOf(selector);
  assert.ok(at(String.raw`.aria-invalid\:border-status-danger`) > at(String.raw`.hover\:border-fg-muted`));
  assert.ok(
    at(String.raw`.aria-invalid\:border-status-danger`) > at(String.raw`.focus-visible\:border-border-brand-strong`)
  );
  // The icon offset must follow the symmetric padding so padding-left survives the cascade.
  assert.ok(at('.pl-9 {') > at('.px-3 {'));
  assert.doesNotMatch(css, /\.eg-input[^{]*\{/, 'Input has no stylesheet: its marker carries no rule (D14)');
});

test('UI ships the ProductMark Material utilities and link focus ring without a stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  assert.match(rule('.size-10'), /width:\s*var\(--space-10\)\s*;[^}]*height:\s*var\(--space-10\)/);
  assert.match(rule('.rounded-md'), /border-radius:\s*var\(--radius-md[,)]/);
  assert.match(
    rule(String.raw`.bg-\(image\:--gradient-btn-primary\)`),
    /background-image:\s*var\(--gradient-btn-primary\)\s*;/
  );
  // The primary bevel and halo resolve from the token theme with Tailwind's composed box-shadow.
  assert.match(rule('.shadow-btn-primary'), /--tw-shadow:\s*inset 0 1px 0 [^;]*rgba\(255, 0, 54, 0\.7\)\)\s*;/);
  assert.match(rule('.shadow-btn-primary'), /box-shadow:\s*var\(--tw-inset-shadow\)/);
  assert.match(rule('.text-action-primary-solid-fg'), /color:\s*var\(--color-action-primary-solid-fg[,)]/);
  assert.match(rule('.font-display'), /font-family:\s*var\(--font-display[,)]/);
  assert.match(rule('.text-heading-small'), /font-size:\s*var\(--text-heading-small[,)]/);
  assert.match(rule('.no-underline'), /text-decoration-line:\s*none\s*;/);
  // Focus always wins in link mode: the ring replaces the material shadow on :focus-visible (D7).
  assert.match(
    rule(String.raw`.focus-visible\:shadow-focus:focus-visible`),
    /--tw-shadow:\s*0 0 0 2px [^;]*0 0 0 4px [^;]*;[^}]*box-shadow:/
  );
  assert.match(rule(String.raw`.focus-visible\:outline-none:focus-visible`), /outline-style:\s*none\s*;/);
  assert.match(css, /@property --tw-shadow\s*\{[^}]*initial-value:\s*0 0 #0000/);
  // D10 no stylesheet: the marker carries no rule of its own.
  assert.doesNotMatch(css, /\.eg-product-mark[^{]*\{/, 'ProductMark has no stylesheet: its marker carries no rule');
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

test('UI ships the approved Label typography recipe without an application Tailwind compiler', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // Base recipe: token typography, foreground color and sans family.
  const base = rule('.text-label-default');
  assert.match(base, /font-size:\s*var\(--text-label-default(?:,\s*14px)?\)\s*;/);
  assert.match(
    base,
    /font-weight:\s*var\(--tw-font-weight,\s*var\(--text-label-default--font-weight(?:,\s*600)?\)\)\s*;/
  );
  assert.match(base, /line-height:\s*var\(--tw-leading,\s*var\(--text-label-default--line-height(?:,\s*1\.2)?\)\)\s*;/);
  assert.match(
    rule('.text-fg-secondary'),
    /color:\s*var\(--color-fg-secondary(?:,\s*var\(--color-primitive-[a-z0-9-]+\))?\)\s*;/
  );
  assert.match(rule('.font-sans'), /font-family:\s*var\(--font-sans/);
  // Choice treatment emits the approved token-backed weight, not a numeric value.
  const choice = rule(String.raw`.font-\[var\(--text-body-default--font-weight\)\]`);
  assert.match(choice, /font-weight:\s*var\(--text-body-default--font-weight\)\s*;/);
  const theme = readFileSync(resolve(root, 'packages/tokens/src/theme.css'), 'utf8');
  for (const token of ['--text-label-default--font-weight', '--text-body-default--font-weight']) {
    assert.ok(theme.includes(`${token}:`), `Choice/base weights must reference the existing token ${token}`);
    assert.doesNotMatch(css, new RegExp(`${token}\\s*:`), `UI must not redefine ${token}`);
  }
});

test('UI ships the static Icon preset, fill and stroke utilities without an application Tailwind compiler', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  for (const [selector, declarations] of [
    ['.inline-block', [/display:\s*inline-block\s*;/]],
    ['.shrink-0', [/flex-shrink:\s*0\s*;/]],
    ['.align-middle', [/vertical-align:\s*middle\s*;/]],
    ['.stroke-current', [/stroke:\s*currentcolor\s*;/i]],
    [String.raw`.stroke-\(length\:--icon-stroke\)`, [/stroke-width:\s*var\(--icon-stroke\)\s*;/]],
    ['.fill-none', [/fill:\s*none\s*;/]],
    ['.fill-current', [/fill:\s*currentcolor\s*;/i]],
    ['.size-4', [/width:\s*var\(--space-4\)\s*;/, /height:\s*var\(--space-4\)\s*;/]],
    [String.raw`.size-\(--icon-size\)`, [/width:\s*var\(--icon-size\)\s*;/, /height:\s*var\(--icon-size\)\s*;/]],
    ['.size-7', [/width:\s*var\(--space-7\)\s*;/, /height:\s*var\(--space-7\)\s*;/]]
  ]) {
    const body = rule(selector);
    for (const declaration of declarations) {
      assert.match(body, declaration, `${selector} must ship ${declaration}`);
    }
  }
  const theme = readFileSync(resolve(root, 'packages/tokens/src/theme.css'), 'utf8');
  for (const [token, value] of [
    ['--icon-size', '20px'],
    ['--icon-stroke', '1.75'],
    ['--space-4', '16px'],
    ['--space-7', '28px']
  ]) {
    assert.match(theme, new RegExp(`${token}:\\s*${value.replace('.', '\\.')};`), `${token} must stay ${value}`);
    assert.doesNotMatch(css, new RegExp(`${token}\\s*:`), `UI must not redefine ${token}`);
  }
});

test('UI preserves Lucide notices for the system icon paths', () => {
  const notices = readFileSync(resolve(root, 'THIRD_PARTY_NOTICES.md'), 'utf8');
  for (const source of ['packages/ui/src/atoms/icon/icon-paths.ts', 'packages/ui/src/atoms/spinner/Spinner.tsx']) {
    assert.ok(notices.includes(source), `Lucide attribution must cover ${source}`);
  }
  assert.match(notices, /loader-circle/, 'Spinner uses the Lucide loader-circle path');
  assert.match(notices, /ISC License/);
  assert.match(notices, /Copyright \(c\) 2026 Lucide Icons and Contributors/);
  assert.match(notices, /Copyright \(c\) 2013-present Cole Bemis/);
});

test('UI Icon renders decorative and labelled svg glyphs on the server', async () => {
  const { Icon } = await import(artifact('ui', ui.exports['.'].import));
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const decorative = renderToString(createElement(Icon, { name: 'plus', id: 'add-icon' }));
  assert.match(decorative, /^<svg /, 'Decorative Icon must render the bare svg');
  for (const text of [
    'id="add-icon"',
    'viewBox="0 0 24 24"',
    'aria-hidden="true"',
    'focusable="false"',
    'stroke-linecap="round"',
    'stroke-linejoin="round"',
    '<path d="M5 12h14"></path><path d="M12 5v14"></path>'
  ]) {
    assert.ok(decorative.includes(text), `Decorative Icon SSR must render ${text}`);
  }
  const classes = new Set((decorative.match(/\bclass="([^"]+)"/)?.[1] ?? '').split(/\s+/));
  for (const marker of [
    'eg-icon',
    'size-(--icon-size)',
    'fill-none',
    'stroke-current',
    'stroke-(length:--icon-stroke)'
  ]) {
    assert.ok(classes.has(marker), `Decorative Icon must keep ${marker}`);
  }
  assert.ok(!classes.has('fill-current'), 'Default Icon must remain stroke-only');
  assert.doesNotMatch(decorative, /role=|aria-label|<title|tabindex=|width=|height=|style=/);
  const labelled = renderToString(createElement(Icon, { name: 'search', label: 'Search', size: 'sm', filled: true }));
  assert.match(labelled, /^<svg [^>]*aria-hidden="true"[^>]*>.*<\/svg><span [^>]*>Search<\/span>$/);
  assert.ok(labelled.includes('size-4') && labelled.includes('fill-current'), 'Labelled Icon keeps its presets');
  assert.match(
    labelled,
    /<span [^>]*style="[^"]*position:absolute/,
    'Radix AccessibleIcon must hide the label visually'
  );
  assert.doesNotMatch(labelled, /role=|<title|label="/);
  assert.doesNotMatch(renderToString(createElement(Icon, { name: 'search', label: '' })), /<span/);
});

test('UI ships the Surface Material recipes as static token utilities', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (scope, selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(scope, new RegExp(`${escaped}\\s*\\{`));
  };
  for (const [selector, declaration] of [
    ['.bg-surface-0', /background-color:\s*var\(--color-surface-0[,)]/],
    ['.bg-surface-3', /background-color:\s*var\(--color-surface-3[,)]/],
    ['.bg-surface-overlay', /background-color:\s*var\(--color-surface-overlay[,)]/],
    [String.raw`.bg-\[image\:var\(--gradient-sheen\)\]`, /background-image:\s*var\(--gradient-sheen\)\s*;/],
    ['.border-border-hairline', /border-color:\s*var\(--color-border-hairline[,)]/],
    ['.border-border-hairline-strong', /border-color:\s*var\(--color-border-hairline-strong[,)]/],
    ['.border-solid', /border-style:\s*solid\s*;/],
    ['.box-border', /box-sizing:\s*border-box\s*;/],
    [String.raw`.shadow-\[var\(--shadow-well\)\]`, /--tw-shadow:\s*var\(--shadow-well\)\s*;/],
    [
      String.raw`.shadow-\[var\(--shadow-edge\)\,var\(--shadow-elev-1\)\]`,
      /--tw-shadow:\s*var\(--shadow-edge\),\s*var\(--shadow-elev-1\)\s*;/
    ],
    [
      String.raw`.shadow-\[var\(--shadow-edge-strong\)\,var\(--shadow-elev-3\)\]`,
      /--tw-shadow:\s*var\(--shadow-edge-strong\),\s*var\(--shadow-elev-3\)\s*;/
    ],
    ['.backdrop-blur-overlay', /--tw-backdrop-blur:\s*blur\(var\(--blur-overlay[,)]/],
    ['.rounded-xl', /border-radius:\s*var\(--radius-xl[,)]/],
    ['.p-6', /padding:\s*var\(--space-6\)\s*;/]
  ]) {
    assert.match(rule(utilities, selector), declaration, `Surface recipe ${selector}`);
  }
  const reduced = cssBlock(utilities, /@media \(prefers-reduced-transparency:\s*reduce\)\s*\{(?=\s*\.\\\[\\@media)/);
  assert.match(
    rule(reduced, String.raw`.\[\@media\(prefers-reduced-transparency\:reduce\)\]\:bg-surface-2`),
    /background-color:\s*var\(--color-surface-2[,)]/
  );
  assert.match(
    rule(reduced, String.raw`.\[\@media\(prefers-reduced-transparency\:reduce\)\]\:backdrop-filter-none`),
    /backdrop-filter:\s*none\s*;/
  );
  const unsupported = cssBlock(utilities, /@supports not \(backdrop-filter:[^{]+\{(?=\s*\.not-supports-)/);
  assert.match(
    rule(unsupported, String.raw`.not-supports-\[backdrop-filter\]\:bg-surface-2`),
    /background-color:\s*var\(--color-surface-2[,)]/
  );
  assert.doesNotMatch(css, /\.eg-surface\s*[,{]/, 'Surface marker must not become a shipped CSS rule (no stylesheet)');
});

test('UI ships the approved Text and Heading title recipes without an application Tailwind compiler', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}\\s*\\{`));
  };
  // The four fluid title recipes resolve to their token size, leading and weight.
  for (const size of ['section', 'hero', 'show', 'display']) {
    const recipe = rule(`.text-title-${size}`);
    assert.match(recipe, new RegExp(`font-size:\\s*var\\(--text-title-${size}(?:,[^;]+)?\\)\\s*;`));
    assert.match(recipe, new RegExp(`line-height:\\s*var\\(--tw-leading,\\s*var\\(--text-title-${size}--line-height`));
    assert.match(
      recipe,
      new RegExp(`font-weight:\\s*var\\(--tw-font-weight,\\s*var\\(--text-title-${size}--font-weight`)
    );
  }
  // Hero canvas glow uses the glyph text-shadow token; other accents reset it.
  assert.match(
    rule(String.raw`.\[text-shadow\:var\(--text-shadow-title-hero\)\]`),
    /text-shadow:\s*var\(--text-shadow-title-hero\)\s*;/
  );
  assert.match(rule(String.raw`.\[text-shadow\:none\]`), /text-shadow:\s*none\s*;/);
  for (const [selector, token] of [
    ['.text-fg-brand-default', '--color-fg-brand-default'],
    ['.text-fg-brand-raised', '--color-fg-brand-raised'],
    ['.text-fg-on-flood', '--color-fg-on-flood']
  ]) {
    assert.match(rule(selector), new RegExp(`color:\\s*var\\(${token}`));
  }
  assert.match(rule('.text-label-eyebrow'), /font-size:\s*var\(--text-label-eyebrow/);
  assert.match(rule('.font-display'), /font-family:\s*var\(--font-display/);
  assert.match(rule('.uppercase'), /text-transform:\s*uppercase\s*;/);
  // The eyebrow diamond is an empty decorative pseudo-element, emitted from static CVA utilities.
  for (const selector of [
    String.raw`.before\:rotate-45`,
    String.raw`.before\:size-2`,
    String.raw`.before\:bg-fg-brand-default`
  ]) {
    assert.ok(utilities.includes(selector), `Packed styles must retain eyebrow diamond utility ${selector}`);
  }
  const theme = readFileSync(resolve(root, 'packages/tokens/src/theme.css'), 'utf8');
  for (const token of ['--text-title-hero', '--text-shadow-title-hero']) {
    assert.ok(theme.includes(`${token}:`), `Title recipes must reference the existing token ${token}`);
    assert.doesNotMatch(css, new RegExp(`${token}\\s*:`), `UI must not redefine ${token}`);
  }
  assert.doesNotMatch(css, /\.eg-(?:text|heading)\s*[,{]/, 'Text/Heading markers must not become shipped CSS rules');
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

test('UI root exports the layout primitives, Surface, Gauge, AspectRatio, Portal and Slot with passive SSR semantics', async () => {
  const exported = await import(artifact('ui', ui.exports['.'].import));
  assert.deepEqual(
    Object.keys(exported).sort(),
    [
      'AspectRatio',
      'Cluster',
      'Divider',
      'Dropzone',
      'Gauge',
      'Heading',
      'Icon',
      'Input',
      'Kbd',
      'Label',
      'Logo',
      'Portal',
      'ProductMark',
      'ProgressBar',
      'Skeleton',
      'Slot',
      'Slottable',
      'Spinner',
      'Stack',
      'StatusDot',
      'Surface',
      'Switch',
      'Text',
      'Textarea',
      'Tooltip',
      'VisuallyHidden',
      'cn',
      'dropzoneVariants',
      'labelVariants',
      'progressBarVariants',
      'statusDotVariants',
      'surfaceVariants',
      'tooltipVariants'
    ],
    'Only approved components and cn are public runtime exports'
  );
  assert.equal(typeof exported.Dropzone, 'function', 'Dropzone must be a plain function with no public ref API');
  assert.equal(typeof exported.dropzoneVariants, 'function', 'Dropzone recipe must be public');
  assert.equal(typeof exported.Gauge, 'function', 'Gauge must be a named root export');
  // Radix forwardRef wraps AspectRatio in a React ref object; its callable contract is proven by SSR below.
  assert.equal(typeof exported.AspectRatio, 'object', 'AspectRatio must be a named forwardRef root export');
  assert.equal(typeof exported.Skeleton, 'function', 'Skeleton must be a named root export');
  assert.equal(typeof exported.Spinner, 'function', 'Spinner must be a plain function component without a ref API');
  assert.equal(typeof exported.Logo, 'function', 'Logo must be a plain function component without a ref API (D8)');
  assert.equal(typeof exported.StatusDot, 'function', 'StatusDot must be a plain function component without a ref API');
  assert.equal(typeof exported.statusDotVariants, 'function', 'StatusDot composition recipe must be a public export');
  assert.equal(typeof exported.Kbd, 'function', 'Kbd must be a plain function component without a ref API (D5)');
  assert.equal(typeof exported.Tooltip, 'function', 'Tooltip must be a plain function component without a ref API');
  assert.equal(typeof exported.tooltipVariants, 'function', 'Tooltip overlay recipe must stay a public export');
  assert.equal(
    typeof exported.ProgressBar,
    'function',
    'ProgressBar must be a plain function component without a ref API'
  );
  assert.equal(typeof exported.progressBarVariants, 'function', 'ProgressBar track recipe must stay a public export');
  assert.equal(
    exported.Textarea?.$$typeof,
    Symbol.for('react.forward_ref'),
    'Textarea must be a forwardRef component whose ref targets the native textarea (D9)'
  );
  assert.equal(
    exported.Input?.$$typeof,
    Symbol.for('react.forward_ref'),
    'Input must be a React 18-compatible forwardRef component targeting the native input (D12)'
  );
  assert.equal(
    typeof exported.ProductMark,
    'function',
    'ProductMark must be a plain function component without a ref API (D9)'
  );
  assert.equal(
    exported.Switch?.$$typeof,
    Symbol.for('react.forward_ref'),
    'Switch must be a forwardRef component whose ref targets the root button (D9)'
  );
  assert.equal(
    exported.VisuallyHidden?.$$typeof,
    Symbol.for('react.forward_ref'),
    'VisuallyHidden must be a forwardRef component with a public ref'
  );
  assert.equal(typeof exported.VisuallyHidden.render, 'function', 'VisuallyHidden must expose its render function');
  assert.equal(typeof exported.Stack, 'function', 'Stack must be a plain function component without a ref API');
  assert.equal(typeof exported.Cluster, 'function', 'Cluster must be a plain function component without a ref API');
  assert.equal(
    exported.Stack.prototype?.render,
    undefined,
    'Stack must not be a forwardRef component (D10: no public ref)'
  );
  assert.equal(typeof exported.Icon, 'function', 'Icon must be a plain function component without a ref API');
  assert.equal(exported.Icon.prototype?.render, undefined, 'Icon must not be a forwardRef component (D6: no ref)');
  assert.equal(
    exported.Surface?.$$typeof,
    Symbol.for('react.forward_ref'),
    'Surface must be a React 18-compatible forwardRef bridge with a public ref'
  );
  assert.equal(typeof exported.surfaceVariants, 'function', 'Surface composition recipe must stay a public export');
  for (const name of ['Text', 'Heading']) {
    assert.equal(typeof exported[name], 'function', `${name} must be a plain function component without a ref API`);
  }
  assert.equal(exported.default, undefined, 'UI must not introduce a default export');
  const declaration = artifact('ui', ui.exports['.'].types);
  const program = ts.createProgram([declaration], { moduleResolution: ts.ModuleResolutionKind.Bundler });
  const checker = program.getTypeChecker();
  const symbol = checker.getSymbolAtLocation(program.getSourceFile(declaration));
  const names = new Set(checker.getExportsOfModule(symbol).map((item) => item.name));
  assert.deepEqual([...names].sort(), [
    'AspectRatio',
    'AspectRatioProps',
    'Cluster',
    'ClusterProps',
    'Divider',
    'DividerOrientation',
    'DividerProps',
    'Dropzone',
    'DropzoneProps',
    'Gauge',
    'GaugeProps',
    'GaugeSize',
    'GaugeState',
    'Heading',
    'HeadingLevel',
    'HeadingProps',
    'Icon',
    'IconName',
    'IconProps',
    'IconSize',
    'Input',
    'InputProps',
    'InputSize',
    'InputType',
    'InputVariant',
    'Kbd',
    'KbdProps',
    'Label',
    'LabelProps',
    'LabelVariant',
    'LayoutAlignItems',
    'LayoutGap',
    'LayoutJustifyContent',
    'Logo',
    'LogoProps',
    'LogoSize',
    'LogoVariant',
    'Portal',
    'PortalProps',
    'ProductMark',
    'ProductMarkProps',
    'ProgressBar',
    'ProgressBarProps',
    'ProgressBarSize',
    'ProgressBarVariant',
    'Skeleton',
    'SkeletonProps',
    'SkeletonSize',
    'SkeletonVariant',
    'Slot',
    'SlotProps',
    'Slottable',
    'Spinner',
    'SpinnerProps',
    'SpinnerSize',
    'Stack',
    'StackProps',
    'StatusDot',
    'StatusDotProps',
    'StatusDotState',
    'Surface',
    'SurfaceElevation',
    'SurfacePadding',
    'SurfaceProps',
    'SurfaceRadius',
    'SurfaceTone',
    'Switch',
    'SwitchProps',
    'Text',
    'TextProps',
    'TextTone',
    'TextVariant',
    'Textarea',
    'TextareaProps',
    'TextareaVariant',
    'TitleVariant',
    'Tooltip',
    'TooltipProps',
    'VisuallyHidden',
    'VisuallyHiddenProps',
    'cn',
    'dropzoneVariants',
    'labelVariants',
    'progressBarVariants',
    'statusDotVariants',
    'surfaceVariants',
    'tooltipVariants'
  ]);
  for (const name of [
    'Dropzone',
    'DropzoneProps',
    'dropzoneVariants',
    'Divider',
    'DividerOrientation',
    'DividerProps',
    'Gauge',
    'GaugeProps',
    'GaugeState',
    'GaugeSize',
    'Icon',
    'IconName',
    'IconProps',
    'IconSize',
    'Kbd',
    'KbdProps',
    'ProgressBar',
    'ProgressBarProps',
    'ProgressBarSize',
    'ProgressBarVariant',
    'progressBarVariants',
    'Textarea',
    'TextareaProps',
    'TextareaVariant',
    'Input',
    'InputProps',
    'InputSize',
    'InputType',
    'InputVariant',
    'ProductMark',
    'ProductMarkProps',
    'AspectRatio',
    'AspectRatioProps',

    'Label',
    'LabelProps',
    'LabelVariant',
    'Logo',
    'LogoProps',
    'LogoSize',
    'LogoVariant',
    'Portal',
    'PortalProps',
    'Skeleton',
    'SkeletonProps',
    'SkeletonSize',
    'SkeletonVariant',
    'Slot',
    'SlotProps',
    'Slottable',
    'Spinner',
    'SpinnerProps',
    'SpinnerSize',
    'Stack',
    'StackProps',
    'StatusDot',
    'StatusDotProps',
    'StatusDotState',
    'statusDotVariants',
    'Cluster',
    'ClusterProps',
    'LayoutAlignItems',
    'LayoutGap',
    'LayoutJustifyContent',
    'Surface',
    'SurfaceElevation',
    'SurfacePadding',
    'SurfaceProps',
    'SurfaceRadius',
    'SurfaceTone',
    'surfaceVariants',
    'Switch',
    'SwitchProps',
    'Tooltip',
    'TooltipProps',
    'tooltipVariants',
    'VisuallyHidden',
    'VisuallyHiddenProps',
    'labelVariants'
  ]) {
    assert.ok(names.has(name), `Missing public declaration export ${name}`);
  }
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const dropzoneHtml = renderToString(
    createElement(exported.Dropzone, { onFiles: () => undefined, accept: 'image/*', multiple: true })
  );
  assert.match(dropzoneHtml, /^<button[^>]*type="button"[^>]*data-state="idle"/);
  assert.match(
    dropzoneHtml,
    /Drag, paste or upload<\/span><\/button><input type="file" hidden="" tabindex="-1" accept="image\/\*" multiple=""\/>$/
  );
  assert.match(dropzoneHtml, /aria-hidden="true"/);
  assert.doesNotMatch(dropzoneHtml, /name=|required=|onFiles=|aria-live=|is-over/);
  assert.equal(renderToString(createElement(exported.Portal, { children: 'Server layer' })), '');
  assert.equal(typeof exported.labelVariants, 'function', 'Label composition recipe must stay a public export');
  const labelHtml = renderToString(
    createElement(exported.Label, { children: 'Email address', htmlFor: 'email', id: 'email-label' })
  );
  for (const text of ['<label', 'for="email"', 'id="email-label"', 'eg-label', 'text-label-default', 'Email address']) {
    assert.ok(labelHtml.includes(text), `Label SSR must render ${text}`);
  }
  const choiceHtml = renderToString(
    createElement(exported.Label, { children: 'Choose plan', htmlFor: 'plan', variant: 'choice' })
  );
  for (const text of ['text-fg-secondary', 'font-[var(--text-body-default--font-weight)]']) {
    assert.ok(choiceHtml.includes(text), `Label choice SSR must render ${text}`);
  }
  assert.doesNotMatch(labelHtml + choiceHtml, /asChild|aria-live=|<button|<input|tabindex=/);
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
  // Stack and Cluster resolve token gaps as static CVA utilities without inline appearance.
  const stacked = renderToString(createElement(exported.Stack, { 'aria-label': 'Sections', gap: 6 }, 'Sections'));
  assert.ok(
    stacked.includes('eg-stack') && stacked.includes('flex-col') && stacked.includes('gap-6'),
    'Stack must carry its marker and default column classes'
  );
  const clustered = renderToString(createElement(exported.Cluster, { 'aria-label': 'Actions', gap: 0 }, 'Actions'));
  assert.ok(
    clustered.includes('eg-cluster') && clustered.includes('flex-wrap') && clustered.includes('gap-0'),
    'Cluster must carry its marker and wrapping row classes'
  );
  assert.doesNotMatch(stacked + clustered, /aria-live=|tabindex=|role=/);
  // Text defaults to a paragraph eyebrow; Heading to a native h2 section title with its level independent of size.
  const eyebrow = renderToString(createElement(exported.Text, null, 'Weekly stream'));
  assert.match(eyebrow, /^<p class="[^"]*eg-text[^"]*text-label-eyebrow[^"]*">Weekly stream<\/p>$/);
  const heading = renderToString(createElement(exported.Heading, { accent: 'ideas' }, 'Big '));
  assert.match(
    heading,
    /^<h2 class="[^"]*eg-heading[^"]*text-title-section[^"]*">Big <span class="[^"]*eg-heading__accent[^"]*">ideas<\/span><\/h2>$/
  );
  const hero = renderToString(
    createElement(exported.Heading, { level: 4, variant: 'hero', accent: '.', accentBreak: false }, 'Talk')
  );
  assert.ok(
    hero.startsWith('<h4') && hero.includes('text-title-hero') && hero.includes('Talk<span'),
    'Level must not resize; no space is injected'
  );
  assert.ok(
    hero.includes('[text-shadow:var(--text-shadow-title-hero)]') && hero.includes('inline'),
    'Canvas hero accent glows inline'
  );
  assert.doesNotMatch(eyebrow + heading + hero, /aria-live=|tabindex=|role=|aria-level=/);
  // Surface resolves its Material recipe as static CVA utilities on a passive div or slotted child.
  const surface = renderToString(createElement(exported.Surface, null, 'Card'));
  for (const text of [
    '<div class="eg-surface',
    'bg-surface-1',
    'bg-[image:var(--gradient-sheen)]',
    'p-6',
    'rounded-xl'
  ]) {
    assert.ok(surface.includes(text), `Surface SSR must render ${text}`);
  }
  const overlay = renderToString(createElement(exported.Surface, { tone: 'overlay' }, 'Glass'));
  assert.ok(overlay.includes('bg-surface-overlay') && overlay.includes('not-supports-[backdrop-filter]:bg-surface-2'));
  const slotted = renderToString(
    createElement(exported.Surface, { asChild: true, tone: 'well' }, createElement('section', { 'aria-label': 'Well' }))
  );
  assert.match(slotted, /^<section aria-label="Well" class="eg-surface [^"]*shadow-\[var\(--shadow-well\)\]/);
  assert.doesNotMatch(surface + overlay + slotted, /aria-live=|tabindex=|role=|style=/);
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
  // Spinner: labelled status region or decorative hidden arc, Icon-scale presets, no ref or state.
  const status = renderToString(createElement(exported.Spinner, { label: 'Loading results', id: 'loading' }));
  assert.match(
    status,
    /^<span id="loading" role="status" class="eg-spinner inline-flex shrink-0 size-\(--icon-size\)">/
  );
  assert.match(
    status,
    /<svg class="[^"]*animate-spin motion-reduce:animate-none" aria-hidden="true" focusable="false"/
  );
  assert.match(status, /<span style="[^"]*clip:rect\(0, 0, 0, 0\)[^"]*">Loading results<\/span><\/span>$/);
  assert.doesNotMatch(status, /aria-hidden="true" class="eg-spinner|aria-live=|tabindex=|data-state/);
  for (const label of [undefined, '', '  ']) {
    const decorative = renderToString(createElement(exported.Spinner, { label }));
    assert.match(decorative, /^<span aria-hidden="true" class="eg-spinner /, 'Unlabelled spinners are decorative');
    assert.doesNotMatch(decorative, /role=|clip:rect/, 'Decorative spinners have no status or hidden text');
  }
  for (const [size, utility] of [
    ['sm', 'size-4'],
    ['md', 'size-(--icon-size)'],
    ['lg', 'size-7']
  ]) {
    const sized = renderToString(createElement(exported.Spinner, { size }));
    assert.ok(sized.includes(`class="eg-spinner inline-flex shrink-0 ${utility}"`), `Spinner ${size} preset`);
  }
  // Logo: named span image or named native link around hidden inline V4 artwork (#62).
  const logo = renderToString(createElement(exported.Logo, { id: 'brand' }));
  assert.match(
    logo,
    /^<span id="brand" role="img" aria-label="egdev" class="eg-logo inline-block shrink-0 leading-none rounded-sm h-8">/
  );
  assert.match(logo, /<svg class="block h-full w-auto" aria-hidden="true" focusable="false" viewBox="0 0 653 258">/);
  assert.equal((logo.match(/<path /g) ?? []).length, 8, 'The wordmark ships its eight V4 paths');
  assert.equal((logo.match(/class="fill-primitive-white"/g) ?? []).length, 1, 'One white name path');
  assert.doesNotMatch(logo, /href=|tabindex=|<title|fill="|style=/);
  const mark = renderToString(createElement(exported.Logo, { variant: 'mark' }));
  assert.match(mark, /viewBox="0 0 638\.45 612\.37"/);
  assert.equal((mark.match(/<polygon /g) ?? []).length, 7, 'The isotype ships its seven V4 polygons');
  assert.equal((mark.match(/class="fill-\(--logo-red\)"/g) ?? []).length, 5);
  assert.equal((mark.match(/class="fill-\(--logo-red-shade\)"/g) ?? []).length, 2);
  const home = renderToString(createElement(exported.Logo, { href: '/', label: 'egdev, home', rel: 'home' }));
  assert.match(
    home,
    /^<a rel="home" href="\/" aria-label="egdev, home" class="eg-logo [^"]*focus-visible:outline-none focus-visible:shadow-focus">/
  );
  assert.doesNotMatch(home, /role=/, 'The link keeps its native role');
  for (const [size, utility] of [
    ['sm', 'h-7'],
    ['md', 'h-8'],
    ['lg', 'h-9']
  ]) {
    const sized = renderToString(createElement(exported.Logo, { size }));
    assert.ok(sized.includes(`rounded-sm ${utility}"`), `Logo ${size} preset`);
  }
  // StatusDot: always decorative, empty, data-state per state; ring vs glow geometry and the live pulse.
  const pulse = 'motion-safe:animate-[eg-status-dot-pulse_2.4s_var(--ease-out)_infinite]';
  assert.equal(
    renderToString(createElement(exported.StatusDot)),
    '<span aria-hidden="true" data-state="stopped" class="eg-status-dot inline-block shrink-0 rounded-full size-2 ring-2 ring-bg-surface bg-primitive-neutral-600"></span>'
  );
  for (const [state, fill] of [
    ['running', 'bg-status-success'],
    ['idle', 'bg-status-info'],
    ['warning', 'bg-status-warning'],
    ['error', 'bg-status-danger'],
    ['stopped', 'bg-primitive-neutral-600']
  ]) {
    const dot = renderToString(createElement(exported.StatusDot, { state, pulse: true }));
    assert.ok(dot.includes(`data-state="${state}"`), `StatusDot ${state} state`);
    assert.ok(dot.includes(`size-2 ring-2 ring-bg-surface ${fill}`), `StatusDot ${state} ringed fill`);
    assert.doesNotMatch(dot, /shadow-glow-hot|animate/, `StatusDot ${state} never glows or pulses`);
  }
  for (const [state, fill] of [
    ['live', 'bg-fg-brand-default'],
    ['standby', 'bg-primitive-white']
  ]) {
    const dot = renderToString(createElement(exported.StatusDot, { state }));
    assert.ok(dot.includes(`size-2.5 shadow-glow-hot ${fill} ${pulse}`), `StatusDot ${state} glows and pulses`);
    assert.doesNotMatch(dot, /ring-/, `StatusDot ${state} has no ring`);
    const still = renderToString(createElement(exported.StatusDot, { state, pulse: false }));
    assert.ok(still.includes(`shadow-glow-hot ${fill}"`), `StatusDot ${state} pulse:false keeps the glow`);
    assert.doesNotMatch(still, /animate/, `StatusDot ${state} pulse:false is static`);
  }
  const placed = renderToString(
    createElement(exported.StatusDot, { state: 'error', id: 'rail-dot', title: 'Error', className: 'absolute top-1' })
  );
  assert.match(
    placed,
    /^<span id="rail-dot" title="Error" aria-hidden="true" data-state="error" class="eg-status-dot /
  );
  assert.ok(placed.endsWith('bg-status-danger absolute top-1"></span>'), 'Consumer layout classes merge last');
  assert.doesNotMatch(placed, /role=|aria-label|tabindex|\spulse=|\sstate=/);
  // Kbd: one native kbd per key; a label hides the glyph and adds hidden spoken text (D2).
  const plainKey = renderToString(createElement(exported.Kbd, { children: 'Esc', id: 'escape-key' }));
  assert.equal(
    plainKey,
    '<kbd id="escape-key" class="eg-kbd inline-block whitespace-nowrap rounded-sm border border-border-subtle px-1.5 py-0.5 font-sans text-label-default text-fg-secondary">Esc</kbd>'
  );
  assert.equal(
    renderToString(createElement(exported.Kbd, { children: 'Ctrl', label: '' })).includes('aria-hidden'),
    false
  );
  const symbolKey = renderToString(createElement(exported.Kbd, { children: '⌘K', label: 'Command K' }));
  assert.match(
    symbolKey,
    /^<kbd class="eg-kbd [^"]*"><span aria-hidden="true">⌘K<\/span><span style="[^"]*clip:rect\(0, 0, 0, 0\)[^"]*">Command K<\/span><\/kbd>$/
  );
  assert.doesNotMatch(symbolKey, /role=|aria-label=|tabindex=|data-state/);
  // Switch: one Radix switch button with its thumb (AC-01). Without a DOM, Radix cannot detect a form
  // ancestor during SSR, so it always emits its hidden bubble input after the button (AC-08).
  const offSwitch = renderToString(createElement(exported.Switch, { 'aria-label': 'Stream alerts', id: 'alerts' }));
  assert.match(offSwitch, /^<button type="button" role="switch" aria-checked="false"[^>]*>/);
  assert.match(offSwitch, /data-state="unchecked"/);
  assert.match(offSwitch, /value="on"/);
  assert.match(offSwitch, /id="alerts"/);
  assert.match(offSwitch, /aria-label="Stream alerts"/);
  assert.match(offSwitch, /class="eg-switch /);
  assert.match(
    offSwitch,
    /<span data-state="unchecked" class="absolute top-0\.5 left-0\.5 size-3\.5 [^"]*"><\/span><\/button><input type="checkbox" aria-hidden="true" tabindex="-1" [^>]*value="on"\/>$/
  );
  assert.doesNotMatch(offSwitch, /disabled=""|data-disabled|checked=""/);
  const onSwitch = renderToString(
    createElement(exported.Switch, { 'aria-label': 'Overlay', defaultChecked: true, disabled: true })
  );
  assert.match(onSwitch, /aria-checked="true"/);
  assert.match(onSwitch, /disabled=""/);
  assert.match(onSwitch, /data-disabled=""/);
  assert.equal(onSwitch.match(/data-state="checked"/g)?.length, 2, 'Root and thumb expose the checked state');
  const formSwitch = renderToString(
    createElement('form', null, createElement(exported.Switch, { 'aria-label': 'Alerts', name: 'alerts' }))
  );
  assert.match(
    formSwitch,
    /<input type="checkbox" aria-hidden="true"[^>]*name="alerts"/,
    'Form switches add Radix bubble input'
  );
  // Tooltip: closed on the server; only the consumer trigger renders, with Radix's closed state (D2, D7).
  const tooltipHtml = renderToString(
    createElement(exported.Tooltip, {
      content: 'Search the catalogue',
      children: createElement('button', { type: 'button', 'aria-label': 'Search' }, '⌕')
    })
  );
  assert.equal(tooltipHtml, '<button type="button" aria-label="Search" data-state="closed">⌕</button>');
  assert.doesNotMatch(tooltipHtml, /role="tooltip"|eg-tooltip|aria-describedby|Search the catalogue/);
  // ProgressBar: Radix progressbar in percent, decorative without a label (D4), fill driven by one custom property (D8).
  const announced = renderToString(
    createElement(exported.ProgressBar, { label: 'Upload progress', value: 45, id: 'upload-progress' })
  );
  for (const text of [
    'role="progressbar"',
    'aria-valuemin="0"',
    'aria-valuemax="100"',
    'aria-valuenow="45"',
    'aria-valuetext="45%"',
    'aria-label="Upload progress"',
    'data-state="loading"',
    'id="upload-progress"',
    'style="--eg-progress-value:0.45"'
  ]) {
    assert.ok(announced.includes(text), `ProgressBar SSR must render ${text}`);
  }
  assert.match(
    announced,
    /^<div [^>]*class="eg-progress [^"]*"[^>]*><div [^>]*class="eg-progress-fill [^"]*"[^>]*><\/div><\/div>$/
  );
  assert.doesNotMatch(announced, /aria-hidden|tabindex=/);
  const decorative = renderToString(createElement(exported.ProgressBar, { value: 140 }));
  assert.ok(decorative.includes('aria-hidden="true"') && decorative.includes('data-state="complete"'));
  assert.ok(decorative.includes('aria-valuenow="100"') && decorative.includes('style="--eg-progress-value:1"'));
  const unknown = renderToString(createElement(exported.ProgressBar, { label: 'Sync', value: Number.NaN }));
  assert.ok(unknown.includes('data-state="indeterminate"') && unknown.includes('style="--eg-progress-value:0"'));
  assert.doesNotMatch(unknown, /aria-valuenow|aria-valuetext/);
  assert.match(
    renderToString(createElement(exported.ProgressBar, { label: 'Goal', value: 74, valueText: '37 of 50' })),
    /aria-valuetext="37 of 50"/
  );
  assert.equal(
    exported.progressBarVariants({ size: 'sm', edge: true }),
    'eg-progress block overflow-hidden h-0.5 absolute inset-x-0 bottom-0 w-auto rounded-none bg-bg-glass pointer-events-none'
  );
  // Textarea: one native textarea root with the public marker first and layout classes last (D9).
  const textareaHtml = renderToString(
    createElement(exported.Textarea, {
      'aria-label': 'Notes',
      'aria-invalid': true,
      rows: 3,
      maxLength: 1250,
      defaultValue: 'Draft',
      className: 'mt-2 mt-4'
    })
  );
  assert.match(textareaHtml, /^<textarea [^>]*class="eg-textarea [^"]* mt-4"[^>]*>Draft<\/textarea>$/);
  for (const text of ['aria-label="Notes"', 'aria-invalid="true"', 'rows="3"', 'maxLength="1250"']) {
    assert.ok(textareaHtml.includes(text), `Textarea SSR must forward ${text}`);
  }
  assert.doesNotMatch(textareaHtml, / mt-2 |variant=|data-state|role=|tabindex=/);
  for (const [variant, utility] of [
    ['default', 'bg-surface-0'],
    ['code', 'bg-primitive-neutral-950'],
    ['prose', 'bg-surface-1']
  ]) {
    const variantHtml = renderToString(createElement(exported.Textarea, { 'aria-label': variant, variant }));
    assert.ok(variantHtml.includes(utility), `Textarea ${variant} must render ${utility}`);
  }
  // Input: span.eg-input root, native input with forwarded attributes, className on the root only (D3).
  const field = renderToString(
    createElement(exported.Input, { 'aria-label': 'Title', name: 'title', placeholder: 'Untitled', className: 'w-64' })
  );
  assert.match(
    field,
    /^<span class="eg-input relative flex items-center [^"]*w-64"><input [^>]*class="box-border w-full [^"]*"[^>]*\/><\/span>$/
  );
  for (const attribute of ['aria-label="Title"', 'name="title"', 'placeholder="Untitled"', 'type="text"']) {
    assert.ok(field.split('<input')[1].includes(attribute), `Input must forward ${attribute} to the native input`);
  }
  assert.ok(!field.split('<input')[0].includes('w-full'), 'Consumer width replaces the root full width');
  for (const utility of [
    'min-h-11',
    'px-3',
    'py-2',
    'text-body-default',
    'bg-surface-0',
    'shadow-[var(--shadow-well)]'
  ]) {
    assert.ok(field.includes(utility), `Input md/default must render ${utility}`);
  }
  assert.doesNotMatch(field, /aria-hidden|data-state|role=|\ssize=/);
  const search = renderToString(
    createElement(exported.Input, {
      'aria-label': 'Search',
      type: 'search',
      size: 'sm',
      variant: 'code',
      icon: createElement('svg', { viewBox: '0 0 16 16' })
    })
  );
  assert.match(search, /^<span class="eg-input [^"]*"><span aria-hidden="true" class="[^"]*absolute left-3[^"]*"><svg/);
  assert.match(search, /type="search"/);
  for (const utility of ['min-h-9', 'pl-9', 'font-mono', 'text-code', 'bg-primitive-neutral-950']) {
    assert.ok(search.includes(utility), `Input sm/code/icon must render ${utility}`);
  }
  for (const utility of ['font-sans', 'bg-surface-0', 'text-label-default', 'font-[var(']) {
    assert.ok(!search.includes(` ${utility}`), `Input code must replace ${utility}`);
  }
  // ProductMark: passive role="img" tile by default, native named link with href; monogram hidden (D5, D6).
  const markRecipe =
    'eg-product-mark inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-(image:--gradient-btn-primary) shadow-btn-primary text-action-primary-solid-fg font-display text-heading-small no-underline';
  assert.equal(
    renderToString(createElement(exported.ProductMark, { monogram: 'M', label: 'Mando', id: 'mando-mark' })),
    `<span id="mando-mark" role="img" aria-label="Mando" class="${markRecipe}"><span aria-hidden="true">M</span></span>`
  );
  assert.equal(
    renderToString(createElement(exported.ProductMark, { monogram: 'M', label: 'Mando home', href: '/' })),
    `<a href="/" aria-label="Mando home" class="${markRecipe} focus-visible:outline-none focus-visible:shadow-focus"><span aria-hidden="true">M</span></a>`
  );
  const twoLetters = renderToString(
    createElement(exported.ProductMark, { monogram: 'Cr', label: 'Criterio', className: 'mb-1 mb-3' })
  );
  assert.ok(twoLetters.includes(`class="${markRecipe} mb-3"`), 'Layout className merges last through cn()');
  assert.doesNotMatch(twoLetters, /\s(?:monogram|label|href|tabindex)=|data-state|hover:|transition/);
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
    assert.match(
      shape,
      /animate-pulse motion-reduce:animate-none/,
      `Skeleton ${variant}/${size} must pulse by default with the reduced-motion opt-out`
    );
    assert.doesNotMatch(shape, /aria-live|aria-busy|role=|tabindex|data-state|transition/);
    assert.doesNotMatch(shape, /\spulse=/, 'The pulse switch must never reach the DOM');
  }
  const skeletonStatic = renderToString(
    createElement(exported.Skeleton, { variant: 'line', size: 'md', pulse: false })
  );
  assert.ok(skeletonStatic.includes('eg-skeleton'), 'pulse:false must keep the stable root class');
  assert.doesNotMatch(skeletonStatic, /animate-/, 'pulse:false must render fully static');
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
