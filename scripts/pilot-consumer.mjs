import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { packReleaseSet, releaseMembers } from './lib/pack-packages.mjs';
import { css, page } from './lib/pilot-page.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const temporary = mkdtempSync(join(tmpdir(), 'egdev-pilot-'));
const app = join(temporary, 'app');
const markers = [
  'eg-web-template',
  'eg-web-section',
  'eg-tabs',
  'eg-chip-group',
  'eg-field',
  'eg-notice',
  'eg-list-item'
];
console.log(`PILOT_TEMP ${temporary}`);

function command(executable, args, options = {}) {
  const result = spawnSync(executable, args, {
    cwd: app,
    encoding: 'utf8',
    timeout: 180_000,
    maxBuffer: 8 * 1024 * 1024,
    ...options
  });
  if (result.status !== 0) {
    throw new Error(
      `${executable} ${args.join(' ')} failed: ${result.error ?? result.signal ?? result.status}\n${result.stdout}\n${result.stderr}`
    );
  }
  return result.stdout;
}

function assertOutsideRepository(entry) {
  const actual = realpathSync(entry);
  const path = relative(realpathSync(root), actual);
  if (path === '' || (path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path))) {
    throw new Error(`repository entry: ${actual}`);
  }
  return actual;
}

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

async function main() {
  mkdirSync(app);
  if (process.env.EGDEV_PILOT_TEST_REPO_ENTRY) {
    assertOutsideRepository(process.env.EGDEV_PILOT_TEST_REPO_ENTRY);
  }
  const members = releaseMembers(root).filter((item) =>
    ['@egdev/tokens', '@egdev/ui', '@egdev/effects'].includes(item.name)
  );
  if (members.length !== 3) {
    throw new Error('Expected tokens, ui and effects in the release set');
  }
  const packed = packReleaseSet({ root, destination: join(temporary, 'tarballs'), members });
  const tarballs = Object.fromEntries(packed.map((entry) => [entry.name, `file:${entry.path}`]));
  const deps = manifest.devDependencies;
  const effects = members.find((member) => member.name === '@egdev/effects');
  const write = (name, contents) => {
    const path = join(app, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, contents);
  };
  write(
    'package.json',
    JSON.stringify(
      {
        private: true,
        type: 'module',
        packageManager: manifest.packageManager,
        dependencies: {
          ...tarballs,
          react: deps.react,
          'react-dom': deps['react-dom'],
          three: effects.manifest.peerDependencies.three,
          vite: deps.vite,
          tailwindcss: deps.tailwindcss,
          '@tailwindcss/vite': deps['@tailwindcss/vite']
        }
      },
      null,
      2
    )
  );
  write(
    'pnpm-workspace.yaml',
    `overrides:\n  '@egdev/tokens': ${JSON.stringify(tarballs['@egdev/tokens'])}\n  '@egdev/ui': ${JSON.stringify(tarballs['@egdev/ui'])}\n`
  );
  write(
    'index.html',
    '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>EGDEV pilot</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>'
  );
  write('src/main.tsx', page);
  write('src/pilot.css', css);
  write(
    'vite.config.mjs',
    `import tailwindcss from '@tailwindcss/vite';\nexport default { plugins: process.env.EGDEV_CSS_MODE === 'tailwind' ? [tailwindcss()] : [], build: { outDir: 'dist/' + process.env.EGDEV_CSS_MODE } };\n`
  );
  const expectedPnpm = manifest.packageManager.split('@')[1];
  if (command('pnpm', ['--version']).trim() !== expectedPnpm) {
    throw new Error(`Expected pnpm ${expectedPnpm}`);
  }
  command('pnpm', ['install', '--ignore-scripts', '--no-frozen-lockfile', '--strict-peer-dependencies']);
  const packages = {};
  for (const entry of packed) {
    const subpath = entry.name === '@egdev/tokens' ? `${entry.name}/tokens.css` : entry.name;
    const output = command(process.execPath, [
      '--input-type=module',
      '-e',
      `console.log(import.meta.resolve(${JSON.stringify(subpath)}))`
    ]).trim();
    const actual = assertOutsideRepository(fileURLToPath(output));
    packages[entry.name.split('/')[1]] = { version: entry.version, specifier: tarballs[entry.name], realpath: actual };
  }
  // Render the installed public components, rather than inferring page structure from source strings.
  write(
    'render.mjs',
    `import React from 'react';\nimport { renderToStaticMarkup } from 'react-dom/server';\nimport { createServer } from 'vite';\nconst server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });\ntry { const { App } = await server.ssrLoadModule('/src/main.tsx'); console.log(renderToStaticMarkup(React.createElement(App))); } finally { await server.close(); }\n`
  );
  write('src/mode.css', '');
  const html = command(process.execPath, ['render.mjs']).trim();
  const builds = {};
  for (const mode of ['tailwind', 'native']) {
    const imports =
      mode === 'tailwind'
        ? '@import "tailwindcss";\n@import "@egdev/tokens/theme.css";\n@import "@egdev/ui/styles.css";\n'
        : '@import "@egdev/tokens/tokens.css";\n@import "@egdev/ui/styles.css";\n';
    write('src/mode.css', `${imports}@import "./pilot.css";\n`);
    command('pnpm', ['exec', 'vite', 'build'], { env: { ...process.env, ['EGDEV_CSS_MODE']: mode } });
    const output = files(join(app, 'dist', mode));
    const contents = (suffix) =>
      output
        .filter((path) => path.endsWith(suffix))
        .map((path) => readFileSync(path, 'utf8'))
        .join('\n');
    const stylesheet = contents('.css');
    const javascript = contents('.js');
    if (!stylesheet.includes('--color-bg-canvas:') || /@theme\b/.test(stylesheet)) {
      throw new Error(`${mode}: unresolved token CSS`);
    }
    builds[mode] = {
      cssBytes: Buffer.byteLength(stylesheet),
      jsBytes: Buffer.byteLength(javascript),
      themeBlock: /@theme\b/.test(stylesheet),
      markers: markers.filter((marker) => javascript.includes(marker))
    };
    if (builds[mode].markers.length !== markers.length) {
      throw new Error(`${mode}: missing page marker`);
    }
  }
  console.log(`PILOT_REPORT ${JSON.stringify({ temporary, packages, builds, html })}`);
  if (process.argv.includes('--serve')) {
    const children = ['tailwind', 'native'].map((mode, index) =>
      spawn(
        'pnpm',
        [
          'exec',
          'vite',
          'preview',
          '--host',
          '0.0.0.0',
          '--port',
          String(4173 + index),
          '--strictPort',
          '--outDir',
          `dist/${mode}`
        ],
        {
          cwd: app,
          stdio: 'inherit',
          env: { ...process.env, ['EGDEV_CSS_MODE']: mode }
        }
      )
    );
    console.log('PILOT_SERVE tailwind=http://localhost:4173/ native=http://localhost:4174/ (Ctrl-C to clean up)');
    await new Promise((resolvePromise, reject) => {
      process.once('SIGINT', resolvePromise);
      process.once('SIGTERM', resolvePromise);
      for (const child of children) {
        child.once('exit', (code) => (code === 0 ? resolvePromise() : reject(new Error(`preview exited ${code}`))));
      }
    }).finally(() => children.forEach((child) => child.kill()));
  }
}

try {
  await main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
