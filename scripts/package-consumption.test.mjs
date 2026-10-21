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
import { Gauge, Slot, Slottable } from '@egdev/ui';
import type { GaugeProps, GaugeState, GaugeSize, SlotProps } from '@egdev/ui';
const slotProps: SlotProps = { 'aria-label': 'Composed documentation' };
export function SlotSample() {
  return createElement(Slot, slotProps,
    createElement('span', { 'aria-hidden': true }, '→'),
    createElement(Slottable, null, createElement('a', { href: '#composition' }, 'Documentation')));
}
export const slotReference = createElement(Slot, { ref: createRef<HTMLElement>() },
  createElement('a', { ref: createRef<HTMLAnchorElement>(), href: '#composition' }, 'Reference'));
// @ts-expect-error Slot itself does not expose an asChild prop.
const unsupportedSlotComposition: SlotProps = { asChild: true };
const unsupportedGaugeRef = createRef<HTMLDivElement>();
const icon = createElement('svg', { viewBox: '0 0 24 24' }, createElement('path', { d: 'M1 1h2v2H1z' }));
const gaugeState: GaugeState = 'warning';
const gaugeSize: GaugeSize = 'sm';
export const gaugeDefaults: GaugeProps = { label: 'Capacity', value: 42.5 };
export const gaugeWarning: GaugeProps = {
  label: 'Warning capacity', value: 42.5, state: gaugeState, stateText: 'Review capacity',
  valueText: '42.5 capacity units', size: 64.5, center: 0
};
export function GaugeSamples({ value = 42.5 }: { value?: number }) {
  return createElement('section', { 'aria-label': 'Measurements' },
    createElement(Gauge, { ...gaugeDefaults, value }),
    createElement(Gauge, gaugeWarning),
    createElement(Gauge, { label: 'Small capacity', value: 25, size: gaugeSize, center: icon }),
    createElement(Gauge, { label: 'Named capacity', value: 25, center: 'OK' })
  );
}
export function App({ gaugeValue }: { gaugeValue?: number } = {}) {
  // Intrinsic controls are consumer harness elements, not additional SDK components.
  return createElement('main', null,
    createElement('button', { type: 'button' }, 'Before measurements'),
    createElement(GaugeSamples, { value: gaugeValue }),
    createElement('button', { type: 'button' }, 'After measurements'));
}
// @ts-expect-error A passive measurement still requires an accessible name.
const unnamedGauge: GaugeProps = { value: 42 };
// @ts-expect-error A label does not replace the controlled measurement.
const missingGaugeValue: GaugeProps = { label: 'Capacity' };
// @ts-expect-error Non-normal conditions require visible stateText.
const unexplainedWarning: GaugeProps = { label: 'Capacity', value: 42, state: 'warning' };
// @ts-expect-error Critical conditions also require visible stateText.
const unexplainedCritical: GaugeProps = { label: 'Capacity', value: 42, state: 'critical' };
// @ts-expect-error Muted is a condition, not disabled semantics, and requires stateText.
const unexplainedMuted: GaugeProps = { label: 'Capacity', value: 42, state: 'muted' };
// @ts-expect-error Gauge has no public ref API on either React major.
const referencedGauge: GaugeProps = { label: 'Capacity', value: 42, ref: unsupportedGaugeRef };
// @ts-expect-error Gauge cannot delegate its meter semantics to a child.
const slottedGauge: GaugeProps = { label: 'Capacity', value: 42, asChild: true };
// @ts-expect-error A passive measurement does not expose click actions.
const actionableGauge: GaugeProps = { label: 'Capacity', value: 42, onClick: () => {} };
// @ts-expect-error Arbitrary presets are not part of Gauge's size API.
const invalidGaugeSize: GaugeProps = { label: 'Capacity', value: 42, size: 'xl' };
// @ts-expect-error Gauge owns passive meter semantics.
const interactiveGauge: GaugeProps = { label: 'Capacity', value: 42, role: 'button' };
`;

// Reused inside the installed fixture, against shipped CSS and both consumer build paths.
function assertGaugeCSS(css) {
  for (const selector of ['.eg-gauge-arc', '.eg-gauge-center', '.inline-flex', '.gap-2', '.text-label-default']) {
    assert.ok(css.includes(selector), 'Missing Gauge selector ' + selector);
  }
  assert.match(css, /conic-gradient\(var\(--eg-gauge-fill\) calc\(var\(--eg-gauge-value\) \* 1%\)/);
  assert.match(css, /mask:\s*radial-gradient\(/);
  assert.match(css, /\.eg-gauge-center\s*\{[^}]*inset:\s*30%/);
  for (const size of ['space-4', 'space-10', 'space-14', 'space-20', 'eg-gauge-size']) {
    for (const [prefix, property] of [
      ['w', 'width'],
      ['h', 'height']
    ]) {
      assert.ok(
        css.includes('.' + prefix + '-\\[var\\(--' + size + '\\)\\]'),
        'Missing static Gauge dimension ' + size
      );
      assert.ok(css.includes(property + ': var(--' + size + ')'), 'Missing Gauge geometry binding ' + size);
    }
  }
  for (const stroke of ['3px', '4px', '6px']) {
    assert.ok(css.includes('--eg-gauge-stroke: ' + stroke), 'Missing preset stroke ' + stroke);
  }
  assert.match(css, /--eg-gauge-stroke:\s*calc\(var\(--eg-gauge-size\)\s*\/\s*14\)/);
  assert.match(css, /--eg-gauge-track:\s*color-mix\(in oklab,\s*var\(--color-fg-default\)\s*10%,\s*transparent\)/);
  assert.doesNotMatch(css, /--alpha\s*\(/);
  for (const [state, token] of [
    ['warning', 'status-warning'],
    ['critical', 'status-danger'],
    ['muted', 'fg-muted']
  ]) {
    assert.ok(
      css.includes('data-state=' + state) || css.includes('data-state="' + state + '"'),
      'Missing state ' + state
    );
    assert.ok(css.includes('--eg-gauge-fill: var(--color-' + token + ')'), 'Missing state token ' + token);
  }
  for (const selector of [
    '.bg-transparent',
    '.bg-none',
    String.raw`.\[box-shadow\:none\]`,
    String.raw`.rounded-\[var\(--radius-full\)\]`,
    '.border-0',
    '.p-0'
  ]) {
    assert.ok(css.includes(selector), 'Missing native transparent-frame utility ' + selector);
  }
  assert.match(css, /\.bg-transparent\s*\{[^}]*background-color:\s*(?:transparent|#0000(?:0000)?)\s*;/);
  assert.match(css, /\.bg-none\s*\{[^}]*background-image:\s*none\s*;/);
  assert.match(css, /\.\\\[box-shadow\\:none\\\]\s*\{[^}]*box-shadow:\s*none\s*;/);
  assert.match(css, /@layer components\s*\{/);
  assert.match(css, /@layer utilities\s*\{/);
  for (const token of ['space-2', 'font-sans', 'text-label-default', 'color-fg-brand-default', 'radius-full']) {
    assert.ok(css.includes('var(--' + token), 'Gauge must consume token ' + token);
  }
}

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
assert.ok(shippedStyles.includes('.eg-gauge-arc'), 'Packed styles must retain Gauge geometry');
assert.deepEqual(Object.keys(await import('@egdev/ui')).sort(), ['Gauge', 'Slot', 'Slottable', 'cn']);
${assertGaugeCSS.toString()}
assertGaugeCSS(shippedStyles);
const theme = readFileSync(fileURLToPath(import.meta.resolve('@egdev/tokens/theme.css')), 'utf8');
for (const [, token] of theme.matchAll(/(--[\\w-]+)\\s*:/g)) {
  assert.doesNotMatch(shippedStyles, new RegExp(token + '\\\\s*:'), 'UI must not redefine canonical token ' + token);
}
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
import { JSDOM } from ${JSON.stringify(import.meta.resolve('jsdom'))};
import { Gauge } from '@egdev/ui';
import { App, SlotSample } from './consumer.ts';
const slotDocument = new JSDOM(renderToString(createElement(SlotSample)));
try {
  const target = slotDocument.window.document.body;
  assert.equal(target.children.length, 1);
  assert.equal(target.firstElementChild.tagName, 'A');
  assert.equal(target.firstElementChild.getAttribute('aria-label'), 'Composed documentation');
  assert.equal(target.firstElementChild.textContent, '→Documentation');
  assert.equal(target.firstElementChild.hasAttribute('class'), false);
} finally {
  slotDocument.window.close();
}
const html = renderToString(createElement(App));
for (const text of ['eg-gauge', '<svg', 'role="meter"', 'aria-label="Capacity"', 'Review capacity']) {
  assert.ok(html.includes(text), 'SSR must render ' + text);
}
const dom = new JSDOM(html);
try {
  const document = dom.window.document;
  const normal = document.querySelector('.eg-gauge[aria-label="Capacity"]');
  assert.equal(normal.getAttribute('role'), 'meter');
  assert.equal(normal.getAttribute('data-state'), 'normal');
  assert.equal(normal.getAttribute('aria-valuenow'), '42.5');
  assert.equal(normal.getAttribute('aria-valuetext'), '42.5 / 100');
  assert.ok(normal.querySelector('[class*="--space-14"]'), 'Default size must use the md token');
  assert.equal(normal.querySelector('.eg-gauge-center'), null, 'Default center must be absent');
  const warning = document.querySelector('.eg-gauge[aria-label="Warning capacity"]');
  assert.equal(warning.getAttribute('data-state'), 'warning');
  assert.equal(warning.style.getPropertyValue('--eg-gauge-size'), '64.5px');
  assert.equal(warning.getAttribute('aria-valuetext'), '42.5 capacity units');
  assert.equal(document.getElementById(warning.getAttribute('aria-describedby')).textContent, 'Review capacity');
  assert.equal(warning.querySelector('.eg-gauge-center').textContent, '0');
  for (const gauge of document.querySelectorAll('.eg-gauge')) {
    assert.equal(gauge.getAttribute('aria-valuemin'), '0');
    assert.equal(gauge.getAttribute('aria-valuemax'), '100');
    assert.ok(Number.isFinite(Number(gauge.getAttribute('aria-valuenow'))));
    assert.equal(gauge.querySelector('[aria-live], button, a, input, [tabindex]'), null);
    assert.equal(gauge.hasAttribute('aria-live'), false);
    const center = gauge.querySelector('.eg-gauge-center');
    if (center) assert.equal(center.getAttribute('aria-hidden'), 'true');
  }
} finally {
  dom.window.close();
}
for (const [value, normalized] of [[-1, 0], [42.5, 42.5], [101, 100]]) {
  const rendered = renderToString(createElement(Gauge, { label: 'Bounded capacity', value }));
  assert.ok(rendered.includes('aria-valuenow="' + normalized + '"'));
  assert.ok(rendered.includes('aria-valuetext="' + normalized + ' / 100"'));
  assert.ok(rendered.includes('--eg-gauge-value:' + normalized));
}
for (const value of [NaN, Infinity, -Infinity]) {
  const rendered = renderToString(createElement(Gauge, {
    label: 'Disconnected capacity', value, state: 'critical', stateText: 'Hidden condition', center: 'Hidden center'
  }));
  assert.ok(rendered.includes('Disconnected capacity') && rendered.includes('Data unavailable'));
  assert.doesNotMatch(rendered, /role="meter"|aria-value(?:now|min|max|text)=|eg-gauge-arc|--eg-gauge-value|Hidden condition|Hidden center|aria-live=|<button|tabindex=/);
}
console.log(JSON.stringify({ ssr: ['Gauge finite, bounded and unavailable', 'decorative centers', 'visible conditions'], bytes: html.length }));
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
const { act, createElement, createRef } = await import('react');
const { Slot, Slottable } = await import('@egdev/ui');
const { createRoot } = await import('react-dom/client');
const { App } = await import('./consumer.ts');
stage('imports:complete');
const root = createRoot(document.getElementById('app'));
try {
  stage('mount:start');
  await act(async () => root.render(createElement(App)));
  stage('mount:complete');
  const buttons = [...document.querySelectorAll('button')];
  assert.equal(buttons.length, 2, 'Only intrinsic consumer controls may be focusable');
  buttons[0].focus();
  assert.equal(document.activeElement, buttons[0]);
  buttons[1].focus();
  assert.equal(document.activeElement, buttons[1]);
  stage('gauge:rerender:start');
  const measurement = () => document.querySelector('section[aria-label="Measurements"] > .eg-gauge');
  assert.equal(measurement().getAttribute('aria-valuenow'), '42.5');
  await act(async () => root.render(createElement(App, { gaugeValue: 101 })));
  assert.equal(measurement().getAttribute('aria-valuenow'), '100');
  assert.equal(measurement().style.getPropertyValue('--eg-gauge-value'), '100');
  await act(async () => root.render(createElement(App, { gaugeValue: NaN })));
  assert.equal(measurement().hasAttribute('role'), false);
  assert.equal(measurement().querySelector('[aria-valuenow], .eg-gauge-arc'), null);
  assert.ok(measurement().textContent.includes('Data unavailable'));
  await act(async () => root.render(createElement(App, { gaugeValue: 0 })));
  assert.equal(measurement().getAttribute('aria-valuenow'), '0');
  assert.equal(measurement().textContent.includes('Data unavailable'), false);
  assert.equal(measurement().querySelector('[aria-live], button, a, input, [tabindex]'), null);
  assert.equal(measurement().hasAttribute('aria-live'), false);
  stage('gauge:rerender:complete');
  const slotRef = createRef();
  const childRef = createRef();
  const calls = [];
  await act(async () => root.render(createElement(Slot, {
    ref: slotRef, onClick: () => calls.push('slot'), 'aria-label': 'Composed documentation'
  }, createElement('span', { 'aria-hidden': true }, '→'),
  createElement(Slottable, null, createElement('a', {
    ref: childRef, href: '#composition', onClick: (event) => { event.preventDefault(); calls.push('child'); }
  }, 'Documentation')))));
  const target = document.querySelector('a');
  assert.equal(document.getElementById('app').children.length, 1);
  assert.equal(target.textContent, '→Documentation');
  assert.equal(target.getAttribute('aria-label'), 'Composed documentation');
  assert.equal(target.hasAttribute('class'), false);
  assert.equal(slotRef.current, target);
  assert.equal(childRef.current, target);
  await act(async () => target.click());
  assert.deepEqual(calls, ['child', 'slot']);
  await act(async () => root.render(null));
  assert.equal(slotRef.current, null);
  assert.equal(childRef.current, null);
  console.log(JSON.stringify({ csr: ['intrinsic consumer focus harness', 'Gauge rerender, passivity and non-finite recovery', 'Slot/Slottable target, composed refs, child-first events and ref cleanup'] }));
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
${assertGaugeCSS.toString()}
assertGaugeCSS(emitted);
for (const selector of ['.eg-gauge-arc', '.eg-gauge-center']) assert.ok(emitted.includes(selector), 'Missing shipped selector ' + selector);
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
for (const token of ['--color-surface-0', '--radius-full', '--shadow-well']) assert.ok(emitted.includes('var(' + token + ')'), 'UI must consume shipped token ' + token);
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
assertGaugeCSS(twCss);
for (const selector of ['.eg-gauge-arc', '.eg-gauge-center']) {
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
        packageManager: manifest.packageManager,
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
      // Keep temporary consumers on the repository's managed pnpm, not the global version/store.
      const expectedPnpmVersion = manifest.packageManager.match(/^pnpm@([^+]+)(?:\+.*)?$/)?.[1];
      assert.ok(expectedPnpmVersion, 'Root packageManager must pin pnpm');
      assert.equal(
        run(fixture, 'pnpm', ['--version'], 30_000),
        expectedPnpmVersion,
        'Fixture pnpm must match the root packageManager pin before installing dependencies'
      );
      const install = ['install', '--ignore-scripts', '--no-frozen-lockfile', '--strict-peer-dependencies'];
      if (process.env.EGDEV_CONSUMER_OFFLINE === '1') {
        install.push('--offline');
      }
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
