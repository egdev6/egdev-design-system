// Textual `pnpm-workspace.yaml` edits (spec §6.4): comments and layout survive. A layout the editor
// cannot place safely (flow mappings, anchors, aliases, merge keys) is refused with the snippet to add.

/** @typedef {import('./manifest.mjs').Action} Action */
/** @typedef {import('./manifest.mjs').Conflict} Conflict */
/** @typedef {{ name: string, spec: string }} WorkspaceEntry */
/**
 * @typedef {{ text: string, actions: Action[], conflicts: Conflict[], error?: undefined }
 *   | { text: null, actions: Action[], conflicts: Conflict[], error: string }} WorkspacePlan
 */

export const WORKSPACE_FILE = 'pnpm-workspace.yaml';
const STRICT = 'strictPeerDependencies';

/** @param {string} value */
const quote = (value) => `'${value.replaceAll("'", "''")}'`;

/** @param {string} line */
const indentOf = (line) => line.length - line.trimStart().length;

/** @param {string} line */
const isBlankOrComment = (line) => line.trim() === '' || line.trimStart().startsWith('#');

/**
 * Splits `value # comment` without a regex; a `#` only starts a comment after whitespace.
 * @param {string} rest
 */
function splitComment(rest) {
  for (let index = 0; index < rest.length; index++) {
    if (rest[index] === '#' && (index === 0 || rest[index - 1] === ' ' || rest[index - 1] === '\t')) {
      return { value: rest.slice(0, index).trim(), comment: rest.slice(index).trimEnd() };
    }
  }
  return { value: rest.trim(), comment: '' };
}

/**
 * The key and the raw rest of a mapping line, or null.
 * @param {string} line
 * @returns {{ key: string, rest: string } | null}
 */
function mappingLine(line) {
  const trimmed = line.trim();
  const mark = trimmed[0];
  if (mark === "'" || mark === '"') {
    const end = trimmed.indexOf(mark, 1);
    return end > 0 && trimmed[end + 1] === ':' ? { key: trimmed.slice(1, end), rest: trimmed.slice(end + 2) } : null;
  }
  const colon = trimmed.indexOf(':');
  return colon > 0 ? { key: trimmed.slice(0, colon).trimEnd(), rest: trimmed.slice(colon + 1) } : null;
}

/** @param {string} value */
function unquote(value) {
  const mark = value[0];
  return (mark === "'" || mark === '"') && value.endsWith(mark) && value.length > 1 ? value.slice(1, -1) : value;
}

/**
 * Appends a block after one blank line, whatever the file's current ending.
 * @param {string[]} lines
 * @param {string} eol
 * @param {string[]} block
 */
function append(lines, eol, block) {
  const joined = lines.join(eol);
  const separator = joined === '' || joined.endsWith(`${eol}${eol}`) ? '' : joined.endsWith(eol) ? eol : `${eol}${eol}`;
  return `${joined}${separator}${block.join(eol)}${eol}`.split(eol);
}

