import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  symlinkSync,
  writeFileSync
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

export const bin = fileURLToPath(new URL('../bin/egdev-ds.mjs', import.meta.url));
export const COMMIT = 'e712915aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
export const OTHER_COMMIT = 'b54222cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

const require = createRequire(import.meta.url);
// The repository's own engines stand in for the consumer's typescript and postcss (Q4).
export const typescriptDirectory = dirname(require.resolve('typescript/package.json'));
const postcssEntry = createRequire(require.resolve('vite')).resolve('postcss');
export const postcssDirectory = dirname(dirname(postcssEntry));
export const engine = { ts: require('typescript'), postcss: createRequire(postcssEntry)(postcssEntry) };

export const sri = (bytes) => `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

const peers = { react: '^18.3.1 || ^19.3.0', 'react-dom': '^18.3.1 || ^19.3.0' };
export const MANIFESTS = {
  tokens: { name: '@egdev/tokens', version: '0.5.0' },
  ui: { name: '@egdev/ui', version: '0.3.1', peerDependencies: { ...peers, '@egdev/tokens': '0.5.0' } },
  effects: {
    name: '@egdev/effects',
    version: '0.2.1',
    dependencies: { '@egdev/ui': '0.3.1' },
    peerDependencies: { ...peers, three: '0.160.0', '@egdev/tokens': '0.5.0' }
  },
  system: { name: '@egdev/system', version: '0.4.1' },
  mcp: { name: '@egdev/mcp', version: '0.4.1', dependencies: { '@egdev/system': '0.4.1' } }
};

function tarHeader(name, size) {
  const header = Buffer.alloc(512);
  header.write(name, 0, 'utf8');
  header.write('0000644\0', 100);
  header.write('0000000\0', 108);
  header.write('0000000\0', 116);
  header.write(`${size.toString(8).padStart(11, '0')}\0`, 124);
  header.write('00000000000\0', 136);
  header.write('        ', 148);
  header.write('0', 156);
  header.write('ustar\0', 257);
  header.write('00', 263);
  let sum = 0;
  for (const byte of header) {
    sum += byte;
  }
  header.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148);
  return header;
}

// Dependency-free tarball, as `scripts/package-release.test.mjs` builds its fixtures.
export function tarball(manifest) {
  const body = Buffer.from(JSON.stringify(manifest));
  const padding = Buffer.alloc(Math.ceil(body.length / 512) * 512 - body.length);
  return gzipSync(Buffer.concat([tarHeader('package/package.json', body.length), body, padding, Buffer.alloc(1024)]));
}

export function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

export const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

const vendorName = (pkg, commit = COMMIT) => `egdev-${pkg}-${MANIFESTS[pkg].version}-${commit.slice(0, 7)}.tgz`;

function linkEngines(project) {
  mkdirSync(join(project, 'node_modules'), { recursive: true });
  symlinkSync(typescriptDirectory, join(project, 'node_modules/typescript'));
  symlinkSync(postcssDirectory, join(project, 'node_modules/postcss'));
}

function installPeers(project, extra = {}) {
  for (const [name, version] of Object.entries({ react: '19.3.0', 'react-dom': '19.3.0', ...extra })) {
    write(join(project, `node_modules/${name}/package.json`), json({ name, version }));
  }
}

// npm + Vite + native CSS, modelled on Nexo (`nexo/apps/hub`): bare `vendor/`, the `$` override,
// CSS imported from the JS entry module and `.mcp.json` at the repository root.
export function npmViteFixture() {
  const root = mkdtempSync(join(tmpdir(), 'egdev-ds-npm-'));
  const project = join(root, 'apps/hub');
  const selected = ['tokens', 'ui', 'system', 'mcp'];
  const spec = (pkg) => `file:vendor/${vendorName(pkg)}`;
  const lockPackages = {};
  for (const pkg of selected) {
    const bytes = tarball(MANIFESTS[pkg]);
    write(join(project, 'vendor', vendorName(pkg)), bytes);
    write(join(project, `node_modules/@egdev/${pkg}/package.json`), json(MANIFESTS[pkg]));
    lockPackages[`node_modules/@egdev/${pkg}`] = {
      version: MANIFESTS[pkg].version,
      resolved: spec(pkg),
      integrity: sri(bytes)
    };
  }
  write(join(project, 'node_modules/@egdev/mcp/dist/index.js'), '');
  installPeers(project);
  linkEngines(project);
  const dependencies = {
    '@egdev/tokens': spec('tokens'),
    '@egdev/ui': spec('ui'),
    react: '^19.3.0',
    'react-dom': '^19.3.0'
  };
  const devDependencies = {
    '@egdev/mcp': spec('mcp'),
    '@egdev/system': spec('system'),
    typescript: '^5.9.0',
    vite: '^7.1.0'
  };
  write(
    join(project, 'package.json'),
    json({
      name: 'nexo-hub',
      private: true,
      type: 'module',
      scripts: { 'ds:doctor': 'egdev-ds doctor .' },
      dependencies,
      devDependencies,
      overrides: { '@egdev/system': '$@egdev/system' }
    })
  );
  write(
    join(project, 'package-lock.json'),
    json({
      name: 'nexo-hub',
      lockfileVersion: 3,
      requires: true,
      packages: { '': { name: 'nexo-hub', dependencies, devDependencies }, ...lockPackages }
    })
  );
  write(
    join(project, 'index.html'),
    '<!doctype html>\n<html>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n'
  );
  write(
    join(project, 'src/main.tsx'),
    [
      "import { createRoot } from 'react-dom/client';",
      "import '@egdev/tokens/tokens.css';",
      "import '@egdev/ui/styles.css';",
      "import { App } from './App';",
      "import './theme/family.css';",
      '',
      "createRoot(document.getElementById('root')).render(<App />);",
      ''
    ].join('\n')
  );
  write(
    join(project, 'src/App.tsx'),
    [
      "import { Button, ListItem } from '@egdev/ui';",
      '',
      'export const App = () => (',
      '  <>',
      '    <Button>Go</Button>',
      '    <ListItem variant="editorial" asChild>',
      '      <a href="/post">Post</a>',
      '    </ListItem>',
      '  </>',
      ');',
      ''
    ].join('\n')
  );
  write(join(project, 'src/theme/family.css'), '.eg-button { font-family: inherit; }\n');
  write(
    join(project, 'src/design-system-allowlist.ts'),
    [
      "import type { GuardAllowlistEntry } from './design-system-guard';",
      '',
      '// Exact opening tags and selectors: remove each entry when its workaround goes away.',
      'export const designSystemAllowlist: GuardAllowlistEntry[] = [',
      '];',
      ''
    ].join('\n')
  );
  write(
    join(project, 'egdev-ds.json'),
    json({ schemaVersion: 1, sourceDirectory: 'src', themeDirectory: 'src/theme/', localRepo: 'nexo', exclude: [] })
  );
  write(
    join(root, '.mcp.json'),
    json({
      mcpServers: {
        'egdev-design-system': { command: 'node', args: ['apps/hub/node_modules/@egdev/mcp/dist/index.js'] }
      }
    })
  );
  return { root, project, argument: 'apps/hub', selected, vendorName, spec };
}

// pnpm + Next.js + Tailwind, modelled on egdev-website: `vendor/egdev/`, every package pinned in
// `pnpm-workspace.yaml`, effects imported before ui (#392), a `(payload)` exclusion, symlinked installs.
export function pnpmNextFixture() {
  const project = mkdtempSync(join(tmpdir(), 'egdev-ds-pnpm-'));
  const selected = ['effects', 'tokens', 'ui', 'system', 'mcp'];
  const file = (pkg) => `vendor/egdev/${vendorName(pkg)}`;
  const spec = (pkg) => `file:./${file(pkg)}`;
  const resolutions = [];
  for (const pkg of selected) {
    const bytes = tarball(MANIFESTS[pkg]);
    write(join(project, file(pkg)), bytes);
    const store = `.pnpm/@egdev+${pkg}@file+${file(pkg).replaceAll('/', '+')}/node_modules/@egdev/${pkg}`;
    write(join(project, 'node_modules', store, 'package.json'), json(MANIFESTS[pkg]));
    mkdirSync(join(project, 'node_modules/@egdev'), { recursive: true });
    symlinkSync(`../${store}`, join(project, `node_modules/@egdev/${pkg}`));
    resolutions.push(
      `  '@egdev/${pkg}@file:${file(pkg)}':`,
      `    resolution: {integrity: ${sri(bytes)}, tarball: file:${file(pkg)}}`,
      ''
    );
  }
  const mcpStore = `node_modules/.pnpm/@egdev+mcp@file+${file('mcp').replaceAll('/', '+')}/node_modules/@egdev/mcp`;
  write(join(project, mcpStore, 'dist/index.js'), '');
  installPeers(project, { three: '0.160.0' });
  linkEngines(project);
  write(
    join(project, 'package.json'),
    json({
      name: 'egdev-website',
      private: true,
      type: 'module',
      packageManager: 'pnpm@10.34.6',
      scripts: { 'ds:doctor': 'egdev-ds doctor .' },
      dependencies: {
        '@egdev/effects': spec('effects'),
        '@egdev/tokens': spec('tokens'),
        '@egdev/ui': spec('ui'),
        next: '16.4.5',
        react: '19.3.0',
        'react-dom': '19.3.0',
        three: '0.160.0'
      },
      devDependencies: {
        '@egdev/mcp': spec('mcp'),
        '@egdev/system': spec('system'),
        '@tailwindcss/postcss': '4.3.4',
        postcss: '8.5.32',
        tailwindcss: '4.3.4',
        typescript: '6.0.3'
      }
    })
  );
  write(
    join(project, 'pnpm-workspace.yaml'),
    [
      'packages:',
      '  - .',
      '',
      '# Pin every EGDEV package to its vendored tarball, including transitive',
      '# references such as @egdev/mcp -> @egdev/system (see ADR 0007).',
      'overrides:',
      ...selected.map((pkg) => `  '@egdev/${pkg}': '${spec(pkg)}'`),
      '',
      'strictPeerDependencies: true',
      ''
    ].join('\n')
  );
  write(join(project, 'pnpm-lock.yaml'), ["lockfileVersion: '9.0'", '', 'packages:', '', ...resolutions].join('\n'));
  write(
    join(project, 'src/app/globals.css'),
    [
      '/* Design system CSS (install guide, Tailwind mode); effects before ui (#392). */',
      "@import 'tailwindcss' source(none);",
      "@import '@egdev/tokens/theme.css';",
      "@import '@egdev/effects/styles.css';",
      "@import '@egdev/ui/styles.css';",
      ''
    ].join('\n')
  );
  write(
    join(project, 'src/app/page.tsx'),
    "import { Hero } from '@egdev/ui';\n\nexport default function Page() {\n  return <Hero title='EGDEV' />;\n}\n"
  );
  write(
    join(project, 'src/app/(payload)/admin/page.tsx'),
    'export default function Admin() {\n  return <button type="button">Generated</button>;\n}\n'
  );
  write(
    join(project, 'src/components/menu.tsx'),
    'export const Menu = () => (\n  <nav>\n    <a href="/blog">Blog</a>\n  </nav>\n);\n'
  );
  write(
    join(project, 'src/design-system-allowlist.ts'),
    [
      "import type { GuardAllowlistEntry } from './design-system-guard';",
      '',
      'export const designSystemAllowlist: GuardAllowlistEntry[] = [',
      '  {',
      "    file: 'src/components/menu.tsx',",
      '    pattern: \'<a href="/blog">\',',
      "    issue: 'egdev6/egdev-design-system#390',",
      "    reason: 'Mobile menu until the DS ships one.'",
      '  }',
      '];',
      ''
    ].join('\n')
  );
  write(
    join(project, 'egdev-ds.json'),
    json({
      schemaVersion: 1,
      sourceDirectory: 'src',
      themeDirectory: 'src/theme/',
      localRepo: 'egdev-website',
      exclude: ['src/app/(payload)']
    })
  );
  write(
    join(project, '.mcp.json'),
    json({
      mcpServers: { 'egdev-design-system': { command: 'node', args: ['node_modules/@egdev/mcp/dist/index.js'] } }
    })
  );
  return { root: project, project, argument: '.', selected, vendorName, spec };
}

// A `release:pack` folder for the fixture set: tarballs plus `release.json` (spec §3).
export function releaseFixture(selected = ['tokens', 'ui', 'effects', 'system', 'mcp'], commit = COMMIT) {
  const directory = mkdtempSync(join(tmpdir(), 'egdev-ds-release-'));
  const packages = selected.map((pkg) => {
    const bytes = tarball(MANIFESTS[pkg]);
    const file = `egdev-${pkg}-${MANIFESTS[pkg].version}.tgz`;
    write(join(directory, file), bytes);
    return { name: MANIFESTS[pkg].name, version: MANIFESTS[pkg].version, file, sha256: sha256(bytes) };
  });
  write(join(directory, 'release.json'), json({ schemaVersion: 1, commit, dirty: false, packages }));
  return directory;
}

// Content, mode, mtime and link targets of every entry, without following symlinks: proves that a
// command wrote, renamed, created and removed nothing.
export function treeHash(directory) {
  const hash = createHash('sha256');
  const visit = (path, relative) => {
    const stat = lstatSync(path);
    hash.update(`${relative}\0${stat.mode}\0`);
    if (stat.isSymbolicLink()) {
      hash.update(`link:${readlinkSync(path)}\0`);
    } else if (stat.isDirectory()) {
      for (const name of readdirSync(path).sort()) {
        visit(join(path, name), `${relative}/${name}`);
      }
    } else {
      hash.update(`${stat.mtimeMs}\0`);
      hash.update(readFileSync(path));
    }
  };
  visit(directory, '.');
  return hash.digest('hex');
}

export function runBin(args, cwd) {
  const result = spawnSync(process.execPath, [bin, ...args], { cwd, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

// In-process run with captured streams, for the many doctor cases.
export async function runInProcess(run, args, cwd) {
  let stdout = '';
  let stderr = '';
  const status = await run(args, {
    cwd,
    stdout: (text) => {
      stdout += text;
    },
    stderr: (text) => {
      stderr += text;
    }
  });
  return { status, stdout, stderr };
}
