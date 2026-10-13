// Read-only helpers to validate the manual token source (src/theme.css) and its
// compiled artifact (dist/tokens.css). This module carries no token values: the
// single source of truth is src/theme.css and the baseline fixture is test-only.

const COMMENT = /\/\*[\s\S]*?\*\//g;
const DECLARATION = /(--[\w-]+)\s*:\s*([^;]+);/g;
const VAR_REFERENCE = /var\(\s*(--[\w-]+)/g;
// A fallback can intentionally refer to a variable defined by a local consumer.
// Required nested references inside that fallback are still checked separately.
const REQUIRED_REFERENCE = /var\(\s*(--[\w-]+)\s*\)/g;

export function extractDeclarations(css) {
  const clean = css.replace(COMMENT, '');
  return [...clean.matchAll(DECLARATION)].map(([, name, value]) => ({ name, value: value.trim() }));
}

export function toDeclarationMap(css) {
  return new Map(extractDeclarations(css).map(({ name, value }) => [name, value]));
}

export function findDuplicates(declarations) {
  const counts = new Map();
  for (const { name } of declarations) {
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts].filter(([, count]) => count > 1).map(([name]) => name);
}

export function findUnresolvedAliases(declarations) {
  const defined = new Set(declarations.map(({ name }) => name));
  const unresolved = new Set();
  for (const { name, value } of declarations) {
    for (const [, target] of value.matchAll(REQUIRED_REFERENCE)) {
      if (!defined.has(target)) {
        unresolved.add(`${name} -> ${target}`);
      }
    }
  }
  return [...unresolved];
}

export function findAliasCycles(declarations) {
  const edges = new Map();
  for (const { name, value } of declarations) {
    edges.set(
      name,
      [...value.matchAll(VAR_REFERENCE)].map(([, target]) => target)
    );
  }
  const visiting = new Set();
  const settled = new Set();
  const cycles = new Set();
  const walk = (name, path) => {
    if (settled.has(name)) {
      return;
    }
    if (visiting.has(name)) {
      const start = path.indexOf(name);
      cycles.add([...path.slice(start), name].join(' -> '));
      return;
    }
    visiting.add(name);
    for (const target of edges.get(name) ?? []) {
      if (edges.has(target)) {
        walk(target, [...path, target]);
      }
    }
    visiting.delete(name);
    settled.add(name);
  };
  for (const name of edges.keys()) {
    walk(name, [name]);
  }
  return [...cycles];
}

export function compareParity(actualCss, baselineCss) {
  const actual = toDeclarationMap(actualCss);
  const expected = toDeclarationMap(baselineCss);
  const missing = [...expected.keys()].filter((name) => !actual.has(name));
  const extra = [...actual.keys()].filter((name) => !expected.has(name));
  const changed = [...expected.entries()]
    .filter(([name, value]) => actual.has(name) && actual.get(name) !== value)
    .map(([name, value]) => `${name}: ${value} -> ${actual.get(name)}`);
  return { ok: missing.length === 0 && extra.length === 0 && changed.length === 0, missing, extra, changed };
}
