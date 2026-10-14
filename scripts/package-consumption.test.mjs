import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import manifest from '../package.json' with { type: 'json' };

// Build first. Network installs are isolated; allow up to six minutes per React version.
// No workspace links, source aliases, skipped declaration checks, or permanent dependencies.
const root = fileURLToPath(new URL('../', import.meta.url));
const versions = {
  '18.3.1': ['18.3.12', '18.3.1'],
  '19.3.0': [manifest.devDependencies['@types/react'], manifest.devDependencies['@types/react-dom']]
};
function run(cwd, command, args, timeout) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(
    result.status,
    0,
    `${command} ${args.join(' ')} failed (${result.error ?? result.signal}):\n${result.stdout}\n${result.stderr}`
  );
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
  return result.stdout.trim();
}

const consumer = `
import { createElement, createRef } from 'react';
import { Surface, IconButton, Tabs } from '@egdev/ui';
import type { SurfaceProps, IconButtonProps, TabsProps, TabItem } from '@egdev/ui';
export const surfaceRef = createRef<HTMLDivElement>();
export const buttonRef = createRef<HTMLButtonElement>();
const icon = createElement('svg', { viewBox: '0 0 24 24' }, createElement('path', { d: 'M1 1h2v2H1z' }));
const items: TabItem[] = [
  { value: 'alpha', label: 'Alpha', content: 'Alpha panel' },
  { value: 'beta', label: 'Beta', content: 'Beta panel' },
  { value: 'locked', label: 'Locked', disabled: true, content: 'Locked panel' }
];
export function App({ onClick, disabled = false }: { onClick?: () => void; disabled?: boolean } = {}) {
  const surface: SurfaceProps = { tone: 'glass', padding: 'sm', ref: surfaceRef };
  const button: IconButtonProps = { label: 'Save', icon, shape: 'square', ref: buttonRef, onClick, disabled };
  const tabs: TabsProps = { label: 'Workspace', items, defaultValue: 'alpha', variant: 'segmented' };
  return createElement(Surface, surface, createElement(IconButton, button), createElement(Tabs, tabs));
}
// @ts-expect-error Accessible label is required, even when an SVG icon is provided.
const missingLabel: IconButtonProps = { icon };
// @ts-expect-error An accessible label does not replace the required icon.
const missingIcon: IconButtonProps = { label: 'Save' };
// @ts-expect-error Public variants reject arbitrary strings.
const invalidTone: SurfaceProps = { tone: 'unknown' };
// @ts-expect-error Tabs must have an accessible list name.
const unnamedTabs: TabsProps = { items };
`;

const entries = `
import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const entry = fileURLToPath(import.meta.resolve('@egdev/ui'));
assert.ok(!realpathSync(entry).startsWith(${JSON.stringify(root)}), 'UI must be installed outside the workspace');
const ui = JSON.parse(readFileSync(resolve(dirname(entry), '../package.json'), 'utf8'));
assert.equal(ui.exports['.'].import, './dist/index.js');
assert.equal(ui.exports['.'].types, './dist/index.d.ts');
assert.equal(ui.types, ui.exports['.'].types);
assert.ok(readFileSync(resolve(dirname(entry), 'index.d.ts'), 'utf8').trim(), 'Public declaration must be reachable');
assert.equal(ui.exports['./styles.css'], './dist/styles.css');
const styles = fileURLToPath(import.meta.resolve('@egdev/ui/styles.css'));
assert.ok(!realpathSync(styles).startsWith(${JSON.stringify(root)}), 'CSS must resolve outside the workspace');
const shippedStyles = readFileSync(styles, 'utf8');
assert.doesNotMatch(shippedStyles, /@(import|reference|source|tailwind|theme|custom-variant|apply)\\b/, 'Packed CSS must be ready for native consumption');
assert.ok(shippedStyles.includes('.eg-surface'), 'Packed styles must retain public BEM classes');
const local = createRequire(import.meta.url);
const fromUI = createRequire(entry);
for (const name of ['react', 'react-dom']) {
  assert.equal(realpathSync(local.resolve(name)), realpathSync(fromUI.resolve(name)), name + ' must have one physical instance');
}
assert.ok(ts.preProcessFile(readFileSync(entry, 'utf8')).importedFiles.some(({ fileName }) => /^react($|\\/)/.test(fileName)), 'UI must import external React');
const map = JSON.parse(readFileSync(entry + '.map', 'utf8'));
assert.ok(map.sources.length > 0, 'React exclusion needs a nonempty library source map');
for (const source of map.sources) {
  assert.doesNotMatch(source, /(?:^|\\/)(?:react|react-dom)\\/(?:cjs|index|jsx)/, 'UI must not bundle React implementation');
}
console.log(JSON.stringify({ ui: ui.version, react: (await import('react')).version, dedup: ['react', 'react-dom'], externalReact: true }));
`;

