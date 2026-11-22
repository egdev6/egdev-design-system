import assert from 'node:assert/strict';
import {
  chmodSync,
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs';
import { basename, join } from 'node:path';
import { after, test } from 'node:test';
import {
  COMMIT,
  FULL_SET,
  freshNpmVite,
  MANIFESTS,
  npmViteFixture,
  OTHER_COMMIT,
  releaseFixture,
  runBin,
  sha256,
  tarball,
  treeContents,
  treeHash,
  write
} from './helpers.mjs';

const scratch = [];
after(() => {
  for (const path of scratch) {
    rmSync(path, { recursive: true, force: true });
  }
});
const track = (fixture) => {
  scratch.push(fixture.root);
  return fixture;
};
const release = (commit = COMMIT) => {
  const directory = releaseFixture(FULL_SET, commit);
  scratch.push(directory);
  return directory;
};

const AGENTS = 'AGENTS.md';
const CONTRIBUTING = 'CONTRIBUTING.md';
const START = '<!-- egdev-ds:agents -->';
const END = '<!-- /egdev-ds:agents -->';
const CONTRIBUTING_START = '<!-- egdev-ds:consumer-requests -->';
const CONTRIBUTING_END = '<!-- /egdev-ds:consumer-requests -->';
const BLOCK = [
  START,
  '## EGDEV design system',
  '',
  '- Before writing UI, use `@egdev/ui` and `@egdev/tokens` and query the `egdev-design-system` MCP server.',
  '- Stay within component APIs: no appearance or layout CSS on classes passed to DS components (DS046).',
  '- Do not select component internals (DS041, DS047) or look up `.eg-*` markup in code (DS048).',
  '- Do not hand-write colors, spacing or fonts.',
  '- If the DS lacks something, stop that part and open a Consumer request describing the need: https://github.com/egdev6/egdev-design-system/issues/new?template=consumer_request.yml',
  '- Mitigate only by composing DS parts with `// TODO(egdev-design-system#N)` and an issue-backed allowlist entry.',
  '- Never edit vendored tarballs, `egdev-ds.json` or `@egdev/*` lockfile entries.',
  '- Flow: https://github.com/egdev6/egdev-design-system/blob/main/docs/distribution/consumer-requests.md.',
  END,
  ''
].join('\n');
const DETAIL = 'design system agent rules';
const CONTRIBUTING_DETAIL = 'consumer requests summary';
const C7 = COMMIT.slice(0, 7);
const file = (pkg) => `vendor/egdev/egdev-${pkg}-${MANIFESTS[pkg].version}-${C7}.tgz`;
const spec = (pkg) => `file:./${file(pkg)}`;
const line = (verb, path, detail) => `  ${verb.padEnd(8)}${path}${detail ? `  ${detail}` : ''}`;
const copy = (pkg) => line('copy', file(pkg), `sha256 ${sha256(tarball(MANIFESTS[pkg])).slice(0, 12)}…`);
const guideAction = (verb, path, detail) => (verb === null ? [] : [line(verb, path, detail)]);

function plan(fixture, from, { agents = 'create', contributing = 'create', localRepo = 'hub' } = {}) {
  return [
    `egdev-ds init ${fixture.argument} (npm, vite, native) from ${from} at ${C7}`,
    ...['tokens', 'ui', 'system', 'mcp', 'cli'].map(copy),
    line('edit', 'package.json', `dependencies.@egdev/tokens = ${spec('tokens')}`),
    line('edit', 'package.json', `dependencies.@egdev/ui = ${spec('ui')}`),
    line('edit', 'package.json', `devDependencies.@egdev/system = ${spec('system')}`),
    line('edit', 'package.json', `devDependencies.@egdev/mcp = ${spec('mcp')}`),
    line('edit', 'package.json', `devDependencies.@egdev/cli = ${spec('cli')}`),
    line('keep', 'package.json', 'dependencies.react = ^19.3.0'),
    line('keep', 'package.json', 'dependencies.react-dom = ^19.3.0'),
    line('edit', 'package.json', 'scripts.ds:doctor = egdev-ds doctor .'),
    line('edit', 'package.json', 'overrides.@egdev/system = $@egdev/system'),
    line('edit', 'src/index.css', '+@import "@egdev/tokens/tokens.css"'),
    line('edit', 'src/index.css', '+@import "@egdev/ui/styles.css"'),
    line('create', 'egdev-ds.json', `localRepo=${localRepo}`),
    line('create', '.mcp.json', 'mcpServers.egdev-design-system'),
    ...guideAction(contributing, CONTRIBUTING, CONTRIBUTING_DETAIL),
    ...guideAction(agents, AGENTS, DETAIL)
  ];
}

function output(fixture, from, options = {}) {
  return [
    ...plan(fixture, from, options),
    `Initialized at ${C7}; integrities unverified (--no-install).`,
    'Next steps:',
    '  Run npm install.',
    '  Restart the dev server with --force.',
    '  Regenerate design/system.md with egdev-system-md --write.',
    '  Add npm run ds:doctor to CI.',
    ...(options.next ?? []),
    'Review the diff before committing.',
    ''
  ].join('\n');
}

function markRepository(fixture, directory = fixture.root) {
  write(join(directory, '.git'), 'gitdir: fixture\n');
  return fixture;
}

function init(fixture, from, ...args) {
  return runBin(['init', fixture.argument, '--from', from, '--no-install', ...args], fixture.root);
}

test('S8 fresh init creates the precise agent rules and plans both guides in order', () => {
  const fixture = track(freshNpmVite());
  const from = release();
  assert.deepEqual(init(fixture, from), { status: 0, stdout: output(fixture, from), stderr: '' });
  assert.equal(readFileSync(join(fixture.project, AGENTS), 'utf8'), BLOCK);
  assert.ok(readFileSync(join(fixture.project, CONTRIBUTING), 'utf8').includes(CONTRIBUTING_START));
  const settled = treeHash(fixture.root);
  const header = `egdev-ds init ${fixture.argument} (npm, vite, native) from ${from} at ${C7}`;
  assert.deepEqual(init(fixture, from), {
    status: 0,
    stdout: `${header}\nAlready at ${C7}; integrities unverified (--no-install); no changes.\n`,
    stderr: ''
  });
  assert.equal(treeHash(fixture.root), settled);
});

test('S8 append preserves every byte and only adds missing blank-line separation in LF and CRLF', () => {
  const from = release();
  const cases = [
    ['', '', '\n'],
    ['# Guide', '# Guide\n\n', '\n'],
    ['# Guide\n', '# Guide\n\n', '\n'],
    ['# Guide\n\n\n', '# Guide\n\n\n', '\n'],
    ['# Guide\n \t\n', '# Guide\n \t\n', '\n'],
    ['# Guide\r\n', '# Guide\r\n\r\n', '\r\n'],
    ['# Guide\r\nNo newline', '# Guide\r\nNo newline\r\n\r\n', '\r\n'],
    ['# Guide\r\n\r\n', '# Guide\r\n\r\n', '\r\n'],
    [Buffer.from([0x23, 0x20, 0xff]), Buffer.from([0x23, 0x20, 0xff, 0x0a, 0x0a]), '\n']
  ];
  for (const [original, prefix, eol] of cases) {
    const fixture = track(freshNpmVite());
    const path = join(fixture.project, AGENTS);
    writeFileSync(path, original);
    assert.deepEqual(init(fixture, from), {
      status: 0,
      stdout: output(fixture, from, { agents: 'edit' }),
      stderr: ''
    });
    assert.deepEqual(
      readFileSync(path),
      Buffer.concat([Buffer.from(prefix), Buffer.from(BLOCK.replaceAll('\n', eol))])
    );
  }
});

test('S8 an ordered marked project block is untouched; reversed or incomplete markers are appended', () => {
  const from = release();
  for (const [original, verb, expected] of [
    [`# Guide\r\n\r\n${START}\r\nCustom rules.\r\n${END}\r\n`, null, null],
    [`${END}\n${START}\nUnfinished.\n`, 'edit', `${END}\n${START}\nUnfinished.\n\n${BLOCK}`]
  ]) {
    const fixture = track(freshNpmVite());
    const path = join(fixture.project, AGENTS);
    writeFileSync(path, original);
    const before = treeHash(path);
    assert.deepEqual(init(fixture, from), {
      status: 0,
      stdout: output(fixture, from, { agents: verb }),
      stderr: ''
    });
    assert.equal(readFileSync(path, 'utf8'), expected ?? original);
    if (verb === null) {
      assert.equal(treeHash(path), before);
    }
  }
});

test('S8 nearest unmarked ancestor is a manual next step, without modifying either ancestor', () => {
  const fixture = markRepository(track(freshNpmVite()));
  const from = release();
  const root = join(fixture.root, AGENTS);
  const nearest = join(fixture.root, 'apps', AGENTS);
  write(root, '# Root\n');
  write(nearest, '# Apps\r\n');
  const before = [treeHash(root), treeHash(nearest)];
  assert.deepEqual(init(fixture, from), {
    status: 0,
    stdout: output(fixture, from, {
      agents: null,
      localRepo: basename(fixture.root),
      next: ['  Add the design system agent rules to ../AGENTS.md.']
    }),
    stderr: ''
  });
  assert.equal(existsSync(join(fixture.project, AGENTS)), false);
  assert.deepEqual([treeHash(root), treeHash(nearest)], before);
});

test('S8 a marked ancestor suppresses changes even with nearer unmarked files', () => {
  const fixture = markRepository(track(freshNpmVite()));
  const from = release();
  const root = join(fixture.root, AGENTS);
  const nearest = join(fixture.root, 'apps', AGENTS);
  const project = join(fixture.project, AGENTS);
  write(root, `${START}\nUser rules.\n${END}\n`);
  write(nearest, '# Apps\n');
  write(project, '# Project\n');
  const before = [root, nearest, project].map(treeHash);
  assert.deepEqual(init(fixture, from), {
    status: 0,
    stdout: output(fixture, from, { agents: null, localRepo: basename(fixture.root) }),
    stderr: ''
  });
  assert.deepEqual([root, nearest, project].map(treeHash), before);
});

test('S8 an unmarked project guide takes precedence over an unmarked ancestor', () => {
  const fixture = markRepository(track(freshNpmVite()));
  const from = release();
  const ancestor = join(fixture.root, AGENTS);
  const project = join(fixture.project, AGENTS);
  write(ancestor, '# Repository\n');
  write(project, '# Project\n');
  const before = treeHash(ancestor);
  assert.deepEqual(init(fixture, from), {
    status: 0,
    stdout: output(fixture, from, { agents: 'edit', localRepo: basename(fixture.root) }),
    stderr: ''
  });
  assert.equal(readFileSync(project, 'utf8'), `# Project\n\n${BLOCK}`);
  assert.equal(treeHash(ancestor), before);
});

test('S8 search stops at the nearest repository root, or at the project without one', () => {
  const from = release();
  for (const hasRoot of [true, false]) {
    const fixture = track(freshNpmVite());
    if (hasRoot) {
      markRepository(fixture, join(fixture.root, 'apps'));
    }
    const outside = join(fixture.root, AGENTS);
    write(outside, `${START}\n${END}\n`);
    const before = treeHash(outside);
    assert.deepEqual(init(fixture, from), {
      status: 0,
      stdout: output(fixture, from, { localRepo: hasRoot ? 'apps' : 'hub' }),
      stderr: ''
    });
    assert.equal(readFileSync(join(fixture.project, AGENTS), 'utf8'), BLOCK);
    assert.equal(treeHash(outside), before);
  }
});

test('S8 linked and irregular project guides are never written and request a manual step', () => {
  const from = release();
  for (const kind of ['symlink', 'hardlink', 'dangling', 'directory']) {
    const fixture = track(freshNpmVite());
    const target = join(fixture.root, 'guide.md');
    const path = join(fixture.project, AGENTS);
    if (kind === 'directory') {
      mkdirSync(path);
    } else if (kind === 'dangling') {
      symlinkSync(target, path);
    } else {
      writeFileSync(target, '# Keep these bytes\n');
      if (kind === 'symlink') {
        symlinkSync(target, path);
      } else {
        linkSync(target, path);
      }
    }
    const before = treeHash(path);
    const targetBefore = existsSync(target) ? treeHash(target) : null;
    assert.deepEqual(init(fixture, from), {
      status: 0,
      stdout: output(fixture, from, {
        agents: null,
        next: ['  Add the design system agent rules to AGENTS.md by hand; it is a link or not a regular file.']
      }),
      stderr: ''
    });
    assert.equal(treeHash(path), before);
    if (targetBefore !== null) {
      assert.equal(treeHash(target), targetBefore);
    }
    if (kind === 'symlink' || kind === 'dangling') {
      assert.ok(lstatSync(path).isSymbolicLink());
    }
  }
});

test('S8 marked linked project files and marked ancestors need no action even with an unmarked link', () => {
  const from = release();
  for (const markerAtAncestor of [false, true]) {
    const fixture = markRepository(track(freshNpmVite()));
    const target = join(fixture.root, 'guide.md');
    const path = join(fixture.project, AGENTS);
    write(target, markerAtAncestor ? '# Linked guide\n' : `${START}\nCustom.\n${END}\n`);
    symlinkSync(target, path);
    if (markerAtAncestor) {
      write(join(fixture.root, AGENTS), `${START}\nAncestor.\n${END}\n`);
    }
    const before = treeHash(target);
    assert.deepEqual(init(fixture, from), {
      status: 0,
      stdout: output(fixture, from, { agents: null, localRepo: basename(fixture.root) }),
      stderr: ''
    });
    assert.equal(treeHash(target), before);
    assert.ok(lstatSync(path).isSymbolicLink());
  }
});

test('PRESERVE an unmarked linked CONTRIBUTING file still takes precedence over a marked ancestor', () => {
  const fixture = markRepository(track(freshNpmVite()));
  const from = release();
  const target = join(fixture.root, 'linked-guide.md');
  const link = join(fixture.project, CONTRIBUTING);
  write(target, '# Linked guide\n');
  write(join(fixture.root, CONTRIBUTING), `${CONTRIBUTING_START}\n${CONTRIBUTING_END}\n`);
  write(join(fixture.project, AGENTS), `${START}\n${END}\n`);
  symlinkSync(target, link);
  const before = treeHash(target);
  assert.deepEqual(init(fixture, from), {
    status: 0,
    stdout: output(fixture, from, {
      contributing: null,
      agents: null,
      localRepo: basename(fixture.root),
      next: ['  Add the consumer requests summary to CONTRIBUTING.md by hand; it is a link or not a regular file.']
    }),
    stderr: ''
  });
  assert.equal(treeHash(target), before);
  assert.ok(lstatSync(link).isSymbolicLink());
});

test('S8 dry-run JSON plans both guide actions, including edit, without any writes', () => {
  const from = release();
  for (const verb of ['create', 'edit']) {
    const fixture = track(freshNpmVite());
    if (verb === 'edit') {
      write(join(fixture.project, AGENTS), '# Existing\r\n');
    }
    const before = [treeHash(fixture.root), treeHash(from)];
    const result = init(fixture, from, '--dry-run', '--json');
    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    const document = JSON.parse(result.stdout);
    assert.equal(result.stdout, `${JSON.stringify(document, null, 2)}\n`);
    assert.equal(document.result, 'planned');
    assert.deepEqual(
      document.actions.filter(({ path }) => path === CONTRIBUTING || path === AGENTS),
      [
        { verb: 'create', path: CONTRIBUTING, detail: CONTRIBUTING_DETAIL },
        { verb, path: AGENTS, detail: DETAIL }
      ]
    );
    assert.deepEqual([treeHash(fixture.root), treeHash(from)], before);
  }
});

test('S8 already-vendored init backfills both guides transactionally, then is current', () => {
  const fixture = track(npmViteFixture());
  const from = release();
  const before = treeHash(fixture.root);
  const expected = {
    schemaVersion: 1,
    command: 'init',
    project: fixture.argument,
    packageManager: 'npm',
    framework: 'vite',
    cssMode: 'native',
    release: { dir: from, commit: COMMIT },
    actions: [
      { verb: 'create', path: CONTRIBUTING, detail: CONTRIBUTING_DETAIL },
      { verb: 'create', path: AGENTS, detail: DETAIL }
    ],
    findings: [],
    result: 'planned'
  };
  assert.deepEqual(init(fixture, from, '--dry-run', '--json'), {
    status: 0,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(fixture.root), before);
  assert.deepEqual(init(fixture, from, '--json'), {
    status: 0,
    stdout: `${JSON.stringify({ ...expected, result: 'applied' }, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(readFileSync(join(fixture.project, AGENTS), 'utf8'), BLOCK);
  assert.ok(readFileSync(join(fixture.project, CONTRIBUTING), 'utf8').includes(CONTRIBUTING_START));
  const settled = treeHash(fixture.root);
  assert.deepEqual(init(fixture, from, '--json'), {
    status: 0,
    stdout: `${JSON.stringify({ ...expected, actions: [], result: 'current' }, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(fixture.root), settled);
});

test('S8 already-vendored backfill keeps the other guide manual next step, in both directions', () => {
  const from = release();
  for (const ancestor of [CONTRIBUTING, AGENTS]) {
    const fixture = markRepository(track(npmViteFixture()));
    const target = join(fixture.root, ancestor);
    write(target, '# Existing ancestor\n');
    const before = treeHash(target);
    const other = ancestor === AGENTS ? CONTRIBUTING : AGENTS;
    const detail = ancestor === AGENTS ? DETAIL : CONTRIBUTING_DETAIL;
    const otherDetail = other === AGENTS ? DETAIL : CONTRIBUTING_DETAIL;
    const header = `egdev-ds init ${fixture.argument} (npm, vite, native) from ${from} at ${C7}`;
    const stdout = [
      header,
      line('create', other, otherDetail),
      `Initialized at ${C7}; integrities unverified (--no-install).`,
      'Next steps:',
      '  Run npm install.',
      '  Restart the dev server with --force.',
      '  Regenerate design/system.md with egdev-system-md --write.',
      '  Add npm run ds:doctor to CI.',
      `  Add the ${detail} to ../../${ancestor}.`,
      'Review the diff before committing.',
      ''
    ].join('\n');
    assert.deepEqual(init(fixture, from), { status: 0, stdout, stderr: '' });
    assert.equal(treeHash(target), before);
    assert.equal(existsSync(join(fixture.project, ancestor)), false);
    assert.equal(existsSync(join(fixture.project, other)), true);
  }
});

test('S8 already-vendored unmarked ancestors report both manual steps without writes or JSON actions', () => {
  const fixture = markRepository(track(npmViteFixture()));
  const from = release();
  write(join(fixture.root, CONTRIBUTING), '# Repository guide\n');
  write(join(fixture.root, AGENTS), '# Agent guide\n');
  const before = treeHash(fixture.root);
  const header = `egdev-ds init ${fixture.argument} (npm, vite, native) from ${from} at ${C7}`;
  assert.deepEqual(init(fixture, from), {
    status: 0,
    stdout: [
      header,
      `Already at ${C7}; integrities unverified (--no-install); no changes.`,
      'Next steps:',
      '  Add the consumer requests summary to ../../CONTRIBUTING.md.',
      '  Add the design system agent rules to ../../AGENTS.md.',
      ''
    ].join('\n'),
    stderr: ''
  });
  const expected = {
    schemaVersion: 1,
    command: 'init',
    project: fixture.argument,
    packageManager: 'npm',
    framework: 'vite',
    cssMode: 'native',
    release: { dir: from, commit: COMMIT },
    actions: [],
    findings: [],
    result: 'current'
  };
  assert.deepEqual(init(fixture, from, '--json'), {
    status: 0,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(fixture.root), before);
});

test('S8 rollback restores existing agent bytes or removes a created guide when install fails', () => {
  const from = release();
  for (const original of [null, Buffer.from('# Agent guide\r\nKeep these bytes.\r\n')]) {
    const fixture = track(freshNpmVite());
    const path = join(fixture.project, AGENTS);
    if (original !== null) {
      writeFileSync(path, original);
    }
    const executable = join(fixture.root, 'fake-bin/npm');
    write(
      executable,
      '#!/bin/sh\nif [ -f AGENTS.md ] && [ -f CONTRIBUTING.md ]; then\n  echo fixture install failure >&2\n  exit 7\nfi\necho missing guides >&2\nexit 8\n'
    );
    // The executable and all test state live in this fixture's system-temp directory.
    chmodSync(executable, 0o755);
    const before = treeContents(fixture.project);
    const previousPath = process.env.PATH;
    let result;
    try {
      process.env.PATH = `${join(fixture.root, 'fake-bin')}:${previousPath ?? ''}`;
      result = runBin(['init', fixture.argument, '--from', from], fixture.root);
    } finally {
      if (previousPath === undefined) {
        delete process.env.PATH;
      } else {
        process.env.PATH = previousPath;
      }
    }
    assert.deepEqual(result, {
      status: 1,
      stdout: [
        ...plan(fixture, from, { agents: original === null ? 'create' : 'edit' }),
        line('run', 'npm install'),
        ''
      ].join('\n'),
      stderr: 'fixture install failure\nnpm install failed (exit 7); rolled back.\n'
    });
    assert.deepEqual(treeContents(fixture.project), before);
    assert.equal(existsSync(path), original !== null);
    if (original !== null) {
      assert.deepEqual(readFileSync(path), original);
    }
  }
});

test('S8 upgrade and upgrade --add do not create or edit AGENTS.md', () => {
  const from = release(OTHER_COMMIT);
  for (const add of [[], ['--add', 'cli']]) {
    for (const existing of [false, true]) {
      const fixture = track(npmViteFixture());
      const path = join(fixture.project, AGENTS);
      if (existing) {
        write(path, `# Guide\r\n${START}\r\nCustom.\r\n${END}\r\n`);
      }
      const before = existing ? treeHash(path) : null;
      const result = runBin(
        ['upgrade', fixture.argument, '--from', from, ...add, '--no-install', '--json'],
        fixture.root
      );
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stderr, '');
      const document = JSON.parse(result.stdout);
      assert.equal(result.stdout, `${JSON.stringify(document, null, 2)}\n`);
      assert.equal(document.result, 'applied');
      assert.deepEqual(
        document.actions.filter((action) => action.path === AGENTS),
        []
      );
      assert.equal(existsSync(path), existing);
      if (existing) {
        assert.equal(treeHash(path), before);
      }
    }
  }
});
