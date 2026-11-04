import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Passive feasibility evidence only. No application build, browser, source writes or scratch.
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../..');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const bytes = (path) => readFileSync(resolve(root, path));
const payload = (buffer, heading) => {
  const marker = Buffer.from(`\n${heading}\n`);
  const index = buffer.indexOf(marker);
  assert.ok(index >= 0, `Missing whole heading: ${heading}`);
  assert.equal(buffer.indexOf(marker, index + 1), -1, 'Heading must be unique');
  assert.equal(buffer.at(-1), 10, 'Final LF required');
  assert.equal(buffer.includes(13), false, 'LF only');
  return buffer.subarray(index + 1);
};
const specPath = 'docs/components/home-template/v0.1/spec.md';
const ownerPath = 'docs/components/home-template/v0.1/owner-approval.md';
const indexPath = 'docs/components/home-template/v0.1/capture.json';
const spec = bytes(specPath);
assert.equal(hash(payload(spec, '## 1. Purpose and scope')), '622eacf3cccb774690b6c247dcaf6e31a8feb4aa858376b00fd274438dc8eb84');
assert.equal(hash(spec), 'b1ac63cd87d0fe51e72b3ca64645d739136d3037b46c37322909874c4442272c');
assert.equal(hash(bytes(ownerPath)), 'b1724643da6299f7c65431a27a8cb6f3497d28a66fc0e62e5cc7ab8736cb5b7b');
assert.equal(hash(bytes(indexPath)), '5d092aa9d776c6e633fc96e62e3ae0d879a69bae43f98e35420864960437db24');
const captures = JSON.parse(bytes(indexPath));
assert.equal(captures.shots.length, 10);
const immutable = [specPath, ownerPath, indexPath].map((path) => ({ path, sha256: hash(bytes(path)) }));
for (const shot of captures.shots) {
  assert.match(shot.file, /^home-template--[a-z0-9-]+\.png$/);
  const path = `docs/components/home-template/v0.1/${shot.file}`;
  assert.equal(hash(bytes(path)), shot.sha256, shot.visualId);
  immutable.push({ path, sha256: shot.sha256, visualId: shot.visualId });
}
const draftBinding = (file, label, heading) => {
  const path = `docs/components/home-template/v0.1/${file}`;
  const buffer = bytes(path);
  const text = buffer.toString('utf8');
  const payloadSHA256 = hash(payload(buffer, heading));
  const declared = text.match(new RegExp(`${label} payload SHA-256: \u0060([a-f0-9]{64})\u0060`))?.[1];
  assert.equal(declared, payloadSHA256, `Stale ${label} payload hash`);
  const hashMethodDeclaration = text.split('\n').find((line) => line.startsWith(`- ${label} hash method:`));
  assert.ok(hashMethodDeclaration?.includes(`\u0060${heading}\u0060`), `${label} method must name the exact heading`);
  for (const required of ['SHA-256', 'UTF-8', 'EOF', 'LF']) {
    assert.ok(hashMethodDeclaration.includes(required), `${label} method must declare ${required}`);
  }
  for (const binding of immutable.slice(0, 3)) assert.ok(text.includes(binding.sha256), `${label} missing frozen ${binding.path} binding`);
  assert.ok(text.includes('622eacf3cccb774690b6c247dcaf6e31a8feb4aa858376b00fd274438dc8eb84'));
  return { path, payloadSHA256, wholeFileSHA256: hash(buffer), hashMethodDeclaration, wholeFileHashMethod: 'SHA-256 of all saved bytes including final metadata and LF' };
};
const amendment = draftBinding('bounded-amendment.md', 'Amendment', '## 1. Binding and limited authority');
const planBinding = draftBinding('implementation-plan.md', 'Plan', '## 1. Decision and authorization boundary');
const plan = readFileSync(resolve(here, 'implementation-plan.md'));
assert.equal(plan.toString().match(/amendment payload SHA-256 `([a-f0-9]{64})`/)?.[1], amendment.payloadSHA256, 'Stale amendment payload binding');
assert.equal(plan.toString().match(/amendment whole-file SHA-256 `([a-f0-9]{64})`/)?.[1], amendment.wholeFileSHA256, 'Stale amendment whole-file binding');
const planHash = planBinding.payloadSHA256;