const ssr = `
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './consumer.ts';
const html = renderToString(createElement(App));
for (const text of ['eg-surface', 'eg-icon-btn', '<svg', 'Save', 'role="tablist"', 'aria-label="Workspace"', 'role="tabpanel"', 'Alpha panel']) {
  assert.ok(html.includes(text), 'SSR must render ' + text);
}
console.log(JSON.stringify({ ssr: ['Surface', 'IconButton', 'Tabs', 'SVG', 'TabItem.content'], bytes: html.length }));
`;

const csr = `
import assert from 'node:assert/strict';
import { JSDOM } from ${JSON.stringify(import.meta.resolve('jsdom'))};
const stage = (csrStage) => console.log(JSON.stringify({ csrStage }));
stage('setup:start');
const dom = new JSDOM('<div id="app"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent', 'MutationObserver']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
}
for (const name of ['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame']) {
  globalThis[name] = dom.window[name].bind(dom.window);
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
stage('setup:complete');
const { act, createElement } = await import('react');
const { createRoot } = await import('react-dom/client');
const { App, surfaceRef, buttonRef } = await import('./consumer.ts');
stage('imports:complete');
const root = createRoot(document.getElementById('app'));
let clicks = 0;
try {
  stage('mount:start');
  await act(async () => root.render(createElement(App, { onClick: () => clicks++ })));
  stage('mount:complete');
  const button = document.querySelector('button:not([role="tab"])');
  stage('click:start');
  await act(async () => button.click());
  assert.equal(clicks, 1, 'IconButton must dispatch clicks');
  stage('click:complete');
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  assert.equal(tabs[0].getAttribute('aria-selected'), 'true');
  stage('tabs:select:start');
  await act(async () => tabs[1].dispatchEvent(new dom.window.MouseEvent('mousedown', { bubbles: true, button: 0 })));
  assert.equal(tabs[1].getAttribute('aria-selected'), 'true', 'Tabs must change selection');
  assert.equal(document.querySelector('[role="tabpanel"][data-state="active"]').textContent, 'Beta panel');
  stage('tabs:select:complete');
  stage('tabs:disabled:start');
  await act(async () => tabs[2].dispatchEvent(new dom.window.MouseEvent('mousedown', { bubbles: true, button: 0 })));
  assert.equal(tabs[1].getAttribute('aria-selected'), 'true', 'Disabled tabs must not change selection');
  stage('tabs:disabled:complete');
  stage('disabled:render:start');
  await act(async () => root.render(createElement(App, { onClick: () => clicks++, disabled: true })));
  await act(async () => button.click());
  assert.equal(clicks, 1, 'Disabled IconButton must not dispatch clicks');
  stage('disabled:complete');
  stage('refs:start');
  // ComponentProps<'div'/'button'> publicly accepts refs; verify that promise on both React majors.
  assert.equal(surfaceRef.current, document.querySelector('.eg-surface'), 'Surface must attach its public ref');
  assert.equal(buttonRef.current, button, 'IconButton must attach its public ref');
  stage('refs:complete');
  console.log(JSON.stringify({ csr: ['click', 'disabled', 'Tabs selection', 'panels', 'refs'] }));
} finally {
  stage('unmount:start');
  await act(async () => root.unmount());
  stage('unmount:complete');
  dom.window.close();
  stage('dom:closed');
}
`;

const typographyNames = [
  'display-hero',
  'display-show',
  'display-pro',
  'heading-section',
  'heading-small',
  'body-large',
  'body-default',
  'body-muted',
  'label-default',
  'label-eyebrow',
  'meta',
  'cta-label',
  'code'
];
const spacingClasses = [
  'p-0',
  'p-1',
  'p-2',
  'p-3',
  'p-4',
  'p-5',
  'p-6',
  'p-7',
  'p-8',
  'p-10',
  'p-12',
  'p-14',
  'p-16',
  'p-20',
  'p-24',
  'p-0.5',
  'p-9'
];
// Test-only class list: it drives @source scanning and carries no production values.
const tailwindClasses = [
  'text-fg-secondary',
  'bg-bg-surface',
  'rounded-xl',
  'shadow-edge',
  'font-display',
  ...typographyNames.map((name) => `text-${name}`),
  ...spacingClasses
].join(' ');

