// AC19 (docs/distribution/egdev-ds-cli.md §10, §13, Q12): real consumers of the real release set.
// The workspace must be built first (`pnpm build`; CI runs it before this test). The set is packed
// into a temporary folder, never into `release/`. Two consumers are created in temporary folders:
// npm + Vite (native CSS), bootstrapped from the CLI tarball (§3), and pnpm + Next.js (Tailwind), run
// from this checkout. Each one runs `egdev-ds init` with the real install, `ds:doctor`, a production
// build, `egdev-ds upgrade` against a second release and `ds:doctor` again. The second release holds
// the same tarballs relabelled with another commit, which is what upgrade keys on.
//
// The installs need the network. Locally the test is skipped with a message when the registry does
// not resolve, or when EGDEV_SKIP_CLI_CONSUMER=1. In CI (`CI` set) an offline registry fails instead.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test, { after } from 'node:test';
import { fileURLToPath } from 'node:url';
import manifest from '../package.json' with { type: 'json' };
import { runReleasePack } from './lib/pack-packages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const bin = join(root, 'packages/cli/bin/egdev-ds.mjs');
const devDependencies = manifest.devDependencies;
const versions = {
  react: devDependencies.react,
  typescript: devDependencies.typescript,
  vite: devDependencies.vite,
  tailwindcss: devDependencies.tailwindcss,
  // Not root dependencies: the versions the website consumer runs (egdev-website/package.json).
  next: '16.4.5',
  postcss: '8.5.29'
};

async function skipReason() {
  if (process.env.EGDEV_SKIP_CLI_CONSUMER === '1') {
    return 'EGDEV_SKIP_CLI_CONSUMER=1: skipping the networked end-to-end consumer test.';
  }
  try {
    await lookup('registry.npmjs.org');
    return false;
  } catch {
    return process.env.CI
      ? false
      : 'Offline: registry.npmjs.org does not resolve; the end-to-end consumer test needs the network (CI runs it).';
  }
}

// Children get no `npm_*` variables from the pnpm script that started this test. The variable name
// is computed: an env key cannot be written as a literal property (naming convention).
const telemetryVariable = 'NEXT_TELEMETRY_DISABLED';
const childEnv = Object.fromEntries(
  Object.entries({ ...process.env, [telemetryVariable]: '1' }).filter(([key]) => !key.startsWith('npm_'))
);

function run(cwd, command, args, timeout = 300_000) {
  const result = spawnSync(command, args, {
    cwd,
    env: childEnv,
    encoding: 'utf8',
    timeout,
    maxBuffer: 64 * 1024 * 1024
  });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '', error: result.error };
}

