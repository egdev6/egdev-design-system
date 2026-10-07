// Genera theme.css (Tailwind v4) a partir de tokens.css.
// Las variables de los espacios de nombres de Tailwind van a @theme (generan utilidades);
// el resto se queda en :root. La escala de espaciado de Tailwind (--spacing: 4px) ya coincide con --space-*.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const css = readFileSync(join(root, 'tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const decls = [...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]);

const themeNamespaces = ['--color-', '--font-', '--radius-', '--shadow-', '--blur-', '--ease-'];
const isTheme = (name) => themeNamespaces.some((ns) => name.startsWith(ns));

const line = ([name, value]) => `  ${name}: ${value};`;
const out = [
  '/* Generado por scripts/build-theme.mjs a partir de tokens.css. No editar a mano. */',
  '@theme {',
  '  --color-*: initial;',
  ...decls.filter(([n]) => isTheme(n)).map(line),
  '}',
  '',
  ':root {',
  ...decls.filter(([n]) => !isTheme(n)).map(line),
  '}',
  ''
].join('\n');

writeFileSync(join(root, 'theme.css'), out);
console.log(`theme.css: ${decls.filter(([n]) => isTheme(n)).length} en @theme, ${decls.filter(([n]) => !isTheme(n)).length} en :root`);
