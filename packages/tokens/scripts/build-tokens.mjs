// Genera tokens.css a partir de tokens.json (la fuente que se exporta del artefacto EGDEV Foundation).
// - Cada familia con `tokens` produce variables `--<nombre>`.
// - Los alias `{otro-token}` pasan a `var(--otro-token)`.
// - Los colores con temas usan el primero (el sistema solo tiene tema oscuro).
// - `type.families` produce `--font-<familia>`.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const source = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));

const resolve = (value) => {
  const raw = typeof value === 'object' && value !== null ? Object.values(value)[0] : value;
  return String(raw).replace(/\{([A-Za-z0-9_.-]+)\}/g, (_, name) => `var(--${name})`);
};

const lines = [
  `/* EGDEV Foundation · tokens.css — generado por scripts/build-tokens.mjs desde tokens.json (v${source.version}). No editar a mano. */`,
  ':root{'
];
let count = 0;

for (const [family, value] of Object.entries(source)) {
  if (family === 'type') {
    lines.push('', '  /* type */');
    for (const [name, stack] of Object.entries(value.families ?? {})) {
      lines.push(`  --font-${name}:${stack};`);
      count++;
    }
    continue;
  }
  if (!value || typeof value !== 'object' || !Array.isArray(value.tokens)) continue;
  lines.push('', `  /* ${family} */`);
  for (const token of value.tokens) {
    lines.push(`  --${token.name}:${resolve(token.value)};`);
    count++;
  }
}

lines.push('}', '');
writeFileSync(join(root, 'tokens.css'), lines.join('\n'));
console.log(`tokens.css: ${count} variables`);