function ok(result, label) {
  assert.equal(
    result.status,
    0,
    `${label} failed (${result.error ?? 'exit'} ${result.status}):\n${result.stdout}\n${result.stderr}`
  );
  return result.stdout;
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

const scratch = mkdtempSync(join(tmpdir(), 'egdev-cli-consumer-'));
after(() => rmSync(scratch, { recursive: true, force: true }));

// Release A is the real pack; release B is the same tarballs under another commit.
function packReleases() {
  for (const built of ['packages/ui/dist', 'packages/tokens/dist', 'packages/mcp/dist/index.js']) {
    assert.ok(existsSync(join(root, built)), `Missing ${built}: run pnpm build before this test.`);
  }
  const releaseA = join(scratch, 'release-a');
  const lines = [];
  const exitCode = runReleasePack({
    root,
    destination: releaseA,
    build: false,
    log: (line) => lines.push(line),
    error: (line) => lines.push(line)
  });
  assert.equal(exitCode, 0, `release:pack failed:\n${lines.join('\n')}`);
  const record = JSON.parse(readFileSync(join(releaseA, 'release.json'), 'utf8'));
  assert.ok(
    record.packages.some((entry) => entry.name === '@egdev/cli'),
    'The real release set includes @egdev/cli'
  );
  const releaseB = join(scratch, 'release-b');
  mkdirSync(releaseB);
  for (const name of readdirSync(releaseA).filter((file) => file.endsWith('.tgz'))) {
    copyFileSync(join(releaseA, name), join(releaseB, name));
  }
  const commitB = createHash('sha1').update(`b:${record.commit}`).digest('hex');
  write(join(releaseB, 'release.json'), json({ ...record, commit: commitB }));
  const cli = record.packages.find((entry) => entry.name === '@egdev/cli');
  return {
    releaseA,
    releaseB,
    shortA: record.commit.slice(0, 7),
    shortB: commitB.slice(0, 7),
    cliTarball: join(releaseA, cli.file),
    // A local pack of a work-in-progress tree is dirty; CI packs a clean checkout.
    dirty: record.dirty ? ['--allow-dirty'] : []
  };
}

// npm + Vite + native CSS: the CSS is imported by the `index.html` entry module.
function npmViteConsumer(work) {
  const project = join(work, 'npm-vite');
  write(
    join(project, 'package.json'),
    json({
      name: 'cli-consumer-npm',
      private: true,
      type: 'module',
      scripts: { build: 'vite build' },
      dependencies: { react: versions.react, 'react-dom': versions.react },
      devDependencies: { postcss: versions.postcss, typescript: versions.typescript, vite: versions.vite }
    })
  );
  write(
    join(project, 'package-lock.json'),
    json({
      name: 'cli-consumer-npm',
      lockfileVersion: 3,
      requires: true,
      packages: { '': { name: 'cli-consumer-npm' } }
    })
  );
  write(
    join(project, 'index.html'),
    '<!doctype html>\n<html lang="en">\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.ts"></script>\n  </body>\n</html>\n'
  );
  write(
    join(project, 'src/main.ts'),
    [
      "import { Button } from '@egdev/ui';",
      "import { createElement } from 'react';",
      "import { createRoot } from 'react-dom/client';",
      "import './index.css';",
      '',
      "const host = document.getElementById('root');",
      'if (host) {',
      "  createRoot(host).render(createElement(Button, null, 'Go'));",
      '}',
      ''
    ].join('\n')
  );
  write(join(project, 'src/index.css'), ':root { color-scheme: dark; }\n');
  return project;
}

// pnpm + Next.js + Tailwind, pinned through `packageManager` with no lockfile yet. JSX files keep
// Next from setting up TypeScript.
function pnpmNextConsumer(work) {
  const project = join(work, 'pnpm-next');
  write(
    join(project, 'package.json'),
    json({
      name: 'cli-consumer-pnpm',
      private: true,
      type: 'module',
      packageManager: manifest.packageManager,
      scripts: { build: 'next build' },
      dependencies: { next: versions.next, react: versions.react, 'react-dom': versions.react },
      devDependencies: {
        '@tailwindcss/postcss': versions.tailwindcss,
        postcss: versions.postcss,
        tailwindcss: versions.tailwindcss,
        typescript: versions.typescript
      }
    })
  );
  write(join(project, 'postcss.config.mjs'), "export default { plugins: { '@tailwindcss/postcss': {} } };\n");
  write(join(project, 'src/app/globals.css'), '@import "tailwindcss";\n');
  write(
    join(project, 'src/app/layout.jsx'),
    [
      "import './globals.css';",
      '',
      "export const metadata = { title: 'egdev-ds consumer' };",
      '',
      'export default function RootLayout({ children }) {',
      '  return (',
      '    <html lang="en">',
      '      <body>{children}</body>',
      '    </html>',
      '  );',
      '}',
      ''
    ].join('\n')
  );
  write(
    join(project, 'src/app/page.jsx'),
    [
      "'use client';",
      '',
      "import { Button } from '@egdev/ui';",
      '',
      'export default function Page() {',
      '  return <Button>Go</Button>;',
      '}',
      ''
    ].join('\n')
  );
  return project;
}

const skip = await skipReason();

test('AC19 real consumers: init → install → ds:doctor → build → upgrade → ds:doctor', {
  skip,
  // Below the CI step timeout (20 min) so a hang reports its cause instead of killing the job.
  timeout: 1_080_000
}, async (t) => {
  const release = packReleases();
  const work = join(scratch, 'consumers');
  mkdirSync(work);
  const egdevDs = (args) => run(work, process.execPath, [bin, ...args]);
  const doctorClean = 'egdev-ds doctor . (';
  // DS014 and DS017 skip without --from; DS051 skips because the fixtures have no design/system.md.
  const doctorSummary = '0 errors, 0 warnings, 3 skipped.';

  await t.test('AC19 npm + Vite (native), init bootstrapped from the CLI tarball', () => {
    const project = npmViteConsumer(work);
    const init = ok(
      run(work, 'npm', [
        'exec',
        '--yes',
        `--package=${release.cliTarball}`,
        '--',
        'egdev-ds',
        'init',
        'npm-vite',
        '--from',
        release.releaseA,
        ...release.dirty
      ]),
      'npm exec egdev-ds init'
    );
    assert.match(init, new RegExp(`Initialized at ${release.shortA}; 5 vendored integrities verified\\.`));
    const css = readFileSync(join(project, 'src/index.css'), 'utf8');
    assert.ok(css.startsWith('@import "@egdev/tokens/tokens.css";\n@import "@egdev/ui/styles.css";\n'), css);

    let doctor = ok(run(project, 'npm', ['run', '--silent', 'ds:doctor']), 'npm run ds:doctor');
    assert.ok(doctor.includes(`${doctorClean}npm, vite, native)`) && doctor.includes(doctorSummary), doctor);
    ok(run(project, 'npm', ['run', 'build']), 'npm run build');
    assert.ok(existsSync(join(project, 'dist/index.html')), 'vite build writes dist/index.html');

    const upgrade = ok(
      egdevDs(['upgrade', 'npm-vite', '--from', release.releaseB, ...release.dirty]),
      'egdev-ds upgrade'
    );
    assert.match(upgrade, new RegExp(`Upgraded to ${release.shortB}; 5 vendored integrities verified\\.`));
    assert.ok(
      readdirSync(join(project, 'vendor/egdev')).every((file) => file.endsWith(`-${release.shortB}.tgz`)),
      'every vendored tarball carries the new commit'
    );
    doctor = ok(run(project, 'npm', ['run', '--silent', 'ds:doctor']), 'npm run ds:doctor after upgrade');
    assert.ok(doctor.includes(doctorSummary), doctor);
    const again = ok(egdevDs(['upgrade', 'npm-vite', '--from', release.releaseB, ...release.dirty]), 'second upgrade');
    assert.match(again, new RegExp(`Already at ${release.shortB}; 5 vendored integrities verified; no changes\\.`));
  });

  await t.test('AC19 pnpm + Next.js (Tailwind), run from the checkout', () => {
    const project = pnpmNextConsumer(work);
    const init = ok(egdevDs(['init', 'pnpm-next', '--from', release.releaseA, ...release.dirty]), 'egdev-ds init');
    assert.match(init, new RegExp(`Initialized at ${release.shortA}; 5 vendored integrities verified\\.`));
    assert.equal(
      readFileSync(join(project, 'src/app/globals.css'), 'utf8'),
      '@import "tailwindcss";\n@import "@egdev/tokens/theme.css";\n@import "@egdev/ui/styles.css";\n'
    );
    let doctor = ok(run(project, 'pnpm', ['--silent', 'ds:doctor']), 'pnpm ds:doctor');
    assert.ok(doctor.includes(`${doctorClean}pnpm, next, tailwind)`) && doctor.includes(doctorSummary), doctor);
    ok(run(project, 'pnpm', ['build'], 600_000), 'pnpm build (next build)');

    const upgrade = ok(
      egdevDs(['upgrade', 'pnpm-next', '--from', release.releaseB, ...release.dirty]),
      'egdev-ds upgrade'
    );
    assert.match(upgrade, new RegExp(`Upgraded to ${release.shortB}; 5 vendored integrities verified\\.`));
    doctor = ok(run(project, 'pnpm', ['--silent', 'ds:doctor']), 'pnpm ds:doctor after upgrade');
    assert.ok(doctor.includes(doctorSummary), doctor);
  });
});