const roots = [
  '/home/egdev/proyectos/egdev-design-system',
  '/home/egdev/proyectos/egdev-design-system-worktrees/scroll-reveal-spec'
];
let resolved;
for (const directory of roots) {
  try {
    const require = createRequire(resolve(directory, 'package.json'));
    resolved = realpathSync(require.resolve('tailwindcss'));
    break;
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND' && error.code !== 'ENOENT') throw error;
  }
}
assert.ok(resolved, 'BLOCKED: installed tailwindcss unavailable in both authorized compiler roots');
const compilerModule = await import(pathToFileURL(resolved).href);
// require.resolve selects Tailwind's CJS entry; its properties live on the default export.
const compile = compilerModule.compile ?? compilerModule.default?.compile;
assert.equal(typeof compile, 'function', 'Resolved compiler must expose compile');
const compilerManifestPath = resolve(dirname(resolved), '../package.json');
const version = JSON.parse(readFileSync(compilerManifestPath)).version;
assert.equal(version, '4.3.3');
const themePath = 'packages/tokens/src/theme.css';
const token = '--gradient-vignette: radial-gradient(ellipse 120% 90% at 50% 45%, transparent 35%, rgba(0, 0, 0, 0.55) 75%, rgba(0, 0, 0, 0.92) 100%);';
assert.equal(hash(bytes(themePath)), '41698fd4adb1f02a2828c439e9d4f2437ff338bc759231158185b12337e40ad9', 'Token source changed');
const loadedTheme = `${bytes(themePath).toString()}\n:root { ${token} }\n`;
const input = '@reference "egdev-plan-theme";\n@layer utilities { @tailwind utilities source(none); }\n';
const classesByPart = {
  root: 'relative isolate block w-full',
  canvasBase: 'fixed inset-0 block w-full h-full pointer-events-none bg-transparent',
  ambient: 'z-0 opacity-[var(--eg-home-ambient-opacity)]',
  isotipo: 'z-[1] opacity-[var(--eg-home-isotipo-opacity)]',
  vignette: 'fixed inset-0 z-0 pointer-events-none bg-[image:var(--gradient-vignette)]',
  content: 'relative z-[2] block overflow-x-clip',
  anchor: 'relative block',
  fallback: 'block data-[state=painted]:opacity-0'
};
const declarations = {
  relative: /position: relative;/,
  isolate: /isolation: isolate;/,
  block: /display: block;/,
  'w-full': /width: 100%;/,
  'h-full': /height: 100%;/,
  fixed: /position: fixed;/,
  'inset-0': /inset: (?:var\(--space-0\)|0(?:px)?);/,
  'pointer-events-none': /pointer-events: none;/,
  'bg-transparent': /background-color: transparent;/,
  'z-0': /z-index: 0;/,
  'z-[1]': /z-index: 1;/,
  'z-[2]': /z-index: 2;/,
  'opacity-[var(--eg-home-ambient-opacity)]': /opacity: var\(--eg-home-ambient-opacity\);/,
  'opacity-[var(--eg-home-isotipo-opacity)]': /opacity: var\(--eg-home-isotipo-opacity\);/,
  'bg-[image:var(--gradient-vignette)]': /background-image: var\(--gradient-vignette\);/,
  'overflow-x-clip': /overflow-x: clip;/,
  'data-[state=painted]:opacity-0': /opacity: 0%;/
};
const options = {
  loadStylesheet: async (id) => {
    assert.equal(id, 'egdev-plan-theme');
    return { path: resolve(root, themePath), base: root, content: loadedTheme };
  }
};
const candidates = [...new Set(Object.values(classesByPart).flatMap((value) => value.split(' ')))];
const assertions = [];
for (const candidate of candidates) {
  // Fresh compiler per candidate prevents another component/utility satisfying the assertion.
  const compiler = await compile(input, options);
  const css = compiler.build([candidate]);
  const selector = '.' + candidate.replace(/[^\w-]/g, '\\$&');
  assert.ok(css.includes(selector), `Missing selector: ${candidate}`);
  assert.match(css, declarations[candidate], `Missing declaration: ${candidate}`);
  if (candidate.startsWith('data-')) assert.match(css, /\[data-state="?painted"?\]/);
  assertions.push({ candidate, selector, expectedDeclaration: declarations[candidate].source, css, passed: true });
}
const compiler = await compile(input, options);
const output = compiler.build(candidates);
assert.doesNotMatch(output, /@theme|@tailwind|@reference/);
const sourcePaths = [
  'packages/effects/src/index.ts',
  'packages/effects/src/ambient-background/particleStreaks.ts',
  'packages/effects/src/ambient-background/useAmbientBackground.ts',
  'packages/effects/src/atoms/isotipo3d/isotipoScene.ts',
  'packages/effects/src/atoms/isotipo3d/useIsotipo3D.ts'
];
const expectedSourceHashes = [
  '30b7b4d98bd56e93a3de0ba0379ed4a50f0316eb2581be037a491445127bfe7d',
  '41dc7ab6bc3961a63d33294f67dd5092d7ae7b1040c16046c702c06075c0e71b',
  '952dd07a716733985e95d7c5a5d9e045c3b7cb842bc99b43990658f445b7f286',
  'df69d8787133a2823fa8d4f3c149e64394434595e9ab319f8d663c213a2b1668',
  '2beaaf008246dbb78056db5dd9988bc13021339d3181786bc73bd7daaae51023'
];
const reviewedSource = sourcePaths.map((path, index) => {
  const sha256 = hash(bytes(path));
  assert.equal(sha256, expectedSourceHashes[index], `Source changed: ${path}`);
  return { path, sha256 };
});
assert.equal(assertions.length, 17);
const report = {
  purpose: 'Static compiler feasibility, not implemented behavior or browser evidence',
  documents: { amendment, plan: planBinding },
  planPayloadSHA256: planHash,
  scriptSHA256: hash(readFileSync(fileURLToPath(import.meta.url))),
  compiler: { resolved, manifest: compilerManifestPath, version, api: '(module.compile ?? module.default.compile)(input, {loadStylesheet}).build(candidates)' },
  input,
  loadedTheme: { path: themePath, sourceSHA256: hash(bytes(themePath)), appendedEphemeralToken: token, combinedSHA256: hash(loadedTheme) },
  classesByPart,
  candidateCount: candidates.length,
  assertions,
  output,
  outputSHA256: hash(output),
  immutable,
  reviewedSource
};
const serialized = JSON.stringify(report, null, 2) + '\n';
if (process.argv[2] === '--check') {
  assert.equal(readFileSync(resolve(here, 'plan-probes.json'), 'utf8'), serialized, 'Stale probe report');
} else {
  assert.equal(process.argv.length, 2, 'Only --check is supported');
  writeFileSync(resolve(here, 'plan-probes.json'), serialized);
}
console.log(JSON.stringify({ compiler: version, assertions: assertions.length, immutableFiles: immutable.length, documents: { amendment, plan: planBinding }, reportSHA256: hash(serialized), mode: process.argv[2] ?? 'write' }));