/** @param {string} value */
const isUnsafeValue = (value) => /^[&*{[|>!]/.test(value);

/**
 * The line range of the top-level `overrides:` block: `start` is its key line, `end` the first line
 * after its body; null when the file has none.
 * @param {readonly string[]} lines
 */
function overridesBlock(lines) {
  const start = lines.findIndex((line) => indentOf(line) === 0 && mappingLine(line)?.key === 'overrides');
  if (start === -1) {
    return null;
  }
  let end = start + 1;
  while (end < lines.length && (isBlankOrComment(lines[end] ?? '') || indentOf(lines[end] ?? '') > 0)) {
    end++;
  }
  return { start, end };
}

/**
 * Rewrites the values of `@egdev/*` entries in the `overrides:` block in place, for upgrade
 * (spec §7.7): `respec` maps a value to its replacement, or null to keep it. Quotes, indent and
 * trailing comments survive; nothing else changes.
 * @param {string} text
 * @param {(spec: string) => string | null} respec
 * @returns {{ text: string, actions: Action[] }}
 */
export function rewriteWorkspace(text, respec) {
  /** @type {Action[]} */
  const actions = [];
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(eol);
  const block = overridesBlock(lines);
  for (let index = (block?.start ?? 0) + 1; block && index < block.end; index++) {
    const line = lines[index] ?? '';
    const parsed = isBlankOrComment(line) ? null : mappingLine(line);
    if (!parsed?.key.startsWith('@egdev/')) {
      continue;
    }
    const raw = splitComment(parsed.rest).value;
    const next = raw === '' ? null : respec(unquote(raw));
    if (next === null) {
      continue;
    }
    const mark = raw[0] === "'" || raw[0] === '"' ? raw[0] : '';
    const at = line.trimEnd().length - parsed.rest.length + parsed.rest.indexOf(raw);
    lines[index] = `${line.slice(0, at)}${mark}${next}${mark}${line.slice(at + raw.length)}`;
    actions.push({ verb: 'edit', path: WORKSPACE_FILE, detail: `overrides.${parsed.key} = ${next}` });
  }
  return { text: lines.join(eol), actions };
}

/**
 * Plans the `overrides:` entries and `strictPeerDependencies` of `pnpm-workspace.yaml`.
 * `text` is null when the file does not exist; the plan then creates it. `strict` false leaves
 * `strictPeerDependencies` alone (upgrade adds only missing overrides).
 * @param {string | null} text
 * @param {readonly WorkspaceEntry[]} entries
 * @param {boolean} force
 * @param {boolean} [strict]
 * @returns {WorkspacePlan}
 */
export function planWorkspace(text, entries, force, strict = true) {
  /** @type {Action[]} */
  const actions = [];
  /** @type {Conflict[]} */
  const conflicts = [];
  const block = (indent = '  ') => entries.map(({ name, spec }) => `${indent}${quote(name)}: ${quote(spec)}`);
  if (text === null) {
    if (!strict) {
      actions.push({ verb: 'create', path: WORKSPACE_FILE, detail: 'overrides' });
      return { text: ['overrides:', ...block(), ''].join('\n'), actions, conflicts };
    }
    actions.push({ verb: 'create', path: WORKSPACE_FILE, detail: `overrides, ${STRICT}` });
    return { text: ['overrides:', ...block(), '', `${STRICT}: true`, ''].join('\n'), actions, conflicts };
  }
  /** @param {string} reason */
  const refuse = (reason) => ({
    text: null,
    actions,
    conflicts,
    error: `Cannot edit ${WORKSPACE_FILE} safely: ${reason}; add by hand: overrides: ${block('').join(', ')}`
  });
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  let lines = text.split(eol);
  const found = overridesBlock(lines);
  const start = found?.start ?? -1;
  if (!found) {
    lines = append(lines, eol, ['overrides:', ...block()]);
    for (const { name, spec } of entries) {
      actions.push({ verb: 'edit', path: WORKSPACE_FILE, detail: `overrides.${name} = ${spec}` });
    }
  } else {
    const head = mappingLine(lines[start] ?? '');
    if (head && splitComment(head.rest).value !== '') {
      return refuse('overrides is not a block mapping');
    }
    const body = lines.slice(start + 1, found.end).map((line, offset) => ({ line, index: start + 1 + offset }));
    const filled = body.filter(({ line }) => !isBlankOrComment(line));
    const indent = ' '.repeat(filled[0] ? indentOf(filled[0].line) : 2);
    /** @type {Map<string, { index: number, value: string, comment: string }>} */
    const existing = new Map();
    for (const { line, index } of filled) {
      const parsed = mappingLine(line);
      const { value, comment } = splitComment(parsed?.rest ?? '');
      if (!parsed || parsed.key === '<<' || isUnsafeValue(value)) {
        return refuse('overrides uses anchors, aliases or flow values');
      }
      if (indentOf(line) === indent.length) {
        existing.set(parsed.key, { index, value: unquote(value), comment });
      }
    }
    /** @type {string[]} */
    const missing = [];
    for (const { name, spec } of entries) {
      const found = existing.get(name);
      const detail = `overrides.${name} = ${spec}`;
      if (!found) {
        missing.push(`${indent}${quote(name)}: ${quote(spec)}`);
        actions.push({ verb: 'edit', path: WORKSPACE_FILE, detail });
      } else if (found.value === spec) {
        actions.push({ verb: 'keep', path: WORKSPACE_FILE, detail });
      } else {
        const current = JSON.stringify(found.value);
        conflicts.push({ file: WORKSPACE_FILE, key: `overrides.${name}`, current, wanted: JSON.stringify(spec) });
        if (force) {
          const comment = found.comment ? ` ${found.comment}` : '';
          lines[found.index] = `${indent}${quote(name)}: ${quote(spec)}${comment}`;
          actions.push({ verb: 'edit', path: WORKSPACE_FILE, detail: `${detail} (replaces ${current})` });
        }
      }
    }
    const last = filled.at(-1)?.index ?? start;
    lines.splice(last + 1, 0, ...missing);
  }
  const current = lines.find((line) => indentOf(line) === 0 && mappingLine(line)?.key === STRICT);
  // Without `strict` (upgrade), strictPeerDependencies stays as the app has it.
  if (strict && current) {
    const value = splitComment(mappingLine(current)?.rest ?? '').value;
    actions.push({ verb: 'keep', path: WORKSPACE_FILE, detail: `${STRICT} = ${value}` });
  } else if (strict) {
    lines = append(lines, eol, [`${STRICT}: true`]);
    actions.push({ verb: 'edit', path: WORKSPACE_FILE, detail: `${STRICT} = true` });
  }
  return { text: lines.join(eol), actions, conflicts };
}
