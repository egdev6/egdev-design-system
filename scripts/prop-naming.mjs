import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = fileURLToPath(new URL('../', import.meta.url));
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const fold = (value) => value.normalize('NFC').toLowerCase();
function compare(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
function requireValid(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
function record(value, fields) {
  requireValid(value && typeof value === 'object' && !Array.isArray(value), 'Expected object');
  requireValid(
    fields.every((key) => Object.hasOwn(value, key)) && Object.keys(value).every((key) => fields.includes(key)),
    `Expected fields: ${fields.join(', ')}`
  );
}
function claim(set, key, kind) {
  requireValid(!set.has(key), `Duplicate ${kind}: ${key}`);
  set.add(key);
}
// Check lexical containment and real ancestors, including symlinks and absent output leaves.
function safePath(root, path, io) {
  requireValid(
    text(path) &&
      !isAbsolute(path) &&
      !path.includes('\\') &&
      path.split('/').every((part) => part && part !== '.' && part !== '..'),
    `Invalid relative path: ${path}`
  );
  const base = io.realpathSync(root);
  const target = resolve(base, path);
  const inside = (candidate) => {
    const rel = relative(base, candidate);
    return !isAbsolute(rel) && rel !== '..' && !rel.startsWith('../');
  };
  requireValid(inside(target), `Path outside root: ${path}`);
  let ancestor = target;
  while (true) {
    try {
      io.lstatSync(ancestor);
      break;
    } catch (error) {
      if (error.code !== 'ENOENT' || ancestor === base) {
        throw error;
      }
      ancestor = dirname(ancestor);
    }
  }
  const realAncestor = io.realpathSync(ancestor);
  requireValid(inside(realAncestor), `Path outside root: ${path}`);
  return { target, ancestor, realAncestor };
}
function evidencePath(root, path, io) {
  const { target } = safePath(root, path, io);
  requireValid(io.statSync(target).isFile(), `Evidence must be a file: ${path}`);
  return target;
}
function generatedPath(root, path, io) {
  const { target, ancestor, realAncestor } = safePath(root, path, io);
  requireValid(realAncestor === ancestor, 'Generated output must not follow symlinks');
  return target;
}

const sha256 = (bytes) => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const hashPattern = /^sha256:[a-f0-9]{64}$/;
const propPattern = /^[a-z][a-z0-9]*$/i;
const trimmed = (value) => text(value) && value === value.trim();

// Canonical JSON: recursively sorted object keys, compact JSON, UTF-8, no final newline.
// Semantic sets are sorted too; observations and all approval metadata are excluded.
function canonicalJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}
const exceptionPayload = ({ scope, propName, reason }) => ({ scope, propName, reason });
export function exceptionHash(exception) {
  return sha256(canonicalJson(exceptionPayload(exception)));
}
export function conventionHash(entry) {
  const { id, name, meaning, whenToUse, avoid, status, aliases, exceptions } = entry;
  return sha256(
    canonicalJson({
      id,
      name,
      meaning,
      whenToUse,
      avoid,
      status,
      aliases: [...aliases].sort(compare),
      exceptions: exceptions.map(exceptionPayload).sort((a, b) => compare(canonicalJson(a), canonicalJson(b)))
    })
  );
}

// A recoverable location is structural evidence only, never proof of human consent.
function approvalReference(reference, root, io) {
  requireValid(trimmed(reference), 'Invalid approval reference');
  if (reference.startsWith('https://')) {
    const url = URL.parse(reference);
    requireValid(
      url &&
        url.protocol === 'https:' &&
        url.hostname &&
        !url.username &&
        !url.password &&
        !/\s/.test(reference) &&
        (url.pathname !== '/' || text(url.hash.slice(1))),
      'Invalid approval reference'
    );
  } else {
    const [path, anchor, ...extra] = reference.split('#');
    requireValid(extra.length === 0 && (anchor === undefined || text(anchor)), 'Invalid approval reference');
    evidencePath(root, path, io);
  }
}
function validateApproval(approval, scope, hash, root, io) {
  requireValid(approval !== null, `Missing approval: ${scope}`);
  record(approval, ['reference', 'scope', 'contentHash']);
  requireValid(trimmed(approval.scope) && approval.scope === scope, `Invalid approval scope: ${scope}`);
  approvalReference(approval.reference, root, io);
  requireValid(
    typeof approval.contentHash === 'string' && hashPattern.test(approval.contentHash) && approval.contentHash === hash,
    `Stale or invalid approval contentHash: ${scope}`
  );
}
function validateSource(source, root, io) {
  record(source, ['path', 'symbol', 'revision']);
  requireValid(trimmed(source.symbol), 'Invalid evidence symbol');
  requireValid(typeof source.revision === 'string' && hashPattern.test(source.revision), 'Invalid evidence revision');
  const path = evidencePath(root, source.path, io);
  requireValid(source.revision === sha256(io.readFileSync(path)), `Stale evidence revision: ${source.path}`);
}

export function validateRegistry(registry, { root = defaultRoot, io = fs } = {}) {
  requireValid(Array.isArray(registry) && registry.length > 0, 'Registry must be a nonempty array');
  const ids = new Set();
  const names = new Set();
  const publicUsages = new Set();
  const approvedAlternatives = [];
  for (const entry of registry) {
    record(entry, [
      'id',
      'name',
      'meaning',
      'whenToUse',
      'avoid',
      'status',
      'approval',
      'aliases',
      'exceptions',
      'usages'
    ]);
    for (const key of ['id', 'name', 'meaning', 'whenToUse', 'avoid']) {
      requireValid(text(entry[key]) && entry[key] === entry[key].trim(), `Invalid ${key}`);
    }
    requireValid(
      /^[a-z][a-z0-9-]*$/i.test(entry.id) && /^[a-z][a-z0-9]*$/i.test(entry.name),
      'Invalid ID or prop name'
    );
    requireValid(['proposed', 'approved', 'deprecated'].includes(entry.status), 'Invalid convention status');
    claim(ids, fold(entry.id), 'semantic ID');
    claim(names, fold(entry.name), 'canonical name or alias');
    requireValid(
      Array.isArray(entry.aliases) && Array.isArray(entry.exceptions) && Array.isArray(entry.usages),
      'Expected arrays'
    );
    for (const alias of entry.aliases) {
      requireValid(text(alias) && /^[a-z][a-z0-9]*$/i.test(alias), 'Invalid alias');
      claim(names, fold(alias), 'canonical name or alias');
    }
    const exceptions = new Set();
    for (const exception of entry.exceptions) {
      record(exception, ['scope', 'propName', 'reason', 'approval']);
      requireValid(
        trimmed(exception.scope) && propPattern.test(exception.scope) && trimmed(exception.reason),
        'Exception requires component scope and reason'
      );
      requireValid(
        typeof exception.propName === 'string' &&
          propPattern.test(exception.propName) &&
          fold(exception.propName) !== fold(entry.name),
        'Exception requires an alternative propName'
      );
      const publicKey = `${fold(exception.scope)}:${fold(exception.propName)}`;
      claim(exceptions, publicKey, 'scoped exception');
      if (exception.approval !== null) {
        validateApproval(
          exception.approval,
          `exception:${entry.id}:${exception.scope}:${exception.propName}`,
          exceptionHash(exception),
          root,
          io
        );
        approvedAlternatives.push(publicKey);
      }
    }
    if (entry.status === 'proposed') {
      requireValid(entry.approval === null, 'Proposed convention approval must be null');
    } else {
      validateApproval(entry.approval, `convention:${entry.id}`, conventionHash(entry), root, io);
    }
    const components = new Set();
    for (const usage of entry.usages) {
      record(usage, ['component', 'type', 'status', 'source']);
      requireValid(
        trimmed(usage.component) && !usage.component.includes(':') && text(usage.type),
        'Invalid component or type'
      );
      requireValid(['existing', 'proposed'].includes(usage.status), 'Invalid usage status');
      claim(components, fold(usage.component), 'component usage');
      claim(publicUsages, `${fold(usage.component)}:${fold(entry.name)}`, 'public usage');
      validateSource(usage.source, root, io);
    }
  }
  // Check after collecting canonical usages so entry ordering cannot hide collisions.
  for (const key of approvedAlternatives) {
    claim(publicUsages, key, 'public usage');
  }
  return registry;
}

export function renderRegistry(registry) {
  const cell = (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('|', '&#124;')
      .replace(/\r?\n/g, '<br>');
  const sorted = (values, key) => [...values].sort((a, b) => compare(key(a), key(b)));
  const approvalText = (approval) =>
    approval === null
      ? 'None recorded'
      : `Reference: ${cell(approval.reference)}; scope: ${cell(approval.scope)}; contentHash: ${cell(approval.contentHash)}`;
  const lines = [
    '# Prop naming registry',
    '',
    '<!-- Generated from skills/_shared/prop-naming.json by scripts/prop-naming.mjs. Do not edit. -->',
    '',
    '## How to use',
    '',
    '- Look up both meaning and name before proposing a prop; review semantic meaning with a human.',
    '- Reuse a matching responsibility and append its component usage; propose a new semantic ID for a new responsibility.',
    '- Existing usage is evidence, never automatic global approval. Conventions start as proposed and require separate scoped approval.',
    '- Aliases are search references, not accepted extra API props. Exceptions record component scope, alternative propName and reason; null approval means pending, never API permission.',
    '- Native attributes are not proprietary conventions unless an explicit semantic policy is proposed.',
    '- Types belong to each component: no universal type requirement or forced API migration.',
    '- Validation checks schema, case-folded collisions, repository containment, approval structure/content hashes and evidence file hashes. It cannot prove meaning, human consent, symbol existence or actual TypeScript types; no parser or network lookup is used.',
    '- Update the JSON, then run `pnpm props:docs` and `pnpm props:check`; `--check` (default) never writes. `--write` regenerates only this view, never approval or evidence hashes.',
    '',
    '## Approval and reviewed-source evidence',
    '',
    '- A proposed convention has `approval: null`. Approved/deprecated conventions require `{reference, scope, contentHash}`; the exact scope is `convention:<entry.id>` (case-sensitive). Status changes require a new matching approval.',
    '- A recoverable reference is an HTTPS resource URL (path or fragment, no embedded credentials), or an existing repository-relative file with an optional non-empty #locator. Structure/local existence is checked, not external accessibility or authenticity. A human must recover and inspect the actual scoped decision; never invent approval.',
    '- An exception is `{scope, propName, reason, approval}`: scope is one alphanumeric component name starting with a letter, not a wildcard; propName is the alternative public name, not a global alias. Approved exceptions require approval scope `exception:<entry.id>:<scope>:<propName>`. Pending exceptions grant no permission; approved alternatives must not collide with another recorded public name in that component.',
    '- `conventionHash(entry)` and `exceptionHash(exception)`, exported by scripts/prop-naming.mjs, return `sha256:<64 lowercase hex digits>`. Canonicalization uses compact JSON, recursively sorted object keys (JavaScript string order), UTF-8 and no final newline; strings are unchanged. Aliases and exception payloads are sorted as semantic sets; other array order is preserved.',
    '- The convention payload is exactly `{id, name, meaning, whenToUse, avoid, status, aliases, exceptions}`, with exceptions reduced to `{scope, propName, reason}`. It excludes all approvals and usage observations: appending a component usage or recording an exception approval cannot change global approval content. Exception hashes cover exactly `{scope, propName, reason}`, excluding their own approval. Changed semantic content requires fresh scoped approval, not merely a recalculated digest.',
    '- Each usage source is `{path, symbol, revision}`: a repository-confined actual file, the manually inspected public API symbol (for example TabsProps or GaugeProps), and `sha256:<whole-file byte hash>` of the reviewed working-tree file. These are content revisions, not invented Git commits. Initial evidence was manually read, including Gauge draft v0.6; numeric `GaugeSize | number` CSS-pixel ability is confirmed, not overall API approval.',
    '- Source freshness is intentionally conservative: even an unrelated edit anywhere in that file invalidates its evidence. Re-read the source and explicitly update JSON after human API review; matching bytes alone do not establish name/type correctness or review quality.',
    '',
    '## Conventions and observed usages',
    '',
    '| Name / semantic ID | Meaning | Use / avoid | Convention status / approval evidence | Component types, usage status and evidence | Aliases / scoped exceptions |',
    '| --- | --- | --- | --- | --- | --- |'
  ];
  for (const entry of [...registry].sort((a, b) => compare(a.name, b.name))) {
    const usages = sorted(entry.usages, (u) => u.component)
      .map(
        (u) =>
          `${cell(u.component)}: ${cell(u.type)} (${u.status}); path: ${cell(u.source.path)}; symbol: ${cell(u.source.symbol)}; revision: ${cell(u.source.revision)}`
      )
      .join('<br>');
    const notes = [
      ...sorted(entry.aliases, (a) => a).map((a) => `Alias: ${cell(a)}`),
      ...sorted(entry.exceptions, (e) => canonicalJson(exceptionPayload(e))).map(
        (e) =>
          `${e.approval === null ? 'Pending' : 'Approved'} exception (${cell(e.scope)} → ${cell(e.propName)}): ${cell(e.reason)}; ${approvalText(e.approval)}`
      )
    ].join('<br>');
    lines.push(
      `| ${cell(entry.name)} / ${cell(entry.id)} | ${cell(entry.meaning)} | Use: ${cell(entry.whenToUse)}<br>Avoid: ${cell(entry.avoid)} | ${entry.status}; ${approvalText(entry.approval)} | ${usages || 'None recorded'} | ${notes || 'None'} |`
    );
  }
  return `${lines.join('\n')}\n`;
}

// Injectable I/O keeps CLI behavior tests in memory; normal CLI writes only the generated view.
export function runCli(
  args,
  {
    root = defaultRoot,
    registryPath = 'skills/_shared/prop-naming.json',
    outputPath = 'docs/prop-naming.md',
    io = fs,
    log = (message) => console.error(message)
  } = {}
) {
  try {
    requireValid(
      args.length <= 1 && (args.length === 0 || ['--check', '--write'].includes(args[0])),
      'Unknown or conflicting flags'
    );
    const input = evidencePath(root, registryPath, io);
    const output = generatedPath(root, outputPath, io);
    requireValid(input !== output, 'Output must differ from registry');
    const registry = validateRegistry(JSON.parse(io.readFileSync(input, 'utf8')), { root, io });
    const rendered = renderRegistry(registry);
    if (args[0] === '--write') {
      io.writeFileSync(output, rendered, 'utf8');
      log('Prop naming view regenerated.');
    } else {
      requireValid(io.readFileSync(output, 'utf8') === rendered, 'Prop naming view is stale; run with --write.');
      log('Prop naming registry valid; view up to date.');
    }
    return 0;
  } catch (error) {
    log(error.message);
    return 1;
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = runCli(process.argv.slice(2));
}