const css = `
import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { build, version } from 'vite';
import tailwindcss from '@tailwindcss/vite';
const instances = { react: new Set(), 'react-dom': new Set() };
const result = await build({ configFile: false, logLevel: 'error', build: { cssMinify: false }, plugins: [{
  name: 'consumer-react-instances',
  generateBundle() {
    for (const id of this.getModuleIds()) {
      const match = id.replaceAll('\\\\', '/').match(/^(.*\\/node_modules\\/(react|react-dom))\\//);
      if (match) instances[match[2]].add(realpathSync(match[1]));
    }
  }
}] });
const assets = [result].flat().flatMap((bundle) => bundle.output).filter((asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'));
const emitted = assets.map((asset) => String(asset.source)).join('\\n');
assert.ok(assets.length > 0, 'Vite must emit consumer CSS');
assert.ok(!emitted.includes('@theme'), 'Native consumption must not need Tailwind to interpret @theme');
for (const selector of ['.eg-surface', '.eg-icon-btn--square', '.eg-tabs__item']) assert.ok(emitted.includes(selector), 'Missing shipped selector ' + selector);
const shipped = readFileSync(new URL('./node_modules/@egdev/tokens/dist/tokens.css', import.meta.url), 'utf8');
const names = shipped
  .split(String.fromCharCode(10))
  .flatMap((line) => {
    const at = line.indexOf('--');
    if (at === -1) return [];
    const name = line.slice(at).split(':')[0].trim();
    return name.startsWith('--') ? [name] : [];
  });
const typography = ${JSON.stringify(typographyNames)};
assert.equal(names.length, 236, 'Packed native artifact must expose 236 variables');
for (const token of names) assert.ok(emitted.includes(token + ':'), 'Missing shipped token definition ' + token);
for (const token of ['--color-surface-1', '--radius-md', '--shadow-edge']) assert.ok(emitted.includes('var(' + token + ')'), 'UI must consume shipped token ' + token);
for (const name of typography) {
  for (const field of ['--line-height', '--font-weight', '--letter-spacing']) assert.ok(emitted.includes('--text-' + name + field + ':'), 'Native artifact must expose --text-' + name + field);
}
assert.ok(emitted.includes('--effect-grid-size: 40px'), 'Native artifact must emit unused effect spacing');
assert.ok(emitted.includes('--spacing-16: var(--space-16)'), 'Native artifact must emit unused spacing aliases');
for (const [name, paths] of Object.entries(instances)) assert.equal(paths.size, 1, 'Consumer bundle must contain one physical ' + name);
const tailwind = await build({ configFile: false, logLevel: 'error', plugins: [tailwindcss({ optimize: false })], build: { cssMinify: false, emptyOutDir: true, outDir: 'dist-tw', rolldownOptions: { input: 'tailwind.css', output: { assetFileNames: 'tailwind.css' } } } });
const twAssets = [tailwind].flat().flatMap((bundle) => bundle.output).filter((asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'));
const twCss = twAssets.map((asset) => String(asset.source)).join(' ');
assert.ok(twAssets.length > 0, 'Tailwind build must emit CSS');
for (const selector of ['.eg-surface', '.eg-icon-btn--square', '.eg-tabs__item']) {
  assert.ok(twCss.includes(selector), 'Tailwind consumer must retain shipped UI selector ' + selector);
}
for (const selector of ['.text-fg-secondary', '.bg-bg-surface', '.rounded-xl', '.shadow-edge', '.font-display']) assert.ok(twCss.includes(selector), 'Missing generated utility ' + selector);
for (const name of typography) {
  assert.ok(twCss.includes('.text-' + name), 'Tailwind must emit the text-' + name + ' utility');
  assert.ok(twCss.includes('--tw-leading, var(--text-' + name + '--line-height)'), 'text-' + name + ' must carry line-height');
  assert.ok(twCss.includes('--tw-font-weight, var(--text-' + name + '--font-weight)'), 'text-' + name + ' must carry font-weight');
  assert.ok(twCss.includes('--tw-tracking, var(--text-' + name + '--letter-spacing)'), 'text-' + name + ' must carry letter-spacing');
}
assert.ok(twCss.includes('padding: var(--space-4)'), 'Tailwind must bind p-4 to --space-4');
assert.ok(twCss.includes('padding: var(--space-16)'), 'Tailwind must bind p-16 to --space-16');
assert.ok(twCss.includes('calc(var(--space-1) * 0.5)'), 'Fractional spacing must derive from --space-1');
assert.ok(twCss.includes('calc(var(--space-1) * 9)'), 'Unlisted spacing steps must derive from the base --spacing token');
assert.ok(twCss.includes('--color-ambient-bg:'), 'Static theme must emit unused variables');
assert.ok(!twCss.includes('--color-red-500'), 'Color reset must remove the default palette');
assert.ok(twCss.includes('@layer'), 'Tailwind cascade layers must be present');
console.log(JSON.stringify({ vite: version, cssAssets: assets.length, cssBytes: emitted.length, nativeTokens: names.length, tailwindAssets: twAssets.length, bundleInstances: { react: 1, 'react-dom': 1 } }));
`;

