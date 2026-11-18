// CSS entry detection and import reading (spec §5.4, §6.5). Text only: nothing is parsed as code.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize, relative, sep } from 'node:path';

/**
 * @typedef {{
 *   file: string | null,
 *   cssImports: string[],
 *   module: string | null,
 *   moduleImports: string[],
 *   error?: string
 * }} CssEntry
 */

/** @param {string} text */
const stripCssComments = (text) => text.replace(/\/\*[\s\S]*?(?:\*\/|$)/g, '');

/**
 * `@import` targets in source order, in either quote style, with or without `url()`.
 * @param {string} text
 */
export function cssImports(text) {
  return [...stripCssComments(text).matchAll(/@import\s+(?:url\(\s*)?(['"])([^'"]+)\1/g)].map(
    (match) => match[2] ?? ''
  );
}

/**
 * Static import specifiers of a JS or TS module, in source order.
 * @param {string} text
 */
export function moduleImports(text) {
  const code = text.replace(/\/\*[\s\S]*?(?:\*\/|$)/g, '').replace(/(^|[^:'"`])\/\/[^\n]*/g, '$1');
  return [...code.matchAll(/(?:^|[;\s])import\s*(?:[\w*{}\s,$]+\s+from\s*)?(['"])([^'"]+)\1/g)].map(
    (match) => match[2] ?? ''
  );
}

/**
 * @param {string} path
 * @returns {string | null}
 */
const readIfFile = (path) => {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
};

/**
 * @param {string} project
 * @param {string} path
 */
const toRelative = (project, path) => relative(project, path).split(sep).join('/');

/**
 * Finds where the DS imports live: `globals.css` for Next.js; for Vite, the `index.html` entry
 * module plus the first local `.css` file it imports.
 * @param {string} project
 * @param {'next' | 'vite'} framework
 * @returns {CssEntry}
 */
export function findCssEntry(project, framework) {
  /** @type {CssEntry} */
  const entry = { file: null, cssImports: [], module: null, moduleImports: [] };
  if (framework === 'next') {
    for (const candidate of ['src/app/globals.css', 'app/globals.css']) {
      const text = readIfFile(join(project, candidate));
      if (text !== null) {
        return { ...entry, file: candidate, cssImports: cssImports(text) };
      }
    }
    return { ...entry, error: 'No CSS entry: expected src/app/globals.css or app/globals.css.' };
  }
  const html = readIfFile(join(project, 'index.html'));
  if (html === null) {
    return { ...entry, error: 'No CSS entry: index.html not found.' };
  }
  const script = [...html.matchAll(/<script\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => /\btype\s*=\s*["']module["']/i.test(tag));
  const source = script?.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
  if (!source) {
    return { ...entry, error: 'No CSS entry: index.html has no <script type="module" src>.' };
  }
  const modulePath = normalize(join(project, source.replace(/^\//, '')));
  const moduleText = readIfFile(modulePath);
  const module = toRelative(project, modulePath);
  if (moduleText === null || module.startsWith('..')) {
    return { ...entry, error: `No CSS entry: ${module} not found.` };
  }
  const imports = moduleImports(moduleText);
  const local = imports.find((specifier) => specifier.startsWith('.') && specifier.endsWith('.css'));
  if (local) {
    const cssPath = normalize(join(dirname(modulePath), local));
    const text = existsSync(cssPath) ? readIfFile(cssPath) : null;
    if (text !== null) {
      return { file: toRelative(project, cssPath), cssImports: cssImports(text), module, moduleImports: imports };
    }
  }
  return { ...entry, module, moduleImports: imports };
}

/**
 * The DS stylesheet imports for a CSS mode and package selection, in install-guide order (spec §6.5).
 * @param {'tailwind' | 'native'} mode
 * @param {readonly string[]} packages
 */
export function designSystemImports(mode, packages) {
  return [
    ...(packages.includes('tokens')
      ? [mode === 'tailwind' ? '@egdev/tokens/theme.css' : '@egdev/tokens/tokens.css']
      : []),
    ...(packages.includes('ui') ? ['@egdev/ui/styles.css'] : []),
    ...(packages.includes('effects') ? ['@egdev/effects/styles.css'] : [])
  ];
}

/**
 * Inserts the missing `@import` lines, never reordering or duplicating one that exists in any quote
 * style. Tailwind mode inserts after `@import "tailwindcss"`; native mode at the top, after any
 * `@charset`. Either way, after the last design system import already present.
 * @param {string} text
 * @param {string} file
 * @param {'tailwind' | 'native'} mode
 * @param {readonly string[]} wanted
 * @returns {{ text: string, added: string[], error?: undefined } | { text: null, added: string[], error: string }}
 */
export function insertCssImports(text, file, mode, wanted) {
  const present = new Set(cssImports(text));
  const missing = wanted.filter((target) => !present.has(target));
  if (missing.length === 0) {
    return { text, added: [] };
  }
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(eol);
  /** @param {string} line */
  const target = (line) => cssImports(line)[0];
  let anchor =
    mode === 'tailwind'
      ? lines.findIndex((line) => target(line) === 'tailwindcss')
      : lines.findIndex((line) => line.trimStart().startsWith('@charset'));
  if (mode === 'tailwind' && anchor === -1) {
    return { text: null, added: [], error: `${file} has no @import "tailwindcss"; add it first or pass --css native.` };
  }
  for (const [index, line] of lines.entries()) {
    const imported = target(line);
    if (index > anchor && imported && wanted.includes(imported)) {
      anchor = index;
    }
  }
  lines.splice(anchor + 1, 0, ...missing.map((line) => `@import "${line}";`));
  return { text: lines.join(eol), added: missing };
}
