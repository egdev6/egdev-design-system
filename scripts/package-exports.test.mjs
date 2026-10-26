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
  // Pulse (Skeleton) and spin (Spinner, #69) are the only approved animation utilities; transitions
  // belong to Slider (shadow) and the static Gauge reset, never the Skeleton.
  assert.doesNotMatch(
    utilityLayer,
    /\.animate-(?!pulse\b|spin\b|none\b)\w/,
    'Only the approved pulse and spin animation utilities may ship'
  );
  assert.doesNotMatch(
    utilityLayer,
    /\.transition-(?!(?:none|shadow)\b)\w/,
    'Only the approved Slider shadow transition may ship'
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

test('UI ships the Slider well, range and raised thumb utilities without a Slider-specific stylesheet rule', () => {
  const css = readFileSync(artifact('ui', ui.exports['./styles.css']), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const utilities = cssBlock(css, /@layer utilities\s*\{/);
  const rule = (selector) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return cssBlock(utilities, new RegExp(`${escaped}(?::[a-z-]+|\\[data-disabled\\])?\\s*\\{`));
  };
  assert.match(rule('.touch-none'), /touch-action:\s*none\s*;/);
  assert.match(rule('.select-none'), /user-select:\s*none\s*;/);
  assert.match(rule('.h-6'), /height:\s*var\(--space-6\)\s*;/);
  assert.match(rule('.h-1'), /height:\s*var\(--space-1\)\s*;/);
  assert.match(rule('.size-4'), /width:\s*var\(--space-4\)\s*;\s*height:\s*var\(--space-4\)\s*;/);
  assert.match(rule('.grow'), /flex-grow:\s*1\s*;/);
  assert.match(rule(String.raw`.data-\[disabled\]\:opacity-45`), /opacity:\s*45%\s*;/);
  assert.match(rule(String.raw`.data-\[disabled\]\:pointer-events-none`), /pointer-events:\s*none\s*;/);
  assert.match(rule('.bg-surface-0'), /background-color:\s*var\(--color-surface-0[,)]/);
  assert.match(rule('.bg-fg-brand-default'), /background-color:\s*var\(--color-fg-brand-default[,)]/);
  assert.match(rule('.bg-fg-default'), /background-color:\s*var\(--color-fg-default[,)]/);
  // Material shadows stay token references instead of copied literal values.
  for (const token of ['shadow-well', 'shadow-elev-1']) {
    assert.match(rule(`.shadow-\\[var\\(--${token}\\)\\]`), new RegExp(`--tw-shadow:\\s*var\\(--${token}\\)\\s*;`));
  }
  assert.match(
    rule(String.raw`.focus-visible\:shadow-\[var\(--shadow-focus\)\]`),
    /--tw-shadow:\s*var\(--shadow-focus\)\s*;/
  );
  assert.match(rule('.transition-shadow'), /transition-property:\s*box-shadow\s*;/);
  assert.match(
    rule(String.raw`.duration-\[var\(--duration-fast\)\]`),
    /transition-duration:\s*var\(--duration-fast\)\s*;/
  );
  assert.match(rule(String.raw`.ease-\[var\(--ease-out\)\]`), /transition-timing-function:\s*var\(--ease-out\)\s*;/);
  assert.match(rule('.cursor-grab'), /cursor:\s*grab\s*;/);
  assert.match(rule(String.raw`.active\:cursor-grabbing`), /cursor:\s*grabbing\s*;/);
  // The 44px touch target applies only on coarse pointers (D9); reduced motion drops the transition.
  assert.match(
    utilities,
    /@media \(pointer: coarse\)\s*\{\s*\.pointer-coarse\\:h-11\s*\{\s*height:\s*calc\(var\(--space-1\)\s*\*\s*11\)\s*;/
  );
  assert.match(
    utilities,
    /@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.motion-reduce\\:transition-none\s*\{\s*transition-property:\s*none\s*;/
  );
  assert.match(css, /@property --tw-shadow\s*\{[^}]*initial-value:\s*0 0 #0000/);
  // Scan the real static CVA calls as well: every production part class must ship, not just a sample.
  const source = ts.createSourceFile(
    'types.ts',
    readFileSync(resolve(root, 'packages/ui/src/atoms/slider/types.ts'), 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  let parts = 0;
  const visit = (node) => {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'cva') {
      const base = node.arguments[0];
      assert.ok(base && ts.isStringLiteral(base), 'Slider CVA bases must be static strings');
      parts++;
      for (const name of base.text.split(/\s+/).filter((name) => name !== 'eg-slider')) {
        const selector = `.${name.replace(/([^a-zA-Z0-9_-])/g, '\\$1')}`;
        assert.ok(utilities.includes(selector), `Missing Slider CVA utility ${name}`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  assert.equal(parts, 4, 'Root, track, range and thumb must all be scanned');
  // D11 no stylesheet: the marker carries no rule of its own.
  assert.doesNotMatch(css, /\.eg-slider[^{]*\{/, 'Slider has no stylesheet: its marker carries no rule');
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
      'Gauge',
      'Kbd',
      'Label',
      'Portal',
      'Skeleton',
      'Slider',
      'Slot',
      'Slottable',
      'Spinner',
      'Stack',
      'Surface',
      'VisuallyHidden',
      'cn',
      'labelVariants',
      'sliderVariants',
      'surfaceVariants'
    ],
    'Only approved components and cn are public runtime exports'
  );
  assert.equal(typeof exported.Gauge, 'function', 'Gauge must be a named root export');
  // Radix forwardRef wraps AspectRatio in a React ref object; its callable contract is proven by SSR below.
  assert.equal(typeof exported.AspectRatio, 'object', 'AspectRatio must be a named forwardRef root export');
  assert.equal(typeof exported.Skeleton, 'function', 'Skeleton must be a named root export');
  assert.equal(typeof exported.Spinner, 'function', 'Spinner must be a plain function component without a ref API');
  assert.equal(typeof exported.Kbd, 'function', 'Kbd must be a plain function component without a ref API (D5)');
  assert.equal(typeof exported.Slider, 'function', 'Slider must be a plain function component without a ref API');
  assert.equal(typeof exported.sliderVariants, 'function', 'Slider root recipe is exported for Field parity');
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
  assert.equal(
    exported.Surface?.$$typeof,
    Symbol.for('react.forward_ref'),
    'Surface must be a React 18-compatible forwardRef bridge with a public ref'
  );
  assert.equal(typeof exported.surfaceVariants, 'function', 'Surface composition recipe must stay a public export');
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
    'Gauge',
    'GaugeProps',
    'GaugeSize',
    'GaugeState',
    'Kbd',
    'KbdProps',
    'Label',
    'LabelProps',
    'LabelVariant',
    'LayoutAlignItems',
    'LayoutGap',
    'LayoutJustifyContent',
    'Portal',
    'PortalProps',
    'Skeleton',
    'SkeletonProps',
    'SkeletonSize',
    'SkeletonVariant',
    'Slider',
    'SliderProps',
    'Slot',
    'SlotProps',
    'Slottable',
    'Spinner',
    'SpinnerProps',
    'SpinnerSize',
    'Stack',
    'StackProps',
    'Surface',
    'SurfaceElevation',
    'SurfacePadding',
    'SurfaceProps',
    'SurfaceRadius',
    'SurfaceTone',
    'VisuallyHidden',
    'VisuallyHiddenProps',
    'cn',
    'labelVariants',
    'sliderVariants',
    'surfaceVariants'
  ]);
  for (const name of [
    'Divider',
    'DividerOrientation',
    'DividerProps',
    'Gauge',
    'GaugeProps',
    'GaugeState',
    'GaugeSize',
    'Kbd',
    'KbdProps',
    'Slider',
    'SliderProps',
    'sliderVariants',
    'AspectRatio',
    'AspectRatioProps',

    'Label',
    'LabelProps',
    'LabelVariant',
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
    'VisuallyHidden',
    'VisuallyHiddenProps',
    'labelVariants'
  ]) {
    assert.ok(names.has(name), `Missing public declaration export ${name}`);
  }
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
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
  // Slider: Radix markup with the scalar API; the thumb is measured, so it stays hidden until hydration.
  const slider = renderToString(
    createElement(exported.Slider, {
      label: 'Volume',
      defaultValue: 40,
      valueText: (value) => `${value}%`,
      'aria-describedby': 'volume-hint',
      id: 'volume',
      className: 'w-64'
    })
  );
  assert.match(
    slider,
    /^<span dir="ltr" data-orientation="horizontal" aria-disabled="false" id="volume" class="eg-slider [^"]* w-64"/
  );
  assert.ok(!slider.includes(' w-full'), 'Consumer width replaces the default full width');
  assert.match(slider, /class="absolute h-full bg-fg-brand-default" style="left:0%;right:60%"/);
  assert.match(
    slider,
    /<span role="slider" aria-label="Volume" aria-valuemin="0" aria-valuemax="100" aria-orientation="horizontal"[^>]* tabindex="0" aria-valuetext="40%" aria-describedby="volume-hint" class="block size-4 /
  );
  assert.equal((slider.match(/aria-describedby=/g) ?? []).length, 1, 'aria-describedby is routed to the thumb only');
  assert.doesNotMatch(slider, /data-state|data-disabled/);
  const disabledSlider = renderToString(createElement(exported.Slider, { label: 'Volume', disabled: true }));
  assert.match(disabledSlider, /aria-disabled="true" data-disabled=""/);
  assert.doesNotMatch(disabledSlider, /tabindex=/, 'A disabled thumb is never a Tab stop');
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
