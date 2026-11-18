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