for (const [react, [types, domTypes]] of Object.entries(versions)) {
  test(`packed UI consumer with React ${react}`, { timeout: 360_000 }, async (context) => {
    const temporary = mkdtempSync(join(tmpdir(), 'egdev-package-consumption-'));
    try {
      const tarballs = {};
      for (const name of ['tokens', 'ui']) {
        run(join(root, 'packages', name), 'pnpm', ['pack', '--pack-destination', temporary], 30_000);
        const file = readdirSync(temporary).find(
          (entry) => entry.startsWith(`egdev-${name}-`) && entry.endsWith('.tgz')
        );
        assert.ok(file, `pnpm pack must produce the ${name} tarball`);
        tarballs[name] = `file:${join(temporary, file)}`;
      }
      const fixture = join(temporary, 'consumer');
      mkdirSync(fixture);
      const write = (name, content) => writeFileSync(join(fixture, name), content);
      const writeJSON = (name, content) => write(name, JSON.stringify(content));
      writeJSON('package.json', {
        private: true,
        type: 'module',
        dependencies: {
          '@egdev/ui': tarballs.ui,
          '@egdev/tokens': tarballs.tokens,
          '@tailwindcss/vite': manifest.devDependencies['@tailwindcss/vite'],
          tailwindcss: manifest.devDependencies.tailwindcss,
          react,
          'react-dom': react,
          '@types/react': types,
          '@types/react-dom': domTypes,
          typescript: manifest.devDependencies.typescript,
          vite: manifest.devDependencies.vite
        }
      });
      write('pnpm-workspace.yaml', `overrides:\n  '@egdev/tokens': ${JSON.stringify(tarballs.tokens)}\n`);
      writeJSON('tsconfig.json', {
        compilerOptions: {
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          types: ['react', 'react-dom']
        },
        include: ['consumer.ts']
      });
      write('consumer.ts', consumer);
      for (const [name, source] of Object.entries({ entries, ssr, csr, css })) {
        write(`${name}.mjs`, source);
      }
      write('index.html', '<div id="app"></div><script type="module" src="/main.ts"></script>');
      write('tailwind.classes.html', `<div class="${tailwindClasses}"></div>`);
      write(
        'tailwind.css',
        '@import "tailwindcss";\n@import "@egdev/tokens/theme.css";\n@import "@egdev/ui/styles.css";\n@source "./tailwind.classes.html";\n'
      );
      write(
        'main.ts',
        `import '@egdev/tokens/tokens.css';\nimport '@egdev/ui/styles.css';\nimport { createElement } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport { App } from './consumer';\ncreateRoot(document.getElementById('app')!).render(createElement(App));\n`
      );
      const install = ['install', '--ignore-scripts', '--no-frozen-lockfile', '--strict-peer-dependencies'];
      run(fixture, 'pnpm', install, 120_000);
      const timeouts = { entries: 20_000, types: 30_000, ssr: 20_000, csr: 30_000, css: 60_000 };
      for (const [name, timeout] of Object.entries(timeouts)) {
        await context.test(name, () => {
          const output =
            name === 'types'
              ? run(fixture, 'pnpm', ['exec', 'tsc', '-p', 'tsconfig.json'], timeout)
              : run(fixture, process.execPath, [`${name}.mjs`], timeout);
          context.diagnostic(output || 'Strict public types compiled, including negative prop checks');
        });
      }
    } finally {
      // Only remove the unique directory owned by this invocation, including on failure.
      rmSync(temporary, { recursive: true, force: true });
    }
  });
}
